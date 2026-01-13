"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "BRC20-Prog Commands",
    intro: "The brc20-prog namespace provides operations for BRC20-Prog, the EVM-compatible smart contract layer on Bitcoin. This enables Ethereum-style contract deployment and interaction.",
    endpointTitle: "Endpoint Configuration",
    endpointDesc: "BRC20-Prog uses a separate JSON-RPC endpoint:",
    contractOpsTitle: "Contract Operations",
    contractOps: [
      { cmd: "deploy", desc: "Deploy a contract from Foundry build JSON" },
      { cmd: "transact", desc: "Call a contract function (state-changing)" },
      { cmd: "call", desc: "Call a contract function (read-only, eth_call)" },
      { cmd: "wrap-btc", desc: "Wrap BTC to frBTC and execute in brc20-prog" }
    ],
    inscriptionSafetyTitle: "Inscription Safety",
    inscriptionSafetyDesc: "The SDK automatically protects inscribed UTXOs by splitting them before use. If a UTXO contains inscriptions, a split transaction sends inscribed sats to a safe output before the commit transaction.",
    contractQueriesTitle: "Contract Queries",
    contractQueries: [
      { cmd: "get-code", desc: "Get contract bytecode (eth_getCode)" },
      { cmd: "get-contract-deploys", desc: "Get contract deployments by address" },
      { cmd: "get-storage-at", desc: "Get storage at location (eth_getStorageAt)" }
    ],
    balanceTitle: "Balance & Account",
    balanceCommands: [
      { cmd: "get-balance", desc: "Get frBTC balance (eth_getBalance)" },
      { cmd: "brc20-balance", desc: "Get BRC20 balance (brc20_balance)" },
      { cmd: "get-transaction-count", desc: "Get nonce (eth_getTransactionCount)" }
    ],
    txQueriesTitle: "Transaction Queries",
    txQueries: [
      { cmd: "get-transaction", desc: "Get transaction by hash" },
      { cmd: "get-transaction-receipt", desc: "Get transaction receipt" },
      { cmd: "get-receipt-by-inscription", desc: "Get receipt by inscription ID" },
      { cmd: "trace-transaction", desc: "Get transaction trace" }
    ],
    blockQueriesTitle: "Block Queries",
    blockQueries: [
      { cmd: "block-number", desc: "Get current block number" },
      { cmd: "get-block-by-number", desc: "Get block by number" },
      { cmd: "get-block-by-hash", desc: "Get block by hash" }
    ],
    otherTitle: "Other Commands",
    otherCommands: [
      { cmd: "estimate-gas", desc: "Estimate gas (eth_estimateGas)" },
      { cmd: "chain-id", desc: "Get chain ID (eth_chainId)" },
      { cmd: "gas-price", desc: "Get gas price (eth_gasPrice)" },
      { cmd: "get-logs", desc: "Get logs (eth_getLogs)" },
      { cmd: "unwrap", desc: "Get pending unwraps from FrBTC contract" }
    ],
    deployTitle: "brc20-prog deploy-contract",
    deployDesc: "Deploy a Solidity contract from Foundry build output.",
    transactTitle: "brc20-prog transact",
    transactDesc: "Call a state-changing function on a BRC20-prog contract.",
    wrapBtcTitle: "brc20-prog wrap-btc",
    wrapBtcDesc: "Wrap BTC to frBTC and execute a function on a target contract.",
    callTitle: "brc20-prog call",
    callDesc: "Make a read-only call to a contract (eth_call equivalent).",
    getBalanceTitle: "brc20-prog get-balance",
    getBalanceDesc: "Get the frBTC balance of an address.",
    blockNumberTitle: "brc20-prog block-number",
    blockNumberDesc: "Get the current block number.",
    getLogsTitle: "brc20-prog get-logs",
    getLogsDesc: "Get event logs matching filter criteria.",
    rpcTitle: "JSON-RPC Methods",
    rpcDesc: "BRC20-Prog supports standard Ethereum JSON-RPC methods:",
    rpcSpecificTitle: "BRC20-Prog Specific Methods"
  },
  zh: {
    title: "BRC20-Prog 命令",
    intro: "brc20-prog 命名空间提供 BRC20-Prog 操作，这是比特币上的 EVM 兼容智能合约层。它支持以太坊风格的合约部署和交互。",
    endpointTitle: "端点配置",
    endpointDesc: "BRC20-Prog 使用独立的 JSON-RPC 端点：",
    contractOpsTitle: "合约操作",
    contractOps: [
      { cmd: "deploy", desc: "从 Foundry 构建 JSON 部署合约" },
      { cmd: "transact", desc: "调用合约函数（状态变更）" },
      { cmd: "call", desc: "调用合约函数（只读，eth_call）" },
      { cmd: "wrap-btc", desc: "封装 BTC 为 frBTC 并在 brc20-prog 中执行" }
    ],
    inscriptionSafetyTitle: "铭文安全",
    inscriptionSafetyDesc: "SDK 会自动保护包含铭文的 UTXO，在使用前将其拆分。如果 UTXO 包含铭文，拆分交易会在提交交易之前将铭文聪发送到安全输出。",
    contractQueriesTitle: "合约查询",
    contractQueries: [
      { cmd: "get-code", desc: "获取合约字节码（eth_getCode）" },
      { cmd: "get-contract-deploys", desc: "按地址获取合约部署" },
      { cmd: "get-storage-at", desc: "获取存储位置的值（eth_getStorageAt）" }
    ],
    balanceTitle: "余额与账户",
    balanceCommands: [
      { cmd: "get-balance", desc: "获取 frBTC 余额（eth_getBalance）" },
      { cmd: "brc20-balance", desc: "获取 BRC20 余额（brc20_balance）" },
      { cmd: "get-transaction-count", desc: "获取 nonce（eth_getTransactionCount）" }
    ],
    txQueriesTitle: "交易查询",
    txQueries: [
      { cmd: "get-transaction", desc: "按哈希获取交易" },
      { cmd: "get-transaction-receipt", desc: "获取交易收据" },
      { cmd: "get-receipt-by-inscription", desc: "按铭文 ID 获取收据" },
      { cmd: "trace-transaction", desc: "获取交易跟踪" }
    ],
    blockQueriesTitle: "区块查询",
    blockQueries: [
      { cmd: "block-number", desc: "获取当前区块号" },
      { cmd: "get-block-by-number", desc: "按编号获取区块" },
      { cmd: "get-block-by-hash", desc: "按哈希获取区块" }
    ],
    otherTitle: "其他命令",
    otherCommands: [
      { cmd: "estimate-gas", desc: "估算 Gas（eth_estimateGas）" },
      { cmd: "chain-id", desc: "获取链 ID（eth_chainId）" },
      { cmd: "gas-price", desc: "获取 Gas 价格（eth_gasPrice）" },
      { cmd: "get-logs", desc: "获取日志（eth_getLogs）" },
      { cmd: "unwrap", desc: "获取 FrBTC 合约的待处理解封" }
    ],
    deployTitle: "brc20-prog deploy-contract",
    deployDesc: "从 Foundry 构建输出部署 Solidity 合约。",
    transactTitle: "brc20-prog transact",
    transactDesc: "在 BRC20-prog 合约上调用状态变更函数。",
    wrapBtcTitle: "brc20-prog wrap-btc",
    wrapBtcDesc: "封装 BTC 为 frBTC 并在目标合约上执行函数。",
    callTitle: "brc20-prog call",
    callDesc: "对合约进行只读调用（eth_call 等效）。",
    getBalanceTitle: "brc20-prog get-balance",
    getBalanceDesc: "获取地址的 frBTC 余额。",
    blockNumberTitle: "brc20-prog block-number",
    blockNumberDesc: "获取当前区块号。",
    getLogsTitle: "brc20-prog get-logs",
    getLogsDesc: "获取匹配过滤条件的事件日志。",
    rpcTitle: "JSON-RPC 方法",
    rpcDesc: "BRC20-Prog 支持标准以太坊 JSON-RPC 方法：",
    rpcSpecificTitle: "BRC20-Prog 特定方法"
  },
  ms: {
    title: "Arahan BRC20-Prog",
    intro: "Ruang nama brc20-prog menyediakan operasi untuk BRC20-Prog, lapisan kontrak pintar yang serasi dengan EVM pada Bitcoin. Ini membolehkan penyebaran dan interaksi kontrak gaya Ethereum.",
    endpointTitle: "Konfigurasi Endpoint",
    endpointDesc: "BRC20-Prog menggunakan endpoint JSON-RPC berasingan:",
    contractOpsTitle: "Operasi Kontrak",
    contractOps: [
      { cmd: "deploy", desc: "Laksanakan kontrak dari JSON pembinaan Foundry" },
      { cmd: "transact", desc: "Panggil fungsi kontrak (perubahan keadaan)" },
      { cmd: "call", desc: "Panggil fungsi kontrak (baca sahaja, eth_call)" },
      { cmd: "wrap-btc", desc: "Balut BTC ke frBTC dan laksanakan dalam brc20-prog" }
    ],
    inscriptionSafetyTitle: "Keselamatan Inskripsi",
    inscriptionSafetyDesc: "SDK secara automatik melindungi UTXO yang mengandungi inskripsi dengan membahagikannya sebelum digunakan. Jika UTXO mengandungi inskripsi, transaksi pembahagian menghantar sat berinskripsi ke output selamat sebelum transaksi komit.",
    contractQueriesTitle: "Pertanyaan Kontrak",
    contractQueries: [
      { cmd: "get-code", desc: "Dapatkan bytecode kontrak (eth_getCode)" },
      { cmd: "get-contract-deploys", desc: "Dapatkan penyebaran kontrak mengikut alamat" },
      { cmd: "get-storage-at", desc: "Dapatkan storan pada lokasi (eth_getStorageAt)" }
    ],
    balanceTitle: "Baki & Akaun",
    balanceCommands: [
      { cmd: "get-balance", desc: "Dapatkan baki frBTC (eth_getBalance)" },
      { cmd: "brc20-balance", desc: "Dapatkan baki BRC20 (brc20_balance)" },
      { cmd: "get-transaction-count", desc: "Dapatkan nonce (eth_getTransactionCount)" }
    ],
    txQueriesTitle: "Pertanyaan Transaksi",
    txQueries: [
      { cmd: "get-transaction", desc: "Dapatkan transaksi mengikut hash" },
      { cmd: "get-transaction-receipt", desc: "Dapatkan resit transaksi" },
      { cmd: "get-receipt-by-inscription", desc: "Dapatkan resit mengikut ID inskripsi" },
      { cmd: "trace-transaction", desc: "Dapatkan jejak transaksi" }
    ],
    blockQueriesTitle: "Pertanyaan Blok",
    blockQueries: [
      { cmd: "block-number", desc: "Dapatkan nombor blok semasa" },
      { cmd: "get-block-by-number", desc: "Dapatkan blok mengikut nombor" },
      { cmd: "get-block-by-hash", desc: "Dapatkan blok mengikut hash" }
    ],
    otherTitle: "Arahan Lain",
    otherCommands: [
      { cmd: "estimate-gas", desc: "Anggaran gas (eth_estimateGas)" },
      { cmd: "chain-id", desc: "Dapatkan ID rantai (eth_chainId)" },
      { cmd: "gas-price", desc: "Dapatkan harga gas (eth_gasPrice)" },
      { cmd: "get-logs", desc: "Dapatkan log (eth_getLogs)" },
      { cmd: "unwrap", desc: "Dapatkan unwrap tertunda dari kontrak FrBTC" }
    ],
    deployTitle: "brc20-prog deploy-contract",
    deployDesc: "Laksanakan kontrak Solidity dari output pembinaan Foundry.",
    transactTitle: "brc20-prog transact",
    transactDesc: "Panggil fungsi perubahan keadaan pada kontrak BRC20-prog.",
    wrapBtcTitle: "brc20-prog wrap-btc",
    wrapBtcDesc: "Balut BTC ke frBTC dan laksanakan fungsi pada kontrak sasaran.",
    callTitle: "brc20-prog call",
    callDesc: "Buat panggilan baca sahaja kepada kontrak (setara eth_call).",
    getBalanceTitle: "brc20-prog get-balance",
    getBalanceDesc: "Dapatkan baki frBTC alamat.",
    blockNumberTitle: "brc20-prog block-number",
    blockNumberDesc: "Dapatkan nombor blok semasa.",
    getLogsTitle: "brc20-prog get-logs",
    getLogsDesc: "Dapatkan log peristiwa yang sepadan dengan kriteria penapis.",
    rpcTitle: "Kaedah JSON-RPC",
    rpcDesc: "BRC20-Prog menyokong kaedah JSON-RPC Ethereum standard:",
    rpcSpecificTitle: "Kaedah Khusus BRC20-Prog"
  },
  vi: {
    title: "Lệnh BRC20-Prog",
    intro: "Không gian tên brc20-prog cung cấp các thao tác cho BRC20-Prog, lớp hợp đồng thông minh tương thích EVM trên Bitcoin. Điều này cho phép triển khai và tương tác hợp đồng theo kiểu Ethereum.",
    endpointTitle: "Cấu hình Điểm cuối",
    endpointDesc: "BRC20-Prog sử dụng điểm cuối JSON-RPC riêng:",
    contractOpsTitle: "Thao tác Hợp đồng",
    contractOps: [
      { cmd: "deploy", desc: "Triển khai hợp đồng từ JSON build Foundry" },
      { cmd: "transact", desc: "Gọi hàm hợp đồng (thay đổi trạng thái)" },
      { cmd: "call", desc: "Gọi hàm hợp đồng (chỉ đọc, eth_call)" },
      { cmd: "wrap-btc", desc: "Gói BTC thành frBTC và thực thi trong brc20-prog" }
    ],
    inscriptionSafetyTitle: "An toàn Inscription",
    inscriptionSafetyDesc: "SDK tự động bảo vệ các UTXO chứa inscription bằng cách tách chúng trước khi sử dụng. Nếu UTXO chứa inscription, giao dịch tách sẽ gửi sat được khắc đến đầu ra an toàn trước giao dịch commit.",
    contractQueriesTitle: "Truy vấn Hợp đồng",
    contractQueries: [
      { cmd: "get-code", desc: "Lấy bytecode hợp đồng (eth_getCode)" },
      { cmd: "get-contract-deploys", desc: "Lấy triển khai hợp đồng theo địa chỉ" },
      { cmd: "get-storage-at", desc: "Lấy storage tại vị trí (eth_getStorageAt)" }
    ],
    balanceTitle: "Số dư & Tài khoản",
    balanceCommands: [
      { cmd: "get-balance", desc: "Lấy số dư frBTC (eth_getBalance)" },
      { cmd: "brc20-balance", desc: "Lấy số dư BRC20 (brc20_balance)" },
      { cmd: "get-transaction-count", desc: "Lấy nonce (eth_getTransactionCount)" }
    ],
    txQueriesTitle: "Truy vấn Giao dịch",
    txQueries: [
      { cmd: "get-transaction", desc: "Lấy giao dịch theo hash" },
      { cmd: "get-transaction-receipt", desc: "Lấy biên lai giao dịch" },
      { cmd: "get-receipt-by-inscription", desc: "Lấy biên lai theo ID inscription" },
      { cmd: "trace-transaction", desc: "Lấy trace giao dịch" }
    ],
    blockQueriesTitle: "Truy vấn Khối",
    blockQueries: [
      { cmd: "block-number", desc: "Lấy số khối hiện tại" },
      { cmd: "get-block-by-number", desc: "Lấy khối theo số" },
      { cmd: "get-block-by-hash", desc: "Lấy khối theo hash" }
    ],
    otherTitle: "Lệnh Khác",
    otherCommands: [
      { cmd: "estimate-gas", desc: "Ước tính gas (eth_estimateGas)" },
      { cmd: "chain-id", desc: "Lấy ID chuỗi (eth_chainId)" },
      { cmd: "gas-price", desc: "Lấy giá gas (eth_gasPrice)" },
      { cmd: "get-logs", desc: "Lấy logs (eth_getLogs)" },
      { cmd: "unwrap", desc: "Lấy unwrap đang chờ từ hợp đồng FrBTC" }
    ],
    deployTitle: "brc20-prog deploy-contract",
    deployDesc: "Triển khai hợp đồng Solidity từ đầu ra build Foundry.",
    transactTitle: "brc20-prog transact",
    transactDesc: "Gọi hàm thay đổi trạng thái trên hợp đồng BRC20-prog.",
    wrapBtcTitle: "brc20-prog wrap-btc",
    wrapBtcDesc: "Gói BTC thành frBTC và thực thi hàm trên hợp đồng mục tiêu.",
    callTitle: "brc20-prog call",
    callDesc: "Thực hiện lời gọi chỉ đọc đến hợp đồng (tương đương eth_call).",
    getBalanceTitle: "brc20-prog get-balance",
    getBalanceDesc: "Lấy số dư frBTC của một địa chỉ.",
    blockNumberTitle: "brc20-prog block-number",
    blockNumberDesc: "Lấy số khối hiện tại.",
    getLogsTitle: "brc20-prog get-logs",
    getLogsDesc: "Lấy log sự kiện khớp với tiêu chí lọc.",
    rpcTitle: "Phương thức JSON-RPC",
    rpcDesc: "BRC20-Prog hỗ trợ các phương thức JSON-RPC Ethereum tiêu chuẩn:",
    rpcSpecificTitle: "Phương thức Đặc thù BRC20-Prog"
  },
  ko: {
    title: "BRC20-Prog 명령",
    intro: "brc20-prog 네임스페이스는 비트코인의 EVM 호환 스마트 컨트랙트 레이어인 BRC20-Prog에 대한 작업을 제공합니다. 이를 통해 이더리움 스타일의 컨트랙트 배포 및 상호작용이 가능합니다.",
    endpointTitle: "엔드포인트 구성",
    endpointDesc: "BRC20-Prog는 별도의 JSON-RPC 엔드포인트를 사용합니다:",
    contractOpsTitle: "컨트랙트 작업",
    contractOps: [
      { cmd: "deploy", desc: "Foundry 빌드 JSON에서 컨트랙트 배포" },
      { cmd: "transact", desc: "컨트랙트 함수 호출 (상태 변경)" },
      { cmd: "call", desc: "컨트랙트 함수 호출 (읽기 전용, eth_call)" },
      { cmd: "wrap-btc", desc: "BTC를 frBTC로 랩핑하고 brc20-prog에서 실행" }
    ],
    inscriptionSafetyTitle: "인스크립션 안전",
    inscriptionSafetyDesc: "SDK는 인스크립션이 포함된 UTXO를 사용 전에 자동으로 분할하여 보호합니다. UTXO에 인스크립션이 포함된 경우, 분할 트랜잭션이 커밋 트랜잭션 전에 인스크립션된 sat을 안전한 출력으로 보냅니다.",
    contractQueriesTitle: "컨트랙트 쿼리",
    contractQueries: [
      { cmd: "get-code", desc: "컨트랙트 바이트코드 가져오기 (eth_getCode)" },
      { cmd: "get-contract-deploys", desc: "주소별 컨트랙트 배포 가져오기" },
      { cmd: "get-storage-at", desc: "위치의 스토리지 가져오기 (eth_getStorageAt)" }
    ],
    balanceTitle: "잔액 & 계정",
    balanceCommands: [
      { cmd: "get-balance", desc: "frBTC 잔액 가져오기 (eth_getBalance)" },
      { cmd: "brc20-balance", desc: "BRC20 잔액 가져오기 (brc20_balance)" },
      { cmd: "get-transaction-count", desc: "nonce 가져오기 (eth_getTransactionCount)" }
    ],
    txQueriesTitle: "트랜잭션 쿼리",
    txQueries: [
      { cmd: "get-transaction", desc: "해시로 트랜잭션 가져오기" },
      { cmd: "get-transaction-receipt", desc: "트랜잭션 영수증 가져오기" },
      { cmd: "get-receipt-by-inscription", desc: "인스크립션 ID로 영수증 가져오기" },
      { cmd: "trace-transaction", desc: "트랜잭션 추적 가져오기" }
    ],
    blockQueriesTitle: "블록 쿼리",
    blockQueries: [
      { cmd: "block-number", desc: "현재 블록 번호 가져오기" },
      { cmd: "get-block-by-number", desc: "번호로 블록 가져오기" },
      { cmd: "get-block-by-hash", desc: "해시로 블록 가져오기" }
    ],
    otherTitle: "기타 명령",
    otherCommands: [
      { cmd: "estimate-gas", desc: "가스 추정 (eth_estimateGas)" },
      { cmd: "chain-id", desc: "체인 ID 가져오기 (eth_chainId)" },
      { cmd: "gas-price", desc: "가스 가격 가져오기 (eth_gasPrice)" },
      { cmd: "get-logs", desc: "로그 가져오기 (eth_getLogs)" },
      { cmd: "unwrap", desc: "FrBTC 컨트랙트에서 보류 중인 언랩 가져오기" }
    ],
    deployTitle: "brc20-prog deploy-contract",
    deployDesc: "Foundry 빌드 출력에서 Solidity 컨트랙트를 배포합니다.",
    transactTitle: "brc20-prog transact",
    transactDesc: "BRC20-prog 컨트랙트에서 상태 변경 함수를 호출합니다.",
    wrapBtcTitle: "brc20-prog wrap-btc",
    wrapBtcDesc: "BTC를 frBTC로 랩핑하고 대상 컨트랙트에서 함수를 실행합니다.",
    callTitle: "brc20-prog call",
    callDesc: "컨트랙트에 읽기 전용 호출을 수행합니다 (eth_call 등가).",
    getBalanceTitle: "brc20-prog get-balance",
    getBalanceDesc: "주소의 frBTC 잔액을 가져옵니다.",
    blockNumberTitle: "brc20-prog block-number",
    blockNumberDesc: "현재 블록 번호를 가져옵니다.",
    getLogsTitle: "brc20-prog get-logs",
    getLogsDesc: "필터 기준과 일치하는 이벤트 로그를 가져옵니다.",
    rpcTitle: "JSON-RPC 메서드",
    rpcDesc: "BRC20-Prog는 표준 이더리움 JSON-RPC 메서드를 지원합니다:",
    rpcSpecificTitle: "BRC20-Prog 특정 메서드"
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

export default function BRC20ProgCommandsPage() {
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
        <p className="mb-4">{t.endpointDesc}</p>
        <CodeBlock>{`# Using the brc20-prog endpoint
alkanes-cli -p mainnet \\
  --brc20-prog-rpc-url https://mainnet.subfrost.io/v4/jsonrpc/brc20-prog \\
  brc20-prog block-number

# Or with your API key:
--brc20-prog-rpc-url https://mainnet.subfrost.io/v4/YOUR_API_KEY/brc20-prog`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.contractOpsTitle}</h2>
        <CommandTable commands={t.contractOps} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.inscriptionSafetyTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.inscriptionSafetyDesc}</p>
        <CodeBlock>{`# Transaction bundle for contract deployment with inscribed UTXO:
# 1. Split TX: Protects inscribed sats → safe output
# 2. Commit TX: Uses clean sats from split
# 3. Reveal TX: Reveals the inscription
# 4. Activation TX: Activates the contract (optional)

# All transactions are broadcast atomically via sendrawtransactions`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.contractQueriesTitle}</h2>
        <CommandTable commands={t.contractQueries} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.balanceTitle}</h2>
        <CommandTable commands={t.balanceCommands} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.txQueriesTitle}</h2>
        <CommandTable commands={t.txQueries} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.blockQueriesTitle}</h2>
        <CommandTable commands={t.blockQueries} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.otherTitle}</h2>
        <CommandTable commands={t.otherCommands} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.deployTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.deployDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --brc20-prog-rpc-url https://mainnet.subfrost.io/v4/jsonrpc/brc20-prog \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  brc20-prog deploy ./out/MyContract.sol/MyContract.json \\
  --fee-rate 10

