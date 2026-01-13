"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Alkanes API Reference",
    intro: "The Alkanes API provides methods for interacting with the Alkanes protocol on Bitcoin. It enables querying balances, simulating transactions, and managing protorunes/alkanes assets.",
    baseUrlTitle: "Base URL",
    baseUrlContent: "All API methods are available via HTTP POST requests to the Sandshrew endpoints:",
    endpoints: [
      { network: "Mainnet", url: "https://mainnet.sandshrew.io/v4" },
      { network: "Testnet", url: "https://testnet.sandshrew.io/v4" },
      { network: "Signet", url: "https://signet.sandshrew.io/v4" }
    ],
    rpcMethodsTitle: "RPC Methods",
    protorunesByAddressTitle: "protorunesbyaddress",
    protorunesByAddressDesc: "Query protorunes balances for a specific address.",
    protorunesByAddressParams: [
      { name: "address", desc: "Bitcoin address to query" },
      { name: "protocolTag", desc: "Protocol identifier (1n for Alkanes)" }
    ],
    protorunesByAddressReturns: [
      { name: "outpoints", desc: "Array of UTXOs containing protorunes" },
      { name: "balanceSheet", desc: "Array of protorune balances" }
    ],
    protorunesByHeightTitle: "protorunesbyheight",
    protorunesByHeightDesc: "Query protorunes state at a specific block height.",
    protorunesByOutpointTitle: "protorunesbyoutpoint",
    protorunesByOutpointDesc: "Query protorunes at a specific UTXO.",
    simulateTitle: "simulate",
    simulateDesc: "Simulate execution of an Alkanes transaction without broadcasting.",
    usageTitle: "Usage Examples",
    queryBalanceTitle: "Query Balance",
    simulateTxTitle: "Simulate Transaction",
    getAlkanesTitle: "Get Alkanes List",
    getByAddressTitle: "Get Alkanes by Address",
    cliTitle: "CLI Integration",
    cliContent: "The API methods are also accessible via the CLI:",
    errorHandlingTitle: "Error Handling",
    errorHandlingContent: "All methods may return errors with this structure:",
    errorCodes: [
      { code: "-32700", meaning: "Parse error" },
      { code: "-32600", meaning: "Invalid request" },
      { code: "-32601", meaning: "Method not found" },
      { code: "-32602", meaning: "Invalid params" },
      { code: "-32603", meaning: "Internal error" }
    ],
    rateLimitsTitle: "Rate Limits",
    rateLimitsContent: "The public Sandshrew endpoints have rate limits. For production use, consider running your own Metashrew indexer or contacting Sandshrew for API keys.",
    resourcesTitle: "Resources",
    resources: [
      { text: "Oyl SDK Documentation", href: "https://github.com/Oyl-Wallet/oyl-sdk" },
      { text: "Metashrew Indexer", href: "https://github.com/kungfuflex/metashrew" },
      { text: "CLI Reference", href: "/docs/cli" }
    ]
  },
  zh: {
    title: "Alkanes API 参考",
    intro: "Alkanes API 提供与比特币上 Alkanes 协议交互的方法。它支持查询余额、模拟交易和管理 protorunes/alkanes 资产。",
    baseUrlTitle: "基础 URL",
    baseUrlContent: "所有 API 方法都可通过 HTTP POST 请求访问 Sandshrew 端点：",
    endpoints: [
      { network: "主网", url: "https://mainnet.sandshrew.io/v4" },
      { network: "测试网", url: "https://testnet.sandshrew.io/v4" },
      { network: "Signet", url: "https://signet.sandshrew.io/v4" }
    ],
    rpcMethodsTitle: "RPC 方法",
    protorunesByAddressTitle: "protorunesbyaddress",
    protorunesByAddressDesc: "查询特定地址的 protorunes 余额。",
    protorunesByAddressParams: [
      { name: "address", desc: "要查询的比特币地址" },
      { name: "protocolTag", desc: "协议标识符（Alkanes 使用 1n）" }
    ],
    protorunesByAddressReturns: [
      { name: "outpoints", desc: "包含 protorunes 的 UTXO 数组" },
      { name: "balanceSheet", desc: "protorune 余额数组" }
    ],
    protorunesByHeightTitle: "protorunesbyheight",
    protorunesByHeightDesc: "查询特定区块高度的 protorunes 状态。",
    protorunesByOutpointTitle: "protorunesbyoutpoint",
    protorunesByOutpointDesc: "查询特定 UTXO 的 protorunes。",
    simulateTitle: "simulate",
    simulateDesc: "模拟 Alkanes 交易执行而不广播。",
    usageTitle: "使用示例",
    queryBalanceTitle: "查询余额",
    simulateTxTitle: "模拟交易",
    getAlkanesTitle: "获取 Alkanes 列表",
    getByAddressTitle: "按地址获取 Alkanes",
    cliTitle: "CLI 集成",
    cliContent: "API 方法也可通过 CLI 访问：",
    errorHandlingTitle: "错误处理",
    errorHandlingContent: "所有方法都可能返回以下结构的错误：",
    errorCodes: [
      { code: "-32700", meaning: "解析错误" },
      { code: "-32600", meaning: "无效请求" },
      { code: "-32601", meaning: "方法未找到" },
      { code: "-32602", meaning: "参数无效" },
      { code: "-32603", meaning: "内部错误" }
    ],
    rateLimitsTitle: "速率限制",
    rateLimitsContent: "公共 Sandshrew 端点有速率限制。生产环境建议运行自己的 Metashrew 索引器或联系 Sandshrew 获取 API 密钥。",
    resourcesTitle: "资源",
    resources: [
      { text: "Oyl SDK 文档", href: "https://github.com/Oyl-Wallet/oyl-sdk" },
      { text: "Metashrew 索引器", href: "https://github.com/kungfuflex/metashrew" },
      { text: "CLI 参考", href: "/docs/cli" }
    ]
  },
  ms: {
    title: "Rujukan API Alkanes",
    intro: "API Alkanes menyediakan kaedah untuk berinteraksi dengan protokol Alkanes pada Bitcoin. Ia membolehkan pertanyaan baki, simulasi transaksi, dan pengurusan aset protorunes/alkanes.",
    baseUrlTitle: "URL Asas",
    baseUrlContent: "Semua kaedah API tersedia melalui permintaan HTTP POST kepada endpoint Sandshrew:",
    endpoints: [
      { network: "Mainnet", url: "https://mainnet.sandshrew.io/v4" },
      { network: "Testnet", url: "https://testnet.sandshrew.io/v4" },
      { network: "Signet", url: "https://signet.sandshrew.io/v4" }
    ],
    rpcMethodsTitle: "Kaedah RPC",
    protorunesByAddressTitle: "protorunesbyaddress",
    protorunesByAddressDesc: "Tanya baki protorunes untuk alamat tertentu.",
    protorunesByAddressParams: [
      { name: "address", desc: "Alamat Bitcoin untuk ditanya" },
      { name: "protocolTag", desc: "Pengecam protokol (1n untuk Alkanes)" }
    ],
    protorunesByAddressReturns: [
      { name: "outpoints", desc: "Array UTXO yang mengandungi protorunes" },
      { name: "balanceSheet", desc: "Array baki protorune" }
    ],
    protorunesByHeightTitle: "protorunesbyheight",
    protorunesByHeightDesc: "Tanya keadaan protorunes pada ketinggian blok tertentu.",
    protorunesByOutpointTitle: "protorunesbyoutpoint",
    protorunesByOutpointDesc: "Tanya protorunes pada UTXO tertentu.",
    simulateTitle: "simulate",
    simulateDesc: "Simulasikan pelaksanaan transaksi Alkanes tanpa penyiaran.",
    usageTitle: "Contoh Penggunaan",
    queryBalanceTitle: "Tanya Baki",
    simulateTxTitle: "Simulasikan Transaksi",
    getAlkanesTitle: "Dapatkan Senarai Alkanes",
    getByAddressTitle: "Dapatkan Alkanes mengikut Alamat",
    cliTitle: "Integrasi CLI",
    cliContent: "Kaedah API juga boleh diakses melalui CLI:",
    errorHandlingTitle: "Pengendalian Ralat",
    errorHandlingContent: "Semua kaedah boleh mengembalikan ralat dengan struktur ini:",
    errorCodes: [
      { code: "-32700", meaning: "Ralat menghurai" },
      { code: "-32600", meaning: "Permintaan tidak sah" },
      { code: "-32601", meaning: "Kaedah tidak dijumpai" },
      { code: "-32602", meaning: "Parameter tidak sah" },
      { code: "-32603", meaning: "Ralat dalaman" }
    ],
    rateLimitsTitle: "Had Kadar",
    rateLimitsContent: "Endpoint Sandshrew awam mempunyai had kadar. Untuk penggunaan produksi, pertimbangkan untuk menjalankan pengindeks Metashrew anda sendiri atau hubungi Sandshrew untuk kunci API.",
    resourcesTitle: "Sumber",
    resources: [
      { text: "Dokumentasi Oyl SDK", href: "https://github.com/Oyl-Wallet/oyl-sdk" },
      { text: "Pengindeks Metashrew", href: "https://github.com/kungfuflex/metashrew" },
      { text: "Rujukan CLI", href: "/docs/cli" }
    ]
  },
  vi: {
    title: "Tham khảo API Alkanes",
    intro: "API Alkanes cung cấp các phương thức để tương tác với giao thức Alkanes trên Bitcoin. Nó cho phép truy vấn số dư, mô phỏng giao dịch và quản lý tài sản protorunes/alkanes.",
    baseUrlTitle: "URL Cơ sở",
    baseUrlContent: "Tất cả các phương thức API có sẵn thông qua các yêu cầu HTTP POST đến các endpoint Sandshrew:",
    endpoints: [
      { network: "Mainnet", url: "https://mainnet.sandshrew.io/v4" },
      { network: "Testnet", url: "https://testnet.sandshrew.io/v4" },
      { network: "Signet", url: "https://signet.sandshrew.io/v4" }
    ],
    rpcMethodsTitle: "Phương thức RPC",
    protorunesByAddressTitle: "protorunesbyaddress",
    protorunesByAddressDesc: "Truy vấn số dư protorunes cho một địa chỉ cụ thể.",
    protorunesByAddressParams: [
      { name: "address", desc: "Địa chỉ Bitcoin cần truy vấn" },
      { name: "protocolTag", desc: "Định danh giao thức (1n cho Alkanes)" }
    ],
    protorunesByAddressReturns: [
      { name: "outpoints", desc: "Mảng UTXO chứa protorunes" },
      { name: "balanceSheet", desc: "Mảng số dư protorune" }
    ],
    protorunesByHeightTitle: "protorunesbyheight",
    protorunesByHeightDesc: "Truy vấn trạng thái protorunes tại một chiều cao khối cụ thể.",
    protorunesByOutpointTitle: "protorunesbyoutpoint",
    protorunesByOutpointDesc: "Truy vấn protorunes tại một UTXO cụ thể.",
    simulateTitle: "simulate",
    simulateDesc: "Mô phỏng thực thi giao dịch Alkanes mà không phát sóng.",
    usageTitle: "Ví dụ Sử dụng",
    queryBalanceTitle: "Truy vấn Số dư",
    simulateTxTitle: "Mô phỏng Giao dịch",
    getAlkanesTitle: "Lấy Danh sách Alkanes",
    getByAddressTitle: "Lấy Alkanes theo Địa chỉ",
    cliTitle: "Tích hợp CLI",
    cliContent: "Các phương thức API cũng có thể truy cập thông qua CLI:",
    errorHandlingTitle: "Xử lý Lỗi",
    errorHandlingContent: "Tất cả các phương thức có thể trả về lỗi với cấu trúc này:",
    errorCodes: [
      { code: "-32700", meaning: "Lỗi phân tích cú pháp" },
      { code: "-32600", meaning: "Yêu cầu không hợp lệ" },
      { code: "-32601", meaning: "Không tìm thấy phương thức" },
      { code: "-32602", meaning: "Tham số không hợp lệ" },
      { code: "-32603", meaning: "Lỗi nội bộ" }
    ],
    rateLimitsTitle: "Giới hạn Tốc độ",
    rateLimitsContent: "Các endpoint Sandshrew công khai có giới hạn tốc độ. Đối với việc sử dụng trong sản xuất, hãy xem xét chạy bộ lập chỉ mục Metashrew của riêng bạn hoặc liên hệ với Sandshrew để lấy khóa API.",
    resourcesTitle: "Tài nguyên",
    resources: [
      { text: "Tài liệu Oyl SDK", href: "https://github.com/Oyl-Wallet/oyl-sdk" },
      { text: "Bộ lập chỉ mục Metashrew", href: "https://github.com/kungfuflex/metashrew" },
      { text: "Tham khảo CLI", href: "/docs/cli" }
    ]
  },
  ko: {
    title: "Alkanes API 참조",
    intro: "Alkanes API는 Bitcoin의 Alkanes 프로토콜과 상호 작용하는 메서드를 제공합니다. 잔액 조회, 거래 시뮬레이션 및 protorunes/alkanes 자산 관리를 가능하게 합니다.",
    baseUrlTitle: "기본 URL",
    baseUrlContent: "모든 API 메서드는 Sandshrew 엔드포인트에 대한 HTTP POST 요청을 통해 사용할 수 있습니다:",
    endpoints: [
      { network: "메인넷", url: "https://mainnet.sandshrew.io/v4" },
      { network: "테스트넷", url: "https://testnet.sandshrew.io/v4" },
      { network: "Signet", url: "https://signet.sandshrew.io/v4" }
    ],
    rpcMethodsTitle: "RPC 메서드",
    protorunesByAddressTitle: "protorunesbyaddress",
    protorunesByAddressDesc: "특정 주소에 대한 protorunes 잔액을 쿼리합니다.",
    protorunesByAddressParams: [
      { name: "address", desc: "쿼리할 Bitcoin 주소" },
      { name: "protocolTag", desc: "프로토콜 식별자 (Alkanes의 경우 1n)" }
    ],
    protorunesByAddressReturns: [
      { name: "outpoints", desc: "protorunes를 포함하는 UTXO 배열" },
      { name: "balanceSheet", desc: "protorune 잔액 배열" }
    ],
    protorunesByHeightTitle: "protorunesbyheight",
    protorunesByHeightDesc: "특정 블록 높이에서 protorunes 상태를 쿼리합니다.",
    protorunesByOutpointTitle: "protorunesbyoutpoint",
    protorunesByOutpointDesc: "특정 UTXO에서 protorunes를 쿼리합니다.",
    simulateTitle: "simulate",
    simulateDesc: "브로드캐스트하지 않고 Alkanes 거래 실행을 시뮬레이션합니다.",
    usageTitle: "사용 예제",
    queryBalanceTitle: "잔액 조회",
    simulateTxTitle: "거래 시뮬레이션",
    getAlkanesTitle: "Alkanes 목록 가져오기",
    getByAddressTitle: "주소별 Alkanes 가져오기",
    cliTitle: "CLI 통합",
    cliContent: "API 메서드는 CLI를 통해서도 액세스할 수 있습니다:",
    errorHandlingTitle: "오류 처리",
    errorHandlingContent: "모든 메서드는 다음 구조의 오류를 반환할 수 있습니다:",
    errorCodes: [
      { code: "-32700", meaning: "구문 분석 오류" },
      { code: "-32600", meaning: "유효하지 않은 요청" },
      { code: "-32601", meaning: "메서드를 찾을 수 없음" },
      { code: "-32602", meaning: "유효하지 않은 매개변수" },
      { code: "-32603", meaning: "내부 오류" }
    ],
    rateLimitsTitle: "속도 제한",
    rateLimitsContent: "공개 Sandshrew 엔드포인트에는 속도 제한이 있습니다. 프로덕션 사용을 위해 자체 Metashrew 인덱서를 실행하거나 API 키를 위해 Sandshrew에 문의하는 것을 고려하십시오.",
    resourcesTitle: "리소스",
    resources: [
      { text: "Oyl SDK 문서", href: "https://github.com/Oyl-Wallet/oyl-sdk" },
      { text: "Metashrew 인덱서", href: "https://github.com/kungfuflex/metashrew" },
      { text: "CLI 참조", href: "/docs/cli" }
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

export default function APIPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.baseUrlTitle}</h2>
        <p className="mb-4">{t.baseUrlContent}</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[color:var(--sf-outline)]">
                <th className="text-left py-2 px-4">Network</th>
                <th className="text-left py-2 px-4">Endpoint</th>
              </tr>
            </thead>
            <tbody>
              {t.endpoints.map((ep, i) => (
                <tr key={i} className="border-b border-[color:var(--sf-outline)]">
                  <td className="py-2 px-4">{ep.network}</td>
                  <td className="py-2 px-4 font-mono text-sm">{ep.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.rpcMethodsTitle}</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2">{t.protorunesByAddressTitle}</h3>
            <p className="text-[color:var(--sf-muted)] mb-4">{t.protorunesByAddressDesc}</p>
            <CodeBlock>{`async protorunesbyaddress({
  address: string,
  protocolTag: bigint
}, blockTag?: string): Promise<{
  outpoints: OutPoint[],
  balanceSheet: RuneOutput[]
}>`}</CodeBlock>
            <p className="font-medium mt-4 mb-2">Parameters:</p>
            <ul className="list-disc list-inside space-y-1 text-[color:var(--sf-muted)]">
              {t.protorunesByAddressParams.map((p, i) => (
                <li key={i}><code className="px-2 py-0.5 rounded bg-[color:var(--sf-surface)]">{p.name}</code>: {p.desc}</li>
              ))}
            </ul>
            <p className="font-medium mt-4 mb-2">Returns:</p>
            <ul className="list-disc list-inside space-y-1 text-[color:var(--sf-muted)]">
              {t.protorunesByAddressReturns.map((r, i) => (
                <li key={i}><code className="px-2 py-0.5 rounded bg-[color:var(--sf-surface)]">{r.name}</code>: {r.desc}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">{t.protorunesByHeightTitle}</h3>
            <p className="text-[color:var(--sf-muted)] mb-4">{t.protorunesByHeightDesc}</p>
            <CodeBlock>{`async protorunesbyheight({
  height: number,
  protocolTag: bigint
}, blockTag?: string): Promise<RunesResponse>`}</CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">{t.protorunesByOutpointTitle}</h3>
            <p className="text-[color:var(--sf-muted)] mb-4">{t.protorunesByOutpointDesc}</p>
            <CodeBlock>{`async protorunesbyoutpoint({
  txid: string,
  vout: number,
  protocolTag: bigint
}, blockTag?: string): Promise<OutpointResponse>`}</CodeBlock>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">{t.simulateTitle}</h3>
            <p className="text-[color:var(--sf-muted)] mb-4">{t.simulateDesc}</p>
            <CodeBlock>{`async simulate({
  alkanes: AlkaneTransfer[],
  transaction: string,
  height: bigint,
  block: string,
  txindex: number,
  target: { block: bigint, tx: bigint },
  inputs: bigint[],
  vout: number,
  pointer: number,
  refundPointer: number
}, blockTag?: string): Promise<SimulateResponse>`}</CodeBlock>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.usageTitle}</h2>

        <h3 className="text-xl font-medium mb-2">{t.queryBalanceTitle}</h3>
        <CodeBlock>{`import { AlkanesRpc } from '@alkanes/sdk';

const alkanes = new AlkanesRpc('https://mainnet.sandshrew.io/v4');

const balance = await alkanes.protorunesbyaddress({
  address: 'bc1p...',
  protocolTag: 1n,
});

console.log(balance.balanceSheet);`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2 mt-6">{t.simulateTxTitle}</h3>
        <CodeBlock>{`const simulation = await alkanes.simulate({
  alkanes: [],
  transaction: '<raw_tx_hex>',
  height: 880000n,
  txindex: 0,
  target: { block: 2n, tx: 0n },
  inputs: [101n],
  pointer: 0,
  refundPointer: 0,
  vout: 0,
});`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2 mt-6">{t.getAlkanesTitle}</h3>
        <CodeBlock>{`const alkanes = await provider.alkanes({
  method: 'getAlkanes',
  params: { limit: 20 }
});`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2 mt-6">{t.getByAddressTitle}</h3>
        <CodeBlock>{`const holdings = await provider.alkanes({
  method: 'getAlkanesByAddress',
  params: { address: 'bc1p...' }
});`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.cliTitle}</h2>
        <p className="mb-4">{t.cliContent}</p>
        <CodeBlock>{`# Query alkanes
oyl provider alkanes -method getAlkanes -params '{"limit": 20}' -p mainnet

# Get balances
oyl provider alkanes -method getAlkanesByAddress \\
  -params '{"address":"bc1p..."}' -p mainnet`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.errorHandlingTitle}</h2>
        <p className="mb-4">{t.errorHandlingContent}</p>
        <CodeBlock>{`interface RPCError {
  code: number;
  message: string;
  data?: any;
}`}</CodeBlock>
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[color:var(--sf-outline)]">
                <th className="text-left py-2 px-4">Code</th>
                <th className="text-left py-2 px-4">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {t.errorCodes.map((err, i) => (
                <tr key={i} className="border-b border-[color:var(--sf-outline)]">
                  <td className="py-2 px-4 font-mono">{err.code}</td>
                  <td className="py-2 px-4 text-[color:var(--sf-muted)]">{err.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.rateLimitsTitle}</h2>
        <p className="text-[color:var(--sf-muted)]">{t.rateLimitsContent}</p>
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
