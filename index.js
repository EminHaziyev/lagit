// index.js
console.log('Starting server...');

import express from 'express';
console.log('Express imported successfully');

import userApisRoutes from './routes/userApisRoutes.js';
console.log('userApisRoutes imported successfully');

import repoApisRoutes from './routes/repoApisRoutes.js';
console.log('repoApisRoutes imported successfully');
import bodyParser from 'body-parser';

import webUIRoutes from './routes/webUIRoutes.js';
console.log('webUIRoutes imported successfully');



// Add error handlers
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

console.log('Creating Express app...');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
console.log('Setting up middleware...');
app.use(express.json());
app.use(express.static('public'));
console.log('Setting up routes...');
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api', userApisRoutes);
console.log('userApisRoutes mounted');

app.use('/api/repo', repoApisRoutes);
console.log('repoApisRoutes mounted');

app.use('/', webUIRoutes);
console.log('repoApisRoutes mounted');

console.log('Starting server on port 3000...');
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Server started successfully!');
});

server.on('error', (error) => {
    console.error('Server error:', error);
});

console.log('Server setup complete');