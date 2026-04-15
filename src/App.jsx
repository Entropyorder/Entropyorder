import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <section id="products" className="min-h-screen flex items-center justify-center border-b">Products</section>
        <section id="ai4ss" className="min-h-screen flex items-center justify-center border-b">AI4SS4AI</section>
      </main>
    </div>
  );
}
export default App;
