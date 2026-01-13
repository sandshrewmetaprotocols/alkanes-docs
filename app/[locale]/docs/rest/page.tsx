"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "REST API Overview",
    intro: "The Subfrost REST API provides high-level endpoints for alkanes, AMM pools, and blockchain data. These endpoints are part of the alkanes-data-api service.",
    baseUrlsTitle: "Base URLs",
    baseUrlsDesc: "Choose the network for your application:",
    networks: [
      { name: "Mainnet", url: "https://mainnet.subfrost.io/v4/api" },
      { name: "Signet", url: "https://signet.subfrost.io/v4/api" },
      { name: "Regtest", url: "https://regtest.subfrost.io/v4/api" }
    ],
    authTitle: "Authentication",
    authMethods: [
      "Public endpoint - /v4/api/{route} (with CORS from registered domain)",
      "API key in path - /v4/{api_key}/{route}",
      "API key header - /v4/api/{route} with x-subfrost-api-key header"
    ],
    requestFormatTitle: "Request Format",
    requestFormatDesc: "All endpoints accept POST requests with JSON bodies.",
    responseFormatTitle: "Response Format",
    responseFormatDesc: "All responses follow this structure:",
    endpointCategoriesTitle: "Endpoint Categories",
    alkanesTitle: "Alkanes",
    alkanesDesc: "Query alkane tokens and contracts.",
    alkanesEndpoints: [
      { endpoint: "POST /get-alkanes", desc: "List all alkanes" },
      { endpoint: "POST /get-alkanes-by-address", desc: "Alkanes for an address" },
      { endpoint: "POST /get-alkane-details", desc: "Specific alkane info" },
      { endpoint: "POST /global-alkanes-search", desc: "Search alkanes" }
    ],
    poolsTitle: "Pools & AMM",
    poolsDesc: "Liquidity pools and AMM operations.",
    poolsEndpoints: [
      { endpoint: "POST /get-pools", desc: "List all pools" },
      { endpoint: "POST /get-pool-details", desc: "Pool details" },
      { endpoint: "POST /get-all-pools-details", desc: "All pool details" },
      { endpoint: "POST /address-positions", desc: "Liquidity positions" }
    ],
    bitcoinTitle: "Bitcoin/UTXOs",
    bitcoinDesc: "Bitcoin balance and UTXO queries.",
    bitcoinEndpoints: [
      { endpoint: "POST /get-address-balance", desc: "Address balance" },
      { endpoint: "POST /get-taproot-balance", desc: "Taproot balance" },
      { endpoint: "POST /get-address-utxos", desc: "Address UTXOs" },
      { endpoint: "POST /get-account-utxos", desc: "Account UTXOs" }
    ],
    historyTitle: "History",
    historyDesc: "Transaction history for AMM operations.",
    historyEndpoints: [
      { endpoint: "POST /get-pool-swap-history", desc: "Pool swap history" },
      { endpoint: "POST /get-token-swap-history", desc: "Token swap history" },
      { endpoint: "POST /get-pool-mint-history", desc: "Liquidity adds" },
      { endpoint: "POST /get-pool-burn-history", desc: "Liquidity removes" }
    ],
    priceTitle: "Bitcoin Price",
    priceDesc: "Real-time BTC price from Uniswap V3 WBTC/USDC pool.",
    priceEndpoints: [
      { endpoint: "POST /get-bitcoin-price", desc: "Current BTC price in USD" },
      { endpoint: "POST /get-bitcoin-market-chart", desc: "Historical price data" },
      { endpoint: "POST /get-bitcoin-market-weekly", desc: "52-week high/low" }
    ],
    healthTitle: "Health Check",
    exampleTitle: "JavaScript Example"
  },
  zh: {
    title: "REST API 概述",
    intro: "Subfrost REST API 提供了 alkanes、AMM 池和区块链数据的高级端点。这些端点是 alkanes-data-api 服务的一部分。",
    baseUrlsTitle: "基础 URL",
    baseUrlsDesc: "根据您的应用选择网络：",
    networks: [
      { name: "主网", url: "https://mainnet.subfrost.io/v4/api" },
      { name: "Signet", url: "https://signet.subfrost.io/v4/api" },
      { name: "Regtest", url: "https://regtest.subfrost.io/v4/api" }
    ],
    authTitle: "认证",
    authMethods: [
      "公共端点 - /v4/api/{route}（需要来自注册域的 CORS）",
      "路径中的 API 密钥 - /v4/{api_key}/{route}",
      "API 密钥头 - /v4/api/{route} 配合 x-subfrost-api-key 头"
    ],
    requestFormatTitle: "请求格式",
    requestFormatDesc: "所有端点接受带有 JSON 请求体的 POST 请求。",
    responseFormatTitle: "响应格式",
    responseFormatDesc: "所有响应遵循以下结构：",
    endpointCategoriesTitle: "端点分类",
    alkanesTitle: "Alkanes",
    alkanesDesc: "查询 alkane 代币和合约。",
    alkanesEndpoints: [
      { endpoint: "POST /get-alkanes", desc: "列出所有 alkanes" },
      { endpoint: "POST /get-alkanes-by-address", desc: "按地址查询 alkanes" },
      { endpoint: "POST /get-alkane-details", desc: "特定 alkane 信息" },
      { endpoint: "POST /global-alkanes-search", desc: "搜索 alkanes" }
    ],
    poolsTitle: "池与 AMM",
    poolsDesc: "流动性池和 AMM 操作。",
    poolsEndpoints: [
      { endpoint: "POST /get-pools", desc: "列出所有池" },
      { endpoint: "POST /get-pool-details", desc: "池详情" },
      { endpoint: "POST /get-all-pools-details", desc: "所有池详情" },
      { endpoint: "POST /address-positions", desc: "流动性仓位" }
    ],
    bitcoinTitle: "比特币/UTXO",
    bitcoinDesc: "比特币余额和 UTXO 查询。",
    bitcoinEndpoints: [
      { endpoint: "POST /get-address-balance", desc: "地址余额" },
      { endpoint: "POST /get-taproot-balance", desc: "Taproot 余额" },
      { endpoint: "POST /get-address-utxos", desc: "地址 UTXO" },
      { endpoint: "POST /get-account-utxos", desc: "账户 UTXO" }
    ],
    historyTitle: "历史记录",
    historyDesc: "AMM 操作的交易历史。",
    historyEndpoints: [
      { endpoint: "POST /get-pool-swap-history", desc: "池交换历史" },
      { endpoint: "POST /get-token-swap-history", desc: "代币交换历史" },
      { endpoint: "POST /get-pool-mint-history", desc: "添加流动性记录" },
      { endpoint: "POST /get-pool-burn-history", desc: "移除流动性记录" }
    ],
    priceTitle: "比特币价格",
    priceDesc: "来自 Uniswap V3 WBTC/USDC 池的实时 BTC 价格。",
    priceEndpoints: [
      { endpoint: "POST /get-bitcoin-price", desc: "当前 BTC 美元价格" },
      { endpoint: "POST /get-bitcoin-market-chart", desc: "历史价格数据" },
      { endpoint: "POST /get-bitcoin-market-weekly", desc: "52 周最高/最低" }
    ],
    healthTitle: "健康检查",
    exampleTitle: "JavaScript 示例"
  },
  ms: {
    title: "Gambaran Keseluruhan REST API",
    intro: "Subfrost REST API menyediakan endpoint peringkat tinggi untuk alkanes, kolam AMM, dan data blockchain. Endpoint ini adalah sebahagian daripada perkhidmatan alkanes-data-api.",
    baseUrlsTitle: "URL Asas",
    baseUrlsDesc: "Pilih rangkaian untuk aplikasi anda:",
    networks: [
      { name: "Mainnet", url: "https://mainnet.subfrost.io/v4/api" },
      { name: "Signet", url: "https://signet.subfrost.io/v4/api" },
      { name: "Regtest", url: "https://regtest.subfrost.io/v4/api" }
    ],
    authTitle: "Pengesahan",
    authMethods: [
      "Endpoint awam - /v4/api/{route} (dengan CORS dari domain berdaftar)",
      "Kunci API dalam laluan - /v4/{api_key}/{route}",
      "Header kunci API - /v4/api/{route} dengan header x-subfrost-api-key"
    ],
    requestFormatTitle: "Format Permintaan",
    requestFormatDesc: "Semua endpoint menerima permintaan POST dengan badan JSON.",
    responseFormatTitle: "Format Respons",
    responseFormatDesc: "Semua respons mengikuti struktur ini:",
    endpointCategoriesTitle: "Kategori Endpoint",
    alkanesTitle: "Alkanes",
    alkanesDesc: "Tanya token dan kontrak alkane.",
    alkanesEndpoints: [
      { endpoint: "POST /get-alkanes", desc: "Senaraikan semua alkanes" },
      { endpoint: "POST /get-alkanes-by-address", desc: "Alkanes untuk alamat" },
      { endpoint: "POST /get-alkane-details", desc: "Maklumat alkane tertentu" },
      { endpoint: "POST /global-alkanes-search", desc: "Cari alkanes" }
    ],
    poolsTitle: "Kolam & AMM",
    poolsDesc: "Kolam kecairan dan operasi AMM.",
    poolsEndpoints: [
      { endpoint: "POST /get-pools", desc: "Senaraikan semua kolam" },
      { endpoint: "POST /get-pool-details", desc: "Butiran kolam" },
      { endpoint: "POST /get-all-pools-details", desc: "Semua butiran kolam" },
      { endpoint: "POST /address-positions", desc: "Kedudukan kecairan" }
    ],
    bitcoinTitle: "Bitcoin/UTXO",
    bitcoinDesc: "Baki Bitcoin dan pertanyaan UTXO.",
    bitcoinEndpoints: [
      { endpoint: "POST /get-address-balance", desc: "Baki alamat" },
      { endpoint: "POST /get-taproot-balance", desc: "Baki Taproot" },
      { endpoint: "POST /get-address-utxos", desc: "UTXO alamat" },
      { endpoint: "POST /get-account-utxos", desc: "UTXO akaun" }
    ],
    historyTitle: "Sejarah",
    historyDesc: "Sejarah transaksi untuk operasi AMM.",
    historyEndpoints: [
      { endpoint: "POST /get-pool-swap-history", desc: "Sejarah pertukaran kolam" },
      { endpoint: "POST /get-token-swap-history", desc: "Sejarah pertukaran token" },
      { endpoint: "POST /get-pool-mint-history", desc: "Penambahan kecairan" },
      { endpoint: "POST /get-pool-burn-history", desc: "Pengeluaran kecairan" }
    ],
    priceTitle: "Harga Bitcoin",
    priceDesc: "Harga BTC masa nyata dari kolam Uniswap V3 WBTC/USDC.",
    priceEndpoints: [
      { endpoint: "POST /get-bitcoin-price", desc: "Harga BTC semasa dalam USD" },
      { endpoint: "POST /get-bitcoin-market-chart", desc: "Data harga sejarah" },
      { endpoint: "POST /get-bitcoin-market-weekly", desc: "Tinggi/rendah 52 minggu" }
    ],
    healthTitle: "Pemeriksaan Kesihatan",
    exampleTitle: "Contoh JavaScript"
  },
  vi: {
    title: "Tổng quan REST API",
    intro: "Subfrost REST API cung cấp các endpoint cấp cao cho alkanes, pool AMM và dữ liệu blockchain. Các endpoint này là một phần của dịch vụ alkanes-data-api.",
    baseUrlsTitle: "URL Cơ sở",
    baseUrlsDesc: "Chọn mạng cho ứng dụng của bạn:",
    networks: [
      { name: "Mainnet", url: "https://mainnet.subfrost.io/v4/api" },
      { name: "Signet", url: "https://signet.subfrost.io/v4/api" },
      { name: "Regtest", url: "https://regtest.subfrost.io/v4/api" }
    ],
    authTitle: "Xác thực",
    authMethods: [
      "Endpoint công khai - /v4/api/{route} (với CORS từ domain đã đăng ký)",
      "Khóa API trong đường dẫn - /v4/{api_key}/{route}",
      "Header khóa API - /v4/api/{route} với header x-subfrost-api-key"
    ],
    requestFormatTitle: "Định dạng Yêu cầu",
    requestFormatDesc: "Tất cả các endpoint chấp nhận yêu cầu POST với body JSON.",
    responseFormatTitle: "Định dạng Phản hồi",
    responseFormatDesc: "Tất cả các phản hồi tuân theo cấu trúc này:",
    endpointCategoriesTitle: "Danh mục Endpoint",
    alkanesTitle: "Alkanes",
    alkanesDesc: "Truy vấn token và hợp đồng alkane.",
    alkanesEndpoints: [
      { endpoint: "POST /get-alkanes", desc: "Liệt kê tất cả alkanes" },
      { endpoint: "POST /get-alkanes-by-address", desc: "Alkanes cho một địa chỉ" },
      { endpoint: "POST /get-alkane-details", desc: "Thông tin alkane cụ thể" },
      { endpoint: "POST /global-alkanes-search", desc: "Tìm kiếm alkanes" }
    ],
    poolsTitle: "Pool & AMM",
    poolsDesc: "Các pool thanh khoản và hoạt động AMM.",
    poolsEndpoints: [
      { endpoint: "POST /get-pools", desc: "Liệt kê tất cả các pool" },
      { endpoint: "POST /get-pool-details", desc: "Chi tiết pool" },
      { endpoint: "POST /get-all-pools-details", desc: "Chi tiết tất cả các pool" },
      { endpoint: "POST /address-positions", desc: "Vị trí thanh khoản" }
    ],
    bitcoinTitle: "Bitcoin/UTXO",
    bitcoinDesc: "Số dư Bitcoin và truy vấn UTXO.",
    bitcoinEndpoints: [
      { endpoint: "POST /get-address-balance", desc: "Số dư địa chỉ" },
      { endpoint: "POST /get-taproot-balance", desc: "Số dư Taproot" },
      { endpoint: "POST /get-address-utxos", desc: "UTXO địa chỉ" },
      { endpoint: "POST /get-account-utxos", desc: "UTXO tài khoản" }
    ],
    historyTitle: "Lịch sử",
    historyDesc: "Lịch sử giao dịch cho các hoạt động AMM.",
    historyEndpoints: [
      { endpoint: "POST /get-pool-swap-history", desc: "Lịch sử hoán đổi pool" },
      { endpoint: "POST /get-token-swap-history", desc: "Lịch sử hoán đổi token" },
      { endpoint: "POST /get-pool-mint-history", desc: "Thêm thanh khoản" },
      { endpoint: "POST /get-pool-burn-history", desc: "Loại bỏ thanh khoản" }
    ],
    priceTitle: "Giá Bitcoin",
    priceDesc: "Giá BTC thời gian thực từ pool Uniswap V3 WBTC/USDC.",
    priceEndpoints: [
      { endpoint: "POST /get-bitcoin-price", desc: "Giá BTC hiện tại bằng USD" },
      { endpoint: "POST /get-bitcoin-market-chart", desc: "Dữ liệu giá lịch sử" },
      { endpoint: "POST /get-bitcoin-market-weekly", desc: "Cao/thấp 52 tuần" }
    ],
    healthTitle: "Kiểm tra Sức khỏe",
    exampleTitle: "Ví dụ JavaScript"
  },
  ko: {
    title: "REST API 개요",
    intro: "Subfrost REST API는 alkanes, AMM 풀 및 블록체인 데이터에 대한 고급 엔드포인트를 제공합니다. 이러한 엔드포인트는 alkanes-data-api 서비스의 일부입니다.",
    baseUrlsTitle: "기본 URL",
    baseUrlsDesc: "애플리케이션의 네트워크를 선택하세요:",
    networks: [
      { name: "메인넷", url: "https://mainnet.subfrost.io/v4/api" },
      { name: "Signet", url: "https://signet.subfrost.io/v4/api" },
      { name: "Regtest", url: "https://regtest.subfrost.io/v4/api" }
    ],
    authTitle: "인증",
    authMethods: [
      "공개 엔드포인트 - /v4/api/{route} (등록된 도메인의 CORS 포함)",
      "경로의 API 키 - /v4/{api_key}/{route}",
      "API 키 헤더 - /v4/api/{route} 및 x-subfrost-api-key 헤더"
    ],
    requestFormatTitle: "요청 형식",
    requestFormatDesc: "모든 엔드포인트는 JSON 본문이 있는 POST 요청을 허용합니다.",
    responseFormatTitle: "응답 형식",
    responseFormatDesc: "모든 응답은 다음 구조를 따릅니다:",
    endpointCategoriesTitle: "엔드포인트 카테고리",
    alkanesTitle: "Alkanes",
    alkanesDesc: "alkane 토큰 및 계약을 쿼리합니다.",
    alkanesEndpoints: [
      { endpoint: "POST /get-alkanes", desc: "모든 alkanes 나열" },
      { endpoint: "POST /get-alkanes-by-address", desc: "주소의 alkanes" },
      { endpoint: "POST /get-alkane-details", desc: "특정 alkane 정보" },
      { endpoint: "POST /global-alkanes-search", desc: "alkanes 검색" }
    ],
    poolsTitle: "풀 & AMM",
    poolsDesc: "유동성 풀 및 AMM 운영.",
    poolsEndpoints: [
      { endpoint: "POST /get-pools", desc: "모든 풀 나열" },
      { endpoint: "POST /get-pool-details", desc: "풀 세부 정보" },
      { endpoint: "POST /get-all-pools-details", desc: "모든 풀 세부 정보" },
      { endpoint: "POST /address-positions", desc: "유동성 포지션" }
    ],
    bitcoinTitle: "비트코인/UTXO",
    bitcoinDesc: "비트코인 잔액 및 UTXO 쿼리.",
    bitcoinEndpoints: [
      { endpoint: "POST /get-address-balance", desc: "주소 잔액" },
      { endpoint: "POST /get-taproot-balance", desc: "Taproot 잔액" },
      { endpoint: "POST /get-address-utxos", desc: "주소 UTXO" },
      { endpoint: "POST /get-account-utxos", desc: "계정 UTXO" }
    ],
    historyTitle: "히스토리",
    historyDesc: "AMM 운영에 대한 거래 내역.",
    historyEndpoints: [
      { endpoint: "POST /get-pool-swap-history", desc: "풀 스왑 히스토리" },
      { endpoint: "POST /get-token-swap-history", desc: "토큰 스왑 히스토리" },
      { endpoint: "POST /get-pool-mint-history", desc: "유동성 추가" },
      { endpoint: "POST /get-pool-burn-history", desc: "유동성 제거" }
    ],
    priceTitle: "비트코인 가격",
    priceDesc: "Uniswap V3 WBTC/USDC 풀의 실시간 BTC 가격.",
    priceEndpoints: [
      { endpoint: "POST /get-bitcoin-price", desc: "현재 BTC USD 가격" },
      { endpoint: "POST /get-bitcoin-market-chart", desc: "과거 가격 데이터" },
      { endpoint: "POST /get-bitcoin-market-weekly", desc: "52주 최고/최저" }
    ],
    healthTitle: "상태 확인",
    exampleTitle: "JavaScript 예제"
  }
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm my-4">
      <code>{children}</code>
    </pre>
  );
}

