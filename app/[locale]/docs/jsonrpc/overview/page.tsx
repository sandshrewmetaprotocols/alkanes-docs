"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "JSON-RPC API Overview",
    intro: "The Subfrost API uses JSON-RPC 2.0 as its primary protocol. All methods are accessible through a unified endpoint with namespace prefixes.",
    endpointTitle: "Endpoint",
    requestTitle: "Request Format",
    requestFields: [
      { field: "jsonrpc", desc: "Must be \"2.0\"" },
      { field: "method", desc: "Method name with namespace prefix" },
      { field: "params", desc: "Method parameters (array)" },
      { field: "id", desc: "Request identifier (number/string)" }
    ],
    responseTitle: "Response Format",
    namespacesTitle: "Namespaces",
    namespaces: [
      { ns: "esplora_*", desc: "Electrs block explorer API (e.g., esplora_address::utxo)" },
      { ns: "ord_*", desc: "Ordinals protocol (e.g., ord_inscription)" },
      { ns: "metashrew_*", desc: "Metashrew indexer (e.g., metashrew_view)" },
      { ns: "alkanes_*", desc: "Alkanes protocol (e.g., alkanes_protorunesbyaddress)" },
      { ns: "btc_*", desc: "Bitcoin Core RPC (e.g., btc_getblockcount)" },
      { ns: "lua_*", desc: "Lua script execution (e.g., lua_evalscript)" }
    ],
    namingTitle: "Method Naming Convention",
    namingDesc: "Methods use underscores and double colons to represent REST paths:",
    namingRules: [
      "_ (underscore) - Namespace separator",
      ":: (double colon) - Path parameter placeholder"
    ],
    batchTitle: "Batch Requests",
    batchDesc: "Send multiple requests in a single HTTP call:",
    errorsTitle: "Error Codes",
    errors: [
      { code: "-32700", desc: "Parse error (invalid JSON)" },
      { code: "-32600", desc: "Invalid Request (invalid JSON-RPC request)" },
      { code: "-32601", desc: "Method not found (unknown method)" },
      { code: "-32602", desc: "Invalid params (invalid method parameters)" },
      { code: "-32603", desc: "Internal error (server error)" },
      { code: "-32000", desc: "Rate limit exceeded" }
    ],
    luaTitle: "Using in Lua Scripts",
    luaDesc: "All RPC methods are available in Lua scripts via the _RPC global table:"
  },
  zh: {
    title: "JSON-RPC API 概览",
    intro: "Subfrost API 使用 JSON-RPC 2.0 作为主要协议。所有方法都可以通过带有命名空间前缀的统一端点访问。",
    endpointTitle: "端点",
    requestTitle: "请求格式",
    requestFields: [
      { field: "jsonrpc", desc: "必须为 \"2.0\"" },
      { field: "method", desc: "带命名空间前缀的方法名" },
      { field: "params", desc: "方法参数（数组）" },
      { field: "id", desc: "请求标识符（数字/字符串）" }
    ],
    responseTitle: "响应格式",
    namespacesTitle: "命名空间",
    namespaces: [
      { ns: "esplora_*", desc: "Electrs 区块浏览器 API（如 esplora_address::utxo）" },
      { ns: "ord_*", desc: "Ordinals 协议（如 ord_inscription）" },
      { ns: "metashrew_*", desc: "Metashrew 索引器（如 metashrew_view）" },
      { ns: "alkanes_*", desc: "Alkanes 协议（如 alkanes_protorunesbyaddress）" },
      { ns: "btc_*", desc: "Bitcoin Core RPC（如 btc_getblockcount）" },
      { ns: "lua_*", desc: "Lua 脚本执行（如 lua_evalscript）" }
    ],
    namingTitle: "方法命名约定",
    namingDesc: "方法使用下划线和双冒号表示 REST 路径：",
    namingRules: [
      "_（下划线）- 命名空间分隔符",
      "::（双冒号）- 路径参数占位符"
    ],
    batchTitle: "批量请求",
    batchDesc: "在单个 HTTP 调用中发送多个请求：",
    errorsTitle: "错误代码",
    errors: [
      { code: "-32700", desc: "解析错误（无效 JSON）" },
      { code: "-32600", desc: "无效请求（无效 JSON-RPC 请求）" },
      { code: "-32601", desc: "方法未找到（未知方法）" },
      { code: "-32602", desc: "参数无效（无效方法参数）" },
      { code: "-32603", desc: "内部错误（服务器错误）" },
      { code: "-32000", desc: "超出速率限制" }
    ],
    luaTitle: "在 Lua 脚本中使用",
    luaDesc: "所有 RPC 方法都可以通过 _RPC 全局表在 Lua 脚本中使用："
  },
  ms: {
    title: "Gambaran Keseluruhan API JSON-RPC",
    intro: "API Subfrost menggunakan JSON-RPC 2.0 sebagai protokol utamanya. Semua kaedah boleh diakses melalui endpoint bersatu dengan awalan ruang nama.",
    endpointTitle: "Endpoint",
    requestTitle: "Format Permintaan",
    requestFields: [
      { field: "jsonrpc", desc: "Mesti \"2.0\"" },
      { field: "method", desc: "Nama kaedah dengan awalan ruang nama" },
      { field: "params", desc: "Parameter kaedah (array)" },
      { field: "id", desc: "Pengecam permintaan (nombor/string)" }
    ],
    responseTitle: "Format Respons",
    namespacesTitle: "Ruang Nama",
    namespaces: [
      { ns: "esplora_*", desc: "API penjelajah blok Electrs (cth: esplora_address::utxo)" },
      { ns: "ord_*", desc: "Protokol Ordinals (cth: ord_inscription)" },
      { ns: "metashrew_*", desc: "Pengindeks Metashrew (cth: metashrew_view)" },
      { ns: "alkanes_*", desc: "Protokol Alkanes (cth: alkanes_protorunesbyaddress)" },
      { ns: "btc_*", desc: "Bitcoin Core RPC (cth: btc_getblockcount)" },
      { ns: "lua_*", desc: "Pelaksanaan skrip Lua (cth: lua_evalscript)" }
    ],
    namingTitle: "Konvensyen Penamaan Kaedah",
    namingDesc: "Kaedah menggunakan garis bawah dan dwi-titik untuk mewakili laluan REST:",
    namingRules: [
      "_ (garis bawah) - Pemisah ruang nama",
      ":: (dwi-titik) - Pemegang tempat parameter laluan"
    ],
    batchTitle: "Permintaan Berkelompok",
    batchDesc: "Hantar berbilang permintaan dalam satu panggilan HTTP:",
    errorsTitle: "Kod Ralat",
    errors: [
      { code: "-32700", desc: "Ralat menghurai (JSON tidak sah)" },
      { code: "-32600", desc: "Permintaan tidak sah (permintaan JSON-RPC tidak sah)" },
      { code: "-32601", desc: "Kaedah tidak dijumpai (kaedah tidak dikenali)" },
      { code: "-32602", desc: "Parameter tidak sah (parameter kaedah tidak sah)" },
      { code: "-32603", desc: "Ralat dalaman (ralat pelayan)" },
      { code: "-32000", desc: "Had kadar terlebih" }
    ],
    luaTitle: "Menggunakan dalam Skrip Lua",
    luaDesc: "Semua kaedah RPC tersedia dalam skrip Lua melalui jadual global _RPC:"
  },
  vi: {
    title: "Tổng quan API JSON-RPC",
    intro: "API Subfrost sử dụng JSON-RPC 2.0 làm giao thức chính. Tất cả các phương thức có thể truy cập thông qua endpoint thống nhất với tiền tố namespace.",
    endpointTitle: "Endpoint",
    requestTitle: "Định dạng Yêu cầu",
    requestFields: [
      { field: "jsonrpc", desc: "Phải là \"2.0\"" },
      { field: "method", desc: "Tên phương thức với tiền tố namespace" },
      { field: "params", desc: "Tham số phương thức (mảng)" },
      { field: "id", desc: "Định danh yêu cầu (số/chuỗi)" }
    ],
    responseTitle: "Định dạng Phản hồi",
    namespacesTitle: "Namespaces",
    namespaces: [
      { ns: "esplora_*", desc: "API trình khám phá khối Electrs (vd: esplora_address::utxo)" },
      { ns: "ord_*", desc: "Giao thức Ordinals (vd: ord_inscription)" },
      { ns: "metashrew_*", desc: "Bộ lập chỉ mục Metashrew (vd: metashrew_view)" },
      { ns: "alkanes_*", desc: "Giao thức Alkanes (vd: alkanes_protorunesbyaddress)" },
      { ns: "btc_*", desc: "Bitcoin Core RPC (vd: btc_getblockcount)" },
      { ns: "lua_*", desc: "Thực thi script Lua (vd: lua_evalscript)" }
    ],
    namingTitle: "Quy ước Đặt tên Phương thức",
    namingDesc: "Phương thức sử dụng gạch dưới và hai dấu hai chấm để biểu thị đường dẫn REST:",
    namingRules: [
      "_ (gạch dưới) - Phân tách namespace",
      ":: (hai dấu hai chấm) - Vị trí giữ chỗ tham số đường dẫn"
    ],
    batchTitle: "Yêu cầu Hàng loạt",
    batchDesc: "Gửi nhiều yêu cầu trong một lần gọi HTTP:",
    errorsTitle: "Mã Lỗi",
    errors: [
      { code: "-32700", desc: "Lỗi phân tích cú pháp (JSON không hợp lệ)" },
      { code: "-32600", desc: "Yêu cầu không hợp lệ (yêu cầu JSON-RPC không hợp lệ)" },
      { code: "-32601", desc: "Không tìm thấy phương thức (phương thức không xác định)" },
      { code: "-32602", desc: "Tham số không hợp lệ (tham số phương thức không hợp lệ)" },
      { code: "-32603", desc: "Lỗi nội bộ (lỗi máy chủ)" },
      { code: "-32000", desc: "Vượt quá giới hạn tốc độ" }
    ],
    luaTitle: "Sử dụng trong Script Lua",
    luaDesc: "Tất cả các phương thức RPC có sẵn trong script Lua thông qua bảng toàn cục _RPC:"
  },
  ko: {
    title: "JSON-RPC API 개요",
    intro: "Subfrost API는 JSON-RPC 2.0을 기본 프로토콜로 사용합니다. 모든 메서드는 네임스페이스 접두사가 있는 통합 엔드포인트를 통해 액세스할 수 있습니다.",
    endpointTitle: "엔드포인트",
    requestTitle: "요청 형식",
    requestFields: [
      { field: "jsonrpc", desc: "\"2.0\"이어야 함" },
      { field: "method", desc: "네임스페이스 접두사가 있는 메서드 이름" },
      { field: "params", desc: "메서드 매개변수 (배열)" },
      { field: "id", desc: "요청 식별자 (숫자/문자열)" }
    ],
    responseTitle: "응답 형식",
    namespacesTitle: "네임스페이스",
    namespaces: [
      { ns: "esplora_*", desc: "Electrs 블록 탐색기 API (예: esplora_address::utxo)" },
      { ns: "ord_*", desc: "Ordinals 프로토콜 (예: ord_inscription)" },
      { ns: "metashrew_*", desc: "Metashrew 인덱서 (예: metashrew_view)" },
      { ns: "alkanes_*", desc: "Alkanes 프로토콜 (예: alkanes_protorunesbyaddress)" },
      { ns: "btc_*", desc: "Bitcoin Core RPC (예: btc_getblockcount)" },
      { ns: "lua_*", desc: "Lua 스크립트 실행 (예: lua_evalscript)" }
    ],
    namingTitle: "메서드 명명 규칙",
    namingDesc: "메서드는 밑줄과 이중 콜론을 사용하여 REST 경로를 나타냅니다:",
    namingRules: [
      "_ (밑줄) - 네임스페이스 구분자",
      ":: (이중 콜론) - 경로 매개변수 자리 표시자"
    ],
    batchTitle: "일괄 요청",
    batchDesc: "단일 HTTP 호출로 여러 요청 전송:",
    errorsTitle: "오류 코드",
    errors: [
      { code: "-32700", desc: "구문 분석 오류 (유효하지 않은 JSON)" },
      { code: "-32600", desc: "유효하지 않은 요청 (유효하지 않은 JSON-RPC 요청)" },
      { code: "-32601", desc: "메서드를 찾을 수 없음 (알 수 없는 메서드)" },
      { code: "-32602", desc: "유효하지 않은 매개변수 (유효하지 않은 메서드 매개변수)" },
      { code: "-32603", desc: "내부 오류 (서버 오류)" },
      { code: "-32000", desc: "속도 제한 초과" }
    ],
    luaTitle: "Lua 스크립트에서 사용",
    luaDesc: "모든 RPC 메서드는 _RPC 전역 테이블을 통해 Lua 스크립트에서 사용할 수 있습니다:"
  }
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm my-4">
      <code>{children}</code>
    </pre>
  );
}

