"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Fetching Alkane Data with alkanes-web-sys",
    intro: "This guide explains how we fetch DIESEL token statistics, pool data, and market metrics using the alkanes-web-sys bindings and Lua scripts for optimized page loads.",
    overviewTitle: "Overview",
    overviewContent: "The alkanes.build dashboard displays real-time data including DIESEL price, market cap, total supply, and TVL (Total Value Locked). We use a combination of:",
    overviewItems: [
      "metashrew_view RPC calls to query alkane contract state",
      "Lua scripts via lua_evalscript for batched queries",
      "Protobuf-encoded payloads for contract method invocation"
    ],
    architectureTitle: "Architecture",
    architectureContent: "Data flows through these layers:",
    dieselTitle: "Fetching DIESEL Total Supply",
    dieselContent: "The DIESEL token is the genesis alkane at position [2, 0]. To fetch its total supply, we call the GetTotalSupply opcode (101) via metashrew_view's simulate function.",
    dieselSteps: [
      "Build a protobuf payload encoding the alkane ID and opcode",
      "Call metashrew_view with the 'simulate' view function",
      "Parse the u128 little-endian response"
    ],
    payloadTitle: "Building the Protobuf Payload",
    payloadContent: "The payload format follows the alkanes-web-sys protobuf schema. For DIESEL's GetTotalSupply:",
    payloadExplain: "This encodes: version byte, alkane ID [2, 0], opcode 101 (0x65), and execution flags.",
    cliTitle: "Finding Opcodes with CLI",
    cliContent: "Use the alkanes CLI to discover available opcodes and generate payloads:",
    parsingTitle: "Parsing the Response",
    parsingContent: "The response contains a protobuf wrapper with the u128 value in little-endian format:",
    poolDataTitle: "Fetching Pool Data",
    poolDataContent: "AMM pool reserves are fetched by calling opcode 1000 on pool contracts. Each pool returns:",
    poolDataItems: [
      "reserve0 - Amount of token0 (e.g., DIESEL)",
      "reserve1 - Amount of token1 (e.g., frBTC)",
      "totalSupply - LP token total supply"
    ],
    poolPayloads: "Pool payloads follow the same pattern with different alkane IDs:",
    luaTitle: "Optimized Fetching with Lua Scripts",
    luaContent: "To minimize RPC round-trips, we use a Lua script that fetches all data in a single call:",
    luaAdvantages: "Advantages of Lua scripts:",
    luaAdvantagesList: [
      "Single RPC call instead of multiple parallel calls",
      "Atomic snapshot of data at the same block height",
      "Server-side JSON encoding for efficient response"
    ],
    luaExecution: "The Lua script is executed via lua_evalscript:",
    calculationsTitle: "Price and TVL Calculations",
    calculationsContent: "With the fetched data, we calculate:",
    priceCalcTitle: "DIESEL Price",
    priceCalc: "Calculated from pool reserves using the constant product formula:",
    tvlCalcTitle: "Total Value Locked",
    tvlCalc: "Sum of both sides of each pool valued in USD:",
    marketCapTitle: "Market Cap",
    marketCapCalc: "Total supply multiplied by current price:",
    integrationTitle: "Integration in Next.js",
    integrationContent: "The data fetching is implemented in lib/pools/candle-fetcher.ts and lib/pools/pool-service.ts:",
    cachingTitle: "Caching Strategy",
    cachingContent: "Results are cached in Redis with appropriate TTLs:",
    cachingItems: [
      "Pool prices: 30 seconds",
      "Market stats: 60 seconds",
      "TVL stats: 60 seconds",
      "BTC price: 60 seconds"
    ],
    testingTitle: "Testing",
    testingContent: "Integration tests verify the data fetching works correctly against live RPC:",
    resourcesTitle: "Resources",
    resources: [
      { text: "alkanes-rs GitHub", href: "https://github.com/kungfuflex/alkanes-rs", desc: "Alkanes protocol implementation" },
      { text: "alkanes-std-genesis-alkane", href: "https://github.com/kungfuflex/alkanes-rs/tree/develop/alkanes/alkanes-std-genesis-alkane", desc: "DIESEL token source code" },
      { text: "Subfrost API", href: "https://mainnet.subfrost.io", desc: "Hosted RPC endpoint" }
    ]
  },
  zh: {
    title: "使用 alkanes-web-sys 获取 Alkane 数据",
    intro: "本指南介绍如何使用 alkanes-web-sys 绑定和 Lua 脚本获取 DIESEL 代币统计数据、池数据和市场指标，以优化页面加载。",
    overviewTitle: "概述",
    overviewContent: "alkanes.build 仪表板显示实时数据，包括 DIESEL 价格、市值、总供应量和 TVL（总锁定价值）。我们使用以下组合：",
    overviewItems: [
      "metashrew_view RPC 调用来查询 alkane 合约状态",
      "通过 lua_evalscript 使用 Lua 脚本进行批量查询",
      "用于合约方法调用的 Protobuf 编码载荷"
    ],
    architectureTitle: "架构",
    architectureContent: "数据通过以下层流动：",
    dieselTitle: "获取 DIESEL 总供应量",
    dieselContent: "DIESEL 代币是位于 [2, 0] 位置的创世 alkane。要获取其总供应量，我们通过 metashrew_view 的 simulate 函数调用 GetTotalSupply 操作码 (101)。",
    dieselSteps: [
      "构建编码 alkane ID 和操作码的 protobuf 载荷",
      "使用 'simulate' 视图函数调用 metashrew_view",
      "解析 u128 小端响应"
    ],
    payloadTitle: "构建 Protobuf 载荷",
    payloadContent: "载荷格式遵循 alkanes-web-sys protobuf 模式。对于 DIESEL 的 GetTotalSupply：",
    payloadExplain: "这编码了：版本字节、alkane ID [2, 0]、操作码 101 (0x65) 和执行标志。",
    cliTitle: "使用 CLI 查找操作码",
    cliContent: "使用 alkanes CLI 发现可用的操作码并生成载荷：",
    parsingTitle: "解析响应",
    parsingContent: "响应包含一个 protobuf 包装器，其中 u128 值为小端格式：",
    poolDataTitle: "获取池数据",
    poolDataContent: "通过调用池合约上的操作码 1000 获取 AMM 池储备。每个池返回：",
    poolDataItems: [
      "reserve0 - token0 的数量（例如 DIESEL）",
      "reserve1 - token1 的数量（例如 frBTC）",
      "totalSupply - LP 代币总供应量"
    ],
    poolPayloads: "池载荷遵循相同的模式，但使用不同的 alkane ID：",
    luaTitle: "使用 Lua 脚本优化获取",
    luaContent: "为了最大限度地减少 RPC 往返，我们使用 Lua 脚本在单次调用中获取所有数据：",
    luaAdvantages: "Lua 脚本的优势：",
    luaAdvantagesList: [
      "单次 RPC 调用而非多个并行调用",
      "在同一区块高度原子快照数据",
      "服务器端 JSON 编码以实现高效响应"
    ],
    luaExecution: "Lua 脚本通过 lua_evalscript 执行：",
    calculationsTitle: "价格和 TVL 计算",
    calculationsContent: "使用获取的数据，我们计算：",
    priceCalcTitle: "DIESEL 价格",
    priceCalc: "使用恒定乘积公式从池储备计算：",
    tvlCalcTitle: "总锁定价值",
    tvlCalc: "每个池两侧以美元计价的价值总和：",
    marketCapTitle: "市值",
    marketCapCalc: "总供应量乘以当前价格：",
    integrationTitle: "Next.js 中的集成",
    integrationContent: "数据获取在 lib/pools/candle-fetcher.ts 和 lib/pools/pool-service.ts 中实现：",
    cachingTitle: "缓存策略",
    cachingContent: "结果使用适当的 TTL 缓存在 Redis 中：",
    cachingItems: [
      "池价格：30 秒",
      "市场统计：60 秒",
      "TVL 统计：60 秒",
      "BTC 价格：60 秒"
    ],
    testingTitle: "测试",
    testingContent: "集成测试验证数据获取是否针对实时 RPC 正常工作：",
    resourcesTitle: "资源",
    resources: [
      { text: "alkanes-rs GitHub", href: "https://github.com/kungfuflex/alkanes-rs", desc: "Alkanes 协议实现" },
      { text: "alkanes-std-genesis-alkane", href: "https://github.com/kungfuflex/alkanes-rs/tree/develop/alkanes/alkanes-std-genesis-alkane", desc: "DIESEL 代币源代码" },
      { text: "Subfrost API", href: "https://mainnet.subfrost.io", desc: "托管 RPC 端点" }
    ]
  }
};

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="my-4">
      {title && <div className="text-xs text-[color:var(--sf-muted)] mb-1">{title}</div>}
      <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function AlkanesWebSysPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      {/* Overview */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.overviewTitle}</h2>
        <p className="mb-4">{t.overviewContent}</p>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.overviewItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Architecture */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.architectureTitle}</h2>
        <p className="mb-4">{t.architectureContent}</p>
        <CodeBlock>{`┌─────────────────────────────────────────────────────────────┐
│                     React Components                         │
│              (DieselPriceCard, VaultPerformance)            │
├─────────────────────────────────────────────────────────────┤
│                   React Query Hooks                          │
│        (usePoolPrices, useMarketStats, useTvlStats)         │
├─────────────────────────────────────────────────────────────┤
│                    API Routes (Next.js)                      │
│           /api/pools, /api/pools/stats, /api/btc-price      │
├─────────────────────────────────────────────────────────────┤
│                    Pool Service Layer                        │
│        (getDashboardStats, getDieselMarketStats)            │
├─────────────────────────────────────────────────────────────┤
│                   Candle Fetcher Module                      │
│          (fetchDieselStats, STATS_LUA_SCRIPT)               │
├─────────────────────────────────────────────────────────────┤
│                  Subfrost RPC (metashrew)                    │
│         metashrew_view, lua_evalscript, simulate            │
├─────────────────────────────────────────────────────────────┤
│                    Bitcoin Network                           │
│             (Block data, Alkane contract state)             │
└─────────────────────────────────────────────────────────────┘`}</CodeBlock>
      </div>

      {/* Fetching DIESEL Total Supply */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.dieselTitle}</h2>
        <p className="mb-4">{t.dieselContent}</p>
        <ol className="list-decimal list-inside space-y-2 text-[color:var(--sf-muted)] mb-4">
          {t.dieselSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {/* Building the Payload */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.payloadTitle}</h2>
        <p className="mb-4">{t.payloadContent}</p>
        <CodeBlock title="DIESEL Token Configuration">{`// lib/pools/candle-fetcher.ts
export const DIESEL_TOKEN = {
  block: 2,
  tx: 0,
  id: '2:0',
  symbol: 'DIESEL',
  decimals: 8,
  // Protobuf payload for GetTotalSupply opcode (101)
  // Format: 0x20 <version> 2a <len> 02 <block> 00 <tx> 65 <opcode 101> 30 01
  // Obtained via: mainnet-cli.sh alkanes simulate 2:0:101
  totalSupplyPayload: '0x20e3ce382a030200653001',
} as const;`}</CodeBlock>
        <p className="text-[color:var(--sf-muted)]">{t.payloadExplain}</p>
      </div>

      {/* CLI for discovering opcodes */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.cliTitle}</h2>
        <p className="mb-4">{t.cliContent}</p>
        <CodeBlock title="Find available opcodes">{`# Fuzz an alkane to discover valid opcodes
mainnet-cli.sh alkanes inspect 2:0 --fuzz --fuzz-ranges 0-200

# Simulate a specific opcode to get the payload
mainnet-cli.sh alkanes simulate 2:0:101

# Output shows the protobuf payload:
# Method: metashrew_view, Params: ["simulate", "0x20e3ce382a030200653001", "latest"]
# Result: 0x0a121a10a03b944b483400000000000000000000108a8803`}</CodeBlock>

        <CodeBlock title="DIESEL Genesis Alkane Opcodes (from alkanes-std-genesis-alkane)">{`// Source: alkanes/alkanes-std-genesis-alkane/src/lib.rs
#[derive(MessageDispatch)]
enum GenesisAlkaneMessage {
    #[opcode(0)]
    Initialize,

    #[opcode(77)]
    Mint,

    #[opcode(99)]
    #[returns(String)]
    GetName,

    #[opcode(100)]
    #[returns(String)]
    GetSymbol,

    #[opcode(101)]
    #[returns(u128)]
    GetTotalSupply,  // <-- We use this opcode
}`}</CodeBlock>
      </div>

      {/* Parsing the response */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.parsingTitle}</h2>
        <p className="mb-4">{t.parsingContent}</p>
        <CodeBlock title="Response parsing">{`// Response: 0x0a121a10a03b944b483400000000000000000000108a8803
// Structure: 0a <outer_len> 1a <inner_len> <u128 LE value> 10 <varint>
// The u128 value: a03b944b48340000 0000000000000000

function parseTotalSupplyResponse(resultHex: string): bigint | null {
  let hex = resultHex.startsWith('0x') ? resultHex.slice(2) : resultHex;

  // Find the inner data after "1a" marker
  const marker1a = hex.indexOf('1a');
  if (marker1a === -1) return null;

  const valueStart = marker1a + 4; // Skip "1a" and length byte
  const valueEnd = hex.indexOf('10', valueStart);
  if (valueEnd === -1) return null;

  const valueHex = hex.slice(valueStart, valueEnd).padEnd(32, '0');

  // Reverse byte pairs for little-endian
  let reversed = '';
  for (let i = valueHex.length - 2; i >= 0; i -= 2) {
    reversed += valueHex.slice(i, i + 2);
  }

  return BigInt('0x' + reversed);
}

// Result: 57485110295456n (574,851.10 DIESEL with 8 decimals)`}</CodeBlock>
      </div>

      {/* Pool Data */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.poolDataTitle}</h2>
        <p className="mb-4">{t.poolDataContent}</p>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)] mb-4">
          {t.poolDataItems.map((item, i) => (
            <li key={i}><code className="text-[color:var(--sf-primary)]">{item.split(' - ')[0]}</code> - {item.split(' - ')[1]}</li>
          ))}
        </ul>
        <p className="mb-4">{t.poolPayloads}</p>
        <CodeBlock title="Pool configurations">{`// Pool alkane IDs and payloads
export const POOL_CONFIGS = {
  DIESEL_FRBTC: {
    id: '79247:0',    // Alkane ID [79247, 0]
    payload: '0x2096ce382a06029fda04e7073001',  // opcode 1000
    token0: { symbol: 'DIESEL', decimals: 8 },
    token1: { symbol: 'frBTC', decimals: 8 },
  },
  DIESEL_BUSD: {
    id: '76505:0',    // Alkane ID [76505, 0]
    payload: '0x2096ce382a0602d99604e7073001',  // opcode 1000
    token0: { symbol: 'DIESEL', decimals: 8 },
    token1: { symbol: 'bUSD', decimals: 8 },
  },
} as const;`}</CodeBlock>
      </div>

      {/* Lua Script Optimization */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.luaTitle}</h2>
        <p className="mb-4">{t.luaContent}</p>
        <CodeBlock title="STATS_LUA_SCRIPT">{`export const STATS_LUA_SCRIPT = \`
-- Fetch DIESEL stats and pool TVL in a single call
local results = {
  diesel = {},
  pools = {},
  height = 0
}

-- Helper to parse little-endian u128 from hex string
local function parse_u128_le(hex_str, byte_offset)
    local hex_offset = byte_offset * 2
    local hex_len = 32
    if #hex_str < hex_offset + hex_len then return nil end
    local hex_slice = hex_str:sub(hex_offset + 1, hex_offset + hex_len)
    local reversed = ""
    for i = #hex_slice - 1, 1, -2 do
        reversed = reversed .. hex_slice:sub(i, i + 1)
    end
    return tonumber(reversed, 16) or 0
end

-- Get current height
results.height = tonumber(_RPC.metashrew_height()) or 0

-- Fetch DIESEL total supply (opcode 101)
local diesel_response = _RPC.metashrew_view(
    "simulate",
    "0x20e3ce382a030200653001",
    "latest"
)
if diesel_response then
    results.diesel.total_supply = parse_total_supply(diesel_response)
end

-- Fetch DIESEL/frBTC pool reserves
local frbtc_response = _RPC.metashrew_view(
    "simulate",
    "0x2096ce382a06029fda04e7073001",
    "latest"
)
if frbtc_response then
    -- Parse reserves from response
    results.pools.DIESEL_FRBTC = {
        reserve_a = parse_u128_le(inner_hex, 64),
        reserve_b = parse_u128_le(inner_hex, 80),
        total_supply = parse_u128_le(inner_hex, 96)
    }
end

-- Fetch DIESEL/bUSD pool reserves
local busd_response = _RPC.metashrew_view(
    "simulate",
    "0x2096ce382a0602d99604e7073001",
    "latest"
)
-- ... parse similarly

return cjson.encode(results)
\`;`}</CodeBlock>

        <p className="font-semibold mb-2">{t.luaAdvantages}</p>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)] mb-4">
          {t.luaAdvantagesList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <p className="mb-4">{t.luaExecution}</p>
        <CodeBlock title="Executing the Lua script">{`const response = await fetch(rpcUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'lua_evalscript',
    params: [STATS_LUA_SCRIPT],
  }),
});

const json = await response.json();
const luaResult = JSON.parse(json.result);

// luaResult contains:
// {
//   diesel: { total_supply: 57485110295456 },
//   pools: {
//     DIESEL_FRBTC: { reserve_a: 259032503803, reserve_b: 12392199, total_supply: 1719377281 },
//     DIESEL_BUSD: { reserve_a: 378956334102, reserve_b: 1630422433262, total_supply: ... }
//   },
//   height: 927587
// }`}</CodeBlock>
      </div>

      {/* Calculations */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.calculationsTitle}</h2>
        <p className="mb-4">{t.calculationsContent}</p>

        <h3 className="text-xl font-medium mb-2">{t.priceCalcTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-2">{t.priceCalc}</p>
        <CodeBlock>{`// DIESEL price in frBTC (from DIESEL/frBTC pool)
const dieselPriceBtc = reserve1 / reserve0;
// = 12392199 / 259032503803 = 0.00004784 BTC

// DIESEL price in USD
const dieselPriceUsd = dieselPriceBtc * btcPriceUsd;
// = 0.00004784 * 92146.60 = $4.41`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2 mt-6">{t.tvlCalcTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-2">{t.tvlCalc}</p>
        <CodeBlock>{`// TVL = both sides of pool valued in USD
// For constant product AMM, both sides have equal value
export function calculatePoolTvl(
  reserve0: bigint,
  reserve1: bigint,
  decimals0: number,
  decimals1: number,
  token1PriceUsd: number
): { tvlToken0: number; tvlToken1: number; tvlUsd: number } {
  const tvlToken0 = Number(reserve0) / Math.pow(10, decimals0);
  const tvlToken1 = Number(reserve1) / Math.pow(10, decimals1);

  // TVL = 2 * value of one side (both sides equal in constant product)
  const tvlUsd = tvlToken1 * token1PriceUsd * 2;

  return { tvlToken0, tvlToken1, tvlUsd };
}

// DIESEL/frBTC: 2 * 0.124 BTC * $92,146 = $22,838
// DIESEL/bUSD: 2 * 16,304 bUSD * $1 = $32,608
// Total TVL: $55,446`}</CodeBlock>

        <h3 className="text-xl font-medium mb-2 mt-6">{t.marketCapTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-2">{t.marketCapCalc}</p>
        <CodeBlock>{`const totalSupply = 574851.10; // DIESEL (with 8 decimals applied)
const priceUsd = 4.41;
const marketCap = totalSupply * priceUsd;
// = 574,851.10 * 4.41 = $2,535,093`}</CodeBlock>
      </div>

      {/* Integration */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.integrationTitle}</h2>
        <p className="mb-4">{t.integrationContent}</p>
        <CodeBlock title="lib/pools/pool-service.ts">{`// Optimized: Single Lua script call for all data
export async function getDashboardStats(): Promise<DashboardStats> {
  const cacheKey = 'dashboard:stats';

  // Try cache first
  const cached = await cacheGet<SerializedDashboardStats>(cacheKey);
  if (cached) return deserialize(cached);

  // Fetch all data with single Lua script call
  const [stats, btcPrice] = await Promise.all([
    fetchDieselStats(config),  // Lua script: DIESEL supply + both pools
    getBitcoinPrice(),         // External API call
  ]);

  // Calculate market stats
  const dieselPriceBtc = calculatePrice(
    stats.pools.DIESEL_FRBTC.reserve0,
    stats.pools.DIESEL_FRBTC.reserve1,
    8, 8
  );
  const dieselPriceUsd = dieselPriceBtc * btcPrice.usd;
  const totalSupplyFormatted = Number(stats.dieselTotalSupply) / 1e8;
  const marketCapUsd = totalSupplyFormatted * dieselPriceUsd;

  // Calculate TVL for each pool
  const tvlFrbtc = calculatePoolTvl(..., btcPrice.usd);
  const tvlBusd = calculatePoolTvl(..., 1); // bUSD = $1
  const totalTvlUsd = tvlFrbtc.tvlUsd + tvlBusd.tvlUsd;

  // Cache and return
  await cacheSet(cacheKey, serialize(result), CACHE_TTL_STATS);
  return result;
}`}</CodeBlock>
      </div>

      {/* Caching */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.cachingTitle}</h2>
        <p className="mb-4">{t.cachingContent}</p>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.cachingItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Testing */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.testingTitle}</h2>
        <p className="mb-4">{t.testingContent}</p>
        <CodeBlock title="tests/integration/live-rpc.test.ts">{`describe("Live DIESEL Stats Integration Tests", () => {
  it("should fetch DIESEL total supply via metashrew_view", async () => {
    const totalSupply = await getDieselTotalSupply(rpcConfig);

    expect(totalSupply).toBeGreaterThan(BigInt(0));
    const formatted = Number(totalSupply) / 1e8;
    expect(formatted).toBeGreaterThan(500000); // ~574,851 DIESEL
  });

  it("should fetch all stats in a single RPC call", async () => {
    const stats = await fetchDieselStats(rpcConfig);

    expect(stats.dieselTotalSupply).toBeGreaterThan(BigInt(0));
    expect(stats.pools.DIESEL_FRBTC).not.toBeNull();
    expect(stats.pools.DIESEL_BUSD).not.toBeNull();
    expect(stats.height).toBeGreaterThan(900000);
  });

  it("should calculate all dashboard stats correctly", async () => {
    const stats = await fetchDieselStats(rpcConfig);
    const btcPrice = await fetchBitcoinPrice(priceConfig);

    // Verify all values
    expect(dieselPriceUsd).toBeGreaterThan(0);
    expect(marketCapUsd).toBeGreaterThan(0);
    expect(totalTvlUsd).toBeGreaterThan(0);
  });
});

// Run with: RUN_INTEGRATION=true pnpm vitest run tests/integration/live-rpc.test.ts`}</CodeBlock>
      </div>

      {/* Resources */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.resourcesTitle}</h2>
        <ul className="space-y-2">
          {t.resources.map((resource, i) => (
            <li key={i}>
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
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
