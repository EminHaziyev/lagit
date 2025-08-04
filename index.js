// index.js
import express from 'express';
import apiRoutes from './routes/userApisRoutes.js';
import repoApisRoutes from './routes/repoApisRoutes.js';
const app = express();
app.use(express.json());

// Use imported API routes
app.use('/api', apiRoutes);
app.use('/repo', repoApisRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
