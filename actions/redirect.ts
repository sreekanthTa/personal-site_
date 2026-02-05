'use server';

import {redirect} from "next/navigation";
import { Resend } from "resend";

export const navigateToNotes=async ()=>{
    redirect('/notes');
  }


 export const handleSend = async (text: String) => {

 const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });

    const data = await res.json();
    return data.result;
 }
   
 


export async function emailFormHandler(formData: FormData) {
  try {
  const email = formData.get("email");
  const message = formData.get("message");

  console.log({ email, message });

  const resend = new Resend("re_N5EKiygL_QKUwrzHifmvWrSKYGyZ1a5MC"); // test key

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "sreekanthsreekanth970@gmail.com",
    subject: "Contact Form Message",
    html: `
      <p>Email: ${email}</p>
      <p>Message: ${message}</p>
    `,
  });
} catch (error) {
  console.error("Error sending email:", error);
}
}
