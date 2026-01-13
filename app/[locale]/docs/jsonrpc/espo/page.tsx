"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Espo JSON-RPC API",
    intro: "The Espo indexer provides a JSON-RPC API for querying alkanes data and AMM analytics. The API is organized into two modules: Essentials for core data and AMM Data for trading analytics.",

    endpointTitle: "Endpoint",
    endpointDesc: "Espo runs on a separate endpoint. When using Subfrost, the @alkanes/ts-sdk automatically appends /espo to your base RPC URL:",
    urlRoutingTitle: "URL Routing with @alkanes/ts-sdk",
    urlRoutingDesc: "When you configure the AlkanesProvider with a base RPC URL, all espo method calls are automatically routed to the /espo path:",
    urlRoutingNote: "For example, if your rpcUrl is https://mainnet.subfrost.io/v4/your_api_key, espo methods will POST to https://mainnet.subfrost.io/v4/your_api_key/espo",

    essentialsTitle: "Essentials Module",
    essentialsDesc: "Core alkanes data including balances, holders, and storage keys.",

    essentialsMethods: [
      { name: "ping", desc: "Ping the Espo server" },
      { name: "get_espo_height", desc: "Get current indexer height" },
      { name: "get_address_balances", desc: "Get alkanes balances for an address" },
      { name: "get_address_outpoints", desc: "Get outpoints with alkanes for an address" },
      { name: "get_outpoint_balances", desc: "Get alkanes at a specific outpoint" },
      { name: "get_holders", desc: "Get holders of an alkane (paginated)" },
      { name: "get_holders_count", desc: "Get holder count for an alkane" },
      { name: "get_keys", desc: "Get storage keys for an alkane (paginated)" }
    ],

    ammdataTitle: "AMM Data Module",
    ammdataDesc: "Trading and liquidity analytics for AMM pools.",

    ammdataMethods: [
      { name: "ammdata.ping", desc: "Ping the AMM Data module" },
      { name: "ammdata.get_candles", desc: "Get OHLCV candlestick data" },
      { name: "ammdata.get_trades", desc: "Get trade history" },
      { name: "ammdata.get_pools", desc: "Get all pools" },
      { name: "ammdata.find_best_swap_path", desc: "Find optimal swap route" },
      { name: "ammdata.get_best_mev_swap", desc: "Find MEV opportunities" }
    ],

    // Method details
    pingTitle: "ping",
    pingDesc: "Ping the Espo server to verify connectivity.",

    getHeightTitle: "get_espo_height",
    getHeightDesc: "Get the current block height processed by the Espo indexer.",

    getAddressBalancesTitle: "get_address_balances",
    getAddressBalancesDesc: "Get alkanes balances for a Bitcoin address with optional outpoint details.",

    getAddressOutpointsTitle: "get_address_outpoints",
    getAddressOutpointsDesc: "Get all outpoints containing alkanes for an address.",

    getOutpointBalancesTitle: "get_outpoint_balances",
    getOutpointBalancesDesc: "Get alkanes balances at a specific UTXO outpoint.",

    getHoldersTitle: "get_holders",
    getHoldersDesc: "Get paginated list of holders for an alkane token.",

    getHoldersCountTitle: "get_holders_count",
    getHoldersCountDesc: "Get the total number of unique holders for an alkane.",

    getKeysTitle: "get_keys",
    getKeysDesc: "Get storage keys for an alkane contract with pagination and UTF-8 decoding.",

    ammdataPingTitle: "ammdata.ping",
    ammdataPingDesc: "Ping the AMM Data module to verify connectivity.",

    getCandlesTitle: "ammdata.get_candles",
    getCandlesDesc: "Get OHLCV (Open, High, Low, Close, Volume) candlestick data for a liquidity pool.",

    getTradesTitle: "ammdata.get_trades",
    getTradesDesc: "Get trade history for a pool with filtering and sorting options.",

    getPoolsTitle: "ammdata.get_pools",
    getPoolsDesc: "Get all AMM pools with pagination.",

    findBestSwapPathTitle: "ammdata.find_best_swap_path",
    findBestSwapPathDesc: "Find the optimal multi-hop swap path between two tokens with configurable routing parameters.",

    getBestMevSwapTitle: "ammdata.get_best_mev_swap",
    getBestMevSwapDesc: "Find the best MEV (Maximal Extractable Value) arbitrage opportunity for a token across all available pools.",

    examplesTitle: "Example Requests",
    notesTitle: "Implementation Notes",
    notes: [
      "All methods use JSON-RPC 2.0 protocol",
      "AMM Data methods use dot notation (e.g., 'ammdata.get_candles')",
      "Alkane IDs are in format 'block:tx' (e.g., '840000:1')",
      "Outpoints are in format 'txid:vout'",
      "Pagination is 0-indexed",
      "All numeric amounts are returned as strings to preserve precision",
      "BigInt values are converted to strings in responses"
    ]
  },
  zh: {
    title: "Espo JSON-RPC API",
    intro: "Espo 索引器提供用于查询 alkanes 数据和 AMM 分析的 JSON-RPC API。API 分为两个模块：用于核心数据的 Essentials 和用于交易分析的 AMM Data。",

    endpointTitle: "端点",
    endpointDesc: "Espo 在单独的端点上运行。使用 Subfrost 时，@alkanes/ts-sdk 会自动在您的基础 RPC URL 后追加 /espo：",
    urlRoutingTitle: "使用 @alkanes/ts-sdk 的 URL 路由",
    urlRoutingDesc: "当您使用基础 RPC URL 配置 AlkanesProvider 时，所有 espo 方法调用会自动路由到 /espo 路径：",
    urlRoutingNote: "例如，如果您的 rpcUrl 是 https://mainnet.subfrost.io/v4/your_api_key，espo 方法将 POST 到 https://mainnet.subfrost.io/v4/your_api_key/espo",

    essentialsTitle: "Essentials 模块",
    essentialsDesc: "核心 alkanes 数据，包括余额、持有者和存储键。",

    essentialsMethods: [
      { name: "ping", desc: "Ping Espo 服务器" },
      { name: "get_espo_height", desc: "获取当前索引器高度" },
      { name: "get_address_balances", desc: "获取地址的 alkanes 余额" },
      { name: "get_address_outpoints", desc: "获取地址的包含 alkanes 的 outpoints" },
      { name: "get_outpoint_balances", desc: "获取特定 outpoint 的 alkanes" },
      { name: "get_holders", desc: "获取 alkane 的持有者（分页）" },
      { name: "get_holders_count", desc: "获取 alkane 的持有者数量" },
      { name: "get_keys", desc: "获取 alkane 的存储键（分页）" }
    ],

    ammdataTitle: "AMM Data 模块",
    ammdataDesc: "AMM 池的交易和流动性分析。",

    ammdataMethods: [
      { name: "ammdata.ping", desc: "Ping AMM Data 模块" },
      { name: "ammdata.get_candles", desc: "获取 OHLCV K线数据" },
      { name: "ammdata.get_trades", desc: "获取交易历史" },
      { name: "ammdata.get_pools", desc: "获取所有池" },
      { name: "ammdata.find_best_swap_path", desc: "寻找最优交换路径" },
      { name: "ammdata.get_best_mev_swap", desc: "寻找 MEV 机会" }
    ],

    pingTitle: "ping",
    pingDesc: "Ping Espo 服务器以验证连接。",

    getHeightTitle: "get_espo_height",
    getHeightDesc: "获取 Espo 索引器处理的当前区块高度。",

    getAddressBalancesTitle: "get_address_balances",
    getAddressBalancesDesc: "获取比特币地址的 alkanes 余额，可选包含 outpoint 详情。",

    getAddressOutpointsTitle: "get_address_outpoints",
    getAddressOutpointsDesc: "获取地址的所有包含 alkanes 的 outpoints。",

    getOutpointBalancesTitle: "get_outpoint_balances",
    getOutpointBalancesDesc: "获取特定 UTXO outpoint 的 alkanes 余额。",

    getHoldersTitle: "get_holders",
    getHoldersDesc: "获取 alkane 代币的分页持有者列表。",

    getHoldersCountTitle: "get_holders_count",
    getHoldersCountDesc: "获取 alkane 的唯一持有者总数。",

    getKeysTitle: "get_keys",
    getKeysDesc: "获取 alkane 合约的存储键，支持分页和 UTF-8 解码。",

    ammdataPingTitle: "ammdata.ping",
    ammdataPingDesc: "Ping AMM Data 模块以验证连接。",

    getCandlesTitle: "ammdata.get_candles",
    getCandlesDesc: "获取流动性池的 OHLCV（开盘、最高、最低、收盘、成交量）K线数据。",

    getTradesTitle: "ammdata.get_trades",
    getTradesDesc: "获取池的交易历史，支持过滤和排序选项。",

    getPoolsTitle: "ammdata.get_pools",
    getPoolsDesc: "获取所有 AMM 池，支持分页。",

    findBestSwapPathTitle: "ammdata.find_best_swap_path",
    findBestSwapPathDesc: "寻找两个代币之间的最优多跳交换路径，支持可配置的路由参数。",

    getBestMevSwapTitle: "ammdata.get_best_mev_swap",
    getBestMevSwapDesc: "在所有可用池中寻找代币的最佳 MEV（最大可提取价值）套利机会。",

    examplesTitle: "请求示例",
    notesTitle: "实现说明",
    notes: [
      "所有方法使用 JSON-RPC 2.0 协议",
      "AMM Data 方法使用点表示法（例如 'ammdata.get_candles'）",
      "Alkane ID 格式为 'block:tx'（例如 '840000:1'）",
      "Outpoint 格式为 'txid:vout'",
      "分页从 0 开始索引",
      "所有数字金额以字符串形式返回以保持精度",
      "BigInt 值在响应中转换为字符串"
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

export default function EspoRPCPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-muted-foreground">{t.intro}</p>
      </div>

      {/* Endpoint */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">{t.endpointTitle}</h2>
        <p className="mb-4">{t.endpointDesc}</p>
        <CodeBlock>
{`# Subfrost endpoint (recommended)
# Base: https://{network}.subfrost.io/v4/{api_key}
# Espo: https://{network}.subfrost.io/v4/{api_key}/espo

# Local development
espo_rpc_url: http://localhost:8080`}
        </CodeBlock>
      </section>

      {/* URL Routing */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">{t.urlRoutingTitle}</h2>
        <p className="mb-4">{t.urlRoutingDesc}</p>
        <CodeBlock>
{`import { AlkanesProvider } from '@alkanes/ts-sdk';

const provider = new AlkanesProvider({
  network: 'mainnet',
  rpcUrl: 'https://mainnet.subfrost.io/v4/your_api_key'
});

await provider.initialize();

// Espo methods are automatically routed to /espo
const balances = await provider.espo.getAddressBalances('bc1q...');
// ^ This POSTs to: https://mainnet.subfrost.io/v4/your_api_key/espo`}
        </CodeBlock>
        <p className="text-sm text-muted-foreground mt-4 p-3 bg-primary/10 rounded-lg">
          {t.urlRoutingNote}
        </p>
      </section>

      {/* Essentials Module */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">{t.essentialsTitle}</h2>
        <p className="mb-4">{t.essentialsDesc}</p>
        <div className="space-y-2">
          {t.essentialsMethods.map((method, i) => (
            <div key={i} className="flex gap-3 p-3 bg-secondary rounded">
              <code className="text-primary font-mono text-sm">{method.name}</code>
              <span className="text-muted-foreground">—</span>
              <span className="text-sm">{method.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AMM Data Module */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">{t.ammdataTitle}</h2>
        <p className="mb-4">{t.ammdataDesc}</p>
        <div className="space-y-2">
          {t.ammdataMethods.map((method, i) => (
            <div key={i} className="flex gap-3 p-3 bg-secondary rounded">
              <code className="text-primary font-mono text-sm">{method.name}</code>
              <span className="text-muted-foreground">—</span>
              <span className="text-sm">{method.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Method Examples */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">{t.examplesTitle}</h2>

        {/* ping */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">{t.pingTitle}</h3>
          <p className="text-muted-foreground mb-3">{t.pingDesc}</p>
          <CodeBlock>
{`// Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "ping",
  "params": {}
}

// Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "pong"
}`}
          </CodeBlock>
        </div>

        {/* get_address_balances */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">{t.getAddressBalancesTitle}</h3>
          <p className="text-muted-foreground mb-3">{t.getAddressBalancesDesc}</p>
          <CodeBlock>
{`// Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "get_address_balances",
  "params": {
    "address": "bc1q...",
    "include_outpoints": true
  }
}

// Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "ok": true,
    "address": "bc1q...",
    "balances": {
      "840000:1": "1000000",
      "840000:2": "500000"
    },
    "outpoints": [
      {
        "outpoint": "txid:0",
        "entries": [...]
      }
    ]
  }
}`}
          </CodeBlock>
        </div>

        {/* get_holders */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">{t.getHoldersTitle}</h3>
          <p className="text-muted-foreground mb-3">{t.getHoldersDesc}</p>
          <CodeBlock>
{`// Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "get_holders",
  "params": {
    "alkane": "840000:1",
    "page": 0,
    "limit": 100
  }
}

// Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "ok": true,
    "alkane": "840000:1",
    "page": 0,
    "limit": 100,
    "total": 1523,
    "has_more": true,
    "items": [
      {
        "address": "bc1q...",
        "amount": "1000000"
      },
      ...
    ]
  }
}`}
          </CodeBlock>
        </div>

        {/* ammdata.get_candles */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">{t.getCandlesTitle}</h3>
          <p className="text-muted-foreground mb-3">{t.getCandlesDesc}</p>
          <CodeBlock>
{`// Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "ammdata.get_candles",
  "params": {
    "pool": "840100:5",
    "timeframe": "1h",
    "side": "base",
    "limit": 100,
    "page": 0
  }
}

// Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "ok": true,
    "pool": "840100:5",
    "timeframe": "1h",
    "side": "base",
    "page": 0,
    "limit": 100,
    "total": 2400,
    "has_more": true,
    "candles": [
      {
        "open_time": "1234567890",
        "close_time": "1234571490",
        "open": "1000000",
        "high": "1050000",
        "low": "990000",
        "close": "1020000",
        "volume": "5000000",
        "trades": 45
      },
      ...
    ]
  }
}`}
          </CodeBlock>
        </div>

        {/* ammdata.find_best_swap_path */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">{t.findBestSwapPathTitle}</h3>
          <p className="text-muted-foreground mb-3">{t.findBestSwapPathDesc}</p>
          <CodeBlock>
{`// Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "ammdata.find_best_swap_path",
  "params": {
    "token_in": "840000:1",
    "token_out": "840000:2",
    "mode": "exact_in",
    "amount_in": "1000000",
    "amount_out_min": "900000",
    "fee_bps": 30,
    "max_hops": 3
  }
}

// Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "ok": true,
    "mode": "exact_in",
    "token_in": "840000:1",
    "token_out": "840000:2",
    "amount_in": "1000000",
    "amount_out": "950000",
    "fee_bps": 30,
    "max_hops": 3,
    "hops": [
      {
        "pool": "840100:5",
        "token_in": "840000:1",
        "token_out": "840000:3",
        "amount_in": "1000000",
        "amount_out": "1500000"
      },
      {
        "pool": "840100:6",
        "token_in": "840000:3",
        "token_out": "840000:2",
        "amount_in": "1500000",
        "amount_out": "950000"
      }
    ]
  }
}`}
          </CodeBlock>
        </div>

        {/* ammdata.get_best_mev_swap */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">{t.getBestMevSwapTitle}</h3>
          <p className="text-muted-foreground mb-3">{t.getBestMevSwapDesc}</p>
          <CodeBlock>
{`// Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "ammdata.get_best_mev_swap",
  "params": {
    "token": "840000:1",
    "fee_bps": 30,
    "max_hops": 3
  }
}

// Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "ok": true,
    "token": "840000:1",
    "fee_bps": 30,
    "max_hops": 3,
    "amount_in": "1000000",
    "amount_out": "1050000",
    "profit": "50000",
    "hops": [
      {
        "pool": "840100:5",
        "token_in": "840000:1",
        "token_out": "840000:2",
        "amount_in": "1000000",
        "amount_out": "2000000"
      },
      {
        "pool": "840100:6",
        "token_in": "840000:2",
        "token_out": "840000:1",
        "amount_in": "2000000",
        "amount_out": "1050000"
      }
    ]
  }
}`}
          </CodeBlock>
        </div>
      </section>

      {/* Notes */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">{t.notesTitle}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {t.notes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
