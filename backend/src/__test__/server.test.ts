import { test } from 'tap'
import buildServer from '../server'

void test('Test url: /healthcheck, method: get Endpoint', async (t) => {
  const fastify = buildServer()

  t.teardown(() => {
    void fastify.close()
  })

  const response = await fastify.inject({
    method: 'GET',
    url: '/healthcheck'
  })

  t.equal(response.statusCode, 200)
  t.same(response.json(), { status: 'ok' })
})

void test('Test url: root, method: get Endpoint', async (t) => {
  const fastify = buildServer()

  t.teardown(() => {
    void fastify.close()
  })

  const response = await fastify.inject({
    method: 'GET',
    url: '/'
  })

  t.equal(response.statusCode, 200)
  t.same(response.json(), { message: 'Sleep Quality API' })
})
