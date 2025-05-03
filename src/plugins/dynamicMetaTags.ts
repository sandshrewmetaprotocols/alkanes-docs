import type { Plugin } from '@docusaurus/types';

export default function dynamicMetaTags(): Plugin {
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
        ],
      };
    },
    contentLoaded({ actions }) {
      const { addRoute } = actions;
      addRoute({
        path: '/docs/developers/quickstart',
        component: '@site/src/components/DynamicMetaTags',
        exact: true,
      });
    },
  };
}
