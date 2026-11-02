import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 1 },
  mascot: { type: String, required: true, trim: true, minlength: 1 },
  members: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    default: [],
    validate: {
      validator: (members: unknown[]) => new Set(members.map(String)).size === members.length,
      message: 'Team members must be unique',
    },
  },
});

export const Team = model('Team', teamSchema);
