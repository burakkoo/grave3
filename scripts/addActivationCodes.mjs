import { PrismaClient } from '@prisma/client';
import crypto from 'crypto'; // To generate random activation codes

const prisma = new PrismaClient();

async function main() {
  try {
    // Find all QR codes where activationCode is an empty string (assuming default is "")
    const qrCodes = await prisma.qRCode.findMany();

    console.log(`Found ${qrCodes.length} QR codes without activation codes`);

    // Update each QR code with a new activation code
    for (const qrCode of qrCodes) {
      const activationCode = crypto.randomBytes(5).toString('hex'); // Generate random 20-character hex code

      await prisma.qRCode.update({
        where: {
          id: qrCode.id,
        },
        data: {
          activationCode: activationCode,
        },
      });

      console.log(`QR Code ${qrCode.id} updated with activation code: ${activationCode}`);
    }

    console.log('All QR codes updated successfully');
  } catch (error) {
    console.error('Error updating QR codes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
