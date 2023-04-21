import t from 'tap'
import { ImportMock } from 'ts-mock-imports'
import { faker } from '@faker-js/faker'
import buildServer from '../../../server'
import { fakeUser, fakerSession } from '../../../utils/test.helpers'
import * as userServices from '../user.services'

void t.test('POST `api/users/login` - Edge Case: login user unsuccessfully with mock functions',
  async t => {
    const user = fakeUser({ lengthString: 12 })
    const { id, BMI, role, verified, verificationCode, passwordResetCode, ...rest } = user

    const session = fakerSession({ lengthString: 12, userId: id })

    const fastify = buildServer()
    t.before(async () => {
      await fastify.ready()
    })
    t.teardown(async () => {
      await fastify.close()
      stubCreateUser.restore()
      stubFindSession.restore()
      stubCreateSession.restore()
      stubFindUser.restore()
    })
    const stubCreateUser = ImportMock.mockFunction(userServices, 'createUser', {
      ...rest,
      id,
      BMI
    })

    const stubFindSession = ImportMock.mockFunction(
      userServices,
      'findSessionUnique',
      null
    )

    const stubCreateSession = ImportMock.mockFunction(userServices, 'createSession', {
      ...session
    })

    await fastify.inject({
      method: 'POST',
      url: 'api/users',
      payload: {
        ...rest
      }
    })

    const loginRandomEmailResponse = await fastify.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        email: faker.internet.email(),
        password: user.password
      }
    })

    const stubFindUser = ImportMock.mockFunction(userServices, 'findUserUnique', {
      ...user
    })

    const loginRandomPasswordResponse = await fastify.inject({
      method: 'POST',
      url: '/api/users/login',
      payload: {
        email: user.email,
        password: 'alsjk7/H'
      }
    })

    const loginRandomEmailJson = loginRandomEmailResponse.json()
    const loginRandomPasswordJson = loginRandomPasswordResponse.json()

    t.equal(loginRandomEmailResponse.statusCode, 401)
    t.equal(loginRandomEmailResponse.headers['content-type'], 'application/json; charset=utf-8')
    t.equal(loginRandomPasswordResponse.statusCode, 401)
    t.equal(loginRandomPasswordResponse.headers['content-type'], 'application/json; charset=utf-8')

    t.equal(loginRandomEmailJson.message, 'Email or password wrong')
    t.equal(loginRandomPasswordJson.message, 'Email or password wrong')
  })
