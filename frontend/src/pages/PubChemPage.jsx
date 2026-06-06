import React, { useState } from 'react';
import { api } from '../services/api';

export default function PubChemPage() {
  const [q, setQ] = useState('aspirin');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const run = async () => {
    setLoading(true); setErr(null);
    try { setData(await api.pubchem(q)); }
    catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🧫 PubChem Compound Search</h1>
          <p>Live search against the NCBI PubChem REST API (over 110M compounds).</p>
        </div>
      </div>
      <div className="panel">
        <div className="input-row">
          <div className="field" style={{ flex: 3 }}>
            <label>Compound name or SMILES</label>
            <input value={q} onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()} />
          </div>
          <button className="primary" disabled={loading} onClick={run}>
            {loading ? <><span className="loader" /> Searching…</> : 'Search PubChem'}
          </button>
        </div>
        {err && <div className="error">⚠ {err}</div>}
      </div>

      {data?.found && (
        <div className="grid cols-2">
          <div className="panel">
            <h2>{data.properties?.IUPACName || 'Compound'}</h2>
            <p className="help">CID {data.cid} ·
              <a href={data.pubchem_url} target="_blank" rel="noreferrer"> View on PubChem ↗</a></p>
            <img src={data.image_url} alt="structure" className="compound-img" />
            <div style={{ marginTop: 16 }}>
              <h3>Synonyms</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {data.synonyms?.map((s, i) => (
                  <span key={i} className="badge info">{s}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="panel">
            <h2>Properties</h2>
            <table>
              <tbody>
                {Object.entries(data.properties || {}).map(([k, v]) => (
                  <tr key={k}><td>{k}</td><td>{String(v)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {data && !data.found && <p className="help">No compound found for "{q}".</p>}
    </div>
  );
}
