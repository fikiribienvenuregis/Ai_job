import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// ── Jobs ──────────────────────────────────────────────
export const getJobs = () => api.get('/jobs').then(r => r.data.data);
export const getJob = (id: string) => api.get(`/jobs/${id}`).then(r => r.data.data);
export const createJob = (data: unknown) => api.post('/jobs', data).then(r => r.data.data);
export const updateJob = (id: string, data: unknown) => api.put(`/jobs/${id}`, data).then(r => r.data.data);
export const deleteJob = (id: string) => api.delete(`/jobs/${id}`);

// ── Candidates ────────────────────────────────────────
export const getCandidates = (jobId: string) =>
  api.get('/candidates', { params: { jobId } }).then(r => r.data.data);

export const uploadCandidateFile = (jobId: string, file: File) => {
  const form = new FormData();
  form.append('jobId', jobId);
  form.append('file', file);
  return api.post('/candidates/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

export const uploadResumePDFs = (jobId: string, files: File[]) => {
  const form = new FormData();
  form.append('jobId', jobId);
  files.forEach(f => form.append('resumes', f));
  return api.post('/candidates/upload-resume', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

// ── Screening ─────────────────────────────────────────
export const triggerScreening = (jobId: string) =>
  api.post(`/screen/${jobId}`).then(r => r.data);

export const getResults = (jobId: string) =>
  api.get(`/results/${jobId}`).then(r => r.data.data);
