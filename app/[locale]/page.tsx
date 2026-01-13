"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DieselPriceCard } from "@/components/DieselPriceCard";
import { VaultPerformance } from "@/components/VaultPerformance";
import { ActiveProposals } from "@/components/ActiveProposals";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* DIESEL Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="/alkanes-mark.png"
                alt="ALKANES"
                className="h-20 w-auto object-contain"
              />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-[color:var(--sf-text)]">
              {t("home.hero.title")}
            </h1>

            {/* Rainbow bar */}
            <div className="diesel-rainbow-bar-thick max-w-xs mx-auto mb-6" />

            <p className="text-xl text-[color:var(--sf-muted)] mb-8 max-w-2xl mx-auto">
              {t("home.hero.subtitle")}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/governance" className="btn-primary">
                {t("home.hero.viewProposals")}
              </Link>
              <Link href="/docs" className="btn-secondary">
                {t("home.hero.readDocs")}
              </Link>
              <a
                href="https://api.subfrost.io"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-frost"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="2" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {t("home.hero.getApiKey")}
              </a>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Price Card */}
              <div className="lg:col-span-1">
                <DieselPriceCard />
              </div>

              {/* Right Column - Vaults & Proposals */}
              <div className="lg:col-span-2 space-y-6">
                {/* Active Proposals - Featured prominently */}
                <ActiveProposals />

                {/* Vault Performance */}
                <VaultPerformance />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-[color:var(--sf-text)]">
              {t("home.explore.title")}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickLinkCard
                href="/governance"
                icon="🗳️"
                title={t("home.explore.governance.title")}
                description={t("home.explore.governance.description")}
              />
              <QuickLinkCard
                href="/forum"
                icon="💬"
                title={t("home.explore.forum.title")}
                description={t("home.explore.forum.description")}
              />
              <QuickLinkCard
                href="/docs"
                icon="📚"
                title={t("home.explore.docs.title")}
                description={t("home.explore.docs.description")}
              />
              <QuickLinkCard
                href="/docs/quickstart"
                icon="⚡"
                title={t("home.explore.quickstart.title")}
                description={t("home.explore.quickstart.description")}
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-[color:var(--sf-text)]">
              {t("home.features.title")}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon="🔒"
                title={t("home.features.security.title")}
                description={t("home.features.security.description")}
              />
              <FeatureCard
                icon="⚡"
                title={t("home.features.wasm.title")}
                description={t("home.features.wasm.description")}
              />
              <FeatureCard
                icon="🗳️"
                title={t("home.features.governance.title")}
                description={t("home.features.governance.description")}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 text-center overflow-hidden relative">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--sf-boost-bg-from)] to-[var(--sf-boost-bg-to)] opacity-50" />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4 text-[color:var(--sf-text)]">
                  {t("home.cta.title")}
                </h2>
                <p className="text-lg text-[color:var(--sf-muted)] mb-8">
                  {t("home.cta.description")}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/governance" className="btn-primary">
                    {t("home.cta.viewProposals")}
                  </Link>
                  <a
                    href="https://github.com/kungfuflex/alkanes-rs/tree/develop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    {t("home.cta.github")}
                  </a>
                </div>
              </div>

              {/* Rainbow bar at bottom */}
              <div className="absolute bottom-0 left-0 right-0 diesel-rainbow-bar" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function QuickLinkCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="glass-card-hover p-6 group"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-[color:var(--sf-text)] group-hover:text-[color:var(--sf-primary)] transition-colors mb-2">
        {title}
      </h3>
      <p className="text-sm text-[color:var(--sf-muted)]">{description}</p>
    </Link>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card p-6 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-[color:var(--sf-text)] mb-2">{title}</h3>
      <p className="text-[color:var(--sf-muted)]">{description}</p>
    </div>
  );
}
