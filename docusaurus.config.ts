import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Alkanes',
  tagline: 'The Next Generation of DeFi Infrastructure | Secure, Scalable, and Efficient',
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
          'Discover Alkanes - The revolutionary DeFi infrastructure platform built for security, scalability, and efficiency. Learn about our advanced protocols, developer tools, and ecosystem.',
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
          'Discover Alkanes - The revolutionary DeFi infrastructure platform built for security, scalability, and efficiency. Learn about our advanced protocols, developer tools, and ecosystem.',
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
        name: 'twitter:site',
        content: '@oylwallet',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:title',
        content: 'Alkanes - Next Generation DeFi Infrastructure',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:description',
        content:
          'Discover Alkanes - The revolutionary DeFi infrastructure platform built for security, scalability, and efficiency. Learn about our advanced protocols, developer tools, and ecosystem.',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/sandshrewmetaprotocols/alkanes-wiki/tree/main',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/sandshrew.svg',
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
        },
        {
          href: 'https://twitter.com/oylwallet',
          position: 'right',
          className: 'header-twitter-link',
          'aria-label': 'Twitter',
        },
        {
          href: 'https://discord.gg/your-discord-invite',
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
      links: [
        {
          title: 'Product',
          items: [
            {
              label: 'Install',
              to: '/docs/getting-started',
            },
            {
              label: 'Documentation',
              to: '/docs',
            },
            {
              label: 'Support',
              to: '/support',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'Privacy Policy',
              to: '/privacy',
            },
            {
              label: 'Brand Assets',
              to: '/brand',
            },
            {
              label: 'Work With Us',
              to: '/careers',
            },
          ],
        },
        {
          title: 'Socials',
          items: [
            {
              label: '@OylWallet',
              href: 'https://twitter.com/oylwallet',
            },
            {
              label: '@OylDynamics',
              href: 'https://twitter.com/oyldynamics',
            },
            {
              label: 'Contact',
              to: '/contact',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Oyl Corp.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
