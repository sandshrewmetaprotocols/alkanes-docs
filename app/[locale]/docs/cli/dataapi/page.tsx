"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "DataAPI Commands",
    intro: "The dataapi namespace provides high-level queries for Alkanes tokens, AMM pools, balances, and market data via the SUBFROST Data API.",
    configTitle: "Configuration",
    configDesc: "The Data API uses a separate endpoint from JSON-RPC:",
    alkanesQueriesTitle: "Alkanes Queries",
    alkanesQueries: [
      { cmd: "get-alkanes", desc: "Get all alkanes tokens" },
      { cmd: "get-alkanes-by-address", desc: "Get alkanes for an address" },
      { cmd: "get-alkane-details", desc: "Get details for a specific alkane" }
    ],
    poolTitle: "Pool & AMM",
    poolCommands: [
      { cmd: "get-pools", desc: "Get all liquidity pools" },
      { cmd: "get-pool-by-id", desc: "Get pool details by ID" },
      { cmd: "get-pool-history", desc: "Get historical pool data" },
      { cmd: "get-swap-history", desc: "Get swap history" }
    ],
    balancesTitle: "Balances",
    balanceCommands: [
      { cmd: "get-address-balances", desc: "Get alkane balances for an address (with UTXO tracking)" },
      { cmd: "get-outpoint-balances", desc: "Get alkane balances for a specific outpoint" },
      { cmd: "get-holders", desc: "Get holders of an alkane token" },
      { cmd: "get-holder-count", desc: "Get holder count for an alkane" }
    ],
    marketTitle: "Market Data",
    marketCommands: [
      { cmd: "get-bitcoin-price", desc: "Get current Bitcoin price" },
      { cmd: "get-market-chart", desc: "Get Bitcoin market chart" }
    ],
    indexerTitle: "Indexer Status",
    indexerCommands: [
      { cmd: "get-block-height", desc: "Get latest processed block height" },
      { cmd: "get-block-hash", desc: "Get latest processed block hash" },
      { cmd: "get-indexer-position", desc: "Get indexer position (height + hash)" },
      { cmd: "health", desc: "Health check" }
    ],
    getAlkanesTitle: "dataapi get-alkanes",
    getAlkanesDesc: "Get all alkanes tokens indexed by the system.",
    getAlkanesByAddrTitle: "dataapi get-alkanes-by-address",
    getAlkanesByAddrDesc: "Get alkanes tokens held by a specific address.",
    getPoolsTitle: "dataapi get-pools",
    getPoolsDesc: "Get all liquidity pools from the AMM factory.",
    getPoolByIdTitle: "dataapi get-pool-by-id",
    getPoolByIdDesc: "Get details for a specific liquidity pool.",
    getAddressBalancesTitle: "dataapi get-address-balances",
    getAddressBalancesDesc: "Get alkane balances for an address with UTXO tracking.",
    getHoldersTitle: "dataapi get-holders",
    getHoldersDesc: "Get all holders of a specific alkane token.",
    getHolderCountTitle: "dataapi get-holder-count",
    getHolderCountDesc: "Get the number of unique holders for an alkane token.",
    getBitcoinPriceTitle: "dataapi get-bitcoin-price",
    getBitcoinPriceDesc: "Get the current Bitcoin price.",
    getBlockHeightTitle: "dataapi get-block-height",
    getBlockHeightDesc: "Get the latest block height processed by the indexer.",
    healthTitle: "dataapi health",
    healthDesc: "Check if the Data API is healthy.",
    restTitle: "REST API Equivalent",
    restDesc: "These DataAPI commands correspond to REST endpoints:"
  },
  zh: {
    title: "DataAPI 命令",
    intro: "dataapi 命名空间通过 SUBFROST Data API 提供 Alkanes 代币、AMM 池、余额和市场数据的高级查询。",
    configTitle: "配置",
    configDesc: "Data API 使用与 JSON-RPC 不同的端点：",
    alkanesQueriesTitle: "Alkanes 查询",
    alkanesQueries: [
      { cmd: "get-alkanes", desc: "获取所有 alkanes 代币" },
      { cmd: "get-alkanes-by-address", desc: "获取地址持有的 alkanes" },
      { cmd: "get-alkane-details", desc: "获取特定 alkane 的详情" }
    ],
    poolTitle: "池与 AMM",
    poolCommands: [
      { cmd: "get-pools", desc: "获取所有流动性池" },
      { cmd: "get-pool-by-id", desc: "按 ID 获取池详情" },
      { cmd: "get-pool-history", desc: "获取历史池数据" },
      { cmd: "get-swap-history", desc: "获取交换历史" }
    ],
    balancesTitle: "余额",
    balanceCommands: [
      { cmd: "get-address-balances", desc: "获取地址的 alkane 余额（带 UTXO 跟踪）" },
      { cmd: "get-outpoint-balances", desc: "获取特定 outpoint 的 alkane 余额" },
      { cmd: "get-holders", desc: "获取 alkane 代币的持有者" },
      { cmd: "get-holder-count", desc: "获取 alkane 的持有者数量" }
    ],
    marketTitle: "市场数据",
    marketCommands: [
      { cmd: "get-bitcoin-price", desc: "获取当前比特币价格" },
      { cmd: "get-market-chart", desc: "获取比特币市场图表" }
    ],
    indexerTitle: "索引器状态",
    indexerCommands: [
      { cmd: "get-block-height", desc: "获取最新处理的区块高度" },
      { cmd: "get-block-hash", desc: "获取最新处理的区块哈希" },
      { cmd: "get-indexer-position", desc: "获取索引器位置（高度 + 哈希）" },
      { cmd: "health", desc: "健康检查" }
    ],
    getAlkanesTitle: "dataapi get-alkanes",
    getAlkanesDesc: "获取系统索引的所有 alkanes 代币。",
    getAlkanesByAddrTitle: "dataapi get-alkanes-by-address",
    getAlkanesByAddrDesc: "获取特定地址持有的 alkanes 代币。",
    getPoolsTitle: "dataapi get-pools",
    getPoolsDesc: "从 AMM 工厂获取所有流动性池。",
    getPoolByIdTitle: "dataapi get-pool-by-id",
    getPoolByIdDesc: "获取特定流动性池的详情。",
    getAddressBalancesTitle: "dataapi get-address-balances",
    getAddressBalancesDesc: "获取地址的 alkane 余额（带 UTXO 跟踪）。",
    getHoldersTitle: "dataapi get-holders",
    getHoldersDesc: "获取特定 alkane 代币的所有持有者。",
    getHolderCountTitle: "dataapi get-holder-count",
    getHolderCountDesc: "获取 alkane 代币的唯一持有者数量。",
    getBitcoinPriceTitle: "dataapi get-bitcoin-price",
    getBitcoinPriceDesc: "获取当前比特币价格。",
    getBlockHeightTitle: "dataapi get-block-height",
    getBlockHeightDesc: "获取索引器处理的最新区块高度。",
    healthTitle: "dataapi health",
    healthDesc: "检查 Data API 是否健康。",
    restTitle: "REST API 对应端点",
    restDesc: "这些 DataAPI 命令对应以下 REST 端点："
  },
  ms: {
    title: "Arahan DataAPI",
    intro: "Ruang nama dataapi menyediakan pertanyaan peringkat tinggi untuk token Alkanes, kolam AMM, baki, dan data pasaran melalui SUBFROST Data API.",
    configTitle: "Konfigurasi",
    configDesc: "Data API menggunakan endpoint berasingan dari JSON-RPC:",
    alkanesQueriesTitle: "Pertanyaan Alkanes",
    alkanesQueries: [
      { cmd: "get-alkanes", desc: "Dapatkan semua token alkanes" },
      { cmd: "get-alkanes-by-address", desc: "Dapatkan alkanes untuk alamat" },
      { cmd: "get-alkane-details", desc: "Dapatkan butiran untuk alkane tertentu" }
    ],
    poolTitle: "Kolam & AMM",
    poolCommands: [
      { cmd: "get-pools", desc: "Dapatkan semua kolam kecairan" },
      { cmd: "get-pool-by-id", desc: "Dapatkan butiran kolam mengikut ID" },
      { cmd: "get-pool-history", desc: "Dapatkan data kolam sejarah" },
      { cmd: "get-swap-history", desc: "Dapatkan sejarah pertukaran" }
    ],
    balancesTitle: "Baki",
    balanceCommands: [
      { cmd: "get-address-balances", desc: "Dapatkan baki alkane untuk alamat (dengan penjejakan UTXO)" },
      { cmd: "get-outpoint-balances", desc: "Dapatkan baki alkane untuk outpoint tertentu" },
      { cmd: "get-holders", desc: "Dapatkan pemegang token alkane" },
      { cmd: "get-holder-count", desc: "Dapatkan kiraan pemegang untuk alkane" }
    ],
    marketTitle: "Data Pasaran",
    marketCommands: [
      { cmd: "get-bitcoin-price", desc: "Dapatkan harga Bitcoin semasa" },
      { cmd: "get-market-chart", desc: "Dapatkan carta pasaran Bitcoin" }
    ],
    indexerTitle: "Status Pengindeks",
    indexerCommands: [
      { cmd: "get-block-height", desc: "Dapatkan ketinggian blok terkini yang diproses" },
      { cmd: "get-block-hash", desc: "Dapatkan hash blok terkini yang diproses" },
      { cmd: "get-indexer-position", desc: "Dapatkan kedudukan pengindeks (ketinggian + hash)" },
      { cmd: "health", desc: "Pemeriksaan kesihatan" }
    ],
    getAlkanesTitle: "dataapi get-alkanes",
    getAlkanesDesc: "Dapatkan semua token alkanes yang diindeks oleh sistem.",
    getAlkanesByAddrTitle: "dataapi get-alkanes-by-address",
    getAlkanesByAddrDesc: "Dapatkan token alkanes yang dipegang oleh alamat tertentu.",
    getPoolsTitle: "dataapi get-pools",
    getPoolsDesc: "Dapatkan semua kolam kecairan dari kilang AMM.",
    getPoolByIdTitle: "dataapi get-pool-by-id",
    getPoolByIdDesc: "Dapatkan butiran untuk kolam kecairan tertentu.",
    getAddressBalancesTitle: "dataapi get-address-balances",
    getAddressBalancesDesc: "Dapatkan baki alkane untuk alamat dengan penjejakan UTXO.",
    getHoldersTitle: "dataapi get-holders",
    getHoldersDesc: "Dapatkan semua pemegang token alkane tertentu.",
    getHolderCountTitle: "dataapi get-holder-count",
    getHolderCountDesc: "Dapatkan bilangan pemegang unik untuk token alkane.",
    getBitcoinPriceTitle: "dataapi get-bitcoin-price",
    getBitcoinPriceDesc: "Dapatkan harga Bitcoin semasa.",
    getBlockHeightTitle: "dataapi get-block-height",
    getBlockHeightDesc: "Dapatkan ketinggian blok terkini yang diproses oleh pengindeks.",
    healthTitle: "dataapi health",
    healthDesc: "Semak sama ada Data API sihat.",
    restTitle: "Setara REST API",
    restDesc: "Arahan DataAPI ini sepadan dengan endpoint REST:"
  },
  vi: {
    title: "Lệnh DataAPI",
    intro: "Không gian tên dataapi cung cấp các truy vấn cấp cao cho token Alkanes, pool AMM, số dư và dữ liệu thị trường qua SUBFROST Data API.",
    configTitle: "Cấu hình",
    configDesc: "Data API sử dụng điểm cuối riêng với JSON-RPC:",
    alkanesQueriesTitle: "Truy vấn Alkanes",
    alkanesQueries: [
      { cmd: "get-alkanes", desc: "Lấy tất cả token alkanes" },
      { cmd: "get-alkanes-by-address", desc: "Lấy alkanes cho địa chỉ" },
      { cmd: "get-alkane-details", desc: "Lấy chi tiết cho alkane cụ thể" }
    ],
    poolTitle: "Pool & AMM",
    poolCommands: [
      { cmd: "get-pools", desc: "Lấy tất cả pool thanh khoản" },
      { cmd: "get-pool-by-id", desc: "Lấy chi tiết pool theo ID" },
      { cmd: "get-pool-history", desc: "Lấy dữ liệu pool lịch sử" },
      { cmd: "get-swap-history", desc: "Lấy lịch sử hoán đổi" }
    ],
    balancesTitle: "Số dư",
    balanceCommands: [
      { cmd: "get-address-balances", desc: "Lấy số dư alkane cho địa chỉ (với theo dõi UTXO)" },
      { cmd: "get-outpoint-balances", desc: "Lấy số dư alkane cho outpoint cụ thể" },
      { cmd: "get-holders", desc: "Lấy người nắm giữ token alkane" },
      { cmd: "get-holder-count", desc: "Lấy số lượng người nắm giữ cho alkane" }
    ],
    marketTitle: "Dữ liệu Thị trường",
    marketCommands: [
      { cmd: "get-bitcoin-price", desc: "Lấy giá Bitcoin hiện tại" },
      { cmd: "get-market-chart", desc: "Lấy biểu đồ thị trường Bitcoin" }
    ],
    indexerTitle: "Trạng thái Indexer",
    indexerCommands: [
      { cmd: "get-block-height", desc: "Lấy chiều cao khối được xử lý mới nhất" },
      { cmd: "get-block-hash", desc: "Lấy hash khối được xử lý mới nhất" },
      { cmd: "get-indexer-position", desc: "Lấy vị trí indexer (chiều cao + hash)" },
      { cmd: "health", desc: "Kiểm tra sức khỏe" }
    ],
    getAlkanesTitle: "dataapi get-alkanes",
    getAlkanesDesc: "Lấy tất cả token alkanes được lập chỉ mục bởi hệ thống.",
    getAlkanesByAddrTitle: "dataapi get-alkanes-by-address",
    getAlkanesByAddrDesc: "Lấy token alkanes được giữ bởi một địa chỉ cụ thể.",
    getPoolsTitle: "dataapi get-pools",
    getPoolsDesc: "Lấy tất cả pool thanh khoản từ factory AMM.",
    getPoolByIdTitle: "dataapi get-pool-by-id",
    getPoolByIdDesc: "Lấy chi tiết cho một pool thanh khoản cụ thể.",
    getAddressBalancesTitle: "dataapi get-address-balances",
    getAddressBalancesDesc: "Lấy số dư alkane cho địa chỉ với theo dõi UTXO.",
    getHoldersTitle: "dataapi get-holders",
    getHoldersDesc: "Lấy tất cả người nắm giữ của token alkane cụ thể.",
    getHolderCountTitle: "dataapi get-holder-count",
    getHolderCountDesc: "Lấy số lượng người nắm giữ duy nhất cho token alkane.",
    getBitcoinPriceTitle: "dataapi get-bitcoin-price",
    getBitcoinPriceDesc: "Lấy giá Bitcoin hiện tại.",
    getBlockHeightTitle: "dataapi get-block-height",
    getBlockHeightDesc: "Lấy chiều cao khối mới nhất được xử lý bởi indexer.",
    healthTitle: "dataapi health",
    healthDesc: "Kiểm tra xem Data API có khỏe mạnh không.",
    restTitle: "Tương đương REST API",
    restDesc: "Các lệnh DataAPI này tương ứng với các điểm cuối REST:"
  },
  ko: {
    title: "DataAPI 명령",
    intro: "dataapi 네임스페이스는 SUBFROST Data API를 통해 Alkanes 토큰, AMM 풀, 잔액 및 시장 데이터에 대한 고급 쿼리를 제공합니다.",
    configTitle: "구성",
    configDesc: "Data API는 JSON-RPC와 별도의 엔드포인트를 사용합니다:",
    alkanesQueriesTitle: "Alkanes 쿼리",
    alkanesQueries: [
      { cmd: "get-alkanes", desc: "모든 alkanes 토큰 가져오기" },
      { cmd: "get-alkanes-by-address", desc: "주소의 alkanes 가져오기" },
      { cmd: "get-alkane-details", desc: "특정 alkane의 세부 정보 가져오기" }
    ],
    poolTitle: "풀 & AMM",
    poolCommands: [
      { cmd: "get-pools", desc: "모든 유동성 풀 가져오기" },
      { cmd: "get-pool-by-id", desc: "ID로 풀 세부 정보 가져오기" },
      { cmd: "get-pool-history", desc: "과거 풀 데이터 가져오기" },
      { cmd: "get-swap-history", desc: "스왑 기록 가져오기" }
    ],
    balancesTitle: "잔액",
    balanceCommands: [
      { cmd: "get-address-balances", desc: "주소의 alkane 잔액 가져오기 (UTXO 추적 포함)" },
      { cmd: "get-outpoint-balances", desc: "특정 출력점의 alkane 잔액 가져오기" },
      { cmd: "get-holders", desc: "alkane 토큰 보유자 가져오기" },
      { cmd: "get-holder-count", desc: "alkane의 보유자 수 가져오기" }
    ],
    marketTitle: "시장 데이터",
    marketCommands: [
      { cmd: "get-bitcoin-price", desc: "현재 비트코인 가격 가져오기" },
      { cmd: "get-market-chart", desc: "비트코인 시장 차트 가져오기" }
    ],
    indexerTitle: "인덱서 상태",
    indexerCommands: [
      { cmd: "get-block-height", desc: "처리된 최신 블록 높이 가져오기" },
      { cmd: "get-block-hash", desc: "처리된 최신 블록 해시 가져오기" },
      { cmd: "get-indexer-position", desc: "인덱서 위치 가져오기 (높이 + 해시)" },
      { cmd: "health", desc: "상태 확인" }
    ],
    getAlkanesTitle: "dataapi get-alkanes",
    getAlkanesDesc: "시스템에서 인덱싱한 모든 alkanes 토큰을 가져옵니다.",
    getAlkanesByAddrTitle: "dataapi get-alkanes-by-address",
    getAlkanesByAddrDesc: "특정 주소가 보유한 alkanes 토큰을 가져옵니다.",
    getPoolsTitle: "dataapi get-pools",
    getPoolsDesc: "AMM 팩토리에서 모든 유동성 풀을 가져옵니다.",
    getPoolByIdTitle: "dataapi get-pool-by-id",
    getPoolByIdDesc: "특정 유동성 풀의 세부 정보를 가져옵니다.",
    getAddressBalancesTitle: "dataapi get-address-balances",
    getAddressBalancesDesc: "UTXO 추적과 함께 주소의 alkane 잔액을 가져옵니다.",
    getHoldersTitle: "dataapi get-holders",
    getHoldersDesc: "특정 alkane 토큰의 모든 보유자를 가져옵니다.",
    getHolderCountTitle: "dataapi get-holder-count",
    getHolderCountDesc: "alkane 토큰의 고유 보유자 수를 가져옵니다.",
    getBitcoinPriceTitle: "dataapi get-bitcoin-price",
    getBitcoinPriceDesc: "현재 비트코인 가격을 가져옵니다.",
    getBlockHeightTitle: "dataapi get-block-height",
    getBlockHeightDesc: "인덱서가 처리한 최신 블록 높이를 가져옵니다.",
    healthTitle: "dataapi health",
    healthDesc: "Data API가 정상인지 확인합니다.",
    restTitle: "REST API 등가물",
    restDesc: "이러한 DataAPI 명령은 REST 엔드포인트에 해당합니다:"
  }
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm my-4">
      <code>{children}</code>
    </pre>
  );
}