export default function JSONRPCOverviewPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.endpointTitle}</h2>
        <CodeBlock>{`POST https://mainnet.subfrost.io/v4/jsonrpc

# With API key in path:
POST https://mainnet.subfrost.io/v4/<your-api-key>`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.requestTitle}</h2>
        <CodeBlock>{`{
  "jsonrpc": "2.0",
  "method": "namespace_methodname",
  "params": [...],
  "id": 1
}`}</CodeBlock>
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[color:var(--sf-outline)]">
                <th className="text-left py-2 px-3">Field</th>
                <th className="text-left py-2 px-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {t.requestFields.map((f, i) => (
                <tr key={i} className="border-b border-[color:var(--sf-outline)]">
                  <td className="py-2 px-3 font-mono">{f.field}</td>
                  <td className="py-2 px-3 text-[color:var(--sf-muted)]">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.responseTitle}</h2>
        <CodeBlock>{`// Success
{
  "jsonrpc": "2.0",
  "result": { /* method result */ },
  "id": 1
}

// Error
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Method not found"
  },
  "id": 1
}`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.namespacesTitle}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[color:var(--sf-outline)]">
                <th className="text-left py-2 px-3">Namespace</th>
                <th className="text-left py-2 px-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {t.namespaces.map((ns, i) => (
                <tr key={i} className="border-b border-[color:var(--sf-outline)]">
                  <td className="py-2 px-3 font-mono">{ns.ns}</td>
                  <td className="py-2 px-3 text-[color:var(--sf-muted)]">{ns.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.namingTitle}</h2>
        <p className="mb-4">{t.namingDesc}</p>
        <ul className="list-disc list-inside space-y-1 text-[color:var(--sf-muted)] mb-4">
          {t.namingRules.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
        <CodeBlock>{`# Examples:
esplora_address::utxo     → GET /address/{address}/utxo
ord_inscription           → GET /inscription/{id}
btc_getblockcount         → bitcoind getblockcount`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.batchTitle}</h2>
        <p className="mb-4">{t.batchDesc}</p>
        <CodeBlock>{`// Request
[
  { "jsonrpc": "2.0", "method": "btc_getblockcount", "params": [], "id": 1 },
  { "jsonrpc": "2.0", "method": "btc_getbestblockhash", "params": [], "id": 2 },
  { "jsonrpc": "2.0", "method": "esplora_fee-estimates", "params": [], "id": 3 }
]

// Response
[
  { "jsonrpc": "2.0", "result": 850000, "id": 1 },
  { "jsonrpc": "2.0", "result": "000000000000000000...", "id": 2 },
  { "jsonrpc": "2.0", "result": { "1": 25.5, "6": 15.2 }, "id": 3 }
]`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.errorsTitle}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[color:var(--sf-outline)]">
                <th className="text-left py-2 px-3">Code</th>
                <th className="text-left py-2 px-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {t.errors.map((e, i) => (
                <tr key={i} className="border-b border-[color:var(--sf-outline)]">
                  <td className="py-2 px-3 font-mono">{e.code}</td>
                  <td className="py-2 px-3 text-[color:var(--sf-muted)]">{e.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.luaTitle}</h2>
        <p className="mb-4">{t.luaDesc}</p>
        <CodeBlock>{`-- From within a lua_evalscript
local height = _RPC.btc_getblockcount()
local utxos = _RPC.esplora_addressutxo("bc1q...")
local inscription = _RPC.ord_inscription("abc123i0")

return { height = height, utxo_count = #utxos }`}</CodeBlock>
      </div>
    </div>
  );
}
