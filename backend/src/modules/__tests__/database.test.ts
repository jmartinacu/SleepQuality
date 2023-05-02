import t from 'tap'
import buildServer from '../../server'
import { fakeInputUser, fakeUpdateUser } from '../../utils/test.helpers'
import prisma, { User, Session } from '../../utils/database'
import type { CreateUserResponse, LogInUserResponse, RefreshTokenResponse, VerifyAccountResponse } from '../user/user.schemas'
import { findSessionAndUserUnique, findUserUnique } from '../user/user.services'
import { calculateBMI } from '../../utils/helpers'

async function DatabaseTests (): Promise<void> {
  t.plan(8)

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

  const userCreate = fakeInputUser()

  const fastify = buildServer()

  const createUserResponse = await fastify.inject({
    method: 'POST',
    url: '/api/users',
    payload: userCreate
  })

  const createUserBackend: CreateUserResponse = createUserResponse.json()

  await t.test('POST `api/users` - Happy Path: create user successfully with test database',
    async childTest => {
      childTest.equal(createUserResponse.statusCode, 201)
      childTest.equal(createUserResponse.headers['content-type'], 'application/json; charset=utf-8')

      childTest.equal(new Date(createUserBackend.birth).toDateString(), new Date(userCreate.birth).toDateString())
      childTest.equal(createUserBackend.name, userCreate.name)
      childTest.equal(createUserBackend.email, userCreate.email)
      childTest.equal(createUserBackend.height, userCreate.height)
      childTest.equal(createUserBackend.weight, userCreate.weight)
      childTest.equal(createUserBackend.chronicDisorders, userCreate.chronicDisorders)
      childTest.equal(createUserBackend.gender, userCreate.gender)
      childTest.same(typeof createUserBackend.id, 'string')
    })

  const { verificationCode, id } = await findUserUnique('id', createUserBackend.id) as User

  const verifyUserResponse = await fastify.inject({
    method: 'GET',
    url: `api/users/verify/${id}/${verificationCode}`
  })

  const verifyUserResponseBackend: VerifyAccountResponse = verifyUserResponse.json()

  await t.test('GET `api/users/verify/:id/:verificationCode` - Happy Path: verify user successfully',
    async childTest => {
      childTest.equal(verifyUserResponse.statusCode, 200)
      childTest.equal(verifyUserResponse.headers['content-type'], 'application/json; charset=utf-8')

      childTest.equal(verifyUserResponseBackend.message, 'User verified')
    })

  const loginResponse = await fastify.inject({
    method: 'POST',
    url: '/api/users/login',
    payload: {
      email: userCreate.email,
      password: userCreate.password
    }
  })

  const tokensBackend: LogInUserResponse = loginResponse.json()

  const { id: sessionId } = await findSessionAndUserUnique('userId', id) as Session & { user: User }

  await t.test('POST `api/users/login` - Happy Path: login user successfully with test database',
    async childTest => {
      childTest.equal(loginResponse.statusCode, 200)
      childTest.equal(loginResponse.headers['content-type'], 'application/json; charset=utf-8')

      const accessVerified = fastify.jwt.access.verify(tokensBackend.accessToken)
      const refreshVerified = fastify.jwt.refresh.verify(tokensBackend.refreshToken)

      childTest.type(accessVerified.userId, 'string')
      childTest.type(refreshVerified.sessionId, 'string')

      childTest.equal(refreshVerified.sessionId, sessionId)
      childTest.equal(accessVerified.userId, id)
    })

  const refreshUserResponse = await fastify.inject({
    method: 'POST',
    url: 'api/users/refresh',
    headers: {
      refresh: tokensBackend.refreshToken
    }
  })

  const refreshBackend: RefreshTokenResponse = refreshUserResponse.json()

  await t.test('POST `api/users/refresh` - Happy Path: refresh accessToken successfully',
    async childTest => {
      childTest.equal(refreshUserResponse.statusCode, 200)
      childTest.equal(refreshUserResponse.headers['content-type'], 'application/json; charset=utf-8')

      const accessTokenRefresh = fastify.jwt.access.verify(refreshBackend.accessToken)

      childTest.type(accessTokenRefresh.userId, 'string')
      childTest.equal(accessTokenRefresh.userId, createUserBackend.id)
    })

  const getMeResponse = await fastify.inject({
    method: 'GET',
    url: '/api/users',
    headers: {
      authorization: `Bearer ${tokensBackend.accessToken}`
    }
  })

  const getMeBackend: CreateUserResponse = getMeResponse.json()

  await t.test('GET `api/users` - Happy Path: get user with authorization header successfully with test database',
    async childTest => {
      childTest.equal(getMeResponse.statusCode, 200)
      childTest.equal(getMeResponse.headers['content-type'], 'application/json; charset=utf-8')

      childTest.equal(getMeBackend.birth, createUserBackend.birth)
      childTest.equal(getMeBackend.email, createUserBackend.email)
      childTest.equal(getMeBackend.height, createUserBackend.height)
      childTest.equal(getMeBackend.weight, createUserBackend.weight)
      childTest.equal(getMeBackend.chronicDisorders, createUserBackend.chronicDisorders)
      childTest.equal(getMeBackend.gender, createUserBackend.gender)
      childTest.equal(getMeBackend.id, createUserBackend.id)
    })

  const fakeUserToUpdate = fakeUpdateUser()
  const updatedBMI = calculateBMI({
    height: fakeUserToUpdate.height,
    weight: fakeUserToUpdate.weight
  })

  const updateUserResponse = await fastify.inject({
    method: 'PATCH',
    url: '/api/users',
    payload: fakeUserToUpdate,
    headers: {
      authorization: `Bearer ${tokensBackend.accessToken}`
    }
  })

  const updatedUserBackend: VerifyAccountResponse = updateUserResponse.json()

  const {
    email,
    gender,
    height,
    weight,
    BMI,
    chronicDisorders
  } = await findUserUnique('id', createUserBackend.id) as User

  await t.test('PATCH `api/users` - Happy Path: update user with authorization header successfully with test database',
    async childTest => {
      childTest.equal(updateUserResponse.statusCode, 200)
      childTest.equal(updateUserResponse.headers['content-type'], 'application/json; charset=utf-8')

      childTest.equal(updatedUserBackend.message, 'User updated')
      childTest.equal(height, fakeUserToUpdate.height)
      childTest.equal(weight, fakeUserToUpdate.weight)
      childTest.equal(chronicDisorders, fakeUserToUpdate.chronicDisorders)
      childTest.equal(gender, fakeUserToUpdate.gender)
      childTest.equal(BMI, updatedBMI)
    })

  const forgotpasswordResponse = await fastify.inject({
    method: 'POST',
    url: 'api/users/forgotpassword',
    payload: {
      email
    }
  })

  const forgotPasswordBackend: VerifyAccountResponse = forgotpasswordResponse.json()

  await t.test('POST `api/users/forgotpassword` - Happy Path: Ask for a code to reset password',
    async childTest => {
      childTest.equal(forgotpasswordResponse.statusCode, 200)
      childTest.equal(forgotpasswordResponse.headers['content-type'], 'application/json; charset=utf-8')

      childTest.equal(forgotPasswordBackend.message, `If user with email equal ${email} is registered, he will received an email to reset his password`)
    })

  const { passwordResetCode } = await findUserUnique('id', createUserBackend.id) as User
  const passwordResetCodeString = String(passwordResetCode)
  const newPassword = 'asldkfj12U&'

  const resetPasswordResponse = await fastify.inject({
    method: 'POST',
    url: `api/users/resetpassword/${createUserBackend.id}/${passwordResetCodeString}`,
    payload: {
      password: newPassword
    }
  })

  const resetPasswordBackend: VerifyAccountResponse = resetPasswordResponse.json()

  const {
    password,
    passwordResetCode: newPasswordResetCode
  } = await findUserUnique('id', createUserBackend.id) as User

  await t.test('POST `api/users/resetpassword/:id/:passwordResetCode` - Happy Path: Reset password with password reset code', childTest => {
    childTest.equal(resetPasswordResponse.statusCode, 200)
    childTest.equal(resetPasswordResponse.headers['content-type'], 'application/json; charset=utf-8')

    childTest.equal(password, newPassword)
    childTest.same(newPasswordResetCode, null)
    childTest.equal(resetPasswordBackend.message, 'Password reset')
  })
}

void DatabaseTests()
