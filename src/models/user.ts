import { Schema, model } from 'mongoose';
import bcryptjs from 'bcryptjs';
import validator from 'validator';

// Schema Pattern for User
export interface Users {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

//User Schema
const userSchema = new Schema<Users>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
          validator: (value: string) => validator.isEmail(value),
          message: 'Please enter a valid email address',
        },
      },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
  },
  {
    timestamps: true, 
  }
);

// Password hashing & Salting
userSchema.pre('save', async function () {

  if (!this.isModified('password')) {
    return;
  }
  if(this.password){
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
  }
    
});

// Compare the password for authentication
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcryptjs.compare(candidatePassword, this.password);
};

export const User = model<Users>('User', userSchema);