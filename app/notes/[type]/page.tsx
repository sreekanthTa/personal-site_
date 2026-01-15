import { readJson } from "@/app/common/gray_matter";
import { use } from "react";
import styles from './page.module.css';

export default async function NotePage({ params, searchParams }: any) {
    const resolvedParams = await params; // unwrap the promise
    const resolvedSearchParams = await searchParams;
    const level = await resolvedSearchParams.level;

  const { type } = resolvedParams; // destructure the dynamic param


  const data = await readJson(`app/content/${type}/${level}.json`);
  const { title, subheading, sections } = data;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.subtitle}>{subheading}</div>

      <div className={styles.sections}>
        {sections?.map((section: any,i:any) => (
          <div key={i} className={styles.section}>
            <div className={styles.sectionTitle}>{section.title}</div>

            {section?.content?.map((cmd: any) => (
              <div key={cmd.name} className={styles.command}>
                <div className={styles.commandName}>{cmd.name}</div>
                <div className={styles.commandDescription}>{cmd.description}</div>

                {cmd?.example?.length && (
                  <div className={styles.commandExample}>
                    <strong>Example:</strong>
                    <div className={styles.codeBlock}>
                      {
                        cmd?.example?.map((e:any, i:any) => {
                          return <div key={i}>
                           
                            {e?.input && (
                              <div>
                                <span className={styles.codeLabel}>Input:</span> <br/>{e?.input}
                              </div>
                            )}
                             {e?.command && (
                              <div>
                                <span className={styles.codeLabel}>$</span> {e?.command}
                              </div>
                            )}

                            {e?.output && (
                              <div>
                                <span className={styles.codeLabel}>Output:</span> <br/>{e?.output}
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
    <strong>Options:</strong>
    <ul>
      {cmd.options.map((opt:any, i:any) => (
        <li key={i}>
          <strong>{opt.option}:</strong> {opt.description}
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
  );}
