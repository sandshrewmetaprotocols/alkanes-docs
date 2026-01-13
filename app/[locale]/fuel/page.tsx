"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function FuelPage() {
  const t = useTranslations("fuel");

  const lockMultipliers = [
    { period: t("staking.noLock"), multiplier: "1.0x" },
    { period: t("staking.week"), multiplier: "1.25x" },
    { period: t("staking.month"), multiplier: "1.5x" },
    { period: t("staking.threeMonths"), multiplier: "2.0x" },
    { period: t("staking.sixMonths"), multiplier: "2.5x" },
    { period: t("staking.year"), multiplier: "3.0x" },
  ];

  const emissionSchedule = [
    { epoch: 0, period: "0-2", daily: "~173 FUEL" },
    { epoch: 1, period: "2-4", daily: "~86 FUEL" },
    { epoch: 2, period: "4-6", daily: "~43 FUEL" },
    { epoch: 3, period: "6-8", daily: "~21 FUEL" },
  ];

  const treasuryAllocation = [
    { label: t("distribution.lpSeeding"), percent: 34, color: "bg-amber-500" },
    { label: t("distribution.bondingAlloc"), percent: 27, color: "bg-orange-500" },
    { label: t("distribution.communityAlloc"), percent: 24, color: "bg-yellow-500" },
    { label: t("distribution.teamVesting"), percent: 15, color: "bg-red-500" },
  ];

  const contracts = [
    { name: t("contracts.token"), desc: t("contracts.tokenDesc"), icon: "token" },
    { name: t("contracts.stakingContract"), desc: t("contracts.stakingDesc"), icon: "stake" },
    { name: t("contracts.treasury"), desc: t("contracts.treasuryDesc"), icon: "treasury" },
    { name: t("contracts.bondingContract"), desc: t("contracts.bondingDesc"), icon: "bond" },
    { name: t("contracts.redemptionContract"), desc: t("contracts.redemptionDesc"), icon: "redeem" },
    { name: t("contracts.distributor"), desc: t("contracts.distributorDesc"), icon: "distribute" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[color:var(--sf-text)] mb-4">
                {t("title")}
              </h1>
              <p className="text-lg text-[color:var(--sf-muted)] max-w-2xl mx-auto">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-[color:var(--sf-text)] mb-4">{t("overview.title")}</h2>
            <p className="text-[color:var(--sf-muted)] leading-relaxed">
              {t("overview.description")}
            </p>
          </div>
        </section>

        {/* Tokenomics Section */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-[color:var(--sf-text)] mb-8">{t("tokenomics.title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">2.1M</div>
              <div className="text-sm text-[color:var(--sf-muted)]">{t("tokenomics.maxSupply")}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">8</div>
              <div className="text-sm text-[color:var(--sf-muted)]">{t("tokenomics.decimals")}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">50%</div>
              <div className="text-sm text-[color:var(--sf-muted)]">{t("tokenomics.treasuryPremine")}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">20%</div>
              <div className="text-sm text-[color:var(--sf-muted)]">{t("tokenomics.teamPremine")}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-amber-500 mb-2">30%</div>
              <div className="text-sm text-[color:var(--sf-muted)]">{t("tokenomics.emissionPool")}</div>
            </div>
          </div>
        </section>

        {/* Staking & Bonding Grid */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Staking */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[color:var(--sf-text)]">{t("staking.title")}</h3>
              </div>
              <p className="text-[color:var(--sf-muted)] mb-6">{t("staking.description")}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-[color:var(--sf-muted)] pb-2 border-b border-[color:var(--sf-outline)]">
                  <span>{t("staking.lockPeriod")}</span>
                  <span>{t("staking.multiplier")}</span>
                </div>
                {lockMultipliers.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-2">
                    <span className="text-[color:var(--sf-text)]">{item.period}</span>
                    <span className="text-green-500 font-medium">{item.multiplier}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonding */}
            <div className="glass-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[color:var(--sf-text)]">{t("bonding.title")}</h3>
              </div>
              <p className="text-[color:var(--sf-muted)] mb-6">{t("bonding.description")}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[color:var(--sf-surface)] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500 mb-1">10%</div>
                  <div className="text-xs text-[color:var(--sf-muted)]">{t("bonding.discount")}</div>
                </div>
                <div className="bg-[color:var(--sf-surface)] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-500 mb-1">7 {t("bonding.days")}</div>
                  <div className="text-xs text-[color:var(--sf-muted)]">{t("bonding.vestingPeriod")}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Redemption Section */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[color:var(--sf-text)]">{t("redemption.title")}</h3>
            </div>
            <p className="text-[color:var(--sf-muted)] mb-6">{t("redemption.description")}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[color:var(--sf-surface)] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-500 mb-1">1%</div>
                <div className="text-xs text-[color:var(--sf-muted)]">{t("redemption.fee")}</div>
              </div>
              <div className="bg-[color:var(--sf-surface)] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-500 mb-1">24 {t("redemption.hours")}</div>
                <div className="text-xs text-[color:var(--sf-muted)]">{t("redemption.cooldown")}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Treasury Allocation */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-[color:var(--sf-text)] mb-4">{t("distribution.title")}</h2>
          <p className="text-[color:var(--sf-muted)] mb-8">{t("distribution.description")}</p>
          <div className="glass-card p-8">
            <div className="flex h-8 rounded-full overflow-hidden mb-6">
              {treasuryAllocation.map((item, i) => (
                <div
                  key={i}
                  className={`${item.color} transition-all`}
                  style={{ width: `${item.percent}%` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {treasuryAllocation.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${item.color}`} />
                  <div>
                    <div className="text-sm font-medium text-[color:var(--sf-text)]">{item.label}</div>
                    <div className="text-xs text-[color:var(--sf-muted)]">{item.percent}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Emission Schedule */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-[color:var(--sf-text)] mb-4">{t("emissions.title")}</h2>
          <p className="text-[color:var(--sf-muted)] mb-8">{t("emissions.description")}</p>
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--sf-outline)]">
                  <th className="text-left p-4 text-sm font-medium text-[color:var(--sf-muted)]">{t("emissions.epoch")}</th>
                  <th className="text-left p-4 text-sm font-medium text-[color:var(--sf-muted)]">{t("emissions.period")}</th>
                  <th className="text-right p-4 text-sm font-medium text-[color:var(--sf-muted)]">{t("emissions.dailyEmission")}</th>
                </tr>
              </thead>
              <tbody>
                {emissionSchedule.map((row, i) => (
                  <tr key={i} className="border-b border-[color:var(--sf-outline)] last:border-0">
                    <td className="p-4 text-[color:var(--sf-text)]">{row.epoch}</td>
                    <td className="p-4 text-[color:var(--sf-muted)]">{row.period} {t("emissions.years")}</td>
                    <td className="p-4 text-right text-amber-500 font-medium">{row.daily}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* System Contracts */}
        <section className="max-w-7xl mx-auto px-4 py-12 pb-24">
          <h2 className="text-2xl font-bold text-[color:var(--sf-text)] mb-8">{t("contracts.title")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contracts.map((contract, i) => (
              <div key={i} className="glass-card p-6 hover:border-amber-500/50 transition-colors">
                <h4 className="font-semibold text-[color:var(--sf-text)] mb-2">{contract.name}</h4>
                <p className="text-sm text-[color:var(--sf-muted)]">{contract.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
