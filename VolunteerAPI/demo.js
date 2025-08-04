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
    console.log('🎯 Finding Demo user in DB...');
    const demoUser = await prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (!demoUser) throw new Error('Demo user not found in DB');

    const demoUserId = demoUser.id;

    // 1. Reset points and level
    console.log('📊 Resetting points and level...');
    await prisma.user.update({
      where: { id: demoUserId },
      data: {
        points: 10,
        level: 1,
      },
    });

    // 2. Set badges to "Newcomer Badge" and "First Steps"
    console.log('🏅 Setting badges...');
    const badgeIds = await prisma.badge.findMany({
      where: {
        name: {
          in: ['Newcomer Badge', 'First Steps'],
        },
      },
      select: { id: true },
    });

    await prisma.user.update({
      where: { id: demoUserId },
      data: {
        badges: {
          set: [], // clear existing
          connect: badgeIds.map((b) => ({ id: b.id })),
        },
      },
    });

    // 3. Clear all opportunities
    console.log('🧹 Clearing all applied opportunities...');
    await prisma.user.update({
      where: { id: demoUserId },
      data: {
        opportunities: {
          set: [],
        },
      },
    });

    // 4. Clear saved opportunities with tag "seniors"
    console.log('❌ Clearing saved opportunities with tag "seniors"...');
    const seniorsOpps = await prisma.opportunity.findMany({
      where: {
        tags: {
          has: 'seniors',
        },
        savedByUsers: {
          some: {
            id: demoUserId,
          },
        },
      },
    });

    if (seniorsOpps.length > 0) {
      await prisma.user.update({
        where: { id: demoUserId },
        data: {
          savedOpportunities: {
            disconnect: seniorsOpps.map((o) => ({ id: o.id })),
          },
        },
      });
    }

    console.log('✅ Demo setup complete.');
  } catch (err) {
    console.error('❌ Error during demo setup:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

runDemoSetup();
