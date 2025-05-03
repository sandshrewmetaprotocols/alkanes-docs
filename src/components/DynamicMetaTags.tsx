import React from 'react';
import { useLocation } from '@docusaurus/router';
import { useDoc } from '@docusaurus/theme-common/internal';

export default function DynamicMetaTags(): JSX.Element {
  const location = useLocation();
  const { metadata } = useDoc();

  const ogImage = metadata.frontMatter.og_image || 'img/opengraphalkane.jpeg';
  const ogTitle = metadata.frontMatter.og_title || metadata.title;
  const ogDescription = metadata.frontMatter.og_description || metadata.description;

  return (
    <>
      <meta property="og:url" content={`https://alkanes-docs.vercel.app${location.pathname}`} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={`https://alkanes-docs.vercel.app/${ogImage}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={`https://alkanes-docs.vercel.app/${ogImage}`} />
    </>
  );
}
