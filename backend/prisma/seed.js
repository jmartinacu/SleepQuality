const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main () {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@prisma.io' },
    update: {},
    create: {
      email: 'admin@prisma.io',
      name: 'Admin'
    }
  })

  console.log({ admin })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
