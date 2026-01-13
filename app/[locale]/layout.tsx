import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";
import "../globals.css";
import { Providers } from "./providers";

// Sans-serif font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Monospace font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Site configuration
const siteConfig = {
  name: "Alkanes",
  url: "https://alkanes.build",
  ogImage: "/og-image.png",
  twitterHandle: "@ptrk_btc",
};

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
  ],
};

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Generate metadata based on locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Alkanes - Bitcoin Smart Contracts & DeFi on Taproot",
    zh: "Alkanes - 比特币 Taproot 智能合约与 DeFi 元协议",
    ko: "Alkanes - 비트코인 Taproot 스마트 컨트랙트 & DeFi",
    ms: "Alkanes - Kontrak Pintar Bitcoin & DeFi di Taproot",
    vi: "Alkanes - Hợp đồng Thông minh Bitcoin & DeFi trên Taproot",
  };

  const descriptions: Record<string, string> = {
    en: "Alkanes is a Bitcoin metaprotocol for smart contracts and DeFi. Build on Bitcoin using Taproot, WASM runtime, and native Bitcoin security. No sidechains, no bridges.",
    zh: "Alkanes 是比特币智能合约与 DeFi 元协议。基于 Taproot 在比特币上构建，使用 WASM 运行时和原生比特币安全性。无侧链，无跨链桥。",
    ko: "Alkanes는 스마트 컨트랙트와 DeFi를 위한 비트코인 메타프로토콜입니다. Taproot, WASM 런타임, 네이티브 비트코인 보안을 사용하여 비트코인에서 구축하세요. 사이드체인 없음, 브릿지 없음.",
    ms: "Alkanes adalah metaprotokol Bitcoin untuk kontrak pintar dan DeFi. Bina di Bitcoin menggunakan Taproot, runtime WASM, dan keselamatan Bitcoin asli. Tiada sidechain, tiada jambatan.",
    vi: "Alkanes là giao thức meta Bitcoin cho hợp đồng thông minh và DeFi. Xây dựng trên Bitcoin sử dụng Taproot, runtime WASM và bảo mật Bitcoin gốc. Không có sidechain, không có bridge.",
  };

  const keywordsEN = [
    "Alkanes",
    "DIESEL",
    "Bitcoin DeFi",
    "Taproot",
    "Bitcoin smart contracts",
    "WASM",
    "WebAssembly",
    "Bitcoin governance",
    "decentralized finance",
    "yield vaults",
    "Bitcoin staking",
    "metaprotocol",
    "Runes",
    "Ordinals",
    "Bitcoin Layer 1",
    "native Bitcoin",
    "BTC DeFi",
    "Rust smart contracts",
    "Bitcoin programmability",
  ];

  const keywordsZH = [
    "Alkanes",
    "DIESEL",
    "比特币 DeFi",
    "Taproot",
    "比特币智能合约",
    "WASM",
    "WebAssembly",
    "比特币治理",
    "去中心化金融",
    "收益金库",
    "比特币质押",
    "元协议",
    "符文",
    "铭文",
    "比特币一层",
    "原生比特币",
    "BTC DeFi",
    "Rust 智能合约",
    "比特币可编程性",
  ];

  const keywordsKO = [
    "Alkanes",
    "DIESEL",
    "비트코인 DeFi",
    "Taproot",
    "비트코인 스마트 컨트랙트",
    "WASM",
    "WebAssembly",
    "비트코인 거버넌스",
    "탈중앙화 금융",
    "수익 볼트",
    "비트코인 스테이킹",
    "메타프로토콜",
    "룬",
    "오디널스",
    "비트코인 레이어 1",
    "네이티브 비트코인",
    "BTC DeFi",
    "Rust 스마트 컨트랙트",
    "비트코인 프로그래밍",
  ];

  const keywordsMS = [
    "Alkanes",
    "DIESEL",
    "Bitcoin DeFi",
    "Taproot",
    "kontrak pintar Bitcoin",
    "WASM",
    "WebAssembly",
    "tadbir urus Bitcoin",
    "kewangan terdesentralisasi",
    "bilik kebal hasil",
    "staking Bitcoin",
    "metaprotokol",
    "Runes",
    "Ordinals",
    "Bitcoin Layer 1",
    "Bitcoin asli",
    "BTC DeFi",
    "kontrak pintar Rust",
    "kebolehprograman Bitcoin",
  ];

  const keywordsVI = [
    "Alkanes",
    "DIESEL",
    "Bitcoin DeFi",
    "Taproot",
    "hợp đồng thông minh Bitcoin",
    "WASM",
    "WebAssembly",
    "quản trị Bitcoin",
    "tài chính phi tập trung",
    "kho lợi nhuận",
    "staking Bitcoin",
    "giao thức meta",
    "Runes",
    "Ordinals",
    "Bitcoin Layer 1",
    "Bitcoin gốc",
    "BTC DeFi",
    "hợp đồng thông minh Rust",
    "khả năng lập trình Bitcoin",
  ];

  const currentTitle = titles[locale] || titles.en;
  const currentDescription = descriptions[locale] || descriptions.en;
  const keywordsMap: Record<string, string[]> = {
    zh: keywordsZH,
    ko: keywordsKO,
    ms: keywordsMS,
    vi: keywordsVI,
  };
  const currentKeywords = keywordsMap[locale] || keywordsEN;
  const localeMap: Record<string, string> = {
    zh: "zh_CN",
    ko: "ko_KR",
    ms: "ms_MY",
    vi: "vi_VN",
  };
  const currentLocale = localeMap[locale] || "en_US";

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: currentTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: currentDescription,
    keywords: currentKeywords,
    authors: [{ name: "Alkanes Foundation" }],
    creator: "Alkanes Foundation",
    publisher: "Alkanes Foundation",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        en: `${siteConfig.url}/en`,
        zh: `${siteConfig.url}/zh`,
        ko: `${siteConfig.url}/ko`,
        ms: `${siteConfig.url}/ms`,
        vi: `${siteConfig.url}/vi`,
        "x-default": `${siteConfig.url}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: currentLocale,
      alternateLocale: ["en_US", "zh_CN", "ko_KR", "ms_MY", "vi_VN"].filter(
        (l) => l !== currentLocale
      ),
      url: `${siteConfig.url}/${locale}`,
      siteName: siteConfig.name,
      title: currentTitle,
      description: currentDescription,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: "Alkanes - Bitcoin Smart Contracts & DeFi",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: currentTitle,
      description: currentDescription,
      images: [siteConfig.ogImage],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/site.webmanifest",
    category: "technology",
    classification: "Decentralized Finance",
  };
}

// JSON-LD Structured Data
function JsonLd({ locale }: { locale: string }) {
  const getText = (
    en: string,
    zh: string,
    ko: string,
    ms: string,
    vi: string
  ) => {
    if (locale === "zh") return zh;
    if (locale === "ko") return ko;
    if (locale === "ms") return ms;
    if (locale === "vi") return vi;
    return en;
  };

  const getLanguage = () => {
    if (locale === "zh") return "zh-CN";
    if (locale === "ko") return "ko-KR";
    if (locale === "ms") return "ms-MY";
    if (locale === "vi") return "vi-VN";
    return "en-US";
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: "Alkanes Protocol",
        description: getText(
          "Alkanes is a Bitcoin metaprotocol for smart contracts and DeFi on Taproot",
          "Alkanes 是比特币智能合约与 DeFi 元协议",
          "Alkanes는 스마트 컨트랙트와 DeFi를 위한 비트코인 메타프로토콜입니다",
          "Alkanes adalah metaprotokol Bitcoin untuk kontrak pintar dan DeFi",
          "Alkanes là giao thức meta Bitcoin cho hợp đồng thông minh và DeFi"
        ),
        inLanguage: getLanguage(),
        publisher: {
          "@type": "Organization",
          name: "Alkanes Foundation",
          url: siteConfig.url,
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: "Alkanes Foundation",
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/logo.png`,
        },
        sameAs: [
          "https://github.com/kungfuflex/alkanes-rs",
          "https://twitter.com/ptrk_btc",
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "Alkanes Protocol",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Bitcoin",
        description: getText(
          "Smart contract platform and DeFi protocol built on Bitcoin Taproot",
          "基于比特币 Taproot 的智能合约平台和 DeFi 协议",
          "비트코인 Taproot 기반 스마트 컨트랙트 플랫폼 및 DeFi 프로토콜",
          "Platform kontrak pintar dan protokol DeFi yang dibina di atas Bitcoin Taproot",
          "Nền tảng hợp đồng thông minh và giao thức DeFi được xây dựng trên Bitcoin Taproot"
        ),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        creator: {
          "@type": "Organization",
          name: "Alkanes Foundation",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: getText(
              "What is Alkanes?",
              "什么是 Alkanes？",
              "Alkanes란 무엇인가요?",
              "Apa itu Alkanes?",
              "Alkanes là gì?"
            ),
            acceptedAnswer: {
              "@type": "Answer",
              text: getText(
                "Alkanes is a Bitcoin metaprotocol that enables developers to build and deploy smart contracts on Bitcoin using a WASM runtime.",
                "Alkanes 是一个比特币元协议，允许开发者使用 WASM 运行时在比特币上构建和部署智能合约。",
                "Alkanes는 개발자가 WASM 런타임을 사용하여 비트코인에서 스마트 컨트랙트를 구축하고 배포할 수 있게 해주는 비트코인 메타프로토콜입니다.",
                "Alkanes adalah metaprotokol Bitcoin yang membolehkan pembangun membina dan melaksanakan kontrak pintar di Bitcoin menggunakan runtime WASM.",
                "Alkanes là một giao thức meta Bitcoin cho phép các nhà phát triển xây dựng và triển khai hợp đồng thông minh trên Bitcoin sử dụng runtime WASM."
              ),
            },
          },
          {
            "@type": "Question",
            name: getText(
              "What is DIESEL?",
              "什么是 DIESEL？",
              "DIESEL이란 무엇인가요?",
              "Apa itu DIESEL?",
              "DIESEL là gì?"
            ),
            acceptedAnswer: {
              "@type": "Answer",
              text: getText(
                "DIESEL is the governance token for the Alkanes protocol, allowing holders to vote on protocol upgrades and treasury allocation.",
                "DIESEL 是 Alkanes 协议的治理代币，持有者可以参与协议升级和资金分配的投票。",
                "DIESEL은 Alkanes 프로토콜의 거버넌스 토큰으로, 보유자가 프로토콜 업그레이드 및 재무 배분에 투표할 수 있습니다.",
                "DIESEL adalah token tadbir urus untuk protokol Alkanes, membolehkan pemegang mengundi peningkatan protokol dan peruntukan perbendaharaan.",
                "DIESEL là token quản trị cho giao thức Alkanes, cho phép chủ sở hữu bỏ phiếu về nâng cấp giao thức và phân bổ ngân quỹ."
              ),
            },
          },
          {
            "@type": "Question",
            name: getText(
              "How does Alkanes achieve Bitcoin security?",
              "Alkanes 如何实现比特币安全性？",
              "Alkanes는 어떻게 비트코인 보안을 달성하나요?",
              "Bagaimana Alkanes mencapai keselamatan Bitcoin?",
              "Alkanes đạt được bảo mật Bitcoin như thế nào?"
            ),
            acceptedAnswer: {
              "@type": "Answer",
              text: getText(
                "All Alkanes state is anchored to Bitcoin mainnet. No sidechains or bridges are required - all data is stored directly on the Bitcoin blockchain.",
                "所有 Alkanes 状态都锚定于比特币主链。无需侧链或跨链桥，所有数据都直接存储在比特币区块链上。",
                "모든 Alkanes 상태는 비트코인 메인넷에 앵커링됩니다. 사이드체인이나 브릿지가 필요 없으며, 모든 데이터는 비트코인 블록체인에 직접 저장됩니다.",
                "Semua keadaan Alkanes berlabuh kepada mainnet Bitcoin. Tiada sidechain atau jambatan diperlukan - semua data disimpan terus pada blockchain Bitcoin.",
                "Tất cả trạng thái Alkanes được neo vào mainnet Bitcoin. Không cần sidechain hoặc bridge - tất cả dữ liệu được lưu trữ trực tiếp trên blockchain Bitcoin."
              ),
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale} data-theme="dark" suppressHydrationWarning>
      <head>
        <JsonLd locale={locale} />
        {/* Google API for Drive backup functionality */}
        <script src="https://apis.google.com/js/api.js" async defer />
        <script src="https://accounts.google.com/gsi/client" async defer />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