function EndpointTable({ endpoints }: { endpoints: { endpoint: string; desc: string }[] }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[color:var(--sf-outline)]">
            <th className="text-left py-2 px-3">Endpoint</th>
            <th className="text-left py-2 px-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((e, i) => (
            <tr key={i} className="border-b border-[color:var(--sf-outline)]">
              <td className="py-2 px-3 font-mono text-xs">{e.endpoint}</td>
              <td className="py-2 px-3 text-[color:var(--sf-muted)]">{e.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RestOverviewPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.baseUrlsTitle}</h2>
        <p className="mb-4">{t.baseUrlsDesc}</p>
        <div className="space-y-2">
          {t.networks.map((n, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="font-medium">{n.name}:</span>
              <code className="text-sm bg-[color:var(--sf-surface)] px-2 py-1 rounded">{n.url}</code>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.authTitle}</h2>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.authMethods.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.requestFormatTitle}</h2>
        <p className="mb-4">{t.requestFormatDesc}</p>
        <CodeBlock>{`curl -X POST https://mainnet.subfrost.io/v4/api/get-bitcoin-price \\
  -H "Content-Type: application/json" \\
  -d '{}'

# Or with API key:
curl -X POST https://mainnet.subfrost.io/v4/YOUR_API_KEY/get-bitcoin-price \\
  -H "Content-Type: application/json" \\
  -d '{}'`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.responseFormatTitle}</h2>
        <p className="mb-4">{t.responseFormatDesc}</p>
        <CodeBlock>{`// Success
{
  "statusCode": 200,
  "data": { /* response data */ }
}

// Error
{
  "statusCode": 400,
  "error": "Invalid request parameters"
}`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.endpointCategoriesTitle}</h2>

        <h3 className="text-xl font-semibold mb-2">{t.alkanesTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-2">{t.alkanesDesc}</p>
        <EndpointTable endpoints={t.alkanesEndpoints} />

        <h3 className="text-xl font-semibold mb-2">{t.poolsTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-2">{t.poolsDesc}</p>
        <EndpointTable endpoints={t.poolsEndpoints} />

        <h3 className="text-xl font-semibold mb-2">{t.bitcoinTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-2">{t.bitcoinDesc}</p>
        <EndpointTable endpoints={t.bitcoinEndpoints} />

        <h3 className="text-xl font-semibold mb-2">{t.historyTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-2">{t.historyDesc}</p>
        <EndpointTable endpoints={t.historyEndpoints} />

        <h3 className="text-xl font-semibold mb-2">{t.priceTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-2">{t.priceDesc}</p>
        <EndpointTable endpoints={t.priceEndpoints} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.healthTitle}</h2>
        <CodeBlock>{`GET https://mainnet.subfrost.io/v4/api/health

// Response:
{
  "status": "ok",
  "timestamp": 1699123456
}`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.exampleTitle}</h2>
        <CodeBlock>{`const API_BASE = 'https://mainnet.subfrost.io/v4/api';

async function getAlkanesByAddress(address) {
  const response = await fetch(\`\${API_BASE}/get-alkanes-by-address\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address })
  });

  const data = await response.json();

  if (data.statusCode !== 200) {
    throw new Error(data.error);
  }

  return data.data;
}

const alkanes = await getAlkanesByAddress('bc1p...');
console.log('Alkane holdings:', alkanes);`}</CodeBlock>
      </div>
    </div>
  );
}
