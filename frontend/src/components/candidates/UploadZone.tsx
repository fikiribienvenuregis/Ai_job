'use client';
import { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
}

export default function UploadZone({ accept, multiple, onFiles, label, hint }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handle = (newFiles: File[]) => {
    setFiles(newFiles);
    onFiles(newFiles);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    handle(dropped);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handle(Array.from(e.target.files));
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer',
          dragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <Upload className={cn('w-10 h-10 mx-auto mb-3', dragging ? 'text-brand-500' : 'text-gray-400')} />
        <p className="font-medium text-gray-700">{label || 'Drop files here or click to browse'}</p>
        {hint && <p className="text-sm text-gray-400 mt-1">{hint}</p>}
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-sm text-green-800 flex-1 truncate">{f.name}</span>
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
