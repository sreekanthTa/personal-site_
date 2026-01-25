import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PORTFOLIO } from "@/prompts/portfolio";




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
  const { message, history } = await req.json();

  // Convert chat history to Grok format
  const formattedHistory = history.map((m: any) => ({
    role: m.sender === "user" ? "user" : "assistant",
    content: m.text,
  }));

  // Initialize LangChain model with Grok
  const chatModel = new ChatOpenAI({
    modelName: "llama-3.3-70b-versatile",
    apiKey: process.env.GROK_API_KEY!,
    configuration: {
      baseURL: "https://api.groq.com/openai/v1",
    },
  });

  // Build final messages
  const messages = [
    { role: "system", content: PORTFOLIO },
    ...formattedHistory,
    { role: "user", content: message },
  ];

  // Stream directly using LangChain model
  const streamResponse = await chatModel.stream(messages);

  const encoder = new TextEncoder();

  const readable_stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamResponse) {
          const text = chunk?.content || "";
          if (text) {
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

  return new NextResponse(readable_stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
