import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import CaseStudy from "./pages/CaseStudy";
import AIPlayground from "./pages/AIPlayground";
import Art from "./pages/Art";
import Taski from "./pages/Taski";
import TaskiV1 from "./pages/TaskiV1";
import Skim from "./pages/Skim";
import CatEight from "./pages/CatEight";
import Skin from "./pages/Skin";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import NiiaChatSidebar from "./components/NiiaChatSidebar";
import SelectionAskTooltip from "./components/SelectionAskTooltip";
import ImageContextMenu from "./components/ImageContextMenu";
import { NiiaChatProvider } from "./context/NiiaChatContext";
import { useNiiaChat } from "./context/useNiiaChat";

function AppContent() {
  const { isOpen } = useNiiaChat();

  return (
    <>
      <div
        className={`transition-[margin-right] duration-300 ease-out ${isOpen ? "sm:mr-[380px]" : ""}`}
      >
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ai-playground" element={<AIPlayground />} />
          <Route path="/art" element={<Art />} />
          <Route path="/taski" element={<Taski />} />
          <Route path="/taski-v1" element={<TaskiV1 />} />
          <Route path="/skim" element={<Skim />} />
          <Route path="/08" element={<CatEight />} />
          <Route path="/skin" element={<Skin />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
      <SelectionAskTooltip />
      <NiiaChatSidebar />
      <ImageContextMenu />
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
