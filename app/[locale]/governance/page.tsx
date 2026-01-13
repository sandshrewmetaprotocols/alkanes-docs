"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@/context/WalletContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  formatAddress,
  formatDiesel,
  formatTimeRemaining,
  formatRelativeTime,
} from "@/lib/utils";

interface Proposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  author: string;
  snapshot: number;
  start: string;
  end: string;
  state: "PENDING" | "ACTIVE" | "CLOSED" | "EXECUTED" | "CANCELLED";
  scores: string[];
  totalVotes: string;
  _count: {
    votes: number;
  };
}

export default function GovernancePage() {
  const t = useTranslations();
  const { isConnected, address, onConnectModalOpenChange } = useWallet();
  const [filter, setFilter] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["proposals", filter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.set("state", filter);
      }
      const res = await fetch(`/api/governance/proposals?${params}`);
      if (!res.ok) throw new Error("Failed to fetch proposals");
      return res.json();
    },
  });

  const filters = [
    { key: "all", label: t("governance.filters.all") },
    { key: "active", label: t("governance.filters.active") },
    { key: "pending", label: t("governance.filters.pending") },
    { key: "closed", label: t("governance.filters.closed") },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[color:var(--sf-text)]">{t("governance.title")}</h1>
            <p className="text-[color:var(--sf-muted)]">
              {t("governance.subtitle")}
            </p>
          </div>
          {isConnected && (
            <Link
              href="/governance/create"
              className="btn-primary"
            >
              {t("governance.createProposal")}
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === key
                  ? "bg-[color:var(--sf-primary)] text-black"
                  : "bg-[color:var(--sf-surface)] text-[color:var(--sf-muted)] border border-[color:var(--sf-outline)] hover:border-[color:var(--sf-primary)] hover:text-[color:var(--sf-primary)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Proposals List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card p-6 animate-pulse"
              >
                <div className="h-6 bg-[color:var(--sf-surface)] rounded w-3/4 mb-4" />
                <div className="h-4 bg-[color:var(--sf-surface)] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="glass-card p-6 text-center">
            <p className="text-red-500">{t("governance.error")}</p>
          </div>
        ) : data?.proposals?.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <p className="text-[color:var(--sf-muted)]">
              {t("governance.noProposals")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.proposals?.map((proposal: Proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                byLabel={t("governance.proposal.by")}
                votesLabel={t("governance.proposal.votes")}
                voteLabel={t("governance.proposal.vote")}
                startsLabel={t("governance.proposal.starts")}
                stateLabels={{
                  ACTIVE: t("governance.states.ACTIVE"),
                  PENDING: t("governance.states.PENDING"),
                  CLOSED: t("governance.states.CLOSED"),
                  EXECUTED: t("governance.states.EXECUTED"),
                  CANCELLED: t("governance.states.CANCELLED"),
                }}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ProposalCard({
  proposal,
  byLabel,
  votesLabel,
  voteLabel,
  startsLabel,
  stateLabels,
}: {
  proposal: Proposal;
  byLabel: string;
  votesLabel: string;
  voteLabel: string;
  startsLabel: string;
  stateLabels: Record<string, string>;
}) {
  const totalVotes = BigInt(proposal.totalVotes || "0");
  const scoresArray = Array.isArray(proposal.scores) ? proposal.scores : [];
  const scores = scoresArray.map((s) => BigInt(s || "0"));
  const maxScore = scores.reduce((a, b) => (a > b ? a : b), BigInt(0));

  const stateClass = {
    ACTIVE: "badge-active",
    PENDING: "badge-pending",
    CLOSED: "badge-closed",
    EXECUTED: "badge-executed",
    CANCELLED: "badge-closed",
  }[proposal.state];

  return (
    <Link href={`/governance/${proposal.id}`}>
      <div className="glass-card p-6 hover:shadow-lg transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge ${stateClass}`}>
                {stateLabels[proposal.state]}
              </span>
              <span className="text-sm text-[color:var(--sf-muted)]">
                {byLabel} {formatAddress(proposal.author)}
              </span>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-[color:var(--sf-text)] group-hover:text-[color:var(--sf-primary)] transition-colors">
              {proposal.title}
            </h2>
            <p className="text-[color:var(--sf-muted)] line-clamp-2">
              {proposal.body}
            </p>
          </div>
        </div>

        {/* Results Preview */}
        {totalVotes > BigInt(0) && (
          <div className="space-y-2 mb-4">
            {proposal.choices.map((choice, index) => {
              const score = scores[index] || BigInt(0);
              const percentage =
                totalVotes > BigInt(0)
                  ? Number((score * BigInt(100)) / totalVotes)
                  : 0;
              const isWinning = score === maxScore && maxScore > BigInt(0);

              return (
                <div key={index} className="relative">
                  <div
                    className={`absolute inset-0 rounded ${
                      isWinning
                        ? "bg-green-500/20"
                        : "bg-[color:var(--sf-surface)]"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative flex justify-between px-3 py-1.5 text-sm">
                    <span className="text-[color:var(--sf-text)]">{choice}</span>
                    <span className="font-medium text-[color:var(--sf-text)]">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-[color:var(--sf-muted)]">
          <span>
            {proposal._count.votes} {proposal._count.votes !== 1 ? votesLabel : voteLabel}{" "}
            · {formatDiesel(totalVotes)} DIESEL
          </span>
          <span>
            {proposal.state === "ACTIVE"
              ? formatTimeRemaining(proposal.end)
              : proposal.state === "PENDING"
              ? `${startsLabel} ${formatRelativeTime(proposal.start)}`
              : formatRelativeTime(proposal.end)}
          </span>
        </div>
      </div>
    </Link>
  );
}
