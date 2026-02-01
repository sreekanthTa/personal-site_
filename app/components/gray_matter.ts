import matter from 'gray-matter';
import fs from 'fs';

export const readJson = async (filepath: string) => {
   const jsonData  = fs.readFileSync(filepath, 'utf8');
   return JSON.parse(jsonData);
}
