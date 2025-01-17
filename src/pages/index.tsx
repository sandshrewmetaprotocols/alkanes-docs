import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageVideo from '@site/src/components/HomepageVideo';
import styles from './styles.module.css';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="Deploy WebAssembly smart contracts on Bitcoin L1">
      <main className={styles.mainContent}>
        <HomepageVideo />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
