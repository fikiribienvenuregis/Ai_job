'use client';
import { useState } from 'react';
import { ScreeningResult } from '@/types/candidate';
import { scoreBg, recommendationColor } from '@/lib/utils';
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Trophy } from 'lucide-react';

interface RankedListProps { results: ScreeningResult[]; }

export default function RankedList({ results }: RankedListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {results.map((r) => {
        const candidate = r.candidateId;
        const isOpen = expanded === r._id;
        return (
          <div
            key={r._id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-all"
          >
            {/* Header row */}
            <button
              onClick={() => setExpanded(isOpen ? null : r._id)}
              className="w-full flex items-center gap-4 p-4 text-left"
            >
              {/* Rank badge */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {r.rank <= 3 ? (
                  <Trophy className={`w-5 h-5 ${r.rank === 1 ? 'text-yellow-500' : r.rank === 2 ? 'text-gray-400' : 'text-amber-600'}`} />
                ) : (
                  <span className="text-sm font-bold text-gray-500">#{r.rank}</span>
                )}
              </div>

              {/* Name & email */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{candidate?.name}</p>
                <p className="text-sm text-gray-500 truncate">{candidate?.email}</p>
              </div>

              {/* Score */}
              <div className="flex-shrink-0 text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${scoreBg(r.compositeScore)}`}>
                  {r.compositeScore}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{r.label}</p>
              </div>

              {/* Recommendation */}
              <div className="flex-shrink-0 hidden sm:block">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${recommendationColor(r.recommendation)}`}>
                  {r.recommendation}
                </span>
              </div>

              {/* Expand icon */}
              <div className="flex-shrink-0 text-gray-400">
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {/* Expanded panel */}
            {isOpen && (
              <div className="border-t border-gray-100 px-4 pb-5 pt-4 bg-gray-50">
                <ExplanationPanel result={r} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExplanationPanel({ result }: { result: ScreeningResult }) {
  const scores = [
    { label: 'Skills', value: result.skillScore },
    { label: 'Experience', value: result.experienceScore },
    { label: 'Education', value: result.educationScore },
    { label: 'Projects', value: result.projectScore },
  ];

  return (
    <div className="space-y-5">
      {/* Score bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {scores.map(s => (
          <div key={s.label}>
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-600">{s.label}</span>
              <span className="text-xs font-bold text-gray-800">{s.value}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${s.value >= 80 ? 'bg-green-500' : s.value >= 60 ? 'bg-blue-500' : s.value >= 40 ? 'bg-yellow-500' : 'bg-red-400'}`}
                style={{ width: `${s.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <p className="text-sm text-gray-700 leading-relaxed">{result.explanation}</p>

      {/* Strengths & Weaknesses */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Strengths</p>
          <ul className="space-y-1">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Areas to Note</p>
          <ul className="space-y-1">
            {result.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Candidate skills */}
      {result.candidateId?.skills?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Candidate Skills</p>
          <div className="flex flex-wrap gap-1">
            {result.candidateId.skills.map(s => (
              <span key={s} className="px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
