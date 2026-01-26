import { readJson } from "@/app/common/gray_matter";
import styles from './page.module.css';
import path from "path";
import { Suspense } from "react";
import CustomLoader from "@/app/common/loader/page";
import { notFound } from "next/navigation";
import fs from "fs";
import ChatUI from "@/app/common/chat/page";

export async function generateMetadata({ params, searchParams }: any) {

  const resolvedParams = await params; // unwrap the promise
  const resolvedSearchParams = await searchParams;
  const level = await resolvedSearchParams.level;

  const { type } = resolvedParams; // destructure the dynamic param

  if (!level || !type) return notFound()

  return {
    title: `Level is ${level}`,
    description: `Contains notes about ${type}`

  }

}

async function RenderData({ type, level }: any) {


  const filePath = path.join(process.cwd(), `content/${type}/${level}.json`);

  const exists = fs.existsSync(filePath);
  if (!exists) return notFound()

  const data = await readJson(filePath);
  const { title, subheading, sections } = data;


  return <>
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
  </>

}

export default async function NotePage({ params, searchParams }: any) {
  try {

    const resolvedParams = await params; // unwrap the promise
    const resolvedSearchParams = await searchParams;
    const level = await resolvedSearchParams.level;

    const { type } = resolvedParams; // destructure the dynamic param


    return (
      <>
      <div className={styles.page}>
        <Suspense fallback={<CustomLoader/>}>

          <RenderData type={type} level={level} />
        </Suspense>

      </div>
      <ChatUI/>
      </>
    );
  }
  catch (err) {
    console.error("error occure while loading note:", JSON.stringify(err));
    return <h1 className={styles.title}>Error Loading Note</h1>
  }
}
