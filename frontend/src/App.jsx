import React, { useState, useEffect } from 'react';
import { auth } from './services/auth';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import PropertyPage from './pages/PropertyPage';
import AdmetPage from './pages/AdmetPage';
import GeneratePage from './pages/GeneratePage';
import SimilarityPage from './pages/SimilarityPage';
import DtiPage from './pages/DtiPage';
import ViewerPage from './pages/ViewerPage';
import ChatbotPage from './pages/ChatbotPage';
import PubChemPage from './pages/PubChemPage';
import PubMedPage from './pages/PubMedPage';
import ChemblPage from './pages/ChemblPage';
import UniprotPage from './pages/UniprotPage';
import TrialsPage from './pages/TrialsPage';
import WorkspacePage from './pages/WorkspacePage';
import PricingPage from './pages/PricingPage';

const PAGES = {
  dashboard: Dashboard,
  properties: PropertyPage,
  admet: AdmetPage,
  generate: GeneratePage,
  similarity: SimilarityPage,
  dti: DtiPage,
  viewer: ViewerPage,
  chatbot: ChatbotPage,
  pubchem: PubChemPage,
  pubmed: PubMedPage,
  chembl: ChemblPage,
  uniprot: UniprotPage,
  trials: TrialsPage,
  workspace: WorkspacePage,
  pricing: PricingPage,
};

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    const u = auth.user();
    if (u || auth.isAuthenticated()) setUser(u || { email: 'guest', tier: 'free' });
  }, []);

  if (!user) return <AuthPage onAuth={setUser} />;

  const Page = PAGES[page] || Dashboard;

  return (
    <div className="layout">
      <Sidebar
        active={page}
        onNav={setPage}
        user={user}
        onLogout={() => { auth.logout(); setUser(null); }}
      />
      <main className="main">
        <Page />
      </main>
    </div>
  );
}
