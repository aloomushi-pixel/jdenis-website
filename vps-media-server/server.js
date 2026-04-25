const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
// Serve static files
app.use('/media', express.static(UPLOADS_DIR));

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    // Sanitize filename and add timestamp to avoid overwrites
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + sanitizedName);
  }
});

const upload = multer({ storage: storage });

// API Endpoints
// List all files
app.get('/api/files', (req, res) => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read directory' });
    }
    
    const fileList = files.map(filename => {
      const stats = fs.statSync(path.join(UPLOADS_DIR, filename));
      return {
        name: filename,
        url: `/media/${filename}`,
        size: stats.size,
        createdAt: stats.birthtime
      };
    }).sort((a, b) => b.createdAt - a.createdAt); // Newest first

    res.json({ files: fileList });
  });
});

// Upload file(s)
app.post('/api/upload', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const uploadedFiles = req.files.map(file => ({
    name: file.filename,
    url: `/media/${file.filename}`,
    size: file.size
  }));

  res.json({ message: 'Files uploaded successfully', files: uploadedFiles });
});

// Delete file
app.delete('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  // Prevent directory traversal
  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const filePath = path.join(UPLOADS_DIR, filename);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Media server is running' });
});

app.listen(PORT, () => {
  console.log(`Media Server running on port ${PORT}`);
});
