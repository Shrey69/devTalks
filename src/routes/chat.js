const express = require('express');
const { Chat } = require('../models/chat');
const { userAuth } = require('../middlewares/auth');
const chatRouter = express.Router();

chatRouter.get('/chat/:targetID', userAuth, async (req, res) => {
    const { targetID } = req.params;
    const userID = req.user._id;
    try {
        let chat = await Chat.findOne({
            participants: { $all: [userID, targetID] },
        }).populate({
            path: 'messages.senderID',
            select: 'firstName lastName',
        });

        if (!chat) {
            chat = new Chat({
                participants: [userID, targetID],
                messages: [],
            });
            await chat.save();
        }

        // Send the chat data as a response
        res.status(200).json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch chat' });
    }
});

module.exports = chatRouter;
