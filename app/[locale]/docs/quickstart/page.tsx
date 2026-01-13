"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Quick Start",
    intro: "This guide will help you build and deploy your first Alkane smart contract on Bitcoin.",
    prereqTitle: "Prerequisites",
    prereqIntro: "Before you begin, make sure you have:",
    prereqs: [
      "Rust (1.70 or later) - Install from rustup.rs",
      "wasm-pack - cargo install wasm-pack",
      "Node.js (18 or later) - For the CLI and tooling"
    ],
    step1Title: "Step 1: Install the CLI",
    step1Intro: "Clone and build from source (develop branch):",
    step1Note: "Note: The CLI is not published to npm. Build from source is the only installation method.",
    step2Title: "Step 2: Create a Wallet",
    step3Title: "Step 3: Create Your Contract",
    step3Intro: "Create a new Rust project:",
    step3Toml: "Update Cargo.toml:",
    step3Code: "Write your contract in src/lib.rs:",
    step4Title: "Step 4: Build the Contract",
    step5Title: "Step 5: Deploy to Bitcoin",
    step6Title: "Step 6: Interact with Your Contract",
    nextStepsTitle: "Next Steps",
    nextSteps: [
      { text: "Learn about contract storage", href: "/docs/concepts/alkanes" },
      { text: "Explore the alkanes-std library", href: "/docs/concepts/alkanes" },
      { text: "Build more complex contracts", href: "/docs/concepts/alkanes" }
    ],
    examplesTitle: "Example Contracts",
    examplesIntro: "Check out these example contracts in the alkanes-rs repository:",
    examples: [
      "DIESEL token - Fungible token implementation",
      "frBTC - Wrapped BTC with futures support",
      "AMM Pool - Automated market maker"
    ]
  },
  zh: {
    title: "快速入门",
    intro: "本指南将帮助您在比特币上构建和部署第一个 Alkane 智能合约。",
    prereqTitle: "前置要求",
    prereqIntro: "开始之前，请确保您已安装：",
    prereqs: [
      "Rust（1.70 或更高版本）- 从 rustup.rs 安装",
      "wasm-pack - cargo install wasm-pack",
      "Node.js（18 或更高版本）- 用于 CLI 和工具"
    ],
    step1Title: "步骤 1：安装 CLI",
    step1Intro: "从源码克隆并构建（develop 分支）：",
    step1Note: "注意：CLI 未发布到 npm。从源码构建是唯一的安装方法。",
    step2Title: "步骤 2：创建钱包",
    step3Title: "步骤 3：创建合约",
    step3Intro: "创建新的 Rust 项目：",
    step3Toml: "更新 Cargo.toml：",
    step3Code: "在 src/lib.rs 中编写合约：",
    step4Title: "步骤 4：构建合约",
    step5Title: "步骤 5：部署到比特币",
    step6Title: "步骤 6：与合约交互",
    nextStepsTitle: "后续步骤",
    nextSteps: [
      { text: "了解合约存储", href: "/docs/concepts/alkanes" },
      { text: "探索 alkanes-std 库", href: "/docs/concepts/alkanes" },
      { text: "构建更复杂的合约", href: "/docs/concepts/alkanes" }
    ],
    examplesTitle: "示例合约",
    examplesIntro: "查看 alkanes-rs 代码库中的示例合约：",
    examples: [
      "DIESEL 代币 - 同质化代币实现",
      "frBTC - 支持期货的封装 BTC",
      "AMM 池 - 自动做市商"
    ]
  },
  ms: {
    title: "Mula Pantas",
    intro: "Panduan ini akan membantu anda membina dan melebarkan kontrak pintar Alkane pertama anda di Bitcoin.",
    prereqTitle: "Prasyarat",
    prereqIntro: "Sebelum anda bermula, pastikan anda mempunyai:",
    prereqs: [
      "Rust (1.70 atau lebih baru) - Pasang dari rustup.rs",
      "wasm-pack - cargo install wasm-pack",
      "Node.js (18 atau lebih baru) - Untuk CLI dan tooling"
    ],
    step1Title: "Langkah 1: Pasang CLI",
    step1Intro: "Klon dan bina dari sumber (cawangan develop):",
    step1Note: "Nota: CLI tidak diterbitkan ke npm. Bina dari sumber adalah satu-satunya kaedah pemasangan.",
    step2Title: "Langkah 2: Cipta Wallet",
    step3Title: "Langkah 3: Cipta Kontrak Anda",
    step3Intro: "Cipta projek Rust baharu:",
    step3Toml: "Kemas kini Cargo.toml:",
    step3Code: "Tulis kontrak anda dalam src/lib.rs:",
    step4Title: "Langkah 4: Bina Kontrak",
    step5Title: "Langkah 5: Lebarkan ke Bitcoin",
    step6Title: "Langkah 6: Berinteraksi dengan Kontrak Anda",
    nextStepsTitle: "Langkah Seterusnya",
    nextSteps: [
      { text: "Ketahui tentang penyimpanan kontrak", href: "/docs/concepts/alkanes" },
      { text: "Terokai perpustakaan alkanes-std", href: "/docs/concepts/alkanes" },
      { text: "Bina kontrak yang lebih kompleks", href: "/docs/concepts/alkanes" }
    ],
    examplesTitle: "Contoh Kontrak",
    examplesIntro: "Semak contoh kontrak ini dalam repositori alkanes-rs:",
    examples: [
      "Token DIESEL - Implementasi token boleh kulat",
      "frBTC - BTC terbungkus dengan sokongan futures",
      "Kolam AMM - Pembuat pasaran automatik"
    ]
  },
  vi: {
    title: "Khởi Động Nhanh",
    intro: "Hướng dẫn này sẽ giúp bạn xây dựng và triển khai hợp đồng thông minh Alkane đầu tiên trên Bitcoin.",
    prereqTitle: "Yêu Cầu",
    prereqIntro: "Trước khi bắt đầu, hãy đảm bảo bạn có:",
    prereqs: [
      "Rust (1.70 hoặc mới hơn) - Cài đặt từ rustup.rs",
      "wasm-pack - cargo install wasm-pack",
      "Node.js (18 hoặc mới hơn) - Cho CLI và công cụ"
    ],
    step1Title: "Bước 1: Cài Đặt CLI",
    step1Intro: "Sao chép và xây dựng từ nguồn (nhánh develop):",
    step1Note: "Lưu ý: CLI không được xuất bản lên npm. Xây dựng từ nguồn là phương pháp cài đặt duy nhất.",
    step2Title: "Bước 2: Tạo Ví",
    step3Title: "Bước 3: Tạo Hợp Đồng Của Bạn",
    step3Intro: "Tạo dự án Rust mới:",
    step3Toml: "Cập nhật Cargo.toml:",
    step3Code: "Viết hợp đồng của bạn trong src/lib.rs:",
    step4Title: "Bước 4: Xây Dựng Hợp Đồng",
    step5Title: "Bước 5: Triển Khai Lên Bitcoin",
    step6Title: "Bước 6: Tương Tác Với Hợp Đồng Của Bạn",
    nextStepsTitle: "Các Bước Tiếp Theo",
    nextSteps: [
      { text: "Tìm hiểu về lưu trữ hợp đồng", href: "/docs/concepts/alkanes" },
      { text: "Khám phá thư viện alkanes-std", href: "/docs/concepts/alkanes" },
      { text: "Xây dựng các hợp đồng phức tạp hơn", href: "/docs/concepts/alkanes" }
    ],
    examplesTitle: "Ví Dụ Hợp Đồng",
    examplesIntro: "Xem các hợp đồng ví dụ này trong kho alkanes-rs:",
    examples: [
      "Token DIESEL - Triển khai token có thể thay thế",
      "frBTC - BTC được bao bọc với hỗ trợ futures",
      "Bể AMM - Nhà tạo lập thị trường tự động"
    ]
  },
  ko: {
    title: "빠른 시작",
    intro: "이 가이드는 Bitcoin에서 첫 번째 Alkane 스마트 계약을 구축하고 배포하는 데 도움이 됩니다.",
    prereqTitle: "전제 조건",
    prereqIntro: "시작하기 전에 다음이 있는지 확인하세요:",
    prereqs: [
      "Rust (1.70 이상) - rustup.rs에서 설치",
      "wasm-pack - cargo install wasm-pack",
      "Node.js (18 이상) - CLI 및 도구용"
    ],
    step1Title: "단계 1: CLI 설치",
    step1Intro: "소스에서 복제 및 빌드 (develop 브랜치):",
    step1Note: "참고: CLI는 npm에 게시되지 않았습니다. 소스에서 빌드가 유일한 설치 방법입니다.",
    step2Title: "단계 2: 지갑 생성",
    step3Title: "단계 3: 계약 생성",
    step3Intro: "새 Rust 프로젝트 생성:",
    step3Toml: "Cargo.toml 업데이트:",
    step3Code: "src/lib.rs에 계약 작성:",
    step4Title: "단계 4: 계약 빌드",
    step5Title: "단계 5: Bitcoin에 배포",
    step6Title: "단계 6: 계약과 상호작용",
    nextStepsTitle: "다음 단계",
    nextSteps: [
      { text: "계약 스토리지에 대해 알아보기", href: "/docs/concepts/alkanes" },
      { text: "alkanes-std 라이브러리 탐색", href: "/docs/concepts/alkanes" },
      { text: "더 복잡한 계약 구축", href: "/docs/concepts/alkanes" }
    ],
    examplesTitle: "예제 계약",
    examplesIntro: "alkanes-rs 저장소에서 이러한 예제 계약을 확인하세요:",
    examples: [
      "DIESEL 토큰 - 대체 가능 토큰 구현",
      "frBTC - 선물 지원이 있는 래핑된 BTC",
      "AMM 풀 - 자동화된 마켓 메이커"
    ]
  }
};

