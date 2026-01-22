import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function NotesLayout({ children }: Props) {
  return (
    <div style={{  border: "1px solid #ddd" }}>
      {children}
    </div>
  );
}
