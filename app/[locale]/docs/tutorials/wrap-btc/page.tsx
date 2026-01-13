"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Wrap/Unwrap BTC",
    subtitle: "Convert BTC to frBTC for use in Alkanes DeFi",
    intro: "frBTC (Fractional BTC) is a synthetic representation of Bitcoin on the Alkanes protocol. This tutorial covers how to wrap BTC to frBTC and unwrap frBTC back to BTC.",

    overviewTitle: "Overview",
    overviewDesc: "The frBTC contract at [32, 0] allows users to:",
    features: [
      { name: "Wrap BTC", desc: "Send BTC to the signer address to mint frBTC" },
      { name: "Unwrap frBTC", desc: "Burn frBTC to receive BTC at a specified address" },
      { name: "Query Signer", desc: "Get the current signer public key" },
      { name: "Premium Fee", desc: "Small fee deducted on wrap (configurable)" },
    ],

    howItWorksTitle: "How Wrapping Works",
    howItWorksDesc: "The wrapping process verifies Bitcoin transactions on-chain:",
    steps: [
      "User sends BTC to the signer's p2tr address",
      "User calls wrap (opcode 77) on frBTC contract",
      "Contract verifies BTC was sent to signer",
      "Contract mints equivalent frBTC (minus premium)",
      "frBTC is sent to the caller",
    ],

    unwrapProcessTitle: "How Unwrapping Works",
    unwrapProcessDesc: "The unwrap process creates payment records for the signer:",
    unwrapSteps: [
      "User calls unwrap (opcode 78) with frBTC",
      "Contract burns the frBTC",
      "Contract creates payment record for the signer",
      "Signer processes payment and sends BTC",
      "Payment is marked complete",
    ],

    wrapCommandTitle: "Wrapping BTC",
    wrapCommandDesc: "Use the alkanes-cli wrap-btc command:",

    unwrapCommandTitle: "Unwrapping frBTC",
    unwrapCommandDesc: "Call the unwrap opcode on the frBTC contract:",

    queryCommandsTitle: "Query Commands",
    queryCommandsDesc: "Check frBTC state and balances:",

    premiumTitle: "Premium Fee",
    premiumDesc: "The frBTC contract charges a small premium on wraps. The premium is measured in parts per 100,000,000 (satoshis per BTC).",

    signerTitle: "Signer Address",
    signerDesc: "The signer is the address that holds the wrapped BTC. Only the signer can process unwrap requests.",

    frbtcContractTitle: "frBTC Contract Structure",
    frbtcContractDesc: "Key components of the frBTC contract:",

    storageLayoutTitle: "Storage Layout",
    storageLayout: [
      { path: "/signer", desc: "Signer public key (x-only, 32 bytes)" },
      { path: "/premium", desc: "Premium fee in parts per 100M" },
      { path: "/totalsupply", desc: "Total frBTC supply" },
      { path: "/seen/{txid}", desc: "Processed transaction IDs" },
      { path: "/payments/byheight/{h}", desc: "Pending payment records" },
    ],

    opcodesTitle: "frBTC Opcodes",
    opcodes: [
      { opcode: "0", name: "Initialize", desc: "Set up the contract with auth token" },
      { opcode: "1", name: "SetSigner", desc: "Update the signer pubkey (owner only)" },
      { opcode: "4", name: "SetPremium", desc: "Update the premium fee (owner only)" },
      { opcode: "77", name: "Wrap", desc: "Mint frBTC for BTC sent to signer" },
      { opcode: "78", name: "Unwrap", desc: "Burn frBTC and create payment record" },
      { opcode: "99", name: "GetName", desc: "Return 'frBTC'" },
      { opcode: "100", name: "GetSymbol", desc: "Return 'frBTC'" },
      { opcode: "101", name: "GetPendingPayments", desc: "Get all pending payment records" },
      { opcode: "103", name: "GetSigner", desc: "Return signer pubkey" },
      { opcode: "104", name: "GetPremium", desc: "Return current premium" },
      { opcode: "105", name: "GetTotalSupply", desc: "Return total supply" },
    ],

    securityTitle: "Security Considerations",
    securityItems: [
      "frBTC is backed 1:1 by BTC held by the signer",
      "Transaction replay is prevented by tracking seen txids",
      "Only EOA (not contracts) can call unwrap",
      "Unwrap creates payment records, actual BTC is sent off-chain",
      "Premium fee can be adjusted by owner with auth token",
    ],

    integrationTitle: "TypeScript Integration",
    integrationDesc: "Use the TS SDK to interact with frBTC:",

    nextStepsTitle: "Next Steps",
    nextSteps: [
      { text: "Build an AMM", href: "/docs/tutorials/amm", desc: "Trade frBTC" },
      { text: "Build a Token", href: "/docs/tutorials/token", desc: "Create tokens" },
      { text: "TS SDK Guide", href: "/docs/guides/ts-sdk", desc: "Full SDK usage" },
    ],
  },
  zh: {
    title: "封装/解封 BTC",
    subtitle: "将 BTC 转换为 frBTC 以在 Alkanes DeFi 中使用",
    intro: "frBTC（分数 BTC）是比特币在 Alkanes 协议上的合成表示。本教程介绍如何将 BTC 封装为 frBTC 以及将 frBTC 解封回 BTC。",

    overviewTitle: "概述",
    overviewDesc: "[32, 0] 处的 frBTC 合约允许用户：",
    features: [
      { name: "封装 BTC", desc: "向签名者地址发送 BTC 以铸造 frBTC" },
      { name: "解封 frBTC", desc: "销毁 frBTC 以在指定地址接收 BTC" },
      { name: "查询签名者", desc: "获取当前签名者公钥" },
      { name: "溢价费用", desc: "封装时扣除的小额费用（可配置）" },
    ],

    howItWorksTitle: "封装工作原理",
    howItWorksDesc: "封装过程在链上验证比特币交易：",
    steps: [
      "用户向签名者的 p2tr 地址发送 BTC",
      "用户在 frBTC 合约上调用 wrap（opcode 77）",
      "合约验证 BTC 已发送到签名者",
      "合约铸造等量的 frBTC（减去溢价）",
      "frBTC 发送给调用者",
    ],

    unwrapProcessTitle: "解封工作原理",
    unwrapProcessDesc: "解封过程为签名者创建付款记录：",
    unwrapSteps: [
      "用户使用 frBTC 调用 unwrap（opcode 78）",
      "合约销毁 frBTC",
      "合约为签名者创建付款记录",
      "签名者处理付款并发送 BTC",
      "付款标记为完成",
    ],

    wrapCommandTitle: "封装 BTC",
    wrapCommandDesc: "使用 alkanes-cli wrap-btc 命令：",

    unwrapCommandTitle: "解封 frBTC",
    unwrapCommandDesc: "在 frBTC 合约上调用 unwrap opcode：",

    queryCommandsTitle: "查询命令",
    queryCommandsDesc: "检查 frBTC 状态和余额：",

    premiumTitle: "溢价费用",
    premiumDesc: "frBTC 合约对封装收取小额溢价。溢价以每 100,000,000（每 BTC 的聪）为单位计算。",

    signerTitle: "签名者地址",
    signerDesc: "签名者是持有封装 BTC 的地址。只有签名者可以处理解封请求。",

    frbtcContractTitle: "frBTC 合约结构",
    frbtcContractDesc: "frBTC 合约的关键组件：",

    storageLayoutTitle: "存储布局",
    storageLayout: [
      { path: "/signer", desc: "签名者公钥（仅 x，32 字节）" },
      { path: "/premium", desc: "溢价费用（每 100M 的部分）" },
      { path: "/totalsupply", desc: "frBTC 总供应量" },
      { path: "/seen/{txid}", desc: "已处理的交易 ID" },
      { path: "/payments/byheight/{h}", desc: "待处理的付款记录" },
    ],

    opcodesTitle: "frBTC 操作码",
    opcodes: [
      { opcode: "0", name: "Initialize", desc: "使用认证代币设置合约" },
      { opcode: "1", name: "SetSigner", desc: "更新签名者公钥（仅所有者）" },
      { opcode: "4", name: "SetPremium", desc: "更新溢价费用（仅所有者）" },
      { opcode: "77", name: "Wrap", desc: "为发送到签名者的 BTC 铸造 frBTC" },
      { opcode: "78", name: "Unwrap", desc: "销毁 frBTC 并创建付款记录" },
      { opcode: "99", name: "GetName", desc: "返回 'frBTC'" },
      { opcode: "100", name: "GetSymbol", desc: "返回 'frBTC'" },
      { opcode: "101", name: "GetPendingPayments", desc: "获取所有待处理的付款记录" },
      { opcode: "103", name: "GetSigner", desc: "返回签名者公钥" },
      { opcode: "104", name: "GetPremium", desc: "返回当前溢价" },
      { opcode: "105", name: "GetTotalSupply", desc: "返回总供应量" },
    ],

    securityTitle: "安全考虑",
    securityItems: [
      "frBTC 由签名者持有的 BTC 1:1 支持",
      "通过跟踪已见 txid 防止交易重放",
      "只有 EOA（不是合约）可以调用 unwrap",
      "Unwrap 创建付款记录，实际 BTC 在链下发送",
      "所有者可以使用认证代币调整溢价费用",
    ],

    integrationTitle: "TypeScript 集成",
    integrationDesc: "使用 TS SDK 与 frBTC 交互：",

    nextStepsTitle: "下一步",
    nextSteps: [
      { text: "构建 AMM", href: "/docs/tutorials/amm", desc: "交易 frBTC" },
      { text: "构建代币", href: "/docs/tutorials/token", desc: "创建代币" },
      { text: "TS SDK 指南", href: "/docs/guides/ts-sdk", desc: "完整 SDK 使用" },
    ],
  },
  ms: {
    title: "Balut/Buka Balutan BTC",
    subtitle: "Tukar BTC kepada frBTC untuk digunakan dalam Alkanes DeFi",
    intro: "frBTC (Fractional BTC) adalah representasi sintetik Bitcoin pada protokol Alkanes. Tutorial ini meliputi cara membalut BTC kepada frBTC dan membuka balutan frBTC kembali kepada BTC.",

    overviewTitle: "Gambaran Keseluruhan",
    overviewDesc: "Kontrak frBTC di [32, 0] membenarkan pengguna untuk:",
    features: [
      { name: "Balut BTC", desc: "Hantar BTC ke alamat penandatangan untuk mencetak frBTC" },
      { name: "Buka Balutan frBTC", desc: "Bakar frBTC untuk menerima BTC di alamat yang ditentukan" },
      { name: "Tanya Penandatangan", desc: "Dapatkan kunci awam penandatangan semasa" },
      { name: "Yuran Premium", desc: "Yuran kecil ditolak semasa membalut (boleh dikonfigurasi)" },
    ],

    howItWorksTitle: "Cara Pembalutan Berfungsi",
    howItWorksDesc: "Proses pembalutan mengesahkan transaksi Bitcoin pada rantaian:",
    steps: [
      "Pengguna menghantar BTC ke alamat p2tr penandatangan",
      "Pengguna memanggil wrap (opcode 77) pada kontrak frBTC",
      "Kontrak mengesahkan BTC telah dihantar ke penandatangan",
      "Kontrak mencetak frBTC yang setara (tolak premium)",
      "frBTC dihantar kepada pemanggil",
    ],

    unwrapProcessTitle: "Cara Pembukaan Balutan Berfungsi",
    unwrapProcessDesc: "Proses pembukaan balutan mencipta rekod pembayaran untuk penandatangan:",
    unwrapSteps: [
      "Pengguna memanggil unwrap (opcode 78) dengan frBTC",
      "Kontrak membakar frBTC",
      "Kontrak mencipta rekod pembayaran untuk penandatangan",
      "Penandatangan memproses pembayaran dan menghantar BTC",
      "Pembayaran ditandakan sebagai lengkap",
    ],

    wrapCommandTitle: "Membalut BTC",
    wrapCommandDesc: "Gunakan arahan alkanes-cli wrap-btc:",

    unwrapCommandTitle: "Membuka Balutan frBTC",
    unwrapCommandDesc: "Panggil opcode unwrap pada kontrak frBTC:",

    queryCommandsTitle: "Arahan Pertanyaan",
    queryCommandsDesc: "Semak keadaan dan baki frBTC:",

    premiumTitle: "Yuran Premium",
    premiumDesc: "Kontrak frBTC mengenakan premium kecil pada pembalutan. Premium diukur dalam bahagian per 100,000,000 (satoshi per BTC).",

    signerTitle: "Alamat Penandatangan",
    signerDesc: "Penandatangan adalah alamat yang memegang BTC yang dibalut. Hanya penandatangan boleh memproses permintaan pembukaan balutan.",

    frbtcContractTitle: "Struktur Kontrak frBTC",
    frbtcContractDesc: "Komponen utama kontrak frBTC:",

    storageLayoutTitle: "Susun Atur Penyimpanan",
    storageLayout: [
      { path: "/signer", desc: "Kunci awam penandatangan (x sahaja, 32 bait)" },
      { path: "/premium", desc: "Yuran premium dalam bahagian per 100M" },
      { path: "/totalsupply", desc: "Jumlah bekalan frBTC" },
      { path: "/seen/{txid}", desc: "ID transaksi yang diproses" },
      { path: "/payments/byheight/{h}", desc: "Rekod pembayaran yang menunggu" },
    ],

    opcodesTitle: "Opcode frBTC",
    opcodes: [
      { opcode: "0", name: "Initialize", desc: "Sediakan kontrak dengan token auth" },
      { opcode: "1", name: "SetSigner", desc: "Kemas kini kunci awam penandatangan (pemilik sahaja)" },
      { opcode: "4", name: "SetPremium", desc: "Kemas kini yuran premium (pemilik sahaja)" },
      { opcode: "77", name: "Wrap", desc: "Cetak frBTC untuk BTC yang dihantar ke penandatangan" },
      { opcode: "78", name: "Unwrap", desc: "Bakar frBTC dan cipta rekod pembayaran" },
      { opcode: "99", name: "GetName", desc: "Kembalikan 'frBTC'" },
      { opcode: "100", name: "GetSymbol", desc: "Kembalikan 'frBTC'" },
      { opcode: "101", name: "GetPendingPayments", desc: "Dapatkan semua rekod pembayaran yang menunggu" },
      { opcode: "103", name: "GetSigner", desc: "Kembalikan kunci awam penandatangan" },
      { opcode: "104", name: "GetPremium", desc: "Kembalikan premium semasa" },
      { opcode: "105", name: "GetTotalSupply", desc: "Kembalikan jumlah bekalan" },
    ],

    securityTitle: "Pertimbangan Keselamatan",
    securityItems: [
      "frBTC disokong 1:1 oleh BTC yang dipegang oleh penandatangan",
      "Ulangan transaksi dicegah dengan menjejaki txid yang dilihat",
      "Hanya EOA (bukan kontrak) boleh memanggil unwrap",
      "Unwrap mencipta rekod pembayaran, BTC sebenar dihantar di luar rantaian",
      "Yuran premium boleh diselaraskan oleh pemilik dengan token auth",
    ],

    integrationTitle: "Integrasi TypeScript",
    integrationDesc: "Gunakan TS SDK untuk berinteraksi dengan frBTC:",

    nextStepsTitle: "Langkah Seterusnya",
    nextSteps: [
      { text: "Bina AMM", href: "/docs/tutorials/amm", desc: "Berdagang frBTC" },
      { text: "Bina Token", href: "/docs/tutorials/token", desc: "Cipta token" },
      { text: "Panduan TS SDK", href: "/docs/guides/ts-sdk", desc: "Penggunaan SDK penuh" },
    ],
  },
  vi: {
    title: "Bọc/Mở bọc BTC",
    subtitle: "Chuyển đổi BTC thành frBTC để sử dụng trong Alkanes DeFi",
    intro: "frBTC (Fractional BTC) là biểu diễn tổng hợp của Bitcoin trên giao thức Alkanes. Hướng dẫn này bao gồm cách bọc BTC thành frBTC và mở bọc frBTC trở lại BTC.",

    overviewTitle: "Tổng quan",
    overviewDesc: "Hợp đồng frBTC tại [32, 0] cho phép người dùng:",
    features: [
      { name: "Bọc BTC", desc: "Gửi BTC đến địa chỉ người ký để đúc frBTC" },
      { name: "Mở bọc frBTC", desc: "Đốt frBTC để nhận BTC tại địa chỉ được chỉ định" },
      { name: "Truy vấn Người ký", desc: "Lấy khóa công khai của người ký hiện tại" },
      { name: "Phí Premium", desc: "Phí nhỏ được khấu trừ khi bọc (có thể cấu hình)" },
    ],

    howItWorksTitle: "Cách hoạt động của Bọc",
    howItWorksDesc: "Quá trình bọc xác minh giao dịch Bitcoin trên chuỗi:",
    steps: [
      "Người dùng gửi BTC đến địa chỉ p2tr của người ký",
      "Người dùng gọi wrap (opcode 77) trên hợp đồng frBTC",
      "Hợp đồng xác minh BTC đã được gửi đến người ký",
      "Hợp đồng đúc frBTC tương đương (trừ premium)",
      "frBTC được gửi đến người gọi",
    ],

    unwrapProcessTitle: "Cách hoạt động của Mở bọc",
    unwrapProcessDesc: "Quá trình mở bọc tạo bản ghi thanh toán cho người ký:",
    unwrapSteps: [
      "Người dùng gọi unwrap (opcode 78) với frBTC",
      "Hợp đồng đốt frBTC",
      "Hợp đồng tạo bản ghi thanh toán cho người ký",
      "Người ký xử lý thanh toán và gửi BTC",
      "Thanh toán được đánh dấu hoàn tất",
    ],

    wrapCommandTitle: "Bọc BTC",
    wrapCommandDesc: "Sử dụng lệnh alkanes-cli wrap-btc:",

    unwrapCommandTitle: "Mở bọc frBTC",
    unwrapCommandDesc: "Gọi opcode unwrap trên hợp đồng frBTC:",

    queryCommandsTitle: "Lệnh Truy vấn",
    queryCommandsDesc: "Kiểm tra trạng thái và số dư frBTC:",

    premiumTitle: "Phí Premium",
    premiumDesc: "Hợp đồng frBTC tính phí premium nhỏ khi bọc. Premium được đo bằng phần trên 100,000,000 (satoshi trên BTC).",

    signerTitle: "Địa chỉ Người ký",
    signerDesc: "Người ký là địa chỉ giữ BTC đã bọc. Chỉ người ký mới có thể xử lý yêu cầu mở bọc.",

    frbtcContractTitle: "Cấu trúc Hợp đồng frBTC",
    frbtcContractDesc: "Các thành phần chính của hợp đồng frBTC:",

    storageLayoutTitle: "Bố cục Lưu trữ",
    storageLayout: [
      { path: "/signer", desc: "Khóa công khai người ký (chỉ x, 32 byte)" },
      { path: "/premium", desc: "Phí premium theo phần trên 100M" },
      { path: "/totalsupply", desc: "Tổng nguồn cung frBTC" },
      { path: "/seen/{txid}", desc: "ID giao dịch đã xử lý" },
      { path: "/payments/byheight/{h}", desc: "Bản ghi thanh toán đang chờ" },
    ],

    opcodesTitle: "Opcode frBTC",
    opcodes: [
      { opcode: "0", name: "Initialize", desc: "Thiết lập hợp đồng với token xác thực" },
      { opcode: "1", name: "SetSigner", desc: "Cập nhật khóa công khai người ký (chỉ chủ sở hữu)" },
      { opcode: "4", name: "SetPremium", desc: "Cập nhật phí premium (chỉ chủ sở hữu)" },
      { opcode: "77", name: "Wrap", desc: "Đúc frBTC cho BTC gửi đến người ký" },
      { opcode: "78", name: "Unwrap", desc: "Đốt frBTC và tạo bản ghi thanh toán" },
      { opcode: "99", name: "GetName", desc: "Trả về 'frBTC'" },
      { opcode: "100", name: "GetSymbol", desc: "Trả về 'frBTC'" },
      { opcode: "101", name: "GetPendingPayments", desc: "Lấy tất cả bản ghi thanh toán đang chờ" },
      { opcode: "103", name: "GetSigner", desc: "Trả về khóa công khai người ký" },
      { opcode: "104", name: "GetPremium", desc: "Trả về premium hiện tại" },
      { opcode: "105", name: "GetTotalSupply", desc: "Trả về tổng nguồn cung" },
    ],

    securityTitle: "Cân nhắc Bảo mật",
    securityItems: [
      "frBTC được hỗ trợ 1:1 bởi BTC do người ký nắm giữ",
      "Phát lại giao dịch được ngăn chặn bằng cách theo dõi txid đã thấy",
      "Chỉ EOA (không phải hợp đồng) mới có thể gọi unwrap",
      "Unwrap tạo bản ghi thanh toán, BTC thực tế được gửi ngoài chuỗi",
      "Phí premium có thể được điều chỉnh bởi chủ sở hữu với token xác thực",
    ],

    integrationTitle: "Tích hợp TypeScript",
    integrationDesc: "Sử dụng TS SDK để tương tác với frBTC:",

    nextStepsTitle: "Bước tiếp theo",
    nextSteps: [
      { text: "Xây dựng AMM", href: "/docs/tutorials/amm", desc: "Giao dịch frBTC" },
      { text: "Xây dựng Token", href: "/docs/tutorials/token", desc: "Tạo token" },
      { text: "Hướng dẫn TS SDK", href: "/docs/guides/ts-sdk", desc: "Sử dụng SDK đầy đủ" },
    ],
  },
  ko: {
    title: "BTC 래핑/언래핑",
    subtitle: "Alkanes DeFi에서 사용하기 위해 BTC를 frBTC로 변환",
    intro: "frBTC(Fractional BTC)는 Alkanes 프로토콜에서 비트코인의 합성 표현입니다. 이 튜토리얼은 BTC를 frBTC로 래핑하고 frBTC를 다시 BTC로 언래핑하는 방법을 다룹니다.",

    overviewTitle: "개요",
    overviewDesc: "[32, 0]에 있는 frBTC 계약은 사용자에게 다음을 허용합니다:",
    features: [
      { name: "BTC 래핑", desc: "서명자 주소로 BTC를 보내 frBTC 발행" },
      { name: "frBTC 언래핑", desc: "frBTC를 소각하여 지정된 주소에서 BTC 수령" },
      { name: "서명자 조회", desc: "현재 서명자 공개 키 가져오기" },
      { name: "프리미엄 수수료", desc: "래핑 시 차감되는 소액 수수료(구성 가능)" },
    ],

    howItWorksTitle: "래핑 작동 방식",
    howItWorksDesc: "래핑 프로세스는 온체인에서 비트코인 거래를 검증합니다:",
    steps: [
      "사용자가 서명자의 p2tr 주소로 BTC를 전송",
      "사용자가 frBTC 계약에서 wrap(opcode 77) 호출",
      "계약이 BTC가 서명자에게 전송되었는지 확인",
      "계약이 동등한 frBTC 발행(프리미엄 차감)",
      "frBTC가 호출자에게 전송됨",
    ],

    unwrapProcessTitle: "언래핑 작동 방식",
    unwrapProcessDesc: "언래핑 프로세스는 서명자에 대한 결제 기록을 생성합니다:",
    unwrapSteps: [
      "사용자가 frBTC로 unwrap(opcode 78) 호출",
      "계약이 frBTC를 소각",
      "계약이 서명자에 대한 결제 기록 생성",
      "서명자가 결제를 처리하고 BTC 전송",
      "결제가 완료로 표시됨",
    ],

    wrapCommandTitle: "BTC 래핑",
    wrapCommandDesc: "alkanes-cli wrap-btc 명령 사용:",

    unwrapCommandTitle: "frBTC 언래핑",
    unwrapCommandDesc: "frBTC 계약에서 unwrap opcode 호출:",

    queryCommandsTitle: "조회 명령",
    queryCommandsDesc: "frBTC 상태 및 잔액 확인:",

    premiumTitle: "프리미엄 수수료",
    premiumDesc: "frBTC 계약은 래핑 시 소액의 프리미엄을 부과합니다. 프리미엄은 100,000,000당 부분(BTC당 사토시)으로 측정됩니다.",

    signerTitle: "서명자 주소",
    signerDesc: "서명자는 래핑된 BTC를 보유하는 주소입니다. 서명자만 언래핑 요청을 처리할 수 있습니다.",

    frbtcContractTitle: "frBTC 계약 구조",
    frbtcContractDesc: "frBTC 계약의 주요 구성 요소:",

    storageLayoutTitle: "스토리지 레이아웃",
    storageLayout: [
      { path: "/signer", desc: "서명자 공개 키(x만, 32바이트)" },
      { path: "/premium", desc: "100M당 부분 단위 프리미엄 수수료" },
      { path: "/totalsupply", desc: "총 frBTC 공급량" },
      { path: "/seen/{txid}", desc: "처리된 거래 ID" },
      { path: "/payments/byheight/{h}", desc: "대기 중인 결제 기록" },
    ],

    opcodesTitle: "frBTC Opcode",
    opcodes: [
      { opcode: "0", name: "Initialize", desc: "인증 토큰으로 계약 설정" },
      { opcode: "1", name: "SetSigner", desc: "서명자 공개 키 업데이트(소유자 전용)" },
      { opcode: "4", name: "SetPremium", desc: "프리미엄 수수료 업데이트(소유자 전용)" },
      { opcode: "77", name: "Wrap", desc: "서명자에게 전송된 BTC에 대해 frBTC 발행" },
      { opcode: "78", name: "Unwrap", desc: "frBTC 소각 및 결제 기록 생성" },
      { opcode: "99", name: "GetName", desc: "'frBTC' 반환" },
      { opcode: "100", name: "GetSymbol", desc: "'frBTC' 반환" },
      { opcode: "101", name: "GetPendingPayments", desc: "모든 대기 중인 결제 기록 가져오기" },
      { opcode: "103", name: "GetSigner", desc: "서명자 공개 키 반환" },
      { opcode: "104", name: "GetPremium", desc: "현재 프리미엄 반환" },
      { opcode: "105", name: "GetTotalSupply", desc: "총 공급량 반환" },
    ],

    securityTitle: "보안 고려사항",
    securityItems: [
      "frBTC는 서명자가 보유한 BTC로 1:1 지원됨",
      "거래 재생은 확인된 txid 추적으로 방지됨",
      "EOA만 unwrap을 호출할 수 있음(계약 불가)",
      "Unwrap은 결제 기록을 생성하며, 실제 BTC는 오프체인에서 전송됨",
      "프리미엄 수수료는 소유자가 인증 토큰으로 조정 가능",
    ],

    integrationTitle: "TypeScript 통합",
    integrationDesc: "TS SDK를 사용하여 frBTC와 상호작용:",

    nextStepsTitle: "다음 단계",
    nextSteps: [
      { text: "AMM 구축", href: "/docs/tutorials/amm", desc: "frBTC 거래" },
      { text: "토큰 구축", href: "/docs/tutorials/token", desc: "토큰 생성" },
      { text: "TS SDK 가이드", href: "/docs/guides/ts-sdk", desc: "전체 SDK 사용법" },
    ],
  },
};

