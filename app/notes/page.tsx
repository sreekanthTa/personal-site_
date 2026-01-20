import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.container}>
      <div>
      <h2>Linux</h2>
        <div className={styles.links}>
        <Link href="/notes/linux?level=basic">Basics</Link>

        </div>
      </div>

      <div>
        <h2>Shell</h2>
        <div className={styles.links}>

        <Link href="/notes/shell?level=basic">Basics</Link>
        <Link href="/notes/shell?level=advanced">Advanced</Link>
        </div>
      </div>

      <div>
        <h2>Docker</h2>
        <div className={styles.links}>

        <Link href="/notes/docker?level=basic">Basics</Link>
        <Link href="/notes/docker?level=advanced">Advanced</Link>
        <Link href="/notes/docker?level=scenario">Scenario</Link>
        </div>
      </div>
    </div>
  );
}

