import t from 'tap'
import buildServer from '../../../server'
import { fakeInputUser } from '../../../utils/test.helpers'
import prisma, { User, Session } from '../../../utils/database'
import type { CreateUserResponse, LogInUserResponse, RefreshTokenResponse, VerifyAccountResponse } from '../user.schemas'
import { findSessionAndUserUnique } from '../user.services'

async function DatabaseTests (): Promise<void> {
  const userCreate = fakeInputUser()

  const fastify = buildServer()

  const createUserResponse = await fastify.inject({
    method: 'POST',
    url: '/api/users',
    payload: {
      ...userCreate
    }
  })

  const createUserBackend: CreateUserResponse = createUserResponse.json()

  const loginResponse = await fastify.inject({
    method: 'POST',
    url: '/api/users/login',
    payload: {
      email: userCreate.email,
      password: userCreate.password
    }
  })

  const tokensBackend: LogInUserResponse = loginResponse.json()

  const accessVerified = fastify.jwt.access.verify(tokensBackend.accessToken)
  const refreshVerified = fastify.jwt.refresh.verify(tokensBackend.refreshToken)

  const refreshUserResponse = await fastify.inject({
    method: 'POST',
    url: 'api/users/refresh',
    headers: {
      refresh: tokensBackend.refreshToken
    }
  })

  const refreshBackend: RefreshTokenResponse = refreshUserResponse.json()

  const accessTokenRefresh = fastify.jwt.access.verify(refreshBackend.accessToken)

  const sessionWithUser = await findSessionAndUserUnique('id', refreshVerified.sessionId) as Session & { user: User }

  const verifyUserResponse = await fastify.inject({
    method: 'GET',
    url: `api/users/verify/${createUserBackend.id}/${sessionWithUser.user.verificationCode}`,
    headers: {
      authorization: `Bearer ${tokensBackend.accessToken}`
    }
  })

  const verifyUserResponseBackend: VerifyAccountResponse = verifyUserResponse.json()

  const getMeResponse = await fastify.inject({
    method: 'GET',
    url: '/api/users',
    headers: {
      authorization: `Bearer ${tokensBackend.accessToken}`
    }
  })

  const getMeBackend: CreateUserResponse = getMeResponse.json()

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

  t.plan(5)

  await t.test('POST `api/users` - Happy Path: create user successfully with test database',
    async childTest => {
      childTest.equal(createUserResponse.statusCode, 201)
      childTest.equal(createUserResponse.headers['content-type'], 'application/json; charset=utf-8')

      childTest.equal(createUserBackend.age, userCreate.age)
      childTest.equal(createUserBackend.email, userCreate.email)
      childTest.equal(createUserBackend.height, userCreate.height)
      childTest.equal(createUserBackend.weight, userCreate.weight)
      childTest.same(createUserBackend.chronicDisorders, userCreate.chronicDisorders)
      childTest.equal(createUserBackend.gender, userCreate.gender)
      childTest.same(typeof createUserBackend.id, 'string')
    })

  await t.test('POST `api/users/login` - Happy Path: login user successfully with test database',
    async childTest => {
      childTest.equal(loginResponse.statusCode, 200)
      childTest.equal(loginResponse.headers['content-type'], 'application/json; charset=utf-8')

      childTest.type(accessVerified.userId, 'string')
      childTest.type(refreshVerified.sessionId, 'string')

      childTest.equal(refreshVerified.sessionId, sessionWithUser.id)
      childTest.equal(accessVerified.userId, sessionWithUser.user.id)
    })

  await t.test('POST `api/users/refresh` - Happy Path: refresh accessToken successfully',
    async childTest => {
      childTest.equal(refreshUserResponse.statusCode, 200)
      childTest.equal(refreshUserResponse.headers['content-type'], 'application/json; charset=utf-8')

      childTest.type(accessTokenRefresh.userId, 'string')
      childTest.equal(accessTokenRefresh.userId, createUserBackend.id)
    })

  await t.test('GET `api/users/verify/:id/:verificationCode` - Happy Path: verify user successfully',
    async childTest => {
      childTest.equal(verifyUserResponse.statusCode, 200)
      childTest.equal(verifyUserResponse.headers['content-type'], 'application/json; charset=utf-8')

      childTest.equal(verifyUserResponseBackend.message, 'User verified')
    })

  await t.test('GET `api/users` - Happy Path: get user with authorization header successfully with test database',
    async childTest => {
      childTest.equal(getMeResponse.statusCode, 200)
      childTest.equal(getMeResponse.headers['content-type'], 'application/json; charset=utf-8')

      childTest.equal(getMeBackend.age, createUserBackend.age)
      childTest.equal(getMeBackend.email, createUserBackend.email)
      childTest.equal(getMeBackend.height, createUserBackend.height)
      childTest.equal(getMeBackend.weight, createUserBackend.weight)
      childTest.same(getMeBackend.chronicDisorders, createUserBackend.chronicDisorders)
      childTest.equal(getMeBackend.gender, createUserBackend.gender)
      childTest.equal(getMeBackend.id, createUserBackend.id)
    })
}

void DatabaseTests()
