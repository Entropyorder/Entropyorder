import { Navbar } from './components/Navbar.jsx';
import { Hero } from './components/Hero.jsx';
import { ExpertArtifact } from './components/Artifacts/ExpertArtifact.jsx';
import { MultimodalArtifact } from './components/Artifacts/MultimodalArtifact.jsx';
import { AgentArtifact } from './components/Artifacts/AgentArtifact.jsx';

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-50 transition-colors">
      <Navbar />
      <main>
        <Hero />
        <section className="py-20 px-4 grid gap-12">
          <div className="h-64"><ExpertArtifact /></div>
          <div className="h-64"><MultimodalArtifact /></div>
          <div className="h-64"><AgentArtifact /></div>
        </section>
      </main>
    </div>
  );
}
export default App;
