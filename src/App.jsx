import { useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { Products } from './components/Products.jsx';
import { ContactModal } from './components/ContactModal.jsx';

function App() {
  const [selectedDataset, setSelectedDataset] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <Products onContact={setSelectedDataset} />
        <section id="ai4ss" className="min-h-screen flex items-center justify-center border-t">AI4SS4AI</section>
      </main>
      {selectedDataset && (
        <ContactModal dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />
      )}
    </div>
  );
}
export default App;
