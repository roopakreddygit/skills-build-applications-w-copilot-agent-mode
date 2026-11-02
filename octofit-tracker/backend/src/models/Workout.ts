import { Schema, model } from 'mongoose';

const workoutSchema = new Schema({
  title: { type: String, required: true, trim: true, minlength: 1 },
  focus: { type: String, required: true, trim: true, lowercase: true, minlength: 1, index: true },
  minutes: { type: Number, required: true, min: 1 },
  difficulty: { type: String, required: true, trim: true, lowercase: true, enum: ['easy', 'moderate', 'hard'] },
});

export const Workout = model('Workout', workoutSchema);
