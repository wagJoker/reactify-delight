/**
 * @module seed
 * @description Seed script: 2 test users + 3 public events.
 * Run: npx ts-node seed.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seed() {
  console.log('🌱 Seeding database...');

  // Create 2 test users
  const users = [
    { email: 'alice@example.com', password: 'Password123!', display_name: 'Alice Johnson' },
    { email: 'bob@example.com', password: 'Password123!', display_name: 'Bob Smith' },
  ];

  const userIds: string[] = [];

  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { display_name: u.display_name },
    });
    if (error) {
      console.log(`⚠️  User ${u.email}: ${error.message}`);
      // Try to find existing user
      const { data: existing } = await supabase.auth.admin.listUsers();
      const found = existing?.users?.find((eu) => eu.email === u.email);
      if (found) userIds.push(found.id);
    } else {
      userIds.push(data.user.id);
      console.log(`✅ Created user: ${u.email}`);
    }
  }

  if (userIds.length < 2) {
    console.error('❌ Need at least 2 users');
    return;
  }

  // Create 3 public events
  const events = [
    {
      title: 'React Conf 2026',
      description: 'Annual React conference with workshops and talks from top engineers.',
      date: '2026-09-15',
      time: '10:00',
      location: 'Kyiv, UNIT.City',
      category: 'conference',
      visibility: 'public',
      organizer_id: userIds[0],
      max_participants: 200,
    },
    {
      title: 'TypeScript Meetup',
      description: 'Monthly TypeScript meetup for sharing best practices and new features.',
      date: '2026-08-20',
      time: '18:30',
      location: 'Lviv, IT Hub',
      category: 'meetup',
      visibility: 'public',
      organizer_id: userIds[1],
      max_participants: 50,
    },
    {
      title: 'Node.js Workshop',
      description: 'Hands-on workshop covering advanced Node.js patterns and performance optimization.',
      date: '2026-10-05',
      time: '09:00',
      location: 'Online (Zoom)',
      category: 'workshop',
      visibility: 'public',
      organizer_id: userIds[0],
      max_participants: 30,
    },
  ];

  const { error: eventsError } = await supabase.from('events').insert(events);
  if (eventsError) {
    console.error('❌ Events seed error:', eventsError.message);
  } else {
    console.log('✅ Created 3 sample events');
  }

  console.log('🎉 Seeding complete!');
  console.log('Test accounts:');
  console.log('  alice@example.com / Password123!');
  console.log('  bob@example.com / Password123!');
}

seed().catch(console.error);
