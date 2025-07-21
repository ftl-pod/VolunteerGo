const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

async function seed() {
  try {
    console.log("🌱 Seeding database...\n");

    await prisma.opportunity.deleteMany();
    await prisma.organization.deleteMany();

    const opportunityData = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          "./opp_scraper/opp_scraper/opportunity.json"
        ),
        "utf8"
      )
    );

    
    const uniqueOrgsMap = new Map();

    for (const opp of opportunityData) {
      const orgName = opp.organizationName?.trim();
      if (!orgName) continue;

      if (!uniqueOrgsMap.has(orgName)) {
        uniqueOrgsMap.set(orgName, {
          name: orgName,
          tags: opp.orgTags?.[0] ?? [],
          location: opp.orgLocation?.[0] ?? "Unknown Location",
        });
      }
    }

    const uniqueOrgs = Array.from(uniqueOrgsMap.values());

    console.log("📋 Seeding organizations...");
    for (const org of uniqueOrgs) {
      await prisma.organization.create({
        data: {
          name: org.name,
          tags: org.tags,
          location: org.location,
        },
      });
    }
    console.log(`✅ Created ${uniqueOrgs.length} organizations`);


    const organizations = await prisma.organization.findMany();

    console.log("\n🎯 Seeding opportunities...");
    for (const opportunity of opportunityData) {
      const org = organizations.find(
        (o) => o.name === opportunity.organizationName
      );

      if (!org) {
        console.warn(
          `⚠️ Organization not found for opportunity "${opportunity.name}"`
        );
        continue;
      }
      
      await prisma.opportunity.create({
        data: {
          name: opportunity.name,
          tags: opportunity.tags,
          requirements: opportunity.requirements,
          description: opportunity.description,
          location: opportunity.volunteerLocation,
          skills: opportunity.skills,
          imageUrl: opportunity.imageUrl,
          //volunteersNeeded: opportunity.volunteersNeeded,
          status: opportunity.status,
          points: opportunity.points ?? 10,
          organizationId: org.id,
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


// you need to download python first, at least version 3.11
// then you need to install scrapy with pip3 install scrapy
// then you need to navigate to this directory where the spider is located /opp_scraper
// then you can run the spider with scrapy crawl opportunity 
// then go back to volunteerapi directory in terminal and run node seed. js
// then go to http://localhost:5173/map in the browser to see the map populated with the opporunities or th eopportunity grid even, idk