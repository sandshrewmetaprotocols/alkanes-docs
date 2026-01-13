"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, User, Camera, Loader2, Check, X } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useWallet } from "@/context/WalletContext";
import AddressAvatar from "@/components/AddressAvatar";

interface UserProfile {
  id: string;
  address: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  verified: boolean;
  postsCount: number;
  discussionsCount: number;
  likesReceived: number;
  trustLevel: number;
  createdAt: string;
  lastSeenAt: string | null;
}

export default function ProfilePage() {
  const t = useTranslations();
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isConnected,
    address,
    signMessage,
    onConnectModalOpenChange,
  } = useWallet();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch existing profile
  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile | null>({
    queryKey: ["profile", address],
    queryFn: async () => {
      if (!address) throw new Error("No address");
      const res = await fetch(`/api/profile?address=${address}`);
      if (!res.ok && res.status !== 200) {
        // Return null for any error, let the UI handle it gracefully
        return null;
      }
      const data = await res.json();
      // Handle the case where id is null (new user or DB unavailable)
      if (!data.id) {
        return null;
      }
      return data;
    },
    enabled: !!address && isConnected,
  });

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setAvatarPreview(profile.avatarUrl);
    }
  }, [profile]);

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      onConnectModalOpenChange(true);
    }
  }, [isConnected, onConnectModalOpenChange]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setSaveError("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setSaveError("Image must be less than 2MB");
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!address) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      let avatarUrl = avatarPreview;

      // Upload avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        formData.append("address", address);

        const uploadRes = await fetch("/api/profile/avatar", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const error = await uploadRes.json();
          throw new Error(error.error || "Failed to upload avatar");
        }

        const { url } = await uploadRes.json();
        avatarUrl = url;
      }

      // Update profile
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          displayName: displayName || null,
          bio: bio || null,
          avatarUrl,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save profile");
      }

      setSaveSuccess(true);
      setAvatarFile(null);
      queryClient.invalidateQueries({ queryKey: ["profile", address] });
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setSaveError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerify = async () => {
    if (!address || !signMessage) return;

    setIsVerifying(true);
    setSaveError(null);

    try {
      // Create verification message
      const timestamp = Date.now();
      const message = `Verify ownership of ${address} for alkanes.build forum\nTimestamp: ${timestamp}`;

      // Sign the message
      const signature = await signMessage(message);

      // Send to backend for verification
      const res = await fetch("/api/profile/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          message,
          signature,
          timestamp,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Verification failed");
      }

      queryClient.invalidateQueries({ queryKey: ["profile", address] });
    } catch (err) {
      console.error("Verification error:", err);
      setSaveError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[color:var(--sf-muted)] mb-4">Please connect your wallet to continue</p>
            <button
              onClick={() => onConnectModalOpenChange(true)}
              className="btn-primary"
            >
              Connect Wallet
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[color:var(--sf-text)]">Forum Profile</h1>
          <p className="text-[color:var(--sf-muted)]">
            Customize how you appear in the forum and discussions
          </p>
        </div>

        {profileLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[color:var(--sf-primary)]" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 text-[color:var(--sf-text)] flex items-center gap-2">
                <Camera size={20} />
                Profile Picture
              </h2>

              <div className="flex items-center gap-6">
                <div className="relative">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-[color:var(--sf-outline)]"
                    />
                  ) : (
                    <AddressAvatar address={address} size={96} className="border-4 border-[color:var(--sf-outline)]" />
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-[color:var(--sf-primary)] text-black hover:bg-[color:var(--sf-primary-hover)] transition-colors"
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-[color:var(--sf-muted)] mb-2">
                    Upload a profile picture or use your default address avatar
                  </p>
                  <p className="text-xs text-[color:var(--sf-muted)]">
                    Recommended: Square image, at least 200x200px. Max 2MB.
                  </p>
                  {avatarPreview && avatarPreview !== profile?.avatarUrl && (
                    <button
                      onClick={() => {
                        setAvatarPreview(profile?.avatarUrl || null);
                        setAvatarFile(null);
                      }}
                      className="text-xs text-red-500 hover:text-red-400 mt-2"
                    >
                      Remove new avatar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 text-[color:var(--sf-text)] flex items-center gap-2">
                <User size={20} />
                Profile Information
              </h2>

              <div className="space-y-4">
                {/* Wallet Address */}
                <div>
                  <label className="block text-sm font-medium text-[color:var(--sf-muted)] mb-1">
                    Wallet Address
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 rounded-xl bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] font-mono text-sm text-[color:var(--sf-text)] truncate">
                      {address}
                    </div>
                    {profile?.verified ? (
                      <div className="px-3 py-2 rounded-lg bg-green-500/10 text-green-500 text-sm font-medium flex items-center gap-1">
                        <Check size={16} />
                        Verified
                      </div>
                    ) : (
                      <button
                        onClick={handleVerify}
                        disabled={isVerifying}
                        className="px-3 py-2 rounded-lg bg-[color:var(--sf-primary)] text-black text-sm font-medium hover:bg-[color:var(--sf-primary-hover)] transition-colors disabled:opacity-50"
                      >
                        {isVerifying ? <Loader2 size={16} className="animate-spin" /> : "Verify"}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[color:var(--sf-muted)] mt-1">
                    Verify ownership by signing a message with your wallet
                  </p>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-[color:var(--sf-muted)] mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={50}
                    placeholder="Enter a display name"
                    className="w-full px-4 py-3 rounded-xl bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] text-[color:var(--sf-text)] outline-none focus:border-[color:var(--sf-primary)] transition-colors"
                  />
                  <p className="text-xs text-[color:var(--sf-muted)] mt-1">
                    This will be shown instead of your wallet address in the forum
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-[color:var(--sf-muted)] mb-1">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 rounded-xl bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] text-[color:var(--sf-text)] outline-none focus:border-[color:var(--sf-primary)] transition-colors resize-none"
                  />
                  <p className="text-xs text-[color:var(--sf-muted)] mt-1">
                    {bio.length}/500 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            {profile && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold mb-4 text-[color:var(--sf-text)]">
                  Forum Statistics
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-xl bg-[color:var(--sf-surface)]">
                    <div className="text-2xl font-bold text-[color:var(--sf-text)]">
                      {profile.postsCount}
                    </div>
                    <div className="text-sm text-[color:var(--sf-muted)]">Posts</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-[color:var(--sf-surface)]">
                    <div className="text-2xl font-bold text-[color:var(--sf-text)]">
                      {profile.discussionsCount}
                    </div>
                    <div className="text-sm text-[color:var(--sf-muted)]">Discussions</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-[color:var(--sf-surface)]">
                    <div className="text-2xl font-bold text-[color:var(--sf-text)]">
                      {profile.likesReceived}
                    </div>
                    <div className="text-sm text-[color:var(--sf-muted)]">Likes</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-[color:var(--sf-surface)]">
                    <div className="text-2xl font-bold text-[color:var(--sf-text)]">
                      {profile.trustLevel}
                    </div>
                    <div className="text-sm text-[color:var(--sf-muted)]">Trust Level</div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-[color:var(--sf-muted)]">
                  Member since {new Date(profile.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {saveError && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                <X size={16} />
                {saveError}
              </div>
            )}

            {saveSuccess && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-500 text-sm">
                <Check size={16} />
                Profile saved successfully!
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[color:var(--sf-primary)] text-black font-medium hover:bg-[color:var(--sf-primary-hover)] transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
