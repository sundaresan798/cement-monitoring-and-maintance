/**
 * Demo Users Seeder
 * 
 * Seeds three pre-configured cement plant users with roles:
 * - Admin: admin@cementplant.com
 * - Plant Manager: manager@cementplant.com
 * - Operator: operator@cementplant.com
 * 
 * Default Demo Password: Password@123
 * All passwords are saved as bcrypt hashes, never plain text.
 */

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { UserModel, inMemoryUsers, InMemoryUser } from '../models/User';

export const DEMO_PASSWORD = 'Password@123';

export const seedInitialUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, salt);

  const initialSeedData = [
    {
      name: 'Sundaresan S',
      email: 'admin@cementplant.com',
      password: hashedPassword,
      role: 'admin' as const
    },
    {
      name: 'Rajesh Sharma',
      email: 'manager@cementplant.com',
      password: hashedPassword,
      role: 'plant_manager' as const
    },
    {
      name: 'Marcus Brody',
      email: 'operator@cementplant.com',
      password: hashedPassword,
      role: 'operator' as const
    }
  ];

  // 1. Seed into in-memory store
  for (const item of initialSeedData) {
    const existing = inMemoryUsers.find((u) => u.email === item.email);
    if (!existing) {
      inMemoryUsers.push({
        id: `seed_${item.role}_${Date.now()}`,
        name: item.name,
        email: item.email,
        password: item.password,
        role: item.role,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }

  // 2. Seed into MongoDB if connected
  if (mongoose.connection.readyState === 1) {
    try {
      for (const item of initialSeedData) {
        const exists = await UserModel.findOne({ email: item.email });
        if (!exists) {
          // Direct insert with already-hashed password to avoid double-hashing
          await UserModel.collection.insertOne({
            name: item.name,
            email: item.email,
            password: item.password,
            role: item.role,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
      console.log('[Seed] Demo users successfully verified in MongoDB.');
    } catch (err: any) {
      console.log('[Seed] Note: Seeding to MongoDB failed, stored in memory:', err?.message);
    }
  }

  console.log('[Seed] Seeded demo users ready:');
  console.log('       - Admin: admin@cementplant.com');
  console.log('       - Manager: manager@cementplant.com');
  console.log('       - Operator: operator@cementplant.com');
  console.log('       - Demo Password: Password@123');
};
