// scripts/demo.js

const { PrismaClient } = require('@prisma/client');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

admin.initializeApp({
  credential: admin.credential.cert(require('./firebase/serviceAccountKey.json')),
});

async function getFirebaseUidByEmail(email) {
  const user = await admin.auth().getUserByEmail(email);
  return user.uid;
}

async function runDemoSetup() {
  const demoEmail = 'demo@gmail.com';
  let firebaseUid;

  try {
    console.log('🔐 Fetching Firebase UID...');
    firebaseUid = await getFirebaseUidByEmail(demoEmail);
  } catch (err) {
    console.error('❌ Failed to get Firebase UID for demo user:', err.message);
    return;
  }

  try {
    console.log('🎯 Fetching demo user and related data...');
    const demoUser = await prisma.user.findUnique({
      where: { firebaseUid },
    });
    if (!demoUser) throw new Error('Demo user not found in DB');
    const demoUserId = demoUser.id;

    // Pre-fetch badges
    const badgeIds = await prisma.badge.findMany({
      where: {
        name: {
          in: ['Newcomer Badge'],
        },
      },
      select: { id: true },
    });

    // Pre-fetch incoming requesters
    const requesterUsernames = ['flower', 'george', 'cactus', 'nature'];
    const requesterUsers = await prisma.user.findMany({
      where: {
        username: { in: requesterUsernames },
      },
      select: { id: true, username: true },
    });

    const foundUsernames = new Set(requesterUsers.map((u) => u.username));
    requesterUsernames.forEach((u) => {
      if (!foundUsernames.has(u)) {
        console.warn(`⚠️ User "${u}" not found, will skip their friend request.`);
      }
    });

    // Pre-fetch saved "seniors" opportunities if needed (adjust filtering if you have tags)
    const seniorsOpps = await prisma.opportunity.findMany({
      where: {
        savedByUsers: {
          some: { id: demoUserId },
        },
        // e.g., if you have a tag system: tags: { has: 'seniors' }
      },
      select: { id: true },
    });

    console.log('🚀 Running demo reset transaction...');
    await prisma.$transaction(
      async (tx) => {
        // 1. Reset points and level
        console.log('📊 Resetting points and level...');
        await tx.user.update({
          where: { id: demoUserId },
          data: {
            points: 10,
            level: 1,
          },
        });

        // 2. Set badges
        console.log('🏅 Setting badges...');
        await tx.user.update({
          where: { id: demoUserId },
          data: {
            badges: {
              set: [],
              connect: badgeIds.map((b) => ({ id: b.id })),
            },
          },
        });

        // 3. Clear all applied opportunities
        console.log('🧹 Clearing all applied opportunities...');
        await tx.user.update({
          where: { id: demoUserId },
          data: {
            opportunities: {
              set: [],
            },
          },
        });

        // 4. Clear saved "seniors" opportunities if any
        if (seniorsOpps.length > 0) {
          console.log('❌ Disconnecting saved "seniors" opportunities...');
          await tx.user.update({
            where: { id: demoUserId },
            data: {
              savedOpportunities: {
                disconnect: seniorsOpps.map((o) => ({ id: o.id })),
              },
            },
          });
        }

        // 5. Clear all friends (both sides)
        console.log('🤝 Clearing all friends...');
        await tx.user.update({
          where: { id: demoUserId },
          data: {
            friends: { set: [] },
            friendOf: { set: [] },
          },
        });

        // 6. Delete existing friend requests involving demo user
        console.log('✂️ Deleting existing friend requests...');
        await tx.friendRequest.deleteMany({
          where: {
            OR: [{ senderId: demoUserId }, { receiverId: demoUserId }],
          },
        });

        // 7. Connect friends and create pending friend requests
        console.log('🔄 Connecting friends and sending requests...');
        const friendUsernames = ['nature', 'cactus'];
        const requestUsernames = ['flower', 'george'];

        const friendUsers = requesterUsers.filter((u) =>
        friendUsernames.includes(u.username)
        );
        const requestUsers = requesterUsers.filter((u) =>
        requestUsernames.includes(u.username)
        );

        // Add friends (mutual)
        for (const friend of friendUsers) {
        if (friend.id === demoUserId) continue;
        await tx.user.update({
            where: { id: demoUserId },
            data: {
            friends: {
                connect: { id: friend.id },
            },
            },
        });
        await tx.user.update({
            where: { id: friend.id },
            data: {
            friends: {
                connect: { id: demoUserId },
            },
            },
        });
        }

        // Create incoming friend requests
        for (const requester of requestUsers) {
        if (requester.id === demoUserId) continue;
        await tx.friendRequest.create({
            data: {
            senderId: requester.id,
            receiverId: demoUserId,
            status: 'pending',
            },
        });
        }

      },
      {
        // bump timeout to 15 seconds to avoid expiration on slower environments
        timeout: 15000,
      }
    );

    console.log('✅ Demo setup complete.');
  } catch (err) {
    console.error('❌ Error during demo setup:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

runDemoSetup();
