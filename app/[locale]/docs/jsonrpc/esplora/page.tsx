"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "esplora_* Methods",
    intro: "The esplora_* namespace provides access to Electrs/Esplora block explorer functionality. These methods mirror the Esplora REST API.",
    addressMethodsTitle: "Address Methods",
    addressMethods: [
      { name: "esplora_address", desc: "Get address information including chain stats" },
      { name: "esplora_address::utxo", desc: "Get unspent transaction outputs for an address" },
      { name: "esplora_address::txs", desc: "Get transaction history for an address" }
    ],
    txMethodsTitle: "Transaction Methods",
    txMethods: [
      { name: "esplora_tx", desc: "Get full transaction details" },
      { name: "esplora_tx::status", desc: "Get transaction confirmation status" },
      { name: "esplora_tx::hex", desc: "Get raw transaction hex" },
      { name: "esplora_tx::outspends", desc: "Get spend status for all outputs" }
    ],
    blockMethodsTitle: "Block Methods",
    blockMethods: [
      { name: "esplora_block", desc: "Get block details by hash" },
      { name: "esplora_block-height", desc: "Get block hash at a specific height" },
      { name: "esplora_block::txids", desc: "Get all transaction IDs in a block" }
    ],
    mempoolMethodsTitle: "Mempool Methods",
    mempoolMethods: [
      { name: "esplora_mempool", desc: "Get mempool statistics" },
      { name: "esplora_mempool::recent", desc: "Get recent mempool transactions" }
    ],
    feeMethodsTitle: "Fee Estimation",
    feeMethods: [
      { name: "esplora_fee-estimates", desc: "Get fee estimates for different confirmation targets" }
    ],
    addressTitle: "esplora_address",
    addressDesc: "Get address information including chain stats.",
    utxoTitle: "esplora_address::utxo",
    utxoDesc: "Get unspent transaction outputs for an address.",
    txTitle: "esplora_tx",
    txDesc: "Get full transaction details.",
    txStatusTitle: "esplora_tx::status",
    txStatusDesc: "Get transaction confirmation status.",
    blockTitle: "esplora_block",
    blockDesc: "Get block details by hash.",
    blockHeightTitle: "esplora_block-height",
    blockHeightDesc: "Get block hash at a specific height.",
    mempoolTitle: "esplora_mempool",
    mempoolDesc: "Get mempool statistics.",
    feeEstimatesTitle: "esplora_fee-estimates",
    feeEstimatesDesc: "Get fee estimates for different confirmation targets."
  },
  zh: {
    title: "esplora_* 方法",
    intro: "esplora_* 命名空间提供对 Electrs/Esplora 区块浏览器功能的访问。这些方法与 Esplora REST API 相对应。",
    addressMethodsTitle: "地址方法",
    addressMethods: [
      { name: "esplora_address", desc: "获取地址信息，包括链上统计" },
      { name: "esplora_address::utxo", desc: "获取地址的未花费交易输出" },
      { name: "esplora_address::txs", desc: "获取地址的交易历史" }
    ],
    txMethodsTitle: "交易方法",
    txMethods: [
      { name: "esplora_tx", desc: "获取完整的交易详情" },
      { name: "esplora_tx::status", desc: "获取交易确认状态" },
      { name: "esplora_tx::hex", desc: "获取原始交易十六进制" },
      { name: "esplora_tx::outspends", desc: "获取所有输出的花费状态" }
    ],
    blockMethodsTitle: "区块方法",
    blockMethods: [
      { name: "esplora_block", desc: "按哈希获取区块详情" },
      { name: "esplora_block-height", desc: "获取指定高度的区块哈希" },
      { name: "esplora_block::txids", desc: "获取区块中所有交易 ID" }
    ],
    mempoolMethodsTitle: "内存池方法",
    mempoolMethods: [
      { name: "esplora_mempool", desc: "获取内存池统计信息" },
      { name: "esplora_mempool::recent", desc: "获取最近的内存池交易" }
    ],
    feeMethodsTitle: "费用估算",
    feeMethods: [
      { name: "esplora_fee-estimates", desc: "获取不同确认目标的费用估算" }
    ],
    addressTitle: "esplora_address",
    addressDesc: "获取地址信息，包括链上统计。",
    utxoTitle: "esplora_address::utxo",
    utxoDesc: "获取地址的未花费交易输出。",
    txTitle: "esplora_tx",
    txDesc: "获取完整的交易详情。",
    txStatusTitle: "esplora_tx::status",
    txStatusDesc: "获取交易确认状态。",
    blockTitle: "esplora_block",
    blockDesc: "按哈希获取区块详情。",
    blockHeightTitle: "esplora_block-height",
    blockHeightDesc: "获取指定高度的区块哈希。",
    mempoolTitle: "esplora_mempool",
    mempoolDesc: "获取内存池统计信息。",
    feeEstimatesTitle: "esplora_fee-estimates",
    feeEstimatesDesc: "获取不同确认目标的费用估算。"
  },
  ms: {
    title: "Kaedah esplora_*",
    intro: "Ruang nama esplora_* menyediakan akses kepada fungsi penjelajah blok Electrs/Esplora. Kaedah-kaedah ini sepadan dengan Esplora REST API.",
    addressMethodsTitle: "Kaedah Alamat",
    addressMethods: [
      { name: "esplora_address", desc: "Dapatkan maklumat alamat termasuk statistik rantaian" },
      { name: "esplora_address::utxo", desc: "Dapatkan output transaksi yang belum dibelanjakan untuk alamat" },
      { name: "esplora_address::txs", desc: "Dapatkan sejarah transaksi untuk alamat" }
    ],
    txMethodsTitle: "Kaedah Transaksi",
    txMethods: [
      { name: "esplora_tx", desc: "Dapatkan butiran transaksi lengkap" },
      { name: "esplora_tx::status", desc: "Dapatkan status pengesahan transaksi" },
      { name: "esplora_tx::hex", desc: "Dapatkan heksadesimal transaksi mentah" },
      { name: "esplora_tx::outspends", desc: "Dapatkan status perbelanjaan untuk semua output" }
    ],
    blockMethodsTitle: "Kaedah Blok",
    blockMethods: [
      { name: "esplora_block", desc: "Dapatkan butiran blok mengikut hash" },
      { name: "esplora_block-height", desc: "Dapatkan hash blok pada ketinggian tertentu" },
      { name: "esplora_block::txids", desc: "Dapatkan semua ID transaksi dalam blok" }
    ],
    mempoolMethodsTitle: "Kaedah Mempool",
    mempoolMethods: [
      { name: "esplora_mempool", desc: "Dapatkan statistik mempool" },
      { name: "esplora_mempool::recent", desc: "Dapatkan transaksi mempool terkini" }
    ],
    feeMethodsTitle: "Anggaran Bayaran",
    feeMethods: [
      { name: "esplora_fee-estimates", desc: "Dapatkan anggaran bayaran untuk sasaran pengesahan berbeza" }
    ],
    addressTitle: "esplora_address",
    addressDesc: "Dapatkan maklumat alamat termasuk statistik rantaian.",
    utxoTitle: "esplora_address::utxo",
    utxoDesc: "Dapatkan output transaksi yang belum dibelanjakan untuk alamat.",
    txTitle: "esplora_tx",
    txDesc: "Dapatkan butiran transaksi lengkap.",
    txStatusTitle: "esplora_tx::status",
    txStatusDesc: "Dapatkan status pengesahan transaksi.",
    blockTitle: "esplora_block",
    blockDesc: "Dapatkan butiran blok mengikut hash.",
    blockHeightTitle: "esplora_block-height",
    blockHeightDesc: "Dapatkan hash blok pada ketinggian tertentu.",
    mempoolTitle: "esplora_mempool",
    mempoolDesc: "Dapatkan statistik mempool.",
    feeEstimatesTitle: "esplora_fee-estimates",
    feeEstimatesDesc: "Dapatkan anggaran bayaran untuk sasaran pengesahan berbeza."
  },
  vi: {
    title: "Các phương thức esplora_*",
    intro: "Namespace esplora_* cung cấp quyền truy cập vào chức năng trình khám phá khối Electrs/Esplora. Các phương thức này tương ứng với Esplora REST API.",
    addressMethodsTitle: "Phương thức Địa chỉ",
    addressMethods: [
      { name: "esplora_address", desc: "Lấy thông tin địa chỉ bao gồm thống kê chuỗi" },
      { name: "esplora_address::utxo", desc: "Lấy các đầu ra giao dịch chưa chi tiêu cho một địa chỉ" },
      { name: "esplora_address::txs", desc: "Lấy lịch sử giao dịch cho một địa chỉ" }
    ],
    txMethodsTitle: "Phương thức Giao dịch",
    txMethods: [
      { name: "esplora_tx", desc: "Lấy chi tiết giao dịch đầy đủ" },
      { name: "esplora_tx::status", desc: "Lấy trạng thái xác nhận giao dịch" },
      { name: "esplora_tx::hex", desc: "Lấy hex giao dịch thô" },
      { name: "esplora_tx::outspends", desc: "Lấy trạng thái chi tiêu cho tất cả các đầu ra" }
    ],
    blockMethodsTitle: "Phương thức Khối",
    blockMethods: [
      { name: "esplora_block", desc: "Lấy chi tiết khối theo hash" },
      { name: "esplora_block-height", desc: "Lấy hash khối tại một chiều cao cụ thể" },
      { name: "esplora_block::txids", desc: "Lấy tất cả ID giao dịch trong một khối" }
    ],
    mempoolMethodsTitle: "Phương thức Mempool",
    mempoolMethods: [
      { name: "esplora_mempool", desc: "Lấy thống kê mempool" },
      { name: "esplora_mempool::recent", desc: "Lấy các giao dịch mempool gần đây" }
    ],
    feeMethodsTitle: "Ước tính Phí",
    feeMethods: [
      { name: "esplora_fee-estimates", desc: "Lấy ước tính phí cho các mục tiêu xác nhận khác nhau" }
    ],
    addressTitle: "esplora_address",
    addressDesc: "Lấy thông tin địa chỉ bao gồm thống kê chuỗi.",
    utxoTitle: "esplora_address::utxo",
    utxoDesc: "Lấy các đầu ra giao dịch chưa chi tiêu cho một địa chỉ.",
    txTitle: "esplora_tx",
    txDesc: "Lấy chi tiết giao dịch đầy đủ.",
    txStatusTitle: "esplora_tx::status",
    txStatusDesc: "Lấy trạng thái xác nhận giao dịch.",
    blockTitle: "esplora_block",
    blockDesc: "Lấy chi tiết khối theo hash.",
    blockHeightTitle: "esplora_block-height",
    blockHeightDesc: "Lấy hash khối tại một chiều cao cụ thể.",
    mempoolTitle: "esplora_mempool",
    mempoolDesc: "Lấy thống kê mempool.",
    feeEstimatesTitle: "esplora_fee-estimates",
    feeEstimatesDesc: "Lấy ước tính phí cho các mục tiêu xác nhận khác nhau."
  },
  ko: {
    title: "esplora_* 메서드",
    intro: "esplora_* 네임스페이스는 Electrs/Esplora 블록 탐색기 기능에 대한 액세스를 제공합니다. 이러한 메서드는 Esplora REST API와 일치합니다.",
    addressMethodsTitle: "주소 메서드",
    addressMethods: [
      { name: "esplora_address", desc: "체인 통계를 포함한 주소 정보 가져오기" },
      { name: "esplora_address::utxo", desc: "주소의 미사용 거래 출력 가져오기" },
      { name: "esplora_address::txs", desc: "주소의 거래 내역 가져오기" }
    ],
    txMethodsTitle: "거래 메서드",
    txMethods: [
      { name: "esplora_tx", desc: "전체 거래 세부 정보 가져오기" },
      { name: "esplora_tx::status", desc: "거래 확인 상태 가져오기" },
      { name: "esplora_tx::hex", desc: "원시 거래 hex 가져오기" },
      { name: "esplora_tx::outspends", desc: "모든 출력에 대한 지출 상태 가져오기" }
    ],
    blockMethodsTitle: "블록 메서드",
    blockMethods: [
      { name: "esplora_block", desc: "해시로 블록 세부 정보 가져오기" },
      { name: "esplora_block-height", desc: "특정 높이의 블록 해시 가져오기" },
      { name: "esplora_block::txids", desc: "블록의 모든 거래 ID 가져오기" }
    ],
    mempoolMethodsTitle: "멤풀 메서드",
    mempoolMethods: [
      { name: "esplora_mempool", desc: "멤풀 통계 가져오기" },
      { name: "esplora_mempool::recent", desc: "최근 멤풀 거래 가져오기" }
    ],
    feeMethodsTitle: "수수료 추정",
    feeMethods: [
      { name: "esplora_fee-estimates", desc: "다른 확인 목표에 대한 수수료 추정 가져오기" }
    ],
    addressTitle: "esplora_address",
    addressDesc: "체인 통계를 포함한 주소 정보를 가져옵니다.",
    utxoTitle: "esplora_address::utxo",
    utxoDesc: "주소의 미사용 거래 출력을 가져옵니다.",
    txTitle: "esplora_tx",
    txDesc: "전체 거래 세부 정보를 가져옵니다.",
    txStatusTitle: "esplora_tx::status",
    txStatusDesc: "거래 확인 상태를 가져옵니다.",
    blockTitle: "esplora_block",
    blockDesc: "해시로 블록 세부 정보를 가져옵니다.",
    blockHeightTitle: "esplora_block-height",
    blockHeightDesc: "특정 높이의 블록 해시를 가져옵니다.",
    mempoolTitle: "esplora_mempool",
    mempoolDesc: "멤풀 통계를 가져옵니다.",
    feeEstimatesTitle: "esplora_fee-estimates",
    feeEstimatesDesc: "다른 확인 목표에 대한 수수료 추정을 가져옵니다."
  }
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm my-4">
      <code>{children}</code>
    </pre>
  );
}