function CommandTable({ commands }: { commands: { cmd: string; desc: string }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[color:var(--sf-outline)]">
            <th className="text-left py-2 px-3">Command</th>
            <th className="text-left py-2 px-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((cmd, i) => (
            <tr key={i} className="border-b border-[color:var(--sf-outline)]">
              <td className="py-2 px-3 font-mono">{cmd.cmd}</td>
              <td className="py-2 px-3 text-[color:var(--sf-muted)]">{cmd.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DataAPICommandsPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.configTitle}</h2>
        <p className="mb-4">{t.configDesc}</p>
        <CodeBlock>{`# Using the data API endpoint
alkanes-cli -p mainnet \\
  --data-api https://mainnet.subfrost.io/v4/api \\
  dataapi get-alkanes

# Or with your API key for higher rate limits:
--data-api https://mainnet.subfrost.io/v4/YOUR_API_KEY`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.alkanesQueriesTitle}</h2>
        <CommandTable commands={t.alkanesQueries} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.poolTitle}</h2>
        <CommandTable commands={t.poolCommands} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.balancesTitle}</h2>
        <CommandTable commands={t.balanceCommands} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.marketTitle}</h2>
        <CommandTable commands={t.marketCommands} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.indexerTitle}</h2>
        <CommandTable commands={t.indexerCommands} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.getAlkanesTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.getAlkanesDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --data-api https://mainnet.subfrost.io/v4/api \\
  dataapi get-alkanes

