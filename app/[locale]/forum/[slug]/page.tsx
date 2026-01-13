"use client";

import { useState, useEffect, use } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useWallet } from "@/context/WalletContext";
import { formatAddress, cn } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Post {
  id: string;
  raw: string;
  cooked: string;
  author: string;
  postNumber: number;
  postType: "REGULAR" | "MODERATOR" | "SYSTEM" | "WHISPER";
  isEdited: boolean;
  editedAt?: string;
  likesCount: number;
  repliesCount: number;
  reactionCounts: Record<string, number>;
  userReactions: string[];
  replyTo?: {
    id: string;
    postNumber: number;
    author: string;
  };
  createdAt: string;
}

interface Discussion {
  id: string;
  title: string;
  slug: string;
  author: string;
  type: "GENERAL" | "PROPOSAL" | "ANNOUNCEMENT" | "QUESTION";
  isPinned: boolean;
  isLocked: boolean;
  postsCount: number;
  viewsCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  tags: Array<{ id: string; name: string; slug: string; color: string }>;
  proposal?: {
    id: string;
    title: string;
    state: string;
    choices: string[];
    scores: number[];
    totalVotes: bigint;
  };
  createdAt: string;
}

const REACTION_EMOJIS: Record<string, string> = {
  LIKE: "👍",
  HEART: "❤️",
  CELEBRATE: "🎉",
  THINKING: "🤔",
  DISAGREE: "👎",
};

