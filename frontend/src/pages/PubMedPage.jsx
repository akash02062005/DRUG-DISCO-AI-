import React, { useState } from 'react';
import { api } from '../services/api';

export default function PubMedPage() {
  const [q, setQ] = useState('ChemBERTa drug discovery');
  const [articles, setArticles] = useState([]);
  const [abstract, setAbstract] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try { setArticles((await api.pubmed(q)).articles || []); }
    finally { setLoading(false); }
  };

  const openAbstract = async (pmid) => {
    setAbstract({ pmid, abstract: 'Loading…' });
    try { setAbstract(await api.pubmedAbstract(pmid)); }
    catch (e) { setAbstract({ pmid, abstract: 'Failed to load.' }); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>📚 PubMed Literature Search</h1>
          <p>Search 35M+ biomedical articles via NCBI E-utilities.</p>
        </div>
      </div>
      <div className="panel">
        <div className="input-row">
          <div className="field" style={{ flex: 3 }}>
            <label>Search query</label>
            <input value={q} onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()} />
          </div>
          <button className="primary" disabled={loading} onClick={search}>
            {loading ? <><span className="loader" /> Searching…</> : 'Search PubMed'}
          </button>
        </div>
      </div>

      <div className="grid cols-2">
        <div className="panel">
          <h2>Results ({articles.length})</h2>
          {articles.map(a => (
            <div className="list-item" key={a.pmid}
              onClick={() => openAbstract(a.pmid)} style={{ cursor: 'pointer' }}>
              <h4>{a.title}</h4>
              <div className="meta">
                {a.authors?.slice(0, 3).join(', ')}{a.authors?.length > 3 ? ' et al.' : ''} ·
                <em> {a.journal}</em> · {a.pub_date}
              </div>
              <a href={a.url} target="_blank" rel="noreferrer">PMID {a.pmid} ↗</a>
            </div>
          ))}
          {!articles.length && <p className="help">No results yet.</p>}
        </div>
        <div className="panel">
          <h2>Abstract</h2>
          {abstract ? (
            <div>
              <h3>{abstract.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted)' }}>
                {abstract.abstract || 'No abstract available.'}
              </p>
            </div>
          ) : <p className="help">Click an article to view its abstract.</p>}
        </div>
      </div>
    </div>
  );
}
