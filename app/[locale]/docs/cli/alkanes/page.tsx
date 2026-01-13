"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Alkanes Commands",
    intro: "The alkanes namespace provides operations for the Alkanes protocol including contract execution, token queries, AMM swaps, and liquidity pool management.",
    overviewTitle: "Commands Overview",
    commands: [
      { cmd: "execute", desc: "Execute an alkanes transaction with protostones" },
      { cmd: "simulate", desc: "Simulate a contract call without broadcasting" },
      { cmd: "trace", desc: "Trace an alkanes transaction" },
      { cmd: "inspect", desc: "Inspect a contract (disassemble, fuzz, metadata)" },
      { cmd: "getbalance", desc: "Get alkane token balances for an address" },
      { cmd: "spendables", desc: "Get spendable outpoints for an address" },
      { cmd: "reflect-alkane", desc: "Get metadata for an alkane (name, symbol, supply)" },
      { cmd: "getbytecode", desc: "Get the bytecode for an alkane contract" },
      { cmd: "wrap-btc", desc: "Wrap BTC to frBTC" },
      { cmd: "unwrap", desc: "Get pending unwraps" },
      { cmd: "get-all-pools", desc: "Get all AMM pools" },
      { cmd: "pool-details", desc: "Get details for a specific pool" },
      { cmd: "init-pool", desc: "Initialize a new liquidity pool" },
      { cmd: "swap", desc: "Execute a swap on the AMM" }
    ],
    executeTitle: "alkanes execute",
    executeDesc: "Execute an alkanes transaction with one or more protostones.",
    simulateTitle: "alkanes simulate",
    simulateDesc: "Simulate an alkanes contract call without broadcasting.",
    traceTitle: "alkanes trace",
    traceDesc: "Trace an alkanes transaction to see execution details.",
    inspectTitle: "alkanes inspect",
    inspectDesc: "Inspect an alkanes contract for debugging and analysis.",
    reflectTitle: "alkanes reflect-alkane",
    reflectDesc: "Get metadata for an alkane token by calling standard view opcodes.",
    balanceTitle: "alkanes getbalance",
    balanceDesc: "Get alkane token balances for an address.",
    wrapTitle: "alkanes wrap-btc",
    wrapDesc: "Wrap BTC to frBTC (wrapped Bitcoin).",
    poolsTitle: "alkanes get-all-pools",
    poolsDesc: "Get all AMM pools from the factory contract.",
    swapTitle: "alkanes swap",
    swapDesc: "Execute a swap on the AMM."
  },
  zh: {
    title: "Alkanes 命令",
    intro: "alkanes 命名空间提供 Alkanes 协议的操作，包括合约执行、代币查询、AMM 交换和流动性池管理。",
    overviewTitle: "命令概览",
    commands: [
      { cmd: "execute", desc: "执行带有 protostones 的 alkanes 交易" },
      { cmd: "simulate", desc: "模拟合约调用而不广播" },
      { cmd: "trace", desc: "跟踪 alkanes 交易" },
      { cmd: "inspect", desc: "检查合约（反汇编、模糊测试、元数据）" },
      { cmd: "getbalance", desc: "获取地址的 alkane 代币余额" },
      { cmd: "spendables", desc: "获取地址的可花费输出" },
      { cmd: "reflect-alkane", desc: "获取 alkane 元数据（名称、符号、供应量）" },
      { cmd: "getbytecode", desc: "获取 alkane 合约的字节码" },
      { cmd: "wrap-btc", desc: "将 BTC 封装为 frBTC" },
      { cmd: "unwrap", desc: "获取待处理的解封" },
      { cmd: "get-all-pools", desc: "获取所有 AMM 池" },
      { cmd: "pool-details", desc: "获取特定池的详情" },
      { cmd: "init-pool", desc: "初始化新的流动性池" },
      { cmd: "swap", desc: "在 AMM 上执行交换" }
    ],
    executeTitle: "alkanes execute",
    executeDesc: "执行带有一个或多个 protostones 的 alkanes 交易。",
    simulateTitle: "alkanes simulate",
    simulateDesc: "模拟 alkanes 合约调用而不广播。",
    traceTitle: "alkanes trace",
    traceDesc: "跟踪 alkanes 交易以查看执行详情。",
    inspectTitle: "alkanes inspect",
    inspectDesc: "检查 alkanes 合约进行调试和分析。",
    reflectTitle: "alkanes reflect-alkane",
    reflectDesc: "通过调用标准视图操作码获取 alkane 代币的元数据。",
    balanceTitle: "alkanes getbalance",
    balanceDesc: "获取地址的 alkane 代币余额。",
    wrapTitle: "alkanes wrap-btc",
    wrapDesc: "将 BTC 封装为 frBTC（封装比特币）。",
    poolsTitle: "alkanes get-all-pools",
    poolsDesc: "从工厂合约获取所有 AMM 池。",
    swapTitle: "alkanes swap",
    swapDesc: "在 AMM 上执行交换。"
  },
  ms: {
    title: "Arahan Alkanes",
    intro: "Ruang nama alkanes menyediakan operasi untuk protokol Alkanes termasuk pelaksanaan kontrak, pertanyaan token, pertukaran AMM, dan pengurusan kolam kecairan.",
    overviewTitle: "Gambaran Arahan",
    commands: [
      { cmd: "execute", desc: "Laksanakan transaksi alkanes dengan protostones" },
      { cmd: "simulate", desc: "Simulasikan panggilan kontrak tanpa penyiaran" },
      { cmd: "trace", desc: "Jejak transaksi alkanes" },
      { cmd: "inspect", desc: "Periksa kontrak (nyahrakit, fuzz, metadata)" },
      { cmd: "getbalance", desc: "Dapatkan baki token alkane untuk alamat" },
      { cmd: "spendables", desc: "Dapatkan outpoint yang boleh dibelanjakan untuk alamat" },
      { cmd: "reflect-alkane", desc: "Dapatkan metadata untuk alkane (nama, simbol, bekalan)" },
      { cmd: "getbytecode", desc: "Dapatkan bytecode untuk kontrak alkane" },
      { cmd: "wrap-btc", desc: "Balut BTC ke frBTC" },
      { cmd: "unwrap", desc: "Dapatkan unwrap yang tertunda" },
      { cmd: "get-all-pools", desc: "Dapatkan semua kolam AMM" },
      { cmd: "pool-details", desc: "Dapatkan butiran untuk kolam tertentu" },
      { cmd: "init-pool", desc: "Mulakan kolam kecairan baharu" },
      { cmd: "swap", desc: "Laksanakan pertukaran pada AMM" }
    ],
    executeTitle: "alkanes execute",
    executeDesc: "Laksanakan transaksi alkanes dengan satu atau lebih protostones.",
    simulateTitle: "alkanes simulate",
    simulateDesc: "Simulasikan panggilan kontrak alkanes tanpa penyiaran.",
    traceTitle: "alkanes trace",
    traceDesc: "Jejak transaksi alkanes untuk melihat butiran pelaksanaan.",
    inspectTitle: "alkanes inspect",
    inspectDesc: "Periksa kontrak alkanes untuk nyahpepijat dan analisis.",
    reflectTitle: "alkanes reflect-alkane",
    reflectDesc: "Dapatkan metadata untuk token alkane dengan memanggil opcode paparan standard.",
    balanceTitle: "alkanes getbalance",
    balanceDesc: "Dapatkan baki token alkane untuk alamat.",
    wrapTitle: "alkanes wrap-btc",
    wrapDesc: "Balut BTC ke frBTC (Bitcoin terbungkus).",
    poolsTitle: "alkanes get-all-pools",
    poolsDesc: "Dapatkan semua kolam AMM dari kontrak kilang.",
    swapTitle: "alkanes swap",
    swapDesc: "Laksanakan pertukaran pada AMM."
  },
  vi: {
    title: "Lệnh Alkanes",
    intro: "Không gian tên alkanes cung cấp các thao tác cho giao thức Alkanes bao gồm thực thi hợp đồng, truy vấn token, hoán đổi AMM và quản lý pool thanh khoản.",
    overviewTitle: "Tổng quan Lệnh",
    commands: [
      { cmd: "execute", desc: "Thực thi giao dịch alkanes với protostones" },
      { cmd: "simulate", desc: "Mô phỏng lời gọi hợp đồng mà không phát sóng" },
      { cmd: "trace", desc: "Theo dõi giao dịch alkanes" },
      { cmd: "inspect", desc: "Kiểm tra hợp đồng (disassemble, fuzz, metadata)" },
      { cmd: "getbalance", desc: "Lấy số dư token alkane cho địa chỉ" },
      { cmd: "spendables", desc: "Lấy các outpoint có thể chi tiêu cho địa chỉ" },
      { cmd: "reflect-alkane", desc: "Lấy metadata cho alkane (tên, ký hiệu, cung cấp)" },
      { cmd: "getbytecode", desc: "Lấy bytecode cho hợp đồng alkane" },
      { cmd: "wrap-btc", desc: "Gói BTC thành frBTC" },
      { cmd: "unwrap", desc: "Lấy các unwrap đang chờ" },
      { cmd: "get-all-pools", desc: "Lấy tất cả các pool AMM" },
      { cmd: "pool-details", desc: "Lấy chi tiết cho một pool cụ thể" },
      { cmd: "init-pool", desc: "Khởi tạo pool thanh khoản mới" },
      { cmd: "swap", desc: "Thực hiện hoán đổi trên AMM" }
    ],
    executeTitle: "alkanes execute",
    executeDesc: "Thực thi giao dịch alkanes với một hoặc nhiều protostones.",
    simulateTitle: "alkanes simulate",
    simulateDesc: "Mô phỏng lời gọi hợp đồng alkanes mà không phát sóng.",
    traceTitle: "alkanes trace",
    traceDesc: "Theo dõi giao dịch alkanes để xem chi tiết thực thi.",
    inspectTitle: "alkanes inspect",
    inspectDesc: "Kiểm tra hợp đồng alkanes để gỡ lỗi và phân tích.",
    reflectTitle: "alkanes reflect-alkane",
    reflectDesc: "Lấy metadata cho token alkane bằng cách gọi các opcode xem tiêu chuẩn.",
    balanceTitle: "alkanes getbalance",
    balanceDesc: "Lấy số dư token alkane cho một địa chỉ.",
    wrapTitle: "alkanes wrap-btc",
    wrapDesc: "Gói BTC thành frBTC (Bitcoin được gói).",
    poolsTitle: "alkanes get-all-pools",
    poolsDesc: "Lấy tất cả các pool AMM từ hợp đồng factory.",
    swapTitle: "alkanes swap",
    swapDesc: "Thực hiện hoán đổi trên AMM."
  },
  ko: {
    title: "Alkanes 명령",
    intro: "alkanes 네임스페이스는 컨트랙트 실행, 토큰 조회, AMM 스왑 및 유동성 풀 관리를 포함한 Alkanes 프로토콜 작업을 제공합니다.",
    overviewTitle: "명령 개요",
    commands: [
      { cmd: "execute", desc: "프로토스톤을 사용하여 alkanes 트랜잭션 실행" },
      { cmd: "simulate", desc: "브로드캐스트 없이 컨트랙트 호출 시뮬레이션" },
      { cmd: "trace", desc: "alkanes 트랜잭션 추적" },
      { cmd: "inspect", desc: "컨트랙트 검사 (디스어셈블, 퍼징, 메타데이터)" },
      { cmd: "getbalance", desc: "주소의 alkane 토큰 잔액 가져오기" },
      { cmd: "spendables", desc: "주소의 사용 가능한 출력점 가져오기" },
      { cmd: "reflect-alkane", desc: "alkane 메타데이터 가져오기 (이름, 심볼, 공급량)" },
      { cmd: "getbytecode", desc: "alkane 컨트랙트의 바이트코드 가져오기" },
      { cmd: "wrap-btc", desc: "BTC를 frBTC로 랩핑" },
      { cmd: "unwrap", desc: "보류 중인 언랩 가져오기" },
      { cmd: "get-all-pools", desc: "모든 AMM 풀 가져오기" },
      { cmd: "pool-details", desc: "특정 풀의 세부 정보 가져오기" },
      { cmd: "init-pool", desc: "새 유동성 풀 초기화" },
      { cmd: "swap", desc: "AMM에서 스왑 실행" }
    ],
    executeTitle: "alkanes execute",
    executeDesc: "하나 이상의 프로토스톤으로 alkanes 트랜잭션을 실행합니다.",
    simulateTitle: "alkanes simulate",
    simulateDesc: "브로드캐스트 없이 alkanes 컨트랙트 호출을 시뮬레이션합니다.",
    traceTitle: "alkanes trace",
    traceDesc: "alkanes 트랜잭션을 추적하여 실행 세부 정보를 확인합니다.",
    inspectTitle: "alkanes inspect",
    inspectDesc: "디버깅 및 분석을 위해 alkanes 컨트랙트를 검사합니다.",
    reflectTitle: "alkanes reflect-alkane",
    reflectDesc: "표준 뷰 opcode를 호출하여 alkane 토큰의 메타데이터를 가져옵니다.",
    balanceTitle: "alkanes getbalance",
    balanceDesc: "주소의 alkane 토큰 잔액을 가져옵니다.",
    wrapTitle: "alkanes wrap-btc",
    wrapDesc: "BTC를 frBTC(래핑된 비트코인)로 랩핑합니다.",
    poolsTitle: "alkanes get-all-pools",
    poolsDesc: "팩토리 컨트랙트에서 모든 AMM 풀을 가져옵니다.",
    swapTitle: "alkanes swap",
    swapDesc: "AMM에서 스왑을 실행합니다."
  }
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm my-4">
      <code>{children}</code>
    </pre>
  );
}

