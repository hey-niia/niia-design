#!/usr/bin/env python3
"""Rebuild the ios-app case-study screenshots from Figma.

Exports each frame at a high enough scale to stay sharp on a 2x display,
blurs every place the client's product name appears, and writes WebP.

Redaction regions are fractions of the frame box, taken from the live Figma
text-node positions (see the `figma_execute` scan in the session notes), so
they stay correct if a frame is re-exported at a different scale.

    python3 scripts/build-case-assets.py [name ...]
"""
import json, os, re, subprocess, sys, urllib.request

CONFIG = os.path.expanduser(
    "~/Library/Application Support/Claude/claude_desktop_config.json"
)
OUT = "public/projects/ios-app"
OLD = "KCR6CITRUDpaBFFnqgYbWG"   # 📱 🟢 iOS (Copy) — pre-redesign
NEW = "4cBNswIEFN0tLHhntFYcry"   # Matter 2026 — Production UI

# name: (fileKey, nodeId, scale, [redactions], clip_to_frame_width)
# Redaction = (xF, yF, wF, hF, _). Fractions of the frame box.
#
# Blur strength is derived from each region's pixel height rather than fixed,
# because these are exported at 3x: a sigma tuned at one scale leaves text
# readable at another. Unreadable is the requirement; keeping the texture of
# text (so the screen still reads as dense) is the nice-to-have.
def sigma_for(region_h):
    return max(10, min(34, region_h / 3))

NAME = PARA = 0  # retained so the tuples stay self-documenting
# The annotated Problem exhibit and the toggle's "before" are the same screen;
# the markers are HTML, so one file serves both.
ASSETS = {
    "before-today": (OLD, "12568:31610", 3, [
        (0.3692, 0.2587, 0.2564, 0.0044, NAME),
    ], False),
    "before-you": (OLD, "13479:16492", 3, [
        (0.0615, 0.0324, 0.8769, 0.0147, NAME),   # "Your Matter Score" title
        (0.0615, 0.2921, 0.7590, 0.0309, PARA),   # explainer paragraph
        (0.0615, 0.5754, 0.8769, 0.0412, PARA),   # explainer paragraph
        (0.0615, 0.6303, 0.3949, 0.0079, NAME),   # "Total Matter Score"
        (0.0615, 0.7423, 0.8769, 0.0206, PARA),   # explainer paragraph
        (0.1153, 0.7747, 0.2667, 0.0079, NAME),   # "Matter Score" label
    ], False),
    "after-coaching": (NEW, "3161:12078", 3, [], False),
    "after-you": (NEW, "3318:2396", 3, [
        (0.1145, 0.5874, 0.2621, 0.0090, NAME),   # "Matter score" card label
    ], True),
    "solution-drawer": (NEW, "5421:25140", 3, [
        (0.0814, 0.0798, 0.2431, 0.0469, NAME),   # wordmark logo
    ], False),
    "final-level": (NEW, "1:6948", 3, [
        (0.1145, 0.9039, 0.7634, 0.0196, PARA),   # body copy naming the client
    ], False),
    "solution-card-iterations": (NEW, "3809:13845", 2, [], False),
}
# Padding around each region so a blur fully covers its glyphs.
PAD_X, PAD_Y = 0.010, 0.004


def token():
    for m in re.finditer(r'"FIGMA_ACCESS_TOKEN"\s*:\s*"([^"]*)"', open(CONFIG).read()):
        t = m.group(1)
        if t.startswith("figd_") and not t.startswith("figd_figd"):
            return t
    sys.exit("no usable FIGMA_ACCESS_TOKEN in the Claude desktop config")


def dims(path):
    out = subprocess.run(
        ["magick", "identify", "-format", "%w %h", path], capture_output=True, text=True
    ).stdout.split()
    return int(out[0]), int(out[1])


def build(name, tok):
    file_key, node, scale, redactions, clip = ASSETS[name]
    url = (f"https://api.figma.com/v1/images/{file_key}"
           f"?ids={node}&format=png&scale={scale}")
    req = urllib.request.Request(url, headers={"X-Figma-Token": tok})
    data = json.load(urllib.request.urlopen(req, timeout=90))
    if data.get("err"):
        sys.exit(f"{name}: figma error {data['err']}")
    src = data["images"].get(node)
    if not src:
        sys.exit(f"{name}: figma returned no image for {node}")

    tmp = f"/tmp/{name}.png"
    urllib.request.urlretrieve(src, tmp)
    w, h = dims(tmp)

    # Some frames don't clip their contents, so the render includes whatever
    # overflows on the canvas. Trim back to the frame's own width.
    if clip:
        frame_w = 393 * scale
        if w > frame_w:
            subprocess.run(
                ["magick", tmp, "-crop", f"{frame_w}x{h}+0+0", "+repage", tmp], check=True
            )
            w, h = dims(tmp)

    cmd = ["magick", tmp]
    for xf, yf, wf, hf, _ in redactions:
        rx = max(0, int((xf - PAD_X) * w))
        ry = max(0, int((yf - PAD_Y) * h))
        rw = min(w - rx, int((wf + PAD_X * 2) * w))
        rh = min(h - ry, int((hf + PAD_Y * 2) * h))
        cmd += ["-region", f"{rw}x{rh}+{rx}+{ry}",
                "-blur", f"0x{sigma_for(hf * h):.1f}", "+region"]
    dest = f"{OUT}/{name}.webp"
    cmd += ["-quality", "92", dest]
    subprocess.run(cmd, check=True)

    fw, fh = dims(dest)
    kb = os.path.getsize(dest) // 1024
    print(f"  {dest}  {fw}x{fh}  {kb}KB  ({len(redactions)} redacted)")


def main():
    names = sys.argv[1:] or list(ASSETS)
    tok = token()
    os.makedirs(OUT, exist_ok=True)
    for n in names:
        if n not in ASSETS:
            sys.exit(f"unknown asset {n}; known: {', '.join(ASSETS)}")
        build(n, tok)


if __name__ == "__main__":
    main()
