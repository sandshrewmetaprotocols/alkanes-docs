"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Espo Commands",
    intro: "The espo namespace provides access to the Espo indexer for alkanes data and AMM analytics. Espo offers two modules: Essentials for core alkanes data and AMM Data for trading analytics.",
    configTitle: "Configuration",
    configDesc: "Configure the Espo RPC endpoint. When using Subfrost, the SDK automatically appends /espo to your base RPC URL:",
    urlRoutingTitle: "URL Routing",
    urlRoutingDesc: "The @alkanes/ts-sdk automatically routes espo requests to the /espo path. When you configure:",
    urlRoutingNote: "All provider.espo.* method calls will be routed to: https://{network}.subfrost.io/v4/{api_key}/espo",
    essentialsTitle: "Essentials Module",
    essentialsDesc: "Core alkanes data queries including balances, holders, and storage.",
    essentialsCommands: [
      { cmd: "ping", desc: "Ping the Espo server" },
      { cmd: "get-height", desc: "Get current Espo indexer height" },
      { cmd: "get-address-balances", desc: "Get alkanes balances for an address" },
      { cmd: "get-address-outpoints", desc: "Get outpoints containing alkanes for an address" },
      { cmd: "get-outpoint-balances", desc: "Get alkanes balances at a specific outpoint" },
      { cmd: "get-holders", desc: "Get holders of an alkane token (paginated)" },
      { cmd: "get-holders-count", desc: "Get total holder count for an alkane" },
      { cmd: "get-keys", desc: "Get storage keys for an alkane contract (paginated)" }
    ],
    ammdataTitle: "AMM Data Module",
    ammdataDesc: "Trading and liquidity analytics for AMM pools.",
    ammdataCommands: [
      { cmd: "ammdata-ping", desc: "Ping the AMM Data module" },
      { cmd: "get-candles", desc: "Get OHLCV candlestick data for a pool" },
      { cmd: "get-trades", desc: "Get trade history for a pool" },
      { cmd: "get-pools", desc: "Get all pools with pagination" },
      { cmd: "find-best-swap-path", desc: "Find optimal multi-hop swap route" },
      { cmd: "get-best-mev-swap", desc: "Find best MEV arbitrage opportunity" }
    ],

    // Command details
    pingTitle: "espo ping",
    pingDesc: "Ping the Espo server to check connectivity.",

    getHeightTitle: "espo get-height",
    getHeightDesc: "Get the current block height processed by the Espo indexer.",

    getAddressBalancesTitle: "espo get-address-balances",
    getAddressBalancesDesc: "Get alkanes balances for a Bitcoin address. Optionally include detailed outpoint information.",

    getAddressOutpointsTitle: "espo get-address-outpoints",
    getAddressOutpointsDesc: "Get all outpoints containing alkanes for an address.",

    getOutpointBalancesTitle: "espo get-outpoint-balances",
    getOutpointBalancesDesc: "Get alkanes balances at a specific outpoint (format: txid:vout).",

    getHoldersTitle: "espo get-holders",
    getHoldersDesc: "Get paginated list of holders for an alkane token.",

    getHoldersCountTitle: "espo get-holders-count",
    getHoldersCountDesc: "Get the total number of unique holders for an alkane token.",

    getKeysTitle: "espo get-keys",
    getKeysDesc: "Get storage keys for an alkane contract with pagination and optional UTF-8 decoding.",

    ammdataPingTitle: "espo ammdata-ping",
    ammdataPingDesc: "Ping the AMM Data module to check connectivity.",

    getCandlesTitle: "espo get-candles",
    getCandlesDesc: "Get OHLCV candlestick data for a liquidity pool.",

    getTradesTitle: "espo get-trades",
    getTradesDesc: "Get trade history for a pool with filtering and sorting options.",

    getPoolsTitle: "espo get-pools",
    getPoolsDesc: "Get all AMM pools with pagination.",

    findBestSwapPathTitle: "espo find-best-swap-path",
    findBestSwapPathDesc: "Find the optimal multi-hop swap path between two tokens.",

    getBestMevSwapTitle: "espo get-best-mev-swap",
    getBestMevSwapDesc: "Find the best MEV arbitrage opportunity for a token.",

    examplesTitle: "Examples",
    notesTitle: "Notes",
    notes: [
      "Espo indexer must be configured and running",
      "All pagination uses 0-based page numbers",
      "Alkane IDs are in format 'block:tx' (e.g., '840000:1')",
      "Outpoints are in format 'txid:vout'",
      "AMM Data methods require AMM pools to be indexed"
    ],
    rpcMethodsTitle: "RPC Method Mapping",
    rpcMethodsDesc: "Each espo subcommand maps to a JSON-RPC method:",
    essentialsMethodsTable: [
      { cmd: "ping", method: "ping" },
      { cmd: "get-height", method: "get_espo_height" },
      { cmd: "get-address-balances", method: "get_address_balances" },
      { cmd: "get-address-outpoints", method: "get_address_outpoints" },
      { cmd: "get-outpoint-balances", method: "get_outpoint_balances" },
      { cmd: "get-holders", method: "get_holders" },
      { cmd: "get-holders-count", method: "get_holders_count" },
      { cmd: "get-keys", method: "get_keys" }
    ],
    ammdataMethodsTable: [
      { cmd: "ammdata-ping", method: "ammdata.ping" },
      { cmd: "get-candles", method: "ammdata.get_candles" },
      { cmd: "get-trades", method: "ammdata.get_trades" },
      { cmd: "get-pools", method: "ammdata.get_pools" },
      { cmd: "find-best-swap-path", method: "ammdata.find_best_swap_path" },
      { cmd: "get-best-mev-swap", method: "ammdata.get_best_mev_swap" }
    ]
  },
  zh: {
    title: "Espo 命令",
    intro: "espo 命名空间提供对 Espo 索引器的访问，用于 alkanes 数据和 AMM 分析。Espo 提供两个模块：用于核心 alkanes 数据的 Essentials 和用于交易分析的 AMM Data。",
    configTitle: "配置",
    configDesc: "配置 Espo RPC 端点。使用 Subfrost 时，SDK 会自动在您的基础 RPC URL 后追加 /espo：",
    urlRoutingTitle: "URL 路由",
    urlRoutingDesc: "@alkanes/ts-sdk 会自动将 espo 请求路由到 /espo 路径。当您配置：",
    urlRoutingNote: "所有 provider.espo.* 方法调用将路由到：https://{network}.subfrost.io/v4/{api_key}/espo",
    essentialsTitle: "Essentials 模块",
    essentialsDesc: "核心 alkanes 数据查询，包括余额、持有者和存储。",
    essentialsCommands: [
      { cmd: "ping", desc: "Ping Espo 服务器" },
      { cmd: "get-height", desc: "获取当前 Espo 索引器高度" },
      { cmd: "get-address-balances", desc: "获取地址的 alkanes 余额" },
      { cmd: "get-address-outpoints", desc: "获取地址包含 alkanes 的 outpoints" },
      { cmd: "get-outpoint-balances", desc: "获取特定 outpoint 的 alkanes 余额" },
      { cmd: "get-holders", desc: "获取 alkane 代币的持有者（分页）" },
      { cmd: "get-holders-count", desc: "获取 alkane 的总持有者数量" },
      { cmd: "get-keys", desc: "获取 alkane 合约的存储键（分页）" }
    ],
    ammdataTitle: "AMM Data 模块",
    ammdataDesc: "AMM 池的交易和流动性分析。",
    ammdataCommands: [
      { cmd: "ammdata-ping", desc: "Ping AMM Data 模块" },
      { cmd: "get-candles", desc: "获取池的 OHLCV K线数据" },
      { cmd: "get-trades", desc: "获取池的交易历史" },
      { cmd: "get-pools", desc: "获取所有池（分页）" },
      { cmd: "find-best-swap-path", desc: "寻找最优多跳交换路径" },
      { cmd: "get-best-mev-swap", desc: "寻找最佳 MEV 套利机会" }
    ],

    pingTitle: "espo ping",
    pingDesc: "Ping Espo 服务器以检查连接。",

    getHeightTitle: "espo get-height",
    getHeightDesc: "获取 Espo 索引器处理的当前区块高度。",

    getAddressBalancesTitle: "espo get-address-balances",
    getAddressBalancesDesc: "获取比特币地址的 alkanes 余额。可选包含详细的 outpoint 信息。",

    getAddressOutpointsTitle: "espo get-address-outpoints",
    getAddressOutpointsDesc: "获取地址的所有包含 alkanes 的 outpoints。",

    getOutpointBalancesTitle: "espo get-outpoint-balances",
    getOutpointBalancesDesc: "获取特定 outpoint 的 alkanes 余额（格式：txid:vout）。",

    getHoldersTitle: "espo get-holders",
    getHoldersDesc: "获取 alkane 代币的分页持有者列表。",

    getHoldersCountTitle: "espo get-holders-count",
    getHoldersCountDesc: "获取 alkane 代币的唯一持有者总数。",

    getKeysTitle: "espo get-keys",
    getKeysDesc: "获取 alkane 合约的存储键，支持分页和可选的 UTF-8 解码。",

    ammdataPingTitle: "espo ammdata-ping",
    ammdataPingDesc: "Ping AMM Data 模块以检查连接。",

    getCandlesTitle: "espo get-candles",
    getCandlesDesc: "获取流动性池的 OHLCV K线数据。",

    getTradesTitle: "espo get-trades",
    getTradesDesc: "获取池的交易历史，支持过滤和排序选项。",

    getPoolsTitle: "espo get-pools",
    getPoolsDesc: "获取所有 AMM 池，支持分页。",

    findBestSwapPathTitle: "espo find-best-swap-path",
    findBestSwapPathDesc: "寻找两个代币之间的最优多跳交换路径。",

    getBestMevSwapTitle: "espo get-best-mev-swap",
    getBestMevSwapDesc: "寻找代币的最佳 MEV 套利机会。",

    examplesTitle: "示例",
    notesTitle: "注意事项",
    notes: [
      "必须配置并运行 Espo 索引器",
      "所有分页使用从 0 开始的页码",
      "Alkane ID 格式为 'block:tx'（例如：'840000:1'）",
      "Outpoint 格式为 'txid:vout'",
      "AMM Data 方法需要索引 AMM 池"
    ],
    rpcMethodsTitle: "RPC 方法映射",
    rpcMethodsDesc: "每个 espo 子命令对应一个 JSON-RPC 方法：",
    essentialsMethodsTable: [
      { cmd: "ping", method: "ping" },
      { cmd: "get-height", method: "get_espo_height" },
      { cmd: "get-address-balances", method: "get_address_balances" },
      { cmd: "get-address-outpoints", method: "get_address_outpoints" },
      { cmd: "get-outpoint-balances", method: "get_outpoint_balances" },
      { cmd: "get-holders", method: "get_holders" },
      { cmd: "get-holders-count", method: "get_holders_count" },
      { cmd: "get-keys", method: "get_keys" }
    ],
    ammdataMethodsTable: [
      { cmd: "ammdata-ping", method: "ammdata.ping" },
      { cmd: "get-candles", method: "ammdata.get_candles" },
      { cmd: "get-trades", method: "ammdata.get_trades" },
      { cmd: "get-pools", method: "ammdata.get_pools" },
      { cmd: "find-best-swap-path", method: "ammdata.find_best_swap_path" },
      { cmd: "get-best-mev-swap", method: "ammdata.get_best_mev_swap" }
    ]
  }
};

