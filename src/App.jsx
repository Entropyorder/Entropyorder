import { useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { Products } from './components/Products.jsx';
import { ExpertDataValue } from './components/ExpertDataValue.jsx';
import { AI4SS4AI } from './components/AI4SS4AI.jsx';
import { Footer } from './components/Footer.jsx';
import { ContactModal } from './components/ContactModal.jsx';
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
          className="fill-white dark:fill-slate-900"
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
          className="fill-slate-50 dark:fill-slate-800/40"
        />
      </svg>
    </div>
  );
}

function App() {
  const [selectedDataset, setSelectedDataset] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <WaveDivider />
        <Products onContact={setSelectedDataset} />
        <DiagonalDivider />
        <ExpertDataValue />
        <DiagonalDivider />
        <AI4SS4AI />
      </main>
      <Footer />
      {selectedDataset && (
        <ContactModal dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />
      )}
    </div>
  );
}
export default App;
