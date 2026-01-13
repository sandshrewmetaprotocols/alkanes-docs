"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TermsOfServicePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        <article className="prose prose-invert max-w-none prose-headings:text-[color:var(--sf-text)] prose-p:text-[color:var(--sf-text)] prose-a:text-[color:var(--sf-primary)] prose-strong:text-[color:var(--sf-text)] prose-li:text-[color:var(--sf-text)]">
          <h1>Terms of Service</h1>
          <p className="text-[color:var(--sf-muted)]">Last updated: January 2025</p>

          <h2>MIT License</h2>
          <p>
            The Alkanes protocol, DIESEL governance system, and all associated software are released under
            the MIT License. By using this software, you agree to the following terms:
          </p>

          <div className="bg-[color:var(--sf-surface)] p-4 rounded-lg border border-[color:var(--sf-outline)] my-6">
            <p className="text-sm font-mono">
              MIT License
              <br /><br />
              Copyright (c) 2025 Alkanes Foundation
              <br /><br />
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the "Software"), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
              <br /><br />
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
              <br /><br />
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
          </div>

          <h2>No Warranty</h2>
          <p>
            <strong>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.</strong>
          </p>
          <p>
            This includes, but is not limited to:
          </p>
          <ul>
            <li>No guarantee that the software will meet your requirements</li>
            <li>No guarantee that the software will be uninterrupted, timely, secure, or error-free</li>
            <li>No guarantee regarding the accuracy or reliability of any information obtained through the software</li>
            <li>No guarantee that defects in the software will be corrected</li>
          </ul>

          <h2>Assumption of Risk</h2>
          <p>
            By using the Alkanes protocol and DIESEL governance system, you acknowledge and accept that:
          </p>
          <ul>
            <li>
              <strong>Blockchain transactions are irreversible.</strong> Mistakes cannot be undone.
            </li>
            <li>
              <strong>You are responsible for your private keys.</strong> Lost keys mean lost assets.
            </li>
            <li>
              <strong>Smart contracts may contain bugs.</strong> Despite auditing efforts, no software is perfect.
            </li>
            <li>
              <strong>Cryptocurrency values are volatile.</strong> The value of DIESEL and other tokens may fluctuate significantly.
            </li>
            <li>
              <strong>Regulatory status is uncertain.</strong> Laws regarding cryptocurrency vary by jurisdiction and may change.
            </li>
          </ul>

          <h2>No Financial Advice</h2>
          <p>
            Nothing on this website or in our software constitutes financial, investment, legal, or tax advice.
            You should consult with appropriate professionals before making any financial decisions.
          </p>

          <h2>Prohibited Uses</h2>
          <p>
            While the software is open source and permissionless, you agree not to use it for:
          </p>
          <ul>
            <li>Money laundering or terrorist financing</li>
            <li>Fraud or deception</li>
            <li>Circumventing sanctions or export controls</li>
            <li>Any activity that violates applicable laws in your jurisdiction</li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL THE AUTHORS, COPYRIGHT HOLDERS, OR ALKANES FOUNDATION BE LIABLE FOR ANY CLAIM,
            DAMAGES, OR OTHER LIABILITY ARISING FROM THE USE OF THIS SOFTWARE.
          </p>
          <p>
            This includes, but is not limited to:
          </p>
          <ul>
            <li>Loss of funds or assets</li>
            <li>Loss of profits or business opportunities</li>
            <li>Data loss or corruption</li>
            <li>Service interruptions</li>
            <li>Any indirect, incidental, special, or consequential damages</li>
          </ul>

          <h2>Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless the Alkanes Foundation, its contributors, and affiliates
            from any claims, damages, or expenses arising from your use of the software or violation of
            these terms.
          </p>

          <h2>Decentralized Governance</h2>
          <p>
            The DIESEL governance system is decentralized. Governance decisions are made by token holders
            through on-chain voting. The Alkanes Foundation does not control governance outcomes and is
            not responsible for decisions made through the governance process.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            This software may interact with third-party services, including wallet providers, blockchain
            networks, and external APIs. We are not responsible for the availability, accuracy, or
            security of these third-party services.
          </p>

          <h2>Modifications</h2>
          <p>
            As open-source software, you are free to modify the code under the MIT License.
            However, modified versions are your responsibility, and we make no guarantees about
            third-party modifications or forks.
          </p>

          <h2>Jurisdiction</h2>
          <p>
            These terms shall be governed by and construed in accordance with applicable law,
            without regard to conflict of law principles. Any disputes shall be resolved in the
            appropriate courts of competent jurisdiction.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these Terms of Service, please open an issue on our{" "}
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
