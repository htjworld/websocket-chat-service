const Chat = require("../Models/chat")
const chatController = {}

chatController.saveChat = async(message, user, roomId)=>{
    const newMessage = new Chat({
        chat:message,
        user:{
            id:user._id,
            name:user.name,
        },
        room: roomId,
    })
    await newMessage.save();
    return newMessage;
}

module.exports = chatController