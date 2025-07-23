const prisma  = require("../db/db");

exports.getAll = async (req, res) => {
    console.log("Query params received:", req.query);
    const { keyword, sort_by, city } = req.query;

    const filters = {};

    if (keyword) {
        filters.name = {
        contains: keyword,
        mode: 'insensitive',
        };
    }

    if (city) {
        filters.organization = {
        location: {
            contains: city,
            mode: 'insensitive'
        }
        };
    }

    // Sorting logic
    let orderBy = {};
        if (sort_by) {
        orderBy = {
            [sort_by]: req.query.order === 'desc' ? 'desc' : 'asc',
        };
        } else {
        orderBy = {
            createdAt: 'asc', // or 'desc' depending on your preference
        };
        }

    try {
        const opportunities = await prisma.opportunity.findMany({
        where: filters,
        orderBy: Object.keys(orderBy).length ? orderBy : undefined,
        include: {
            organization: {
            select: {
                id: true,
                name: true,
                tags: true,
                location: true,
            },
            },
        },
        });
        res.json(opportunities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch opportunities" });
    }
};

// GET /cities?q=searchTerm
exports.getCities = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const results = await prisma.organization.findMany({
      where: {
        location: {
          contains: q,
          mode: 'insensitive',
        },
      },
      select: {
        location: true,
      },
      take: 20,
    });

    const cityNames = results.map(({ location }) => {
      const match = location.match(/([^,]+),\s?[A-Z]{2}/); // captures city before ", CA"
      return match ? match[1].trim() : null;
    });

    const uniqueCities = [...new Set(cityNames.filter(Boolean))];
    res.json(uniqueCities);
  } catch (err) {
    console.error("Failed to get cities:", err);
    res.status(500).json({ error: "Failed to get cities" });
  }
};


exports.getById = async (req, res) => {
    const id = Number(req.params.id);

    try {
        const opportunity = await prisma.opportunity.findUnique({
            where: { id },
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true,
                        tags: true,
                        location: true
                    }
                }
            }
        });

        if (!opportunity) return res.status(404).json({ error: "Not found!" });
        res.json(opportunity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Post /opportunities
exports.create = async (req, res) => {
    try {
        const {
        name,
        tags = [],
        description,
        date,
        location,
        skills = [],
        imageUrl,
        volunteersNeeded,
        status = "active",
        points = 0,
        organizationName,
        users = []
        } = req.body;

        if (!name || !organizationName) {
        return res.status(400).json({ error: "Name and organizationName are required." });
        }

        // Connect with organization
        let organization = await prisma.organization.findFirst({
        where: { name: organizationName },
        });

        // Create new organization
        if (!organization) {
            organization = await prisma.organization.create({
            data: {
                name: organizationName,
                tags: [], 
                location: location
            },
        });
        }

        const data = {
            name,
            tags,
            description,
            date: date ? new Date(date) : undefined,
            location,
            skills,
            imageUrl,
            volunteersNeeded,
            status,
            points,
            organization: {
                connect: { id: organization.id },
            },
        };

        if (users.length > 0) {
            data.users = {
                connect: users.map((id) => ({ id })),
            };
        }

        const newOpportunity = await prisma.opportunity.create({ data });
        res.status(201).json(newOpportunity);
    } catch (err) {
        console.error("Error creating opportunity:", err);
        res.status(500).json({ error: "Error creating opportunity." });
    }
};


    // Put /opportunities/:id
    exports.update = async (req, res) => {
        const id = Number(req.params.id)
        const { name, description, price, image_url, category } = req.body
        const updatedboard = await prisma.opportunity.update({
            where: { id },
            data: { name, description, price, image_url, category },
        })
        res.json(updatedboard)
}

// Delete
exports.remove = async (req, res) => {
    const id = Number(req.params.id);
    await prisma.opportunity.delete ({ where : { id }})
    res.status(204).end();
}

