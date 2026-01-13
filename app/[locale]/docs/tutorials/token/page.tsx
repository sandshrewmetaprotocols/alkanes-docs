"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Build a Token",
    subtitle: "Step-by-step guide to creating a fungible token on Alkanes",
    intro: "In this tutorial, you'll build a complete fungible token contract with minting, burning, and supply tracking. We'll cover the essential patterns used in production tokens like DIESEL and FROST.",

    prerequisitesTitle: "Prerequisites",
    prerequisites: [
      "Rust and wasm32-unknown-unknown target installed",
      "Basic understanding of Rust",
      "alkanes-cli installed",
      "Local regtest environment running",
    ],

    overviewTitle: "Token Overview",
    overviewDesc: "Our token will have the following features:",
    features: [
      { name: "Initialize", desc: "Set up the token with name, symbol, and initial supply" },
      { name: "Mint", desc: "Create new tokens (admin only)" },
      { name: "Burn", desc: "Destroy tokens to reduce supply" },
      { name: "Total Supply", desc: "Query the current total supply" },
      { name: "Name/Symbol", desc: "Return token metadata" },
    ],

    step1Title: "Step 1: Project Setup",
    step1Desc: "Create a new Rust project for your token:",

    step2Title: "Step 2: Cargo.toml",
    step2Desc: "Configure your dependencies:",

    step3Title: "Step 3: Token Structure",
    step3Desc: "Define your token struct and message enum:",

    step4Title: "Step 4: Storage Helpers",
    step4Desc: "Add helper methods for storage access:",

    step5Title: "Step 5: Initialize",
    step5Desc: "Implement the initialization logic:",

    step6Title: "Step 6: Minting",
    step6Desc: "Add admin-only minting with auth token protection:",

    step7Title: "Step 7: Burning",
    step7Desc: "Implement token burning from incoming transfers:",

    step8Title: "Step 8: Query Methods",
    step8Desc: "Add read-only methods for token metadata:",

    step9Title: "Step 9: Complete Contract",
    step9Desc: "Here's the complete token contract:",

    buildTitle: "Building the Contract",
    buildDesc: "Compile your token to WebAssembly:",

    deployTitle: "Deploying the Token",
    deployDesc: "Deploy your token to regtest:",

    testingTitle: "Testing the Token",
    testingDesc: "Test your token with these commands:",

    advancedTitle: "Advanced Features",
    advancedDesc: "Here are some enhancements you could add:",
    advancedFeatures: [
      { name: "Allowances", desc: "Implement approve/transferFrom for delegated transfers" },
      { name: "Pausable", desc: "Add ability to pause all transfers in emergencies" },
      { name: "Upgradeable", desc: "Use proxy pattern for upgradeable logic" },
      { name: "Vesting", desc: "Implement time-locked token releases" },
      { name: "Snapshots", desc: "Track balances at specific block heights" },
    ],

    nextStepsTitle: "Next Steps",
    nextSteps: [
      { text: "Build an AMM", href: "/docs/tutorials/amm", desc: "Create liquidity pools" },
      { text: "Storage Patterns", href: "/docs/contracts/storage", desc: "Advanced storage techniques" },
      { text: "Deployment Guide", href: "/docs/contracts/deployment", desc: "Production deployment" },
    ],
  },
  zh: {
    title: "构建代币",
    subtitle: "在 Alkanes 上创建同质化代币的分步指南",
    intro: "在本教程中，您将构建一个完整的同质化代币合约，包含铸造、销毁和供应量追踪功能。我们将介绍 DIESEL 和 FROST 等生产代币中使用的基本模式。",

    prerequisitesTitle: "前提条件",
    prerequisites: [
      "已安装 Rust 和 wasm32-unknown-unknown 目标",
      "基本了解 Rust",
      "已安装 alkanes-cli",
      "本地 regtest 环境正在运行",
    ],

    overviewTitle: "代币概述",
    overviewDesc: "我们的代币将具有以下功能：",
    features: [
      { name: "初始化", desc: "设置代币的名称、符号和初始供应量" },
      { name: "铸造", desc: "创建新代币（仅管理员）" },
      { name: "销毁", desc: "销毁代币以减少供应量" },
      { name: "总供应量", desc: "查询当前总供应量" },
      { name: "名称/符号", desc: "返回代币元数据" },
    ],

    step1Title: "步骤 1：项目设置",
    step1Desc: "为您的代币创建一个新的 Rust 项目：",

    step2Title: "步骤 2：Cargo.toml",
    step2Desc: "配置您的依赖项：",

    step3Title: "步骤 3：代币结构",
    step3Desc: "定义您的代币结构体和消息枚举：",

    step4Title: "步骤 4：存储辅助方法",
    step4Desc: "添加存储访问的辅助方法：",

    step5Title: "步骤 5：初始化",
    step5Desc: "实现初始化逻辑：",

    step6Title: "步骤 6：铸造",
    step6Desc: "添加带有认证代币保护的仅管理员铸造：",

    step7Title: "步骤 7：销毁",
    step7Desc: "实现从传入转账中销毁代币：",

    step8Title: "步骤 8：查询方法",
    step8Desc: "添加代币元数据的只读方法：",

    step9Title: "步骤 9：完整合约",
    step9Desc: "以下是完整的代币合约：",

    buildTitle: "构建合约",
    buildDesc: "将您的代币编译为 WebAssembly：",

    deployTitle: "部署代币",
    deployDesc: "将您的代币部署到 regtest：",

    testingTitle: "测试代币",
    testingDesc: "使用以下命令测试您的代币：",

    advancedTitle: "高级功能",
    advancedDesc: "以下是您可以添加的一些增强功能：",
    advancedFeatures: [
      { name: "授权额度", desc: "实现 approve/transferFrom 用于委托转账" },
      { name: "可暂停", desc: "添加在紧急情况下暂停所有转账的能力" },
      { name: "可升级", desc: "使用代理模式实现可升级逻辑" },
      { name: "归属", desc: "实现时间锁定的代币释放" },
      { name: "快照", desc: "在特定区块高度追踪余额" },
    ],

    nextStepsTitle: "下一步",
    nextSteps: [
      { text: "构建 AMM", href: "/docs/tutorials/amm", desc: "创建流动性池" },
      { text: "存储模式", href: "/docs/contracts/storage", desc: "高级存储技术" },
      { text: "部署指南", href: "/docs/contracts/deployment", desc: "生产部署" },
    ],
  },
  ms: {
    title: "Bina Token",
    subtitle: "Panduan langkah demi langkah untuk mencipta token fungible di Alkanes",
    intro: "Dalam tutorial ini, anda akan membina kontrak token fungible lengkap dengan pencetakan, pembakaran, dan penjejakan bekalan. Kami akan meliputi corak penting yang digunakan dalam token pengeluaran seperti DIESEL dan FROST.",

    prerequisitesTitle: "Prasyarat",
    prerequisites: [
      "Rust dan sasaran wasm32-unknown-unknown telah dipasang",
      "Pemahaman asas tentang Rust",
      "alkanes-cli telah dipasang",
      "Persekitaran regtest tempatan sedang berjalan",
    ],

    overviewTitle: "Gambaran Keseluruhan Token",
    overviewDesc: "Token kami akan mempunyai ciri-ciri berikut:",
    features: [
      { name: "Inisialisasi", desc: "Sediakan token dengan nama, simbol, dan bekalan awal" },
      { name: "Cetak", desc: "Cipta token baharu (pentadbir sahaja)" },
      { name: "Bakar", desc: "Musnahkan token untuk mengurangkan bekalan" },
      { name: "Jumlah Bekalan", desc: "Tanya jumlah bekalan semasa" },
      { name: "Nama/Simbol", desc: "Kembalikan metadata token" },
    ],

    step1Title: "Langkah 1: Persediaan Projek",
    step1Desc: "Cipta projek Rust baharu untuk token anda:",

    step2Title: "Langkah 2: Cargo.toml",
    step2Desc: "Konfigurasikan kebergantungan anda:",

    step3Title: "Langkah 3: Struktur Token",
    step3Desc: "Tentukan struct token dan enum mesej anda:",

    step4Title: "Langkah 4: Pembantu Penyimpanan",
    step4Desc: "Tambah kaedah pembantu untuk akses penyimpanan:",

    step5Title: "Langkah 5: Inisialisasi",
    step5Desc: "Laksanakan logik inisialisasi:",

    step6Title: "Langkah 6: Pencetakan",
    step6Desc: "Tambah pencetakan khusus pentadbir dengan perlindungan token pengesahan:",

    step7Title: "Langkah 7: Pembakaran",
    step7Desc: "Laksanakan pembakaran token daripada pemindahan masuk:",

    step8Title: "Langkah 8: Kaedah Pertanyaan",
    step8Desc: "Tambah kaedah baca sahaja untuk metadata token:",

    step9Title: "Langkah 9: Kontrak Lengkap",
    step9Desc: "Berikut adalah kontrak token lengkap:",

    buildTitle: "Membina Kontrak",
    buildDesc: "Kompil token anda kepada WebAssembly:",

    deployTitle: "Menggunakan Token",
    deployDesc: "Gunakan token anda ke regtest:",

    testingTitle: "Menguji Token",
    testingDesc: "Uji token anda dengan arahan ini:",

    advancedTitle: "Ciri Lanjutan",
    advancedDesc: "Berikut adalah beberapa peningkatan yang boleh anda tambah:",
    advancedFeatures: [
      { name: "Elaun", desc: "Laksanakan approve/transferFrom untuk pemindahan yang diwakilkan" },
      { name: "Boleh Dijeda", desc: "Tambah keupayaan untuk menjeda semua pemindahan dalam kecemasan" },
      { name: "Boleh Dinaik Taraf", desc: "Gunakan corak proksi untuk logik yang boleh dinaik taraf" },
      { name: "Peletakan Hak", desc: "Laksanakan pelepasan token berkunci masa" },
      { name: "Tangkapan", desc: "Jejaki baki pada ketinggian blok tertentu" },
    ],

    nextStepsTitle: "Langkah Seterusnya",
    nextSteps: [
      { text: "Bina AMM", href: "/docs/tutorials/amm", desc: "Cipta kolam kecairan" },
      { text: "Corak Penyimpanan", href: "/docs/contracts/storage", desc: "Teknik penyimpanan lanjutan" },
      { text: "Panduan Penggunaan", href: "/docs/contracts/deployment", desc: "Penggunaan pengeluaran" },
    ],
  },
  vi: {
    title: "Xây dựng Token",
    subtitle: "Hướng dẫn từng bước tạo token fungible trên Alkanes",
    intro: "Trong hướng dẫn này, bạn sẽ xây dựng một hợp đồng token fungible hoàn chỉnh với tính năng đúc, đốt và theo dõi nguồn cung. Chúng tôi sẽ đề cập đến các mẫu thiết yếu được sử dụng trong các token sản xuất như DIESEL và FROST.",

    prerequisitesTitle: "Yêu cầu trước",
    prerequisites: [
      "Đã cài đặt Rust và target wasm32-unknown-unknown",
      "Hiểu biết cơ bản về Rust",
      "Đã cài đặt alkanes-cli",
      "Môi trường regtest cục bộ đang chạy",
    ],

    overviewTitle: "Tổng quan Token",
    overviewDesc: "Token của chúng ta sẽ có các tính năng sau:",
    features: [
      { name: "Khởi tạo", desc: "Thiết lập token với tên, ký hiệu và nguồn cung ban đầu" },
      { name: "Đúc", desc: "Tạo token mới (chỉ quản trị viên)" },
      { name: "Đốt", desc: "Hủy token để giảm nguồn cung" },
      { name: "Tổng nguồn cung", desc: "Truy vấn tổng nguồn cung hiện tại" },
      { name: "Tên/Ký hiệu", desc: "Trả về metadata token" },
    ],

    step1Title: "Bước 1: Thiết lập Dự án",
    step1Desc: "Tạo dự án Rust mới cho token của bạn:",

    step2Title: "Bước 2: Cargo.toml",
    step2Desc: "Cấu hình các phụ thuộc của bạn:",

    step3Title: "Bước 3: Cấu trúc Token",
    step3Desc: "Định nghĩa struct token và enum message của bạn:",

    step4Title: "Bước 4: Hàm hỗ trợ Lưu trữ",
    step4Desc: "Thêm các phương thức hỗ trợ để truy cập lưu trữ:",

    step5Title: "Bước 5: Khởi tạo",
    step5Desc: "Triển khai logic khởi tạo:",

    step6Title: "Bước 6: Đúc Token",
    step6Desc: "Thêm tính năng đúc chỉ dành cho quản trị viên với bảo vệ token xác thực:",

    step7Title: "Bước 7: Đốt Token",
    step7Desc: "Triển khai đốt token từ các giao dịch chuyển đến:",

    step8Title: "Bước 8: Phương thức Truy vấn",
    step8Desc: "Thêm các phương thức chỉ đọc cho metadata token:",

    step9Title: "Bước 9: Hợp đồng Hoàn chỉnh",
    step9Desc: "Đây là hợp đồng token hoàn chỉnh:",

    buildTitle: "Xây dựng Hợp đồng",
    buildDesc: "Biên dịch token của bạn thành WebAssembly:",

    deployTitle: "Triển khai Token",
    deployDesc: "Triển khai token của bạn lên regtest:",

    testingTitle: "Kiểm tra Token",
    testingDesc: "Kiểm tra token của bạn với các lệnh sau:",

    advancedTitle: "Tính năng Nâng cao",
    advancedDesc: "Dưới đây là một số cải tiến bạn có thể thêm:",
    advancedFeatures: [
      { name: "Phân bổ", desc: "Triển khai approve/transferFrom cho chuyển giao ủy quyền" },
      { name: "Có thể tạm dừng", desc: "Thêm khả năng tạm dừng tất cả chuyển giao trong trường hợp khẩn cấp" },
      { name: "Có thể nâng cấp", desc: "Sử dụng mẫu proxy cho logic có thể nâng cấp" },
      { name: "Phân bổ dần", desc: "Triển khai phát hành token bị khóa thời gian" },
      { name: "Ảnh chụp", desc: "Theo dõi số dư tại các độ cao khối cụ thể" },
    ],

    nextStepsTitle: "Bước tiếp theo",
    nextSteps: [
      { text: "Xây dựng AMM", href: "/docs/tutorials/amm", desc: "Tạo các pool thanh khoản" },
      { text: "Mẫu Lưu trữ", href: "/docs/contracts/storage", desc: "Kỹ thuật lưu trữ nâng cao" },
      { text: "Hướng dẫn Triển khai", href: "/docs/contracts/deployment", desc: "Triển khai sản xuất" },
    ],
  },
  ko: {
    title: "토큰 구축",
    subtitle: "Alkanes에서 대체 가능한 토큰을 생성하는 단계별 가이드",
    intro: "이 튜토리얼에서는 발행, 소각 및 공급량 추적 기능을 갖춘 완전한 대체 가능 토큰 계약을 구축합니다. DIESEL 및 FROST와 같은 프로덕션 토큰에서 사용되는 필수 패턴을 다룹니다.",

    prerequisitesTitle: "전제 조건",
    prerequisites: [
      "Rust 및 wasm32-unknown-unknown 타겟 설치",
      "Rust에 대한 기본 이해",
      "alkanes-cli 설치",
      "로컬 regtest 환경 실행 중",
    ],

    overviewTitle: "토큰 개요",
    overviewDesc: "우리의 토큰은 다음 기능을 갖습니다:",
    features: [
      { name: "초기화", desc: "이름, 심볼 및 초기 공급량으로 토큰 설정" },
      { name: "발행", desc: "새 토큰 생성(관리자 전용)" },
      { name: "소각", desc: "토큰을 파괴하여 공급량 감소" },
      { name: "총 공급량", desc: "현재 총 공급량 조회" },
      { name: "이름/심볼", desc: "토큰 메타데이터 반환" },
    ],

    step1Title: "1단계: 프로젝트 설정",
    step1Desc: "토큰을 위한 새 Rust 프로젝트 생성:",

    step2Title: "2단계: Cargo.toml",
    step2Desc: "의존성 구성:",

    step3Title: "3단계: 토큰 구조",
    step3Desc: "토큰 구조체와 메시지 enum 정의:",

    step4Title: "4단계: 스토리지 헬퍼",
    step4Desc: "스토리지 액세스를 위한 헬퍼 메서드 추가:",

    step5Title: "5단계: 초기화",
    step5Desc: "초기화 로직 구현:",

    step6Title: "6단계: 발행",
    step6Desc: "인증 토큰 보호 기능이 있는 관리자 전용 발행 추가:",

    step7Title: "7단계: 소각",
    step7Desc: "들어오는 전송에서 토큰 소각 구현:",

    step8Title: "8단계: 쿼리 메서드",
    step8Desc: "토큰 메타데이터를 위한 읽기 전용 메서드 추가:",

    step9Title: "9단계: 완전한 계약",
    step9Desc: "다음은 완전한 토큰 계약입니다:",

    buildTitle: "계약 빌드",
    buildDesc: "토큰을 WebAssembly로 컴파일:",

    deployTitle: "토큰 배포",
    deployDesc: "regtest에 토큰 배포:",

    testingTitle: "토큰 테스트",
    testingDesc: "다음 명령으로 토큰 테스트:",

    advancedTitle: "고급 기능",
    advancedDesc: "추가할 수 있는 몇 가지 개선 사항:",
    advancedFeatures: [
      { name: "허용량", desc: "위임된 전송을 위한 approve/transferFrom 구현" },
      { name: "일시 중지 가능", desc: "긴급 상황에서 모든 전송을 일시 중지하는 기능 추가" },
      { name: "업그레이드 가능", desc: "업그레이드 가능한 로직을 위한 프록시 패턴 사용" },
      { name: "베스팅", desc: "시간 잠금 토큰 릴리스 구현" },
      { name: "스냅샷", desc: "특정 블록 높이에서 잔액 추적" },
    ],

    nextStepsTitle: "다음 단계",
    nextSteps: [
      { text: "AMM 구축", href: "/docs/tutorials/amm", desc: "유동성 풀 생성" },
      { text: "스토리지 패턴", href: "/docs/contracts/storage", desc: "고급 스토리지 기술" },
      { text: "배포 가이드", href: "/docs/contracts/deployment", desc: "프로덕션 배포" },
    ],
  },
};

