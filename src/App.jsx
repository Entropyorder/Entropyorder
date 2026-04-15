import { useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { Products } from './components/Products.jsx';
import { AI4SS4AI } from './components/AI4SS4AI.jsx';
import { ContactModal } from './components/ContactModal.jsx';

function App() {
  const [selectedDataset, setSelectedDataset] = useState(null);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <Products onContact={setSelectedDataset} />
        <AI4SS4AI />
      </main>
      {selectedDataset && (
        <ContactModal dataset={selectedDataset} onClose={() => setSelectedDataset(null)} />
      )}
    </div>
  );
}
export default App;
