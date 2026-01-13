"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Protorunes Protocol",
    intro: "Protorunes is the foundation layer that enables Alkanes smart contracts on Bitcoin. It extends the Runes protocol with programmable functionality, allowing for complex on-chain logic while maintaining Bitcoin's security guarantees.",
    whatTitle: "What are Protorunes?",
    whatContent: "Protorunes extend the Runes protocol with:",
    whatFeatures: [
      "Programmable Functionality - Execute arbitrary WASM code",
      "State Management - Maintain persistent contract state",
      "Token Standards - Create and manage fungible tokens",
      "Composability - Enable contract-to-contract interactions"
    ],
    howTitle: "How Protorunes Work",
    encodingTitle: "1. Transaction Encoding",
    encodingContent: "Protorunes data is encoded in Bitcoin transactions using OP_RETURN outputs. Each transaction can contain calldata (instructions for contract execution), token transfers, and state updates.",
    indexingTitle: "2. Indexing",
    indexingContent: "The Metashrew indexer processes Bitcoin blocks, extracts protorune transactions, executes WASM contract code, maintains state database, and provides query interfaces.",
    executionTitle: "3. Execution Model",
    executionSteps: [
      "Transaction is validated against Bitcoin rules",
      "Calldata is extracted and parsed",
      "Target contract's WASM code is executed",
      "State changes are committed",
      "Token transfers are recorded"
    ],
    protocolTagTitle: "Protocol Tag",
    protocolTagContent: "Alkanes uses protocol tag 1n to identify its transactions. This distinguishes Alkanes from other protorune implementations.",
    alkaneIdsTitle: "Alkane IDs",
    alkaneIdsContent: "Each deployed contract receives a unique Alkane ID consisting of the block number and transaction index. For example, [2, 0] refers to DIESEL token.",
    reservedIdsTitle: "Reserved IDs",
    reservedIds: [
      "[2, n] - Standard token deployments",
      "[3, n] - Factory contract deployments",
      "[4, n] - Reserved address space"
    ],
    stateStorageTitle: "State Storage",
    stateStorageContent: "Protorunes provide key-value storage for contracts. State is persisted across transactions and blocks, enabling complex stateful applications.",
    tokenOpsTitle: "Token Operations",
    mintingTitle: "Minting",
    transfersTitle: "Transfers",
    balancesTitle: "Balances",
    securityTitle: "Security Model",
    securityContent: "Protorunes inherit Bitcoin's security:",
    securityFeatures: [
      "All state is anchored to Bitcoin blocks",
      "Transactions are validated by Bitcoin consensus",
      "No separate validator set or bridge required",
      "Deterministic execution ensures consistent state"
    ],
    resourcesTitle: "Resources",
    resources: [
      { text: "Protorunes Repository", href: "https://github.com/kungfuflex/protorune-rs" },
      { text: "Alkanes Implementation", href: "https://github.com/kungfuflex/alkanes-rs/tree/develop" },
      { text: "API Reference", href: "/docs/api" }
    ]
  },
  zh: {
    title: "Protorunes 协议",
    intro: "Protorunes 是在比特币上启用 Alkanes 智能合约的基础层。它扩展了 Runes 协议，增加了可编程功能，允许复杂的链上逻辑，同时保持比特币的安全保障。",
    whatTitle: "什么是 Protorunes？",
    whatContent: "Protorunes 扩展 Runes 协议，提供：",
    whatFeatures: [
      "可编程功能 - 执行任意 WASM 代码",
      "状态管理 - 维护持久化合约状态",
      "代币标准 - 创建和管理同质化代币",
      "可组合性 - 启用合约间交互"
    ],
    howTitle: "Protorunes 工作原理",
    encodingTitle: "1. 交易编码",
    encodingContent: "Protorunes 数据使用 OP_RETURN 输出编码在比特币交易中。每笔交易可以包含调用数据（合约执行指令）、代币转账和状态更新。",
    indexingTitle: "2. 索引",
    indexingContent: "Metashrew 索引器处理比特币区块，提取 protorune 交易，执行 WASM 合约代码，维护状态数据库，并提供查询接口。",
    executionTitle: "3. 执行模型",
    executionSteps: [
      "交易按比特币规则验证",
      "提取并解析调用数据",
      "执行目标合约的 WASM 代码",
      "提交状态变更",
      "记录代币转账"
    ],
    protocolTagTitle: "协议标签",
    protocolTagContent: "Alkanes 使用协议标签 1n 来识别其交易。这将 Alkanes 与其他 protorune 实现区分开来。",
    alkaneIdsTitle: "Alkane ID",
    alkaneIdsContent: "每个部署的合约都会收到一个由区块号和交易索引组成的唯一 Alkane ID。例如，[2, 0] 指的是 DIESEL 代币。",
    reservedIdsTitle: "保留 ID",
    reservedIds: [
      "[2, n] - 标准代币部署",
      "[3, n] - 工厂合约部署",
      "[4, n] - 保留地址空间"
    ],
    stateStorageTitle: "状态存储",
    stateStorageContent: "Protorunes 为合约提供键值存储。状态在交易和区块之间持久化，支持复杂的有状态应用。",
    tokenOpsTitle: "代币操作",
    mintingTitle: "铸造",
    transfersTitle: "转账",
    balancesTitle: "余额",
    securityTitle: "安全模型",
    securityContent: "Protorunes 继承比特币的安全性：",
    securityFeatures: [
      "所有状态都锚定于比特币区块",
      "交易由比特币共识验证",
      "无需单独的验证器集或桥接",
      "确定性执行确保状态一致"
    ],
    resourcesTitle: "资源",
    resources: [
      { text: "Protorunes 代码库", href: "https://github.com/kungfuflex/protorune-rs" },
      { text: "Alkanes 实现", href: "https://github.com/kungfuflex/alkanes-rs/tree/develop" },
      { text: "API 参考", href: "/docs/api" }
    ]
  },
  ms: {
    title: "Protokol Protorunes",
    intro: "Protorunes adalah lapisan asas yang membolehkan kontrak pintar Alkanes di Bitcoin. Ia memperluaskan protokol Runes dengan fungsi boleh atur cara, membenarkan logik kompleks dalam rantaian sambil mengekalkan jaminan keselamatan Bitcoin.",
    whatTitle: "Apa itu Protorunes?",
    whatContent: "Protorunes memperluaskan protokol Runes dengan:",
    whatFeatures: [
      "Fungsi Boleh Atur Cara - Laksanakan kod WASM sewenang-wenangnya",
      "Pengurusan Keadaan - Kekalkan keadaan kontrak berterusan",
      "Piawaian Token - Cipta dan urus token boleh kulat",
      "Kebolehkomponan - Dayakan interaksi kontrak-ke-kontrak"
    ],
    howTitle: "Cara Protorunes Berfungsi",
    encodingTitle: "1. Pengekodan Transaksi",
    encodingContent: "Data Protorunes dikodkan dalam transaksi Bitcoin menggunakan output OP_RETURN. Setiap transaksi boleh mengandungi calldata (arahan pelaksanaan kontrak), pemindahan token, dan kemas kini keadaan.",
    indexingTitle: "2. Pengindeksan",
    indexingContent: "Pengindeks Metashrew memproses blok Bitcoin, mengekstrak transaksi protorune, melaksanakan kod kontrak WASM, mengekalkan pangkalan data keadaan, dan menyediakan antara muka pertanyaan.",
    executionTitle: "3. Model Pelaksanaan",
    executionSteps: [
      "Transaksi disahkan terhadap peraturan Bitcoin",
      "Calldata diekstrak dan dihuraikan",
      "Kod WASM kontrak sasaran dilaksanakan",
      "Perubahan keadaan dilakukan",
      "Pemindahan token direkodkan"
    ],
    protocolTagTitle: "Tag Protokol",
    protocolTagContent: "Alkanes menggunakan tag protokol 1n untuk mengenal pasti transaksinya. Ini membezakan Alkanes daripada pelaksanaan protorune lain.",
    alkaneIdsTitle: "ID Alkane",
    alkaneIdsContent: "Setiap kontrak yang dilebarkan menerima ID Alkane unik yang terdiri daripada nombor blok dan indeks transaksi. Sebagai contoh, [2, 0] merujuk kepada token DIESEL.",
    reservedIdsTitle: "ID Terpelihara",
    reservedIds: [
      "[2, n] - Pelebaran token standard",
      "[3, n] - Pelebaran kontrak kilang",
      "[4, n] - Ruang alamat terpelihara"
    ],
    stateStorageTitle: "Penyimpanan Keadaan",
    stateStorageContent: "Protorunes menyediakan penyimpanan nilai-kunci untuk kontrak. Keadaan berterusan merentas transaksi dan blok, membolehkan aplikasi berkeadaan yang kompleks.",
    tokenOpsTitle: "Operasi Token",
    mintingTitle: "Pencetakan",
    transfersTitle: "Pemindahan",
    balancesTitle: "Baki",
    securityTitle: "Model Keselamatan",
    securityContent: "Protorunes mewarisi keselamatan Bitcoin:",
    securityFeatures: [
      "Semua keadaan dilabuhkan ke blok Bitcoin",
      "Transaksi disahkan oleh konsensus Bitcoin",
      "Tiada set pengesah atau jambatan berasingan diperlukan",
      "Pelaksanaan deterministik memastikan konsistensi keadaan"
    ],
    resourcesTitle: "Sumber",
    resources: [
      { text: "Repositori Protorunes", href: "https://github.com/kungfuflex/protorune-rs" },
      { text: "Pelaksanaan Alkanes", href: "https://github.com/kungfuflex/alkanes-rs/tree/develop" },
      { text: "Rujukan API", href: "/docs/api" }
    ]
  },
  vi: {
    title: "Giao Thức Protorunes",
    intro: "Protorunes là lớp nền tảng cho phép các hợp đồng thông minh Alkanes trên Bitcoin. Nó mở rộng giao thức Runes với chức năng có thể lập trình, cho phép logic phức tạp trên chuỗi trong khi vẫn duy trì các đảm bảo bảo mật của Bitcoin.",
    whatTitle: "Protorunes là gì?",
    whatContent: "Protorunes mở rộng giao thức Runes với:",
    whatFeatures: [
      "Chức Năng Có Thể Lập Trình - Thực thi mã WASM tùy ý",
      "Quản Lý Trạng Thái - Duy trì trạng thái hợp đồng bền vững",
      "Tiêu Chuẩn Token - Tạo và quản lý token có thể thay thế",
      "Khả Năng Kết Hợp - Cho phép tương tác hợp đồng với hợp đồng"
    ],
    howTitle: "Cách Protorunes Hoạt Động",
    encodingTitle: "1. Mã Hóa Giao Dịch",
    encodingContent: "Dữ liệu Protorunes được mã hóa trong các giao dịch Bitcoin bằng cách sử dụng đầu ra OP_RETURN. Mỗi giao dịch có thể chứa calldata (hướng dẫn thực thi hợp đồng), chuyển token và cập nhật trạng thái.",
    indexingTitle: "2. Lập Chỉ Mục",
    indexingContent: "Trình lập chỉ mục Metashrew xử lý các khối Bitcoin, trích xuất giao dịch protorune, thực thi mã hợp đồng WASM, duy trì cơ sở dữ liệu trạng thái và cung cấp giao diện truy vấn.",
    executionTitle: "3. Mô Hình Thực Thi",
    executionSteps: [
      "Giao dịch được xác thực theo quy tắc Bitcoin",
      "Calldata được trích xuất và phân tích",
      "Mã WASM của hợp đồng đích được thực thi",
      "Thay đổi trạng thái được commit",
      "Chuyển token được ghi lại"
    ],
    protocolTagTitle: "Thẻ Giao Thức",
    protocolTagContent: "Alkanes sử dụng thẻ giao thức 1n để xác định các giao dịch của nó. Điều này phân biệt Alkanes với các triển khai protorune khác.",
    alkaneIdsTitle: "ID Alkane",
    alkaneIdsContent: "Mỗi hợp đồng được triển khai nhận một ID Alkane duy nhất bao gồm số khối và chỉ số giao dịch. Ví dụ, [2, 0] đề cập đến token DIESEL.",
    reservedIdsTitle: "ID Dành Riêng",
    reservedIds: [
      "[2, n] - Triển khai token tiêu chuẩn",
      "[3, n] - Triển khai hợp đồng factory",
      "[4, n] - Không gian địa chỉ dành riêng"
    ],
    stateStorageTitle: "Lưu Trữ Trạng Thái",
    stateStorageContent: "Protorunes cung cấp lưu trữ key-value cho hợp đồng. Trạng thái được lưu trữ liên tục qua các giao dịch và khối, cho phép các ứng dụng có trạng thái phức tạp.",
    tokenOpsTitle: "Hoạt Động Token",
    mintingTitle: "Đúc",
    transfersTitle: "Chuyển",
    balancesTitle: "Số Dư",
    securityTitle: "Mô Hình Bảo Mật",
    securityContent: "Protorunes kế thừa bảo mật của Bitcoin:",
    securityFeatures: [
      "Tất cả trạng thái được neo vào các khối Bitcoin",
      "Giao dịch được xác thực bởi đồng thuận Bitcoin",
      "Không cần tập validator riêng hoặc cầu nối",
      "Thực thi xác định đảm bảo tính nhất quán của trạng thái"
    ],
    resourcesTitle: "Tài Nguyên",
    resources: [
      { text: "Kho Protorunes", href: "https://github.com/kungfuflex/protorune-rs" },
      { text: "Triển Khai Alkanes", href: "https://github.com/kungfuflex/alkanes-rs/tree/develop" },
      { text: "Tài Liệu API", href: "/docs/api" }
    ]
  },
  ko: {
    title: "Protorunes 프로토콜",
    intro: "Protorunes는 Bitcoin에서 Alkanes 스마트 계약을 가능하게 하는 기초 레이어입니다. Bitcoin의 보안 보장을 유지하면서 복잡한 온체인 로직을 허용하는 프로그래밍 가능한 기능으로 Runes 프로토콜을 확장합니다.",
    whatTitle: "Protorunes란 무엇인가요?",
    whatContent: "Protorunes는 다음을 통해 Runes 프로토콜을 확장합니다:",
    whatFeatures: [
      "프로그래밍 가능한 기능 - 임의의 WASM 코드 실행",
      "상태 관리 - 영구적인 계약 상태 유지",
      "토큰 표준 - 대체 가능한 토큰 생성 및 관리",
      "구성 가능성 - 계약 간 상호작용 활성화"
    ],
    howTitle: "Protorunes 작동 방식",
    encodingTitle: "1. 트랜잭션 인코딩",
    encodingContent: "Protorunes 데이터는 OP_RETURN 출력을 사용하여 Bitcoin 트랜잭션에 인코딩됩니다. 각 트랜잭션에는 calldata(계약 실행 명령), 토큰 전송 및 상태 업데이트가 포함될 수 있습니다.",
    indexingTitle: "2. 인덱싱",
    indexingContent: "Metashrew 인덱서는 Bitcoin 블록을 처리하고, protorune 트랜잭션을 추출하고, WASM 계약 코드를 실행하고, 상태 데이터베이스를 유지하고, 쿼리 인터페이스를 제공합니다.",
    executionTitle: "3. 실행 모델",
    executionSteps: [
      "트랜잭션이 Bitcoin 규칙에 따라 검증됨",
      "Calldata가 추출되고 파싱됨",
      "대상 계약의 WASM 코드가 실행됨",
      "상태 변경이 커밋됨",
      "토큰 전송이 기록됨"
    ],
    protocolTagTitle: "프로토콜 태그",
    protocolTagContent: "Alkanes는 트랜잭션을 식별하기 위해 프로토콜 태그 1n을 사용합니다. 이는 Alkanes를 다른 protorune 구현과 구별합니다.",
    alkaneIdsTitle: "Alkane ID",
    alkaneIdsContent: "배포된 각 계약은 블록 번호와 트랜잭션 인덱스로 구성된 고유한 Alkane ID를 받습니다. 예를 들어, [2, 0]은 DIESEL 토큰을 나타냅니다.",
    reservedIdsTitle: "예약된 ID",
    reservedIds: [
      "[2, n] - 표준 토큰 배포",
      "[3, n] - Factory 계약 배포",
      "[4, n] - 예약된 주소 공간"
    ],
    stateStorageTitle: "상태 스토리지",
    stateStorageContent: "Protorunes는 계약을 위한 키-값 스토리지를 제공합니다. 상태는 트랜잭션과 블록 간에 지속되어 복잡한 상태 저장 애플리케이션을 가능하게 합니다.",
    tokenOpsTitle: "토큰 작업",
    mintingTitle: "발행",
    transfersTitle: "전송",
    balancesTitle: "잔액",
    securityTitle: "보안 모델",
    securityContent: "Protorunes는 Bitcoin의 보안을 상속합니다:",
    securityFeatures: [
      "모든 상태가 Bitcoin 블록에 고정됨",
      "트랜잭션이 Bitcoin 합의에 의해 검증됨",
      "별도의 검증자 세트나 브리지가 필요 없음",
      "결정론적 실행으로 상태 일관성 보장"
    ],
    resourcesTitle: "리소스",
    resources: [
      { text: "Protorunes 저장소", href: "https://github.com/kungfuflex/protorune-rs" },
      { text: "Alkanes 구현", href: "https://github.com/kungfuflex/alkanes-rs/tree/develop" },
      { text: "API 참조", href: "/docs/api" }
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

export default function ProtorunesPage() {
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
          {t.whatFeatures.map((feature, i) => (
            <li key={i}><strong>{feature.split(" - ")[0]}</strong> - {feature.split(" - ")[1]}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.howTitle}</h2>

        <h3 className="text-xl font-medium mb-2">{t.encodingTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.encodingContent}</p>

        <h3 className="text-xl font-medium mb-2">{t.indexingTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.indexingContent}</p>

        <h3 className="text-xl font-medium mb-2">{t.executionTitle}</h3>
        <ol className="list-decimal list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.executionSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.protocolTagTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.protocolTagContent}</p>
        <CodeBlock>{`const ALKANES_PROTOCOL_TAG = 1n;`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.alkaneIdsTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.alkaneIdsContent}</p>

        <h3 className="text-xl font-medium mb-2">{t.reservedIdsTitle}</h3>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.reservedIds.map((id, i) => (
            <li key={i}><code className="px-2 py-1 rounded bg-[color:var(--sf-surface)]">{id.split(" - ")[0]}</code> - {id.split(" - ")[1]}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.stateStorageTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.stateStorageContent}</p>
        <CodeBlock>{`// Store a value
storage::set(b"my_key", &value);

// Retrieve a value
let value = storage::get(b"my_key");`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.tokenOpsTitle}</h2>

        <h3 className="text-xl font-medium mb-2">{t.mintingTitle}</h3>
        <CodeBlock>{`oyl alkane new-token -name "MYTOKEN" -symbol "MTK" -amount 1000000`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2">{t.transfersTitle}</h3>
        <CodeBlock>{`oyl alkane send -blk 2 -tx 14 -amt 100 -to <ADDRESS>`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2">{t.balancesTitle}</h3>
        <CodeBlock>{`const balance = await alkanes.protorunesbyaddress({
  address: 'bc1...',
  protocolTag: 1n,
});`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.securityTitle}</h2>
        <p className="mb-4">{t.securityContent}</p>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.securityFeatures.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
