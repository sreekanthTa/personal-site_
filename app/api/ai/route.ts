// export const runtime = "node";

import { NextResponse } from "next/server";
import {PORTFOLIO} from "@/prompts/portfolio"
import OpenAI from "openai";

import Groq from "groq-sdk";


// export async function main() {
//   const completion = await getGroqChatCompletion();
//   console.log(completion.choices[0]?.message?.content || "");
// }


// export async function POST(req: Request) {
//   const {message} = await req.json();


//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 30000);

//   const response = await fetch("https://api.groq.com/openai/v1/chat/completions ", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.GROK_API_KEY}`,
//     },
//     signal: controller.signal,
//     body: JSON.stringify({
//       model: "llama-3.3-70b-versatile",
//       messages: [
//         { role: "system", content: PORTFOLIO },
//         { role: "user", content: message },
//       ],
//     }),
//   });

//   clearTimeout(timeout);

//   const data = await response.json();
//   console.log("dat is",data)
//   return NextResponse.json({ text: data.choices[0].message.content });
// }


// export const POST = async (req: Request) => {
//   const {message} = await req.json()
  
//   const groq = new Groq({
//     apiKey : process.env.GROK_API_KEY,

//   });
//   const chatCompletion =  groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [
//       {
//         role: "system",
//         content: PORTFOLIO, // your prompt data
//       },
//       {
//         role: "user",
//         content: message,
//       },
//     ],
//   });

//   const completion = await chatCompletion;
//   const response_text = completion.choices[0]?.message?.content || ""
  
//   console.log(completion.choices[0]?.message?.content || "");

//    return NextResponse.json({ text: response_text });
// };



// export const runtime = "node";


 

// export async function POST(req: Request) {
//   const { message } = await req.json();
//   const groq = new Groq({ apiKey: process.env.GROK_API_KEY });

//   const stream = await groq.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     messages: [
//       { role: "system", content: PORTFOLIO },
//       { role: "user", content: message },
//     ],
//     stream: true,
//   });

//   const text_encode = new TextEncoder()
  
//   const custom_stream = new ReadableStream({
//     async start (controller){

//       try {
        
   
         
//       for await (const chunk of stream){
//         //encode it
//         const text = chunk.choices[0]?.delta?.content || "";
//         if(text){
//            const encoded_text =  await text_encode.encode(text)
//            controller.enqueue(encoded_text)

//         }

//       }
//          } catch (error) {
//           controller.error()
//       }finally{
//         controller.close()
//       }
//     }
//   })

//   return new Response(custom_stream, {
//     headers: { "Content-Type": "text/event-stream" },
//   });
// }



 

export async function POST(req: Request) {
  const { message, history = [] } = await req.json();

  const groq = new Groq({
    apiKey: process.env.GROK_API_KEY!,
  });

  // Convert chat history to Grok format
  const formattedHistory = history.map((m: any) => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.text,
  }));

  const stream = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    stream: true,
    messages: [
      { role: "system", content: PORTFOLIO },
      ...formattedHistory,
      { role: "user", content: message },
    ],
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

