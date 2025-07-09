const prisma = require('../db/db'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
        include: {
            opportunities: true, // include related opps
        },
    });
    if (users.length === 0) {
        return res.status(404).json({ error : "No users found" });
    }
    return res.json(users);
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
        const { username, password, training, skills, location, age, leaderboardRank, avatarUrl} = req.body;
        if (!username || !password || !Array.isArray(training) || training.length === 0 || !Array.isArray(skills) || skills.length === 0 || !location || !age || !leaderboardRank) {
            return res.status(400).json({ error : "Missing required field!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        //console.log(password, hashedPassword);
        const user = await prisma.user.create({
            data : {
                username,
                password : hashedPassword, // based off the kudos code 
                training,
                skills,
                location,
                age,
                leaderboardRank,
                avatarUrl
            },
        })
        // excluding pass from response
        const { password: _, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error : "Internal server error" });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const {username, password, training, location, age, leaderboardRank, opportunities} = req.body;
        if (!username || !password || !Array.isArray(training) || training.length === 0 || !Array.isArray(skills) || skills.length === 0 || !location || !age || !leaderboardRank) {
            return res.status(400).json({ error : "Missing required field!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await prisma.user.update({
            where : { id : userId },
            data : { 
                username,
                password: hashedPassword, 
                training,
                skills,
                location,
                age,
                leaderboardRank,
                avatarUrl,
                opportunities: {
                    connect: opportunities.map(oppId => ({ id: Number(oppId) }))
                }
            }
        })
        // excluding pass from response
        const { password: _, ...userWithoutPassword } = updatedUser;
        return res.json(userWithoutPassword);
    } catch (error) {
        console.error("Errror updating user:", error);
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
            return res.status(404).json({ error : "User not found" });
        }
        await prisma.user.delete({
            where: { id: userId },
        });
        return res.status(204).send(); // No content
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error : "Internal server error" });
    }
};

// login 
exports.loginUser = async (req, res) => {
try {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(400).json({ error : "Username and password are required" });
    }
    const user = await prisma.user.findUnique({
        where: { username },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
        // exclude pass
        const { password: _, ...userWithoutPassword } = user;
        // generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
        return res.json({ user: userWithoutPassword, token });
    } else {
        return res.status(401).json({ error : "Invalid username or password" });
    }

} catch (error) {
    console.error("Erro logging in:", error);
    return res.status(500).json({ error : "Internal server error" });
}
};
