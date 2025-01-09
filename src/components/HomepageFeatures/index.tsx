import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Smart Contracts on Bitcoin L1',
    Svg: require('@site/static/img/sandshrew.svg').default,
    description: (
      <>
        Deploy Rust-based smart contracts compiled to WebAssembly directly on Bitcoin's base layer.
        Leverage the security and decentralization of Bitcoin with modern smart contract capabilities.
      </>
    ),
  },
  {
    title: 'Built on Proven Standards',
    Svg: require('@site/static/img/sandshrew.svg').default,
    description: (
      <>
        ALKANES builds on established Bitcoin protocols like Ordinals and Runes, 
        enabling smart contract functionality while maintaining compatibility with existing standards.
      </>
    ),
  },
  {
    title: 'Powered by Metashrew',
    Svg: require('@site/static/img/sandshrew.svg').default,
    description: (
      <>
        Utilize the powerful Metashrew indexing stack for contract deployment, execution, and state management.
        Build with confidence using our comprehensive development tools.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
