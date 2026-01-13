"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Ord Commands",
    intro: "The ord namespace provides queries for the Ordinals protocol including inscriptions, runes, satoshis, and related data.",
    overviewTitle: "Commands Overview",
    commands: [
      { cmd: "inscription", desc: "Get inscription details by ID" },
      { cmd: "inscriptions-in-block", desc: "Get all inscriptions in a block" },
      { cmd: "address-info", desc: "Get address information" },
      { cmd: "block-info", desc: "Get block information" },
      { cmd: "block-count", desc: "Get the latest block count" },
      { cmd: "blocks", desc: "Get latest blocks" },
      { cmd: "children", desc: "Get children of an inscription" },
      { cmd: "content", desc: "Get inscription content" },
      { cmd: "output", desc: "Get output information" },
      { cmd: "parents", desc: "Get parents of an inscription" },
      { cmd: "rune", desc: "Get rune information" },
      { cmd: "sat", desc: "Get sat information" },
      { cmd: "tx-info", desc: "Get transaction information" }
    ],
    inscriptionTitle: "ord inscription",
    inscriptionDesc: "Get details about an Ordinal inscription by ID.",
    inscriptionsBlockTitle: "ord inscriptions-in-block",
    inscriptionsBlockDesc: "Get all inscriptions created in a specific block.",
    addressInfoTitle: "ord address-info",
    addressInfoDesc: "Get Ordinals-related information for an address.",
    blockInfoTitle: "ord block-info",
    blockInfoDesc: "Get detailed block information from the Ord indexer.",
    blockCountTitle: "ord block-count",
    blockCountDesc: "Get the current block count from the Ord indexer.",
    childrenTitle: "ord children",
    childrenDesc: "Get child inscriptions of a parent inscription.",
    contentTitle: "ord content",
    contentDesc: "Get the content of an inscription.",
    outputTitle: "ord output",
    outputDesc: "Get information about a specific transaction output.",
    parentsTitle: "ord parents",
    parentsDesc: "Get parent inscriptions of a child inscription.",
    runeTitle: "ord rune",
    runeDesc: "Get information about a Rune by name.",
    satTitle: "ord sat",
    satDesc: "Get information about a specific satoshi.",
    txInfoTitle: "ord tx-info",
    txInfoDesc: "Get transaction information from the Ord indexer.",
    rpcTitle: "JSON-RPC Equivalent",
    rpcDesc: "These CLI commands correspond to JSON-RPC methods:"
  },
  zh: {
    title: "Ord 命令",
    intro: "ord 命名空间提供 Ordinals 协议的查询功能，包括铭文、符文、聪和相关数据。",
    overviewTitle: "命令概览",
    commands: [
      { cmd: "inscription", desc: "按 ID 获取铭文详情" },
      { cmd: "inscriptions-in-block", desc: "获取区块中的所有铭文" },
      { cmd: "address-info", desc: "获取地址信息" },
      { cmd: "block-info", desc: "获取区块信息" },
      { cmd: "block-count", desc: "获取最新区块高度" },
      { cmd: "blocks", desc: "获取最新区块" },
      { cmd: "children", desc: "获取铭文的子铭文" },
      { cmd: "content", desc: "获取铭文内容" },
      { cmd: "output", desc: "获取输出信息" },
      { cmd: "parents", desc: "获取铭文的父铭文" },
      { cmd: "rune", desc: "获取符文信息" },
      { cmd: "sat", desc: "获取聪信息" },
      { cmd: "tx-info", desc: "获取交易信息" }
    ],
    inscriptionTitle: "ord inscription",
    inscriptionDesc: "按 ID 获取 Ordinal 铭文的详情。",
    inscriptionsBlockTitle: "ord inscriptions-in-block",
    inscriptionsBlockDesc: "获取特定区块中创建的所有铭文。",
    addressInfoTitle: "ord address-info",
    addressInfoDesc: "获取地址的 Ordinals 相关信息。",
    blockInfoTitle: "ord block-info",
    blockInfoDesc: "从 Ord 索引器获取详细的区块信息。",
    blockCountTitle: "ord block-count",
    blockCountDesc: "从 Ord 索引器获取当前区块高度。",
    childrenTitle: "ord children",
    childrenDesc: "获取父铭文的子铭文。",
    contentTitle: "ord content",
    contentDesc: "获取铭文的内容。",
    outputTitle: "ord output",
    outputDesc: "获取特定交易输出的信息。",
    parentsTitle: "ord parents",
    parentsDesc: "获取子铭文的父铭文。",
    runeTitle: "ord rune",
    runeDesc: "按名称获取符文信息。",
    satTitle: "ord sat",
    satDesc: "获取特定聪的信息。",
    txInfoTitle: "ord tx-info",
    txInfoDesc: "从 Ord 索引器获取交易信息。",
    rpcTitle: "JSON-RPC 对应方法",
    rpcDesc: "这些 CLI 命令对应以下 JSON-RPC 方法："
  },
  ms: {
    title: "Arahan Ord",
    intro: "Ruang nama ord menyediakan pertanyaan untuk protokol Ordinals termasuk inskripsi, rune, satoshi, dan data berkaitan.",
    overviewTitle: "Gambaran Arahan",
    commands: [
      { cmd: "inscription", desc: "Dapatkan butiran inskripsi mengikut ID" },
      { cmd: "inscriptions-in-block", desc: "Dapatkan semua inskripsi dalam blok" },
      { cmd: "address-info", desc: "Dapatkan maklumat alamat" },
      { cmd: "block-info", desc: "Dapatkan maklumat blok" },
      { cmd: "block-count", desc: "Dapatkan kiraan blok terkini" },
      { cmd: "blocks", desc: "Dapatkan blok terkini" },
      { cmd: "children", desc: "Dapatkan anak inskripsi" },
      { cmd: "content", desc: "Dapatkan kandungan inskripsi" },
      { cmd: "output", desc: "Dapatkan maklumat output" },
      { cmd: "parents", desc: "Dapatkan induk inskripsi" },
      { cmd: "rune", desc: "Dapatkan maklumat rune" },
      { cmd: "sat", desc: "Dapatkan maklumat sat" },
      { cmd: "tx-info", desc: "Dapatkan maklumat transaksi" }
    ],
    inscriptionTitle: "ord inscription",
    inscriptionDesc: "Dapatkan butiran tentang inskripsi Ordinal mengikut ID.",
    inscriptionsBlockTitle: "ord inscriptions-in-block",
    inscriptionsBlockDesc: "Dapatkan semua inskripsi yang dicipta dalam blok tertentu.",
    addressInfoTitle: "ord address-info",
    addressInfoDesc: "Dapatkan maklumat berkaitan Ordinals untuk alamat.",
    blockInfoTitle: "ord block-info",
    blockInfoDesc: "Dapatkan maklumat blok terperinci dari pengindeks Ord.",
    blockCountTitle: "ord block-count",
    blockCountDesc: "Dapatkan kiraan blok semasa dari pengindeks Ord.",
    childrenTitle: "ord children",
    childrenDesc: "Dapatkan inskripsi anak dari inskripsi induk.",
    contentTitle: "ord content",
    contentDesc: "Dapatkan kandungan inskripsi.",
    outputTitle: "ord output",
    outputDesc: "Dapatkan maklumat tentang output transaksi tertentu.",
    parentsTitle: "ord parents",
    parentsDesc: "Dapatkan inskripsi induk dari inskripsi anak.",
    runeTitle: "ord rune",
    runeDesc: "Dapatkan maklumat tentang Rune mengikut nama.",
    satTitle: "ord sat",
    satDesc: "Dapatkan maklumat tentang satoshi tertentu.",
    txInfoTitle: "ord tx-info",
    txInfoDesc: "Dapatkan maklumat transaksi dari pengindeks Ord.",
    rpcTitle: "Setara JSON-RPC",
    rpcDesc: "Arahan CLI ini sepadan dengan kaedah JSON-RPC:"
  },
  vi: {
    title: "Lệnh Ord",
    intro: "Không gian tên ord cung cấp các truy vấn cho giao thức Ordinals bao gồm inscription, rune, satoshi và dữ liệu liên quan.",
    overviewTitle: "Tổng quan Lệnh",
    commands: [
      { cmd: "inscription", desc: "Lấy chi tiết inscription theo ID" },
      { cmd: "inscriptions-in-block", desc: "Lấy tất cả inscription trong một khối" },
      { cmd: "address-info", desc: "Lấy thông tin địa chỉ" },
      { cmd: "block-info", desc: "Lấy thông tin khối" },
      { cmd: "block-count", desc: "Lấy số khối mới nhất" },
      { cmd: "blocks", desc: "Lấy các khối mới nhất" },
      { cmd: "children", desc: "Lấy inscription con" },
      { cmd: "content", desc: "Lấy nội dung inscription" },
      { cmd: "output", desc: "Lấy thông tin đầu ra" },
      { cmd: "parents", desc: "Lấy inscription cha" },
      { cmd: "rune", desc: "Lấy thông tin rune" },
      { cmd: "sat", desc: "Lấy thông tin sat" },
      { cmd: "tx-info", desc: "Lấy thông tin giao dịch" }
    ],
    inscriptionTitle: "ord inscription",
    inscriptionDesc: "Lấy chi tiết về inscription Ordinal theo ID.",
    inscriptionsBlockTitle: "ord inscriptions-in-block",
    inscriptionsBlockDesc: "Lấy tất cả các inscription được tạo trong một khối cụ thể.",
    addressInfoTitle: "ord address-info",
    addressInfoDesc: "Lấy thông tin liên quan đến Ordinals cho một địa chỉ.",
    blockInfoTitle: "ord block-info",
    blockInfoDesc: "Lấy thông tin khối chi tiết từ indexer Ord.",
    blockCountTitle: "ord block-count",
    blockCountDesc: "Lấy số khối hiện tại từ indexer Ord.",
    childrenTitle: "ord children",
    childrenDesc: "Lấy các inscription con của inscription cha.",
    contentTitle: "ord content",
    contentDesc: "Lấy nội dung của một inscription.",
    outputTitle: "ord output",
    outputDesc: "Lấy thông tin về một đầu ra giao dịch cụ thể.",
    parentsTitle: "ord parents",
    parentsDesc: "Lấy các inscription cha của inscription con.",
    runeTitle: "ord rune",
    runeDesc: "Lấy thông tin về Rune theo tên.",
    satTitle: "ord sat",
    satDesc: "Lấy thông tin về một satoshi cụ thể.",
    txInfoTitle: "ord tx-info",
    txInfoDesc: "Lấy thông tin giao dịch từ indexer Ord.",
    rpcTitle: "Tương đương JSON-RPC",
    rpcDesc: "Các lệnh CLI này tương ứng với các phương thức JSON-RPC:"
  },
  ko: {
    title: "Ord 명령",
    intro: "ord 네임스페이스는 인스크립션, 룬, 사토시 및 관련 데이터를 포함한 Ordinals 프로토콜 쿼리를 제공합니다.",
    overviewTitle: "명령 개요",
    commands: [
      { cmd: "inscription", desc: "ID로 인스크립션 세부 정보 가져오기" },
      { cmd: "inscriptions-in-block", desc: "블록의 모든 인스크립션 가져오기" },
      { cmd: "address-info", desc: "주소 정보 가져오기" },
      { cmd: "block-info", desc: "블록 정보 가져오기" },
      { cmd: "block-count", desc: "최신 블록 수 가져오기" },
      { cmd: "blocks", desc: "최신 블록 가져오기" },
      { cmd: "children", desc: "인스크립션의 자식 가져오기" },
      { cmd: "content", desc: "인스크립션 콘텐츠 가져오기" },
      { cmd: "output", desc: "출력 정보 가져오기" },
      { cmd: "parents", desc: "인스크립션의 부모 가져오기" },
      { cmd: "rune", desc: "룬 정보 가져오기" },
      { cmd: "sat", desc: "sat 정보 가져오기" },
      { cmd: "tx-info", desc: "트랜잭션 정보 가져오기" }
    ],
    inscriptionTitle: "ord inscription",
    inscriptionDesc: "ID로 Ordinal 인스크립션에 대한 세부 정보를 가져옵니다.",
    inscriptionsBlockTitle: "ord inscriptions-in-block",
    inscriptionsBlockDesc: "특정 블록에서 생성된 모든 인스크립션을 가져옵니다.",
    addressInfoTitle: "ord address-info",
    addressInfoDesc: "주소에 대한 Ordinals 관련 정보를 가져옵니다.",
    blockInfoTitle: "ord block-info",
    blockInfoDesc: "Ord 인덱서에서 상세한 블록 정보를 가져옵니다.",
    blockCountTitle: "ord block-count",
    blockCountDesc: "Ord 인덱서에서 현재 블록 수를 가져옵니다.",
    childrenTitle: "ord children",
    childrenDesc: "부모 인스크립션의 자식 인스크립션을 가져옵니다.",
    contentTitle: "ord content",
    contentDesc: "인스크립션의 콘텐츠를 가져옵니다.",
    outputTitle: "ord output",
    outputDesc: "특정 트랜잭션 출력에 대한 정보를 가져옵니다.",
    parentsTitle: "ord parents",
    parentsDesc: "자식 인스크립션의 부모 인스크립션을 가져옵니다.",
    runeTitle: "ord rune",
    runeDesc: "이름으로 Rune에 대한 정보를 가져옵니다.",
    satTitle: "ord sat",
    satDesc: "특정 사토시에 대한 정보를 가져옵니다.",
    txInfoTitle: "ord tx-info",
    txInfoDesc: "Ord 인덱서에서 트랜잭션 정보를 가져옵니다.",
    rpcTitle: "JSON-RPC 등가물",
    rpcDesc: "이러한 CLI 명령은 JSON-RPC 메서드에 해당합니다:"
  }
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm my-4">
      <code>{children}</code>
    </pre>
  );
}

