import cron from 'node-cron';
import Challenge from '../models/Challenge.js';

export const generateChallenges = async () => {
  try {
    const now = new Date();
    const challenges = [
      { title: 'Recipe Upload Sprint', description: 'Upload 5 recipes this week!', target: 5, type: 'upload', startDate: now, endDate: new Date(now.getTime() + 7*24*60*60*1000) },
      { title: 'Save Recipes Challenge', description: 'Save 10 recipes this week!', target: 10, type: 'save', startDate: now, endDate: new Date(now.getTime() + 7*24*60*60*1000) },
      { title: 'Review Marathon', description: 'Post 15 reviews this month!', target: 15, type: 'review', startDate: now, endDate: new Date(now.getTime() + 30*24*60*60*1000) }
    ];
    await Challenge.insertMany(challenges);
    console.log('Challenges generated at:', now.toLocaleString('en-IN'));
  } catch (error) {
    console.error('Error generating challenges:', error);
  }
};

export const scheduleChallenges = () => {
  console.log("✅ Cron job registered!");
  cron.schedule('0 16 * * *', generateChallenges, { scheduled: true, timezone: 'Asia/Kolkata' });
};

