"use client";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React, { useState } from "react";
import styles from "./page.module.css";
import { useParams, usePathname } from "next/navigation";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatUI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const chatRef = React.useRef<Intrinisc | null>(null)



  const params = useParams()
  const pathname = usePathname()
  const {type} = params


  const toggleFullScreen= async () =>{

    if(!document?.fullscreenElement){
      try{
       await  chatRef.current?.requestFullscreen()
               setIsFullscreen(true);

      }catch(err){
        console.error("Failed to enter fullscreen:", err);

      }
    }else{
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error("Failed to exit fullscreen:", err);
      }
    }
  }

 

  console.log("checkaingsfsdf", params, pathname)

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
          type
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
      <span className={styles.chatIconText}>Say Hi..</span>
      <span className={styles.chatIconEmoji}>💬</span>
    </div>
  );
}

  return (<div className={styles.container}>
         <div className={styles.actionButtons}>
      <button className={styles.closeIcon} onClick={() => setShowChat(false)}>
        X
      </button>
       <button
                onClick={() => toggleFullScreen()}
                 
              >
                {"🗖"}
      </button>
</div>
<div className={styles?.mainContainer}   ref={chatRef}>
    <MainContainer     
>



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
    </div>
  </div>

  );
}
