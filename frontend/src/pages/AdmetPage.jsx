import React, { useState } from 'react';
import { api } from '../services/api';
import AdmetRadar from '../components/AdmetRadar';

export default function AdmetPage() {
  const [smiles, setSmiles] = useState('CC(=O)Nc1ccc(O)cc1');
  const [admet, setAdmet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const run = async () => {
    setLoading(true); setErr(null);
    try { setAdmet(await api.predictAdmet(smiles)); }
    catch (e) { setErr(e?.response?.data?.detail || e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>💊 ADMET Profile</h1>
          <p>Absorption, Distribution, Metabolism, Excretion, Toxicity prediction.</p>
        </div>
      </div>

      <div className="panel">
        <div className="input-row">
          <div className="field" style={{ flex: 3 }}>
            <label>SMILES</label>
            <input className="mono" value={smiles} onChange={e => setSmiles(e.target.value)} />
          </div>
          <button className="primary" disabled={loading} onClick={run}>
            {loading ? <><span className="loader" /> Analyzing…</> : 'Analyze ADMET'}
          </button>
        </div>
        {err && <div className="error">⚠ {err}</div>}
      </div>

      {admet && !admet.error && (
        <div className="grid cols-2">
          <div className="panel">
            <h2>ADMET Radar</h2>
            <AdmetRadar admet={admet} />
          </div>
          <div className="panel">
            <h2>Detailed Scores</h2>
            <pre className="code">{JSON.stringify(admet, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