# Arguments:
# <FOUNDRY_JSON_PATH>  Path to Foundry build JSON file

# Options:
# --from <addresses>    Addresses to source UTXOs from
# --change <address>    Change address
# --fee-rate <rate>     Fee rate in sat/vB
# --use-activation      Use 3-transaction activation pattern
# --mempool-indexer     Enable mempool indexer for pending UTXO tracing
# --trace               Enable transaction tracing
# --mine                Mine a block after broadcasting (regtest only)
# --raw                 Output raw JSON

# Output includes split_txid and split_fee if inscribed UTXOs were split`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.transactTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.transactDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --brc20-prog-rpc-url https://mainnet.subfrost.io/v4/jsonrpc/brc20-prog \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  brc20-prog transact 0x1234...abcd "transfer(address,uint256)" 0xRecipient...,1000 \\
  --fee-rate 10

# Arguments:
# <address>     Contract address (0x prefixed hex)
# <signature>   Function signature (e.g., "transfer(address,uint256)")
# [calldata...] Arguments as comma-separated values

# Options:
# --from <addresses>    Addresses to source UTXOs from
# --change <address>    Change address
# --fee-rate <rate>     Fee rate in sat/vB
# --mempool-indexer     Enable mempool indexer for pending UTXO tracing
# --trace               Enable transaction tracing
# --mine                Mine a block after broadcasting (regtest only)
# --raw                 Output raw JSON

