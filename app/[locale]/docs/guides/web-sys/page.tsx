"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const content = {
  en: {
    title: "alkanes-web-sys Integration",
    intro: "alkanes-web-sys provides WebAssembly bindings for interacting with Alkanes from both browser and Node.js environments. This guide covers installation, configuration, and common use cases including wallet management, transaction signing, and RPC communication.",
    sdkNote: "For a higher-level TypeScript interface, see the @alkanes/ts-sdk which wraps alkanes-web-sys with typed client classes.",
    sdkLink: "View TS SDK API Reference",

    installTitle: "Installation",
    installDesc: "Install the package using your preferred package manager:",

    featuresTitle: "Key Features",
    features: [
      { title: "WASM Performance", desc: "High-performance WebAssembly backend for cryptographic operations" },
      { title: "HD Wallet Support", desc: "BIP32/BIP39/BIP44 hierarchical deterministic wallets" },
      { title: "Transaction Signing", desc: "Sign Bitcoin and Alkanes transactions locally" },
      { title: "Cross-Platform", desc: "Works in browsers, Node.js, and edge runtimes" }
    ],

    setupTitle: "Basic Setup",
    setupDesc: "Initialize the WASM module and create a provider:",

    providerTitle: "Provider Configuration",
    providerDesc: "Configure the provider with your RPC endpoints:",

    walletTitle: "Wallet Management",
    walletDesc: "Create and manage HD wallets:",

    rpcTitle: "Making RPC Calls",
    rpcDesc: "Use the provider to make JSON-RPC calls:",
    rpcNote: "These RPC methods are wrapped with TypeScript types in the @alkanes/ts-sdk. For example, alkanes_protorunesbyaddress is available as provider.alkanes.getBalance().",

    luaTitle: "Executing Lua Scripts",
    luaDesc: "Run Lua scripts using lua_evalscript:",

    poolDataTitle: "Fetching Pool Data",
    poolDataDesc: "Complete example of fetching pool candle data:",

    txTitle: "Transaction Signing",
    txDesc: "Sign and broadcast transactions:",

    browserTitle: "Browser Usage",
    browserDesc: "Special considerations for browser environments:",

    nodeTitle: "Node.js Usage",
    nodeDesc: "Using alkanes-web-sys in Node.js applications:",

    troubleshootTitle: "Troubleshooting",
    troubleshootItems: [
      { issue: "WASM not loading", solution: "Ensure your bundler supports WASM imports. For webpack, add the experiments.asyncWebAssembly option." },
      { issue: "Memory errors", solution: "Large responses may exceed WASM memory limits. Process data in chunks or increase memory." },
      { issue: "Cross-origin errors", solution: "WASM files must be served with correct CORS headers in browser environments." }
    ],

    signupCta: "Get an API Key",
    signupDesc: "For production use with higher rate limits, sign up at"
  },
  zh: {
    title: "alkanes-web-sys 集成",
    intro: "alkanes-web-sys 为从浏览器和 Node.js 环境与 Alkanes 交互提供 WebAssembly 绑定。本指南涵盖安装、配置和常见用例，包括钱包管理、交易签名和 RPC 通信。",
    sdkNote: "对于更高级的 TypeScript 接口，请参阅 @alkanes/ts-sdk，它使用类型化的客户端类封装了 alkanes-web-sys。",
    sdkLink: "查看 TS SDK API 参考",

    installTitle: "安装",
    installDesc: "使用您喜欢的包管理器安装包：",

    featuresTitle: "主要功能",
    features: [
      { title: "WASM 性能", desc: "高性能 WebAssembly 后端用于加密操作" },
      { title: "HD 钱包支持", desc: "BIP32/BIP39/BIP44 分层确定性钱包" },
      { title: "交易签名", desc: "本地签署比特币和 Alkanes 交易" },
      { title: "跨平台", desc: "在浏览器、Node.js 和边缘运行时中工作" }
    ],

    setupTitle: "基本设置",
    setupDesc: "初始化 WASM 模块并创建 provider：",

    providerTitle: "Provider 配置",
    providerDesc: "使用您的 RPC 端点配置 provider：",

    walletTitle: "钱包管理",
    walletDesc: "创建和管理 HD 钱包：",

    rpcTitle: "进行 RPC 调用",
    rpcDesc: "使用 provider 进行 JSON-RPC 调用：",
    rpcNote: "这些 RPC 方法在 @alkanes/ts-sdk 中具有 TypeScript 类型包装。例如，alkanes_protorunesbyaddress 可通过 provider.alkanes.getBalance() 使用。",

    luaTitle: "执行 Lua 脚本",
    luaDesc: "使用 lua_evalscript 运行 Lua 脚本：",

    poolDataTitle: "获取池数据",
    poolDataDesc: "获取池蜡烛图数据的完整示例：",

    txTitle: "交易签名",
    txDesc: "签署和广播交易：",

    browserTitle: "浏览器使用",
    browserDesc: "浏览器环境的特殊注意事项：",

    nodeTitle: "Node.js 使用",
    nodeDesc: "在 Node.js 应用程序中使用 alkanes-web-sys：",

    troubleshootTitle: "故障排除",
    troubleshootItems: [
      { issue: "WASM 未加载", solution: "确保您的打包工具支持 WASM 导入。对于 webpack，添加 experiments.asyncWebAssembly 选项。" },
      { issue: "内存错误", solution: "大响应可能超过 WASM 内存限制。分块处理数据或增加内存。" },
      { issue: "跨域错误", solution: "在浏览器环境中，WASM 文件必须使用正确的 CORS 头提供服务。" }
    ],

    signupCta: "获取 API 密钥",
    signupDesc: "要在生产环境中使用更高的速率限制，请在以下网址注册"
  }
};

