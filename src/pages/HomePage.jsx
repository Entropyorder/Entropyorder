import { Hero } from '../components/Hero.jsx';
import { ExpertDataValue } from '../components/ExpertDataValue.jsx';
import { Products } from '../components/Products.jsx';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function WaveDivider() {
  return (
    <div
      className="relative z-10 overflow-hidden leading-none"
      style={{ height: 72, marginTop: -1, marginBottom: -1 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
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
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
        <polygon points="0,56 1440,0 1440,56" className="fill-page-bg dark:fill-page-bg-dark" />
      </svg>
    </div>
  );
}

export function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const target = location.state?.scrollTo;
    if (!target) return;
    const tryScroll = () => {
      const el = document.getElementById(target);
      if (el) {
        const navbarH = 64;
        const y = el.getBoundingClientRect().top + window.scrollY - navbarH;
        window.scrollTo({ top: y, behavior: 'smooth' });
        // Clear scrollTo state after consumption
        navigate(location.pathname, { replace: true, state: {} });
      }
    };
    const timer = setTimeout(tryScroll, 80);
    return () => clearTimeout(timer);
  }, [location.state, location.pathname, navigate]);

  return (
    <main>
      <Hero />
      <WaveDivider />
      <ExpertDataValue />
      <DiagonalDivider />
      <Products />
      <DiagonalDivider />
    </main>
  );
}