function CodeBlock({ children, title, language = "rust" }: { children: string; title?: string; language?: string }) {
  return (
    <div className="my-4">
      {title && <div className="text-xs text-[color:var(--sf-muted)] mb-1 font-mono">{title}</div>}
      <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm">
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <div className="mt-10" id={id}>
      <h2 className="text-2xl font-semibold mb-4 text-[color:var(--sf-text)]">{title}</h2>
      {children}
    </div>
  );
}

export default function TokenTutorialPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-sm text-[color:var(--sf-primary)] mb-4">{t.subtitle}</p>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      {/* Prerequisites */}
      <Section title={t.prerequisitesTitle} id="prerequisites">
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.prerequisites.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      {/* Overview */}
      <Section title={t.overviewTitle} id="overview">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.overviewDesc}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {t.features.map((f, i) => (
            <div key={i} className="p-3 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
              <span className="font-semibold text-[color:var(--sf-primary)]">{f.name}</span>
              <span className="text-[color:var(--sf-muted)] ml-2">- {f.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Step 1 */}
      <Section title={t.step1Title} id="step1">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.step1Desc}</p>
        <CodeBlock language="bash">{`# Create project directory
mkdir my-token && cd my-token

# Initialize Rust project
cargo init --lib

# Add WASM target
rustup target add wasm32-unknown-unknown`}</CodeBlock>
      </Section>

      {/* Step 2 */}
      <Section title={t.step2Title} id="step2">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.step2Desc}</p>
        <CodeBlock language="toml" title="Cargo.toml">{`[package]
name = "my-token"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
# Core Alkanes runtime
alkanes-runtime = { git = "https://github.com/kungfuflex/alkanes-rs" }
alkanes-support = { git = "https://github.com/kungfuflex/alkanes-rs" }
alkanes-macros = { git = "https://github.com/kungfuflex/alkanes-rs" }

# Storage utilities
metashrew-support = { git = "https://github.com/kungfuflex/alkanes-rs" }

# Factory support for MintableToken trait
alkanes-std-factory-support = { git = "https://github.com/kungfuflex/alkanes-rs" }

# Error handling
anyhow = "1.0"

[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"`}</CodeBlock>
      </Section>

      {/* Step 3 */}
      <Section title={t.step3Title} id="step3">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.step3Desc}</p>
        <CodeBlock title="src/lib.rs">{`use alkanes_runtime::{
    declare_alkane,
    message::MessageDispatch,
    runtime::AlkaneResponder,
    auth::AuthenticatedResponder,
    storage::StoragePointer,
};
use alkanes_std_factory_support::MintableToken;
use alkanes_support::{
    context::Context,
    id::AlkaneId,
    parcel::{AlkaneTransfer, AlkaneTransferParcel},
    response::CallResponse,
};
use anyhow::{anyhow, Result};
use metashrew_support::index_pointer::KeyValuePointer;
use std::sync::Arc;

/// Our token contract struct
#[derive(Default)]
pub struct MyToken(());

// Implement required traits
impl AlkaneResponder for MyToken {}
impl AuthenticatedResponder for MyToken {}
impl MintableToken for MyToken {}

/// Message dispatch enum - defines our contract's opcodes
#[derive(MessageDispatch)]
pub enum MyTokenMessage {
    /// Opcode 0: Initialize the token
    #[opcode(0)]
    Initialize {
        name: String,
        symbol: String,
        initial_supply: u128,
        auth_units: u128,
    },

    /// Opcode 77: Mint new tokens (admin only)
    #[opcode(77)]
    Mint { amount: u128 },

    /// Opcode 88: Burn tokens
    #[opcode(88)]
    Burn,

    /// Opcode 99: Get token name
    #[opcode(99)]
    #[returns(String)]
    GetName,

    /// Opcode 100: Get token symbol
    #[opcode(100)]
    #[returns(String)]
    GetSymbol,

    /// Opcode 101: Get total supply
    #[opcode(101)]
    #[returns(u128)]
    GetTotalSupply,
}`}</CodeBlock>
      </Section>

      {/* Step 4 */}
      <Section title={t.step4Title} id="step4">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.step4Desc}</p>
        <CodeBlock>{`impl MyToken {
    // ============================================
    // Storage Pointers
    // ============================================

    fn name_pointer(&self) -> StoragePointer {
        StoragePointer::from_keyword("/name")
    }

    fn symbol_pointer(&self) -> StoragePointer {
        StoragePointer::from_keyword("/symbol")
    }

    fn total_supply_pointer(&self) -> StoragePointer {
        StoragePointer::from_keyword("/totalsupply")
    }

    // ============================================
    // Storage Getters/Setters
    // ============================================

    fn get_name(&self) -> String {
        let bytes = self.name_pointer().get();
        String::from_utf8(bytes.as_ref().clone())
            .unwrap_or_else(|_| String::from("Unknown"))
    }

    fn set_name(&self, name: &str) {
        self.name_pointer().set(Arc::new(name.as_bytes().to_vec()));
    }

    fn get_symbol(&self) -> String {
        let bytes = self.symbol_pointer().get();
        String::from_utf8(bytes.as_ref().clone())
            .unwrap_or_else(|_| String::from("???"))
    }

    fn set_symbol(&self, symbol: &str) {
        self.symbol_pointer().set(Arc::new(symbol.as_bytes().to_vec()));
    }

    fn get_total_supply(&self) -> u128 {
        self.total_supply_pointer().get_value::<u128>()
    }

    fn set_total_supply(&self, supply: u128) {
        self.total_supply_pointer().set_value::<u128>(supply);
    }

    fn increase_supply(&self, amount: u128) -> Result<()> {
        let current = self.get_total_supply();
        let new_supply = current.checked_add(amount)
            .ok_or_else(|| anyhow!("supply overflow"))?;
        self.set_total_supply(new_supply);
        Ok(())
    }

    fn decrease_supply(&self, amount: u128) -> Result<()> {
        let current = self.get_total_supply();
        let new_supply = current.checked_sub(amount)
            .ok_or_else(|| anyhow!("supply underflow"))?;
        self.set_total_supply(new_supply);
        Ok(())
    }
}`}</CodeBlock>
      </Section>

      {/* Step 5 */}
      <Section title={t.step5Title} id="step5">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.step5Desc}</p>
        <CodeBlock>{`impl MyToken {
    fn initialize(
        &self,
        name: String,
        symbol: String,
        initial_supply: u128,
        auth_units: u128,
    ) -> Result<CallResponse> {
        // Prevent re-initialization
        self.observe_initialization()?;

        let context = self.context()?;

        // Set token metadata
        self.set_name(&name);
        self.set_symbol(&symbol);

        // Set initial supply
        self.set_total_supply(initial_supply);

        // Build response
        let mut response = CallResponse::forward(&context.incoming_alkanes);

        // Deploy auth token for admin access
        // Auth token holder can call mint()
        let auth_transfer = self.deploy_auth_token(auth_units)?;
        response.alkanes.0.push(auth_transfer);

        // Mint initial supply to deployer
        if initial_supply > 0 {
            response.alkanes.0.push(AlkaneTransfer {
                id: context.myself.clone(),
                value: initial_supply,
            });
        }

        Ok(response)
    }
}`}</CodeBlock>
      </Section>

      {/* Step 6 */}
      <Section title={t.step6Title} id="step6">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.step6Desc}</p>
        <CodeBlock>{`impl MyToken {
    fn mint(&self, amount: u128) -> Result<CallResponse> {
        // Verify caller has auth token
        // This will fail if auth token not in incoming_alkanes
        self.only_owner()?;

        let context = self.context()?;

        // Increase total supply
        self.increase_supply(amount)?;

        // Build response - return auth token + newly minted tokens
        let mut response = CallResponse::forward(&context.incoming_alkanes);
        response.alkanes.0.push(AlkaneTransfer {
            id: context.myself.clone(),
            value: amount,
        });

        Ok(response)
    }
}`}</CodeBlock>
      </Section>

      {/* Step 7 */}
      <Section title={t.step7Title} id="step7">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.step7Desc}</p>
        <CodeBlock>{`impl MyToken {
    fn burn(&self) -> Result<CallResponse> {
        let context = self.context()?;
        let myself = context.myself.clone();

        // Calculate how much of our token was sent
        let burn_amount: u128 = context.incoming_alkanes.0
            .iter()
            .filter(|t| t.id == myself)
            .map(|t| t.value)
            .sum();

        if burn_amount == 0 {
            return Err(anyhow!("no tokens to burn"));
        }

        // Decrease total supply
        self.decrease_supply(burn_amount)?;

        // Return any OTHER tokens (not our burned tokens)
        let mut response = CallResponse::default();
        for transfer in &context.incoming_alkanes.0 {
            if transfer.id != myself {
                response.alkanes.0.push(transfer.clone());
            }
        }

        Ok(response)
    }
}`}</CodeBlock>
      </Section>

      {/* Step 8 */}
      <Section title={t.step8Title} id="step8">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.step8Desc}</p>
        <CodeBlock>{`impl MyToken {
    fn get_name_call(&self) -> Result<CallResponse> {
        let context = self.context()?;
        let mut response = CallResponse::forward(&context.incoming_alkanes);

        // Set response data to token name bytes
        response.data = self.get_name().into_bytes();

        Ok(response)
    }

    fn get_symbol_call(&self) -> Result<CallResponse> {
        let context = self.context()?;
        let mut response = CallResponse::forward(&context.incoming_alkanes);

        // Set response data to token symbol bytes
        response.data = self.get_symbol().into_bytes();

        Ok(response)
    }

    fn get_total_supply_call(&self) -> Result<CallResponse> {
        let context = self.context()?;
        let mut response = CallResponse::forward(&context.incoming_alkanes);

        // Set response data to supply as little-endian bytes
        response.data = self.get_total_supply().to_le_bytes().to_vec();

        Ok(response)
    }
}`}</CodeBlock>
      </Section>

      {/* Step 9 - Complete Contract */}
      <Section title={t.step9Title} id="step9">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.step9Desc}</p>
        <CodeBlock title="src/lib.rs (complete)">{`use alkanes_runtime::{
    declare_alkane,
    message::MessageDispatch,
    runtime::AlkaneResponder,
    auth::AuthenticatedResponder,
    storage::StoragePointer,
};
use alkanes_std_factory_support::MintableToken;
use alkanes_support::{
    context::Context,
    id::AlkaneId,
    parcel::{AlkaneTransfer, AlkaneTransferParcel},
    response::CallResponse,
};
use anyhow::{anyhow, Result};
use metashrew_support::index_pointer::KeyValuePointer;
use std::sync::Arc;

#[derive(Default)]
pub struct MyToken(());

impl AlkaneResponder for MyToken {}
impl AuthenticatedResponder for MyToken {}
impl MintableToken for MyToken {}

#[derive(MessageDispatch)]
pub enum MyTokenMessage {
    #[opcode(0)]
    Initialize {
        name: String,
        symbol: String,
        initial_supply: u128,
        auth_units: u128,
    },

    #[opcode(77)]
    Mint { amount: u128 },

    #[opcode(88)]
    Burn,

    #[opcode(99)]
    #[returns(String)]
    GetName,

    #[opcode(100)]
    #[returns(String)]
    GetSymbol,

    #[opcode(101)]
    #[returns(u128)]
    GetTotalSupply,
}

impl MyToken {
    // Storage pointers
    fn name_pointer(&self) -> StoragePointer {
        StoragePointer::from_keyword("/name")
    }

    fn symbol_pointer(&self) -> StoragePointer {
        StoragePointer::from_keyword("/symbol")
    }

    fn total_supply_pointer(&self) -> StoragePointer {
        StoragePointer::from_keyword("/totalsupply")
    }

    // Getters/setters
    fn get_name(&self) -> String {
        let bytes = self.name_pointer().get();
        String::from_utf8(bytes.as_ref().clone())
            .unwrap_or_else(|_| String::from("Unknown"))
    }

    fn set_name(&self, name: &str) {
        self.name_pointer().set(Arc::new(name.as_bytes().to_vec()));
    }

    fn get_symbol(&self) -> String {
        let bytes = self.symbol_pointer().get();
        String::from_utf8(bytes.as_ref().clone())
            .unwrap_or_else(|_| String::from("???"))
    }

    fn set_symbol(&self, symbol: &str) {
        self.symbol_pointer().set(Arc::new(symbol.as_bytes().to_vec()));
    }

    fn get_total_supply(&self) -> u128 {
        self.total_supply_pointer().get_value::<u128>()
    }

    fn set_total_supply(&self, supply: u128) {
        self.total_supply_pointer().set_value::<u128>(supply);
    }

    fn increase_supply(&self, amount: u128) -> Result<()> {
        let current = self.get_total_supply();
        let new_supply = current.checked_add(amount)
            .ok_or_else(|| anyhow!("supply overflow"))?;
        self.set_total_supply(new_supply);
        Ok(())
    }

    fn decrease_supply(&self, amount: u128) -> Result<()> {
        let current = self.get_total_supply();
        let new_supply = current.checked_sub(amount)
            .ok_or_else(|| anyhow!("supply underflow"))?;
        self.set_total_supply(new_supply);
        Ok(())
    }

    // Opcode handlers
    fn initialize(
        &self,
        name: String,
        symbol: String,
        initial_supply: u128,
        auth_units: u128,
    ) -> Result<CallResponse> {
        self.observe_initialization()?;
        let context = self.context()?;

        self.set_name(&name);
        self.set_symbol(&symbol);
        self.set_total_supply(initial_supply);

        let mut response = CallResponse::forward(&context.incoming_alkanes);
        response.alkanes.0.push(self.deploy_auth_token(auth_units)?);

        if initial_supply > 0 {
            response.alkanes.0.push(AlkaneTransfer {
                id: context.myself.clone(),
                value: initial_supply,
            });
        }

        Ok(response)
    }

    fn mint(&self, amount: u128) -> Result<CallResponse> {
        self.only_owner()?;
        let context = self.context()?;

        self.increase_supply(amount)?;

        let mut response = CallResponse::forward(&context.incoming_alkanes);
        response.alkanes.0.push(AlkaneTransfer {
            id: context.myself.clone(),
            value: amount,
        });

        Ok(response)
    }

    fn burn(&self) -> Result<CallResponse> {
        let context = self.context()?;
        let myself = context.myself.clone();

        let burn_amount: u128 = context.incoming_alkanes.0
            .iter()
            .filter(|t| t.id == myself)
            .map(|t| t.value)
            .sum();

        if burn_amount == 0 {
            return Err(anyhow!("no tokens to burn"));
        }

        self.decrease_supply(burn_amount)?;

        let mut response = CallResponse::default();
        for transfer in &context.incoming_alkanes.0 {
            if transfer.id != myself {
                response.alkanes.0.push(transfer.clone());
            }
        }

        Ok(response)
    }

    fn get_name_call(&self) -> Result<CallResponse> {
        let context = self.context()?;
        let mut response = CallResponse::forward(&context.incoming_alkanes);
        response.data = self.get_name().into_bytes();
        Ok(response)
    }

    fn get_symbol_call(&self) -> Result<CallResponse> {
        let context = self.context()?;
        let mut response = CallResponse::forward(&context.incoming_alkanes);
        response.data = self.get_symbol().into_bytes();
        Ok(response)
    }

    fn get_total_supply_call(&self) -> Result<CallResponse> {
        let context = self.context()?;
        let mut response = CallResponse::forward(&context.incoming_alkanes);
        response.data = self.get_total_supply().to_le_bytes().to_vec();
        Ok(response)
    }
}

// Register the contract entry point
declare_alkane! {
    impl AlkaneResponder for MyToken {
        type Message = MyTokenMessage;
    }
}`}</CodeBlock>
      </Section>

      {/* Building */}
      <Section title={t.buildTitle} id="build">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.buildDesc}</p>
        <CodeBlock language="bash">{`# Build for WebAssembly
cargo build --release --target wasm32-unknown-unknown

# Check the output
ls -la target/wasm32-unknown-unknown/release/my_token.wasm

# Optional: Optimize with wasm-opt
wasm-opt -Oz target/wasm32-unknown-unknown/release/my_token.wasm \\
  -o my_token_optimized.wasm`}</CodeBlock>
      </Section>

      {/* Deploying */}
      <Section title={t.deployTitle} id="deploy">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.deployDesc}</p>
        <CodeBlock language="bash">{`# Deploy to [4, 1000] with initialization
# Args: opcode(0), name("MyToken"), symbol("MTK"), initial_supply, auth_units
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  alkanes execute "[3,1000,0]:v0:v0" \\
  --envelope ./target/wasm32-unknown-unknown/release/my_token.wasm \\
  --from p2tr:0 \\
  --fee-rate 1 \\
  --mine \\
  -y

# Wait for indexer
sleep 5

# Verify deployment
alkanes-cli -p regtest alkanes getbytecode "4:1000"`}</CodeBlock>
      </Section>

      {/* Testing */}
      <Section title={t.testingTitle} id="testing">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.testingDesc}</p>
        <CodeBlock language="bash">{`# Get token name (opcode 99)
alkanes-cli -p regtest alkanes simulate "4:1000:99"

# Get token symbol (opcode 100)
alkanes-cli -p regtest alkanes simulate "4:1000:100"

# Get total supply (opcode 101)
alkanes-cli -p regtest alkanes simulate "4:1000:101"

# Mint more tokens (requires auth token)
# Note: You'll need to include your auth token in --inputs
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  alkanes execute "[4,1000,77,1000000]:v0:v0" \\
  --inputs "2:n:1" \\
  --from p2tr:0 \\
  --fee-rate 1 \\
  --mine \\
  -y

# Burn tokens (send tokens to contract with opcode 88)
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  alkanes execute "[4,1000,88]:v0:v0" \\
  --inputs "4:1000:500000" \\
  --from p2tr:0 \\
  --fee-rate 1 \\
  --mine \\
  -y`}</CodeBlock>
      </Section>

      {/* Advanced */}
      <Section title={t.advancedTitle} id="advanced">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.advancedDesc}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {t.advancedFeatures.map((f, i) => (
            <div key={i} className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
              <h4 className="font-semibold text-[color:var(--sf-primary)] mb-1">{f.name}</h4>
              <p className="text-sm text-[color:var(--sf-muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Next Steps */}
      <Section title={t.nextStepsTitle} id="next-steps">
        <div className="grid gap-4 md:grid-cols-3">
          {t.nextSteps.map((step, i) => (
            <a
              key={i}
              href={step.href}
              className="p-4 rounded-lg border border-[color:var(--sf-outline)] hover:border-[color:var(--sf-primary)] transition-colors"
            >
              <h4 className="font-semibold text-[color:var(--sf-text)] mb-1">{step.text}</h4>
              <p className="text-sm text-[color:var(--sf-muted)]">{step.desc}</p>
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
