import dbConnect from "@/lib/db";
import helpingKit from "@/lib/helpers";
import { formateZodError, serverSideCookiesOptions } from "@/lib/utils";
import { user_validation } from "@/lib/zod";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest): Promise<NextResponse<ApiTypes>> {
    await dbConnect();

    const timeout = 5000;
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request Timeout")), timeout)
    );

    try {
        const jsonData = await Promise.race([req.json(), timeoutPromise]) as { email: string, password: string };

        const { email, password } = jsonData;

        // Validate user input
        user_validation.parse({ email, password });

        // Check if user already exists
        const existingUser = await User.findOne({ email }).exec();
        if (!existingUser) {
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

        // verify the password
        const VerifyPassword = await new helpingKit().compare(newPassword, existingUser.password);
        if (!VerifyPassword) {
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

        // Generate tokens
        const token = new helpingKit(process.env.JWT_SECRET).generateSessionsTokens({
            _id: existingUser._id?.toString() || '',
            email: existingUser.email,
            role: existingUser.role
        });

        const checkTokenIsExpireOrNot = new helpingKit().isTokenExpired(token.refresh_token)
        let response: NextResponse<ApiTypes>
        if (checkTokenIsExpireOrNot) {
            const updatedUser = await User.findByIdAndUpdate(
                existingUser._id,
                { $set: { refreshToken: token.refresh_token } },
                { new: true }
            ).select('-password -refreshToken');
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
            response = NextResponse.json(
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
        } else {
            response = NextResponse.json(
                {
                    success: true,
                    message: "User logged in successfully",
                    data: existingUser,
                    token: {
                        accessToken: token.access_token,
                        refreshToken: existingUser.refreshToken || '',
                    },
                },
                { status: 200 }
            );
            response.cookies.set("atk", token.access_token, serverSideCookiesOptions(1))
        }

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