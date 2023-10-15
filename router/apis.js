import express from "express";
const router = express.Router();
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { readUserData, writeUserData } from './UserData.js';
import { createUser, findUserByEmail, addTokenToUser } from './UserFunctions.js';
import { log } from "console";
import path from "path";
import multer from "multer";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const userDataFilePath = 'userdata.json';

// Initialize user data (if the file doesn't exist)
if (!fs.existsSync(userDataFilePath)) {
    writeUserData([]);
}

function generateToken(user) {
    try {
        let token = jwt.sign(user, process.env.SECRET_KEY);
        return token;
    } catch (err) {
        console.log(err);
    }
}

// Configure multer for handling file uploads


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDirectory = path.join(__dirname, 'uploads');

// Check if the "uploads" directory exists, and create it if not
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); // Save files to the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

router.post('/login', async function (req, res) {
    const { name, email } = req.body;
    const existingUser = findUserByEmail(email);
    if(existingUser){
        const token = generateToken(existingUser);
        addTokenToUser(email, token);
        res.status(200).json({ message: 'User logged in Successfully', token });
    }else{
        const newUser = createUser(name, email);
        const token = generateToken(newUser);
        addTokenToUser(email, token);
        res.status(200).json({ message: 'User logged in Successfully', token });
    }
});

router.post('/checkTokenValid', async function (req, res){
    const {token} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        res.status(200).json({ message: 'Token is valid', decoded });
      } catch (error) {
        res.status(401).json({ message: 'Token is invalid' });
      }
    
})

router.post('/upload-webcam', upload.single('webcamVideo'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No webcam video uploaded' });
    }
  
    // File is saved on the server, you can process it further if needed
    const filePath = path.join(uploadsDirectory, req.file.originalname);
  console.log('Webcam video saved at:', filePath);

  res.status(200).json({ message: 'Webcam video uploaded successfully' });
  
  });
  
router.post('/upload-screen', upload.single('screenVideo'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No screen video uploaded' });
    }
  
    // File is saved on the server, you can process it further if needed
    const filePath = path.join(uploadsDirectory, req.file.originalname);
  console.log('Webcam video saved at:', filePath);

  res.status(200).json({ message: 'Screen video uploaded successfully' });
  });


export default router;