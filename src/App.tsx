import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/Landing';
import ProtectPage from './pages/Protect';
import VerifyPage from './pages/Verify';
import VaultPage from './pages/Vault';
import HowItWorksPage from './pages/HowItWorks';
import { AuthProvider } from './contexts/AuthProvider';

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<ProtectPage />} />
            <Route path="verify" element={<VerifyPage />} />
            <Route path="vault" element={<VaultPage />} />
            <Route path="how-it-works" element={<HowItWorksPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
