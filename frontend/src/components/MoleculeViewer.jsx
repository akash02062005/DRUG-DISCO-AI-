import React, { useEffect, useRef } from 'react';

/**
 * 3D Molecular Viewer powered by 3Dmol.js (loaded via <script> in index.html).
 *
 * Supports two inputs:
 *  - `sdf`: a SMILES-derived SDF block (small molecule) — for stick/sphere
 *  - `pdb`: a PDB-format string (protein) — for cartoon/stick/sphere
 *
 * Cartoon rendering requires secondary-structure info so it only makes sense
 * with a real protein PDB; we gracefully fall back to stick/sphere for SDF.
 */
export default function MoleculeViewer({ sdf, pdb, style = 'stick' }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !window.$3Dmol) return;
    if (!sdf && !pdb) return;
    containerRef.current.innerHTML = '';
    const v = window.$3Dmol.createViewer(containerRef.current, {
      backgroundColor: '#0a0f23',
    });

    if (pdb) {
      v.addModel(pdb, 'pdb');
      if (style === 'cartoon') {
        v.setStyle({}, { cartoon: { color: 'spectrum' } });
      } else if (style === 'sphere') {
        v.setStyle({}, { sphere: { scale: 0.3 } });
      } else if (style === 'surface') {
        v.setStyle({}, { cartoon: { color: 'spectrum' } });
        v.addSurface(window.$3Dmol.SurfaceType.VDW, { opacity: 0.6, color: 'white' });
      } else {
        v.setStyle({}, { stick: { radius: 0.2 } });
      }
    } else {
      v.addModel(sdf, 'sdf');
      if (style === 'cartoon') {
        // SDF has no secondary structure — use stick+sphere as an intuitive fallback
        v.setStyle({}, { stick: { radius: 0.15 }, sphere: { scale: 0.25 } });
      } else if (style === 'sphere') {
        v.setStyle({}, { sphere: { scale: 0.3 } });
      } else {
        v.setStyle({}, { stick: { radius: 0.15 }, sphere: { scale: 0.25 } });
      }
    }

    v.zoomTo();
    v.spin(true);
    v.render();
    viewerRef.current = v;
  }, [sdf, pdb, style]);

  return (
    <div
      ref={containerRef}
      className="viewer"
      style={{ position: 'relative' }}
    >
      {!sdf && !pdb && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#8a94c3', fontSize: 13,
        }}>
          Load a SMILES or a PDB structure to view it in 3D
        </div>
      )}
    </div>
  );
}
