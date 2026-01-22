import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.container}>
      <div className={styles.container_item}>
      <div className={styles.container_item_title}>Linux</div>
        <div className={styles.container_item_links}>
         <Link href="/notes/linux?level=basic">Basics</Link>
        </div>
      </div>

      <div  className={styles.container_item}>
        <div className={styles.container_item_title}>Shell</div>
        <div className={styles.container_item_links}>

        <Link href="/notes/shell?level=basic">Basics</Link>
        <Link href="/notes/shell?level=advanced">Advanced</Link>
        
        </div>
      </div>

      <div  className={styles.container_item}>
        <div className={styles.container_item_title}>Docker</div>
        <div className={styles.container_item_links}>

        <Link href="/notes/docker?level=basic">Basics</Link>
        <Link href="/notes/docker?level=advanced">Advanced</Link>
        <Link href="/notes/docker?level=scenario">Scenario</Link>
        </div>
      </div>
    </div>
  );
}

