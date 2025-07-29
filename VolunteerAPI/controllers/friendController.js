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
    // Check for existing request
    const existing = await prisma.friendRequest.findFirst({
      where: {
        senderId,
        receiverId,
        status: "pending",
      },
    });

    if (existing) {
      return res.status(400).json({ error: "Friend request already sent." });
    }

    const request = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        status: "pending",
      },
    });
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send friend request." });
  }
};

// View incoming requests
exports.getFriendRequests = async (req, res) => {
  const userId = await getUserFromFirebase(req.user.uid);

  try {
    const requests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: "pending",
      },
      include: {
        sender: true,
      },
    });
    console.log("Friend requests found:", requests);

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch friend requests." });
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
