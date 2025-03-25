import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 查询所有用户
  const users = await prisma.user.findMany()
  console.log('所有用户:')
  console.log(JSON.stringify(users, null, 2))
  
  // 查询所有图书
  const books = await prisma.book.findMany()
  console.log('所有图书:')
  console.log(JSON.stringify(books, null, 2))
  
  // 查询所有验证码
  const codes = await prisma.verificationCode.findMany()
  console.log('所有验证码:')
  console.log(JSON.stringify(codes, null, 2))
  
  // 查询所有读者
  const readers = await prisma.reader.findMany()
  console.log('所有读者:')
  console.log(JSON.stringify(readers, null, 2))
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