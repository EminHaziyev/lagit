import express from 'express';
import {authMiddleware, authParser} from '../middleware/authMiddleware.js';
import { loginUser } from '../controllers/authController.js';
import { createUser } from '../models/user.model.js';

const router = express.Router();



router.post('/login',authParser, async (req, res) => {
    const { username, password } = req.auth;
    console.log("Attempting to log in user:", username);
    if (!username || !password) {
        return res.status(400).send('Username and password required');
    }
    try {
        const response = await loginUser(username, password);
        console.log("User logged in successfully:", response);
        if(response.message === "ok") {
            res.status(200).json(response); // Store user info in request for further use
        }
        else{
            res.status(401).send('Invalid credentials');
        }
        
    } catch (err) {
        res.status(401).send(err.message || 'Invalid credentials');
    }
});


router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
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

router.get('/signup', (req, res) => {
    res.render('signup');
});

export default router;