export default function AlkanesCommandsPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.overviewTitle}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[color:var(--sf-outline)]">
                <th className="text-left py-2 px-3">Command</th>
                <th className="text-left py-2 px-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {t.commands.map((cmd, i) => (
                <tr key={i} className="border-b border-[color:var(--sf-outline)]">
                  <td className="py-2 px-3 font-mono">{cmd.cmd}</td>
                  <td className="py-2 px-3 text-[color:var(--sf-muted)]">{cmd.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.executeTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.executeDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  alkanes execute <PROTOSTONES> \\
  --to <RECIPIENT> \\
  --fee-rate 10 \\
  -y

# Options:
# --inputs <INPUTS>     Input requirements (B:amount, block:tx:amount)
# --to <TO>             Recipient addresses
# --from <FROM>         Source addresses for UTXOs
# --fee-rate <RATE>     Fee rate in sat/vB
# --envelope <PATH>     Path to envelope file (for contract deployment)
# --trace               Enable transaction tracing
# -y, --auto-confirm    Auto-confirm the transaction`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.simulateTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.simulateDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  alkanes simulate 2:0:99 \\
  --inputs "2:1:1000,32:0:5000"

# Arguments:
# <ALKANE_ID>  Alkane ID with opcode (format: block:tx:opcode)

# Options:
# --inputs <INPUTS>   Input alkanes as comma-separated triplets
# --height <HEIGHT>   Block height for simulation
# --envelope <PATH>   Path to WASM file
# --raw               Show raw JSON output`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.traceTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.traceDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  alkanes trace <TXID>:<VOUT>`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.inspectTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.inspectDesc}</p>
        <CodeBlock>{`# Disassemble bytecode
alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  alkanes inspect 2:0 --disasm

# Show metadata
alkanes-cli alkanes inspect 2:0 --meta

# Fuzz contract with opcode range
alkanes-cli alkanes inspect 2:0 --fuzz --fuzz-ranges "99-110"

# Get code hash
alkanes-cli alkanes inspect 2:0 --codehash`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.reflectTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.reflectDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  alkanes reflect-alkane 2:0

# Output:
# Alkane Metadata for 2:0
# ═══════════════════════
#   Name: DIESEL
#   Symbol: DIESEL
#   Total Supply: 5050000000`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.balanceTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.balanceDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  alkanes getbalance bc1p...`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.wrapTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.wrapDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  alkanes wrap-btc <AMOUNT_SATS> \\
  --fee-rate 10 \\
  -y`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.poolsTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.poolsDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  alkanes get-all-pools`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.swapTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.swapDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  alkanes swap \\
  --pool <POOL_ID> \\
  --token-in <TOKEN_ID> \\
  --amount-in <AMOUNT> \\
  --min-out <MIN_AMOUNT> \\
  --fee-rate 10 \\
  -y`}</CodeBlock>
      </div>
    </div>
  );
}
