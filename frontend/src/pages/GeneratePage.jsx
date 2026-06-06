import React, { useState } from 'react';
import { api } from '../services/api';

export default function GeneratePage() {
  const [seed, setSeed] = useState('CC(=O)Oc1ccccc1C(=O)O');
  const [num, setNum] = useState(8);
  const [logp, setLogp] = useState('');
  const [mw, setMw] = useState('');
  const [mols, setMols] = useState([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const payload = { num_molecules: Number(num), seed_smiles: seed };
      if (logp) payload.target_logp = Number(logp);
      if (mw) payload.target_mw = Number(mw);
      const r = await api.generate(payload);
      setMols(r.molecules || []);
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>⚗️ Molecule Generation</h1>
          <p>BRICS fragment-based generator seeded from a ChEMBL/ZINC drug-like library.</p>
        </div>
      </div>
      <div className="panel">
        <div className="input-row">
          <div className="field" style={{ flex: 2 }}>
            <label>Seed SMILES</label>
            <input className="mono" value={seed} onChange={e => setSeed(e.target.value)} />
          </div>
          <div className="field"><label>Count</label>
            <input type="number" value={num} onChange={e => setNum(e.target.value)} /></div>
          <div className="field"><label>Target logP</label>
            <input type="number" placeholder="optional" value={logp} onChange={e => setLogp(e.target.value)} /></div>
          <div className="field"><label>Target MW</label>
            <input type="number" placeholder="optional" value={mw} onChange={e => setMw(e.target.value)} /></div>
          <button className="primary" disabled={loading} onClick={run}>
            {loading ? <><span className="loader" /> Generating…</> : 'Generate'}
          </button>
        </div>
      </div>
      <div className="grid cols-3">
        {mols.map((m, i) => (
          <div className="card" key={i}>
            <div className="smiles">{m.smiles}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              <span className="badge purple">MW {m.properties?.molecular_weight}</span>
              <span className="badge info">logP {m.properties?.logp}</span>
              <span className="badge good">QED {m.properties?.qed}</span>
            </div>
            {m.properties?.lipinski_pass && <span className="badge good">Ro5 ✓</span>}
            <button className="ghost" style={{ marginTop: 10, width: '100%' }}
              onClick={() => api.saveMolecule({ smiles: m.smiles, properties: m.properties })}>
              💾 Save
            </button>
          </div>
        ))}
        {!mols.length && <p className="help">No molecules yet — generate to start.</p>}
      </div>
    </div>
  );
}
