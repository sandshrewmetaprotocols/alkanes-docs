import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageVideo from '@site/src/components/HomepageVideo';
import styles from './styles.module.css';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Discover the Alkanes metaprotocol core docs for learning about smart contracts on Bitcoin, developer guides, and access to the indexer"
    >
      <main className={styles.mainContent}>
        <HomepageVideo />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