function CodeBlock({ children, title, language = "bash" }: { children: string; title?: string; language?: string }) {
  return (
    <div className="my-4">
      {title && <div className="text-xs text-[color:var(--sf-muted)] mb-1 font-mono">{title}</div>}
      <pre className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] overflow-x-auto text-sm">
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <div className="mt-10" id={id}>
      <h2 className="text-2xl font-semibold mb-4 text-[color:var(--sf-text)]">{title}</h2>
      {children}
    </div>
  );
}

export default function WrapBtcTutorialPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-sm text-[color:var(--sf-primary)] mb-4">{t.subtitle}</p>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      {/* Overview */}
      <Section title={t.overviewTitle} id="overview">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.overviewDesc}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {t.features.map((f, i) => (
            <div key={i} className="p-3 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
              <span className="font-semibold text-[color:var(--sf-primary)]">{f.name}</span>
              <span className="text-[color:var(--sf-muted)] ml-2">- {f.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* How Wrapping Works */}
      <Section title={t.howItWorksTitle} id="how-wrap">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.howItWorksDesc}</p>
        <div className="space-y-2">
          {t.steps.map((step, i) => (
            <div key={i} className="p-2 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
              <span className="font-mono text-[color:var(--sf-primary)] mr-2">{i + 1}.</span>
              <span className="text-[color:var(--sf-muted)]">{step}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* How Unwrapping Works */}
      <Section title={t.unwrapProcessTitle} id="how-unwrap">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.unwrapProcessDesc}</p>
        <div className="space-y-2">
          {t.unwrapSteps.map((step, i) => (
            <div key={i} className="p-2 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
              <span className="font-mono text-[color:var(--sf-primary)] mr-2">{i + 1}.</span>
              <span className="text-[color:var(--sf-muted)]">{step}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Wrap Command */}
      <Section title={t.wrapCommandTitle} id="wrap-command">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.wrapCommandDesc}</p>
        <CodeBlock>{`# Wrap 1 BTC (100,000,000 satoshis) to frBTC
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  alkanes wrap-btc \\
  100000000 \\
  --to p2tr:0 \\
  --from p2tr:0 \\
  --mine \\
  --change p2tr:0 \\
  -y

# The wrap-btc command:
# 1. Creates a transaction sending BTC to the frBTC signer
# 2. Includes a protostone calling wrap (opcode 77) on [32, 0]
# 3. Mines the transaction (regtest only)
# 4. Returns frBTC to your address

# Check your frBTC balance
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  alkanes getbalance`}</CodeBlock>
      </Section>

      {/* Unwrap Command */}
      <Section title={t.unwrapCommandTitle} id="unwrap-command">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.unwrapCommandDesc}</p>
        <CodeBlock>{`# Unwrap frBTC to BTC
# Opcode 78 = Unwrap
# Args: vout (output index), amount_requested

alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-passphrase" \\
  alkanes execute "[32,0,78,0,50000000]:v0:v0" \\
  --inputs "32:0:50000000" \\
  --from p2tr:0 \\
  --fee-rate 1 \\
  --mine \\
  -y

# Parameters:
# - 32,0: frBTC contract at [32, 0]
# - 78: Unwrap opcode
# - 0: vout (output index in tx for signer)
# - 50000000: Amount to unwrap (0.5 BTC in satoshis)
# --inputs 32:0:50000000: Send 50M frBTC to the contract

# The unwrap creates a payment record. The actual BTC
# is sent by the signer in a separate transaction.`}</CodeBlock>
      </Section>

      {/* Query Commands */}
      <Section title={t.queryCommandsTitle} id="queries">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.queryCommandsDesc}</p>
        <CodeBlock>{`# Get frBTC total supply (opcode 105)
alkanes-cli -p regtest alkanes simulate "32:0:105"

# Get signer public key (opcode 103)
alkanes-cli -p regtest alkanes simulate "32:0:103"

# Get current premium (opcode 104)
alkanes-cli -p regtest alkanes simulate "32:0:104"

# Get pending payments (opcode 101)
alkanes-cli -p regtest alkanes simulate "32:0:101"

# Get token name (opcode 99)
alkanes-cli -p regtest alkanes simulate "32:0:99"

# Get token symbol (opcode 100)
alkanes-cli -p regtest alkanes simulate "32:0:100"`}</CodeBlock>
      </Section>

      {/* Premium */}
      <Section title={t.premiumTitle} id="premium">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.premiumDesc}</p>
        <CodeBlock language="rust">{`// Premium calculation in fr-btc contract
fn exchange(&self, context: &Context) -> Result<AlkaneTransfer> {
    // Get BTC amount sent to signer
    let payout = self.compute_output(&tx);

    // Apply premium (default: 100,000 = 0.1%)
    let premium = self.premium();
    let adjusted_payout = if premium > 0 && payout > 0 {
        // Fee = payout * premium / 100_000_000
        let fee = (payout * premium) / 100_000_000;
        payout.saturating_sub(fee)
    } else {
        payout
    };

    // Mint frBTC with adjusted amount
    self.mint(&context, adjusted_payout)
}

// Example: 1 BTC with 0.1% premium
// payout = 100,000,000 sats
// premium = 100,000 (0.1%)
// fee = 100,000,000 * 100,000 / 100,000,000 = 100,000 sats
// adjusted_payout = 99,900,000 sats of frBTC`}</CodeBlock>
      </Section>

      {/* Storage Layout */}
      <Section title={t.storageLayoutTitle} id="storage">
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-[color:var(--sf-outline)] rounded-lg">
            <thead className="bg-[color:var(--sf-surface)]">
              <tr>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Path</th>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Description</th>
              </tr>
            </thead>
            <tbody>
              {t.storageLayout.map((item, i) => (
                <tr key={i} className="border-t border-[color:var(--sf-outline)]">
                  <td className="p-3 font-mono text-[color:var(--sf-primary)]">{item.path}</td>
                  <td className="p-3 text-[color:var(--sf-muted)]">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Opcodes */}
      <Section title={t.opcodesTitle} id="opcodes">
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-[color:var(--sf-outline)] rounded-lg">
            <thead className="bg-[color:var(--sf-surface)]">
              <tr>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Opcode</th>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Name</th>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Description</th>
              </tr>
            </thead>
            <tbody>
              {t.opcodes.map((op, i) => (
                <tr key={i} className="border-t border-[color:var(--sf-outline)]">
                  <td className="p-3 font-mono text-[color:var(--sf-primary)]">{op.opcode}</td>
                  <td className="p-3 font-mono text-[color:var(--sf-text)]">{op.name}</td>
                  <td className="p-3 text-[color:var(--sf-muted)]">{op.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* frBTC Contract Structure */}
      <Section title={t.frbtcContractTitle} id="contract">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.frbtcContractDesc}</p>
        <CodeBlock language="rust">{`// Simplified frBTC contract structure
use alkanes_runtime::{
    declare_alkane, message::MessageDispatch,
    runtime::AlkaneResponder, storage::StoragePointer,
    auth::AuthenticatedResponder,
};
use alkanes_std_factory_support::MintableToken;

#[derive(Default)]
pub struct SyntheticBitcoin(());

impl AlkaneResponder for SyntheticBitcoin {}
impl AuthenticatedResponder for SyntheticBitcoin {}
impl MintableToken for SyntheticBitcoin {}

#[derive(MessageDispatch)]
enum SyntheticBitcoinMessage {
    #[opcode(0)]
    Initialize,

    #[opcode(1)]
    SetSigner { vout: u128 },

    #[opcode(4)]
    SetPremium { premium: u128 },

    #[opcode(77)]
    Wrap,

    #[opcode(78)]
    Unwrap { vout: u128, amount_requested: u128 },

    #[opcode(99)]
    #[returns(String)]
    GetName,

    #[opcode(103)]
    #[returns(Vec<u8>)]
    GetSigner,

    #[opcode(105)]
    #[returns(u128)]
    GetTotalSupply,
}

impl SyntheticBitcoin {
    // Wrap: verify BTC tx and mint frBTC
    fn wrap(&self) -> Result<CallResponse> {
        let context = self.context()?;
        let tx = self.transaction_object()?;

        // Prevent replay
        self.observe_transaction(&tx)?;

        // Calculate BTC sent to signer
        let payout = self.compute_output(&tx);

        // Apply premium fee
        let premium = self.premium();
        let fee = (payout * premium) / 100_000_000;
        let adjusted = payout.saturating_sub(fee);

        // Mint frBTC
        let mut response = CallResponse::forward(&context.incoming_alkanes);
        response.alkanes.0.push(self.mint(&context, adjusted)?);
        Ok(response)
    }

    // Unwrap: burn frBTC and create payment record
    fn unwrap(&self, vout: u128, amount: u128) -> Result<CallResponse> {
        let context = self.context()?;

        // Only EOA can unwrap
        if context.caller != AlkaneId::default() {
            return Err(anyhow!("must be called by EOA"));
        }

        // Get frBTC sent and calculate burn amount
        let frbtc_sent = self.burn_input(&context)?;
        let actual_burn = min(amount, frbtc_sent);

        // Create payment record for signer
        self.burn(&context, vout as usize, actual_burn)?;

        // Decrease supply
        self.decrease_total_supply(actual_burn)?;

        // Return leftover frBTC
        let refund = frbtc_sent - actual_burn;
        let mut response = CallResponse::default();
        if refund > 0 {
            response.alkanes.0.push(AlkaneTransfer {
                id: context.myself,
                value: refund,
            });
        }
        Ok(response)
    }
}

declare_alkane! {
    impl AlkaneResponder for SyntheticBitcoin {
        type Message = SyntheticBitcoinMessage;
    }
}`}</CodeBlock>
      </Section>

      {/* Security */}
      <Section title={t.securityTitle} id="security">
        <div className="space-y-2">
          {t.securityItems.map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
              <span className="text-[color:var(--sf-muted)]">{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* TypeScript Integration */}
      <Section title={t.integrationTitle} id="integration">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.integrationDesc}</p>
        <CodeBlock language="typescript">{`import { AlkanesProvider } from '@alkanes/ts-sdk';

// Initialize provider
const provider = new AlkanesProvider({
  network: 'mainnet',  // or 'regtest' for local development
  rpcUrl: 'https://mainnet.subfrost.io/v4/jsonrpc',
});
await provider.initialize();

// Load wallet from mnemonic (for transactions)
provider.walletLoadMnemonic('your twelve word mnemonic...');
const addresses = provider.walletGetAddresses('p2tr', 0, 1);
const walletAddress = addresses[0].address;

// Wrap BTC to frBTC using the typed method
const wrapResult = await provider.frbtcWrapTyped({
  amount: BigInt(100000000),  // 1 BTC in satoshis
  toAddress: walletAddress,
  fromAddress: walletAddress,
  feeRate: 1,
  traceEnabled: true,
  mineEnabled: true,  // Auto-mine on regtest
  autoConfirm: true,
});
console.log('Wrap TXID:', wrapResult.reveal_txid);

// Get frBTC balance for an address
const balances = await provider.alkanes.getBalance(walletAddress);
const frbtc = balances.find(b =>
  b.alkane_id?.block === 32 && b.alkane_id?.tx === 0
);
console.log('frBTC balance:', frbtc?.balance);

// Get frBTC total supply using simulate
const result = await provider.metashrew.view(
  'simulate',
  '0x2096ce382a0602000665653001', // [32,0,105] encoded
  'latest'
);
// Parse result as u128 little-endian

// Query signer address
const signerResult = await provider.metashrew.view(
  'simulate',
  '0x2096ce382a0602006765673001', // [32,0,103] encoded
  'latest'
);`}</CodeBlock>
      </Section>

      {/* Next Steps */}
      <Section title={t.nextStepsTitle} id="next-steps">
        <div className="grid gap-4 md:grid-cols-3">
          {t.nextSteps.map((step, i) => (
            <a
              key={i}
              href={step.href}
              className="p-4 rounded-lg border border-[color:var(--sf-outline)] hover:border-[color:var(--sf-primary)] transition-colors"
            >
              <h4 className="font-semibold text-[color:var(--sf-text)] mb-1">{step.text}</h4>
              <p className="text-sm text-[color:var(--sf-muted)]">{step.desc}</p>
            </a>
          ))}
        </div>
      </Section>
    </div>
  );
}