function CodeBlock({ children, language = "bash" }: { children: string; language?: string }) {
  return (
    <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm my-4">
      <code>{children}</code>
    </pre>
  );
}

export default function QuickStartPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.prereqTitle}</h2>
        <p className="mb-4">{t.prereqIntro}</p>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.prereqs.map((prereq, i) => (
            <li key={i}><strong>{prereq.split(" - ")[0]}</strong> - {prereq.split(" - ")[1]}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.step1Title}</h2>
        <p>{t.step1Intro}</p>
        <CodeBlock>{`# Clone alkanes-rs (develop branch)
git clone https://github.com/kungfuflex/alkanes-rs.git -b develop
cd alkanes-rs

# Build the CLI
cargo build --release -p alkanes-cli

# Add to PATH (optional)
export PATH="$PWD/target/release:$PATH"`}</CodeBlock>
        <p className="text-sm text-[color:var(--sf-muted)] italic mt-2">{t.step1Note}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.step2Title}</h2>
        <CodeBlock>{`# Create a new wallet
alkanes-cli wallet create

# Or import an existing mnemonic
alkanes-cli wallet import

# Fund your wallet (testnet/signet)
alkanes-cli wallet receive  # Shows your address`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.step3Title}</h2>
        <p>{t.step3Intro}</p>
        <CodeBlock>{`cargo new --lib my-alkane
cd my-alkane`}</CodeBlock>
        <p>{t.step3Toml}</p>
        <CodeBlock language="toml">{`[package]
name = "my-alkane"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
alkanes-std = { git = "https://github.com/kungfuflex/alkanes-rs" }
alkanes-support = { git = "https://github.com/kungfuflex/alkanes-rs" }

[profile.release]
opt-level = "z"
lto = true`}</CodeBlock>
        <p>{t.step3Code}</p>
        <CodeBlock language="rust">{`use alkanes_std::prelude::*;
use alkanes_support::context::Context;

#[derive(Default)]
pub struct MyAlkane {
    counter: u64,
}

impl MyAlkane {
    // Initialize the contract
    pub fn new() -> Self {
        Self { counter: 0 }
    }

    // Increment the counter
    pub fn increment(&mut self) {
        self.counter += 1;
    }

    // Get the current count
    pub fn get_count(&self) -> u64 {
        self.counter
    }
}

// Export the contract
alkane!(MyAlkane);`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.step4Title}</h2>
        <CodeBlock>{`# Build to WASM
wasm-pack build --target web --release

# The output will be in pkg/my_alkane_bg.wasm`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.step5Title}</h2>
        <CodeBlock>{`# Deploy to signet (testnet)
alkanes-cli -p signet alkanes execute "[3,0,0]" \\
  --envelope "./pkg/my_alkane_bg.wasm" \\
  --fee-rate 10 \\
  -y

# The output will show your contract's Alkane ID
# e.g., [2, 1] means block 2, tx index 1`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.step6Title}</h2>
        <CodeBlock>{`# Call the increment function (opcode 1)
alkanes-cli -p signet alkanes execute "[2,1,1]" \\
  --fee-rate 10 \\
  -y

# Query the count (opcode 2)
alkanes-cli -p signet alkanes view "[2,1]" "2"`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.nextStepsTitle}</h2>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.nextSteps.map((step, i) => (
            <li key={i}>
              <a href={step.href} className="text-[color:var(--sf-primary)] hover:underline">
                {step.text}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.examplesTitle}</h2>
        <p className="mb-4">{t.examplesIntro}</p>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.examples.map((example, i) => (
            <li key={i}><strong>{example.split(" - ")[0]}</strong> - {example.split(" - ")[1]}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