export default function OrdCommandsPage() {
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
        <h2 className="text-2xl font-semibold mb-2">{t.inscriptionTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.inscriptionDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  ord inscription 6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0

# Arguments:
# <INSCRIPTION_ID>  Inscription ID (format: txid + i + index)

# Example Response:
# {
#   "id": "6fb976ab...i0",
#   "number": 12345,
#   "address": "bc1p...",
#   "content_type": "image/png",
#   "content_length": 1234,
#   "sat": 1234567890,
#   "timestamp": "2024-01-15T12:30:00Z"
# }`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.inscriptionsBlockTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.inscriptionsBlockDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  ord inscriptions-in-block 840000

# Arguments:
# <BLOCK_HEIGHT>  Block height to query`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.addressInfoTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.addressInfoDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  ord address-info bc1p...

# Arguments:
# <ADDRESS>  Bitcoin address to query`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.blockCountTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.blockCountDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  ord block-count

# Output:
# 850123`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.runeTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.runeDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  ord rune "UNCOMMON•GOODS"

# Arguments:
# <RUNE_NAME>  Rune name (with bullet character if applicable)

# Example Response:
# {
#   "id": "840000:1",
#   "name": "UNCOMMON•GOODS",
#   "symbol": "⧉",
#   "divisibility": 0,
#   "supply": "21000000",
#   "burned": "0"
# }`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.satTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.satDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  ord sat 1234567890

# Arguments:
# <SAT>  Satoshi number

# Example Response:
# {
#   "sat": 1234567890,
#   "rarity": "common",
#   "block": 12345,
#   "cycle": 0,
#   "epoch": 0,
#   "period": 0,
#   "inscription": null
# }`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.childrenTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.childrenDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  ord children 6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0

# Arguments:
# <INSCRIPTION_ID>  Parent inscription ID`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.contentTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.contentDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  ord content 6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0

# Arguments:
# <INSCRIPTION_ID>  Inscription ID

# Returns the raw content bytes of the inscription.`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.outputTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.outputDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  ord output <TXID>:<VOUT>

# Arguments:
# <OUTPOINT>  Transaction output (format: txid:vout)`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">{t.txInfoTitle}</h2>
        <p className="text-[color:var(--sf-muted)] mb-4">{t.txInfoDesc}</p>
        <CodeBlock>{`alkanes-cli -p mainnet \\
  --jsonrpc-url https://mainnet.subfrost.io/v4/jsonrpc \\
  ord tx-info <TXID>

# Arguments:
# <TXID>  Transaction ID`}</CodeBlock>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">{t.rpcTitle}</h2>
        <p className="mb-4">{t.rpcDesc}</p>
        <CodeBlock>{`# CLI → JSON-RPC mapping:
# ord inscription → ord_inscription
# ord rune → ord_rune
# ord sat → ord_sat
# ord block-count → ord_blockcount

# Example JSON-RPC:
{
  "jsonrpc": "2.0",
  "method": "ord_inscription",
  "params": ["6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0"],
  "id": 1
}`}</CodeBlock>
      </div>
    </div>
  );
}
