const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const admin = require("../VolunteerAPI/firebase/firebaseAdmin.js");

async function seed() {
  try {
    console.log("🌱 Seeding database...\n");

    // Clear existing data
    await prisma.opportunity.deleteMany();
    await prisma.organization.deleteMany();

    // Load JSON data
    const opportunityData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "./data/opportunity.json"), "utf8")
    );

    const organizationData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "./data/organizations.json"), "utf8")
    );

    console.log("📋 Seeding organizations...");
    for (const org of organizationData) {
      await prisma.organization.create({
        data: {
          name: org.name,
          tags: org.tags,
          location: org.location,
        },
      });
    }
    console.log(`✅ Created ${organizationData.length} organizations`);

    const organizations = await prisma.organization.findMany();

    console.log("\n🎯 Seeding opportunities...");
    for (let i = 0; i < opportunityData.length; i++) {
      const opportunity = opportunityData[i];

      if (!opportunity.organizationId && opportunity.organizationName) {
        const org = organizations.find(
          (o) => o.name === opportunity.organizationName
        );
        if (org) {
          opportunity.organizationId = org.id;
        } else {
          throw new Error(
            `Organization "${opportunity.organizationName}" not found for opportunity "${opportunity.name}"`
          );
        }
      } else if (!opportunity.organizationId) {
        opportunity.organizationId = organizations[i % organizations.length].id;
      }

      await prisma.opportunity.create({
        data: {
          name: opportunity.name,
          tags: opportunity.tags,
          requirements: opportunity.requirements,
          description: opportunity.description,
          location: opportunity.location,
          skills: opportunity.skills,
          imageUrl: opportunity.imageUrl,
          status: opportunity.status,
          points: opportunity.points,
          organizationId: opportunity.organizationId,
        },
      });
    }
    console.log(`✅ Created ${opportunityData.length} opportunities`);

    // ✅ Firebase user seeding
    console.log("\n👤 Seeding users from Firebase Auth...");
    const { users: firebaseUsers } = await admin.auth().listUsers(1000);

    for (const fbUser of firebaseUsers) {
      const { uid, email, displayName, photoURL } = fbUser;

      await prisma.user.upsert({
        where: { firebaseUid: uid },
        update: {},
        create: {
          firebaseUid: uid,
          username: displayName || email?.split("@")[0] || `user_${uid.slice(0, 6)}`,
          name: displayName || null,
          avatarUrl:
            photoURL ||
            "https://i.postimg.cc/wT6j0qvg/Screenshot-2025-07-09-at-3-46-05-PM.png",
          points: 0,
          level: 1,
        },
      });
    }

    console.log(`✅ Seeded ${firebaseUsers.length} Firebase users`);

    console.log("\n🎉 Seeding complete!");
  } catch (err) {
    console.error("❌ Error seeding:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
