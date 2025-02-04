import type { ReactNode } from 'react';
import { Component } from 'react';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
  link?: string;
};

const SECTIONS = [
  {
    title: 'Get Started',
    items: [
      {
        title: 'You are early',
        link: '/docs/developers/disclaimer',
        description:
          'Build trustless protocols on Bitcoin. A complete development stack that embraces UTXO.',
        icon: '',
      },
      {
        title: 'Developer Guides',
        description:
          'Comprehensive guides covering SDK integration, contract deployment strategies, and development best practices.',
        icon: '',
        link: '/docs/developers/contracts-building',
      },
      {
        title: 'Developer Quickstart',
        description:
          'Get started with Alkanes in minutes. Set up your environment, deploy your first smart contract, and begin building.',
        icon: '',
        link: '/docs/developers/quickstart',
      },
    ],
  },
  {
    title: 'Experiments',
    items: [
      {
        title: 'Explore Playground',
        description:
          'Discover live applications and protocols built on Alkanes. See real-world examples of what you can build on Bitcoin.',
        icon: '',
        link: '/playground',
      },
      {
        title: 'Contract References',
        description:
          'Explore our collection of reference smart contracts, from AMMs to lending protocols, all built natively on Bitcoin.',
        icon: '',
        link: '/docs/developers/contracts/telestable',
      },
      {
        title: 'What is Diesel?',
        description:
          'Learn about Diesel, the Genesis Token standard on Alkanes that enables robust and efficient fungible token creation on Bitcoin.',
        icon: '',
        link: '/docs/learn/diesel',
      },
    ],
  },
  {
    title: 'Join the Community',
    items: [
      {
        title: 'Discord',
        description: '',
        icon: 'discord',
        link: 'https://discord.gg/anPUpQtPzg',
      },
      {
        title: 'X',
        description: '',
        icon: 'twitter',
        link: 'https://twitter.com/oylwallet',
      },
      {
        title: 'GitHub',
        description: '',
        icon: 'github',
        link: 'https://github.com/sandshrewmetaprotocols',
      },
    ],
  },
];

function Feature({ title, description, icon, link }: FeatureItem) {
  const content = (
    <div className={styles.featureCard}>
      {icon && <div className={styles.featureIcon} data-icon={icon} />}
      {title && !icon && <h3 className={styles.featureTitle}>{title}</h3>}
      {description && <p className={styles.featureDescription}>{description}</p>}
    </div>
  );

  return link ? (
    <a
      href={link}
      className={styles.featureLink}
      target={link.startsWith('http') ? '_blank' : undefined}
      rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  ) : (
    content
  );
}

// Add Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('HomepageFeatures Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function HomepageFeatures(): ReactNode {
  return (
    <ErrorBoundary>
      <div className="container">
        <div className={styles.featuresContainer}>
          {SECTIONS.map((section, idx) => (
            <div key={idx} className={styles.featureSection}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <div className={styles.featureGrid}>
                {section.items.map((props, itemIdx) => (
                  <Feature key={itemIdx} {...props} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
