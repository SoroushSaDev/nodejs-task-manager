const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const User = require('./src/models/User');
const Task = require('./src/models/Task');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-manager';
const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretJWTkey';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to DB');

    // Clear old data (optional)
    await User.deleteMany();
    await Task.deleteMany();

    const password = faker.internet.password(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a fake user
    const user = await User.create({
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: hashedPassword,
    });

    console.log('👤 Created User:', user.username);
    console.log('🔐 Password:', password);

    // Create JWT token
    // const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    // console.log('🔑 JWT Token:', token);

    // Create fake tasks
    const tasks = []; 

    for (let i = 0; i < 5; i++) {
      tasks.push({
        title: faker.lorem.sentence(),
        completed: faker.datatype.boolean(),
        user: user._id,
      });
    }

    const inserted = await Task.insertMany(tasks);
    console.log(`✅ Inserted ${inserted.length} tasks`);

    console.log('✨ Done seeding');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seed();
