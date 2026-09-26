
import ChatContainer from './components/chat/client';
import styles from './page.module.css';
import { emailFormHandler } from '../actions/redirect';

export const dynamic = 'force-dynamic';

export default function Page() {
  const skills = ['Next.js', 'React.js', 'Node.js', 'CSS', 'JavaScript', 'Python', 'TypeScript'];
  const availability = 'Available for freelance and product work';
  const yearsOfExperience = 2;

  const actionHandler = async (formData: FormData) => {
    'use server';
    await emailFormHandler(formData);
  };

  return (
    <>
      {/* HERO */}
      <section className={styles.hero} id="home">
        <div className={styles.container}>
          <div className={styles.text}>
            <p className={styles.subtitle}>{availability}</p>

            <h1 className={styles.title}>
              I build scalable full-stack apps using <p className={styles.highlight}>React, Node.js & PostgreSQL</p>
            </h1>
            <p className={styles.description}>
              I create fast, responsive, and beautiful websites using React, Next.js, and Node.js.
              Over the last {yearsOfExperience}+ years, I have helped teams turn ideas into practical digital products.
              Check out my work and feel free to contact me.
            </p>
            <div className={styles.buttons}>
              <a className={styles.primaryBtn} href="#projects">
                View GitHub
              </a>
              <a className={styles.secondaryBtn} href="#contact">
                Contact Me
              </a>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.profileCircle}>
              <div className={styles.initial}>Y</div>
            </div>
            <p className={styles.cardText}>“Turning ideas into real web applications.”</p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className={styles.about} id="about">
        <div className={styles.sectionContainer}>
          <h2>About Me</h2>
          <p>
            I am a full-stack developer who builds modern web applications using Next.js, React, and Node.js.
            I love building clean UI and solving real problems with thoughtful product thinking.
          </p>
        </div>
      </section>

      {/* SKILLS */}
      <section className={styles.skills} id="skills">
        <div className={styles.sectionContainer}>
          <h2>Skills</h2>
          <div className={styles.skillsGrid}>
            {skills?.map((skill: string) => {
              return (
                <div key={skill} className={styles.skillCard}>
                  {skill}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className={styles.contact} id="contact">
        <div className={styles.sectionContainer}>
          <h2>Contact Me</h2>
          <p>Feel free to reach out for collaborations or job opportunities.</p>
          <div className={styles?.formContainer}>
            <form className={styles.form} action={actionHandler}>
              <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter Your email" required />
              </div>

              <div>
                <label htmlFor="message">Message</label>
                <textarea id="message" placeholder="Enter Your Message" name="message" minLength={10} rows={2} required />
              </div>

              <button type="submit">Sent</button>
            </form>
          </div>
        </div>
      </section>
      <ChatContainer SYSTEMPROMPTTYPE="PORTFOLIO" apiPath="notes" />
    </>
  );
}
