import { createClient } from 'redis'

const client = await createClient()
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect()

const key = 'key'

await client.set(key, 'expire in 1 minute', {
  EX: 10,
})

const delay = async (time) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}

while (1) {
  const ttl = await client.ttl(key)
  const content = await client.get(key)
  const isExist = await client.exists(key)

  if (!content) {
    console.error(`Key "${key}" has expired`)

    break
  }

  console.log(
    `Key is exist ${isExist} with content ${content} expire in ${ttl}`
  )

  await delay(100)
}

await client.disconnect()
