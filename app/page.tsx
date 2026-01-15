import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", flexDirection:"column", gap:"1rem"}}>
      <h2>Linux</h2>
      <div>
        <Link href="/notes/linux?level=basic">Basics</Link>
      </div>

      <div>
        <h2>Shell</h2>
        <Link href="/notes/shell?level=basic">Basics</Link>
        <Link href="/notes/shell?level=advanced">Advanced</Link>
      </div>
    </div>
  );
}

