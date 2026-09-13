#!/usr/bin/env python3
"""Export Figma nodes to PNG.

  figma-export.py <fileKey> <out_dir> <nodeId:name> [nodeId:name ...]
                  [--scale N] [--crop-top PX] [--width PX]

--crop-top trims the export to its top PX pixels (used to compare a long
scrolling screen against a device-height one at the same viewport).
--width scales the result to an exact pixel width, so a pair of images
destined for the before/after slider comes out dimensionally identical.
"""
import json, re, subprocess, sys, urllib.request

CONFIG = "/Users/illia/Library/Application Support/Claude/claude_desktop_config.json"


def token():
    for m in re.finditer(r'"FIGMA_ACCESS_TOKEN"\s*:\s*"([^"]*)"', open(CONFIG).read()):
        t = m.group(1)
        if t.startswith("figd_") and not t.startswith("figd_figd"):
            return t
    sys.exit("no usable FIGMA_ACCESS_TOKEN found")


def get(url, tok):
    req = urllib.request.Request(url, headers={"X-Figma-Token": tok})
    return json.load(urllib.request.urlopen(req, timeout=60))


def main():
    args = [a for a in sys.argv[1:]]
    scale, crop_top, width = 2, None, None
    for flag, cast in (("--scale", float), ("--crop-top", int), ("--width", int)):
        if flag in args:
            i = args.index(flag)
            val = cast(args[i + 1])
            del args[i:i + 2]
            if flag == "--scale":
                scale = val
            elif flag == "--crop-top":
                crop_top = val
            else:
                width = val

    file_key, out_dir, *specs = args
    pairs = [s.split(":", 2) for s in specs]
    ids = ",".join(f"{a}:{b}" for a, b, _ in pairs)
    tok = token()

    data = get(
        f"https://api.figma.com/v1/images/{file_key}?ids={ids}&format=png&scale={scale}", tok
    )
    if data.get("err"):
        sys.exit(f"figma error: {data['err']}")

    subprocess.run(["mkdir", "-p", out_dir], check=True)
    for a, b, name in pairs:
        url = data["images"].get(f"{a}:{b}")
        if not url:
            print(f"  !! no image returned for {a}:{b} ({name})")
            continue
        path = f"{out_dir}/{name}.png"
        urllib.request.urlretrieve(url, path)
        # Width first, then crop — cropping first makes the later resize scale
        # the cropped height too, so the output misses the target by a few px
        # and the before/after slider no longer lines up.
        if width:
            subprocess.run(["magick", path, "-resize", f"{width}x", path], check=True)
        if crop_top:
            subprocess.run(["magick", path, "-crop", f"x{crop_top}+0+0", "+repage", path], check=True)
        dims = subprocess.run(
            ["magick", "identify", "-format", "%wx%h", path], capture_output=True, text=True
        ).stdout
        print(f"  {path}  {dims}")


if __name__ == "__main__":
    main()
