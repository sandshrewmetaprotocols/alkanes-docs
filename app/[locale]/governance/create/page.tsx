"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useWallet } from "@/context/WalletContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Plus, X, Loader2 } from "lucide-react";

export default function CreateProposalPage() {
  const t = useTranslations();
  const router = useRouter();
  const { isConnected, address, signMessage, onConnectModalOpenChange } = useWallet();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [choices, setChoices] = useState(["For", "Against"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addChoice = () => {
    if (choices.length < 10) {
      setChoices([...choices, ""]);
    }
  };

  const removeChoice = (index: number) => {
    if (choices.length > 2) {
      setChoices(choices.filter((_, i) => i !== index));
    }
  };

  const updateChoice = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isConnected || !address) {
      onConnectModalOpenChange(true);
      return;
    }

    // Validate
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!body.trim()) {
      setError("Description is required");
      return;
    }
    const validChoices = choices.filter((c) => c.trim());
    if (validChoices.length < 2) {
      setError("At least 2 choices are required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create message for signing
      const message = JSON.stringify({
        action: "create_proposal",
        title: title.trim(),
        timestamp: Date.now(),
      });

      // Sign the message
      const signature = await signMessage(message);

      // Submit proposal
      const res = await fetch("/api/governance/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          choices: validChoices,
          author: address,
          authorSig: signature,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create proposal");
      }

      // Redirect to the new proposal
      router.push(`/governance/${data.proposal.id}`);
    } catch (err) {
      console.error("Error creating proposal:", err);
      setError(err instanceof Error ? err.message : "Failed to create proposal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        {/* Back Link */}
        <Link
          href="/governance"
          className="inline-flex items-center gap-2 text-[color:var(--sf-muted)] hover:text-[color:var(--sf-primary)] mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          {t("governance.backToProposals")}
        </Link>

        {/* Page Header */}
        <h1 className="text-3xl font-bold mb-2 text-[color:var(--sf-text)]">
          {t("governance.createProposal")}
        </h1>
        <p className="text-[color:var(--sf-muted)] mb-8">
          Create a new governance proposal for the community to vote on.
        </p>

        {/* Connect Wallet Prompt */}
        {!isConnected && (
          <div className="glass-card p-6 text-center mb-6">
            <p className="text-[color:var(--sf-muted)] mb-4">
              Connect your wallet to create a proposal
            </p>
            <button
              onClick={() => onConnectModalOpenChange(true)}
              className="btn-primary"
            >
              Connect Wallet
            </button>
          </div>
        )}

        {/* Create Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--sf-text)] mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter proposal title"
              className="w-full px-4 py-3 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] text-[color:var(--sf-text)] placeholder:text-[color:var(--sf-muted)] focus:outline-none focus:border-[color:var(--sf-primary)]"
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--sf-text)] mb-2">
              Description
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe your proposal in detail. Markdown is supported."
              rows={8}
              className="w-full px-4 py-3 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] text-[color:var(--sf-text)] placeholder:text-[color:var(--sf-muted)] focus:outline-none focus:border-[color:var(--sf-primary)] resize-y"
              disabled={isSubmitting}
            />
          </div>

          {/* Choices */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--sf-text)] mb-2">
              Voting Choices
            </label>
            <div className="space-y-2">
              {choices.map((choice, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => updateChoice(index, e.target.value)}
                    placeholder={`Choice ${index + 1}`}
                    className="flex-1 px-4 py-2 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] text-[color:var(--sf-text)] placeholder:text-[color:var(--sf-muted)] focus:outline-none focus:border-[color:var(--sf-primary)]"
                    disabled={isSubmitting}
                  />
                  {choices.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeChoice(index)}
                      className="p-2 text-[color:var(--sf-muted)] hover:text-red-500 transition-colors"
                      disabled={isSubmitting}
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {choices.length < 10 && (
              <button
                type="button"
                onClick={addChoice}
                className="mt-2 inline-flex items-center gap-1 text-sm text-[color:var(--sf-primary)] hover:underline"
                disabled={isSubmitting}
              >
                <Plus size={16} />
                Add Choice
              </button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/governance"
              className="px-6 py-3 rounded-lg border border-[color:var(--sf-outline)] text-[color:var(--sf-text)] hover:border-[color:var(--sf-primary)] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!isConnected || isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Proposal"
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
