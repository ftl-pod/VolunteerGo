const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient();

const getChatHistory = async (coversationID) => {
    return await prisma.chat.findMany({
        where: {conversationID},
        orderBy: {createdAt: "asc"}
    })
}

const saveChatMessage = async (conversationID, prompt, response) => {
    await prisma.chat.create({
        data: {
            conversationID,
            prompt,
            response,
        }
    });
}

module.exports = {
    getChatHistory,
    saveChatMessage
}