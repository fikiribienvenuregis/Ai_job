import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate extends Document {
  jobId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experienceYears: number;
  education: string;
  category: string;
  resumeText: string;
  resumeFile?: string; // path or filename
  source: 'csv' | 'json' | 'pdf' | 'manual';
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String },
    skills: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0, min: 0 },
    education: { type: String, default: '' },
    category: { type: String, default: '' },
    resumeText: { type: String, default: '' },
    resumeFile: { type: String },
    source: {
      type: String,
      enum: ['csv', 'json', 'pdf', 'manual'],
      default: 'manual',
    },
  },
  { timestamps: true }
);

// Index for fast lookup by job
CandidateSchema.index({ jobId: 1 });

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);
