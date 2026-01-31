import { Mongoose } from "mongoose";

const cached: { conn: Mongoose | null; promise: Promise<Mongoose> | null} = {
    conn: null,
    promise: null,
}


export {
    cached
}