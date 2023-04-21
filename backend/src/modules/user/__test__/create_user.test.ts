import { test } from 'tap'
import { ImportMock } from 'ts-mock-imports'
import buildServer from '../../../server'
import { fakeInputUser, fakeResponseUser } from '../../../utils/test.helpers'
import prisma from '../../../utils/database'
import * as userServices from '../user.services'
import { CreateUserResponse } from '../user.schemas'

void test('POST `api/users` - create user successfully with test database',
  async (t) => {
    t.teardown(async () => {
      await fastify.close()
      await prisma.user.deleteMany()
    })

    const fastify = buildServer()

    const user = fakeInputUser()

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        ...user
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
    t.same(typeof json.id, 'string')
  })

void test('POST `api/users` - create user successfully with mock createUser',
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
