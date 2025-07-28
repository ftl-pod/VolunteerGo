import axios from "axios";


const badgeService = {
    async checkNewcomerBadge(firebaseUid, setBadgeEarned) {
      try {
        // Get full user with database ID
        const { data: user } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${firebaseUid}`);

        const hasBadge = user.badges.some(b => b.name === "Newcomer");
        if (!hasBadge) {
          const { data: badge } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/badges/give`, {
            userId: user.id,
            badgeName: "Newcomer Badge",
          });
          if (setBadgeEarned) setBadgeEarned(badge);
        }
      } catch (err) {
        console.error("Error checking Newcomer badge:", err);
      }
    },


async checkFirstApplication(userId, userOpportunitiesCount, setBadgeEarned) {
  console.log("[BadgeService] checkFirstApplication called with:", { userId, userOpportunitiesCount });

  if (userOpportunitiesCount !== 0) {
    console.log("[BadgeService] Not first application, count =", userOpportunitiesCount);
    return;
  }

  try {
    const { data: user } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${userId}`);
    console.log("[BadgeService] Fetched user data:", user);

    const hasBadge = user.badges.some(b => b.name === "First Steps");
    console.log("[BadgeService] User already has badge?", hasBadge);

    if (!hasBadge) {
      const { data: badge } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/badges/give`, {
        userId: user.id,
        badgeName: "First Steps",
      });
      console.log("[BadgeService] Badge awarded:", badge);
      if (setBadgeEarned) setBadgeEarned(badge);
    } else {
      console.log("[BadgeService] Badge not awarded because user already has it");
    }
  } catch (err) {
    console.error("[BadgeService] Error checking First Steps badge:", err);
  }
},

  async checkCategoryBadge(userId, opportunityTags, setBadgeEarned) {
    const tagToBadgeMap = {
      animal: "Animal Advocate",
      community: "Heart of the Community",
      environment: "Planet Protector",
    };

    try {
      const { data: user } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`);
      const badgeNames = user.badges.map(b => b.name);

      for (const tag of opportunityTags) {
        const lowerTag = tag.toLowerCase();
        const badgeName = tagToBadgeMap[lowerTag];

        if (badgeName && !badgeNames.includes(badgeName)) {
          const { data: badge } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/badges/give`, {
            userId,
            badgeName,
          });
          if (setBadgeEarned) setBadgeEarned(badge);
        }
      }
    } catch (err) {
      console.error("Error checking category badges:", err);
    }
  },

  async checkLeaderboardBadge(userId, isOnLeaderboard, setBadgeEarned) {
    if (!isOnLeaderboard) return;

    try {
      const { data: user } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`);
      const hasBadge = user.badges.some(b => b.name === "Leaderboard");

      if (!hasBadge) {
        const { data: badge } = await axios.post(`{import.meta.env.VITE_API_BASE_URL}/badges/give`, {
          userId,
          badgeName: "Leaderboard",
        });
        if (setBadgeEarned) setBadgeEarned(badge);
      }
    } catch (err) {
      console.error("Error checking leaderboard badge:", err);
    }
  },
};

export default badgeService;
