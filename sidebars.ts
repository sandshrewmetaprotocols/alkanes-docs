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
        'learn/what-can-we-build',
        {
          type: 'doc',
          id: 'learn/diesel',
          label: 'What is Diesel?',
        },
        'learn/faq',
        {
          type: 'category',
          label: 'Blog & Updates',
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
            'case-studies/subfrost',
            'case-studies/bound-stablecoin',
            'case-studies/oyl-amm',
            'case-studies/starknet',
            'case-studies/rebar',
            'case-studies/laser-eyes',
            'case-studies/beyond',
          ],
        },
        {
          type: 'category',
          label: 'Background',
          collapsible: false,
          collapsed: false,
          link: undefined,
          items: ['learn/background/metaprotocols', 'learn/background/glossary'],
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
      items: [
        {
          type: 'doc',
          id: 'developers/disclaimer',
          label: 'Welcome Dreamers & Builders',
        },
        'developers/intro',
        'developers/test-env',
        'developers/quickstart',
        'developers/setup',
      ],
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
        'developers/dapp-integration',
      ],
    },
    {
      type: 'category',
      label: 'Oyl SDK',
      collapsible: false,
      collapsed: false,
      link: undefined,
      items: [
        'developers/sdk/index',
        'developers/sdk/cli',
        'developers/sdk/provider',
        'developers/sdk/account',
        'developers/sdk/signer',
        'developers/sdk/utxo',
        'developers/sdk/bitcoin',
        'developers/sdk/alkanes',
        'developers/sdk/runes',
        'developers/sdk/ordinals',
        'developers/sdk/brc20',
      ],
    },
    {
      type: 'category',
      label: 'Contract References',
      collapsible: false,
      collapsed: false,
      link: undefined,
      items: [
        {
          type: 'doc',
          id: 'developers/contracts/telestable',
          label: 'Telestable',
        },
        {
          type: 'doc',
          id: 'developers/contracts/subfrost',
          label: 'Subfrost',
        },
        {
          type: 'doc',
          id: 'developers/contracts/factory',
          label: 'Alkane Factory',
        },
        {
          type: 'doc',
          id: 'developers/contracts/shorcell',
          label: 'Shorcell',
        },
        {
          type: 'doc',
          id: 'developers/contracts/cairokane',
          label: 'Cairokane',
        },
      ],
    },
  ],
};

export default sidebars;
