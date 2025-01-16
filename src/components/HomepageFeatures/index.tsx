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
      'Start building in minutes. Set up your environment, deploy your first contract, and understand the basics of Alkane development.',
    icon: '🚀',
    link: '/docs/developers/quickstart',
  },
  {
    title: 'Developer Guides',
    description:
      'Comprehensive guides for building and deploying smart contracts, including SDK references and best practices.',
    icon: '📘',
    link: '/docs/developers/contracts-building',
  },
  {
    title: 'Learn Alkane',
    description:
      'New to Alkane? Start here to understand the fundamentals of Bitcoin smart contracts and the Alkane protocol.',
    icon: '🎓',
    link: '/docs/learn/intro',
  },
  {
    title: 'Technical Background',
    description:
      "Deep dive into Alkane's architecture, including Ordinals integration, WebAssembly runtime, and protocol specifications.",
    icon: '🔬',
    link: '/docs/learn/background/runtime',
  },
  {
    title: 'Use Cases',
    description:
      'Explore real-world applications and examples of smart contracts built on Bitcoin using Alkane.',
    icon: '💡',
    link: '/docs/learn/use-cases',
  },
  {
    title: 'Blog & Updates',
    description:
      'Stay up to date with the latest developments, technical deep dives, and community updates.',
    icon: '📰',
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
