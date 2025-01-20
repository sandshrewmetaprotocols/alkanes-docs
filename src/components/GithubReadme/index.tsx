import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './styles.module.css';

interface GithubReadmeProps {
  owner: string;
  repo: string;
}

export function GithubReadme({ owner, repo }: GithubReadmeProps) {
  const [content, setContent] = useState<string>('Loading...');

  useEffect(() => {
    async function fetchReadme() {
      try {
        // First try to get the README content using the GitHub API
        const apiResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
          headers: {
            Accept: 'application/vnd.github.v3.raw',
          },
        });

        if (!apiResponse.ok) {
          // Fallback to raw content if API fails
          const rawResponse = await fetch(
            `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`
          );
          if (!rawResponse.ok) {
            throw new Error('Failed to fetch README');
          }
          const text = await rawResponse.text();
          setContent(text);
          return;
        }

        const text = await apiResponse.text();
        setContent(text);
      } catch (error) {
        console.error('Error fetching README:', error);
        // Try one more time with the 'main' branch if 'master' failed
        try {
          const mainResponse = await fetch(
            `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`
          );
          if (!mainResponse.ok) throw new Error('Failed to fetch README');
          const text = await mainResponse.text();
          setContent(text);
        } catch (fallbackError) {
          setContent('Failed to load README content. Please check back later.');
          console.error('Error in fallback:', fallbackError);
        }
      }
    }

    fetchReadme();
  }, [owner, repo]);

  return (
    <BrowserOnly>
      {() => (
        <div className={styles.readmeContent}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Override how code blocks are rendered
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <pre className={className}>
                    <code {...props} className={className}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </BrowserOnly>
  );
}
