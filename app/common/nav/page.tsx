
import path from "path";
import fs from "fs";
import NavClient from "./nav_client/page";

export default function Nav() {

  const dir = path.join(process.cwd(), '/content');
  const folders = fs.readdirSync(dir, { withFileTypes: true });
  const folders_to_files_map: Record<string, {name?:string, path:string}[]> = {}
      
    folders_to_files_map["home"]=[{path:"/"}]
    
    folders.forEach((folder) => {
    folders_to_files_map[folder.name] = []
    const specific_folder = path.join(process.cwd(), '/content', folder.name)
    return fs.readdirSync(specific_folder)?.forEach((file) => {
       
      const file_name = file?.replace(".json", "")
      const file_path = `/notes/${folder.name}?level=${file_name}`
      folders_to_files_map[folder.name].push({name:file_name, path:file_path})
    }
    )
  })


  return <NavClient folders_to_files_map={folders_to_files_map}/>
}

