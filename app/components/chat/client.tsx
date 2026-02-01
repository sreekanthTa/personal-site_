"use client";

import { useState } from "react";
import ChatUI from "./page";

type ChatMessage = { sender: "user" | "bot"; text: string };

export default function ChatContainer({SYSTEMPROMPTTYPE, apiPath}: {SYSTEMPROMPTTYPE: string, apiPath?: string}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);

  const handleSend = async (user_text: string, ) => {
    const newUserMessage: ChatMessage = { sender: "user", text: user_text };
    const placeholderBotMessage: ChatMessage = { sender: "bot", text: "..." };

    const updated_messages = [...messages, newUserMessage, placeholderBotMessage];
    setMessages(()=>updated_messages);

    try {
      const response = await fetch(`/api/${apiPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: user_text, history:messages?.slice(0,3), type: SYSTEMPROMPTTYPE }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let botText = "";

      if (!reader) throw new Error("No response body");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        botText += decoder.decode(value, { stream: true });

        setMessages((prev) => {
          const copy = [...prev];
          const lastBotIndex = [...copy]
            .reverse()
            .findIndex((m) => m.sender === "bot");
          const idx = copy.length - 1 - lastBotIndex;
          copy[idx] = { sender: "bot", text: botText };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          sender: "bot",
          text: "Error: failed to get response.",
        };
        return copy;
      });
    }
  };

  return (
    <ChatUI
      handleSend={handleSend}
      messages={messages}
      showChat={showChat}
      setShowChat={setShowChat}
      progress={0}
    />
  );
}