export default function EspoPage() {
  const locale = useLocale() as keyof typeof content;
  const t = content[locale] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-muted-foreground">{t.intro}</p>
      </div>

      {/* Configuration */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">{t.configTitle}</h2>
        <p className="mb-4">{t.configDesc}</p>
        <div className="bg-secondary p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
{`# Using Subfrost (recommended)
# Base URL format: https://{network}.subfrost.io/v4/{api_key}
# The SDK automatically appends /espo for espo methods
export ALKANES_RPC_URL=https://mainnet.subfrost.io/v4/your_api_key

# Or for local development
export ESPO_RPC_URL=http://localhost:8080

# Or use in command
alkanes-cli --espo-rpc-url http://localhost:8080 espo ping`}
          </pre>
        </div>
      </section>

      {/* URL Routing */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">{t.urlRoutingTitle}</h2>
        <p className="mb-4">{t.urlRoutingDesc}</p>
        <div className="bg-secondary p-4 rounded-lg mb-4">
          <pre className="text-sm overflow-x-auto">
{`const provider = new AlkanesProvider({
  network: 'mainnet',
  rpcUrl: 'https://mainnet.subfrost.io/v4/your_api_key'
});`}
          </pre>
        </div>
        <p className="text-sm text-muted-foreground p-3 bg-primary/10 rounded-lg">
          {t.urlRoutingNote}
        </p>
      </section>

      {/* Essentials Module */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">{t.essentialsTitle}</h2>
        <p className="mb-4">{t.essentialsDesc}</p>
        <div className="space-y-2">
          {t.essentialsCommands.map((cmd, i) => (
            <div key={i} className="flex gap-3 p-3 bg-secondary rounded">
              <code className="text-primary font-mono">{cmd.cmd}</code>
              <span className="text-muted-foreground">—</span>
              <span>{cmd.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AMM Data Module */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">{t.ammdataTitle}</h2>
        <p className="mb-4">{t.ammdataDesc}</p>
        <div className="space-y-2">
          {t.ammdataCommands.map((cmd, i) => (
            <div key={i} className="flex gap-3 p-3 bg-secondary rounded">
              <code className="text-primary font-mono">{cmd.cmd}</code>
              <span className="text-muted-foreground">—</span>
              <span>{cmd.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">{t.examplesTitle}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">{t.pingTitle}</h3>
            <p className="mb-2 text-muted-foreground">{t.pingDesc}</p>
            <div className="bg-secondary p-4 rounded-lg">
              <pre className="text-sm">alkanes-cli espo ping</pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">{t.getAddressBalancesTitle}</h3>
            <p className="mb-2 text-muted-foreground">{t.getAddressBalancesDesc}</p>
            <div className="bg-secondary p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
{`# Get balances for an address
alkanes-cli espo get-address-balances bc1q...

# Include outpoint details
alkanes-cli espo get-address-balances bc1q... --include-outpoints`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">{t.getHoldersTitle}</h3>
            <p className="mb-2 text-muted-foreground">{t.getHoldersDesc}</p>
            <div className="bg-secondary p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
{`# Get first page of holders (100 per page)
alkanes-cli espo get-holders 840000:1

# Get specific page
alkanes-cli espo get-holders 840000:1 --page 2 --limit 50`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">{t.getCandlesTitle}</h3>
            <p className="mb-2 text-muted-foreground">{t.getCandlesDesc}</p>
            <div className="bg-secondary p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
{`# Get 1-hour candles for base token
alkanes-cli espo get-candles 840100:5 --timeframe 1h --side base --limit 100

# Get daily candles for quote token
alkanes-cli espo get-candles 840100:5 --timeframe 1d --side quote --limit 30`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">{t.findBestSwapPathTitle}</h3>
            <p className="mb-2 text-muted-foreground">{t.findBestSwapPathDesc}</p>
            <div className="bg-secondary p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
{`# Find best path with exact input
alkanes-cli espo find-best-swap-path \\
  --token-in 840000:1 \\
  --token-out 840000:2 \\
  --mode exact_in \\
  --amount-in 1000000 \\
  --amount-out-min 900000 \\
  --max-hops 3`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* RPC Method Mapping */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">{t.rpcMethodsTitle}</h2>
        <p className="mb-4">{t.rpcMethodsDesc}</p>

        <h3 className="text-lg font-semibold mb-3 mt-6">{t.essentialsTitle}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse mb-6">
            <thead>
              <tr className="border-b border-muted">
                <th className="text-left p-3 font-semibold">CLI Command</th>
                <th className="text-left p-3 font-semibold">JSON-RPC Method</th>
              </tr>
            </thead>
            <tbody>
              {t.essentialsMethodsTable.map((row, i) => (
                <tr key={i} className="border-b border-muted/50">
                  <td className="p-3"><code className="text-primary">espo {row.cmd}</code></td>
                  <td className="p-3"><code>{row.method}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold mb-3">{t.ammdataTitle}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-muted">
                <th className="text-left p-3 font-semibold">CLI Command</th>
                <th className="text-left p-3 font-semibold">JSON-RPC Method</th>
              </tr>
            </thead>
            <tbody>
              {t.ammdataMethodsTable.map((row, i) => (
                <tr key={i} className="border-b border-muted/50">
                  <td className="p-3"><code className="text-primary">espo {row.cmd}</code></td>
                  <td className="p-3"><code>{row.method}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
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
