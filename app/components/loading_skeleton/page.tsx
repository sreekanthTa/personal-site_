import styles from './page.module.css';

export default function LoadingSkeleton() {
  return (
    <div className={styles.page}>
      {/* Title Skeleton */}
      <div className={`${styles.skeleton}`} style={{ height: '48px', width: '60%', marginBottom: '20px' }} />
      
      {/* Subheading Skeleton */}
      <div className={`${styles.skeleton}`} style={{ height: '24px', width: '40%', marginBottom: '40px' }} />

      {/* Repeating Section Skeletons */}
      <div className={styles.sections}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.section} style={{ marginBottom: '30px' }}>
            <div className={styles.skeleton} style={{ height: '32px', width: '30%', marginBottom: '15px' }} />
            <div className={styles.skeleton} style={{ height: '120px', width: '100%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
