import { ZodError, ZodTypeAny } from "zod";

const formateZodError = <T extends ZodTypeAny>(error: ZodError<T>): Record<string, string> => {
    const formattedErrors: Record<string, string> = {};
    error.errors.forEach((err) => {
        const field_name = err.path[0]
        const field_message = err.message
        if (formattedErrors[field_name]) {
            formattedErrors[field_name] = formattedErrors[field_name].concat(", ", field_message);
        } else {
            formattedErrors[field_name] = field_message
        }
    });
    return formattedErrors;
}

const serverSideCookiesOptions = (time: number): CookieOptions => {
    const options: CookieOptions = {
        maxAge: 1000 * 60 * 60 * 24 * time,
        sameSite: "strict",
        path: "/",
        httpOnly: true,
        secure: true,
    }

    return options
}

export {
    formateZodError,
    serverSideCookiesOptions
}