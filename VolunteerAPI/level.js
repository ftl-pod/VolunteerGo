import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function getLevelFromPoints(points) {
  if (points < 0) return 1;

  let level = 1;
  let totalPoints = 0;
  let pointsNeeded = 15;

  while (points >= totalPoints + pointsNeeded) {
    totalPoints += pointsNeeded;
    level++;
    pointsNeeded += 5;
  }

  return level;
}

async function updateAllUserLevels() {
  const users = await prisma.user.findMany();

  for (const user of users) {
    const correctLevel = getLevelFromPoints(user.points || 0);

    if (user.level !== correctLevel) {
      await prisma.user.update({
        where: { id: user.id },
        data: { level: correctLevel },
      });
      console.log(`Updated ${user.id} to level ${correctLevel}`);
    }
  }

  console.log("All user levels updated.");
  await prisma.$disconnect();
}

updateAllUserLevels().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