export default function DiscussionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations();
  const { address, isConnected, signMessage } = useWallet();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<Post | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDiscussion();
  }, [slug, address]);

  async function fetchDiscussion() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (address) params.set("viewer", address);

      const res = await fetch(`/api/forum/discussions/${slug}?${params}`);
      const data = await res.json();

      if (data.discussion) {
        setDiscussion(data.discussion);
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch discussion:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitReply() {
    if (!replyContent.trim() || !isConnected || !address || !discussion) return;

    setSubmitting(true);
    try {
      // TODO: Sign the post content with BIP-322
      // const signature = await signMessage(replyContent);

      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discussionId: discussion.id,
          content: replyContent,
          author: address,
          replyToId: replyingTo?.id,
        }),
      });

      if (res.ok) {
        setReplyContent("");
        setReplyingTo(null);
        fetchDiscussion(); // Refresh posts
      } else {
        const data = await res.json();
        alert(data.error || t("forum.discussion.alerts.replyFailed"));
      }
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReaction(postId: string, type: string) {
    if (!isConnected || !address) return;

    try {
      const res = await fetch("/api/forum/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, user: address, type }),
      });

      if (res.ok) {
        // Update local state
        setPosts((prev) =>
          prev.map((post) => {
            if (post.id !== postId) return post;

            const wasReacted = post.userReactions.includes(type);
            const newUserReactions = wasReacted
              ? post.userReactions.filter((r) => r !== type)
              : [...post.userReactions, type];
            const newCounts = { ...post.reactionCounts };
            newCounts[type] = (newCounts[type] || 0) + (wasReacted ? -1 : 1);

            return {
              ...post,
              userReactions: newUserReactions,
              reactionCounts: newCounts,
            };
          })
        );
      }
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    }
  }

  function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("time.justNow");
    if (diffMins < 60) return t("time.minutesAgo", { count: diffMins });
    if (diffHours < 24) return t("time.hoursAgo", { count: diffHours });
    if (diffDays < 7) return t("time.daysAgo", { count: diffDays });
    return date.toLocaleDateString();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[color:var(--sf-primary)]" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[color:var(--sf-text)] mb-2">{t("forum.discussion.notFound.title")}</h1>
            <p className="text-[color:var(--sf-muted)] mb-4">{t("forum.discussion.notFound.description")}</p>
            <Link href="/forum" className="text-[color:var(--sf-primary)] hover:underline">
              {t("forum.discussion.backToForum")}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back link and category */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/forum"
            className="text-[color:var(--sf-muted)] hover:text-[color:var(--sf-text)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span
            className="px-2 py-0.5 rounded text-xs"
            style={{
              backgroundColor: `${discussion.category.color}20`,
              color: discussion.category.color,
            }}
          >
            {discussion.category.name}
          </span>
        </div>

        {/* Discussion header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            {discussion.isPinned && (
              <span className="text-amber-400 text-sm">{t("forum.discussion.pinned")}</span>
            )}
            {discussion.isLocked && (
              <span className="text-[color:var(--sf-muted)] text-sm">🔒 {t("forum.discussion.locked")}</span>
            )}
            {discussion.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 rounded text-xs"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-[color:var(--sf-text)] mb-2">{discussion.title}</h1>
          <div className="flex items-center gap-4 text-sm text-[color:var(--sf-muted)]">
            <span>{t("forum.discussion.by")} {formatAddress(discussion.author)}</span>
            <span>&middot;</span>
            <span>{formatRelativeTime(discussion.createdAt)}</span>
            <span>&middot;</span>
            <span>{t("forum.discussion.posts", { count: discussion.postsCount })}</span>
            <span>&middot;</span>
            <span>{t("forum.discussion.views", { count: discussion.viewsCount })}</span>
          </div>
        </div>

        {/* Linked proposal card */}
        {discussion.proposal && (
          <div className="glass-card p-4 mb-6 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-400 mb-1">{t("forum.discussion.linkedProposal")}</div>
                <h3 className="text-[color:var(--sf-text)] font-medium">{discussion.proposal.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs",
                    discussion.proposal.state === "ACTIVE" ? "bg-emerald-500/20 text-emerald-400" :
                    discussion.proposal.state === "CLOSED" ? "bg-gray-500/20 text-[color:var(--sf-muted)]" :
                    "bg-amber-500/20 text-amber-400"
                  )}>
                    {discussion.proposal.state}
                  </span>
                </div>
              </div>
              <Link
                href={`/governance?proposal=${discussion.proposal.id}`}
                className="btn-secondary text-sm px-4 py-2 rounded-lg"
              >
                {t("forum.discussion.viewProposal")}
              </Link>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <article
              key={post.id}
              id={`post-${post.postNumber}`}
              className={cn(
                "glass-card p-6",
                post.postType === "SYSTEM" && "border border-blue-500/30",
                post.postType === "MODERATOR" && "border border-amber-500/30"
              )}
            >
              {/* Post header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[color:var(--sf-primary)] to-orange-600 flex items-center justify-center text-black font-bold">
                    {post.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[color:var(--sf-text)] font-medium">
                        {formatAddress(post.author)}
                      </span>
                      {post.author === discussion.author && (
                        <span className="text-xs bg-[color:var(--sf-primary)]/20 text-[color:var(--sf-primary)] px-1.5 py-0.5 rounded">
                          OP
                        </span>
                      )}
                      {post.postType === "MODERATOR" && (
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
                          MOD
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[color:var(--sf-muted)]">
                      {formatRelativeTime(post.createdAt)}
                      {post.isEdited && (
                        <span className="ml-2">({t("forum.discussion.edited")})</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-[color:var(--sf-muted)]">#{post.postNumber}</span>
              </div>

              {/* Reply context */}
              {post.replyTo && (
                <div className="mb-3 p-2 bg-[color:var(--sf-surface)] rounded-lg border-l-2 border-[color:var(--sf-outline)]">
                  <a
                    href={`#post-${post.replyTo.postNumber}`}
                    className="text-xs text-[color:var(--sf-muted)] hover:text-[color:var(--sf-text)]"
                  >
                    {t("forum.discussion.replyingTo", { postNumber: post.replyTo.postNumber, author: formatAddress(post.replyTo.author) })}
                  </a>
                </div>
              )}

              {/* Post content */}
              <div
                className="prose prose-invert max-w-none mb-4 text-[color:var(--sf-text)]"
                dangerouslySetInnerHTML={{ __html: post.cooked }}
              />

              {/* Reactions and actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[color:var(--sf-outline)]">
                <div className="flex items-center gap-2">
                  {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => {
                    const count = post.reactionCounts[type] || 0;
                    const isActive = post.userReactions.includes(type);
                    return (
                      <button
                        key={type}
                        onClick={() => handleReaction(post.id, type)}
                        disabled={!isConnected}
                        className={cn(
                          "flex items-center gap-1 px-2 py-1 rounded-lg text-sm transition-colors",
                          isActive
                            ? "bg-[color:var(--sf-primary)]/20 text-[color:var(--sf-primary)]"
                            : "bg-[color:var(--sf-surface)] text-[color:var(--sf-muted)] hover:bg-[color:var(--sf-outline)]",
                          !isConnected && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <span>{emoji}</span>
                        {count > 0 && <span>{count}</span>}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  {!discussion.isLocked && isConnected && (
                    <button
                      onClick={() => setReplyingTo(post)}
                      className="text-sm text-[color:var(--sf-muted)] hover:text-[color:var(--sf-text)] transition-colors"
                    >
                      {t("forum.discussion.reply")}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Reply form */}
        {!discussion.isLocked && (
          <div className="mt-8 glass-card p-6">
            <h3 className="text-lg font-semibold text-[color:var(--sf-text)] mb-4">
              {replyingTo
                ? t("forum.discussion.replyingToPost", { postNumber: replyingTo.postNumber })
                : t("forum.discussion.addReply")}
            </h3>
            {replyingTo && (
              <div className="mb-4 flex items-center justify-between p-2 bg-[color:var(--sf-surface)] rounded-lg">
                <span className="text-sm text-[color:var(--sf-muted)]">
                  {t("forum.discussion.replyingToUser", { author: formatAddress(replyingTo.author) })}
                </span>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-[color:var(--sf-muted)] hover:text-[color:var(--sf-text)]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {isConnected ? (
              <>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={t("forum.discussion.replyPlaceholder")}
                  className="w-full h-32 px-4 py-3 bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] rounded-lg text-[color:var(--sf-text)] placeholder:text-[color:var(--sf-muted)] resize-none focus:outline-none focus:border-[color:var(--sf-primary)]"
                />
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-[color:var(--sf-muted)]">
                    {t("forum.discussion.mentionHint")}
                  </p>
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim() || submitting}
                    className="btn-primary px-6 py-2 rounded-lg disabled:opacity-50"
                  >
                    {submitting ? t("forum.discussion.posting") : t("forum.discussion.postReply")}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-[color:var(--sf-muted)] text-center py-4">
                {t("forum.discussion.connectToReply")}
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
