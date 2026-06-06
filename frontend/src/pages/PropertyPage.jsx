import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import MoleculeViewer from '../components/MoleculeViewer';
import PropertyDashboard from '../components/PropertyDashboard';

export default function PropertyPage() {
  const [smiles, setSmiles] = useState('CC(=O)Oc1ccccc1C(=O)O');
  const [name, setName] = useState('');
  const [props, setProps] = useState(null);
  const [sdf, setSdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState('');

  // Load projects on mount so the user can pick one when saving
  useEffect(() => {
    api.listProjects()
       .then(p => setProjects(p || []))
       .catch(() => setProjects([]));
  }, []);

  const run = async () => {
    setLoading(true); setErr(null);
    try {
      const [p, s] = await Promise.all([
        api.predictProperties(smiles),
        api.getSdf(smiles).catch(() => null),
      ]);
      setProps(p);
      if (s) setSdf(s.sdf);
    } catch (e) {
      setErr(e?.response?.data?.detail || e.message);
    } finally { setLoading(false); }
  };

  const save = async () => {
    if (!props) return;
    try {
      await api.saveMolecule({
        smiles,
        name: name.trim() || null,
        properties: props,
        project_id: projectId || null,
      });
      const label = projectId
        ? projects.find(p => p.id === projectId)?.name || 'project'
        : 'workspace';
      setSaveStatus(`✓ Saved to ${label}`);
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (e) {
      setSaveStatus('Save failed: ' + (e?.response?.data?.detail || e.message));
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>🧪 Property Prediction</h1>
          <p>RDKit descriptors enriched with ChemBERTa neural predictions.</p>
        </div>
      </div>

      <div className="panel">
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
          <button className="primary" disabled={loading} onClick={run}>
            {loading ? <><span className="loader" /> Predicting…</> : 'Predict'}
          </button>
        </div>

        {props && (
          <div className="input-row" style={{ marginTop: 12 }}>
            <div className="field" style={{ flex: 2 }}>
              <label>Name (optional)</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Aspirin"
              />
            </div>
            <div className="field" style={{ flex: 2 }}>
              <label>Save to project</label>
              <select value={projectId} onChange={e => setProjectId(e.target.value)}>
                <option value="">— no project (unassigned) —</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <button className="primary" onClick={save}>💾 Save to Workspace</button>
          </div>
        )}

        {err && <div className="error">⚠ {err}</div>}
        {saveStatus && (
          <div className={saveStatus.startsWith('✓') ? 'success' : 'error'}>
            {saveStatus}
          </div>
        )}
        {props && !projects.length && (
          <p className="help" style={{ marginTop: 8 }}>
            Tip: create a project in the <strong>Workspace</strong> tab to
            organize saved molecules by research topic.
          </p>
        )}
      </div>

      <div className="grid cols-2">
        <div className="panel">
          <h2>Physicochemical Properties</h2>
          {props
            ? <PropertyDashboard props={props} />
            : <p className="help">Run a prediction to see results.</p>}
        </div>
        <div className="panel">
          <h2>3D Structure</h2>
          <p className="help">MMFF-optimized 3D coordinates from RDKit.</p>
          <MoleculeViewer sdf={sdf} />
        </div>
      </div>

      {props?.neural_predictions && (
        <div className="panel">
          <h2>ChemBERTa Neural Predictions</h2>
          <p className="help">DeepChem/ChemBERTa-77M-MTR multi-task regression head.</p>
          <pre className="code">{JSON.stringify(props.neural_predictions, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
