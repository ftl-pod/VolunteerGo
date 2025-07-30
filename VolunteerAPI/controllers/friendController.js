const prisma = require("../db/db"); 

const getUserFromFirebase= async (firebaseUid) => {
  const user = await prisma.user.findUnique({
    where: { firebaseUid },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.id;
};

exports.sendFriendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = await getUserFromFirebase(req.user.uid);

  if (senderId === receiverId) {
    return res
      .status(400)
      .json({ error: "You can't send a request to yourself." });
  }

  try {
    const existing = await prisma.friendRequest.findFirst({
      where: {
        senderId,
        receiverId,
      },
    });

    if (existing) {
      if (existing.status === "pending") {
        return res.status(400).json({ error: "Friend request already sent." });
      }

      // Update existing to pending
      const updated = await prisma.friendRequest.update({
        where: { id: existing.id },
        data: { status: "pending", createdAt: new Date() },
      });

      return res.status(200).json(updated);
    }

    // No existing request, create a new one
    const request = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: "pending",
      },
    });

    res.status(201).json(request);
  } catch (err) {
    console.error("Failed to send friend request:", err);
    res.status(500).json({ error: "Failed to send friend request." });
  }
};


// View recieved requests
exports.getReceivedFriendRequests = async (req, res) => {
  try {
    const userId = await getUserFromFirebase(req.user.uid);

    const receivedRequests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: "pending",
      },
      include: {
        sender: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(receivedRequests);
  } catch (err) {
    console.error("Error fetching received friend requests:", err);
    res.status(500).json({ error: "Failed to fetch received friend requests." });
  }
};

// View sent requests
exports.getSentFriendRequests = async (req, res) => {
  try {
    const userId = await getUserFromFirebase(req.user.uid);

    const sentRequests = await prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: "pending",
      },
      include: {
        receiver: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(sentRequests);
  } catch (err) {
    console.error("Error fetching sent friend requests:", err);
    res.status(500).json({ error: "Failed to fetch sent friend requests." });
  }
};

// Accept a request
exports.acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body;
  const userId = await getUserFromFirebase(req.user.uid);
  try {
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (
      !request ||
      request.receiverId !== userId ||
      request.status !== "pending"
    ) {
      return res.status(400).json({ error: "Invalid friend request." });
    }

    // Update status
    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "accepted" },
    });

    // Add mutual friendship
    await prisma.user.update({
      where: { id: userId },
      data: {
        friends: { connect: { id: request.senderId } },
      },
    });

    await prisma.user.update({
      where: { id: request.senderId },
      data: {
        friends: { connect: { id: userId } },
      },
    });

    res.json({ message: "Friend request accepted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to accept friend request." });
  }
};

// Reject a request
exports.rejectFriendRequest = async (req, res) => {
  const { requestId } = req.body;
  const userId = await getUserFromFirebase(req.user.uid);

  try {
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (
      !request ||
      request.receiverId !== userId ||
      request.status !== "pending"
    ) {
      return res.status(400).json({ error: "Invalid request." });
    }

    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "rejected" },
    });

    res.json({ message: "Friend request rejected." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reject request." });
  }
};

exports.cancelFriendRequest = async (req, res) => {
  const { requestId } = req.body;
  const userId = await getUserFromFirebase(req.user.uid);

  try {
    const request = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return res.status(404).json({ error: "Friend request not found." });
    }

    if (request.senderId !== userId) {
      return res.status(403).json({ error: "Unauthorized to cancel this request." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Only pending requests can be cancelled." });
    }

    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: "cancelled" },
    });

    res.json({ message: "Friend request cancelled." });
  } catch (err) {
    console.error("Error cancelling friend request:", err);
    res.status(500).json({ error: "Failed to cancel friend request." });
  }
};

// Unfriend
exports.unfriend = async (req, res) => {
  const { friendId } = req.body;
  const userId = await getUserFromFirebase(req.user.uid);

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        friends: { disconnect: { id: friendId } },
      },
    });

    await prisma.user.update({
      where: { id: friendId },
      data: {
        friends: { disconnect: { id: userId } },
      },
    });

    res.json({ message: "Unfriended successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to unfriend." });
  }
};

// Get friends list
exports.getFriends = async (req, res) => {
  const userId = await getUserFromFirebase(req.user.uid);
  console.log("req.user in getFriends:", req.user);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { friends: true },
    });

    res.json(user.friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch friends." });
  }
};
