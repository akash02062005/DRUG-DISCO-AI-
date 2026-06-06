import React from 'react';

const Stat = ({ label, value, sub }) => (
  <div className="stat">
    <div className="label">{label}</div>
    <div className="value">{value}</div>
    {sub && <div className="sub">{sub}</div>}
  </div>
);

export default function PropertyDashboard({ props }) {
  if (!props) return null;
  return (
    <div>
      <div className="grid cols-4">
        <Stat label="Molecular Weight" value={props.molecular_weight} sub="g/mol" />
        <Stat label="logP" value={props.logp} sub="lipophilicity" />
        <Stat label="TPSA" value={props.tpsa} sub="Å²" />
        <Stat label="QED" value={props.qed} sub="drug-likeness" />
        <Stat label="H-Donors" value={props.num_h_donors} />
        <Stat label="H-Acceptors" value={props.num_h_acceptors} />
        <Stat label="Rotatable Bonds" value={props.num_rotatable_bonds} />
        <Stat label="Rings" value={props.num_rings} />
      </div>
      <div style={{ marginTop: 16 }}>
        <span className={`badge ${props.lipinski_pass ? 'good' : 'bad'}`}>
          {props.lipinski_pass ? '✓ Lipinski Ro5 Pass' : '✗ Lipinski Violation'}
        </span>
        <span className="badge warn" style={{ marginLeft: 8 }}>
          SA Score: {props.synthetic_accessibility}
        </span>
      </div>
    </div>
  );
}
