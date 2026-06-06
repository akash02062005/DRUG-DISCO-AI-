import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || '/api/v1';

export const client = axios.create({ baseURL: BASE, timeout: 120000 });

// Inject JWT on every request
client.interceptors.request.use(cfg => {
  const t = localStorage.getItem('dd_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export const api = {
  // Auth
  register: (email, password, name) =>
    client.post('/auth/register', { email, password, name }).then(r => r.data),
  login: (email, password) =>
    client.post('/auth/login', { email, password }).then(r => r.data),
  verifyOtp: (email, otp) =>
    client.post('/auth/verify-otp', { email, otp }).then(r => r.data),
  me: () => client.get('/auth/me').then(r => r.data),

  // Properties / RDKit / ChemBERTa
  predictProperties: (smiles) => client.post('/predict-properties', { smiles }).then(r => r.data),
  predictAdmet: (smiles) => client.post('/predict-admet', { smiles }).then(r => r.data),
  generate: (constraints) => client.post('/generate-molecules', constraints).then(r => r.data),
  getSdf: (smiles) => client.post('/molecule/sdf', { smiles }).then(r => r.data),
  proteinPdb: (pdbId) => client.get(`/protein/pdb/${pdbId}`).then(r => r.data),
  predictDti: (smiles, target_sequence) =>
    client.post('/predict-dti', { smiles, target_sequence }).then(r => r.data),
  similarity: (smiles, top_k = 5) =>
    client.post('/similarity', { smiles, top_k }).then(r => r.data),

  // Chatbot
  chat: (message, history = []) =>
    client.post('/chat', { message, history }).then(r => r.data),

  // External APIs
  pubchem: (query) => client.post('/pubchem/search', { query }).then(r => r.data),
  pubmed: (query) => client.post('/pubmed/search', { query }).then(r => r.data),
  pubmedAbstract: (pmid) => client.get(`/pubmed/abstract/${pmid}`).then(r => r.data),
  chembl: (query) => client.post('/chembl/search', { query }).then(r => r.data),
  chemblBioactivities: (id) => client.get(`/chembl/${id}/bioactivities`).then(r => r.data),
  uniprot: (query) => client.post('/uniprot/search', { query }).then(r => r.data),
  uniprotSequence: (acc) => client.get(`/uniprot/${acc}/sequence`).then(r => r.data),
  trials: (query) => client.post('/clinical-trials/search', { query }).then(r => r.data),

  // Workspace
  saveMolecule: (data) => client.post('/molecules', data).then(r => r.data),
  listMolecules: (projectId = null) =>
    client.get('/molecules', { params: projectId ? { project_id: projectId } : {} })
          .then(r => r.data),
  deleteMolecule: (id) => client.delete(`/molecules/${id}`).then(r => r.data),
  assignMoleculeProject: (id, project_id) =>
    client.patch(`/molecules/${id}/project`, { project_id }).then(r => r.data),
  createProject: (data) => client.post('/projects', data).then(r => r.data),
  listProjects: () => client.get('/projects').then(r => r.data),
  deleteProject: (id) => client.delete(`/projects/${id}`).then(r => r.data),

  // Auth extras
  resendOtp: (email) => client.post('/auth/resend-otp', { email }).then(r => r.data),

  // Analytics
  analyticsOverview: () => client.get('/analytics/overview').then(r => r.data),
  analyticsRecent: () => client.get('/analytics/recent').then(r => r.data),

  // Billing / payments
  listPlans: () => client.get('/billing/plans').then(r => r.data),
  billingConfig: () => client.get('/billing/config').then(r => r.data),
  createCheckout: (plan_id) =>
    client.post('/billing/checkout', { plan_id }).then(r => r.data),
  verifyPayment: (payload) =>
    client.post('/billing/verify', payload).then(r => r.data),
};
