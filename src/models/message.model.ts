import mongoose, { Schema } from "mongoose";


const messageSchema: Schema<MessageTypes> = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'conversations',
            required: true
        },
        message: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

const Message = mongoose.model<MessageTypes>("messages", messageSchema)

export default Message;