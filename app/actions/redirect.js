'use server';

import {redirect} from "next/navigation";

export const navigateToNotes=async ()=>{
    redirect('/notes');
  }