"use client";

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React from "react";
import styles from "./page.module.css";
import { useParams, usePathname } from "next/navigation";

type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

type ChatUIProps = {
  messages: ChatMessage[];
  showChat: boolean;
  setShowChat: (s: boolean) => void;
  // required send handler (parent should update `messages` and manage streaming)
  handleSend: (
    text: string,
    history: ChatMessage[],
  ) => Promise<string | AsyncGenerator<string, string, unknown> | void>;
  progress: number
};

export default function ChatUI({ messages, showChat, setShowChat, handleSend, progress }: ChatUIProps) {
  const chatRef = React.useRef<HTMLDivElement | null>(null)

  const params = useParams()
  const pathname = usePathname()
  const { type } = params


  const toggleFullScreen = async () => {

    if (!document?.fullscreenElement) {
      try {
        await chatRef.current?.requestFullscreen()

      } catch (err) {
        console.error("Failed to enter fullscreen:", err);

      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error("Failed to exit fullscreen:", err);
      }
    }
  }



  const doSend = async (text: string) => {
    const userMessage: ChatMessage = { sender: "user", text };
    const updatedMessages = [...messages, userMessage];

    try {
      await handleSend(text, updatedMessages);
    } catch (error) {
      console.error("handleSend error:", error);
    }
  };

  if (!showChat) {
      if(progress >= 1 && progress <= 99){
        return <div className={styles.chatIcon} >
        <span className={styles.chatIconText}>Chat Loading ... &nbsp;{progress}%</span>
      </div>

      }
    return (
      <div className={styles.chatIcon} onClick={() => setShowChat(true)}>
        <span className={styles.chatIconText}>Say Hi..</span>
        <span className={styles.chatIconEmoji}>💬</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      <div className={styles.actionButtons}>
        <button className={styles.closeIcon} onClick={() => setShowChat(false)}>
          X
        </button>
        <button onClick={() => toggleFullScreen()}>
          {"🗖"}
        </button>
      </div>

      <div ref={chatRef} className={styles.chatContainer}>
        <MainContainer className={styles?.mainContainer}>
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

            

            <MessageInput placeholder={ 'Type...' } onSend={doSend}  />
          </ChatContainer>
        </MainContainer>
      </div>

    </div>
  );
}
