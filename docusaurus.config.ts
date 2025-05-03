import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Alkanes',
  tagline: 'Alkanes Docs',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://alkanes-docs.vercel.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'sandshrewmetaprotocols', // Usually your GitHub org/user name.
  projectName: 'alkanes-docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  plugins: [
    [
      'vercel-analytics',
      {
        debug: false,
        mode: 'auto',
      },
    ],
    function dynamicMetaTags() {
      return {
        name: 'dynamic-meta-tags',
        injectHtmlTags() {
          return {
            headTags: [
              {
                tagName: 'meta',
                attributes: {
                  property: 'og:type',
                  content: 'website',
                },
              },
              {
                tagName: 'meta',
                attributes: {
                  property: 'og:title',
                  content: 'Alkanes',
                },
              },
              {
                tagName: 'meta',
                attributes: {
                  property: 'og:description',
                  content: 'Bitcoin-native Smart Contracts',
                },
              },
              {
                tagName: 'meta',
                attributes: {
                  property: 'og:image',
                  content: 'https://alkanes-docs.vercel.app/img/opengraphalkane.jpeg',
                },
              },
              {
                tagName: 'meta',
                attributes: {
                  property: 'og:image:width',
                  content: '1200',
                },
              },
              {
                tagName: 'meta',
                attributes: {
                  property: 'og:image:height',
                  content: '630',
                },
              },
              {
                tagName: 'meta',
                attributes: {
                  property: 'og:image:type',
                  content: 'image/jpeg',
                },
              },
              {
                tagName: 'meta',
                attributes: {
                  name: 'twitter:card',
                  content: 'summary_large_image',
                },
              },
              {
                tagName: 'meta',
                attributes: {
                  name: 'twitter:title',
                  content: 'Alkanes',
                },
              },
              {
                tagName: 'meta',
                attributes: {
                  name: 'twitter:description',
                  content: 'Bitcoin-native Smart Contracts',
                },
              },
              {
                tagName: 'meta',
                attributes: {
                  name: 'twitter:image',
                  content: 'https://alkanes-docs.vercel.app/img/opengraphalkane.jpeg',
                },
              },
              {
                tagName: 'meta',
                attributes: {
                  name: 'twitter:image:alt',
                  content: 'Alkanes Logo',
                },
              },
            ],
          };
        },
      };
    },
  ],

  // Add head meta tags for favicons
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/apple-touch-icon.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/img/favicon-32x32.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/img/favicon-16x16.png',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content:
          'Discover the Alkanes metaprotocol core docs for learning about smart contracts on Bitcoin, developer guides, and access to the indexer',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content:
          'Alkanes, DeFi, blockchain, cryptocurrency, smart contracts, web3, infrastructure, protocols, developer tools',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:description',
        content:
          'Discover the Alkanes metaprotocol core docs for learning about smart contracts on Bitcoin, developer guides, and access to the indexer',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:site',
        content: '@oylwallet',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:title',
        content: 'Alkanes | Bitcoin-native Smart Contracts',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:description',
        content:
          'Discover the Alkanes metaprotocol core docs for learning about smart contracts on Bitcoin, developer guides, and access to the indexer',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/sandshrewmetaprotocols/alkanes-wiki/tree/main',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'https://alkanes-docs.vercel.app/img/opengraphalkane.jpeg',
    metadata: [
      {
        name: 'og:image',
        content: 'https://alkanes-docs.vercel.app/img/opengraphalkane.jpeg',
      },
      {
        name: 'og:image:width',
        content: '1200',
      },
      {
        name: 'og:image:height',
        content: '630',
      },
      {
        name: 'og:image:alt',
        content: 'Alkanes | Alkanes',
      },
    ],
    navbar: {
      title: 'Alkanes',
      logo: {
        alt: 'Alkanes Logo',
        src: 'img/AlkaneLogo.png',
        className: 'navbar-logo',
        style: {
          height: '32px',
          width: 'auto',
        },
      },
      items: [
        {
          to: '/',
          position: 'left',
          label: 'Home',
        },
        {
          type: 'docSidebar',
          sidebarId: 'learnSidebar',
          position: 'left',
          label: 'Learn',
        },
        {
          type: 'docSidebar',
          sidebarId: 'developersSidebar',
          position: 'left',
          label: 'Developers',
        },
        {
          type: 'search',
          position: 'right',
          className: 'header-search',
        },
        {
          href: 'https://twitter.com/oylwallet',
          position: 'right',
          className: 'header-twitter-link',
          'aria-label': 'Twitter',
        },
        {
          href: 'https://discord.gg/anPUpQtPzg',
          position: 'right',
          className: 'header-discord-link',
          'aria-label': 'Discord',
        },
        {
          href: 'https://github.com/sandshrewmetaprotocols',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub',
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `© ${new Date().getFullYear()} Oyl Corp.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    algolia: {
      // The application ID provided by Algolia
      appId: '54ZNRO76KK',

      // Public API key: it is safe to commit it
      apiKey: '80eed2d2d74e1469bf69101ec9fa9d8d',

      indexName: 'alkanes-vercel',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Specify domains where the navigation should occur through window.location instead on history.push
      externalUrlRegex: 'external\\.com|domain\\.com',

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,

      //... other Algolia params
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
