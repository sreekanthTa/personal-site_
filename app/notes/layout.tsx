import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function NotesLayout({ children }: Props) {
  return (
    <div style={{ padding: "2rem", border: "1px solid #ddd" }}>
      <h2>Notes Section</h2>
      {children}
    </div>
  );
}
