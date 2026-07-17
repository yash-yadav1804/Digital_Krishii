const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const roles = ["FARMER", "BUYER", "ADMIN"];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminFirstName = process.env.ADMIN_FIRST_NAME || "Digital";
  const adminLastName = process.env.ADMIN_LAST_NAME || "Admin";

  if (adminEmail && adminPassword) {
    const adminRole = await prisma.role.findUnique({
      where: { name: "ADMIN" },
    });

    if (!adminRole) {
      throw new Error("ADMIN role not found");
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await prisma.user.create({
        data: {
          firstName: adminFirstName,
          lastName: adminLastName,
          email: adminEmail,
          password: hashedPassword,
          status: "ACTIVE",
          roles: {
            create: {
              roleId: adminRole.id,
            },
          },
        },
      });
    } else {
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          firstName: adminFirstName,
          lastName: adminLastName,
          status: "ACTIVE",
        },
      });

      const hasAdminRole = existingAdmin.roles.some(
        (userRole) => userRole.role.name === "ADMIN",
      );

      if (!hasAdminRole) {
        await prisma.userRole.create({
          data: {
            userId: existingAdmin.id,
            roleId: adminRole.id,
          },
        });
      }
    }

    console.log("Admin user seeded successfully");
  }

  const contractTemplates = [
    {
      type: "MARKET_SPECIFICATION",
      title: "Market Specification Contract",
      description:
        "A contract where farmer and buyer agree on crop type, quantity, quality, price, delivery date, and payment terms.",
      pdfUrl: null,
    },
    {
      type: "RESOURCE_PROVIDING",
      title: "Resource Providing Contract",
      description:
        "A contract where buyer or sponsor provides seeds, fertilizers, pesticides, equipment, or technical support to the farmer.",
      pdfUrl: null,
    },
    {
      type: "PRODUCTION_MANAGEMENT",
      title: "Production Management Contract",
      description:
        "A contract where production methods, farming guidelines, quality control, and management responsibilities are defined.",
      pdfUrl: null,
    },
    {
      type: "SHARED_RISK",
      title: "Shared Risk Contract",
      description:
        "A contract where farmer and buyer share risks related to crop failure, weather, pests, market changes, or production loss.",
      pdfUrl: null,
    },
    {
      type: "VERTICAL_INTEGRATION",
      title: "Vertical Integration Contract",
      description:
        "A contract where the buyer or company is involved in multiple stages such as production, processing, purchase, and distribution.",
      pdfUrl: null,
    },
    {
      type: "CROP_INSURANCE",
      title: "Crop Insurance Contract",
      description:
        "A contract related to crop insurance coverage, risks, premium, claim process, deductibles, and compensation rules.",
      pdfUrl: null,
    },
  ];

  for (const template of contractTemplates) {
    await prisma.contractTemplate.upsert({
      where: { type: template.type },
      update: {
        title: template.title,
        description: template.description,
        pdfUrl: template.pdfUrl,
        isActive: true,
      },
      create: template,
    });
  }

  console.log("Default roles and contract templates seeded successfully");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
