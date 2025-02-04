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
    title: 'You are early',
    link: '/docs/developers/disclaimer',
    description:
      'A complete vertical stack for Bitcoin development that embraces UTXO constraints. Build trustless protocols and state machines with zero security compromises.',
    icon: '🔓',
  },
  {
    title: 'What is Diesel?',
    description:
      'Learn about Diesel, the Genesis Token standard on Alkanes that enables robust and efficient fungible token creation on Bitcoin.',
    icon: '',
    link: '/docs/learn/diesel',
  },
  {
    title: 'Blog & Updates',
    description:
      'Stay connected with the latest insights, technical updates, and ecosystem developments from the Alkanes community.',
    icon: '',
    link: '/docs/blog/smart-contracts-bitcoin',
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
