import React from 'react';
import { auth } from '../services/auth';

const NAV = [
  { section: 'Discovery' },
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'properties', label: 'Property Prediction', icon: '🧪' },
  { id: 'admet', label: 'ADMET Profile', icon: '💊' },
  { id: 'generate', label: 'Molecule Generation', icon: '⚗️' },
  { id: 'similarity', label: 'Similarity Search', icon: '🔍' },
  { id: 'dti', label: 'Drug-Target', icon: '🎯' },
  { id: 'viewer', label: '3D Viewer', icon: '🧬' },
  { section: 'Knowledge' },
  { id: 'chatbot', label: 'BioGPT Chatbot', icon: '💬' },
  { id: 'pubchem', label: 'PubChem', icon: '🧫' },
  { id: 'pubmed', label: 'PubMed Literature', icon: '📚' },
  { id: 'chembl', label: 'ChEMBL Bioactivity', icon: '🧠' },
  { id: 'uniprot', label: 'UniProt Targets', icon: '🧷' },
  { id: 'trials', label: 'Clinical Trials', icon: '🏥' },
  { section: 'Workspace' },
  { id: 'workspace', label: 'My Molecules', icon: '📁' },
  { id: 'pricing', label: 'Pricing', icon: '💎' },
];

export default function Sidebar({ active, onNav, user, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">⚗</div>
        <div className="name">
          DrugDisco AI
          <small>SaaS Platform v2.0</small>
        </div>
      </div>
      {NAV.map((it, i) => it.section
        ? <div key={i} className="nav-section">{it.section}</div>
        : (
          <div
            key={it.id}
            className={`nav-item ${active === it.id ? 'active' : ''}`}
            onClick={() => onNav(it.id)}
          >
            <span className="icon">{it.icon}</span>
            <span>{it.label}</span>
          </div>
        )
      )}
      {user && (
        <div className="user-card">
          <div className="email">{user.email}</div>
          <div className="tier">{user.tier} tier · {user.credits ?? 0} credits</div>
          <button onClick={onLogout}>Sign out</button>
        </div>
      )}
    </aside>
  );
}
