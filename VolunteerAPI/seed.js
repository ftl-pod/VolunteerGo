const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

async function seed() {
  try {
    console.log("🌱 Seeding database...\n");

    // Clear existing data (in order due to relations)
    await prisma.opportunity.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();

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

    // Fetch all organizations to get their IDs
    const organizations = await prisma.organization.findMany();

    // Seed opportunities
    console.log("\n🎯 Seeding opportunities...");
    for (let i = 0; i < opportunityData.length; i++) {
      const opportunity = opportunityData[i];
      // Find the organization by name (assuming your opportunityData has organizationName)
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
        // fallback: assign round-robin
        opportunity.organizationId = organizations[i % organizations.length].id;
      }
      await prisma.opportunity.create({
        data: {
          name: opportunity.name,
          tags: opportunity.tags,
          description: opportunity.description,
          location: opportunity.location,
          skills: opportunity.skills,
          imageUrl: opportunity.imageUrl,
          volunteersNeeded: opportunity.volunteersNeeded,
          status: opportunity.status,
          points: opportunity.points,
          organizationId: opportunity.organizationId,
        },
      });
    }
    console.log(`✅ Created ${opportunityData.length} opportunities`);

    console.log("\n🎉 Seeding complete!");
  } catch (err) {
    console.error("❌ Error seeding:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
