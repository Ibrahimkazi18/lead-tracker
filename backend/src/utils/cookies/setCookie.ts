import { Response } from "express";

export const setCookie = (res: Response, name: string, value: string) => {

    let time = 0;

    if (name === "refresh_token" || name === "seller_refresh_token") {
        time = 7 * 24 * 60 * 60 * 1000;    // 7 days
    }
    else {
        time = 24 * 60 * 60 * 1000;    // 1 day
    }
    
    res.cookie(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: time, 
        path: "/",
    })
};