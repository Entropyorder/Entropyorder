import { Navbar } from './components/Navbar.jsx';
import { ParticleCanvas } from './components/ParticleCanvas.jsx';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main className="pt-16">
        <section id="home" className="relative min-h-screen flex items-center justify-center border-b overflow-hidden">
          <ParticleCanvas />
          <div className="relative z-10 text-center">Hero Content</div>
        </section>
        <section id="products" className="min-h-screen flex items-center justify-center border-b">Products</section>
        <section id="ai4ss" className="min-h-screen flex items-center justify-center border-b">AI4SS4AI</section>
      </main>
    </div>
  );
}
export default App;
