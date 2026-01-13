"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Esplora Commands",
    intro: "The esplora namespace provides block explorer functionality for querying blocks, transactions, addresses, and fee estimates via the Electrs/Esplora API.",
    blockQueriesTitle: "Block Queries",
    blockCommands: [
      { cmd: "blocks-tip-hash", desc: "Get the hash of the latest block" },
      { cmd: "blocks-tip-height", desc: "Get the height of the latest block" },
      { cmd: "blocks", desc: "Get latest blocks" },
      { cmd: "block-height", desc: "Get block hash at a height" },
      { cmd: "block", desc: "Get block details" },
      { cmd: "block-status", desc: "Get block status" },
      { cmd: "block-txids", desc: "Get transaction IDs in a block" },
      { cmd: "block-header", desc: "Get block header" },
      { cmd: "block-raw", desc: "Get raw block data" },
      { cmd: "block-txs", desc: "Get transactions in a block" }
    ],
    addressQueriesTitle: "Address Queries",
    addressCommands: [
      { cmd: "address", desc: "Get address information" },
      { cmd: "address-txs", desc: "Get address transactions" },
      { cmd: "address-txs-chain", desc: "Get confirmed address transactions" },
      { cmd: "address-txs-mempool", desc: "Get mempool transactions for address" },
      { cmd: "address-utxo", desc: "Get UTXOs for an address" },
      { cmd: "address-prefix", desc: "Search addresses by prefix" }
    ],
    txQueriesTitle: "Transaction Queries",
    txCommands: [
      { cmd: "tx", desc: "Get transaction details" },
      { cmd: "tx-hex", desc: "Get transaction as hex" },
      { cmd: "tx-raw", desc: "Get raw transaction data" },
      { cmd: "tx-status", desc: "Get transaction status" },
      { cmd: "tx-merkle-proof", desc: "Get merkle proof" },
      { cmd: "tx-outspend", desc: "Get outpoint spending info" },
      { cmd: "tx-outspends", desc: "Get all output spending info" }
    ],
    otherTitle: "Other Commands",
    otherCommands: [
      { cmd: "broadcast", desc: "Broadcast a transaction" },
      { cmd: "mempool", desc: "Get mempool info" },
      { cmd: "mempool-txids", desc: "Get mempool transaction IDs" },
      { cmd: "mempool-recent", desc: "Get recent mempool transactions" },
      { cmd: "fee-estimates", desc: "Get fee rate estimates" }
    ],
    tipHeightTitle: "esplora blocks-tip-height",
    tipHeightDesc: "Get the current blockchain tip height.",
    tipHashTitle: "esplora blocks-tip-hash",
    tipHashDesc: "Get the hash of the latest block.",
    blockTitle: "esplora block",
    blockDesc: "Get details for a specific block.",
    addressTitle: "esplora address",
    addressDesc: "Get information about a Bitcoin address.",
    utxoTitle: "esplora address-utxo",
    utxoDesc: "Get unspent transaction outputs (UTXOs) for an address.",
    txTitle: "esplora tx",
    txDesc: "Get transaction details.",
    feeTitle: "esplora fee-estimates",
    feeDesc: "Get current fee rate estimates for different confirmation targets.",
    broadcastTitle: "esplora broadcast",
    broadcastDesc: "Broadcast a signed transaction to the network.",
    mempoolTitle: "esplora mempool",
    mempoolDesc: "Get mempool statistics.",
    rpcTitle: "JSON-RPC Equivalent",
    rpcDesc: "These CLI commands correspond to JSON-RPC methods with the esplora_ prefix:"
  },
  zh: {
    title: "Esplora 命令",
    intro: "esplora 命名空间通过 Electrs/Esplora API 提供区块浏览器功能，用于查询区块、交易、地址和费率估算。",
    blockQueriesTitle: "区块查询",
    blockCommands: [
      { cmd: "blocks-tip-hash", desc: "获取最新区块的哈希" },
      { cmd: "blocks-tip-height", desc: "获取最新区块的高度" },
      { cmd: "blocks", desc: "获取最新区块列表" },
      { cmd: "block-height", desc: "获取指定高度的区块哈希" },
      { cmd: "block", desc: "获取区块详情" },
      { cmd: "block-status", desc: "获取区块状态" },
      { cmd: "block-txids", desc: "获取区块中的交易 ID" },
      { cmd: "block-header", desc: "获取区块头" },
      { cmd: "block-raw", desc: "获取原始区块数据" },
      { cmd: "block-txs", desc: "获取区块中的交易" }
    ],
    addressQueriesTitle: "地址查询",
    addressCommands: [
      { cmd: "address", desc: "获取地址信息" },
      { cmd: "address-txs", desc: "获取地址交易" },
      { cmd: "address-txs-chain", desc: "获取已确认的地址交易" },
      { cmd: "address-txs-mempool", desc: "获取地址的内存池交易" },
      { cmd: "address-utxo", desc: "获取地址的 UTXO" },
      { cmd: "address-prefix", desc: "按前缀搜索地址" }
    ],
    txQueriesTitle: "交易查询",
    txCommands: [
      { cmd: "tx", desc: "获取交易详情" },
      { cmd: "tx-hex", desc: "获取交易十六进制" },
      { cmd: "tx-raw", desc: "获取原始交易数据" },
      { cmd: "tx-status", desc: "获取交易状态" },
      { cmd: "tx-merkle-proof", desc: "获取默克尔证明" },
      { cmd: "tx-outspend", desc: "获取输出花费信息" },
      { cmd: "tx-outspends", desc: "获取所有输出的花费信息" }
    ],
    otherTitle: "其他命令",
    otherCommands: [
      { cmd: "broadcast", desc: "广播交易" },
      { cmd: "mempool", desc: "获取内存池信息" },
      { cmd: "mempool-txids", desc: "获取内存池交易 ID" },
      { cmd: "mempool-recent", desc: "获取最近的内存池交易" },
      { cmd: "fee-estimates", desc: "获取费率估算" }
    ],
    tipHeightTitle: "esplora blocks-tip-height",
    tipHeightDesc: "获取当前区块链最新高度。",
    tipHashTitle: "esplora blocks-tip-hash",
    tipHashDesc: "获取最新区块的哈希。",
    blockTitle: "esplora block",
    blockDesc: "获取特定区块的详情。",
    addressTitle: "esplora address",
    addressDesc: "获取比特币地址的信息。",
    utxoTitle: "esplora address-utxo",
    utxoDesc: "获取地址的未花费交易输出（UTXO）。",
    txTitle: "esplora tx",
    txDesc: "获取交易详情。",
    feeTitle: "esplora fee-estimates",
    feeDesc: "获取不同确认目标的当前费率估算。",
    broadcastTitle: "esplora broadcast",
    broadcastDesc: "向网络广播已签名的交易。",
    mempoolTitle: "esplora mempool",
    mempoolDesc: "获取内存池统计信息。",
    rpcTitle: "JSON-RPC 对应方法",
    rpcDesc: "这些 CLI 命令对应带有 esplora_ 前缀的 JSON-RPC 方法："
  },
  ms: {
    title: "Arahan Esplora",
    intro: "Ruang nama esplora menyediakan fungsi penjelajah blok untuk pertanyaan blok, transaksi, alamat, dan anggaran fi melalui API Electrs/Esplora.",
    blockQueriesTitle: "Pertanyaan Blok",
    blockCommands: [
      { cmd: "blocks-tip-hash", desc: "Dapatkan hash blok terkini" },
      { cmd: "blocks-tip-height", desc: "Dapatkan ketinggian blok terkini" },
      { cmd: "blocks", desc: "Dapatkan blok terkini" },
      { cmd: "block-height", desc: "Dapatkan hash blok pada ketinggian" },
      { cmd: "block", desc: "Dapatkan butiran blok" },
      { cmd: "block-status", desc: "Dapatkan status blok" },
      { cmd: "block-txids", desc: "Dapatkan ID transaksi dalam blok" },
      { cmd: "block-header", desc: "Dapatkan header blok" },
      { cmd: "block-raw", desc: "Dapatkan data blok mentah" },
      { cmd: "block-txs", desc: "Dapatkan transaksi dalam blok" }
    ],
    addressQueriesTitle: "Pertanyaan Alamat",
    addressCommands: [
      { cmd: "address", desc: "Dapatkan maklumat alamat" },
      { cmd: "address-txs", desc: "Dapatkan transaksi alamat" },
      { cmd: "address-txs-chain", desc: "Dapatkan transaksi alamat yang disahkan" },
      { cmd: "address-txs-mempool", desc: "Dapatkan transaksi mempool untuk alamat" },
      { cmd: "address-utxo", desc: "Dapatkan UTXO untuk alamat" },
      { cmd: "address-prefix", desc: "Cari alamat mengikut awalan" }
    ],
    txQueriesTitle: "Pertanyaan Transaksi",
    txCommands: [
      { cmd: "tx", desc: "Dapatkan butiran transaksi" },
      { cmd: "tx-hex", desc: "Dapatkan transaksi sebagai hex" },
      { cmd: "tx-raw", desc: "Dapatkan data transaksi mentah" },
      { cmd: "tx-status", desc: "Dapatkan status transaksi" },
      { cmd: "tx-merkle-proof", desc: "Dapatkan bukti merkle" },
      { cmd: "tx-outspend", desc: "Dapatkan maklumat perbelanjaan outpoint" },
      { cmd: "tx-outspends", desc: "Dapatkan semua maklumat perbelanjaan output" }
    ],
    otherTitle: "Arahan Lain",
    otherCommands: [
      { cmd: "broadcast", desc: "Siarkan transaksi" },
      { cmd: "mempool", desc: "Dapatkan maklumat mempool" },
      { cmd: "mempool-txids", desc: "Dapatkan ID transaksi mempool" },
      { cmd: "mempool-recent", desc: "Dapatkan transaksi mempool terkini" },
      { cmd: "fee-estimates", desc: "Dapatkan anggaran kadar fi" }
    ],
    tipHeightTitle: "esplora blocks-tip-height",
    tipHeightDesc: "Dapatkan ketinggian tip blockchain semasa.",
    tipHashTitle: "esplora blocks-tip-hash",
    tipHashDesc: "Dapatkan hash blok terkini.",
    blockTitle: "esplora block",
    blockDesc: "Dapatkan butiran untuk blok tertentu.",
    addressTitle: "esplora address",
    addressDesc: "Dapatkan maklumat tentang alamat Bitcoin.",
    utxoTitle: "esplora address-utxo",
    utxoDesc: "Dapatkan output transaksi tidak terbelanja (UTXO) untuk alamat.",
    txTitle: "esplora tx",
    txDesc: "Dapatkan butiran transaksi.",
    feeTitle: "esplora fee-estimates",
    feeDesc: "Dapatkan anggaran kadar fi semasa untuk sasaran pengesahan yang berbeza.",
    broadcastTitle: "esplora broadcast",
    broadcastDesc: "Siarkan transaksi bertandatangan ke rangkaian.",
    mempoolTitle: "esplora mempool",
    mempoolDesc: "Dapatkan statistik mempool.",
    rpcTitle: "Setara JSON-RPC",
    rpcDesc: "Arahan CLI ini sepadan dengan kaedah JSON-RPC dengan awalan esplora_:"
  },
  vi: {
    title: "Lệnh Esplora",
    intro: "Không gian tên esplora cung cấp chức năng trình khám phá khối để truy vấn khối, giao dịch, địa chỉ và ước tính phí qua API Electrs/Esplora.",
    blockQueriesTitle: "Truy vấn Khối",
    blockCommands: [
      { cmd: "blocks-tip-hash", desc: "Lấy hash của khối mới nhất" },
      { cmd: "blocks-tip-height", desc: "Lấy chiều cao của khối mới nhất" },
      { cmd: "blocks", desc: "Lấy các khối mới nhất" },
      { cmd: "block-height", desc: "Lấy hash khối tại chiều cao" },
      { cmd: "block", desc: "Lấy chi tiết khối" },
      { cmd: "block-status", desc: "Lấy trạng thái khối" },
      { cmd: "block-txids", desc: "Lấy ID giao dịch trong khối" },
      { cmd: "block-header", desc: "Lấy header khối" },
      { cmd: "block-raw", desc: "Lấy dữ liệu khối thô" },
      { cmd: "block-txs", desc: "Lấy giao dịch trong khối" }
    ],
    addressQueriesTitle: "Truy vấn Địa chỉ",
    addressCommands: [
      { cmd: "address", desc: "Lấy thông tin địa chỉ" },
      { cmd: "address-txs", desc: "Lấy giao dịch địa chỉ" },
      { cmd: "address-txs-chain", desc: "Lấy giao dịch địa chỉ đã xác nhận" },
      { cmd: "address-txs-mempool", desc: "Lấy giao dịch mempool cho địa chỉ" },
      { cmd: "address-utxo", desc: "Lấy UTXO cho địa chỉ" },
      { cmd: "address-prefix", desc: "Tìm kiếm địa chỉ theo tiền tố" }
    ],
    txQueriesTitle: "Truy vấn Giao dịch",
    txCommands: [
      { cmd: "tx", desc: "Lấy chi tiết giao dịch" },
      { cmd: "tx-hex", desc: "Lấy giao dịch dưới dạng hex" },
      { cmd: "tx-raw", desc: "Lấy dữ liệu giao dịch thô" },
      { cmd: "tx-status", desc: "Lấy trạng thái giao dịch" },
      { cmd: "tx-merkle-proof", desc: "Lấy chứng minh merkle" },
      { cmd: "tx-outspend", desc: "Lấy thông tin chi tiêu outpoint" },
      { cmd: "tx-outspends", desc: "Lấy tất cả thông tin chi tiêu đầu ra" }
    ],
    otherTitle: "Lệnh Khác",
    otherCommands: [
      { cmd: "broadcast", desc: "Phát sóng giao dịch" },
      { cmd: "mempool", desc: "Lấy thông tin mempool" },
      { cmd: "mempool-txids", desc: "Lấy ID giao dịch mempool" },
      { cmd: "mempool-recent", desc: "Lấy giao dịch mempool gần đây" },
      { cmd: "fee-estimates", desc: "Lấy ước tính tỷ lệ phí" }
    ],
    tipHeightTitle: "esplora blocks-tip-height",
    tipHeightDesc: "Lấy chiều cao đầu blockchain hiện tại.",
    tipHashTitle: "esplora blocks-tip-hash",
    tipHashDesc: "Lấy hash của khối mới nhất.",
    blockTitle: "esplora block",
    blockDesc: "Lấy chi tiết cho một khối cụ thể.",
    addressTitle: "esplora address",
    addressDesc: "Lấy thông tin về địa chỉ Bitcoin.",
    utxoTitle: "esplora address-utxo",
    utxoDesc: "Lấy các đầu ra giao dịch chưa chi tiêu (UTXO) cho một địa chỉ.",
    txTitle: "esplora tx",
    txDesc: "Lấy chi tiết giao dịch.",
    feeTitle: "esplora fee-estimates",
    feeDesc: "Lấy ước tính tỷ lệ phí hiện tại cho các mục tiêu xác nhận khác nhau.",
    broadcastTitle: "esplora broadcast",
    broadcastDesc: "Phát sóng giao dịch đã ký lên mạng.",
    mempoolTitle: "esplora mempool",
    mempoolDesc: "Lấy thống kê mempool.",
    rpcTitle: "Tương đương JSON-RPC",
    rpcDesc: "Các lệnh CLI này tương ứng với các phương thức JSON-RPC với tiền tố esplora_:"
  },
  ko: {
    title: "Esplora 명령",
    intro: "esplora 네임스페이스는 Electrs/Esplora API를 통해 블록, 트랜잭션, 주소 및 수수료 추정을 조회하는 블록 탐색기 기능을 제공합니다.",
    blockQueriesTitle: "블록 쿼리",
    blockCommands: [
      { cmd: "blocks-tip-hash", desc: "최신 블록의 해시 가져오기" },
      { cmd: "blocks-tip-height", desc: "최신 블록의 높이 가져오기" },
      { cmd: "blocks", desc: "최신 블록 가져오기" },
      { cmd: "block-height", desc: "높이에서 블록 해시 가져오기" },
      { cmd: "block", desc: "블록 세부 정보 가져오기" },
      { cmd: "block-status", desc: "블록 상태 가져오기" },
      { cmd: "block-txids", desc: "블록의 트랜잭션 ID 가져오기" },
      { cmd: "block-header", desc: "블록 헤더 가져오기" },
      { cmd: "block-raw", desc: "원시 블록 데이터 가져오기" },
      { cmd: "block-txs", desc: "블록의 트랜잭션 가져오기" }
    ],
    addressQueriesTitle: "주소 쿼리",
    addressCommands: [
      { cmd: "address", desc: "주소 정보 가져오기" },
      { cmd: "address-txs", desc: "주소 트랜잭션 가져오기" },
      { cmd: "address-txs-chain", desc: "확인된 주소 트랜잭션 가져오기" },
      { cmd: "address-txs-mempool", desc: "주소의 멤풀 트랜잭션 가져오기" },
      { cmd: "address-utxo", desc: "주소의 UTXO 가져오기" },
      { cmd: "address-prefix", desc: "접두사로 주소 검색" }
    ],
    txQueriesTitle: "트랜잭션 쿼리",
    txCommands: [
      { cmd: "tx", desc: "트랜잭션 세부 정보 가져오기" },
      { cmd: "tx-hex", desc: "트랜잭션을 hex로 가져오기" },
      { cmd: "tx-raw", desc: "원시 트랜잭션 데이터 가져오기" },
      { cmd: "tx-status", desc: "트랜잭션 상태 가져오기" },
      { cmd: "tx-merkle-proof", desc: "머클 증명 가져오기" },
      { cmd: "tx-outspend", desc: "출력점 지출 정보 가져오기" },
      { cmd: "tx-outspends", desc: "모든 출력 지출 정보 가져오기" }
    ],
    otherTitle: "기타 명령",
    otherCommands: [
      { cmd: "broadcast", desc: "트랜잭션 브로드캐스트" },
      { cmd: "mempool", desc: "멤풀 정보 가져오기" },
      { cmd: "mempool-txids", desc: "멤풀 트랜잭션 ID 가져오기" },
      { cmd: "mempool-recent", desc: "최근 멤풀 트랜잭션 가져오기" },
      { cmd: "fee-estimates", desc: "수수료율 추정 가져오기" }
    ],
    tipHeightTitle: "esplora blocks-tip-height",
    tipHeightDesc: "현재 블록체인 팁 높이를 가져옵니다.",
    tipHashTitle: "esplora blocks-tip-hash",
    tipHashDesc: "최신 블록의 해시를 가져옵니다.",
    blockTitle: "esplora block",
    blockDesc: "특정 블록의 세부 정보를 가져옵니다.",
    addressTitle: "esplora address",
    addressDesc: "비트코인 주소에 대한 정보를 가져옵니다.",
    utxoTitle: "esplora address-utxo",
    utxoDesc: "주소의 미사용 트랜잭션 출력(UTXO)을 가져옵니다.",
    txTitle: "esplora tx",
    txDesc: "트랜잭션 세부 정보를 가져옵니다.",
    feeTitle: "esplora fee-estimates",
    feeDesc: "다양한 확인 목표에 대한 현재 수수료율 추정치를 가져옵니다.",
    broadcastTitle: "esplora broadcast",
    broadcastDesc: "서명된 트랜잭션을 네트워크에 브로드캐스트합니다.",
    mempoolTitle: "esplora mempool",
    mempoolDesc: "멤풀 통계를 가져옵니다.",
    rpcTitle: "JSON-RPC 등가물",
    rpcDesc: "이러한 CLI 명령은 esplora_ 접두사가 있는 JSON-RPC 메서드에 해당합니다:"
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

export default function EsploraCommandsPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.blockQueriesTitle}</h2>
        <CommandTable commands={t.blockCommands} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.addressQueriesTitle}</h2>
        <CommandTable commands={t.addressCommands} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.txQueriesTitle}</h2>
        <CommandTable commands={t.txCommands} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.otherTitle}</h2>
        <CommandTable commands={t.otherCommands} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.tipHeightTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.tipHeightDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  esplora blocks-tip-height

