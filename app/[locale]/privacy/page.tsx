"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicyPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <article className="prose prose-invert max-w-none prose-headings:text-[color:var(--sf-text)] prose-p:text-[color:var(--sf-text)] prose-a:text-[color:var(--sf-primary)] prose-strong:text-[color:var(--sf-text)] prose-li:text-[color:var(--sf-text)]">
          <h1>Privacy Policy</h1>
          <p className="text-[color:var(--sf-muted)]">Last updated: January 2025</p>

          <h2>Overview</h2>
          <p>
            DIESEL and the Alkanes protocol are open-source software projects released under the MIT License.
            This Privacy Policy explains how we handle information when you use our website and services.
          </p>

          <h2>Information We Collect</h2>
          <h3>Blockchain Data</h3>
          <p>
            When you interact with the Alkanes protocol, your transactions are recorded on the Bitcoin blockchain.
            This data is publicly accessible and includes:
          </p>
          <ul>
            <li>Bitcoin addresses you use</li>
            <li>Transaction amounts and timestamps</li>
            <li>Smart contract interactions</li>
            <li>Governance votes (if you participate)</li>
          </ul>
          <p>
            <strong>This blockchain data is permanent and cannot be deleted.</strong> We do not control or store
            this data—it exists on the decentralized Bitcoin network.
          </p>

          <h3>Website Analytics</h3>
          <p>
            We may collect anonymous usage statistics to improve our services. This may include:
          </p>
          <ul>
            <li>Pages visited and time spent</li>
            <li>Browser type and device information</li>
            <li>Referring websites</li>
            <li>General geographic location (country/region level)</li>
          </ul>
          <p>
            We do not collect personally identifiable information through analytics.
          </p>

          <h3>Local Storage</h3>
          <p>
            Our website may store preferences locally in your browser, such as:
          </p>
          <ul>
            <li>Language preference</li>
            <li>Theme settings</li>
            <li>Wallet connection state</li>
          </ul>
          <p>
            This data stays on your device and is not transmitted to our servers.
          </p>

          <h2>Information We Do Not Collect</h2>
          <p>We do not:</p>
          <ul>
            <li>Collect or store your private keys</li>
            <li>Require account registration or personal information</li>
            <li>Track your identity across sessions</li>
            <li>Sell or share data with third parties for advertising</li>
          </ul>

          <h2>Third-Party Services</h2>
          <p>
            When you connect a wallet, you may be interacting with third-party wallet providers.
            Please review their privacy policies separately. We integrate with:
          </p>
          <ul>
            <li>Various Bitcoin wallet providers</li>
            <li>Blockchain explorers for transaction verification</li>
            <li>IPFS or similar decentralized storage networks</li>
          </ul>

          <h2>Open Source</h2>
          <p>
            All Alkanes protocol software is open source under the MIT License. You can review our code,
            run your own instance, and verify exactly what data is processed. Visit our{" "}
            <a href="https://github.com/kungfuflex/alkanes-rs/tree/develop" target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>{" "}
            for the full source code.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Clear local storage in your browser at any time</li>
            <li>Use the protocol without providing personal information</li>
            <li>Run your own instance of the open-source software</li>
            <li>Interact directly with the blockchain without using our website</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated revision date.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about this Privacy Policy, please open an issue on our{" "}
            <a href="https://github.com/kungfuflex/alkanes-rs/tree/develop" target="_blank" rel="noopener noreferrer">
              GitHub repository
            </a>{" "}
            or reach out via our community channels.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
