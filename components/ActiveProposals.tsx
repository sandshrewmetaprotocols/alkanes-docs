"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  formatAddress,
  formatTimeRemaining,
  formatRelativeTime,
} from "@/lib/utils";

interface Proposal {
  id: string;
  title: string;
  author: string;
  start: string;
  end: string;
  state: "PENDING" | "ACTIVE" | "CLOSED" | "EXECUTED" | "CANCELLED";
  scores: string[];
  totalVotes: string;
  _count: {
    votes: number;
  };
}

export function ActiveProposals() {
  const t = useTranslations("dashboard.proposals");
  const tGov = useTranslations("governance");
  const tCommon = useTranslations("common");

  // Fetch active and pending proposals from API
  const { data, isLoading, error } = useQuery({
    queryKey: ["activeProposals"],
    queryFn: async () => {
      // Fetch both active and pending proposals
      const [activeRes, pendingRes] = await Promise.all([
        fetch("/api/governance/proposals?state=active&limit=3"),
        fetch("/api/governance/proposals?state=pending&limit=3"),
      ]);

      if (!activeRes.ok || !pendingRes.ok) {
        throw new Error("Failed to fetch proposals");
      }

      const [activeData, pendingData] = await Promise.all([
        activeRes.json(),
        pendingRes.json(),
      ]);

      // Combine and sort: active first, then pending, limit to 3 total
      const combined = [
        ...activeData.proposals,
        ...pendingData.proposals,
      ].slice(0, 3);

      return combined as Proposal[];
    },
    staleTime: 30000, // Cache for 30 seconds
  });

  const proposals = data || [];

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center animate-pulse-glow">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-lg text-[color:var(--sf-text)]">{t("title")}</h3>
        </div>
        <Link
          href="/governance"
          className="btn-primary text-sm !py-2 !px-4"
        >
          {tCommon("viewAll")} →
        </Link>
      </div>

      {/* Proposals List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          // Loading skeleton
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[color:var(--sf-surface)]/50 border border-[color:var(--sf-outline)] animate-pulse"
              >
                <div className="h-5 bg-[color:var(--sf-surface)] rounded w-3/4 mb-3" />
                <div className="h-2 bg-[color:var(--sf-surface)] rounded w-full mb-3" />
                <div className="h-4 bg-[color:var(--sf-surface)] rounded w-1/2" />
              </div>
            ))}
          </>
        ) : error ? (
          <div className="p-4 text-center text-[color:var(--sf-muted)]">
            {tGov("error")}
          </div>
        ) : proposals.length === 0 ? (
          <div className="p-4 text-center text-[color:var(--sf-muted)]">
            {tGov("noProposals")}
          </div>
        ) : (
          proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              forLabel={tGov("proposal.for")}
              againstLabel={tGov("proposal.against")}
              byLabel={t("by", { author: formatAddress(proposal.author) })}
              endsLabel={t("ends", { time: formatTimeRemaining(proposal.end) })}
              startsLabel={t("starts", { time: formatRelativeTime(proposal.start) })}
              stateLabel={tGov(`states.${proposal.state}`)}
            />
          ))
        )}
      </div>

      {/* CTA Banner */}
      <div className="p-4 bg-gradient-to-r from-[var(--sf-boost-bg-from)] to-[var(--sf-boost-bg-to)] border-t border-[color:var(--sf-primary)]/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[color:var(--sf-text)]">{t("cta.title")}</p>
            <p className="text-sm text-[color:var(--sf-muted)]">{t("cta.description")}</p>
          </div>
          <Link href="/governance" className="btn-secondary !py-2 !px-4 text-sm">
            {t("cta.button")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProposalCard({
  proposal,
  forLabel,
  againstLabel,
  byLabel,
  endsLabel,
  startsLabel,
  stateLabel
}: {
  proposal: Proposal;
  forLabel: string;
  againstLabel: string;
  byLabel: string;
  endsLabel: string;
  startsLabel: string;
  stateLabel: string;
}) {
  // Calculate vote percentages from scores (assumes first choice is "For", second is "Against")
  // Defensive check - scores might be undefined/null from API
  const scoresArray = Array.isArray(proposal.scores) ? proposal.scores : [];
  const scores = scoresArray.map((s) => BigInt(s || "0"));
  const totalVotes = BigInt(proposal.totalVotes || "0");

  let forPercentage = 50;
  let againstPercentage = 50;

  if (totalVotes > BigInt(0) && scores.length >= 2) {
    forPercentage = Number((scores[0] * BigInt(100)) / totalVotes);
    againstPercentage = Number((scores[1] * BigInt(100)) / totalVotes);
  }

  const stateClass = {
    ACTIVE: "badge-active",
    PENDING: "badge-pending",
    CLOSED: "badge-closed",
    EXECUTED: "badge-executed",
    CANCELLED: "badge-closed",
  }[proposal.state];

  return (
    <Link
      href={`/governance/${proposal.id}`}
      className="block p-4 rounded-xl bg-[color:var(--sf-surface)]/50 border border-[color:var(--sf-outline)] hover:border-[color:var(--sf-primary)]/40 transition-all hover:shadow-lg group"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-[color:var(--sf-text)] group-hover:text-[color:var(--sf-primary)] transition-colors line-clamp-2 flex-1 mr-3">
          {proposal.title}
        </h4>
        <span className={`badge ${stateClass} flex-shrink-0`}>
          {stateLabel}
        </span>
      </div>

      {/* Vote Progress Bar */}
      {proposal.state === "ACTIVE" && totalVotes > BigInt(0) && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-green-500">{forLabel}: {forPercentage}%</span>
            <span className="text-red-500">{againstLabel}: {againstPercentage}%</span>
          </div>
          <div className="h-2 rounded-full bg-[color:var(--sf-outline)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
              style={{ width: `${forPercentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-[color:var(--sf-muted)]">
        <span>{byLabel}</span>
        <span>{proposal.state === "PENDING" ? startsLabel : endsLabel}</span>
      </div>
    </Link>
  );
}
