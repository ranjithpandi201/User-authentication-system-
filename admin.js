// makeAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Import user model

async function createAdmin() {
  await mongoose.connect('mongodb://127.0.0.1:27017/loginDB');
  console.log('✅ MongoDB connected');

  const name = 'Admin';
  const email = 'admin@gmail.com';
  const password = 'admin123'; // You can change this
  const hashed = await bcrypt.hash(password, 10);

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    console.log('⚠️ Admin already exists!');
  } else {
    const admin = new User({
      name,
      email,
      password: hashed,
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Admin created successfully!');
  }

  mongoose.connection.close();
}

createAdmin();