function MethodTable({ methods }: { methods: { name: string; desc: string }[] }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[color:var(--sf-outline)]">
            <th className="text-left py-2 px-3">Method</th>
            <th className="text-left py-2 px-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {methods.map((m, i) => (
            <tr key={i} className="border-b border-[color:var(--sf-outline)]">
              <td className="py-2 px-3 font-mono">{m.name}</td>
              <td className="py-2 px-3 text-[color:var(--sf-muted)]">{m.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EsploraRPCPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">{t.title}</h1>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.addressMethodsTitle}</h2>
        <MethodTable methods={t.addressMethods} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.txMethodsTitle}</h2>
        <MethodTable methods={t.txMethods} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.blockMethodsTitle}</h2>
        <MethodTable methods={t.blockMethods} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.mempoolMethodsTitle}</h2>
        <MethodTable methods={t.mempoolMethods} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t.feeMethodsTitle}</h2>
        <MethodTable methods={t.feeMethods} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">{t.addressTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.addressDesc}</p>
        <CodeBlock>{`// Request
{
  "jsonrpc": "2.0",
  "method": "esplora_address",
  "params": ["bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h"],
  "id": 1
}

// Response
{
  "jsonrpc": "2.0",
  "result": {
    "address": "bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h",
    "chain_stats": {
      "funded_txo_count": 2265512,
      "funded_txo_sum": 5519171660624754,
      "spent_txo_count": 2264780,
      "spent_txo_sum": 5517676571260341,
      "tx_count": 2058518
    }
  },
  "id": 1
}

// Lua Example
local address = args[1]
local info = _RPC.esplora_address(address)
local stats = info.chain_stats
return {
  address = info.address,
  balance = stats.funded_txo_sum - stats.spent_txo_sum,
  tx_count = stats.tx_count
}`}</CodeBlock>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">{t.utxoTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.utxoDesc}</p>
        <CodeBlock>{`// Request
{
  "jsonrpc": "2.0",
  "method": "esplora_address::utxo",
  "params": ["bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h"],
  "id": 1
}

// Response
{
  "jsonrpc": "2.0",
  "result": [
    {
      "txid": "b875d7c6d8de34b5ac2d1deb8aecc0856190e1310ea7d71e9b7fd866313e648c",
      "vout": 3,
      "value": 1833859462,
      "status": {
        "confirmed": true,
        "block_height": 925724
      }
    }
  ],
  "id": 1
}

// Lua Example
local address = args[1]
local utxos = _RPC.esplora_addressutxo(address)
local total = 0
for _, utxo in ipairs(utxos) do
  total = total + utxo.value
end
return { utxo_count = #utxos, total_sats = total }`}</CodeBlock>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">{t.txTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.txDesc}</p>
        <CodeBlock>{`// Request
{
  "jsonrpc": "2.0",
  "method": "esplora_tx",
  "params": ["0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098"],
  "id": 1
}

// Response
{
  "jsonrpc": "2.0",
  "result": {
    "txid": "0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098",
    "version": 1,
    "locktime": 0,
    "size": 134,
    "weight": 536,
    "fee": 0,
    "vin": [...],
    "vout": [...],
    "status": {
      "confirmed": true,
      "block_height": 1
    }
  },
  "id": 1
}

// Lua Example
local txid = args[1]
local tx = _RPC.esplora_tx(txid)
return {
  txid = tx.txid,
  fee = tx.fee,
  size = tx.size,
  confirmed = tx.status.confirmed
}`}</CodeBlock>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">{t.blockTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.blockDesc}</p>
        <CodeBlock>{`// Request
{
  "jsonrpc": "2.0",
  "method": "esplora_block",
  "params": ["0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5"],
  "id": 1
}

// Response
{
  "jsonrpc": "2.0",
  "result": {
    "id": "0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5",
    "height": 840000,
    "tx_count": 3050,
    "size": 2325617,
    "weight": 3993281,
    "timestamp": 1713571767
  },
  "id": 1
}

// Lua Example
local hash = args[1]
local block = _RPC.esplora_block(hash)
return {
  height = block.height,
  tx_count = block.tx_count,
  size_kb = block.size / 1000
}`}</CodeBlock>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">{t.feeEstimatesTitle}</h3>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.feeEstimatesDesc}</p>
        <CodeBlock>{`// Request
{
  "jsonrpc": "2.0",
  "method": "esplora_fee-estimates",
  "params": [],
  "id": 1
}

// Response
{
  "jsonrpc": "2.0",
  "result": {
    "1": 1.013,    // 1 block target
    "2": 1.013,    // 2 block target
    "6": 1.013,    // 6 block target
    "25": 1.013,   // 25 block target
    "144": 0.734,  // ~1 day
    "504": 0.734,  // ~3.5 days
    "1008": 0.734  // ~1 week
  },
  "id": 1
}

// Lua Example
local fees = _RPC.esplora_feeestimates()
return {
  next_block = fees["1"],
  within_hour = fees["6"],
  economy = fees["1008"]
}`}</CodeBlock>
      </div>
    </div>
  );
}
