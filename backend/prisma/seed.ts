const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: "john@example.com",
      name: "John Doe",
      logs: {
        create: [
          {
            date: new Date(),
            intensity: 5,
            location: 101,
            notes: "Felt good today",
          },
          {
            date: new Date(),
            intensity: 7,
            location: 102,
            notes: "Bit more intense than usual",
          },
        ],
      },
    },
  });

  console.log("Dummy data inserted:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
