import mongoose, { Schema } from "mongoose";

const userSchema: Schema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['Admin', 'User', 'Employee', 'Tester'],
            default: "User"
        },
        refreshToken: {
            type: String,
            default: undefined
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.models.User as mongoose.Model<UserTypes>  ||  mongoose.model<UserTypes>("User", userSchema)

export default User;