function CodeBlock({ children, language = "typescript" }: { children: string; language?: string }) {
  return (
    <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm my-4">
      <code className={`language-${language}`}>{children}</code>
    </pre>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default function WebSysPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
        <div className="mt-4 p-4 rounded-lg border border-[color:var(--sf-outline)] bg-[color:var(--sf-surface)]">
          <p className="text-sm text-[color:var(--sf-muted)]">
            {t.sdkNote}{" "}
            <Link
              href="/docs/api/ts-sdk"
              className="text-[color:var(--sf-primary)] hover:underline"
            >
              {t.sdkLink} →
            </Link>
          </p>
        </div>
      </div>

      <Section title={t.installTitle}>
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.installDesc}</p>
        <CodeBlock language="bash">{`# npm
npm install @aspect/alkanes-web-sys

# pnpm
pnpm add @aspect/alkanes-web-sys

# yarn
yarn add @aspect/alkanes-web-sys`}</CodeBlock>
      </Section>

      <Section title={t.featuresTitle}>
        <div className="grid gap-4 md:grid-cols-2">
          {t.features.map((feature, i) => (
            <div key={i} className="p-4 rounded-lg border border-[color:var(--sf-outline)]">
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-[color:var(--sf-muted)]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t.setupTitle}>
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.setupDesc}</p>
        <CodeBlock>{`import { initWasm, WebProvider } from '@aspect/alkanes-web-sys';

// Initialize WASM module (required once at startup)
await initWasm();

// Create a provider instance
const provider = new WebProvider({
  rpcUrl: 'https://mainnet.subfrost.io/v4/jsonrpc',
  dataApiUrl: 'https://mainnet.subfrost.io/v4/api',
});`}</CodeBlock>
      </Section>

      <Section title={t.providerTitle}>
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.providerDesc}</p>
        <CodeBlock>{`// Configuration options
interface ProviderConfig {
  rpcUrl: string;       // JSON-RPC endpoint
  dataApiUrl?: string;  // Data API endpoint (optional)
  network?: 'mainnet' | 'signet' | 'regtest';
  timeout?: number;     // Request timeout in ms
}

// With API key (for production)
const provider = new WebProvider({
  rpcUrl: 'https://mainnet.subfrost.io/v4/YOUR_API_KEY',
  dataApiUrl: 'https://mainnet.subfrost.io/v4/YOUR_API_KEY',
  network: 'mainnet',
  timeout: 30000,
});

// Public endpoints (rate limited)
const publicProvider = new WebProvider({
  rpcUrl: 'https://mainnet.subfrost.io/v4/jsonrpc',
  dataApiUrl: 'https://mainnet.subfrost.io/v4/api',
});`}</CodeBlock>
      </Section>

      <Section title={t.walletTitle}>
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.walletDesc}</p>
        <CodeBlock>{`import { Wallet, generateMnemonic } from '@aspect/alkanes-web-sys';

// Generate a new mnemonic
const mnemonic = generateMnemonic(12); // 12 or 24 words
console.log('Mnemonic:', mnemonic);

// Create wallet from mnemonic
const wallet = Wallet.fromMnemonic(mnemonic, {
  network: 'mainnet',
  addressType: 'p2wpkh', // Native SegWit
});

// Get addresses
const address = wallet.getAddress();
const publicKey = wallet.getPublicKey();

console.log('Address:', address);
console.log('Public Key:', publicKey);

// Derive child keys (BIP44 path)
const childWallet = wallet.derive("m/84'/0'/0'/0/0");`}</CodeBlock>
      </Section>

      <Section title={t.rpcTitle}>
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.rpcDesc}</p>
        <CodeBlock>{`// Generic RPC call
const blockHeight = await provider.call('metashrew_height', []);
console.log('Current height:', blockHeight);

// Get Bitcoin block info
const blockHash = await provider.call('btc_getblockhash', [blockHeight]);
const block = await provider.call('btc_getblock', [blockHash, 1]);

// Query address UTXOs
const utxos = await provider.call('esplora_address::utxo', ['bc1q...']);

// Get Alkanes token balances
const balances = await provider.call('alkanes_protorunesbyaddress', ['bc1q...']);

// Query pool state with metashrew_view
const poolState = await provider.call('metashrew_view', [
  'simulate',
  '0x208bce382a06029fda04e7073001',  // DIESEL/frBTC pool payload
  blockHeight.toString()
]);`}</CodeBlock>
        <div className="mt-4 p-3 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] text-sm">
          <p className="text-[color:var(--sf-muted)]">
            {t.rpcNote}{" "}
            <Link
              href="/docs/api/ts-sdk#AlkanesRpcClient"
              className="text-[color:var(--sf-primary)] hover:underline"
            >
              AlkanesRpcClient →
            </Link>
          </p>
        </div>
      </Section>

      <Section title={t.luaTitle}>
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.luaDesc}</p>
        <CodeBlock>{`// Execute a Lua script
const luaScript = \`
  local height = _RPC.btc_getblockcount()
  local hash = _RPC.btc_getblockhash(height)
  return { height = height, hash = hash }
\`;

const result = await provider.call('lua_evalscript', [luaScript, []]);
// result = { calls: 2, returns: { height: 927500, hash: "000..." }, runtime: 5 }

console.log('Block height:', result.returns.height);
console.log('Block hash:', result.returns.hash);

// With arguments
const scriptWithArgs = \`
  local params = args[1] or {}
  local address = params[1]
  local utxos = _RPC.esplora_addressutxo(address)
  return { count = #utxos, utxos = utxos }
\`;

const utxoResult = await provider.call('lua_evalscript', [
  scriptWithArgs,
  [['bc1q...']]  // args[1] = ['bc1q...']
]);`}</CodeBlock>
      </Section>

      <Section title={t.poolDataTitle}>
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.poolDataDesc}</p>
        <CodeBlock>{`import { initWasm, WebProvider } from '@aspect/alkanes-web-sys';

// Pool candle fetcher using alkanes-web-sys
async function fetchPoolCandles(
  provider: WebProvider,
  poolPayload: string,
  startHeight: number,
  endHeight: number,
  interval: number = 144
) {
  const luaScript = \`
    local params = args[1] or {}
    local pool_payload = params[1]
    local start_height = tonumber(params[2])
    local end_height = tonumber(params[3])
    local interval = tonumber(params[4]) or 144

    if not pool_payload or not start_height or not end_height then
      return { error = "Missing required arguments" }
    end

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

    local function get_block_timestamp(height)
      local ok, hash = pcall(function() return _RPC.btc_getblockhash(height) end)
      if not ok or not hash then return nil end
      local ok2, block = pcall(function() return _RPC.btc_getblock(hash, 1) end)
      if not ok2 or not block then return nil end
      return block.time
    end

    local results = { data_points = {} }
    for height = start_height, end_height, interval do
      local ok, response = pcall(function()
        return _RPC.metashrew_view("simulate", pool_payload, tostring(height))
      end)
      if ok and response and type(response) == "string" then
        local hex = response:sub(1, 2) == "0x" and response:sub(3) or response
        local marker = hex:find("1a")
        if marker then
          local len_byte = tonumber(hex:sub(marker + 2, marker + 3), 16) or 0
          local inner_start = marker + (len_byte < 128 and 4 or 6)
          if #hex >= inner_start + 223 then
            local inner = hex:sub(inner_start)
            local ra = parse_u128_le(inner, 64)
            local rb = parse_u128_le(inner, 80)
            local ts = parse_u128_le(inner, 96)
            if ra and rb and ts then
              table.insert(results.data_points, {
                height = height,
                timestamp = get_block_timestamp(height),
                reserve_a = ra,
                reserve_b = rb,
                total_supply = ts
              })
            end
          end
        end
      end
    end
    results.count = #results.data_points
    return results
  \`;

  const result = await provider.call('lua_evalscript', [
    luaScript,
    [[poolPayload, startHeight.toString(), endHeight.toString(), interval.toString()]]
  ]);

  if (result.returns?.error) {
    throw new Error(result.returns.error);
  }

  return result.returns?.data_points || [];
}

// Usage
async function main() {
  await initWasm();

  const provider = new WebProvider({
    rpcUrl: 'https://mainnet.subfrost.io/v4/jsonrpc',
  });

  // Get current height
  const height = await provider.call('metashrew_height', []);
  const currentHeight = parseInt(height, 10);

  // Fetch DIESEL/frBTC candles for last 7 days
  const candles = await fetchPoolCandles(
    provider,
    '0x208bce382a06029fda04e7073001',  // DIESEL/frBTC
    currentHeight - 7 * 144,
    currentHeight,
    144
  );

  console.log(\`Fetched \${candles.length} data points\`);
  for (const dp of candles) {
    const price = (dp.reserve_b / 1e8) / (dp.reserve_a / 1e6);
    console.log(\`Block \${dp.height}: \${price.toFixed(8)} frBTC/DIESEL\`);
  }
}

main().catch(console.error);`}</CodeBlock>
      </Section>

      <Section title={t.browserTitle}>
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.browserDesc}</p>
        <CodeBlock>{`// Next.js / React setup
// next.config.js
module.exports = {
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    return config;
  },
};

// React component
import { useEffect, useState } from 'react';

function PriceWidget() {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrice() {
      const { initWasm, WebProvider } = await import('@aspect/alkanes-web-sys');
      await initWasm();

      const provider = new WebProvider({
        rpcUrl: 'https://mainnet.subfrost.io/v4/jsonrpc',
      });

      // Fetch current DIESEL price...
      const height = await provider.call('metashrew_height', []);
      // ... rest of price fetching logic

      setPrice(calculatedPrice);
      setLoading(false);
    }

    fetchPrice();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>DIESEL: \${price?.toFixed(4)}</div>;
}`}</CodeBlock>
      </Section>

      <Section title={t.nodeTitle}>
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.nodeDesc}</p>
        <CodeBlock>{`// server.ts - Node.js usage
import { initWasm, WebProvider } from '@aspect/alkanes-web-sys';

// Initialize once at startup
let provider: WebProvider;

async function init() {
  await initWasm();
  provider = new WebProvider({
    rpcUrl: process.env.RPC_URL || 'https://mainnet.subfrost.io/v4/jsonrpc',
    dataApiUrl: process.env.DATA_API_URL || 'https://mainnet.subfrost.io/v4/api',
  });
}

// API route handler
export async function GET(request: Request) {
  if (!provider) await init();

  const height = await provider.call('metashrew_height', []);

  return Response.json({ height: parseInt(height, 10) });
}

// Express.js example
import express from 'express';

const app = express();

app.get('/api/height', async (req, res) => {
  if (!provider) await init();
  const height = await provider.call('metashrew_height', []);
  res.json({ height: parseInt(height, 10) });
});

app.listen(3000);`}</CodeBlock>
      </Section>

      <Section title={t.troubleshootTitle}>
        <div className="space-y-4">
          {t.troubleshootItems.map((item, i) => (
            <div key={i} className="p-4 rounded-lg border border-[color:var(--sf-outline)]">
              <h4 className="font-semibold mb-2">{item.issue}</h4>
              <p className="text-sm text-[color:var(--sf-muted)]">{item.solution}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-12 p-6 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
        <h3 className="text-xl font-semibold mb-2">{t.signupCta}</h3>
        <p className="text-[color:var(--sf-muted)]">
          {t.signupDesc}{" "}
          <a
            href="https://api.subfrost.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--sf-primary)] hover:underline"
          >
            api.subfrost.io
          </a>
        </p>
      </div>
    </div>
  );
}
