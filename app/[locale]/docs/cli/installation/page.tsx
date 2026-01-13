"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Installation",
    intro: "This guide covers installing alkanes-cli from source and setting up the @alkanes/ts-sdk TypeScript library.",
    cliTitle: "Installing alkanes-cli",
    prereqTitle: "Prerequisites",
    prereqs: ["Rust (1.70+) - Install via rustup.rs", "Git - For cloning the repository", "Build tools - gcc, make, etc."],
    cloneTitle: "Clone and Build",
    pathTitle: "Add to PATH",
    verifyTitle: "Verify Installation",
    walletTitle: "Creating a Wallet",
    walletIntro: "Before using most commands, you need a wallet:",
    addressTitle: "View Your Addresses",
    addressIntro: "This shows addresses for all supported types:",
    addressTypes: ["P2TR (Taproot) - Recommended for Alkanes", "P2WPKH (Native SegWit)", "P2SH (SegWit-compatible)", "P2PKH (Legacy)"],
    sdkTitle: "Installing @alkanes/ts-sdk",
    npmTitle: "Using Package Manager",
    sourceTitle: "From Source",
    linkTitle: "Link for Local Development",
    usageTitle: "TypeScript SDK Usage",
    basicTitle: "Basic Setup",
    providerTitle: "Create a Provider",
    configTitle: "Configuration",
    envTitle: "Environment Variables",
    regtestTitle: "Regtest Configuration",
    mainnetTitle: "Mainnet Configuration",
    wasmTitle: "Building WASM Module",
    troubleTitle: "Troubleshooting",
    buildErrorsTitle: "Build Errors",
    connErrorsTitle: "Connection Errors"
  },
  zh: {
    title: "安装",
    intro: "本指南介绍如何从源码安装 alkanes-cli 并设置 @alkanes/ts-sdk TypeScript 库。",
    cliTitle: "安装 alkanes-cli",
    prereqTitle: "前置要求",
    prereqs: ["Rust (1.70+) - 通过 rustup.rs 安装", "Git - 用于克隆代码库", "构建工具 - gcc、make 等"],
    cloneTitle: "克隆并构建",
    pathTitle: "添加到 PATH",
    verifyTitle: "验证安装",
    walletTitle: "创建钱包",
    walletIntro: "使用大多数命令前，您需要一个钱包：",
    addressTitle: "查看地址",
    addressIntro: "显示所有支持类型的地址：",
    addressTypes: ["P2TR (Taproot) - Alkanes 推荐使用", "P2WPKH (原生隔离见证)", "P2SH (兼容隔离见证)", "P2PKH (传统)"],
    sdkTitle: "安装 @alkanes/ts-sdk",
    npmTitle: "使用包管理器",
    sourceTitle: "从源码安装",
    linkTitle: "本地开发链接",
    usageTitle: "TypeScript SDK 使用",
    basicTitle: "基本设置",
    providerTitle: "创建 Provider",
    configTitle: "配置",
    envTitle: "环境变量",
    regtestTitle: "Regtest 配置",
    mainnetTitle: "主网配置",
    wasmTitle: "构建 WASM 模块",
    troubleTitle: "故障排除",
    buildErrorsTitle: "构建错误",
    connErrorsTitle: "连接错误"
  },
  ms: {
    title: "Pemasangan",
    intro: "Panduan ini merangkumi pemasangan alkanes-cli dari sumber dan menyediakan perpustakaan TypeScript @alkanes/ts-sdk.",
    cliTitle: "Memasang alkanes-cli",
    prereqTitle: "Prasyarat",
    prereqs: ["Rust (1.70+) - Pasang melalui rustup.rs", "Git - Untuk mengkloning repositori", "Alat pembinaan - gcc, make, dll."],
    cloneTitle: "Klon dan Bina",
    pathTitle: "Tambah ke PATH",
    verifyTitle: "Sahkan Pemasangan",
    walletTitle: "Mencipta Dompet",
    walletIntro: "Sebelum menggunakan kebanyakan arahan, anda memerlukan dompet:",
    addressTitle: "Lihat Alamat Anda",
    addressIntro: "Ini menunjukkan alamat untuk semua jenis yang disokong:",
    addressTypes: ["P2TR (Taproot) - Disyorkan untuk Alkanes", "P2WPKH (Native SegWit)", "P2SH (SegWit-compatible)", "P2PKH (Legacy)"],
    sdkTitle: "Memasang @alkanes/ts-sdk",
    npmTitle: "Menggunakan Pengurus Pakej",
    sourceTitle: "Dari Sumber",
    linkTitle: "Pautan untuk Pembangunan Tempatan",
    usageTitle: "Penggunaan TypeScript SDK",
    basicTitle: "Persediaan Asas",
    providerTitle: "Cipta Provider",
    configTitle: "Konfigurasi",
    envTitle: "Pembolehubah Persekitaran",
    regtestTitle: "Konfigurasi Regtest",
    mainnetTitle: "Konfigurasi Mainnet",
    wasmTitle: "Membina Modul WASM",
    troubleTitle: "Penyelesaian Masalah",
    buildErrorsTitle: "Ralat Pembinaan",
    connErrorsTitle: "Ralat Sambungan"
  },
  vi: {
    title: "Cài đặt",
    intro: "Hướng dẫn này bao gồm cài đặt alkanes-cli từ mã nguồn và thiết lập thư viện TypeScript @alkanes/ts-sdk.",
    cliTitle: "Cài đặt alkanes-cli",
    prereqTitle: "Yêu cầu trước",
    prereqs: ["Rust (1.70+) - Cài đặt qua rustup.rs", "Git - Để clone repository", "Công cụ build - gcc, make, v.v."],
    cloneTitle: "Clone và Build",
    pathTitle: "Thêm vào PATH",
    verifyTitle: "Xác minh Cài đặt",
    walletTitle: "Tạo Ví",
    walletIntro: "Trước khi sử dụng hầu hết các lệnh, bạn cần một ví:",
    addressTitle: "Xem Địa chỉ của Bạn",
    addressIntro: "Điều này hiển thị địa chỉ cho tất cả các loại được hỗ trợ:",
    addressTypes: ["P2TR (Taproot) - Được khuyên dùng cho Alkanes", "P2WPKH (Native SegWit)", "P2SH (Tương thích SegWit)", "P2PKH (Legacy)"],
    sdkTitle: "Cài đặt @alkanes/ts-sdk",
    npmTitle: "Sử dụng Trình quản lý Gói",
    sourceTitle: "Từ Mã nguồn",
    linkTitle: "Liên kết cho Phát triển Cục bộ",
    usageTitle: "Sử dụng TypeScript SDK",
    basicTitle: "Thiết lập Cơ bản",
    providerTitle: "Tạo Provider",
    configTitle: "Cấu hình",
    envTitle: "Biến Môi trường",
    regtestTitle: "Cấu hình Regtest",
    mainnetTitle: "Cấu hình Mainnet",
    wasmTitle: "Build Module WASM",
    troubleTitle: "Khắc phục Sự cố",
    buildErrorsTitle: "Lỗi Build",
    connErrorsTitle: "Lỗi Kết nối"
  },
  ko: {
    title: "설치",
    intro: "이 가이드는 소스에서 alkanes-cli를 설치하고 @alkanes/ts-sdk TypeScript 라이브러리를 설정하는 방법을 다룹니다.",
    cliTitle: "alkanes-cli 설치",
    prereqTitle: "사전 요구사항",
    prereqs: ["Rust (1.70+) - rustup.rs를 통해 설치", "Git - 저장소 복제용", "빌드 도구 - gcc, make 등"],
    cloneTitle: "클론 및 빌드",
    pathTitle: "PATH에 추가",
    verifyTitle: "설치 확인",
    walletTitle: "지갑 생성",
    walletIntro: "대부분의 명령을 사용하기 전에 지갑이 필요합니다:",
    addressTitle: "주소 보기",
    addressIntro: "지원되는 모든 유형의 주소를 표시합니다:",
    addressTypes: ["P2TR (Taproot) - Alkanes에 권장", "P2WPKH (Native SegWit)", "P2SH (SegWit 호환)", "P2PKH (레거시)"],
    sdkTitle: "@alkanes/ts-sdk 설치",
    npmTitle: "패키지 관리자 사용",
    sourceTitle: "소스에서 설치",
    linkTitle: "로컬 개발용 링크",
    usageTitle: "TypeScript SDK 사용",
    basicTitle: "기본 설정",
    providerTitle: "Provider 생성",
    configTitle: "구성",
    envTitle: "환경 변수",
    regtestTitle: "Regtest 구성",
    mainnetTitle: "메인넷 구성",
    wasmTitle: "WASM 모듈 빌드",
    troubleTitle: "문제 해결",
    buildErrorsTitle: "빌드 오류",
    connErrorsTitle: "연결 오류"
  }
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm my-4">
      <code>{children}</code>
    </pre>
  );
}

