import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

/**
 * Workspace page:
 *   - Create projects (name + description)
 *   - Delete projects (molecules are detached, not deleted)
 *   - Filter saved molecules by project (or view all)
 *   - Add molecules manually (SMILES + optional name) to the active project
 *   - Assign existing molecules to a project via dropdown
 *   - Save path from Property Prediction also flows here because it writes to
 *     the same /molecules endpoint.
 */
export default function WorkspacePage() {
  const [mols, setMols] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [filterProject, setFilterProject] = useState(''); // '' = all
  const [manualSmiles, setManualSmiles] = useState('');
  const [manualName, setManualName] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const flash = (text, isErr = false) => {
    if (isErr) { setErr(text); setMsg(null); }
    else { setMsg(text); setErr(null); }
    setTimeout(() => { setMsg(null); setErr(null); }, 2500);
  };

  const refresh = async () => {
    try {
      const [m, p] = await Promise.all([
        api.listMolecules(filterProject || null),
        api.listProjects(),
      ]);
      setMols(m || []);
      setProjects(p || []);
    } catch (e) {
      flash(e?.response?.data?.detail || e.message, true);
    }
  };
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [filterProject]);

  const createProject = async () => {
    if (!newProject.name.trim()) return;
    setBusy(true);
    try {
      await api.createProject(newProject);
      setNewProject({ name: '', description: '' });
      flash('✓ Project created');
      refresh();
    } catch (e) {
      flash(e?.response?.data?.detail || e.message, true);
    } finally { setBusy(false); }
  };

  const removeProject = async (id) => {
    if (!window.confirm('Delete this project? Its molecules will be kept but detached.')) return;
    try {
      await api.deleteProject(id);
      if (filterProject === id) setFilterProject('');
      flash('Project deleted');
      refresh();
    } catch (e) { flash(e.message, true); }
  };

  const addManualMolecule = async () => {
    if (!manualSmiles.trim()) return;
    setBusy(true);
    try {
      await api.saveMolecule({
        smiles: manualSmiles.trim(),
        name: manualName.trim() || null,
        project_id: filterProject || null,
      });
      setManualSmiles(''); setManualName('');
      flash('✓ Molecule added');
      refresh();
    } catch (e) {
      flash(e?.response?.data?.detail || e.message, true);
    } finally { setBusy(false); }
  };

  const reassign = async (id, project_id) => {
    try {
      await api.assignMoleculeProject(id, project_id || null);
      flash('Molecule reassigned');
      refresh();
    } catch (e) { flash(e.message, true); }
  };

  const del = async (id) => {
    try { await api.deleteMolecule(id); refresh(); }
    catch (e) { flash(e.message, true); }
  };

  const countByProject = (pid) => mols.filter(m => m.project_id === pid).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>📁 My Workspace</h1>
          <p>Manage projects and the molecules that belong to them.</p>
        </div>
      </div>

      {msg && <div className="success">{msg}</div>}
      {err && <div className="error">⚠ {err}</div>}

      {/* Projects */}
      <div className="panel">
        <h2>Projects</h2>
        <div className="input-row">
          <div className="field" style={{ flex: 2 }}>
            <label>New project name</label>
            <input
              value={newProject.name}
              onChange={e => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="Kinase inhibitor lead optimization"
            />
          </div>
          <div className="field" style={{ flex: 3 }}>
            <label>Description (optional)</label>
            <input
              value={newProject.description}
              onChange={e => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Focus on EGFR T790M resistance mutation"
            />
          </div>
          <button className="primary" disabled={busy} onClick={createProject}>
            Create
          </button>
        </div>

        <div className="grid cols-3" style={{ marginTop: 16 }}>
          <div
            className={`card ${filterProject === '' ? 'active-card' : ''}`}
            style={{ cursor: 'pointer',
                     border: filterProject === '' ? '1px solid #6d5efc' : undefined }}
            onClick={() => setFilterProject('')}
          >
            <h4>📦 All Molecules</h4>
            <div className="meta">{mols.length} saved across all projects</div>
          </div>
          {projects.map(p => (
            <div
              key={p.id}
              className="card"
              style={{ cursor: 'pointer',
                       border: filterProject === p.id ? '1px solid #6d5efc' : undefined }}
              onClick={() => setFilterProject(p.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <h4 style={{ margin: 0 }}>📁 {p.name}</h4>
                <span
                  onClick={(e) => { e.stopPropagation(); removeProject(p.id); }}
                  style={{ cursor: 'pointer', color: '#f87171' }}
                  title="Delete project"
                >🗑</span>
              </div>
              <div className="meta">{p.description || 'No description'}</div>
              <div style={{ marginTop: 6 }}>
                <span className="badge purple">{countByProject(p.id)} molecules</span>
              </div>
            </div>
          ))}
          {!projects.length && (
            <p className="help">
              No projects yet — create one above. You can still save molecules
              directly without a project.
            </p>
          )}
        </div>
      </div>

      {/* Manual add */}
      <div className="panel">
        <h2>
          {filterProject
            ? `Add Molecule to "${projects.find(p => p.id === filterProject)?.name || 'Project'}"`
            : 'Add Molecule Manually'}
        </h2>
        <p className="help">
          Paste any SMILES — properties are computed automatically. Molecules
          can also flow in here from the <strong>Save</strong> button on the
          Property Prediction page.
        </p>
        <div className="input-row">
          <div className="field" style={{ flex: 3 }}>
            <label>SMILES</label>
            <input
              className="mono"
              value={manualSmiles}
              onChange={e => setManualSmiles(e.target.value)}
              placeholder="CC(=O)Oc1ccccc1C(=O)O"
              onKeyDown={e => e.key === 'Enter' && addManualMolecule()}
            />
          </div>
          <div className="field" style={{ flex: 2 }}>
            <label>Name (optional)</label>
            <input
              value={manualName}
              onChange={e => setManualName(e.target.value)}
              placeholder="Aspirin"
            />
          </div>
          <button className="primary" disabled={busy} onClick={addManualMolecule}>
            + Add Molecule
          </button>
        </div>
      </div>

      {/* Molecules */}
      <div className="panel">
        <h2>
          Saved Molecules ({mols.length})
          {filterProject && (
            <span style={{ marginLeft: 8, fontSize: 13, color: '#8a94c3' }}>
              in "{projects.find(p => p.id === filterProject)?.name}"
            </span>
          )}
        </h2>
        {!mols.length && (
          <p className="help">
            No molecules here yet. Add one above or use the Save button on
            Property Prediction.
          </p>
        )}
        <div className="grid cols-3">
          {mols.map(m => (
            <div className="card" key={m.id}>
              {m.name && (
                <h4 style={{ margin: '0 0 4px' }}>{m.name}</h4>
              )}
              <div className="smiles mono" style={{ wordBreak: 'break-all' }}>
                {m.smiles}
              </div>
              {m.properties?.molecular_weight && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap',
                              margin: '8px 0' }}>
                  <span className="badge purple">MW {m.properties.molecular_weight}</span>
                  <span className="badge info">logP {m.properties.logp}</span>
                  <span className="badge good">QED {m.properties.qed}</span>
                </div>
              )}
              <div className="field" style={{ marginTop: 6 }}>
                <label style={{ fontSize: 11 }}>Project</label>
                <select
                  value={m.project_id || ''}
                  onChange={e => reassign(m.id, e.target.value)}
                >
                  <option value="">— unassigned —</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <button
                className="ghost"
                style={{ width: '100%', marginTop: 8 }}
                onClick={() => del(m.id)}
              >🗑 Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
