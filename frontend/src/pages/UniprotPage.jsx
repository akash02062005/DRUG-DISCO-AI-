import React, { useState } from 'react';
import { api } from '../services/api';

export default function UniprotPage() {
  const [q, setQ] = useState('EGFR human');
  const [results, setResults] = useState([]);
  const [seq, setSeq] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try { setResults((await api.uniprot(q)).results || []); }
    finally { setLoading(false); }
  };

  const fetchSeq = async (acc) => {
    try { setSeq(await api.uniprotSequence(acc)); }
    catch { setSeq(null); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🧷 UniProt Target Lookup</h1>
          <p>Search the UniProt knowledgebase — 250M+ protein sequences and annotations.</p>
        </div>
      </div>
      <div className="panel">
        <div className="input-row">
          <div className="field" style={{ flex: 3 }}>
            <label>Protein / gene query</label>
            <input value={q} onChange={e => setQ(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()} />
          </div>
          <button className="primary" disabled={loading} onClick={search}>
            {loading ? <><span className="loader" /> Searching…</> : 'Search UniProt'}
          </button>
        </div>
      </div>

      <div className="panel">
        <h2>Targets</h2>
        <table>
          <thead>
            <tr><th>Accession</th><th>ID</th><th>Name</th><th>Organism</th><th>Length</th><th></th></tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r.accession}>
                <td><a href={r.url} target="_blank" rel="noreferrer">{r.accession}</a></td>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td><em>{r.organism}</em></td>
                <td>{r.length}</td>
                <td><button className="ghost" onClick={() => fetchSeq(r.accession)}>Get sequence</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!results.length && <p className="help">No results yet.</p>}
      </div>

      {seq && (
        <div className="panel">
          <h2>Sequence ({seq.length} aa) — {seq.accession}</h2>
          <pre className="code">{seq.sequence.replace(/(.{60})/g, '$1\n')}</pre>
        </div>
      )}
    </div>
  );
}
