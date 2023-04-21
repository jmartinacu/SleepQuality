import { test } from 'tap'
import buildServer from '../../../server'
import { fakeInputUser } from '../../../utils/test.helpers'
import prisma from '../../../utils/database'
import type { CreateUserResponse, LogInUserResponse } from '../user.schemas'
import { findSessionAndUserUnique } from '../user.services'

async function DatabaseTests (): Promise<void> {
  const userCreate = fakeInputUser()
  const userLogIn = fakeInputUser()

  await test('POST `api/users` - Happy Path: create user successfully with test database',
    async (t) => {
      const fastify = buildServer()

      t.before(async () => {
        await prisma.$connect()
        await fastify.ready()
      })

      t.teardown(async () => {
        await fastify.close()
        await prisma.session.deleteMany()
        await prisma.user.deleteMany()
        await prisma.$disconnect()
      })

      const response = await fastify.inject({
        method: 'POST',
        url: '/api/users',
        payload: {
          ...userCreate
        }
      })

      t.equal(response.statusCode, 201)
      t.equal(response.headers['content-type'], 'application/json; charset=utf-8')

      const json: CreateUserResponse = response.json()

      t.equal(json.age, userCreate.age)
      t.equal(json.email, userCreate.email)
      t.equal(json.height, userCreate.height)
      t.equal(json.weight, userCreate.weight)
      t.same(json.chronicDisorders, userCreate.chronicDisorders)
      t.equal(json.gender, userCreate.gender)
      t.same(typeof json.id, 'string')
    })

  void test('POST `api/users/login` - Happy Path: login user successfully with test database',
    async t => {
      const fastify = buildServer()

      t.before(async () => {
        await prisma.$connect()
        await fastify.ready()
      })

      t.teardown(async () => {
        await prisma.$disconnect()
        await fastify.close()
        await prisma.session.deleteMany()
        await prisma.user.deleteMany()
      })
      await fastify.inject({
        method: 'POST',
        url: 'api/users',
        payload: {
          ...userLogIn
        }
      })

      const { email, password } = userLogIn

      const loginResponse = await fastify.inject({
        method: 'POST',
        url: '/api/users/login',
        payload: {
          email,
          password
        }
      })

      const loginJson: LogInUserResponse = loginResponse.json()

      t.equal(loginResponse.statusCode, 200)
      t.equal(loginResponse.headers['content-type'], 'application/json; charset=utf-8')

      const accessVerified = fastify.jwt.access.verify(loginJson.accessToken)
      const refreshVerified = fastify.jwt.refresh.verify(loginJson.refreshToken)

      const sessionWithUser = await findSessionAndUserUnique('id', refreshVerified.sessionId)

      t.type(accessVerified.userId, 'string')
      t.type(refreshVerified.sessionId, 'string')

      t.equal(refreshVerified.sessionId, sessionWithUser?.id)
      t.equal(accessVerified.userId, sessionWithUser?.user.id)
    })
}

void DatabaseTests()
