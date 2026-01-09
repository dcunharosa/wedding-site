import { PrismaClient, ActorType } from '@prisma/client';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

// Constants for role types (schema uses strings for roles)
const AdminRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
};

// Helper to hash passwords using argon2 (same as production)
async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

// Helper to generate RSVP token hash
function generateRsvpToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data (in development)
  console.log('🗑️  Cleaning existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.rsvpHouseholdExtras.deleteMany();
  await prisma.rsvpGuestResponse.deleteMany();
  await prisma.rsvpSubmission.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.household.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.content.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create Admin Users
  console.log('👤 Creating admin users...');
  const admin1 = await prisma.adminUser.create({
    data: {
      email: 'admin@wedding.com',
      name: 'Admin User',
      passwordHash: await hashPassword('admin123'),
      role: AdminRole.SUPER_ADMIN,
    },
  });

  const admin2 = await prisma.adminUser.create({
    data: {
      email: 'couple@wedding.com',
      name: 'Couple Admin',
      passwordHash: await hashPassword('couple123'),
      role: AdminRole.ADMIN,
    },
  });

  // Create Content Pages
  console.log('📄 Creating content pages...');
  await prisma.content.createMany({
    data: [
      {
        key: 'HOME_HERO',
        json: {
          heading: 'Filipa & Duarte',
          subheading: '',
          date: '12 de Setembro de 2026',
          location: 'Comporta, Portugal',
          tagline: 'A relaxed weekend by the beach — with plenty of music.',
          imageId: null,
        },
        updatedByAdminId: admin1.id,
      },
      {
        key: 'SCHEDULE',
        json: {
          heading: 'The Weekend',
          sections: [
            { day: 'Friday', time: 'Evening', title: 'Welcome Drinks', description: 'Casual drinks at sunset', dressCode: 'Beach casual' },
            { day: 'Saturday', time: '4:00 PM', title: 'Ceremony', description: 'Outdoor ceremony', dressCode: 'Beach casual' },
            { day: 'Saturday', time: '6:00 PM', title: 'Dinner', description: 'Seated dinner', dressCode: 'Beach casual' },
            { day: 'Saturday', time: '9:00 PM', title: 'Party', description: 'Dancing until late', dressCode: 'Beach casual' },
            { day: 'Sunday', time: '11:00 AM', title: 'Farewell Brunch', description: 'Beach brunch & goodbye', dressCode: 'Beach casual' },
          ],
        },
        updatedByAdminId: admin1.id,
      },
      {
        key: 'VENUE',
        json: {
          heading: 'The Venue',
          name: 'Comporta',
          address: 'Comporta, Alcácer do Sal, Portugal',
          description: 'A relaxed coastal village where the dunes meet the sea, known for its rice fields, pine forests, and laid-back atmosphere.',
          mapUrl: 'https://maps.google.com/?q=Comporta+Portugal',
          parking: 'Parking available',
          accommodation: 'See the Stay page for accommodation options.',
          imageId: null,
        },
        updatedByAdminId: admin1.id,
      },
      {
        key: 'GIFTS_PAGE',
        json: {
          heading: 'Gifts',
          body: 'Your presence at our wedding is the greatest gift of all. However, if you wish to give us something, we would be grateful for a contribution towards our honeymoon adventures.',
          bankDetails: {
            accountName: 'Filipa & Duarte',
            sortCode: '',
            accountNumber: '',
            reference: 'Your surname',
          },
        },
        updatedByAdminId: admin1.id,
      },
      {
        key: 'FAQ',
        json: {
          heading: 'Frequently Asked Questions',
          items: [
            {
              question: 'What should I wear?',
              answer: 'We suggest smart casual attire. Ladies might want to avoid stiletto heels as parts of the venue are outdoors.',
            },
            {
              question: 'Can I bring children?',
              answer: 'We love your little ones, but we have decided to keep our wedding adults-only. We hope you understand.',
            },
            {
              question: 'What time should I arrive?',
              answer: 'Please arrive by 1:45 PM to be seated before the ceremony begins at 2:00 PM.',
            },
          ],
        },
        updatedByAdminId: admin1.id,
      },
    ],
  });

  // Create Households with Guests
  console.log('🏠 Creating households and guests...');

  // Household 1: Smith Family
  const smithToken = generateRsvpToken();
  const smithHousehold = await prisma.household.create({
    data: {
      displayName: 'The Smith Family',
      rsvpTokenHash: smithToken.hash,
      notes: 'Old friends from university',
    },
  });
  console.log(`   📨 Smith family RSVP token: ${smithToken.token}`);

  await prisma.guest.createMany({
    data: [
      {
        householdId: smithHousehold.id,
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '+447700900123',
        isPrimary: true,
      },
      {
        householdId: smithHousehold.id,
        firstName: 'Sarah',
        lastName: 'Smith',
        email: 'sarah.smith@example.com',
        phone: '+447700900124',
        isPrimary: false,
      },
    ],
  });

  // Household 2: Jones (with dependency rule)
  const jonesToken = generateRsvpToken();
  const jonesHousehold = await prisma.household.create({
    data: {
      displayName: 'Michael Jones & Guest',
      rsvpTokenHash: jonesToken.hash,
      notes: 'Groom\'s cousin',
    },
  });
  console.log(`   📨 Jones household RSVP token: ${jonesToken.token}`);

  const michaelJones = await prisma.guest.create({
    data: {
      householdId: jonesHousehold.id,
      firstName: 'Michael',
      lastName: 'Jones',
      email: 'michael.jones@example.com',
      phone: '+447700900125',
      isPrimary: true,
    },
  });

  // Guest with dependency: can't attend without Michael
  await prisma.guest.create({
    data: {
      householdId: jonesHousehold.id,
      firstName: 'Emma',
      lastName: 'Wilson',
      email: 'emma.wilson@example.com',
      isPrimary: false,
      attendanceRequiresGuestId: michaelJones.id,
    },
  });

  // Household 3: Brown Family (already RSVP'd)
  const brownToken = generateRsvpToken();
  const brownHousehold = await prisma.household.create({
    data: {
      displayName: 'The Brown Family',
      rsvpTokenHash: brownToken.hash,
      rsvpLastSubmittedAt: new Date('2025-12-15T14:30:00Z'),
    },
  });
  console.log(`   📨 Brown family RSVP token: ${brownToken.token}`);

  const davidBrown = await prisma.guest.create({
    data: {
      householdId: brownHousehold.id,
      firstName: 'David',
      lastName: 'Brown',
      email: 'david.brown@example.com',
      phone: '+447700900126',
      isPrimary: true,
    },
  });

  const lisaBrown = await prisma.guest.create({
    data: {
      householdId: brownHousehold.id,
      firstName: 'Lisa',
      lastName: 'Brown',
      email: 'lisa.brown@example.com',
      phone: '+447700900127',
      isPrimary: false,
    },
  });

  // Create RSVP submission for Brown family
  const brownSubmission = await prisma.rsvpSubmission.create({
    data: {
      householdId: brownHousehold.id,
      submittedAt: new Date('2025-12-15T14:30:00Z'),
      actorType: ActorType.GUEST,
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      responses: {
        create: [
          {
            guestId: davidBrown.id,
            attending: true,
            dietaryRestrictions: 'No shellfish',
          },
          {
            guestId: lisaBrown.id,
            attending: true,
            dietaryRestrictions: 'Vegetarian',
          },
        ],
      },
      extras: {
        create: {
          songRequestText: 'Dancing Queen by ABBA',
          songRequestSpotifyUrl: 'https://open.spotify.com/track/0GjEhVFGZW8afUYGChu3Rr',
        },
      },
    },
  });

  // Household 4: Wilson (declined)
  const wilsonToken = generateRsvpToken();
  const wilsonHousehold = await prisma.household.create({
    data: {
      displayName: 'The Wilson Family',
      rsvpTokenHash: wilsonToken.hash,
      rsvpLastSubmittedAt: new Date('2025-12-10T10:00:00Z'),
    },
  });
  console.log(`   📨 Wilson family RSVP token: ${wilsonToken.token}`);

  const robertWilson = await prisma.guest.create({
    data: {
      householdId: wilsonHousehold.id,
      firstName: 'Robert',
      lastName: 'Wilson',
      email: 'robert.wilson@example.com',
      isPrimary: true,
    },
  });

  await prisma.rsvpSubmission.create({
    data: {
      householdId: wilsonHousehold.id,
      submittedAt: new Date('2025-12-10T10:00:00Z'),
      actorType: ActorType.GUEST,
      responses: {
        create: [
          {
            guestId: robertWilson.id,
            attending: false,
          },
        ],
      },
    },
  });

  // Create audit log entries
  console.log('📝 Creating audit log entries...');
  await prisma.auditLog.createMany({
    data: [
      {
        actorType: ActorType.ADMIN,
        actorAdminId: admin1.id,
        action: 'HOUSEHOLD_CREATED',
        entityType: 'Household',
        entityId: smithHousehold.id,
        metadata: { displayName: 'The Smith Family' },
      },
      {
        actorType: ActorType.GUEST,
        householdId: brownHousehold.id,
        action: 'RSVP_SUBMITTED',
        entityType: 'RsvpSubmission',
        entityId: brownSubmission.id,
        metadata: { attending: 2, declined: 0 },
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Summary:');
  console.log(`   - Admin users: 2`);
  console.log(`   - Households: 4`);
  console.log(`   - Guests: 7`);
  console.log(`   - RSVP submissions: 2`);
  console.log(`   - Content pages: 5`);
  console.log('\n🔑 Login credentials:');
  console.log(`   Email: admin@wedding.com`);
  console.log(`   Password: admin123`);
  console.log(`\n   Email: couple@wedding.com`);
  console.log(`   Password: couple123`);
  console.log('\n🔗 RSVP Links:');
  console.log(`   Smith Family: http://localhost:3000/rsvp?t=${smithToken.token}`);
  console.log(`   Jones Household: http://localhost:3000/rsvp?t=${jonesToken.token}`);
  console.log(`   Brown Family: http://localhost:3000/rsvp?t=${brownToken.token}`);
  console.log(`   Wilson Family: http://localhost:3000/rsvp?t=${wilsonToken.token}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
