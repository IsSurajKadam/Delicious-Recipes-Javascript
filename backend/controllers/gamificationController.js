import User from '../models/User.js';
import Challenge from '../models/Challenge.js';
import mongoose from 'mongoose';

export const getGamification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const challenges = await Challenge.find({ endDate: { $gte: Date.now() } });
    res.status(200).json({
      points: user.points,
      badges: user.badges,
      challenges,
    });
  } catch (err) {
    console.error('Error fetching gamification data:', err);
    res.status(500).json({ error: 'Failed to fetch gamification data.' });
  }
};

// GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ points: -1 })
      .limit(10)
      .select('username points badges');
    res.status(200).json(topUsers);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
};

// GET /api/challenges
export const getUserChallenges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const now = new Date();
    // Clean up expired
    user.fetchedChallenges = user.fetchedChallenges.filter(
      item => new Date(item.endDate) >= now
    );
    await user.save();
    if (user.fetchedChallenges.length >= 2) {
      const saved = await Challenge.find({
        _id: { $in: user.fetchedChallenges.map(i => i.challengeId) }
      });
      return res.status(200).json(saved);
    }
    const fetchedIds = user.fetchedChallenges.map(i => i.challengeId.toString());
    const needed = 2 - user.fetchedChallenges.length;
    const newChallenges = await Challenge.aggregate([
      { $match: { endDate: { $gte: now }, _id: { $nin: fetchedIds.map(id => mongoose.Types.ObjectId(id)) } } },
      { $sample: { size: needed } }
    ]);
    const toStore = newChallenges.map(c => ({ challengeId: c._id.toString(), endDate: new Date(c.endDate) }));
    user.fetchedChallenges.push(...toStore);
    await user.save();
    res.status(200).json(newChallenges);
  } catch (err) {
    console.error('Error fetching challenges:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const completeChallenge = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error:'User not found.' });
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error:'Challenge not found.' });
    if (user.completedChallenges.includes(challenge._id)) {
      return res.status(400).json({ error:'Challenge already completed.' });
    }
    user.completedChallenges.push(challenge._id);
    await user.save();
    res.status(200).json({ message:'Challenge marked as completed.' });
  } catch (err) {
    console.error('Complete challenge error:', err);
    res.status(500).json({ error:'Failed to complete challenge.' });
  }
};
