/* Simple Express server to locally preview production build under /my-portfolio path.
   Usage:
     1. npm run build
     2. npm run serve:prod  (or: PORT=3001 npm run serve:prod)
     3. Visit http://localhost:3001/my-portfolio
*/
const express = require('express');
const path = require('path');

const app = express();
const buildDir = path.join(__dirname, 'build');
const basePath = '/my-portfolio';

// Request logging (debug)
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// Serve static assets under the base path (allow index.html)
app.use(basePath, express.static(buildDir));

// Explicit routes for basePath with and without trailing slash
app.get(basePath, (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});
app.get(basePath + '/', (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

// SPA fallback for any deeper route under /my-portfolio
app.get(basePath + '/*', (req, res) => {
  res.sendFile(path.join(buildDir, 'index.html'));
});

// Convenience redirect from root to base path
app.get('/', (_req, res) => {
  res.redirect(basePath + '/');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`✅ Production build served at http://localhost:${port}${basePath}`);
});
