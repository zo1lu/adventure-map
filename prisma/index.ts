const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here

    await prisma.user.create({
        data: {
          username: "zzzoe",
          email: "zoey1111@gmail.com",
        },
      })
    const allTypes = await prisma.user.findMany()
    console.log(allTypes)
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    // const allTypes = await prisma.geometryType.findMany()
    // console.log(allTypes)
    await prisma.$disconnect()
  })