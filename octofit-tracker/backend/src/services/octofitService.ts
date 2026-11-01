import { Activity, Team, User, Workout } from '../models/index.js';
import { Types } from 'mongoose';

type InputRecord = Record<string, unknown>;

function badRequest(message: string) {
  return Object.assign(new Error(message), { status: 400 });
}

function isRecord(value: unknown): value is InputRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isObjectId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
}

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(input: unknown) {
  if (!isRecord(input)) throw badRequest('Activity must be an object');
  const { userId, teamId, type, minutes } = input;
  if (!isObjectId(userId) || !isObjectId(teamId)) {
    throw badRequest('Valid userId and teamId are required');
  }
  if (typeof type !== 'string' || !type.trim()) throw badRequest('Activity type is required');
  if (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes < 1) {
    throw badRequest('Activity minutes must be a positive number');
  }

  const [user, team] = await Promise.all([User.findById(userId), Team.findById(teamId)]);
  if (!user || !team) throw badRequest('Activity user and team must exist');

  return Activity.create({
    user: user._id,
    team: team._id,
    type: type.trim(),
    minutes,
    points: minutes,
    occurredAt: new Date(),
  });
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  if (!isRecord(input)) throw badRequest('Team must be an object');
  const { name, mascot } = input;
  if (typeof name !== 'string' || !name.trim()) throw badRequest('Team name is required');
  if (typeof mascot !== 'string' || !mascot.trim()) throw badRequest('Team mascot is required');

  const suppliedMembers = input.members ?? [];
  if (!Array.isArray(suppliedMembers) || suppliedMembers.some((member) => !isObjectId(member))) {
    throw badRequest('Team members must be an array of valid user IDs');
  }
  const memberIds = [...new Set(suppliedMembers)];
  if (memberIds.length && await User.countDocuments({ _id: { $in: memberIds } }) !== memberIds.length) {
    throw badRequest('Every team member must exist');
  }

  const members = memberIds.map((id) => new Types.ObjectId(id));
  const team = await Team.create({ name: name.trim(), mascot: mascot.trim(), members });
  if (members.length) {
    await Team.updateMany(
      { members: { $in: members }, _id: { $ne: team._id } },
      { $pull: { members: { $in: members } } },
    );
    await User.updateMany({ _id: { $in: members } }, { $set: { team: team._id } });
  }
  return team;
}

export async function getLeaderboard() {
  const [teams, totals] = await Promise.all([
    Team.find().lean(),
    Activity.aggregate<{ _id: Types.ObjectId; totalPoints: number }>([
      { $group: { _id: '$team', totalPoints: { $sum: '$points' } } },
    ]),
  ]);
  const pointsByTeam = new Map(totals.map(({ _id, totalPoints }) => [_id.toString(), totalPoints]));
  return teams
    .map((team) => ({
      teamName: team.name,
      totalPoints: pointsByTeam.get(team._id.toString()) ?? 0,
    }))
    .sort((left, right) => right.totalPoints - left.totalPoints || left.teamName.localeCompare(right.teamName))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export async function suggestWorkouts(userEmail: string) {
  const user = await User.findOne({ email: userEmail.trim().toLowerCase() }).lean();
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const activity = await Activity.findOne({ user: user._id }).sort({ occurredAt: -1 }).lean();
  const activityType = activity?.type.toLowerCase() ?? '';
  const activityFocus = /strength|weight|resistance/.test(activityType)
    ? 'strength'
    : /run|cycle|cardio|walk/.test(activityType)
      ? 'endurance'
      : '';
  const focus = activityFocus || user.fitnessGoal.trim().toLowerCase();
  const workouts = await Workout.find({ focus }).lean();
  const reason = activity
    ? `Suggested for your ${activity.type} activity and ${user.fitnessGoal} goal`
    : `Suggested for your ${user.fitnessGoal} goal`;
  return workouts.map((workout) => ({ ...workout, reason }));
}

export { User };
