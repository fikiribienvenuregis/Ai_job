import multer from 'multer';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const csvJsonFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowed = ['.csv', '.json'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) return cb(null, true);
  cb(new Error('Only CSV and JSON files are allowed'));
};

const pdfFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf') return cb(null, true);
  cb(new Error('Only PDF files are allowed'));
};

export const uploadCSVJSON = multer({
  storage,
  fileFilter: csvJsonFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('file');

export const uploadPDFs = multer({
  storage,
  fileFilter: pdfFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
}).array('resumes', 20);
