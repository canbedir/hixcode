import { prisma } from "./prisma";

export async function checkAndAssignBadges(username: string) {
  console.log("Starting checkAndAssignBadges for user:", username);
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      projects: true,
      badges: true,
    },
  });

  if (!user) {
    console.log("User not found for username:", username);
    return [];
  }

  // Toplam beğeni sayısına göre rozetler
  const likeMilestones = [100, 200, 300, 400, 500, 1000];
  const newBadges = [];

  for (const milestone of likeMilestones) {
    if (user.totalLikes >= milestone) {
      const badgeName = `${milestone} Likes`;
      const badge = await prisma.badge.findFirst({
        where: { name: badgeName },
      });
      if (badge && !user.badges.some((b) => b.id === badge.id)) {
        await prisma.user.update({
          where: { username },
          data: {
            badges: {
              connect: { id: badge.id },
            },
          },
        });
        newBadges.push(badge);
      }
    }
  }

  console.log("Finished checkAndAssignBadges for user:", username, "New badges:", newBadges);
  return newBadges;
}
