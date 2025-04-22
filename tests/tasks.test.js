let token = ''

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI)

  // Register + login to get token
  await request(app).post('/api/register').send({
    name: 'Task Tester',
    email: 'task@test.com',
    password: 'pass1234',
  })

  const res = await request(app).post('/api/login').send({
    name: 'Task Tester',
    password: 'pass1234',
  })

  token = res.body.token
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

describe('Task Routes', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My First Task',
      })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('title', 'My First Task')
  })
})