# Example Output:
# Alkanes Tokens
# ═══════════════════════════════════
#
# 1. 2:0
# 2. 32:0
# 3. 4:65522
# ...
#
# Total: 25`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.getAlkanesByAddrTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.getAlkanesByAddrDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --data-api https://mainnet.subfrost.io/v4/api \\
  dataapi get-alkanes-by-address bc1p...

# Arguments:
# <ADDRESS>  Bitcoin address to query`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.getPoolsTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.getPoolsDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --data-api https://mainnet.subfrost.io/v4/api \\
  dataapi get-pools

# Example Output:
# Liquidity Pools
# ═══════════════════════════════════
#
# 1. DIESEL / frBTC LP
#    Pool ID: 2:3
#    Pair: 2:0 → 32:0
#    Reserves: 300000000 × 50000
#    LP Supply: 3872983
#    Creator: bc1p...
#
# Total: 1 pools`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.getPoolByIdTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.getPoolByIdDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --data-api https://mainnet.subfrost.io/v4/api \\
  dataapi get-pool-by-id 2:3

# Arguments:
# <POOL_ID>  Pool ID (format: block:tx)`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.getAddressBalancesTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.getAddressBalancesDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --data-api https://mainnet.subfrost.io/v4/api \\
  dataapi get-address-balances bc1p...

