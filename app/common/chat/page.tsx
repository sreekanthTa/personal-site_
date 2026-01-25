"use client";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useState } from "react";
import styles from "./page.module.css";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatUI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);

  const handleSend = async (text: string) => {
    // 1️⃣ Build updated history locally
    const userMessage: ChatMessage = { sender: "user", text };
    const updatedMessages = [...messages, userMessage];

    // 2️⃣ Optimistically update UI
    setMessages([...updatedMessages, { sender: "bot", text: "" }]);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: updatedMessages, // ✅ send history
        }),
      });

      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botText = "";

      // 3️⃣ Read streaming response
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        botText += decoder.decode(value, { stream: true });

        // 4️⃣ Update only last bot message
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { sender: "bot", text: botText };
          return copy;
        });
      }
    } catch (error) {
      console.error("Streaming error:", error);
    }
  };

  if (!showChat) {
    return (
      <div className={styles.chatIcon} onClick={() => setShowChat(true)}>
        Chat
      </div>
    );
  }

  return (
    <MainContainer className={styles.MainContainer}>
      <div className={styles.closeIcon} onClick={() => setShowChat(false)}>
        X
      </div>

      <ChatContainer>
        <MessageList>
          {messages.map((m, i) => (
            <Message
              key={i}
              model={{
                message: m.text,
                direction: m.sender === "user" ? "outgoing" : "incoming",
                        position: "single",

                
              }}
            />
          ))}
        </MessageList>

        <MessageInput placeholder="Type..." onSend={handleSend} />
      </ChatContainer>
    </MainContainer>
  );
}