export default function InstallationPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.cliTitle}</h2>

        <h3 className="text-xl font-medium mb-2">{t.prereqTitle}</h3>
        <ul className="list-disc list-inside space-y-1 text-[color:var(--sf-muted)] mb-4">
          {t.prereqs.map((p, i) => <li key={i}>{p}</li>)}
        </ul>

        <h3 className="text-xl font-medium mb-2">{t.cloneTitle}</h3>
        <CodeBlock>{`# Clone the repository (develop branch)
git clone https://github.com/kungfuflex/alkanes-rs.git -b develop
cd alkanes-rs

# Build the CLI in release mode
cargo build --release -p alkanes-cli

# The binary is at target/release/alkanes-cli
./target/release/alkanes-cli --version`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2">{t.pathTitle}</h3>
        <CodeBlock>{`# Option 1: Copy to system path
sudo cp target/release/alkanes-cli /usr/local/bin/

# Option 2: Add to your shell profile
echo 'export PATH="$HOME/alkanes-rs/target/release:$PATH"' >> ~/.bashrc
source ~/.bashrc`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2">{t.verifyTitle}</h3>
        <CodeBlock>{`alkanes-cli --version
alkanes-cli --help`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.walletTitle}</h2>
        <p className="mb-4">{t.walletIntro}</p>
        <CodeBlock>{`# Create a new wallet with a random mnemonic
alkanes-cli wallet create --passphrase "your-secure-passphrase"

# Or restore from an existing mnemonic
alkanes-cli wallet create "your twelve word mnemonic phrase here" \\
  --passphrase "your-secure-passphrase"

# Specify output file
alkanes-cli wallet create --passphrase "your-passphrase" \\
  --output /path/to/wallet.json`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2">{t.addressTitle}</h3>
        <CodeBlock>{`alkanes-cli --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  wallet addresses`}</CodeBlock>
        <p className="mb-2">{t.addressIntro}</p>
        <ul className="list-disc list-inside space-y-1 text-[color:var(--sf-muted)]">
          {t.addressTypes.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.sdkTitle}</h2>

        <h3 className="text-xl font-medium mb-2">{t.npmTitle}</h3>
        <CodeBlock>{`# Configure npm to use the alkanes registry
npm config set @alkanes:registry https://pkg.alkanes.build/

# Install the SDK
npm install @alkanes/ts-sdk
# or
yarn add @alkanes/ts-sdk
# or
pnpm add @alkanes/ts-sdk`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2">{t.sourceTitle}</h3>
        <CodeBlock>{`# Clone the repository
git clone https://github.com/kungfuflex/alkanes-rs.git -b develop
cd alkanes-rs/ts-sdk

# Install dependencies
npm install

# Build the SDK (includes WASM)
npm run build`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2">{t.linkTitle}</h3>
        <CodeBlock>{`cd alkanes-rs/ts-sdk
npm link

# In your project
npm link @alkanes/ts-sdk`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.usageTitle}</h2>

        <h3 className="text-xl font-medium mb-2">{t.basicTitle}</h3>
        <CodeBlock>{`import {
  createKeystore,
  unlockKeystore,
  createWallet,
  createProvider
} from '@alkanes/ts-sdk';

// Create a new wallet
const { keystore, mnemonic } = await createKeystore('your-password', {
  network: 'mainnet'
});

console.log('Save this mnemonic:', mnemonic);

// Later, unlock the wallet
const unlockedKeystore = await unlockKeystore(keystore, 'your-password');
const wallet = createWallet(unlockedKeystore);

// Get addresses
const taprootAddress = wallet.getReceivingAddress(0);
console.log('Taproot address:', taprootAddress);`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2">{t.providerTitle}</h3>
        <CodeBlock>{`import { createProvider } from '@alkanes/ts-sdk';
import * as bitcoin from 'bitcoinjs-lib';

const provider = createProvider({
  url: 'https://mainnet.subfrost.io/v4/jsonrpc',
  network: bitcoin.networks.bitcoin,
  networkType: 'mainnet',
});

// Get balance
const balance = await provider.getBalance(address);
console.log('Balance:', balance);`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.configTitle}</h2>

        <h3 className="text-xl font-medium mb-2">{t.envTitle}</h3>
        <CodeBlock>{`# SUBFROST API key
export SUBFROST_API_KEY="your-api-key"

# Default network
export ALKANES_NETWORK="mainnet"`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2">{t.regtestTitle}</h3>
        <CodeBlock>{`alkanes-cli -p regtest \\
  --jsonrpc-url https://regtest.subfrost.io/v4/jsonrpc \\
  --data-api https://regtest.subfrost.io/v4/api \\
  metashrew height`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2">{t.mainnetTitle}</h3>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/YOUR_API_KEY \\
  --data-api https://mainnet.subfrost.io/v4/YOUR_API_KEY \\
  metashrew height`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.wasmTitle}</h2>
        <CodeBlock>{`# Install wasm-pack
cargo install wasm-pack

# Build the WASM module
cd alkanes-rs/ts-sdk
npm run build:wasm`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.troubleTitle}</h2>

        <h3 className="text-xl font-medium mb-2">{t.buildErrorsTitle}</h3>
        <CodeBlock>{`# Missing OpenSSL (Ubuntu/Debian)
sudo apt-get install libssl-dev pkg-config

# Missing OpenSSL (macOS)
brew install openssl

# wasm-pack not found
cargo install wasm-pack`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2">{t.connErrorsTitle}</h3>
        <CodeBlock>{`# Rate limiting - use your API key for higher limits
--jsonrpc-url https://mainnet.subfrost.io/v4/YOUR_API_KEY

# Network mismatch - ensure -p matches your endpoint network`}</CodeBlock>
      </div>
    </div>
  );
}
