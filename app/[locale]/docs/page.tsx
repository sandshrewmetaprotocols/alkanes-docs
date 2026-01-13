"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const content = {
  en: {
    title: "Introduction to Alkanes",
    intro: "Alkanes is a metaprotocol built on top of Protorunes that brings smart contract functionality to Bitcoin. Unlike traditional Bitcoin scripts, Alkanes enables complex programmable logic while maintaining the security guarantees of the Bitcoin network.",
    whatTitle: "What are Alkanes?",
    whatContent: "Alkanes are WebAssembly (WASM) smart contracts that run on Bitcoin through the Protorunes protocol. They enable:",
    features: [
      "DeFi on Bitcoin - AMMs, lending, derivatives",
      "Token standards - Fungible and non-fungible tokens",
      "Governance - On-chain voting and DAOs",
      "Complex logic - Arbitrary computation anchored to Bitcoin"
    ],
    howTitle: "How it Works",
    howSteps: [
      "Write contracts in Rust - Use familiar tooling and the alkanes-std library",
      "Compile to WASM - Target wasm32-unknown-unknown",
      "Deploy to Bitcoin - Inscribe the WASM binary via Ordinals",
      "Interact via transactions - Call contract methods through Bitcoin transactions"
    ],
    conceptsTitle: "Key Concepts",
    protorunesTitle: "Protorunes",
    protorunesDesc: "Protorunes extend the Runes protocol with programmable functionality. Each Alkane is a special type of Protorune that contains executable WASM code.",
    dieselTitle: "DIESEL Token",
    dieselDesc: "DIESEL is the native governance token of the Alkanes ecosystem. It's used for voting on protocol upgrades, paying for gas (execution costs), and staking.",
    metashrewTitle: "Metashrew Indexer",
    metashrewDesc: "Metashrew is the indexing infrastructure that processes Bitcoin blocks and maintains Alkane state. It enables fast queries and real-time updates.",
    gettingStartedTitle: "Getting Started",
    quickStartTitle: "Quick Start →",
    quickStartDesc: "Build and deploy your first Alkane in under 10 minutes",
    cliTitle: "CLI Reference →",
    cliDesc: "Complete guide to the alkanes-cli tool",
    architectureTitle: "Architecture Overview",
    resourcesTitle: "Resources",
    resources: [
      { text: "GitHub Repository", href: "https://github.com/kungfuflex/alkanes-rs/tree/develop", desc: "Source code and examples" },
      { text: "Subfrost API", href: "https://mainnet.sandshrew.io", desc: "Hosted indexer infrastructure" },
      { text: "DIESEL Governance", href: "/governance", desc: "Participate in protocol governance" }
    ]
  },
  zh: {
    title: "Alkanes 简介",
    intro: "Alkanes 是基于 Protorunes 构建的元协议，为比特币带来智能合约功能。与传统的比特币脚本不同，Alkanes 能够实现复杂的可编程逻辑，同时保持比特币网络的安全保障。",
    whatTitle: "什么是 Alkanes？",
    whatContent: "Alkanes 是通过 Protorunes 协议在比特币上运行的 WebAssembly (WASM) 智能合约。它们支持：",
    features: [
      "比特币 DeFi - AMM、借贷、衍生品",
      "代币标准 - 同质化和非同质化代币",
      "治理 - 链上投票和 DAO",
      "复杂逻辑 - 锚定于比特币的任意计算"
    ],
    howTitle: "工作原理",
    howSteps: [
      "使用 Rust 编写合约 - 使用熟悉的工具和 alkanes-std 库",
      "编译为 WASM - 目标平台 wasm32-unknown-unknown",
      "部署到比特币 - 通过 Ordinals 铭刻 WASM 二进制文件",
      "通过交易交互 - 通过比特币交易调用合约方法"
    ],
    conceptsTitle: "核心概念",
    protorunesTitle: "Protorunes",
    protorunesDesc: "Protorunes 扩展了 Runes 协议，增加了可编程功能。每个 Alkane 都是一种特殊的 Protorune，包含可执行的 WASM 代码。",
    dieselTitle: "DIESEL 代币",
    dieselDesc: "DIESEL 是 Alkanes 生态系统的原生治理代币。用于协议升级投票、支付 Gas（执行成本）和质押。",
    metashrewTitle: "Metashrew 索引器",
    metashrewDesc: "Metashrew 是处理比特币区块并维护 Alkane 状态的索引基础设施。它支持快速查询和实时更新。",
    gettingStartedTitle: "快速开始",
    quickStartTitle: "快速入门 →",
    quickStartDesc: "10 分钟内构建并部署您的第一个 Alkane",
    cliTitle: "CLI 参考 →",
    cliDesc: "alkanes-cli 工具完整指南",
    architectureTitle: "架构概览",
    resourcesTitle: "资源",
    resources: [
      { text: "GitHub 代码库", href: "https://github.com/kungfuflex/alkanes-rs/tree/develop", desc: "源代码和示例" },
      { text: "Subfrost API", href: "https://mainnet.sandshrew.io", desc: "托管索引器基础设施" },
      { text: "DIESEL 治理", href: "/governance", desc: "参与协议治理" }
    ]
  },
  ms: {
    title: "Pengenalan kepada Alkanes",
    intro: "Alkanes adalah metaprotokol yang dibina di atas Protorunes yang membawa fungsi kontrak pintar ke Bitcoin. Tidak seperti skrip Bitcoin tradisional, Alkanes membolehkan logik boleh atur cara yang kompleks sambil mengekalkan jaminan keselamatan rangkaian Bitcoin.",
    whatTitle: "Apa itu Alkanes?",
    whatContent: "Alkanes adalah kontrak pintar WebAssembly (WASM) yang berjalan di Bitcoin melalui protokol Protorunes. Mereka membolehkan:",
    features: [
      "DeFi di Bitcoin - AMM, pinjaman, derivatif",
      "Piawaian token - Token boleh dan tidak boleh kulat",
      "Tadbir urus - Pengundian dalam rantaian dan DAO",
      "Logik kompleks - Pengiraan sewenang-wenangnya berlabuh ke Bitcoin"
    ],
    howTitle: "Cara Ia Berfungsi",
    howSteps: [
      "Tulis kontrak dalam Rust - Gunakan tooling biasa dan perpustakaan alkanes-std",
      "Kompilasi ke WASM - Sasarkan wasm32-unknown-unknown",
      "Lebarkan ke Bitcoin - Inskripkan binari WASM melalui Ordinals",
      "Berinteraksi melalui transaksi - Panggil kaedah kontrak melalui transaksi Bitcoin"
    ],
    conceptsTitle: "Konsep Utama",
    protorunesTitle: "Protorunes",
    protorunesDesc: "Protorunes memperluaskan protokol Runes dengan fungsi boleh atur cara. Setiap Alkane adalah jenis Protorune khas yang mengandungi kod WASM boleh laksana.",
    dieselTitle: "Token DIESEL",
    dieselDesc: "DIESEL adalah token tadbir urus asli ekosistem Alkanes. Ia digunakan untuk mengundi peningkatan protokol, membayar gas (kos pelaksanaan), dan staking.",
    metashrewTitle: "Pengindeks Metashrew",
    metashrewDesc: "Metashrew adalah infrastruktur pengindeksan yang memproses blok Bitcoin dan mengekalkan keadaan Alkane. Ia membolehkan pertanyaan pantas dan kemas kini masa nyata.",
    gettingStartedTitle: "Bermula",
    quickStartTitle: "Mula Pantas →",
    quickStartDesc: "Bina dan lebarkan Alkane pertama anda dalam masa kurang dari 10 minit",
    cliTitle: "Rujukan CLI →",
    cliDesc: "Panduan lengkap untuk alat alkanes-cli",
    architectureTitle: "Gambaran Keseluruhan Seni Bina",
    resourcesTitle: "Sumber",
    resources: [
      { text: "Repositori GitHub", href: "https://github.com/kungfuflex/alkanes-rs/tree/develop", desc: "Kod sumber dan contoh" },
      { text: "API Subfrost", href: "https://mainnet.sandshrew.io", desc: "Infrastruktur pengindeks yang dihoskan" },
      { text: "Tadbir Urus DIESEL", href: "/governance", desc: "Sertai tadbir urus protokol" }
    ]
  },
  vi: {
    title: "Giới thiệu về Alkanes",
    intro: "Alkanes là một metaprotocol được xây dựng trên Protorunes mang chức năng hợp đồng thông minh đến Bitcoin. Không giống như các script Bitcoin truyền thống, Alkanes cho phép logic lập trình phức tạp trong khi vẫn duy trì các đảm bảo bảo mật của mạng Bitcoin.",
    whatTitle: "Alkanes là gì?",
    whatContent: "Alkanes là các hợp đồng thông minh WebAssembly (WASM) chạy trên Bitcoin thông qua giao thức Protorunes. Chúng cho phép:",
    features: [
      "DeFi trên Bitcoin - AMM, cho vay, phái sinh",
      "Tiêu chuẩn token - Token có thể thay thế và không thể thay thế",
      "Quản trị - Bỏ phiếu trên chuỗi và DAO",
      "Logic phức tạp - Tính toán tùy ý được neo vào Bitcoin"
    ],
    howTitle: "Cách Hoạt Động",
    howSteps: [
      "Viết hợp đồng bằng Rust - Sử dụng công cụ quen thuộc và thư viện alkanes-std",
      "Biên dịch sang WASM - Nhắm mục tiêu wasm32-unknown-unknown",
      "Triển khai lên Bitcoin - Khắc file nhị phân WASM qua Ordinals",
      "Tương tác qua giao dịch - Gọi các phương thức hợp đồng thông qua giao dịch Bitcoin"
    ],
    conceptsTitle: "Khái Niệm Chính",
    protorunesTitle: "Protorunes",
    protorunesDesc: "Protorunes mở rộng giao thức Runes với chức năng có thể lập trình. Mỗi Alkane là một loại Protorune đặc biệt chứa mã WASM có thể thực thi.",
    dieselTitle: "Token DIESEL",
    dieselDesc: "DIESEL là token quản trị gốc của hệ sinh thái Alkanes. Nó được sử dụng để bỏ phiếu nâng cấp giao thức, trả phí gas (chi phí thực thi) và staking.",
    metashrewTitle: "Trình Lập Chỉ Mục Metashrew",
    metashrewDesc: "Metashrew là cơ sở hạ tầng lập chỉ mục xử lý các khối Bitcoin và duy trì trạng thái Alkane. Nó cho phép truy vấn nhanh và cập nhật thời gian thực.",
    gettingStartedTitle: "Bắt Đầu",
    quickStartTitle: "Khởi Động Nhanh →",
    quickStartDesc: "Xây dựng và triển khai Alkane đầu tiên của bạn trong vòng chưa đầy 10 phút",
    cliTitle: "Tài Liệu CLI →",
    cliDesc: "Hướng dẫn đầy đủ về công cụ alkanes-cli",
    architectureTitle: "Tổng Quan Kiến Trúc",
    resourcesTitle: "Tài Nguyên",
    resources: [
      { text: "Kho GitHub", href: "https://github.com/kungfuflex/alkanes-rs/tree/develop", desc: "Mã nguồn và ví dụ" },
      { text: "API Subfrost", href: "https://mainnet.sandshrew.io", desc: "Cơ sở hạ tầng indexer được lưu trữ" },
      { text: "Quản Trị DIESEL", href: "/governance", desc: "Tham gia quản trị giao thức" }
    ]
  },
  ko: {
    title: "Alkanes 소개",
    intro: "Alkanes는 Protorunes 위에 구축된 메타프로토콜로 Bitcoin에 스마트 계약 기능을 제공합니다. 기존 Bitcoin 스크립트와 달리 Alkanes는 Bitcoin 네트워크의 보안 보장을 유지하면서 복잡한 프로그래밍 가능한 로직을 가능하게 합니다.",
    whatTitle: "Alkanes란 무엇인가요?",
    whatContent: "Alkanes는 Protorunes 프로토콜을 통해 Bitcoin에서 실행되는 WebAssembly(WASM) 스마트 계약입니다. 다음을 지원합니다:",
    features: [
      "Bitcoin의 DeFi - AMM, 대출, 파생상품",
      "토큰 표준 - 대체 가능 및 대체 불가능 토큰",
      "거버넌스 - 온체인 투표 및 DAO",
      "복잡한 로직 - Bitcoin에 고정된 임의 연산"
    ],
    howTitle: "작동 방식",
    howSteps: [
      "Rust로 계약 작성 - 익숙한 도구와 alkanes-std 라이브러리 사용",
      "WASM으로 컴파일 - wasm32-unknown-unknown 타겟",
      "Bitcoin에 배포 - Ordinals를 통해 WASM 바이너리 인스크립션",
      "트랜잭션을 통한 상호작용 - Bitcoin 트랜잭션을 통해 계약 메서드 호출"
    ],
    conceptsTitle: "핵심 개념",
    protorunesTitle: "Protorunes",
    protorunesDesc: "Protorunes는 프로그래밍 가능한 기능으로 Runes 프로토콜을 확장합니다. 각 Alkane은 실행 가능한 WASM 코드를 포함하는 특별한 유형의 Protorune입니다.",
    dieselTitle: "DIESEL 토큰",
    dieselDesc: "DIESEL은 Alkanes 생태계의 네이티브 거버넌스 토큰입니다. 프로토콜 업그레이드 투표, 가스(실행 비용) 지불 및 스테이킹에 사용됩니다.",
    metashrewTitle: "Metashrew 인덱서",
    metashrewDesc: "Metashrew는 Bitcoin 블록을 처리하고 Alkane 상태를 유지하는 인덱싱 인프라입니다. 빠른 쿼리와 실시간 업데이트를 가능하게 합니다.",
    gettingStartedTitle: "시작하기",
    quickStartTitle: "빠른 시작 →",
    quickStartDesc: "10분 이내에 첫 번째 Alkane을 구축하고 배포하세요",
    cliTitle: "CLI 참조 →",
    cliDesc: "alkanes-cli 도구 완전 가이드",
    architectureTitle: "아키텍처 개요",
    resourcesTitle: "리소스",
    resources: [
      { text: "GitHub 저장소", href: "https://github.com/kungfuflex/alkanes-rs/tree/develop", desc: "소스 코드 및 예제" },
      { text: "Subfrost API", href: "https://mainnet.sandshrew.io", desc: "호스팅된 인덱서 인프라" },
      { text: "DIESEL 거버넌스", href: "/governance", desc: "프로토콜 거버넌스 참여" }
    ]
  }
};

