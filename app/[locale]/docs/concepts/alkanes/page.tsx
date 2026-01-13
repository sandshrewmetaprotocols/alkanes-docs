"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Alkanes Contracts",
    intro: "Alkanes contracts are smart contracts that run on Bitcoin, enabling programmable functionality similar to what Ethereum smart contracts provide. They allow developers to create decentralized applications (dApps) directly on Bitcoin's L1 blockchain, without requiring additional layers or sidechains.",
    featuresTitle: "Key Features",
    features: [
      { title: "Native Bitcoin Integration", desc: "Contracts interact directly with Bitcoin transactions and UTXOs" },
      { title: "State Management", desc: "Maintain contract state between interactions" },
      { title: "Composability", desc: "Contracts can interact with each other" },
      { title: "WASM Runtime", desc: "Written in Rust, compiled to WebAssembly" }
    ],
    structureTitle: "Contract Structure",
    structureIntro: "An Alkanes contract typically consists of:",
    structure: [
      "State Storage - Key-value storage for maintaining contract data",
      "Opcodes - Numbered functions that define contract actions",
      "Response Handling - Logic for returning data and managing assets",
      "Asset Management - Capabilities for handling Bitcoin and Alkanes tokens"
    ],
    tokensTitle: "Alkanes Tokens",
    tokensIntro: "Alkanes token contracts are a standardized implementation pattern that represent fungible tokens - digital assets where each unit is identical and interchangeable.",
    tokensContent: "At their core, Alkanes token contracts maintain a mapping of addresses to a balance sheet, tracking token ownership through key-value state storage. The critical operations are transfers (moving tokens between addresses) and approvals (allowing another address to transfer tokens on your behalf).",
    tokenFeaturesTitle: "Token Features",
    tokenFeatures: [
      "Minting and burning capabilities (often with access controls)",
      "Token metadata (name, symbol, decimals)",
      "Transfer hooks for additional logic",
      "Supply caps or other monetary policy",
      "Snapshot functionality for governance"
    ],
    factoryTitle: "Factory Contracts",
    factoryIntro: "Alkanes factory contracts are a design pattern that enables programmatic cloning of a base contract. For example, you may want to deploy a single factory contract that defines the logic for token minting and distribution and then use clones of that contract to create individual tokens that inherit that logic.",
    factoryContent: "A factory contract uses Alkanes's FACTORYRESERVED opcode to deploy new contract instances, typically taking parameters like token name, symbol, total supply, and mint parameters.",
    factoryUseCasesTitle: "Factory Use Cases",
    factoryUseCases: [
      "Deploy pairs of tokens for AMMs",
      "Create wrapped asset tokens",
      "Mint governance tokens for new projects",
      "Standardized, gas-efficient token deployment"
    ],
    exampleTitle: "Example Contract",
    nextStepsTitle: "Next Steps",
    nextSteps: [
      { text: "Quick Start guide", href: "/docs/quickstart", desc: "Deploy your first contract" },
      { text: "CLI commands", href: "/docs/cli", desc: "Deployment and interaction" },
      { text: "API", href: "/docs/api", desc: "Programmatic access" }
    ]
  },
  zh: {
    title: "Alkanes 合约",
    intro: "Alkanes 合约是在比特币上运行的智能合约，提供类似于以太坊智能合约的可编程功能。它们允许开发者直接在比特币 L1 区块链上创建去中心化应用（dApps），无需额外的层或侧链。",
    featuresTitle: "核心特性",
    features: [
      { title: "原生比特币集成", desc: "合约直接与比特币交易和 UTXO 交互" },
      { title: "状态管理", desc: "在交互之间维护合约状态" },
      { title: "可组合性", desc: "合约可以相互交互" },
      { title: "WASM 运行时", desc: "使用 Rust 编写，编译为 WebAssembly" }
    ],
    structureTitle: "合约结构",
    structureIntro: "Alkanes 合约通常包含：",
    structure: [
      "状态存储 - 用于维护合约数据的键值存储",
      "操作码 - 定义合约操作的编号函数",
      "响应处理 - 返回数据和管理资产的逻辑",
      "资产管理 - 处理比特币和 Alkanes 代币的能力"
    ],
    tokensTitle: "Alkanes 代币",
    tokensIntro: "Alkanes 代币合约是一种标准化的实现模式，代表同质化代币——每个单位都相同且可互换的数字资产。",
    tokensContent: "其核心是，Alkanes 代币合约维护地址到余额表的映射，通过键值状态存储跟踪代币所有权。关键操作是转账（在地址之间转移代币）和授权（允许另一个地址代表您转移代币）。",
    tokenFeaturesTitle: "代币特性",
    tokenFeatures: [
      "铸造和销毁功能（通常带有访问控制）",
      "代币元数据（名称、符号、小数位）",
      "转账钩子用于额外逻辑",
      "供应上限或其他货币政策",
      "用于治理的快照功能"
    ],
    factoryTitle: "工厂合约",
    factoryIntro: "Alkanes 工厂合约是一种设计模式，可以程序化地克隆基础合约。例如，您可能想部署一个定义代币铸造和分发逻辑的工厂合约，然后使用该合约的克隆来创建继承该逻辑的单独代币。",
    factoryContent: "工厂合约使用 Alkanes 的 FACTORYRESERVED 操作码部署新的合约实例，通常接受代币名称、符号、总供应量和铸造参数等参数。",
    factoryUseCasesTitle: "工厂用例",
    factoryUseCases: [
      "为 AMM 部署代币对",
      "创建封装资产代币",
      "为新项目铸造治理代币",
      "标准化、高效的代币部署"
    ],
    exampleTitle: "示例合约",
    nextStepsTitle: "后续步骤",
    nextSteps: [
      { text: "快速入门指南", href: "/docs/quickstart", desc: "部署您的第一个合约" },
      { text: "CLI 命令", href: "/docs/cli", desc: "部署和交互" },
      { text: "API", href: "/docs/api", desc: "程序化访问" }
    ]
  },
  ms: {
    title: "Kontrak Alkanes",
    intro: "Kontrak Alkanes adalah kontrak pintar yang berjalan di Bitcoin, membolehkan fungsi boleh atur cara yang serupa dengan kontrak pintar Ethereum. Mereka membenarkan pembangun mencipta aplikasi terdesentralisasi (dApps) secara langsung di blockchain L1 Bitcoin, tanpa memerlukan lapisan tambahan atau sidechain.",
    featuresTitle: "Ciri-ciri Utama",
    features: [
      { title: "Integrasi Bitcoin Asli", desc: "Kontrak berinteraksi secara langsung dengan transaksi Bitcoin dan UTXO" },
      { title: "Pengurusan Keadaan", desc: "Mengekalkan keadaan kontrak antara interaksi" },
      { title: "Kebolehkomponan", desc: "Kontrak boleh berinteraksi antara satu sama lain" },
      { title: "Runtime WASM", desc: "Ditulis dalam Rust, dikompilasi kepada WebAssembly" }
    ],
    structureTitle: "Struktur Kontrak",
    structureIntro: "Kontrak Alkanes biasanya terdiri daripada:",
    structure: [
      "Penyimpanan Keadaan - Penyimpanan nilai-kunci untuk mengekalkan data kontrak",
      "Opcode - Fungsi bernombor yang menentukan tindakan kontrak",
      "Pengendalian Respons - Logik untuk mengembalikan data dan mengurus aset",
      "Pengurusan Aset - Keupayaan untuk mengendalikan Bitcoin dan token Alkanes"
    ],
    tokensTitle: "Token Alkanes",
    tokensIntro: "Kontrak token Alkanes adalah corak pelaksanaan piawai yang mewakili token boleh kulat - aset digital di mana setiap unit adalah sama dan boleh ditukar ganti.",
    tokensContent: "Pada terasnya, kontrak token Alkanes mengekalkan pemetaan alamat kepada lembaran imbangan, menjejaki pemilikan token melalui penyimpanan keadaan nilai-kunci. Operasi kritikal adalah pemindahan (memindahkan token antara alamat) dan kelulusan (membenarkan alamat lain memindahkan token bagi pihak anda).",
    tokenFeaturesTitle: "Ciri-ciri Token",
    tokenFeatures: [
      "Keupayaan mencetak dan membakar (sering dengan kawalan akses)",
      "Metadata token (nama, simbol, perpuluhan)",
      "Hook pemindahan untuk logik tambahan",
      "Had bekalan atau dasar monetari lain",
      "Fungsi snapshot untuk tadbir urus"
    ],
    factoryTitle: "Kontrak Kilang",
    factoryIntro: "Kontrak kilang Alkanes adalah corak reka bentuk yang membolehkan pengklonan programatik kontrak asas. Sebagai contoh, anda mungkin mahu melebarkan kontrak kilang tunggal yang menentukan logik untuk pencetakan dan pengedaran token dan kemudian menggunakan klon kontrak tersebut untuk mencipta token individu yang mewarisi logik tersebut.",
    factoryContent: "Kontrak kilang menggunakan opcode FACTORYRESERVED Alkanes untuk melebarkan instance kontrak baharu, biasanya mengambil parameter seperti nama token, simbol, jumlah bekalan, dan parameter pencetakan.",
    factoryUseCasesTitle: "Kes Penggunaan Kilang",
    factoryUseCases: [
      "Lebarkan pasangan token untuk AMM",
      "Cipta token aset terbungkus",
      "Cetak token tadbir urus untuk projek baharu",
      "Pelebaran token piawai dan cekap gas"
    ],
    exampleTitle: "Contoh Kontrak",
    nextStepsTitle: "Langkah Seterusnya",
    nextSteps: [
      { text: "Panduan Mula Pantas", href: "/docs/quickstart", desc: "Lebarkan kontrak pertama anda" },
      { text: "Arahan CLI", href: "/docs/cli", desc: "Pelebaran dan interaksi" },
      { text: "API", href: "/docs/api", desc: "Akses programatik" }
    ]
  },
  vi: {
    title: "Hợp Đồng Alkanes",
    intro: "Hợp đồng Alkanes là các hợp đồng thông minh chạy trên Bitcoin, cho phép chức năng có thể lập trình tương tự như hợp đồng thông minh Ethereum. Chúng cho phép các nhà phát triển tạo ứng dụng phi tập trung (dApps) trực tiếp trên blockchain L1 Bitcoin, mà không cần các lớp bổ sung hoặc sidechain.",
    featuresTitle: "Tính Năng Chính",
    features: [
      { title: "Tích Hợp Bitcoin Gốc", desc: "Hợp đồng tương tác trực tiếp với giao dịch Bitcoin và UTXO" },
      { title: "Quản Lý Trạng Thái", desc: "Duy trì trạng thái hợp đồng giữa các tương tác" },
      { title: "Khả Năng Kết Hợp", desc: "Hợp đồng có thể tương tác với nhau" },
      { title: "Runtime WASM", desc: "Được viết bằng Rust, biên dịch sang WebAssembly" }
    ],
    structureTitle: "Cấu Trúc Hợp Đồng",
    structureIntro: "Hợp đồng Alkanes thường bao gồm:",
    structure: [
      "Lưu Trữ Trạng Thái - Lưu trữ key-value để duy trì dữ liệu hợp đồng",
      "Opcode - Các hàm được đánh số xác định hành động hợp đồng",
      "Xử Lý Phản Hồi - Logic để trả về dữ liệu và quản lý tài sản",
      "Quản Lý Tài Sản - Khả năng xử lý Bitcoin và token Alkanes"
    ],
    tokensTitle: "Token Alkanes",
    tokensIntro: "Hợp đồng token Alkanes là mô hình triển khai tiêu chuẩn đại diện cho token có thể thay thế - tài sản kỹ thuật số mà mỗi đơn vị giống hệt nhau và có thể hoán đổi cho nhau.",
    tokensContent: "Về cốt lõi, hợp đồng token Alkanes duy trì ánh xạ địa chỉ tới bảng cân đối, theo dõi quyền sở hữu token thông qua lưu trữ trạng thái key-value. Các hoạt động quan trọng là chuyển (di chuyển token giữa các địa chỉ) và phê duyệt (cho phép địa chỉ khác chuyển token thay mặt bạn).",
    tokenFeaturesTitle: "Tính Năng Token",
    tokenFeatures: [
      "Khả năng đúc và đốt (thường có kiểm soát truy cập)",
      "Metadata token (tên, ký hiệu, số thập phân)",
      "Hook chuyển cho logic bổ sung",
      "Giới hạn cung cấp hoặc chính sách tiền tệ khác",
      "Chức năng snapshot cho quản trị"
    ],
    factoryTitle: "Hợp Đồng Factory",
    factoryIntro: "Hợp đồng factory Alkanes là một mô hình thiết kế cho phép sao chép có lập trình hợp đồng cơ sở. Ví dụ, bạn có thể muốn triển khai một hợp đồng factory duy nhất xác định logic cho việc đúc và phân phối token, sau đó sử dụng các bản sao của hợp đồng đó để tạo các token riêng lẻ kế thừa logic đó.",
    factoryContent: "Hợp đồng factory sử dụng opcode FACTORYRESERVED của Alkanes để triển khai các instance hợp đồng mới, thường nhận các tham số như tên token, ký hiệu, tổng cung cấp và các tham số đúc.",
    factoryUseCasesTitle: "Trường Hợp Sử Dụng Factory",
    factoryUseCases: [
      "Triển khai các cặp token cho AMM",
      "Tạo token tài sản được bao bọc",
      "Đúc token quản trị cho các dự án mới",
      "Triển khai token tiêu chuẩn, hiệu quả gas"
    ],
    exampleTitle: "Hợp Đồng Ví Dụ",
    nextStepsTitle: "Các Bước Tiếp Theo",
    nextSteps: [
      { text: "Hướng dẫn Khởi Động Nhanh", href: "/docs/quickstart", desc: "Triển khai hợp đồng đầu tiên của bạn" },
      { text: "Lệnh CLI", href: "/docs/cli", desc: "Triển khai và tương tác" },
      { text: "API", href: "/docs/api", desc: "Truy cập có lập trình" }
    ]
  },
  ko: {
    title: "Alkanes 계약",
    intro: "Alkanes 계약은 Bitcoin에서 실행되는 스마트 계약으로, Ethereum 스마트 계약과 유사한 프로그래밍 가능한 기능을 제공합니다. 추가 레이어나 사이드체인 없이 Bitcoin L1 블록체인에서 직접 탈중앙화 애플리케이션(dApps)을 생성할 수 있습니다.",
    featuresTitle: "핵심 기능",
    features: [
      { title: "네이티브 Bitcoin 통합", desc: "계약은 Bitcoin 트랜잭션 및 UTXO와 직접 상호작용" },
      { title: "상태 관리", desc: "상호작용 간 계약 상태 유지" },
      { title: "구성 가능성", desc: "계약은 서로 상호작용 가능" },
      { title: "WASM 런타임", desc: "Rust로 작성, WebAssembly로 컴파일" }
    ],
    structureTitle: "계약 구조",
    structureIntro: "Alkanes 계약은 일반적으로 다음으로 구성됩니다:",
    structure: [
      "상태 스토리지 - 계약 데이터 유지를 위한 키-값 스토리지",
      "Opcode - 계약 작업을 정의하는 번호가 매겨진 함수",
      "응답 처리 - 데이터 반환 및 자산 관리 로직",
      "자산 관리 - Bitcoin 및 Alkanes 토큰 처리 기능"
    ],
    tokensTitle: "Alkanes 토큰",
    tokensIntro: "Alkanes 토큰 계약은 대체 가능한 토큰을 나타내는 표준화된 구현 패턴입니다 - 각 단위가 동일하고 상호 교환 가능한 디지털 자산입니다.",
    tokensContent: "핵심적으로 Alkanes 토큰 계약은 키-값 상태 스토리지를 통해 토큰 소유권을 추적하며, 주소에서 잔액 시트로의 매핑을 유지합니다. 중요한 작업은 전송(주소 간 토큰 이동)과 승인(다른 주소가 귀하를 대신하여 토큰을 전송할 수 있도록 허용)입니다.",
    tokenFeaturesTitle: "토큰 기능",
    tokenFeatures: [
      "발행 및 소각 기능 (종종 접근 제어 포함)",
      "토큰 메타데이터 (이름, 기호, 소수점)",
      "추가 로직을 위한 전송 후크",
      "공급 한도 또는 기타 통화 정책",
      "거버넌스를 위한 스냅샷 기능"
    ],
    factoryTitle: "Factory 계약",
    factoryIntro: "Alkanes factory 계약은 기본 계약의 프로그래밍 방식 복제를 가능하게 하는 디자인 패턴입니다. 예를 들어, 토큰 발행 및 배포 로직을 정의하는 단일 factory 계약을 배포한 다음 해당 계약의 복제본을 사용하여 해당 로직을 상속하는 개별 토큰을 생성할 수 있습니다.",
    factoryContent: "Factory 계약은 Alkanes의 FACTORYRESERVED opcode를 사용하여 새 계약 인스턴스를 배포하며, 일반적으로 토큰 이름, 기호, 총 공급량 및 발행 매개변수와 같은 매개변수를 사용합니다.",
    factoryUseCasesTitle: "Factory 사용 사례",
    factoryUseCases: [
      "AMM용 토큰 쌍 배포",
      "래핑된 자산 토큰 생성",
      "새 프로젝트를 위한 거버넌스 토큰 발행",
      "표준화되고 가스 효율적인 토큰 배포"
    ],
    exampleTitle: "예제 계약",
    nextStepsTitle: "다음 단계",
    nextSteps: [
      { text: "빠른 시작 가이드", href: "/docs/quickstart", desc: "첫 번째 계약 배포" },
      { text: "CLI 명령", href: "/docs/cli", desc: "배포 및 상호작용" },
      { text: "API", href: "/docs/api", desc: "프로그래밍 방식 접근" }
    ]
  }
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm my-4">
      <code>{children}</code>
    </pre>
  );
}

