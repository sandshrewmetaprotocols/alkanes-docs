import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SubfrostSvg from '@site/static/img/subfrost.svg';
import {FeatureCard} from '@site/src/components/FeatureCard';


function HomepageHeader() {
  return (
    <header className="py-16 px-4">
      <div className="container flex justify-center">
        <SubfrostSvg className="w-full max-w-[916px] h-auto mb-8" />
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Alkanes`}
      description="Alkanes is a platform for building and deploying smart contracts on Bitcoin.">
      <HomepageHeader />
      <main>
        TODO
      </main>
    </Layout>
  );
}
