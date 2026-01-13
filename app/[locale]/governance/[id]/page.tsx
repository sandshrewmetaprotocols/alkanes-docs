"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@/context/WalletContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  formatAddress,
  formatDiesel,
  formatTimeRemaining,
  formatRelativeTime,
} from "@/lib/utils";
import { alkanesClient } from "@/lib/alkanes-client";
import { ArrowLeft, ExternalLink, Check, AlertCircle } from "lucide-react";

interface Vote {
  id: string;
  voter: string;
  choice: number;
  votingPower: string;
  createdAt: string;
}

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
  votes?: Vote[];
  _count: {
    votes: number;
  };
  discussion?: {
    id: string;
    slug: string;
    postsCount: number;
    viewsCount: number;
  };
}

export default function ProposalDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const proposalId = params.id as string;
  const queryClient = useQueryClient();
  const { isConnected, address, paymentAddress, signMessage, onConnectModalOpenChange } = useWallet();
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [dieselBalance, setDieselBalance] = useState<bigint>(BigInt(0));

  // Fetch DIESEL balance when connected - check both taproot and native segwit addresses
  useEffect(() => {
    async function fetchBalance() {
      if (!isConnected || !address) {
        setDieselBalance(BigInt(0));
        return;
      }
      try {
        let totalDiesel = BigInt(0);

        // Fetch from primary address
        const balances = await alkanesClient.getWalletBalances(address);
        const diesel = balances.tokens.find(t => t.runeId === '2:0');
        if (diesel) {
          totalDiesel += diesel.balance;
        }

        // Also fetch from payment address if different (for keystore wallets)
        if (paymentAddress && paymentAddress !== address) {
          const paymentBalances = await alkanesClient.getWalletBalances(paymentAddress);
          const paymentDiesel = paymentBalances.tokens.find(t => t.runeId === '2:0');
          if (paymentDiesel) {
            totalDiesel += paymentDiesel.balance;
          }
        }

        setDieselBalance(totalDiesel);
      } catch (err) {
        console.error('Failed to fetch DIESEL balance:', err);
        setDieselBalance(BigInt(0));
      }
    }
    fetchBalance();
  }, [isConnected, address, paymentAddress]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["proposal", proposalId],
    queryFn: async () => {
      const res = await fetch(`/api/governance/proposals/${proposalId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Proposal not found");
        }
        throw new Error("Failed to fetch proposal");
      }
      return res.json();
    },
    enabled: !!proposalId,
  });

  const proposal: Proposal | undefined = data?.proposal;

  const voteMutation = useMutation({
    mutationFn: async ({ choice }: { choice: number }) => {
      if (!address) throw new Error("Not connected");
      if (dieselBalance <= BigInt(0)) throw new Error("No DIESEL balance to vote with");

      // Create vote message
      const message = JSON.stringify({
        proposalId,
        choice,
        timestamp: Date.now(),
      });

      // Sign the message
      const signature = await signMessage(message);

      // Submit vote with voting power
      const res = await fetch("/api/governance/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId,
          choice,
          voter: address,
          voterSig: signature,
          votingPower: dieselBalance.toString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit vote");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", proposalId] });
      setSelectedChoice(null);
      setVoteError(null);
    },
    onError: (error: Error) => {
      setVoteError(error.message);
    },
  });

  const handleVote = async () => {
    if (selectedChoice === null) return;
    setIsVoting(true);
    setVoteError(null);

    try {
      await voteMutation.mutateAsync({ choice: selectedChoice });
    } finally {
      setIsVoting(false);
    }
  };

  // Calculate totals
  const scoresArray = Array.isArray(proposal?.scores) ? proposal.scores : [];
  const scores = scoresArray.map((s) => BigInt(s || "0"));
  const totalVotes = scores.reduce((a, b) => a + b, BigInt(0));
  const maxScore = scores.reduce((a, b) => (a > b ? a : b), BigInt(0));

  // Check if user has voted
  const userVote = proposal?.votes?.find((v) => v.voter === address);

  const stateClass = {
    ACTIVE: "badge-active",
    PENDING: "badge-pending",
    CLOSED: "badge-closed",
    EXECUTED: "badge-executed",
    CANCELLED: "badge-closed",
  }[proposal?.state || "PENDING"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[color:var(--sf-surface)] rounded w-1/4" />
            <div className="h-12 bg-[color:var(--sf-surface)] rounded w-3/4" />
            <div className="h-64 bg-[color:var(--sf-surface)] rounded" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
          <Link
            href="/governance"
            className="inline-flex items-center gap-2 text-[color:var(--sf-muted)] hover:text-[color:var(--sf-text)] mb-6"
          >
            <ArrowLeft size={20} />
            {t("governance.backToProposals")}
          </Link>
          <div className="glass-card p-8 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2 text-[color:var(--sf-text)]">
              {t("governance.proposalNotFound")}
            </h2>
            <p className="text-[color:var(--sf-muted)]">
              {error?.message || t("governance.proposalNotFoundDesc")}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Back Link */}
        <Link
          href="/governance"
          className="inline-flex items-center gap-2 text-[color:var(--sf-muted)] hover:text-[color:var(--sf-text)] mb-6"
        >
          <ArrowLeft size={20} />
          {t("governance.backToProposals")}
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className={`badge ${stateClass}`}>
              {t(`governance.states.${proposal.state}`)}
            </span>
            <span className="text-sm text-[color:var(--sf-muted)]">
              {t("governance.proposal.by")} {formatAddress(proposal.author)}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[color:var(--sf-text)] mb-4">
            {proposal.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-[color:var(--sf-muted)]">
            <span>
              {proposal.state === "ACTIVE"
                ? formatTimeRemaining(proposal.end)
                : proposal.state === "PENDING"
                ? `${t("governance.proposal.starts")} ${formatRelativeTime(proposal.start)}`
                : formatRelativeTime(proposal.end)}
            </span>
            <span>
              {proposal._count.votes} {proposal._count.votes !== 1 ? t("governance.proposal.votes") : t("governance.proposal.vote")}
            </span>
            <span>{formatDiesel(totalVotes)} DIESEL</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 text-[color:var(--sf-text)]">
                {t("governance.proposal.description")}
              </h2>
              <div className="prose prose-invert max-w-none text-[color:var(--sf-text)]">
                {proposal.body.split("\n").map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            </div>

            {/* Votes */}
            {proposal.votes && proposal.votes.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4 text-[color:var(--sf-text)]">
                  {t("governance.proposal.recentVotes")}
                </h2>
                <div className="space-y-3">
                  {proposal.votes.slice(0, 10).map((vote) => (
                    <div
                      key={vote.id}
                      className="flex items-center justify-between py-2 border-b border-[color:var(--sf-outline)] last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[color:var(--sf-text)]">
                          {formatAddress(vote.voter)}
                        </span>
                        <span className="text-sm text-[color:var(--sf-muted)]">
                          voted {proposal.choices[vote.choice]}
                        </span>
                      </div>
                      <span className="text-[color:var(--sf-primary)]">
                        {formatDiesel(BigInt(vote.votingPower))} DIESEL
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voting Results */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 text-[color:var(--sf-text)]">
                {t("governance.proposal.results")}
              </h2>
              <div className="space-y-4">
                {proposal.choices.map((choice, index) => {
                  const score = scores[index] || BigInt(0);
                  const percentage =
                    totalVotes > BigInt(0)
                      ? Number((score * BigInt(10000)) / totalVotes) / 100
                      : 0;
                  const isWinning = score === maxScore && maxScore > BigInt(0);
                  const isSelected = selectedChoice === index;
                  const isUserChoice = userVote?.choice === index;

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (proposal.state === "ACTIVE" && !userVote) {
                          setSelectedChoice(index);
                        }
                      }}
                      disabled={proposal.state !== "ACTIVE" || !!userVote}
                      className={`w-full text-left relative rounded-lg overflow-hidden transition-all ${
                        isSelected
                          ? "ring-2 ring-[color:var(--sf-primary)]"
                          : ""
                      } ${
                        proposal.state === "ACTIVE" && !userVote
                          ? "cursor-pointer hover:opacity-80"
                          : "cursor-default"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 ${
                          isWinning
                            ? "bg-green-500/20"
                            : "bg-[color:var(--sf-surface)]"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex justify-between items-center px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[color:var(--sf-text)]">{choice}</span>
                          {isUserChoice && (
                            <Check size={16} className="text-green-500" />
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-[color:var(--sf-text)]">
                            {percentage.toFixed(1)}%
                          </div>
                          <div className="text-xs text-[color:var(--sf-muted)]">
                            {formatDiesel(score)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Vote Button */}
              {proposal.state === "ACTIVE" && (
                <div className="mt-6">
                  {!isConnected ? (
                    <button
                      onClick={() => onConnectModalOpenChange(true)}
                      className="w-full btn-primary"
                    >
                      {t("governance.connectToVote")}
                    </button>
                  ) : userVote ? (
                    <div className="text-center text-[color:var(--sf-muted)] py-2">
                      <Check size={20} className="inline mr-2 text-green-500" />
                      {t("governance.youVoted")} {proposal.choices[userVote.choice]}
                    </div>
                  ) : dieselBalance <= BigInt(0) ? (
                    <div className="text-center text-[color:var(--sf-muted)] py-2">
                      No DIESEL balance to vote with
                    </div>
                  ) : (
                    <>
                      <div className="text-center text-sm text-[color:var(--sf-muted)] mb-2">
                        Your voting power: {formatDiesel(dieselBalance)} DIESEL
                      </div>
                      <button
                        onClick={handleVote}
                        disabled={selectedChoice === null || isVoting}
                        className="w-full btn-primary disabled:opacity-50"
                      >
                        {isVoting ? t("governance.voting") : t("governance.castVote")}
                      </button>
                    </>
                  )}

                  {voteError && (
                    <div className="mt-2 text-sm text-red-500 text-center">
                      {voteError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Discussion Link */}
            {proposal.discussion && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4 text-[color:var(--sf-text)]">
                  {t("governance.proposal.discussion")}
                </h2>
                <Link
                  href={`/forum/${proposal.discussion.slug}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-[color:var(--sf-surface)] hover:bg-[color:var(--sf-surface)]/80 transition-colors"
                >
                  <div>
                    <div className="text-[color:var(--sf-text)]">
                      {proposal.discussion.postsCount} {t("governance.posts")}
                    </div>
                    <div className="text-sm text-[color:var(--sf-muted)]">
                      {proposal.discussion.viewsCount} {t("governance.views")}
                    </div>
                  </div>
                  <ExternalLink size={20} className="text-[color:var(--sf-muted)]" />
                </Link>
              </div>
            )}

            {/* Info */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 text-[color:var(--sf-text)]">
                {t("governance.proposal.info")}
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[color:var(--sf-muted)]">{t("governance.proposal.snapshot")}</dt>
                  <dd className="text-[color:var(--sf-text)]">#{proposal.snapshot}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[color:var(--sf-muted)]">{t("governance.proposal.startDate")}</dt>
                  <dd className="text-[color:var(--sf-text)]">
                    {new Date(proposal.start).toLocaleDateString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[color:var(--sf-muted)]">{t("governance.proposal.endDate")}</dt>
                  <dd className="text-[color:var(--sf-text)]">
                    {new Date(proposal.end).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
