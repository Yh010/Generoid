import { NextRequest } from "next/server"

export function GET() {
    return Response.json({
        name: "yash",
        email:"yash@gmail.com"
    })
}

export async function POST(req:NextRequest) {
    //extract the message from the body
    const body = await req.json();
    console.log(body)
    //make gemini call
    return Response.json({
        //send the ai response
        message:"response from ai"
    })
}