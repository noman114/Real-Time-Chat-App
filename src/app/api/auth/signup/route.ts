import { NextRequest, NextResponse } from "next/server";
import { user_validation } from "@/lib/zod";
import { ZodError } from "zod";
import { formateZodError, serverSideCookiesOptions } from "@/lib/utils";
import dbConnect from "@/lib/db";
import User from "@/models/user.model";
import helpingKit from "@/lib/helpers";

export async function POST(req: NextRequest): Promise<NextResponse<ApiTypes>> {
    await dbConnect();

    const timeout = 5000;
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request Timeout")), timeout)
    );

    try {
        const jsonData = await Promise.race([req.json(), timeoutPromise]) as { fullname: string, email: string, password: string };

        const { fullname, email, password } = jsonData;

        // Validate user input
        user_validation.parse({ fullname, email, password });

        // Check if user already exists
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email or password is incorrect"
                },
                {
                    status: 400
                }
            );
        }

        const newPassword = `${password}_${process.env.PASS_SECRET}`

        // Hash the password
        const hashedPasswordPromise = new helpingKit().hash(newPassword);

        // Create new user
        const newUserPromise = User.create({
            fullname,
            email,
            password: await hashedPasswordPromise
        });

        const [, newUser] = await Promise.all([hashedPasswordPromise, newUserPromise])

        // Generate tokens
        const tokenPromise = new helpingKit(process.env.JWT_SECRET).generateSessionsTokens({
            _id: newUser._id?.toString() || '',
            email: newUser.email,
            role: newUser.role
        });

        // Update user with refresh token
        const updatedUserPromise = User.findByIdAndUpdate(
            newUser._id,
            { $set: { refreshToken: tokenPromise.refresh_token } },
            { new: true }
        ).select('-password -refreshToken');

        const [token, updatedUser] = await Promise.all([tokenPromise, updatedUserPromise])

        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Internal Server Error"
                },
                {
                    status: 500
                }
            );
        }

        const response = NextResponse.json(
            {
                success: true,
                message: "User registered successfully",
                data: updatedUser,
                token: {
                    accessToken: token.access_token,
                    refreshToken: token.refresh_token
                }
            },
            { status: 201 }
        );

        response.cookies.set("atk", token.access_token, serverSideCookiesOptions(1))
        response.cookies.set("rtk", token.refresh_token, serverSideCookiesOptions(30))

        return response

    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    errors: formateZodError(error)
                },
                {
                    status: 400
                }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error"
            },
            {
                status: 500
            }
        );
    }
}