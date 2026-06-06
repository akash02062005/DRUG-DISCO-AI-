import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#6d5efc', '#22d3ee', '#34d399', '#fbbf24', '#f472b6', '#f87171'];

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.analyticsOverview().then(setOverview).catch(() => {});
    api.analyticsRecent().then(setRecent).catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Your drug discovery activity at a glance.</p>
        </div>
      </div>

      <div className="grid cols-4">
        <div className="stat gradient">
          <div className="label">Total Actions</div>
          <div className="value">{overview?.total_actions ?? 0}</div>
          <div className="sub">across all features</div>
        </div>
        <div className="stat">
          <div className="label">Saved Molecules</div>
          <div className="value">{overview?.saved_molecules ?? 0}</div>
          <div className="sub">in your workspace</div>
        </div>
        <div className="stat">
          <div className="label">Projects</div>
          <div className="value">{overview?.projects ?? 0}</div>
          <div className="sub">active pipelines</div>
        </div>
        <div className="stat">
          <div className="label">API Models Loaded</div>
          <div className="value">3</div>
          <div className="sub">ChemBERTa · MTR · BioGPT</div>
        </div>
      </div>

      <div className="grid cols-2" style={{ marginTop: 20 }}>
        <div className="panel">
          <h2>Feature Usage</h2>
          <p className="help">Breakdown of API calls by feature.</p>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={overview?.breakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#26305a" />
                <XAxis dataKey="type" stroke="#8a94c3" tick={{ fontSize: 10 }} />
                <YAxis stroke="#8a94c3" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#131830', border: '1px solid #26305a' }} />
                <Bar dataKey="count" fill="#6d5efc" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel">
          <h2>Distribution</h2>
          <p className="help">Pie chart of recent activity.</p>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={overview?.breakdown || []} dataKey="count" nameKey="type"
                     cx="50%" cy="50%" outerRadius={90} label>
                  {(overview?.breakdown || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Recent Activity</h2>
        <p className="help">Last {recent.length} events from your account.</p>
        {recent.length === 0
          ? <p className="help">No activity yet — try a feature to get started.</p>
          : (
            <table>
              <thead>
                <tr><th>Time</th><th>Event</th><th>Details</th></tr>
              </thead>
              <tbody>
                {recent.map(e => (
                  <tr key={e.id}>
                    <td>{e.ts ? new Date(e.ts).toLocaleString() : '—'}</td>
                    <td><span className="badge purple">{e.type}</span></td>
                    <td>{JSON.stringify(e.meta)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
}
