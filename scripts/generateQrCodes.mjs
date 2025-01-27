import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'; // Use UUID for random QR codes
import crypto from 'crypto'; // To generate random activation codes

const prisma = new PrismaClient();

async function main() {
  // Number of QR codes to generate
  const numQrCodes = 10; // Adjust this number as needed

  // Generate QR codes
  const qrCodes = Array.from({ length: numQrCodes }).map(() => ({
    code: uuidv4(), // Generate a unique QR code
    activationCode: crypto.randomBytes(5).toString('hex'), // Generate a unique activation code
  }));

  try {
    // Insert QR codes into the database
    await prisma.qRCode.createMany({
      data: qrCodes,
    });

    console.log(`${numQrCodes} QR codes generated and saved to the database.`);
  } catch (error) {
    console.error('Error generating QR codes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