# Output includes split_txid and split_fee if inscribed UTXOs were split`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.wrapBtcTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.wrapBtcDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --brc20-prog-rpc-url https://mainnet.subfrost.io/v4/jsonrpc/brc20-prog \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  brc20-prog wrap-btc 100000 \\
  --target 0x1234...abcd \\
  --signature "deposit()" \\
  --calldata "" \\
  --fee-rate 10 \\
  -y

# Arguments:
# <AMOUNT>  Amount of BTC to wrap (in satoshis)

# Options:
# --target <TARGET>         Target contract address
# --signature <SIGNATURE>   Function signature to call
# --calldata <CALLDATA>     Calldata arguments`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.callTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.callDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --brc20-prog-rpc-url https://mainnet.subfrost.io/v4/jsonrpc/brc20-prog \\
  brc20-prog call \\
  --to 0x1234...abcd \\
  --data 0x70a08231000000000000000000000000...`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.getBalanceTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.getBalanceDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --brc20-prog-rpc-url https://mainnet.subfrost.io/v4/jsonrpc/brc20-prog \\
  brc20-prog get-balance 0x1234...abcd`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.blockNumberTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.blockNumberDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --brc20-prog-rpc-url https://mainnet.subfrost.io/v4/jsonrpc/brc20-prog \\
  brc20-prog block-number`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.getLogsTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.getLogsDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --brc20-prog-rpc-url https://mainnet.subfrost.io/v4/jsonrpc/brc20-prog \\
  brc20-prog get-logs \\
  --address 0x1234...abcd \\
  --from-block 840000 \\
  --to-block latest`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.rpcTitle}</h2>
        <p className="mb-4">{t.rpcDesc}</p>
        <CodeBlock>{`# Standard Ethereum JSON-RPC methods:
eth_blockNumber
eth_getBalance
eth_getCode
eth_call
eth_estimateGas
eth_getTransactionByHash
eth_getTransactionReceipt
eth_getBlockByNumber
eth_getBlockByHash
eth_getTransactionCount
eth_getStorageAt
eth_getLogs
eth_chainId
eth_gasPrice`}</CodeBlock>

        <h3 className="text-xl font-medium mt-6 mb-3">{t.rpcSpecificTitle}</h3>
        <CodeBlock>{`# BRC20-Prog specific methods:
brc20_version
brc20_balance
brc20_getTxReceiptByInscriptionId
brc20_getInscriptionIdByTxHash
brc20_getInscriptionIdByContractAddress`}</CodeBlock>
      </div>
    </div>
  );
}
