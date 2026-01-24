import { readJson } from "@/app/common/gray_matter";
import { use } from "react";
import styles from './page.module.css';
import path from "path";
export default async function NotePage({ params, searchParams }: any) {
  try{

  const resolvedParams = await params; // unwrap the promise
  const resolvedSearchParams = await searchParams;
  const level = await resolvedSearchParams.level;

  const { type } = resolvedParams; // destructure the dynamic param

  const filePath = path.join(process.cwd(), `content/${type}/${level}.json`);

  const data = await readJson(filePath);
  const { title, subheading, sections } = data;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.subtitle}>{subheading}</div>

      <div className={styles.sections}>
        {sections?.map((section: any, i: any) => (
          <div key={i} className={styles.section}>
            <div className={styles.sectionTitle}>{section.title}</div>

            {section?.content?.map((cmd: any) => (
              <div key={cmd.name} className={styles.command}>
                <div className={styles.commandName}>{cmd.name}</div>
                <div className={styles.commandDescription}>{cmd.description}</div>

                {cmd?.example?.length && (
                  <div className={styles.commandExample}>
                    <div>Example:</div>
                    <div className={styles.codeBlock}>
                      {
                        cmd?.example?.map((e: any, i: any) => {
                          return <div key={i}>

                            {e?.input && (
                              <div>
                                <div className={styles.codeLabel}>Input:</div> <br />{e?.input}
                              </div>
                            )}
                            {e?.command && (
                              <div>
                                <div className={styles.codeLabel}>$</div> {e?.command}
                              </div>
                            )}

                            {e?.output && (
                              <div>
                                <div className={styles.codeLabel}>Output:</div> <br />{e?.output}
                              </div>
                            )}

                          </div>
                        })
                      }

                    </div>
                  </div>
                )}

                {cmd?.options?.length > 0 && (
                  <div className={styles.commandOptions}>
                    <div>Options:</div>
                    <ul>
                      {cmd.options.map((opt: any, i: any) => (
                        <li key={i}>
                          <div>{opt.option}:</div> {opt.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
  }
  catch(err){
    console.error("error occure while loading note:", JSON.stringify(err));
    return  <h1 className={styles.title}>Error Loading Note</h1>
  }
}