# Arguments:
# <ADDRESS>  Bitcoin address to query

# Returns balances broken down by UTXO for accurate tracking.`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.getHoldersTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.getHoldersDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --data-api https://mainnet.subfrost.io/v4/api \\
  dataapi get-holders 2:0

# Arguments:
# <ALKANE_ID>  Alkane ID`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.getHolderCountTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.getHolderCountDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --data-api https://mainnet.subfrost.io/v4/api \\
  dataapi get-holder-count 2:0

# Arguments:
# <ALKANE_ID>  Alkane ID`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.getBitcoinPriceTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.getBitcoinPriceDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --data-api https://mainnet.subfrost.io/v4/api \\
  dataapi get-bitcoin-price`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.getBlockHeightTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.getBlockHeightDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --data-api https://mainnet.subfrost.io/v4/api \\
  dataapi get-block-height

# Example Output:
# {
#   "height": 850123
# }`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.healthTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.healthDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --data-api https://mainnet.subfrost.io/v4/api \\
  dataapi health

# Output:
# OK`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.restTitle}</h2>
        <p className="mb-4">{t.restDesc}</p>
        <CodeBlock>{`# CLI → REST endpoint mapping:
# get-alkanes → GET /alkanes
# get-pools → GET /pools
# get-address-balances → GET /address/{address}/balances
# get-block-height → GET /indexer/height
# health → GET /health`}</CodeBlock>
      </div>
    </div>
  );
}
