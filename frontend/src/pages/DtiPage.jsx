import React, { useState } from 'react';
import { api } from '../services/api';

const SAMPLE = 'MGAGASAEEKHSRELEKKLKEDAEKDARTVKLLLLGAGESGKSTIVKQMKIIHEDGFSGEDVKQYKPVVYSNTIQSLA';

export default function DtiPage() {
  const [smiles, setSmiles] = useState('CC(=O)Oc1ccccc1C(=O)O');
  const [seq, setSeq] = useState(SAMPLE);
  const [r, setR] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try { setR(await api.predictDti(smiles, seq)); }
    finally { setLoading(false); }
  };

  const fetchUniprot = async () => {
    const acc = prompt('UniProt accession (e.g. P00533 for EGFR):');
    if (!acc) return;
    try {
      const data = await api.uniprotSequence(acc.trim());
      setSeq(data.sequence);
    } catch (e) { alert('Could not fetch sequence'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🎯 Drug-Target Interaction</h1>
          <p>Predict binding affinity between a compound and a protein target sequence.</p>
        </div>
      </div>
      <div className="panel">
        <div className="field">
          <label>Compound SMILES</label>
          <input className="mono" value={smiles} onChange={e => setSmiles(e.target.value)} />
        </div>
        <div className="field" style={{ marginTop: 12 }}>
          <label>Target Protein Sequence</label>
          <textarea className="mono" rows={4} value={seq} onChange={e => setSeq(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button className="primary" disabled={loading} onClick={run}>
            {loading ? <><span className="loader" /> Predicting…</> : 'Predict Affinity'}
          </button>
          <button className="ghost" onClick={fetchUniprot}>📥 Fetch from UniProt</button>
        </div>
      </div>
      {r && (
        <div className="grid cols-2">
          <div className="stat gradient">
            <div className="label">Binding Affinity (pKi)</div>
            <div className="value">{r.binding_affinity}</div>
            <div className="sub">higher = stronger binding</div>
          </div>
          <div className="stat">
            <div className="label">Interaction Probability</div>
            <div className="value">{(r.interaction_probability * 100).toFixed(1)}%</div>
            <div className="sub">model confidence</div>
          </div>
        </div>
      )}
    </div>
  );
}
