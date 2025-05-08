// utils/assignBadges.js

function assignBadges(user) {
  const badges = [];

  if (user.points >= 10) badges.push("Bronze Star");
  if (user.points >= 200) badges.push("Silver Star");
  if (user.points >= 500) badges.push("Gold Star");
  if (user.points >= 1000) badges.push("Platinum Star");

  return badges;
}

export default assignBadges;