export default function DocsIntroPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.whatTitle}</h2>
        <p className="mb-4">{t.whatContent}</p>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.features.map((feature, i) => (
            <li key={i}><strong>{feature.split(" - ")[0]}</strong> - {feature.split(" - ")[1]}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.howTitle}</h2>
        <ol className="list-decimal list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.howSteps.map((step, i) => (
            <li key={i}><strong>{step.split(" - ")[0]}</strong> - {step.split(" - ")[1]}</li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.conceptsTitle}</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium mb-2">{t.protorunesTitle}</h3>
            <p className="text-[color:var(--sf-muted)]">{t.protorunesDesc}</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">{t.dieselTitle}</h3>
            <p className="text-[color:var(--sf-muted)]">{t.dieselDesc}</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">{t.metashrewTitle}</h3>
            <p className="text-[color:var(--sf-muted)]">{t.metashrewDesc}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.gettingStartedTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/docs/quickstart" className="block p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] hover:border-[color:var(--sf-primary)] transition-colors">
            <h3 className="font-semibold mb-2">{t.quickStartTitle}</h3>
            <p className="text-sm text-[color:var(--sf-muted)]">{t.quickStartDesc}</p>
          </Link>
          <Link href="/docs/cli" className="block p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] hover:border-[color:var(--sf-primary)] transition-colors">
            <h3 className="font-semibold mb-2">{t.cliTitle}</h3>
            <p className="text-sm text-[color:var(--sf-muted)]">{t.cliDesc}</p>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.architectureTitle}</h2>
        <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm">
{`┌─────────────────────────────────────────────────────────┐
│                    Your Application                      │
├─────────────────────────────────────────────────────────┤
│                    Subfrost API                          │
│              (REST / JSON-RPC / GraphQL)                │
├─────────────────────────────────────────────────────────┤
│                   Metashrew Indexer                      │
│              (WASM-based block processing)              │
├─────────────────────────────────────────────────────────┤
│                    Bitcoin Network                       │
│              (Transactions & Block Data)                │
└─────────────────────────────────────────────────────────┘`}
        </pre>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.resourcesTitle}</h2>
        <ul className="space-y-2">
          {t.resources.map((resource, i) => (
            <li key={i}>
              <a
                href={resource.href}
                target={resource.href.startsWith("http") ? "_blank" : undefined}
                rel={resource.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-[color:var(--sf-primary)] hover:underline"
              >
                {resource.text}
              </a>
              {" - "}{resource.desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
