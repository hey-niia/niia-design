import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import CaseStudy from "./pages/CaseStudy";
import AIExperiments from "./pages/AIExperiments";
import Art from "./pages/Art";
import Taski from "./pages/Taski";
import TaskiV1 from "./pages/TaskiV1";
import Skim from "./pages/Skim";
import CatEight from "./pages/CatEight";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import NiiaChatSidebar from "./components/NiiaChatSidebar";
import SelectionAskTooltip from "./components/SelectionAskTooltip";
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
          <Route path="/ai-experiments" element={<AIExperiments />} />
          <Route path="/art" element={<Art />} />
          <Route path="/taski" element={<Taski />} />
          <Route path="/taski-v1" element={<TaskiV1 />} />
          <Route path="/skim" element={<Skim />} />
          <Route path="/08" element={<CatEight />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
        </Routes>
        <Footer />
      </div>
      <SelectionAskTooltip />
      <NiiaChatSidebar />
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
