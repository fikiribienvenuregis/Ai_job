'use client';
import { useState, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { JobFormData } from '@/types/job';
import { X, Plus } from 'lucide-react';

interface JobFormProps {
  initial?: Partial<JobFormData>;
  onSubmit: (data: JobFormData) => Promise<void>;
  loading?: boolean;
}

const educationOptions = [
  { value: 'Any', label: 'Any' },
  { value: 'Bachelor', label: 'Bachelor' },
  { value: 'Master', label: 'Master' },
  { value: 'PhD', label: 'PhD' },
];
const jobTypeOptions = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Remote', label: 'Remote' },
];

export default function JobForm({ initial, onSubmit, loading }: JobFormProps) {
  const [form, setForm] = useState<JobFormData>({
    title: initial?.title || '',
    description: initial?.description || '',
    requiredSkills: initial?.requiredSkills || [],
    preferredSkills: initial?.preferredSkills || [],
    experienceYears: initial?.experienceYears || 0,
    educationLevel: initial?.educationLevel || 'Any',
    location: initial?.location || 'Remote',
    jobType: initial?.jobType || 'Full-time',
  });

  const [skillInput, setSkillInput] = useState('');
  const [prefSkillInput, setPrefSkillInput] = useState('');

  const set = (key: keyof JobFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
  };

  const addSkill = (type: 'required' | 'preferred') => {
    const val = type === 'required' ? skillInput.trim() : prefSkillInput.trim();
    if (!val) return;
    const key = type === 'required' ? 'requiredSkills' : 'preferredSkills';
    if (!form[key].includes(val)) {
      setForm(f => ({ ...f, [key]: [...f[key], val] }));
    }
    type === 'required' ? setSkillInput('') : setPrefSkillInput('');
  };

  const removeSkill = (type: 'required' | 'preferred', skill: string) => {
    const key = type === 'required' ? 'requiredSkills' : 'preferredSkills';
    setForm(f => ({ ...f, [key]: f[key].filter(s => s !== skill) }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, experienceYears: Number(form.experienceYears) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Job Title" value={form.title} onChange={set('title')} required placeholder="e.g. Senior Python Developer" />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Job Description</label>
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          required
          rows={5}
          placeholder="Describe the role, responsibilities, and what makes it exciting..."
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-none"
        />
      </div>

      {/* Required Skills */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Required Skills</label>
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill('required'); } }}
            placeholder="Type a skill and press Enter"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Button type="button" variant="outline" size="sm" onClick={() => addSkill('required')}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.requiredSkills.map(s => (
            <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-brand-100 text-brand-800 rounded-full text-xs font-medium">
              {s}
              <button type="button" onClick={() => removeSkill('required', s)} className="hover:text-brand-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Preferred Skills */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Preferred Skills</label>
        <div className="flex gap-2">
          <input
            value={prefSkillInput}
            onChange={e => setPrefSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill('preferred'); } }}
            placeholder="Type a skill and press Enter"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Button type="button" variant="outline" size="sm" onClick={() => addSkill('preferred')}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.preferredSkills.map(s => (
            <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {s}
              <button type="button" onClick={() => removeSkill('preferred', s)} className="hover:text-gray-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Input
          label="Min. Experience (yrs)"
          type="number"
          min={0}
          value={form.experienceYears}
          onChange={set('experienceYears')}
        />
        <Select label="Education Level" options={educationOptions} value={form.educationLevel} onChange={set('educationLevel')} />
        <Select label="Job Type" options={jobTypeOptions} value={form.jobType} onChange={set('jobType')} />
        <Input label="Location" value={form.location} onChange={set('location')} placeholder="Kigali / Remote" />
      </div>

      <div className="pt-2">
        <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
          Save Job
        </Button>
      </div>
    </form>
  );
}
