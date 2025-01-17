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
        {
          type: 'doc',
          id: 'learn/intro',
          label: 'What is Alkanes?',
        },
        {
          type: 'doc',
          id: 'learn/alkanes',
          label: 'Alkanes Asset vs Contract?',
        },
        {
          type: 'doc',
          id: 'learn/metashrew',
          label: 'What is Metashrew?',
        },
        {
          type: 'doc',
          id: 'learn/what-can-we-build',
          label: 'What Can We Build?',
        },
        {
          type: 'doc',
          id: 'learn/faq',
          label: 'FAQ',
        },
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
            'case-studies/bound-stablecoin',
            'case-studies/beyond',
            'case-studies/subfrost',
            'case-studies/laser-eyes',
            'case-studies/oyl-amm',
            'case-studies/starkware',
            'case-studies/rebar',
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
        'developers/disclaimer',
        'developers/intro',
        'developers/setup',
        'developers/quickstart',
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
        'developers/alkanes-libraries',
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
          id: 'developers/contracts/diesel',
          label: 'Diesel: Genesis Token',
        },
        {
          type: 'doc',
          id: 'developers/contracts/swap',
          label: 'Swap Contracts',
        },
        {
          type: 'doc',
          id: 'developers/contracts/stake',
          label: 'Staking Contracts',
        },
        {
          type: 'doc',
          id: 'developers/contracts/lending',
          label: 'Lending & Borrowing',
        },
        {
          type: 'doc',
          id: 'developers/contracts/stablecoin',
          label: 'Stablecoin Mechanics',
        },
        {
          type: 'doc',
          id: 'developers/contracts/governance',
          label: 'Governance Systems',
        },
        {
          type: 'doc',
          id: 'developers/contracts/quantum',
          label: 'Quantum Contracts',
        },
        {
          type: 'doc',
          id: 'developers/contracts/vault',
          label: 'Yield Vaults',
        },
        {
          type: 'doc',
          id: 'developers/contracts/orbitals',
          label: 'Non-Fungible: Orbitals',
        },
        {
          type: 'doc',
          id: 'developers/contracts/cairokane',
          label: 'Cairo VM: Cairokane',
        },
      ],
    },
  ],
};

export default sidebars;
