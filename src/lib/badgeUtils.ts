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

  const newBadges = [];

  // Early Adopter badge
  const earlyAdopterBadge = await prisma.badge.findFirst({
    where: { name: "Early Adopter" },
  });
  const userCount = await prisma.user.count();
  if (
    userCount <= 100 &&
    earlyAdopterBadge &&
    !user.badges.some((b) => b.id === earlyAdopterBadge.id)
  ) {
    newBadges.push(earlyAdopterBadge);
  }

  // First Project badge
  const firstProjectBadge = await prisma.badge.findFirst({
    where: { name: "First Project" },
  });
  if (
    user.projects.length > 0 &&
    firstProjectBadge &&
    !user.badges.some((b) => b.id === firstProjectBadge.id)
  ) {
    newBadges.push(firstProjectBadge);
  }

  // 100 Likes badge
  const likesGoldBadge = await prisma.badge.findFirst({
    where: { name: "100 Likes" },
  });
  if (
    user.totalLikes >= 100 &&
    likesGoldBadge &&
    !user.badges.some((b) => b.id === likesGoldBadge.id)
  ) {
    newBadges.push(likesGoldBadge);
  }
  if (newBadges.length > 0) {
    await prisma.user.update({
      where: { username },
      data: {
        badges: {
          connect: newBadges.map((badge) => ({ id: badge.id })),
        },
      },
    });
  }

  console.log(
    "Finished checkAndAssignBadges for user:",
    username,
    "New badges:",
    newBadges
  );
  return newBadges;
}
