import { PrismaClient } from "@prisma/client";
import { computeNextRenewalDate } from "@firearmour/shared";

const prisma = new PrismaClient();

async function main() {
  const business = await prisma.business.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Demo Fire Safety Co.",
    },
  });

  const existing = await prisma.customer.findFirst({ where: { businessId: business.id } });
  if (existing) {
    console.log("Seed data already present, skipping.");
    return;
  }

  const today = new Date();
  const daysAgo = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

  const acme = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "Acme Warehousing",
      contactPhone: "555-0101",
      contactEmail: "ops@acmewarehousing.example",
      addressLine1: "100 Industrial Way",
      city: "Springfield",
      state: "IL",
      postalCode: "62701",
      businessType: "Warehouse",
    },
  });

  const diner = await prisma.customer.create({
    data: {
      businessId: business.id,
      name: "Riverside Diner",
      contactPhone: "555-0102",
      contactEmail: "manager@riversidediner.example",
      addressLine1: "22 River Rd",
      city: "Springfield",
      state: "IL",
      postalCode: "62702",
      businessType: "Restaurant",
    },
  });

  const activeInstall = daysAgo(30);
  await prisma.unit.create({
    data: {
      customerId: acme.id,
      type: "ABC_DRY_CHEMICAL",
      size: "10 lb",
      serialNumber: "ACM-1001",
      installDate: activeInstall,
      renewalPeriod: "ANNUAL",
      renewalDate: computeNextRenewalDate(activeInstall, "ANNUAL"),
      location: "Loading dock",
    },
  });

  const dueSoonInstall = daysAgo(350);
  await prisma.unit.create({
    data: {
      customerId: acme.id,
      type: "CO2",
      size: "5 lb",
      serialNumber: "ACM-1002",
      installDate: dueSoonInstall,
      renewalPeriod: "ANNUAL",
      renewalDate: computeNextRenewalDate(dueSoonInstall, "ANNUAL"),
      location: "Server room",
    },
  });

  const expiredInstall = daysAgo(400);
  await prisma.unit.create({
    data: {
      customerId: diner.id,
      type: "WET_CHEMICAL",
      size: "6 L",
      serialNumber: "RVD-2001",
      installDate: expiredInstall,
      renewalPeriod: "ANNUAL",
      renewalDate: computeNextRenewalDate(expiredInstall, "ANNUAL"),
      location: "Kitchen - near fryer",
    },
  });

  console.log("Seed data created.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