export default function AlkanesConceptsPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.featuresTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {t.features.map((feature, i) => (
            <div key={i} className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-[color:var(--sf-muted)]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.structureTitle}</h2>
        <p className="mb-4">{t.structureIntro}</p>
        <ol className="list-decimal list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.structure.map((item, i) => (
            <li key={i}><strong>{item.split(" - ")[0]}</strong> - {item.split(" - ")[1]}</li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.tokensTitle}</h2>
        <p className="mb-4">{t.tokensIntro}</p>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.tokensContent}</p>

        <h3 className="text-xl font-medium mb-2">{t.tokenFeaturesTitle}</h3>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.tokenFeatures.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.factoryTitle}</h2>
        <p className="mb-4">{t.factoryIntro}</p>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.factoryContent}</p>

        <h3 className="text-xl font-medium mb-2">{t.factoryUseCasesTitle}</h3>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.factoryUseCases.map((useCase, i) => (
            <li key={i}>{useCase}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.exampleTitle}</h2>
        <CodeBlock>{`use alkanes_std::prelude::*;
use alkanes_support::context::Context;

#[derive(Default)]
pub struct MyAlkane {
    counter: u64,
}

impl MyAlkane {
    pub fn new() -> Self {
        Self { counter: 0 }
    }

    pub fn increment(&mut self) {
        self.counter += 1;
    }

    pub fn get_count(&self) -> u64 {
        self.counter
    }
}

// Export the contract
alkane!(MyAlkane);`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.nextStepsTitle}</h2>
        <ul className="space-y-2">
          {t.nextSteps.map((step, i) => (
            <li key={i}>
              <a href={step.href} className="text-[color:var(--sf-primary)] hover:underline">
                {step.text}
              </a>
              {" - "}{step.desc}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
