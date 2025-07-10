const prisma  = require("../db/db");
// Get all organizations
exports.getAll = async (req, res) => {
    try {
        const orgs = await prisma.organization.findMany();
        res.status(200).json(orgs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch organizations" });
    }
};

// Get one by ID
exports.getById = async (req, res) => {
    try {
        const org = await prisma.organization.findUnique({
        where: { id: parseInt(req.params.id) },
        });

        if (!org) return res.status(404).json({ error: "Not found" });
        res.status(200).json(org);
    } catch (err) {
        res.status(500).json({ error: "Error fetching organization" });
    }
};

// Create an organization
exports.create = async (req, res) => {
    try {
        const { name, tags = [], location } = req.body;

        if (!name) {
        return res.status(400).json({ error: "Name is required" });
        }

        const org = await prisma.organization.create({
        data: {
            name,
            tags,
            location,
        },
        });

        res.status(201).json(org);
    } catch (err) {
        console.error("Error creating organization:", err);
        res.status(500).json({ error: "Server error creating organization" });
    }
};

// Update
exports.update = async (req, res) => {
    try {
        const { name, tags, location } = req.body;

        const updated = await prisma.organization.update({
        where: { id: parseInt(req.params.id) },
        data: {
            name,
            tags,
            location,
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
        await prisma.organization.delete({
        where: { id: parseInt(req.params.id) },
        });

        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
};
