import { useState, useRef } from 'react';
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { Products } from './components/Products.jsx';
import { ExpertDataValue } from './components/ExpertDataValue.jsx';
import { AI4SS4AI } from './components/AI4SS4AI.jsx';
import { Blog } from './components/Blog.jsx';
import { Footer } from './components/Footer.jsx';
import { ContactModal } from './components/ContactModal.jsx';
import { DatasetDetailModal } from './components/DatasetDetailModal.jsx';
import { duration, ease } from './animations/tokens.js';
import './App.css';

function WaveDivider() {
  return (
    <div
      className="relative z-10 overflow-hidden leading-none"
      style={{ height: 72, marginTop: -1, marginBottom: -1 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M0,36 C180,72 360,0 540,36 C720,72 900,0 1080,36 C1260,72 1380,18 1440,36 L1440,72 L0,72 Z"
          className="fill-page-bg dark:fill-page-bg-dark"
        />
      </svg>
    </div>
  );
}

function DiagonalDivider() {
  return (
    <div
      className="relative z-10 overflow-hidden leading-none"
      style={{ height: 56, marginTop: -1, marginBottom: -1 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        <polygon
          points="0,56 1440,0 1440,56"
          className="fill-page-bg dark:fill-page-bg-dark"
        />
      </svg>
    </div>
  );
}

const TAB_ORDER = ['home', 'blog', 'ai4ss'];

const pageVariants = {
  enter: (direction) => ({
    opacity: 0,
    y: 12,
    filter: 'blur(4px)',
  }),
  center: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  },
  exit: (direction) => ({
    opacity: 0,
    y: -8,
    filter: 'blur(4px)',
  }),
};

function App() {
  const prefersReducedMotion = useReducedMotion();
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const mainRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const direction = TAB_ORDER.indexOf(activeTab);

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
    <div className="min-h-screen bg-page-bg dark:bg-page-bg-dark text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        sectionIds={['home', 'products', 'expert-data']}
      />

      {activeTab === 'home' && (
        <main ref={mainRef}>
          <Hero />
          <WaveDivider />
          <ExpertDataValue />
          <DiagonalDivider />
          <Products onViewDetail={setSelectedDetail} />
          <DiagonalDivider />
        </main>
      )}

      {activeTab !== 'home' && (
        <div className="min-h-screen overflow-hidden relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: 'tween', ease: ease.default, duration: duration.page * 0.7 },
                opacity: { duration: duration.page * 0.5 },
                filter: { duration: duration.page * 0.5 },
              }}
              className="min-h-screen"
            >
              {activeTab === 'blog' && <Blog />}
              {activeTab === 'ai4ss' && <AI4SS4AI />}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <Footer />
      {selectedDataset && (
        <ContactModal dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />
      )}
      {selectedDetail && (
        <DatasetDetailModal
          dataset={selectedDetail}
          onClose={() => setSelectedDetail(null)}
          onContactSample={(ds) => {
            setSelectedDetail(null);
            setSelectedDataset(ds);
          }}
        />
      )}
    </div>
    </MotionConfig>
  );
}
export default App;