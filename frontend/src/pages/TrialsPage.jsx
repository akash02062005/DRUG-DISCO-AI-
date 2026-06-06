import React, { useState } from 'react';
import { api } from '../services/api';

export default function TrialsPage() {
  const [q, setQ] = useState('lung cancer EGFR');
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try { setTrials((await api.trials(q)).trials || []); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🏥 Clinical Trials</h1>
          <p>Live search of ClinicalTrials.gov v2 — 480K+ studies worldwide.</p>
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
            {loading ? <><span className="loader" /> Searching…</> : 'Search Trials'}
          </button>
        </div>
      </div>
      <div className="panel">
        <table>
          <thead>
            <tr><th>NCT ID</th><th>Title</th><th>Phase</th><th>Status</th></tr>
          </thead>
          <tbody>
            {trials.map(t => (
              <tr key={t.nct_id}>
                <td><a href={t.url} target="_blank" rel="noreferrer">{t.nct_id}</a></td>
                <td>{t.title}</td>
                <td><span className="badge purple">{t.phase || '—'}</span></td>
                <td><span className="badge info">{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!trials.length && <p className="help">No trials yet.</p>}
      </div>
    </div>
  );
}
