const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllDocuments, getDocumentById, uploadDocument, updateDocument, deleteDocument, downloadDocument } = require('../controllers/documentController');
const { authenticate, authorize } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_PATH || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|xlsx|xls|ppt|pptx|txt|csv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('Invalid file type'));
  },
});

router.use(authenticate);
router.get('/', getAllDocuments);
router.get('/:id', getDocumentById);
router.get('/:id/download', downloadDocument);
router.post('/', upload.single('file'), uploadDocument);
router.put('/:id', updateDocument);
router.delete('/:id', authorize('admin', 'chair', 'staff'), deleteDocument);

module.exports = router;
