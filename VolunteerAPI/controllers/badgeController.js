const prisma  = require("../db/db");
// Get all badges
exports.getAll = async (req, res) => {
    try {
        const orgs = await prisma.badge.findMany();
        res.status(200).json(orgs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch badges" });
    }
};

// Get one by ID
exports.getById = async (req, res) => {
    try {
        const org = await prisma.badge.findUnique({
        where: { id: parseInt(req.params.id) },
        });

        if (!org) return res.status(404).json({ error: "Not found" });
        res.status(200).json(org);
    } catch (err) {
        res.status(500).json({ error: "Error fetching badge" });
    }
};

// Create an badge
exports.create = async (req, res) => {
    try {
        const { name, description, imageUrl } = req.body;

        if (!name) {
        return res.status(400).json({ error: "Name is required" });
        }

        const org = await prisma.badge.create({
        data: {
            name,
            description,
            imageUrl,
        },
        });

        res.status(201).json(org);
    } catch (err) {
        console.error("Error creating badge:", err);
        res.status(500).json({ error: "Server error creating badge" });
    }
};

// Update
exports.update = async (req, res) => {
    try {
        const { name, description, imageUrl } = req.body;

        const updated = await prisma.badge.update({
        where: { id: parseInt(req.params.id) },
        data: {
            name,
            description,
            imageUrl,
        },
        });

        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Update failed" });
    }
};

// Delete
exports.remove = async (req, res) => {
    try {
        await prisma.badge.delete({
        where: { id: parseInt(req.params.id) },
        });

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
};
