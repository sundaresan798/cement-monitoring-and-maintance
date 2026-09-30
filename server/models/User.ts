/**
 * User Model
 * 
 * MongoDB / Mongoose Schema for User Authentication & Roles.
 * Implements bcrypt password hashing on save and password comparison methods.
 * Also includes an in-memory mirror store for fallback if MongoDB server is offline.
 */

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'plant_manager' | 'operator';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// User Schema Definition
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'plant_manager', 'operator'],
        message: '{VALUE} is not a supported role'
      },
      default: 'operator'
    }
  },
  {
    timestamps: true
  }
);

// Hash password with bcrypt before saving
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if mongoose model already exists
export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// In-Memory User Store (Ensures 100% testability if external MongoDB is offline)
export interface InMemoryUser {
  id: string;
  name: string;
  email: string;
  password: string; // bcrypt hashed
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export const inMemoryUsers: InMemoryUser[] = [];

/**
 * Universal User Repository: Checks Mongoose first, falls back to inMemoryUsers
 */
export const UserRepository = {
  async findByEmail(email: string): Promise<{
    user: any;
    comparePassword: (pwd: string) => Promise<boolean>;
  } | null> {
    const cleanEmail = email.toLowerCase().trim();

    // 1. Try Mongoose if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await UserModel.findOne({ email: cleanEmail });
        if (doc) {
          return {
            user: doc,
            comparePassword: (pwd: string) => doc.comparePassword(pwd)
          };
        }
      } catch (err) {
        console.error('Mongoose findByEmail error, falling back:', err);
      }
    }

    // 2. Fallback to in-memory store
    const memUser = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!memUser) return null;

    return {
      user: memUser,
      comparePassword: async (pwd: string) => bcrypt.compare(pwd, memUser.password)
    };
  },

  async findById(id: string): Promise<any | null> {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await UserModel.findById(id).select('-password');
        if (doc) return doc;
      } catch (err) {
        // Continue to memory
      }
    }

    const memUser = inMemoryUsers.find((u) => u.id === id);
    if (!memUser) return null;
    const { password, ...safeUser } = memUser;
    return safeUser;
  },

  async create(userData: {
    name: string;
    email: string;
    password: string; // plain text, to be hashed
    role: UserRole;
  }): Promise<any> {
    const cleanEmail = userData.email.toLowerCase().trim();

    // 1. Try Mongoose if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const newUser = new UserModel({
          name: userData.name,
          email: cleanEmail,
          password: userData.password,
          role: userData.role
        });
        await newUser.save();
        return {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        };
      } catch (err) {
        console.error('Mongoose user create error, saving in memory:', err);
      }
    }

    // 2. In-memory creation with real bcrypt hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newMemUser: InMemoryUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: userData.name,
      email: cleanEmail,
      password: hashedPassword,
      role: userData.role,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryUsers.push(newMemUser);

    return {
      id: newMemUser.id,
      name: newMemUser.name,
      email: newMemUser.email,
      role: newMemUser.role,
      createdAt: newMemUser.createdAt,
      updatedAt: newMemUser.updatedAt
    };
  },

  async findAll(): Promise<any[]> {
    if (mongoose.connection.readyState === 1) {
      try {
        return await UserModel.find().select('-password').sort({ createdAt: -1 });
      } catch (err) {
        // Fallback
      }
    }

    return inMemoryUsers.map(({ password, ...rest }) => rest);
  }
};
