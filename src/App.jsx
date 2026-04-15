import { useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { DatasetCard } from './components/DatasetCard.jsx';
import { ContactModal } from './components/ContactModal.jsx';

function App() {
  const [selected, setSelected] = useState(null);
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <section className="py-20 px-4">
          <div className="max-w-sm mx-auto">
            <DatasetCard dataset={{ name: 'Test Dataset', desc: 'A test dataset', scale: '1K', tags: ['test'] }} onContact={setSelected} />
          </div>
        </section>
        {selected && <ContactModal dataset={selected} onClose={() => setSelected(null)} />}
      </main>
    </div>
  );
}
export default App;
