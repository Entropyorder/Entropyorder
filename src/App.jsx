import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import { ContactModal } from './components/ContactModal.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { BlogListPage } from './pages/BlogListPage.jsx';
import { BlogDetailPage } from './pages/BlogDetailPage.jsx';
import { DatasetDetailPage } from './pages/DatasetDetailPage.jsx';
import { AI4SS4AIPage } from './pages/AI4SS4AIPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import './App.css';

/**
 * Decide the "background" location for an overlay route.
 * - When a user clicked from the list, state.backgroundLocation is already set.
 * - When they landed directly on /blog/:slug (shared link / refresh),
 *   synthesize a background: blog list for /blog/*, home for /datasets/*.
 */
function resolveBackgroundLocation(location) {
  const recorded = location.state?.backgroundLocation;
  if (recorded) return recorded;

  const p = location.pathname;
  if (p.startsWith('/blog/')) {
    return { pathname: '/blog', search: '', hash: '', state: null, key: 'bg-blog' };
  }
  if (p.startsWith('/datasets/')) {
    return { pathname: '/', search: '', hash: '', state: { scrollTo: 'products' }, key: 'bg-products' };
  }
  return null;
}

function isOverlayPath(pathname) {
  return pathname.startsWith('/blog/') || pathname.startsWith('/datasets/');
}

function App() {
  const prefersReducedMotion = useReducedMotion();
  const location = useLocation();
  const [contactDataset, setContactDataset] = useState(null);

  const overlayActive = isOverlayPath(location.pathname);
  const backgroundLocation = overlayActive ? resolveBackgroundLocation(location) : null;
  const routeLocation = backgroundLocation || location;

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      <div className="min-h-screen bg-page-bg dark:bg-page-bg-dark text-slate-800 dark:text-slate-50 transition-colors">
        <Navbar sectionIds={['home', 'products', 'expert-data']} />

        {/* Background routes — always rendered (using bg location during overlay) */}
        <div
          aria-hidden={overlayActive ? 'true' : undefined}
          style={{
            // Subtle dim while overlay is open; no full-black backdrop
            transition: 'filter 250ms ease-out',
            filter: overlayActive ? 'brightness(0.75) saturate(0.9)' : 'none',
            // prevent background from stealing focus while overlay is open
            pointerEvents: overlayActive ? 'none' : 'auto',
          }}
        >
          <Routes location={routeLocation}>
            <Route path="/" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
            <Route path="/blog" element={<ErrorBoundary><BlogListPage /></ErrorBoundary>} />
            <Route path="/ai4ss" element={<ErrorBoundary><AI4SS4AIPage /></ErrorBoundary>} />
            {/* A safety net for unrecognized direct routes (e.g. random /foo) */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <Footer />
        </div>

        {/* Overlay routes — rendered on top, animated mount/unmount */}
        <AnimatePresence mode="wait">
          {overlayActive && (
            <Routes location={location} key={location.pathname}>
              <Route
                path="/blog/:slug"
                element={<ErrorBoundary><BlogDetailPage /></ErrorBoundary>}
              />
              <Route
                path="/datasets/:id"
                element={<ErrorBoundary><DatasetDetailPage onContactSample={setContactDataset} /></ErrorBoundary>}
              />
            </Routes>
          )}
        </AnimatePresence>

        {contactDataset && (
          <ContactModal dataset={contactDataset} onClose={() => setContactDataset(null)} />
        )}
      </div>
    </MotionConfig>
  );
}

export default App;
