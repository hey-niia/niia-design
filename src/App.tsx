import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
      </Routes>
    </>
  );
}
