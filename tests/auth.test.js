const request = require('supertest')
const app = require('../app') // assuming this exports your Express app
const mongoose = require('mongoose')
const User = require('../models/User')

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI)
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/register').send({
      name: 'Auth Tester',
      email: 'auth@test.com',
      password: 'pass1234',
    })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('token')
  })
})
