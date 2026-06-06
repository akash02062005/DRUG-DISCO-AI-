import React, { useState } from 'react';
import { api } from '../services/api';
import MoleculeViewer from '../components/MoleculeViewer';

/**
 * 3D Viewer page with two modes:
 *   - Small molecule (SMILES -> SDF): stick / sphere styles
 *   - Protein (PDB ID -> RCSB PDB): cartoon / stick / sphere / surface
 *
 * Cartoon rendering only makes sense for proteins, so choosing Cartoon in
 * molecule mode nudges the user to switch to protein mode.
 */
export default function ViewerPage() {
  const [mode, setMode] = useState('molecule'); // 'molecule' | 'protein'
  const [smiles, setSmiles] = useState('c1ccc2c(c1)ccc3c2cccc3');
  const [pdbId, setPdbId] = useState('1CRN');
  const [sdf, setSdf] = useState(null);
  const [pdb, setPdb] = useState(null);
  const [pdbTitle, setPdbTitle] = useState(null);
  const [style, setStyle] = useState('stick');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const renderMolecule = async () => {
    setLoading(true); setErr(null); setPdb(null); setPdbTitle(null);
    try {
      const r = await api.getSdf(smiles);
      setSdf(r.sdf);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    } finally { setLoading(false); }
  };

  const renderProtein = async () => {
    setLoading(true); setErr(null); setSdf(null);
    try {
      const r = await api.proteinPdb(pdbId);
      setPdb(r.pdb);
      setPdbTitle(r.title);
      if (style !== 'cartoon' && style !== 'stick' && style !== 'sphere' && style !== 'surface') {
        setStyle('cartoon');
      }
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    } finally { setLoading(false); }
  };

  const run = () => (mode === 'molecule' ? renderMolecule() : renderProtein());

  const moleculeStyles = [
    { v: 'stick', label: 'Stick + Sphere' },
    { v: 'sphere', label: 'Sphere (CPK)' },
  ];
  const proteinStyles = [
    { v: 'cartoon', label: 'Cartoon' },
    { v: 'stick', label: 'Stick' },
    { v: 'sphere', label: 'Sphere' },
    { v: 'surface', label: 'Cartoon + Surface' },
  ];
  const styles = mode === 'protein' ? proteinStyles : moleculeStyles;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🧬 3D Molecular Viewer</h1>
          <p>Interactive visualization powered by 3Dmol.js with auto-spin and zoom.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className={mode === 'molecule' ? 'primary' : 'ghost'}
            onClick={() => { setMode('molecule'); setStyle('stick'); }}
          >
            Small molecule
          </button>
          <button
            className={mode === 'protein' ? 'primary' : 'ghost'}
            onClick={() => { setMode('protein'); setStyle('cartoon'); }}
          >
            Protein (cartoon)
          </button>
        </div>
      </div>

      <div className="panel">
        {mode === 'molecule' ? (
          <div className="input-row">
            <div className="field" style={{ flex: 3 }}>
              <label>SMILES</label>
              <input
                className="mono"
                value={smiles}
                onChange={e => setSmiles(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && run()}
              />
            </div>
            <div className="field">
              <label>Style</label>
              <select value={style} onChange={e => setStyle(e.target.value)}>
                {styles.map(s => <option key={s.v} value={s.v}>{s.label}</option>)}
              </select>
            </div>
            <button className="primary" disabled={loading} onClick={run}>
              {loading ? <><span className="loader" /> Building…</> : 'Render'}
            </button>
          </div>
        ) : (
          <div className="input-row">
            <div className="field" style={{ flex: 2 }}>
              <label>PDB ID (from RCSB)</label>
              <input
                className="mono"
                value={pdbId}
                placeholder="e.g. 1CRN, 6LU7, 4HHB"
                onChange={e => setPdbId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && run()}
              />
            </div>
            <div className="field">
              <label>Style</label>
              <select value={style} onChange={e => setStyle(e.target.value)}>
                {styles.map(s => <option key={s.v} value={s.v}>{s.label}</option>)}
              </select>
            </div>
            <button className="primary" disabled={loading} onClick={run}>
              {loading ? <><span className="loader" /> Fetching…</> : 'Load Protein'}
            </button>
          </div>
        )}
        {err && <div className="error">⚠ {err}</div>}
        {mode === 'protein' && pdbTitle && (
          <p className="help" style={{ marginTop: 8 }}>
            <strong>{pdbTitle}</strong>
          </p>
        )}
        {mode === 'molecule' && (
          <p className="help" style={{ marginTop: 8 }}>
            Tip: Cartoon rendering needs protein secondary structure. Switch
            to <em>Protein</em> mode and enter a PDB ID (e.g. 1CRN, 6LU7) to
            see a cartoon representation.
          </p>
        )}
      </div>

      <div className="panel">
        <MoleculeViewer sdf={sdf} pdb={pdb} style={style} />
      </div>
    </div>
  );
}
