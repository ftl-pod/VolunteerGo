const prisma = require('../db/db'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('../firebase/firebaseAdmin');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { points: 'desc' },
            include: {
                opportunities: true,
                savedOpportunities: true,
            },
        });
        const rankedUsers = users.map((user, index) => ({
        ...user,
        leaderboardRank: index + 1,
        }));

        res.json(rankedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error : "Internal server error" });
    }
};


exports.getUserById = async (req, res) => {
    try {
    const userId = Number(req.params.id);
    const user = await prisma.user.findUnique({
        where : {id : userId},
        include: {
            opportunities: true,
            savedOpportunities: true, 
        }
    });
    if (!user) {
        return res.status(404).json({ error : "User not found" });
    }
    return res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error : "Internal server error" });
    }
};

exports.createUser = async (req, res) => {
  try {
    const { username, firebaseUid } = req.body;

    // Basic required fields validation
    if (!username  || !firebaseUid) {
      return res.status(400).json({ error: "Missing required field!" });
    }

    // Create user with only these fields
    const user = await prisma.user.create({
      data: {
        username,
        firebaseUid,
        // other fields remain null or defaults
      },
    });

    // Don't return sensitive info (none here, but good habit)
    return res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Delete from user database
        await prisma.user.delete({
            where: { id: userId },
        });

        return res.status(204).send();
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getUserByFirebaseUid = async (req, res) => {
  const firebaseUid = req.params.uid;

  if (!firebaseUid) {
    return res.status(400).json({ error: "Missing firebaseUid param" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        opportunities: true,
        savedOpportunities: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by firebaseUid:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Send information to database and firebase 
exports.onboarding = async (req, res) => {
  const firebaseUid = req.user.uid; // comes from token middleware
  const {
    name,
    username,
    skills,
    training,
    location,
    age,
    points = 0,
    level = 1,
    interests,
    avatarUrl
  } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { firebaseUid } });

    const user = await prisma.user.upsert({
      where: { firebaseUid },
      update: { name, username, skills, training, location, age, points, level, interests, avatarUrl },
      create: {
        firebaseUid,
        name,
        username,
        skills,
        training,
        location,
        age,
        points,
        level,
        interests,
        avatarUrl
      },
    });

    res.json({ success: true, user });
  } catch (e) {
    console.error("Error saving user onboarding data:", e);
    res.status(500).json({ error: "Failed to save onboarding data" });
  }
};

exports.getSavedOpportunitiesByUserId = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const userWithSavedOpps = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                savedOpportunities: true,
            },
        });
        if (!userWithSavedOpps) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.json(userWithSavedOpps.savedOpportunities);
    } catch (error) {
        console.error("Error fetching saved opportunities:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.addSavedOpportunity = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { opportunityId } = req.body;

        if (!opportunityId) {
            return res.status(400).json({ error: "Missing opportunityId in request body" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { savedOpportunities: true },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                savedOpportunities: {
                    connect: { id: opportunityId },
                },
            },
        });

        return res.json({ success: true, savedOpportunities: updatedUser.savedOpportunities });
    } catch (error) {
        console.error("Error adding saved opportunity:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.removeSavedOpportunity = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const { opportunityId } = req.body;

        if (!opportunityId) {
            return res.status(400).json({ error: "Missing opportunityId in request body" });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { savedOpportunities: true },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                savedOpportunities: {
                    disconnect: { id: opportunityId },
                },
            },
        });

        return res.json({ success: true, savedOpportunities: updatedUser.savedOpportunities });
    } catch (error) {
        console.error("Error removing saved opportunity:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
