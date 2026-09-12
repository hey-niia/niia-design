import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import CaseStudy from "./pages/CaseStudy";
import AIExperiments from "./pages/AIExperiments";
import Taski from "./pages/Taski";
import Skim from "./pages/Skim";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/ai-experiments" element={<AIExperiments />} />
        <Route path="/taski" element={<Taski />} />
        <Route path="/skim" element={<Skim />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
      </Routes>
      <Footer />
    </>
  );
}
