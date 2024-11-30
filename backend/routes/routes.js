import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Register } from './schema.js'; // Import the Register model
import bcrypt from 'bcrypt';

const app = express();
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// MongoDB Connection
await mongoose
  .connect('mongodb+srv://raghavmittal26113:ZawF0ydqqdWy3ILQ@cluster0.vufzf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to database successfully');
  })
  .catch((error) => {
    console.log('Error in connecting to database:', error);
  });

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve HTML files
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

router.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about.html'));
});

// Register User
router.post('/submit', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await Register.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already exists. Please sign in.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const newUser = new Register({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).send('User registered successfully.');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Authenticate User
router.post('/authenticateuser', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await Register.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password.');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid email or password.');
    }

    res.status(200).send('User authenticated successfully.');
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
