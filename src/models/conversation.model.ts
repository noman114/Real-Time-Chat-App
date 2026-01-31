import mongoose, { Schema } from "mongoose";

const conservationSchema: Schema = new mongoose.Schema(
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
    },
    {
        timestamps: true
    }
)

const Conversation = mongoose.model<ConversationTypes>("conversations", conservationSchema)

export default Conversation;