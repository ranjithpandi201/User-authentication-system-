const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/loginDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Register API
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.json({ success: true, message: 'User registered successfully!' });
  } catch (err) {
    res.json({ success: false, message: 'Email already exists!' });
  }
});

// Login API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.json({ success: false, message: 'Invalid password' });

  res.json({
    success: true,
    user: { name: user.name, email: user.email, role: user.role }
  });
});

// Get All Users (Admin only)
app.get('/api/users', async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
