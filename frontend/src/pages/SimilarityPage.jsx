import React, { useState } from 'react';
import { api } from '../services/api';

export default function SimilarityPage() {
  const [smiles, setSmiles] = useState('CC(=O)Oc1ccccc1C(=O)O');
  const [k, setK] = useState(8);
  const [hits, setHits] = useState([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try { setHits((await api.similarity(smiles, Number(k))).hits || []); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🔍 Similarity Search</h1>
          <p>Find structurally similar molecules using ChemBERTa embeddings + cosine similarity.</p>
        </div>
      </div>
      <div className="panel">
        <div className="input-row">
          <div className="field" style={{ flex: 3 }}>
            <label>Query SMILES</label>
            <input className="mono" value={smiles} onChange={e => setSmiles(e.target.value)} />
          </div>
          <div className="field"><label>Top K</label>
            <input type="number" value={k} onChange={e => setK(e.target.value)} /></div>
          <button className="primary" disabled={loading} onClick={run}>
            {loading ? <><span className="loader" /> Searching…</> : 'Search'}
          </button>
        </div>
      </div>
      <div className="grid cols-3">
        {hits.map((h, i) => (
          <div className="card" key={i}>
            <div className="smiles">{h.smiles}</div>
            <span className="badge purple">Similarity {h.similarity}</span>
            {h.properties?.molecular_weight && (
              <div style={{ marginTop: 8 }}>
                <span className="badge info">MW {h.properties.molecular_weight}</span>{' '}
                <span className="badge good">QED {h.properties.qed}</span>
              </div>
            )}
          </div>
        ))}
        {!hits.length && <p className="help">Run a search to see similar compounds.</p>}
      </div>
    </div>
  );
}
