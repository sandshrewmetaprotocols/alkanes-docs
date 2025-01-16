import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  learnSidebar: [
    {
      type: 'category',
      label: 'Learn',
      collapsible: false,
      collapsed: false,
      link: undefined,
      items: [
        'learn/intro',
        'learn/alkanes',
        'learn/metashrew',
        'learn/faq',
        'learn/newpage',
        {
          type: 'category',
          label: 'Blog',
          collapsible: false,
          collapsed: false,
          link: undefined,
          items: [
            'blog/smart-contracts-bitcoin',
            'blog/weapons-grade-metaprotocols',
            'blog/native-bitcoin-staking',
          ],
        },
        {
          type: 'category',
          label: 'Use Cases',
          collapsible: false,
          collapsed: false,
          link: undefined,
          items: [
            'case-studies/bound-stablecoin',
            'case-studies/oyl-amm',
            'case-studies/starkware',
            'case-studies/laser-eyes',
            'case-studies/subfrost',
            'case-studies/beyond',
          ],
        },
        {
          type: 'category',
          label: 'Background',
          collapsible: false,
          collapsed: false,
          link: undefined,
          items: ['learn/background/metaprotocols'],
        },
      ],
    },
  ],

  developersSidebar: [
    {
      type: 'category',
      label: 'Developer Quickstart',
      collapsible: false,
      collapsed: false,
      link: undefined,
      items: ['developers/intro', 'developers/setup', 'developers/quickstart'],
    },
    {
      type: 'category',
      label: 'Developer Guides',
      collapsible: false,
      collapsed: false,
      link: undefined,
      items: [
        'developers/contracts-building',
        'developers/contracts-interaction',
        'developers/protorunes',
        'developers/rpc',
        'developers/alkanes-libraries',
        'developers/dapp-integration',
      ],
    },
  ],
};

export default sidebars;
