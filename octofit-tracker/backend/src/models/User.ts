import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 1 },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    minlength: 1,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email must be valid'],
  },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  // Lowercased so it matches Workout.focus lookups in the suggestion service.
  fitnessGoal: { type: String, required: true, trim: true, lowercase: true, minlength: 1 },
});

export const User = model('User', userSchema);
