"use client";

import ChatUI from './common/chat/page';
import styles from './page.module.css';
import React, { useState } from 'react';
import { useWebLLM } from './common/providers/webllm';

export const dynamic = "force-dynamic";

export default function Page() {
  type ChatMessage = { sender: "user" | "bot"; text: string };

  const skills = ["Next.js", "React.js", "Node.js", "Css","Javascript","Python"];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showChat, setShowChat] = useState(false);

  const { isLoaded, loadModel, chatCompletionsStream, progress } = useWebLLM();

  React.useEffect(() => {
    console.log('[page.tsx] Progress changed:', progress, 'isLoaded:', isLoaded);
  }, [progress, isLoaded]);

  React.useEffect(() => {
    // Auto-load when the chat is opened (or on mount if `showChat` is true)
    if (showChat && !isLoaded) {
      loadModel().catch((err) => console.error('Failed to load model on chat open:', err));
    }
  }, [showChat, isLoaded, loadModel]);
  
  // Parent-managed send handler: updates messages state and streams model replies
  const handleSend = async (text: string, history: ChatMessage[]) => {
    // append user message + bot placeholder; parent message state is controlled here
    setMessages((prev) => [...prev, { sender: 'user', text }, { sender: 'bot', text: '' }]);

    const updatedMessages = [...history, { sender: 'user', text }];

    const modelMessages = [
      { role: 'system', content: 'You are a helpful AI assistant.' },
      ...updatedMessages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
    ]
    try {
      const stream = await chatCompletionsStream(modelMessages as any);
      console.log("stream message is", stream)
      let botText = '';
      for await (const chunk of stream) {
        botText += chunk;
        // update last bot message
        setMessages((prev) => {
          const copy = [...prev];
          // find last bot message index
          const lastBotIndex = [...copy].reverse().findIndex((m) => m.sender === 'bot');
          const idx = lastBotIndex === -1 ? copy.length - 1 : copy.length - 1 - lastBotIndex;
          copy[idx] = { sender: 'bot', text: botText };
          return copy;
        });
      }
    } catch (err) {
      console.error('Error streaming from model:', err);
      setMessages((prev) => {
        const copy = [...prev];
        const lastBotIndex = [...copy].reverse().findIndex((m) => m.sender === 'bot');
        const idx = lastBotIndex === -1 ? copy.length - 1 : copy.length - 1 - lastBotIndex;
        copy[idx] = { sender: 'bot', text: 'Error: failed to get response.' };
        return copy;
      });
    }
  };

  return (
    <>
      
      {/* HERO */}
      <section className={styles.hero} id="home">
        <div className={styles.container}>
          <div className={styles.text}>
            <p className={styles.subtitle}>Full-stack Developer</p>
            
            <h1 className={styles.title}>
              I build scalable full-stack apps using <p className={styles.highlight}>React, Node.js & PostgreSQL</p>
            </h1>
            <p className={styles.description}>
              I create fast, responsive, and beautiful websites using React, Next.js, and Node.js.
              Check out my work and feel free to contact me.
            </p>
            <div className={styles.buttons}>
              <a className={styles.primaryBtn} href="#projects">
                View GitHub
              </a>
              <a className={styles.secondaryBtn} href="#contact">
                Contact Me
              </a>
            </div>
          </div>
     <button onClick={() => {
       console.log('[page.tsx] Load Model button clicked');
       loadModel().catch((err) => console.error('[page.tsx] Error loading model:', err));
     }}>Load Model</button>

          <div className={styles.card}>
            <div className={styles.profileCircle}>
              <div className={styles.initial}>Y</div>
            </div>
            <p className={styles.cardText}>
              “Turning ideas into real web applications.”
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles.about} id="about">
        <div className={styles.sectionContainer}>
          <h2>About Me</h2>
          <p>
            I am a full-stack developer who builds modern web applications using Next.js, React, and Node.js.
            I love building clean UI and solving real problems.
          </p>
        </div>
      </section>

 
      {/* SKILLS */}
      <section className={styles.skills} id="skills">
        <div className={styles.sectionContainer}>
          <h2>Skills</h2>
          <div className={styles.skillsGrid}>
            {skills?.map((skill:string)=>{
        return    <div key={skill} className={styles.skillCard}>{skill}</div>
 
            })}
             
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className={styles.contact} id="contact">
        <div className={styles.sectionContainer}>
          <h2>Contact Me</h2>
          <p>Feel free to reach out for collaborations or job opportunities.</p>
          <div className={styles.contactButtons}>
            <a className={styles.primaryBtn} href="mailto:youremail@example.com">
              Email Me
            </a>
            <a className={styles.secondaryBtn} href="#home">
              Back to Top
            </a>
          </div>
        </div>
      </section>
        <ChatUI
          handleSend={handleSend}
          messages={messages}
          showChat={showChat}
          setShowChat={setShowChat}
          progress={Math.round(progress * 100)}
        />

    </>
  );
}
