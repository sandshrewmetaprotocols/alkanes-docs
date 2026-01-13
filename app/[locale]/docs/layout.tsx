"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("docs.nav");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Navigation structure with translation keys
  const navigation = [
    {
      titleKey: "gettingStarted.title",
      items: [
        { titleKey: "gettingStarted.introduction", href: "/docs" },
        { titleKey: "gettingStarted.quickStart", href: "/docs/quickstart" },
      ],
    },
    {
      titleKey: "coreConcepts.title",
      items: [
        { titleKey: "coreConcepts.alkanes", href: "/docs/concepts/alkanes" },
        { titleKey: "coreConcepts.protorunes", href: "/docs/concepts/protorunes" },
      ],
    },
    {
      titleKey: "cli.title",
      items: [
        { titleKey: "cli.overview", href: "/docs/cli" },
        { titleKey: "cli.installation", href: "/docs/cli/installation" },
        { titleKey: "cli.wallet", href: "/docs/cli/wallet" },
        { titleKey: "cli.alkanes", href: "/docs/cli/alkanes" },
        { titleKey: "cli.ord", href: "/docs/cli/ord" },
        { titleKey: "cli.esplora", href: "/docs/cli/esplora" },
        { titleKey: "cli.espo", href: "/docs/cli/espo" },
        { titleKey: "cli.brc20prog", href: "/docs/cli/brc20-prog" },
        { titleKey: "cli.dataapi", href: "/docs/cli/dataapi" },
      ],
    },
    {
      titleKey: "jsonrpc.title",
      items: [
        { titleKey: "jsonrpc.overview", href: "/docs/jsonrpc/overview" },
        { titleKey: "jsonrpc.alkanes", href: "/docs/jsonrpc/alkanes" },
        { titleKey: "jsonrpc.bitcoind", href: "/docs/jsonrpc/bitcoind" },
        { titleKey: "jsonrpc.esplora", href: "/docs/jsonrpc/esplora" },
        { titleKey: "jsonrpc.espo", href: "/docs/jsonrpc/espo" },
      ],
    },
    {
      titleKey: "api.title",
      items: [
        { titleKey: "api.overview", href: "/docs/api" },
        { titleKey: "api.rest", href: "/docs/rest" },
      ],
    },
    {
      titleKey: "contracts.title",
      items: [
        { titleKey: "contracts.setup", href: "/docs/contracts/setup" },
        { titleKey: "contracts.std", href: "/docs/contracts/std" },
        { titleKey: "contracts.storage", href: "/docs/contracts/storage" },
        { titleKey: "contracts.testing", href: "/docs/contracts/testing" },
        { titleKey: "contracts.deployment", href: "/docs/contracts/deployment" },
      ],
    },
    {
      titleKey: "tutorials.title",
      items: [
        { titleKey: "tutorials.token", href: "/docs/tutorials/token" },
        { titleKey: "tutorials.amm", href: "/docs/tutorials/amm" },
        { titleKey: "tutorials.wrapBtc", href: "/docs/tutorials/wrap-btc" },
      ],
    },
    {
      titleKey: "integration.title",
      items: [
        { titleKey: "integration.nextjsSetup", href: "/docs/guides/nextjs-setup" },
        { titleKey: "integration.tsSdk", href: "/docs/guides/ts-sdk" },
        { titleKey: "integration.tsSdkApi", href: "/docs/api/ts-sdk" },
        { titleKey: "integration.alkanesWebSys", href: "/docs/integration/alkanes-web-sys" },
      ],
    },
  ];

  const NavContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      {navigation.map((section) => (
        <div key={section.titleKey}>
          <h3 className="font-semibold text-[color:var(--sf-text)] mb-2">
            {t(section.titleKey)}
          </h3>
          <ul className="space-y-1">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onLinkClick}
                  className="block py-1.5 px-3 rounded-lg text-[color:var(--sf-muted)] hover:text-[color:var(--sf-primary)] hover:bg-[color:var(--sf-surface)] transition-colors"
                >
                  {t(item.titleKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Mobile Navigation Toggle */}
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="lg:hidden flex items-center gap-2 mb-4 px-4 py-2 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] hover:border-[color:var(--sf-primary)] transition-colors"
        >
          <svg className="w-5 h-5 text-[color:var(--sf-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-[color:var(--sf-text)] font-medium">{t("menu") || "Menu"}</span>
        </button>

        {/* Mobile Navigation Overlay */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileNavOpen(false)}
            />

            {/* Sidebar Panel */}
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[color:var(--sf-background)] border-r border-[color:var(--sf-outline)] shadow-xl overflow-y-auto">
              <div className="p-4 border-b border-[color:var(--sf-outline)] flex items-center justify-between">
                <span className="font-semibold text-[color:var(--sf-text)]">{t("title") || "Documentation"}</span>
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-2 rounded-lg hover:bg-[color:var(--sf-surface)] transition-colors"
                >
                  <svg className="w-5 h-5 text-[color:var(--sf-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="p-4 space-y-6">
                <NavContent onLinkClick={() => setIsMobileNavOpen(false)} />
              </nav>
            </aside>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 space-y-8 pb-8">
              <NavContent />
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <article className="prose prose-invert max-w-none prose-headings:text-[color:var(--sf-text)] prose-p:text-[color:var(--sf-text)] prose-a:text-[color:var(--sf-primary)] prose-strong:text-[color:var(--sf-text)] prose-code:text-[color:var(--sf-primary)]">
              {children}
            </article>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
