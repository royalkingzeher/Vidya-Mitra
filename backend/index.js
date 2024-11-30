import express from 'express';
import session from 'express-session';
import routes from './routes/routes.js';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route handling
app.use('/', routes);

// Serve static files (HTML, CSS, etc.) from the current directory
app.use(express.static(__dirname));

// Start the server
app.listen(4000, () => {
  console.log('Server running at 4000');
});
