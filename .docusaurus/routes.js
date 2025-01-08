import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', 'a17'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'f6f'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'f08'),
            routes: [
              {
                path: '/docs/developers/guides/intro',
                component: ComponentCreator('/docs/developers/guides/intro', '144'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/docs/developers/intro',
                component: ComponentCreator('/docs/developers/intro', 'e03'),
                exact: true
              },
              {
                path: '/docs/developers/quickstart/build',
                component: ComponentCreator('/docs/developers/quickstart/build', 'efb'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/docs/developers/quickstart/deploy-regtest',
                component: ComponentCreator('/docs/developers/quickstart/deploy-regtest', '3c1'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/docs/developers/quickstart/deploy-testnet',
                component: ComponentCreator('/docs/developers/quickstart/deploy-testnet', '0a1'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/docs/developers/quickstart/intro',
                component: ComponentCreator('/docs/developers/quickstart/intro', 'fc5'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/docs/developers/quickstart/prereq',
                component: ComponentCreator('/docs/developers/quickstart/prereq', 'ce3'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/docs/developers/quickstart/setup',
                component: ComponentCreator('/docs/developers/quickstart/setup', '361'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/docs/learn/intro',
                component: ComponentCreator('/docs/learn/intro', 'b4a'),
                exact: true,
                sidebar: "mainSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
