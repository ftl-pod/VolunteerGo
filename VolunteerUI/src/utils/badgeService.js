import axios from "axios";


const badgeService = {
    async checkNewcomerBadge(firebaseUid, setBadgeEarned) {
      try {
        // Get full user with database ID
        const { data: user } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${firebaseUid}`);

        const hasBadge = user.badges.some(b => b.name === "Newcomer Badge");
        if (!hasBadge) {
          const { data: badge } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/badges/give`, {
            userId: user.id,
            badgeName: "Newcomer Badge",
          });
          if (setBadgeEarned) setBadgeEarned(badge);
        }
        else{
          if (setBadgeEarned) setBadgeEarned(null);
        }
      } catch (err) {
        console.error("Error checking Newcomer badge:", err);
      }
    },


async checkFirstApplication(userId, userOpportunitiesCount, setBadgeEarned) {

  if (userOpportunitiesCount !== 0) {
    return;
  }

  try {
    const { data: user } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${userId}`);
    const hasBadge = user.badges.some(b => b.name === "First Steps");

    if (!hasBadge) {
      const { data: badge } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/badges/give`, {
        userId: user.id,
        badgeName: "First Steps",
      });
      if (setBadgeEarned) setBadgeEarned(badge);
    } else {
    }
  } catch (err) {
  }
},

  async checkCategoryBadge(userId, opportunityTags, setBadgeEarned) {
    const tagToBadgeMap = {
      animals: "Animal Advocate",
      community: "Heart of the Community",
      environment: "Planet Protector",
    };

    try {
      const { data: user } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${userId}`);
      const badgeNames = user.badges.map(b => b.name);

      for (const tag of opportunityTags) {
        const lowerTag = tag.toLowerCase();
        const badgeName = tagToBadgeMap[lowerTag];

        if (badgeName && !badgeNames.includes(badgeName)) {
          const { data: badge } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/badges/give`, {
            userId: user.id,
            badgeName,
          });
          if (setBadgeEarned) setBadgeEarned(badge);
        }
      }
    } catch (err) {
      console.error("Error checking category badges:", err);
    }
  },

  async checkLeaderboardBadge(userUid, setBadgeEarned) {
    try {
      // Get all users ordered by points
      const { data: users } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`);
      if (!users.length) return;

      // Get backend user record by uid to find backend id
      const { data: user } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${userUid}`);

      if (users[0].id === user.id) {
        console.log("#1")
        const hasBadge = user.badges.some(b => b.name === "Impact Leader");

        if (!hasBadge) {
          const { data: badge } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/badges/give`, {
            userId: user.id,
            badgeName: "Impact Leader",
          });

          if (setBadgeEarned) setBadgeEarned(badge);
        }
      }
    } catch (err) {
      console.error("Error checking leaderboard badge:", err);
    }
  },

  async checkConnectorBadge(firebaseUid, setBadgeEarned) {
    try {
      // Get full user with database ID
      const { data: user } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/by-uid/${firebaseUid}`);

      const hasBadge = user.badges.some(b => b.name === "Volunteer Connector");
      if (!hasBadge) {
        const { data: badge } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/badges/give`, {
          userId: user.id,
          badgeName: "Volunteer Connector",
        });
        if (setBadgeEarned) setBadgeEarned(badge);
      }
      else{
        if (setBadgeEarned) setBadgeEarned(null);
      }
    } catch (err) {
      console.error("Error checking Volunteer Connector badge:", err);
    }
  },


};

export default badgeService;
