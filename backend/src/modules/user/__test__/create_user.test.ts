/* import { test } from 'tap'
import { ImportMock } from 'ts-mock-imports'
import buildServer from '../../../server'
import { fakeResponseUser } from '../../../utils/test.helpers'
import * as userServices from '../user.services'
import type { CreateUserResponse } from '../user.schemas'

void test('POST `api/users` - Happy Path: create user successfully with mock createUser',
  async (t) => {
    t.teardown(async () => {
      await fastify.close()
      stub.restore()
    })

    const fastify = buildServer()

    const user = fakeResponseUser({ lengthString: 12 })
    const { id, BMI, ...rest } = user

    const stub = ImportMock.mockFunction(userServices, 'createUser', {
      ...rest,
      id,
      BMI
    })

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        ...rest
      }
    })

    t.equal(response.statusCode, 201)
    t.equal(response.headers['content-type'], 'application/json; charset=utf-8')

    const json: CreateUserResponse = response.json()

    t.equal(json.age, user.age)
    t.equal(json.email, user.email)
    t.equal(json.height, user.height)
    t.equal(json.weight, user.weight)
    t.same(json.chronicDisorders, user.chronicDisorders)
    t.equal(json.gender, user.gender)
    t.equal(json.id, user.id)
    t.equal(json.BMI, user.BMI)
  })

void test('POST `api/users` - Edge Case: fail create user with mock createUser',
  async (t) => {
    t.teardown(async () => {
      await fastify.close()
      stub.restore()
    })

    const fastify = buildServer()

    const user = fakeResponseUser({ lengthString: 12 })
    const { id, BMI, ...rest } = user

    const { email, ...restWithoutEmail } = rest
    const { age, ...restWithoutAge } = rest
    const { gender, ...restWithoutGender } = rest
    const { height, ...restWithoutHeight } = rest
    const { weight, ...restWithoutWeight } = rest
    const { chronicDisorders, ...restWithoutChronicDisorders } = rest
    const { password, ...restWithoutPassword } = rest

    const stub = ImportMock.mockFunction(userServices, 'createUser', {
      ...rest,
      id,
      BMI
    })

    const responseEmail = await fastify.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        ...restWithoutEmail
      }
    })
    const responseAge = await fastify.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        ...restWithoutAge
      }
    })
    const responseGender = await fastify.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        ...restWithoutGender
      }
    })
    const responseHeight = await fastify.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        ...restWithoutHeight
      }
    })
    const responseWeight = await fastify.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        ...restWithoutWeight
      }
    })
    const responseChronicDisorders = await fastify.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        ...restWithoutChronicDisorders
      }
    })
    const responsePassword = await fastify.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        ...restWithoutPassword
      }
    })

    t.equal(responseEmail.statusCode, 400)
    t.equal(responseAge.statusCode, 400)
    t.equal(responseGender.statusCode, 400)
    t.equal(responseHeight.statusCode, 400)
    t.equal(responseWeight.statusCode, 400)
    t.equal(responseChronicDisorders.statusCode, 400)
    t.equal(responsePassword.statusCode, 400)

    const jsonEmail = responseEmail.json()
    const jsonAge = responseAge.json()
    const jsonGender = responseGender.json()
    const jsonHeight = responseHeight.json()
    const jsonWeight = responseWeight.json()
    const jsonChronicDisorders = responseChronicDisorders.json()
    const jsonPassword = responsePassword.json()

    t.equal(jsonEmail.message, "body must have required property 'email'")
    t.equal(jsonAge.message, "body must have required property 'age'")
    t.equal(jsonGender.message, "body must have required property 'gender'")
    t.equal(jsonHeight.message, "body must have required property 'height'")
    t.equal(jsonWeight.message, "body must have required property 'weight'")
    t.equal(jsonChronicDisorders.message, "body must have required property 'chronicDisorders'")
    t.equal(jsonPassword.message, "body must have required property 'password'")
  })
 */
