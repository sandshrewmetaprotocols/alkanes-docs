import type { ReactNode } from 'react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
  link?: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Developer Quickstart',
    description:
      'Get started with Alkanes in minutes. Set up your environment, deploy your first smart contract, and begin building—no prior experience required.',
    icon: '',
    link: '/docs/developers/quickstart',
  },
  {
    title: 'Developer Guides',
    description:
      'Comprehensive guides for professionals covering SDK integration, contract deployment strategies, and development best practices.',
    icon: '',
    link: '/docs/developers/contracts-building',
  },
  {
    title: 'Learn Alkanes',
    description:
      'New to Alkanes? Start here to understand Bitcoin-native smart contracts and how Alkanes redefines blockchain programmability.',
    icon: '',
    link: '/docs/learn/intro',
  },
  {
    title: 'Technical Background',
    description:
      "Deep dive into Alkanes's architecture, including Ordinals integration, WebAssembly runtime, and protocol specifications.",
    icon: '',
    link: '/docs/learn/background/metaprotocols',
  },
  {
    title: 'Use Cases',
    description:
      'Explore real-world applications from DeFi to advanced cryptographic proofs. See how Alkanes empowers developers on Bitcoin.',
    icon: '',
    link: '/docs/case-studies/bound-stablecoin',
  },
  {
    title: 'Blog & Updates',
    description:
      'Stay connected with the latest insights, technical updates, and ecosystem developments from the Alkanes community.',
    icon: '',
    link: '/docs/blog/weapons-grade-metaprotocols',
  },
];

function Feature({ title, description, icon, link }: FeatureItem) {
  const content = (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );

  return link ? (
    <a href={link} className={styles.featureLink}>
      {content}
    </a>
  ) : (
    content
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <div className="container">
      <div className={styles.featureGrid}>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </div>
  );
}
