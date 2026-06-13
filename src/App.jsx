import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Home from "./pages/home/Home";
import Services from "./pages/services/Services";
import Team from "./pages/team/Team";
import Contact from "./pages/contact/Contact";
import Book from "./pages/book/Book";
import Questions from "./pages/questions/Questions";
import BookingConfirmed from "./pages/booking-confirmed/BookingConfirmed";
import { ChatWidget } from "./components/ChatWidget";

// Curtain that sweeps over the screen on every route change
function Curtain() {
  const location = useLocation();
  const [key, setKey] = useState(0);
  const isFirst = React.useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    setKey((k) => k + 1);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      <motion.div
        key={key}
        className="fixed inset-0 z-[200] pointer-events-none"
        style={{ backgroundColor: "#0C0C0C", transformOrigin: "bottom" }}
        initial={{ scaleY: 0 }}
        animate={{
          scaleY: [0, 1, 1, 0],
          transformOrigin: ["bottom", "bottom", "top", "top"],
        }}
        transition={{
          duration: 0.8,
          times: [0, 0.35, 0.55, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        {/* Gold rule that appears mid-sweep */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scaleX: [0, 1, 1, 0] }}
          transition={{ duration: 0.8, times: [0.2, 0.4, 0.6, 0.85] }}
        >
          <div style={{ width: 60, height: 1, backgroundColor: "#C8A96E" }} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Page wrapper — fades + lifts after curtain reveals it
const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.45, ease: [0.22, 0.61, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.25, ease: [0.22, 0.61, 0.36, 1] },
  },
};

function PageWrap({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <>
      <Curtain />
      <ScrollToTop />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrap><Home /></PageWrap>} />
          <Route path="/services" element={<PageWrap><Services /></PageWrap>} />
          <Route path="/team" element={<PageWrap><Team /></PageWrap>} />
          <Route path="/contact" element={<PageWrap><Contact /></PageWrap>} />
          <Route path="/book" element={<PageWrap><Book /></PageWrap>} />
          <Route path="/questions" element={<PageWrap><Questions /></PageWrap>} />
          <Route path="/booking-confirmed" element={<PageWrap><BookingConfirmed /></PageWrap>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <ChatWidget />
    </BrowserRouter>
  );
}
