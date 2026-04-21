import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollManager() {
  const location = useLocation();
  const isOverlay = !!location.state?.backgroundLocation;

  useEffect(() => {
    if (isOverlay) return; // overlay: preserve background scroll
    // Normal route change: scroll to top for detail pages without background
    const p = location.pathname;
    if (p.startsWith('/blog/') || p.startsWith('/datasets/')) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, isOverlay]);

  return null;
}
