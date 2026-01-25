import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PORTFOLIO } from "@/prompts/portfolio";
import fs from 'fs';

import path from "path";



// export async function POST(req: Request) {
//   const { message } = await req.json();

//   // Initialize the LangChain OpenAI Chat Model with Grok API key
//   const chatModel = new initChatModel({
//     modelName: "llama-3.3-70b-versatile",
//     apiKey: process.env.GROK_API_KEY!,
//      configuration: {
//         baseURL: "https://api.groq.com/openai/v1",
//       },
//   });

//   const systemMsg = new SystemMessage(PORTFOLIO);
//   const humanMsg = new HumanMessage(message);

//   const messages = [systemMsg, humanMsg];

 
//   // Chain the prompt template with the chat model
//   const response = await chatModel.invoke(messages);
//   // Now invoke the chain with the dynamic input (message)

  

//   // Return the response back to the client
//   return NextResponse.json({
//     text: response.content, // This will contain the response content from the AI
//   });

// }

 
export async function POST(req: Request) {
  const { message, history, type = 'portfolio' } = await req.json();

  // Convert chat history to Grok format
  const formattedHistory = history.map((m: any) => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.text,
  }));

  let systemPrompt = `YOU ARE A TOP EXPERT IN EXPLAINING ANYTHING REALTED TO ${type}. Behave like a ${type} Assitant.
                      Always give short and clear answers... Since i am using free tier... it will consume all tokens if you give huge response.
                      Answer in 2-3 sentences only.

                    `;

  if (type === 'portfolio') {
    systemPrompt += ` ${PORTFOLIO}`;
  } else if (type === 'docker') {
    try {
      systemPrompt += `
        You are a Docker Assistant. Please help with queries in a detailed way!
      `;
    } catch (error:any) {
      // Handle any errors that may occur while reading files
      systemPrompt += `Error reading Docker files: ${error?.message}`;
    }
  }

  // Initialize LangChain model with Grok
  const chatModel = new ChatOpenAI({
    modelName: "llama-3.3-70b-versatile",
    apiKey: process.env.GROK_API_KEY!,
    configuration: {
      baseURL: "https://api.groq.com/openai/v1",  // Grok's API base URL
    },
    maxTokens: 250,
    temperature: 0.2, //=> lower = short and accuret if we increate itmight add furether verbose texts to explain along with answer
    frequencyPenalty: 0.5, // => If it is low, it will remove repeiteite words, if increaets it keesps

    
  });

  // Build final messages
  const messages = [
    { role: "system", content: systemPrompt },
    ...formattedHistory,
    { role: "user", content: message },
  ];

  // Stream directly using LangChain model
  const streamResponse = await chatModel.stream(messages);

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamResponse) {

            const content = chunk?.content;

        const text =
          typeof content === "string"
            ? content
            : Array.isArray(content)
              ? content.map((c) => String(c)).join("")
              : "";

          if (text?.length>0) {
            controller.enqueue(encoder.encode(text));
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",  // This is necessary for streaming
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
