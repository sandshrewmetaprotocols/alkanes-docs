"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useWallet } from "@/context/WalletContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
  isReadOnly: boolean;
}

export default function NewDiscussionPage() {
  const t = useTranslations();
  const router = useRouter();
  const { address, isConnected, signMessage } = useWallet();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState<"GENERAL" | "QUESTION">("GENERAL");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/forum/categories");
      const data = await res.json();
      // Filter out read-only categories
      const writeable = (data.categories || []).filter(
        (c: Category) => !c.isReadOnly
      );
      setCategories(writeable);
      if (writeable.length > 0) {
        setCategoryId(writeable[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isConnected || !address) {
      alert(t("forum.new.alerts.connectWallet"));
      return;
    }

    if (!title.trim() || !content.trim() || !categoryId) {
      alert(t("forum.new.alerts.fillFields"));
      return;
    }

    setLoading(true);
    try {
      // TODO: Sign the content with BIP-322
      // const signature = await signMessage(JSON.stringify({ title, content }));

      const res = await fetch("/api/forum/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          categoryId,
          author: address,
          type,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/forum/${data.discussion.slug}`);
      } else {
        const data = await res.json();
        alert(data.error || t("forum.new.alerts.failed"));
      }
    } catch (error) {
      console.error("Failed to create discussion:", error);
      alert(t("forum.new.alerts.failed"));
    } finally {
      setLoading(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[color:var(--sf-text)] mb-2">
              {t("forum.new.walletRequired.title")}
            </h1>
            <p className="text-[color:var(--sf-muted)] mb-4">
              {t("forum.new.walletRequired.description")}
            </p>
            <Link href="/forum" className="text-[color:var(--sf-primary)] hover:underline">
              {t("forum.new.backToForum")}
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

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back link and title */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/forum"
            className="text-[color:var(--sf-muted)] hover:text-[color:var(--sf-text)] transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-[color:var(--sf-text)]">
            {t("forum.new.title")}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-[color:var(--sf-text)] mb-2"
            >
              {t("forum.new.form.title")} <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("forum.new.form.titlePlaceholder")}
              className="w-full px-4 py-3 bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] rounded-lg text-[color:var(--sf-text)] placeholder:text-[color:var(--sf-muted)] focus:outline-none focus:border-[color:var(--sf-primary)]"
              required
            />
          </div>

          {/* Category and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-[color:var(--sf-text)] mb-2"
              >
                {t("forum.new.form.category")} <span className="text-red-400">*</span>
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] rounded-lg text-[color:var(--sf-text)] focus:outline-none focus:border-[color:var(--sf-primary)]"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-[color:var(--sf-text)] mb-2"
              >
                {t("forum.new.form.type")}
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-3 bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] rounded-lg text-[color:var(--sf-text)] focus:outline-none focus:border-[color:var(--sf-primary)]"
              >
                <option value="GENERAL">{t("forum.types.discussion")}</option>
                <option value="QUESTION">{t("forum.types.question")}</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-[color:var(--sf-text)] mb-2"
            >
              {t("forum.new.form.content")} <span className="text-red-400">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("forum.new.form.contentPlaceholder")}
              className="w-full h-64 px-4 py-3 bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] rounded-lg text-[color:var(--sf-text)] placeholder:text-[color:var(--sf-muted)] resize-none focus:outline-none focus:border-[color:var(--sf-primary)]"
              required
            />
            <p className="mt-2 text-xs text-[color:var(--sf-muted)]">
              {t("forum.new.form.markdownHint")}
            </p>
          </div>

          {/* Preview */}
          {content && (
            <div className="glass-card p-4">
              <h3 className="text-sm font-medium text-[color:var(--sf-muted)] mb-2">
                {t("forum.new.form.preview")}
              </h3>
              <div className="prose prose-invert max-w-none">
                {/* Simple markdown preview - in production would use marked */}
                <div className="whitespace-pre-wrap text-[color:var(--sf-text)]">
                  {content}
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-[color:var(--sf-outline)]">
            <Link
              href="/forum"
              className="text-[color:var(--sf-muted)] hover:text-[color:var(--sf-text)] transition-colors"
            >
              {t("common.cancel")}
            </Link>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className="btn-primary px-8 py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? t("forum.new.form.creating") : t("forum.new.form.submit")}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
