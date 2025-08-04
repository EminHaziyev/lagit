import express from 'express';
import {authMiddleware, authParser} from '../middleware/authMiddleware.js';
import { loginUser } from '../controllers/authController.js';
import { createUser } from '../models/user.model.js';

const router = express.Router();

router.post('/signup',authParser, async (req, res) => {
    const { username, password } = req.auth;
    if (!username || !password) {
        return res.status(400).send('Username and password required');
    }
    try {
        await createUser(username, password);
        res.status(201).send('User registered');
    } catch (err) {
        res.status(409).send(err.message || 'User already exists');
    }
});

router.post('/login', authMiddleware, async (req, res) => {
    const { username, password } = req.auth;
    if (!username || !password) {
        return res.status(400).send('Username and password required');
    }
    try {
        await loginUser(username, password);
        res.send('Login successful');
    } catch (err) {
        res.status(401).send(err.message || 'Invalid credentials');
    }
});

export default router;
