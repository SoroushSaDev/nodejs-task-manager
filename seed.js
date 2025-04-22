require('dotenv').config();

const mongoose = require('mongoose');
const {faker} = require('@faker-js/faker');

const User = require('./models/User');
const Task = require('./models/Task');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task-manager';

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to DB');

        // Clear old data
        await User.deleteMany();
        await Task.deleteMany();

        const users = [];

        // Create admin
        const admin = await User.create({
            role: 'admin',
            name: 'SoroushDev',
            firstname: 'Soroush',
            lastname: 'Sagharichiha',
            password: 'Soroush@1380',
            email: 'sagharichihas@gmail.com',
        });

        console.log('👤 Created Admin:', admin.name);
        console.log('🔐 Password:', "Soroush@1380");

        users.push(admin);

        // Create fake users
        for (let i = 0; i < 5; i++) {
            const password = faker.internet.password(10);
            const user = await User.create({
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                name: faker.internet.username(),
                email: faker.internet.email(),
                password,
            });
            users.push(user);
        }

        // Create fake tasks
        const tasks = [];

        users.forEach((user) => {
            for (let i = 0; i < 5; i++) {
                tasks.push({
                    user: user._id,
                    title: faker.lorem.sentence(),
                    completed: faker.datatype.boolean(),
                });
            }
        });

        const inserted = await Task.insertMany(tasks);
        console.log(`✅ Inserted ${inserted.length} tasks`);

        console.log('✨ Done seeding');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

seed().then(r => console.log(r));
