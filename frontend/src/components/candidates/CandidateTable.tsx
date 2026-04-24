import { Candidate } from '@/types/candidate';
import Badge from '@/components/ui/Badge';

interface CandidateTableProps { candidates: Candidate[]; }

const sourceVariant: Record<string, 'green' | 'blue' | 'purple' | 'gray'> = {
  csv: 'green', json: 'blue', pdf: 'purple', manual: 'gray',
};

export default function CandidateTable({ candidates }: CandidateTableProps) {
  if (!candidates.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="font-medium">No candidates yet</p>
        <p className="text-sm mt-1">Upload a CSV, JSON, or PDF to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {['Name', 'Email', 'Skills', 'Experience', 'Education', 'Source'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {candidates.map(c => (
            <tr key={c._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
              <td className="px-4 py-3 text-gray-500">{c.email}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {c.skills.slice(0, 3).map(s => (
                    <span key={s} className="px-1.5 py-0.5 bg-brand-50 text-brand-700 rounded text-xs">{s}</span>
                  ))}
                  {c.skills.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">+{c.skills.length - 3}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{c.experienceYears} yrs</td>
              <td className="px-4 py-3 text-gray-600">{c.education || '—'}</td>
              <td className="px-4 py-3">
                <Badge variant={sourceVariant[c.source] || 'gray'}>{c.source.toUpperCase()}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
