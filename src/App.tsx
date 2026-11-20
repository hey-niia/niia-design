import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import CaseStudy from "./pages/CaseStudy";
import AIPlayground from "./pages/AIPlayground";
import Art from "./pages/Art";
import Taski from "./pages/Taski";
import TaskiV1 from "./pages/TaskiV1";
import Skim from "./pages/Skim";
// 08 is hidden while it's being reworked; restore this import and its route to bring it back.
// import CatEight from "./pages/CatEight";
import Skin from "./pages/Skin";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import NiiaChatSidebar from "./components/NiiaChatSidebar";
import SelectionAskTooltip from "./components/SelectionAskTooltip";
import ImageContextMenu from "./components/ImageContextMenu";
import TweakPanel from "./components/TweakPanel";
import { NiiaChatProvider } from "./context/NiiaChatContext";

function AppContent() {
  // The AI Playground is an endless canvas that fills the window, so it has no footer.
  const { pathname } = useLocation();
  const showFooter = pathname !== "/ai-playground";
  // Project pages put the footer links above their "More AI experiments" band;
  // About has its own Resume / LinkedIn / Email buttons, so the row would repeat them.
  const linksInPage = ["/skin", "/taski", "/taski-v1", "/skim", "/about"].includes(pathname);

  return (
    <>
      <div>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ai-playground" element={<AIPlayground />} />
          <Route path="/art" element={<Art />} />
          <Route path="/taski" element={<Taski />} />
          <Route path="/taski-v1" element={<TaskiV1 />} />
          <Route path="/skim" element={<Skim />} />
          {/* <Route path="/08" element={<CatEight />} /> */}
          <Route path="/skin" element={<Skin />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {showFooter && <Footer showLinks={!linksInPage} />}
      </div>
      <SelectionAskTooltip />
      <NiiaChatSidebar />
      <ImageContextMenu />
      {/* Dev-only: live button tuning. Never included in the built site. */}
      {import.meta.env.DEV && <TweakPanel />}
    </>
  );
}

export default function App() {
  return (
    <NiiaChatProvider>
      <AppContent />
    </NiiaChatProvider>
  );
}
