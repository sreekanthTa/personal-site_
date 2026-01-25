'use server';

import {redirect} from "next/navigation";

export const navigateToNotes=async ()=>{
    redirect('/notes');
  }


 export const handleSend = async (text) => {

 const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });

    const data = await res.json();
    return data.result;
 }
   