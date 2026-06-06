import React, { useState } from 'react';
import { api } from '../services/api';

export default function ChemblPage() {
  const [q, setQ] = useState('imatinib');
  const [mols, setMols] = useState([]);
  const [acts, setActs] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try { setMols((await api.chembl(q)).molecules || []); }
    finally { setLoading(false); }
  };

  const loadActs = async (id) => {
    setActs([]);
    try { setActs((await api.chemblBioactivities(id)).activities || []); }
    catch {}
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🧠 ChEMBL Bioactivity</h1>
          <p>Search the EBI ChEMBL database — 2.4M compounds, 20M bioactivities.</p>
        </div>
      </div>
      <div className="panel">
        <div className="input-row">
          <div className="field" style={{ flex: 3 }}>
            <label>Compound name</label>
            <input value={q} onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()} />
          </div>
          <button className="primary" disabled={loading} onClick={search}>
            {loading ? <><span className="loader" /> Searching…</> : 'Search ChEMBL'}
          </button>
        </div>
      </div>

      <div className="panel">
        <h2>Molecules</h2>
        <table>
          <thead>
            <tr><th>ChEMBL ID</th><th>Name</th><th>Type</th><th>Max Phase</th>
              <th>MW</th><th>logP</th><th>QED</th><th>Bioactivities</th></tr>
          </thead>
          <tbody>
            {mols.map(m => (
              <tr key={m.chembl_id}>
                <td><a href={m.url} target="_blank" rel="noreferrer">{m.chembl_id}</a></td>
                <td>{m.name}</td>
                <td>{m.molecule_type}</td>
                <td><span className="badge purple">Phase {m.max_phase ?? '—'}</span></td>
                <td>{m.mw}</td>
                <td>{m.alogp}</td>
                <td>{m.qed}</td>
                <td><button className="ghost" onClick={() => loadActs(m.chembl_id)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!mols.length && <p className="help">No results.</p>}
      </div>

      {acts.length > 0 && (
        <div className="panel">
          <h2>Bioactivities ({acts.length})</h2>
          <table>
            <thead>
              <tr><th>Target</th><th>Type</th><th>Value</th><th>Units</th><th>Assay</th></tr>
            </thead>
            <tbody>
              {acts.map((a, i) => (
                <tr key={i}>
                  <td>{a.target}</td><td>{a.type}</td>
                  <td>{a.value}</td><td>{a.units}</td>
                  <td style={{ fontSize: 11 }}>{a.assay?.slice(0, 80)}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
