import Link from "next/link";
import styles from "./page.module.css";
import path from "path";
import fs from "fs";

export default function Page() {

  const dir = path.join(process.cwd(), '/content');
  const folders = fs.readdirSync(dir, { withFileTypes: true });
  const folders_to_files_map: Record<string, {name:string, path:string}[]> = {}

  folders.forEach((folder) => {
    folders_to_files_map[folder.name] = []
    const specific_folder = path.join(process.cwd(), '/content', folder.name)
    return fs.readdirSync(specific_folder)?.forEach((file) => {
       
      const file_name = file?.replace(".json", "")
      const file_path = `/${folder.name}?level=${file_name}`
      folders_to_files_map[folder.name].push({name:file_name, path:file_path})
    }
    )
  })

  console.log("checkinsdgssdss",folders_to_files_map)
  return (
    <div className={styles.container}>
      <h1>Hello</h1>
      {Object.entries(folders_to_files_map)?.map(([folder,files])=>{
         return  <div className={styles.container_item}>
          <div className={styles.container_item_title}>{folder}</div>
          <div className={styles.container_item_links}>
            {files?.map((file: {name:string, path:string}) => {
              return <Link key={file?.name} href={file?.path}>{file?.name}</Link>
            })
            }
          </div>
        </div>
      })}

    </div>
  );
}