# Output:
# Tip Height: 850123`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.blockTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.blockDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  esplora block 840000

# Arguments:
# <BLOCK_HASH_OR_HEIGHT>  Block hash or height`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.addressTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.addressDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  esplora address bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h

# Arguments:
# <ADDRESS>  Bitcoin address`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.utxoTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.utxoDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  esplora address-utxo bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h

# Arguments:
# <ADDRESS>  Bitcoin address

# Example Response:
# [
#   {
#     "txid": "abc123...",
#     "vout": 0,
#     "value": 10000,
#     "status": {
#       "confirmed": true,
#       "block_height": 840000
#     }
#   }
# ]`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.txTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.txDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  esplora tx <TXID>

# Arguments:
# <TXID>  Transaction ID`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.feeTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.feeDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  esplora fee-estimates

# Example Response:
# {
#   "1": 25.5,    // 1 block target: 25.5 sat/vB
#   "3": 20.0,    // 3 block target: 20.0 sat/vB
#   "6": 15.2,    // 6 block target: 15.2 sat/vB
#   "25": 10.0,   // 25 block target: 10.0 sat/vB
#   "144": 5.0,   // 144 block target: 5.0 sat/vB
#   "504": 3.0    // 504 block target: 3.0 sat/vB
# }`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.broadcastTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.broadcastDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  esplora broadcast <TX_HEX>

# Arguments:
# <TX_HEX>  Signed transaction as hexadecimal`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.mempoolTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.mempoolDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  esplora mempool

# Get mempool transaction IDs
alkanes-cli esplora mempool-txids

# Get recent mempool transactions
alkanes-cli esplora mempool-recent`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.rpcTitle}</h2>
        <p className="mb-4">{t.rpcDesc}</p>
        <CodeBlock>{`# CLI → JSON-RPC mapping:
# esplora address-utxo → esplora_address::utxo
# esplora fee-estimates → esplora_fee-estimates
# esplora blocks-tip-height → esplora_blocks:tip:height

# Example JSON-RPC:
{
  "jsonrpc": "2.0",
  "method": "esplora_address::utxo",
  "params": ["bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h"],
  "id": 1
}`}</CodeBlock>
      </div>
    </div>
  );
}
