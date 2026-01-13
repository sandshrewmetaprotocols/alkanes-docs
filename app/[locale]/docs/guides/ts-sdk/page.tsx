"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSdkVersion, formatCommitDate } from "@/hooks/useSdkVersion";

const content = {
  en: {
    title: "@alkanes/ts-sdk Guide",
    subtitle: "Working examples from the alkanes.build codebase",
    intro: "This guide documents how alkanes.build uses the @alkanes/ts-sdk to fetch blockchain data, execute Lua scripts, and build a complete DeFi dashboard. All examples are from working production code.",

    installTitle: "Installation",
    installDesc: "Install the SDK from the alkanes package registry. The URL below is pinned to the latest commit on the develop branch:",
    installDirect: "Or install directly with the versioned URL:",
    installLoading: "Fetching latest version...",
    installError: "Could not fetch latest version. Use the base URL:",
    installVersionLabel: "Latest version:",

    architectureTitle: "Architecture Overview",
    architectureDesc: "The SDK provides a unified TypeScript interface over WASM bindings. See the full API Reference for complete method documentation.",
    architectureItems: [
      { name: "AlkanesProvider", desc: "Main entry point with sub-clients for each API", anchor: "AlkanesProvider" },
      { name: "EsploraClient", desc: "Bitcoin UTXO and transaction data", anchor: "EsploraClient" },
      { name: "AlkanesRpcClient", desc: "Alkane token balances and contract calls", anchor: "AlkanesRpcClient" },
      { name: "MetashrewClient", desc: "Low-level metashrew_view RPC access", anchor: "MetashrewClient" },
      { name: "LuaClient", desc: "Server-side Lua script execution with caching", anchor: "LuaClient" },
      { name: "DataApiClient", desc: "Market data, candles, and BTC price", anchor: "DataApiClient" },
      { name: "BitcoinRpcClient", desc: "Bitcoin Core RPC methods", anchor: "BitcoinRpcClient" }
    ],
    apiRefLink: "View Complete API Reference",

    providerTitle: "Creating the Provider",
    providerDesc: "The AlkanesProvider is the main entry point. Here's how alkanes.build initializes it:",

    clientTitle: "Singleton Client Pattern",
    clientDesc: "We use a singleton pattern for the provider to avoid repeated WASM initialization:",

    heightTitle: "Getting Block Height",
    heightDesc: "Fetch the current blockchain height using the provider:",

    balancesTitle: "Fetching Wallet Balances",
    balancesDesc: "Get BTC balance and Alkane token holdings for an address:",

    btcPriceTitle: "Fetching Bitcoin Price",
    btcPriceDesc: "Get the current BTC/USD price from the Data API:",

    metashrewTitle: "Metashrew View Calls",
    metashrewDesc: "Call alkane contracts using metashrew_view for pool reserves and token data:",

    luaTitle: "Lua Script Execution",
    luaDesc: "Execute Lua scripts for batched queries with automatic scripthash caching:",
    luaAdvantages: [
      "Single RPC round-trip for multiple queries",
      "Atomic data snapshot at the same block height",
      "Automatic scripthash caching (lua_evalsaved fallback)",
      "Server-side JSON encoding"
    ],

    candleTitle: "Fetching Pool Candle Data",
    candleDesc: "Complete example of fetching historical pool data for charts:",

    walletOpsTitle: "Wallet Operations",
    walletOpsDesc: "The SDK provides wallet management through the rawProvider. Create wallets, load mnemonics, and get addresses:",

    contractDeployTitle: "Contract Deployment",
    contractDeployDesc: "Deploy WASM contracts using protostones. This pattern is from the alkanes-rs deploy-regtest-bindgen.ts script:",

    executeTypedTitle: "Transaction Execution",
    executeTypedDesc: "Execute alkane transactions with full type safety using alkanesExecuteTyped. This method returns a TransactionBroadcast object that provides immediate access to transaction info and lazy-loaded execution traces:",
    executeTypedBroadcastTitle: "TransactionBroadcast Interface",
    executeTypedBroadcastDesc: "The TransactionBroadcast object separates immediate transaction data from async trace fetching:",

    frbtcWrapTitle: "Wrapping BTC to frBTC",
    frbtcWrapDesc: "Use frbtcWrapTyped to convert BTC to frBTC (the wrapped Bitcoin token on Alkanes). This is essential for participating in Alkanes DeFi:",

    ammPoolTitle: "Creating AMM Pools",
    ammPoolDesc: "Use alkanesInitPoolTyped to create new liquidity pools. This example is from the deploy-regtest-bindgen.ts script:",

    ammSwapTitle: "Executing Swaps",
    ammSwapDesc: "Use alkanesSwapTyped to execute token swaps through AMM pools:",

    verifyContractTitle: "Contract Verification",
    verifyContractDesc: "Verify a contract was deployed successfully by checking its bytecode:",

    regtestTitle: "Regtest Development",
    regtestDesc: "For local development, connect to a regtest node and use Bitcoin RPC for block generation:",

    testingTitle: "Integration Testing",
    testingDesc: "Our integration tests verify the SDK works correctly against live RPC:",

    troubleshootTitle: "Troubleshooting",
    troubleshootItems: [
      { issue: "WASM not loading in Node.js", solution: "Ensure you call provider.initialize() before using any methods. The SDK handles cross-platform WASM loading automatically." },
      { issue: "Empty responses from Lua scripts", solution: "Check that your Lua script returns a value. The SDK uses JSON.parse internally to deserialize the response." },
      { issue: "RPC timeout errors", solution: "Lua scripts that make many RPC calls may timeout. Reduce the number of block heights queried or increase the interval." }
    ],

    resourcesTitle: "Resources",
    resources: [
      { text: "alkanes-rs GitHub", href: "https://github.com/kungfuflex/alkanes-rs", desc: "Alkanes protocol and SDK source" },
      { text: "Live Integration Tests", href: "https://github.com/alkanes-rs/alkanes-rs/tree/develop/ts-sdk", desc: "TS SDK test examples" },
      { text: "Subfrost API", href: "https://api.subfrost.io", desc: "Get API keys for production use" }
    ]
  },
  zh: {
    title: "@alkanes/ts-sdk 指南",
    subtitle: "来自 alkanes.build 代码库的工作示例",
    intro: "本指南记录了 alkanes.build 如何使用 @alkanes/ts-sdk 获取区块链数据、执行 Lua 脚本并构建完整的 DeFi 仪表板。所有示例均来自工作生产代码。",

    installTitle: "安装",
    installDirect: "或使用版本化 URL 直接安装：",
    installLoading: "正在获取最新版本...",
    installError: "无法获取最新版本。使用基础 URL：",
    installVersionLabel: "最新版本：",
    installDesc: "从 alkanes 包注册表安装 SDK：",

    architectureTitle: "架构概述",
    architectureDesc: "SDK 在 WASM 绑定上提供统一的 TypeScript 接口。查看完整的 API 参考以获取详细的方法文档。",
    architectureItems: [
      { name: "AlkanesProvider", desc: "主入口点，包含每个 API 的子客户端", anchor: "AlkanesProvider" },
      { name: "EsploraClient", desc: "比特币 UTXO 和交易数据", anchor: "EsploraClient" },
      { name: "AlkanesRpcClient", desc: "Alkane 代币余额和合约调用", anchor: "AlkanesRpcClient" },
      { name: "MetashrewClient", desc: "低级 metashrew_view RPC 访问", anchor: "MetashrewClient" },
      { name: "LuaClient", desc: "带缓存的服务器端 Lua 脚本执行", anchor: "LuaClient" },
      { name: "DataApiClient", desc: "市场数据、K线和 BTC 价格", anchor: "DataApiClient" },
      { name: "BitcoinRpcClient", desc: "Bitcoin Core RPC 方法", anchor: "BitcoinRpcClient" }
    ],
    apiRefLink: "查看完整 API 参考",

    providerTitle: "创建 Provider",
    providerDesc: "AlkanesProvider 是主入口点。以下是 alkanes.build 初始化它的方式：",

    clientTitle: "单例客户端模式",
    clientDesc: "我们使用单例模式来避免重复的 WASM 初始化：",

    heightTitle: "获取区块高度",
    heightDesc: "使用 provider 获取当前区块链高度：",

    balancesTitle: "获取钱包余额",
    balancesDesc: "获取地址的 BTC 余额和 Alkane 代币持有量：",

    btcPriceTitle: "获取比特币价格",
    btcPriceDesc: "从 Data API 获取当前 BTC/USD 价格：",

    metashrewTitle: "Metashrew View 调用",
    metashrewDesc: "使用 metashrew_view 调用 alkane 合约获取池储备和代币数据：",

    luaTitle: "Lua 脚本执行",
    luaDesc: "执行 Lua 脚本进行批量查询，自动进行脚本哈希缓存：",
    luaAdvantages: [
      "多个查询单次 RPC 往返",
      "同一区块高度的原子数据快照",
      "自动脚本哈希缓存（lua_evalsaved 回退）",
      "服务器端 JSON 编码"
    ],

    candleTitle: "获取池K线数据",
    candleDesc: "获取图表历史池数据的完整示例：",

    walletOpsTitle: "钱包操作",
    walletOpsDesc: "SDK 通过 rawProvider 提供钱包管理功能。创建钱包、加载助记词和获取地址：",

    contractDeployTitle: "合约部署",
    contractDeployDesc: "使用 protostones 部署 WASM 合约。此模式来自 alkanes-rs 的 deploy-regtest-bindgen.ts 脚本：",

    executeTypedTitle: "交易执行",
    executeTypedDesc: "使用 alkanesExecuteTyped 以完整类型安全执行 alkane 交易。此方法返回一个 TransactionBroadcast 对象，提供立即访问交易信息和延迟加载的执行追踪：",
    executeTypedBroadcastTitle: "TransactionBroadcast 接口",
    executeTypedBroadcastDesc: "TransactionBroadcast 对象将即时交易数据与异步追踪获取分离：",

    frbtcWrapTitle: "将 BTC 封装为 frBTC",
    frbtcWrapDesc: "使用 frbtcWrapTyped 将 BTC 转换为 frBTC（Alkanes 上的封装比特币代币）。这是参与 Alkanes DeFi 的必要步骤：",

    ammPoolTitle: "创建 AMM 池",
    ammPoolDesc: "使用 alkanesInitPoolTyped 创建新的流动性池。此示例来自 deploy-regtest-bindgen.ts 脚本：",

    ammSwapTitle: "执行交换",
    ammSwapDesc: "使用 alkanesSwapTyped 通过 AMM 池执行代币交换：",

    verifyContractTitle: "合约验证",
    verifyContractDesc: "通过检查字节码验证合约是否部署成功：",

    regtestTitle: "Regtest 开发",
    regtestDesc: "对于本地开发，连接到 regtest 节点并使用 Bitcoin RPC 进行区块生成：",

    testingTitle: "集成测试",
    testingDesc: "我们的集成测试验证 SDK 是否针对实时 RPC 正常工作：",

    troubleshootTitle: "故障排除",
    troubleshootItems: [
      { issue: "WASM 在 Node.js 中未加载", solution: "确保在使用任何方法之前调用 provider.initialize()。SDK 会自动处理跨平台 WASM 加载。" },
      { issue: "Lua 脚本响应为空", solution: "检查您的 Lua 脚本是否返回值。SDK 内部使用 JSON.parse 来反序列化响应。" },
      { issue: "RPC 超时错误", solution: "进行多次 RPC 调用的 Lua 脚本可能会超时。减少查询的区块高度数量或增加间隔。" }
    ],

    resourcesTitle: "资源",
    resources: [
      { text: "alkanes-rs GitHub", href: "https://github.com/kungfuflex/alkanes-rs", desc: "Alkanes 协议和 SDK 源代码" },
      { text: "实时集成测试", href: "https://github.com/alkanes-rs/alkanes-rs/tree/develop/ts-sdk", desc: "TS SDK 测试示例" },
      { text: "Subfrost API", href: "https://api.subfrost.io", desc: "获取生产环境 API 密钥" }
    ]
  },
  ms: {
    title: "Panduan @alkanes/ts-sdk",
    subtitle: "Contoh kerja dari kod alkanes.build",
    intro: "Panduan ini mendokumentasikan bagaimana alkanes.build menggunakan @alkanes/ts-sdk untuk mendapatkan data blockchain, melaksanakan skrip Lua, dan membina papan pemuka DeFi yang lengkap. Semua contoh adalah dari kod pengeluaran yang berfungsi.",

    installTitle: "Pemasangan",
    installDesc: "Pasang SDK dari registri pakej alkanes. URL di bawah dipinkan ke komit terkini pada cabang develop:",
    installDirect: "Atau pasang terus dengan URL berversi:",
    installLoading: "Mendapatkan versi terkini...",
    installError: "Tidak dapat mendapatkan versi terkini. Gunakan URL asas:",
    installVersionLabel: "Versi terkini:",

    architectureTitle: "Gambaran Keseluruhan Seni Bina",
    architectureDesc: "SDK menyediakan antara muka TypeScript bersatu ke atas binding WASM. Lihat Rujukan API lengkap untuk dokumentasi kaedah yang lengkap.",
    architectureItems: [
      { name: "AlkanesProvider", desc: "Titik masuk utama dengan sub-klien untuk setiap API", anchor: "AlkanesProvider" },
      { name: "EsploraClient", desc: "Data UTXO dan transaksi Bitcoin", anchor: "EsploraClient" },
      { name: "AlkanesRpcClient", desc: "Baki token Alkane dan panggilan kontrak", anchor: "AlkanesRpcClient" },
      { name: "MetashrewClient", desc: "Akses RPC metashrew_view tahap rendah", anchor: "MetashrewClient" },
      { name: "LuaClient", desc: "Pelaksanaan skrip Lua sisi pelayan dengan caching", anchor: "LuaClient" },
      { name: "DataApiClient", desc: "Data pasaran, candlestick, dan harga BTC", anchor: "DataApiClient" },
      { name: "BitcoinRpcClient", desc: "Kaedah RPC Bitcoin Core", anchor: "BitcoinRpcClient" }
    ],
    apiRefLink: "Lihat Rujukan API Lengkap",

    providerTitle: "Mencipta Provider",
    providerDesc: "AlkanesProvider adalah titik masuk utama. Berikut adalah cara alkanes.build memulakan ia:",

    clientTitle: "Corak Klien Singleton",
    clientDesc: "Kami menggunakan corak singleton untuk provider bagi mengelakkan permulaan WASM berulang:",

    heightTitle: "Mendapatkan Ketinggian Blok",
    heightDesc: "Dapatkan ketinggian blockchain semasa menggunakan provider:",

    balancesTitle: "Mendapatkan Baki Dompet",
    balancesDesc: "Dapatkan baki BTC dan pegangan token Alkane untuk alamat:",

    btcPriceTitle: "Mendapatkan Harga Bitcoin",
    btcPriceDesc: "Dapatkan harga BTC/USD semasa dari Data API:",

    metashrewTitle: "Panggilan Metashrew View",
    metashrewDesc: "Panggil kontrak alkane menggunakan metashrew_view untuk rizab pool dan data token:",

    luaTitle: "Pelaksanaan Skrip Lua",
    luaDesc: "Laksanakan skrip Lua untuk pertanyaan berkumpulan dengan caching scripthash automatik:",
    luaAdvantages: [
      "Satu perjalanan RPC untuk pelbagai pertanyaan",
      "Snapshot data atomik pada ketinggian blok yang sama",
      "Caching scripthash automatik (fallback lua_evalsaved)",
      "Pengekodan JSON sisi pelayan"
    ],

    candleTitle: "Mendapatkan Data Candlestick Pool",
    candleDesc: "Contoh lengkap mendapatkan data pool sejarah untuk carta:",

    walletOpsTitle: "Operasi Dompet",
    walletOpsDesc: "SDK menyediakan pengurusan dompet melalui rawProvider. Cipta dompet, muatkan mnemonic, dan dapatkan alamat:",

    contractDeployTitle: "Penempatan Kontrak",
    contractDeployDesc: "Tempatkan kontrak WASM menggunakan protostones. Corak ini dari skrip deploy-regtest-bindgen.ts alkanes-rs:",

    executeTypedTitle: "Pelaksanaan Transaksi",
    executeTypedDesc: "Laksanakan transaksi alkane dengan keselamatan jenis penuh menggunakan alkanesExecuteTyped. Kaedah ini mengembalikan objek TransactionBroadcast yang menyediakan akses segera kepada maklumat transaksi dan jejak pelaksanaan yang dimuatkan secara malas:",
    executeTypedBroadcastTitle: "Antara Muka TransactionBroadcast",
    executeTypedBroadcastDesc: "Objek TransactionBroadcast memisahkan data transaksi segera daripada pengambilan jejak async:",

    frbtcWrapTitle: "Membalut BTC ke frBTC",
    frbtcWrapDesc: "Gunakan frbtcWrapTyped untuk menukar BTC kepada frBTC (token Bitcoin berbalut pada Alkanes). Ini penting untuk menyertai Alkanes DeFi:",

    ammPoolTitle: "Mencipta Pool AMM",
    ammPoolDesc: "Gunakan alkanesInitPoolTyped untuk mencipta pool kecairan baharu. Contoh ini dari skrip deploy-regtest-bindgen.ts:",

    ammSwapTitle: "Melaksanakan Pertukaran",
    ammSwapDesc: "Gunakan alkanesSwapTyped untuk melaksanakan pertukaran token melalui pool AMM:",

    verifyContractTitle: "Pengesahan Kontrak",
    verifyContractDesc: "Sahkan kontrak telah ditempatkan dengan jayanya dengan memeriksa bytecodenya:",

    regtestTitle: "Pembangunan Regtest",
    regtestDesc: "Untuk pembangunan tempatan, sambung ke nod regtest dan gunakan Bitcoin RPC untuk penjanaan blok:",

    testingTitle: "Ujian Integrasi",
    testingDesc: "Ujian integrasi kami mengesahkan SDK berfungsi dengan betul terhadap RPC langsung:",

    troubleshootTitle: "Penyelesaian Masalah",
    troubleshootItems: [
      { issue: "WASM tidak memuatkan dalam Node.js", solution: "Pastikan anda memanggil provider.initialize() sebelum menggunakan sebarang kaedah. SDK mengendalikan pemuatan WASM merentas platform secara automatik." },
      { issue: "Respons kosong dari skrip Lua", solution: "Semak bahawa skrip Lua anda mengembalikan nilai. SDK menggunakan JSON.parse secara dalaman untuk menyahsiri respons." },
      { issue: "Ralat tamat masa RPC", solution: "Skrip Lua yang membuat banyak panggilan RPC mungkin tamat masa. Kurangkan bilangan ketinggian blok yang dipertanyakan atau tingkatkan selang." }
    ],

    resourcesTitle: "Sumber",
    resources: [
      { text: "alkanes-rs GitHub", href: "https://github.com/kungfuflex/alkanes-rs", desc: "Sumber protokol dan SDK Alkanes" },
      { text: "Ujian Integrasi Langsung", href: "https://github.com/alkanes-rs/alkanes-rs/tree/develop/ts-sdk", desc: "Contoh ujian TS SDK" },
      { text: "Subfrost API", href: "https://api.subfrost.io", desc: "Dapatkan kunci API untuk kegunaan pengeluaran" }
    ]
  },
  vi: {
    title: "Hướng dẫn @alkanes/ts-sdk",
    subtitle: "Các ví dụ hoạt động từ codebase alkanes.build",
    intro: "Hướng dẫn này ghi lại cách alkanes.build sử dụng @alkanes/ts-sdk để lấy dữ liệu blockchain, thực thi các script Lua và xây dựng bảng điều khiển DeFi hoàn chỉnh. Tất cả các ví dụ đều từ mã sản xuất hoạt động.",

    installTitle: "Cài đặt",
    installDesc: "Cài đặt SDK từ registry gói alkanes. URL dưới đây được ghim vào commit mới nhất trên nhánh develop:",
    installDirect: "Hoặc cài đặt trực tiếp với URL có phiên bản:",
    installLoading: "Đang lấy phiên bản mới nhất...",
    installError: "Không thể lấy phiên bản mới nhất. Sử dụng URL cơ sở:",
    installVersionLabel: "Phiên bản mới nhất:",

    architectureTitle: "Tổng quan Kiến trúc",
    architectureDesc: "SDK cung cấp giao diện TypeScript thống nhất trên các binding WASM. Xem Tham chiếu API đầy đủ để có tài liệu phương thức hoàn chỉnh.",
    architectureItems: [
      { name: "AlkanesProvider", desc: "Điểm vào chính với các sub-client cho mỗi API", anchor: "AlkanesProvider" },
      { name: "EsploraClient", desc: "Dữ liệu UTXO và giao dịch Bitcoin", anchor: "EsploraClient" },
      { name: "AlkanesRpcClient", desc: "Số dư token Alkane và cuộc gọi hợp đồng", anchor: "AlkanesRpcClient" },
      { name: "MetashrewClient", desc: "Truy cập RPC metashrew_view cấp thấp", anchor: "MetashrewClient" },
      { name: "LuaClient", desc: "Thực thi script Lua phía server với bộ nhớ đệm", anchor: "LuaClient" },
      { name: "DataApiClient", desc: "Dữ liệu thị trường, nến và giá BTC", anchor: "DataApiClient" },
      { name: "BitcoinRpcClient", desc: "Các phương thức RPC Bitcoin Core", anchor: "BitcoinRpcClient" }
    ],
    apiRefLink: "Xem Tham chiếu API Đầy đủ",

    providerTitle: "Tạo Provider",
    providerDesc: "AlkanesProvider là điểm vào chính. Đây là cách alkanes.build khởi tạo nó:",

    clientTitle: "Mẫu Client Singleton",
    clientDesc: "Chúng tôi sử dụng mẫu singleton cho provider để tránh khởi tạo WASM lặp lại:",

    heightTitle: "Lấy Chiều cao Block",
    heightDesc: "Lấy chiều cao blockchain hiện tại bằng provider:",

    balancesTitle: "Lấy Số dư Ví",
    balancesDesc: "Lấy số dư BTC và nắm giữ token Alkane cho một địa chỉ:",

    btcPriceTitle: "Lấy Giá Bitcoin",
    btcPriceDesc: "Lấy giá BTC/USD hiện tại từ Data API:",

    metashrewTitle: "Cuộc gọi Metashrew View",
    metashrewDesc: "Gọi các hợp đồng alkane bằng metashrew_view cho dự trữ pool và dữ liệu token:",

    luaTitle: "Thực thi Script Lua",
    luaDesc: "Thực thi các script Lua cho các truy vấn hàng loạt với bộ nhớ đệm scripthash tự động:",
    luaAdvantages: [
      "Một chuyến khứ hồi RPC cho nhiều truy vấn",
      "Snapshot dữ liệu nguyên tử ở cùng chiều cao block",
      "Bộ nhớ đệm scripthash tự động (fallback lua_evalsaved)",
      "Mã hóa JSON phía server"
    ],

    candleTitle: "Lấy Dữ liệu Nến Pool",
    candleDesc: "Ví dụ đầy đủ về lấy dữ liệu pool lịch sử cho biểu đồ:",

    walletOpsTitle: "Hoạt động Ví",
    walletOpsDesc: "SDK cung cấp quản lý ví thông qua rawProvider. Tạo ví, tải mnemonic và lấy địa chỉ:",

    contractDeployTitle: "Triển khai Hợp đồng",
    contractDeployDesc: "Triển khai các hợp đồng WASM bằng protostones. Mẫu này từ script deploy-regtest-bindgen.ts của alkanes-rs:",

    executeTypedTitle: "Thực thi Giao dịch",
    executeTypedDesc: "Thực thi các giao dịch alkane với an toàn kiểu đầy đủ bằng alkanesExecuteTyped. Phương thức này trả về đối tượng TransactionBroadcast cung cấp truy cập ngay lập tức vào thông tin giao dịch và các trace thực thi được tải chậm:",
    executeTypedBroadcastTitle: "Giao diện TransactionBroadcast",
    executeTypedBroadcastDesc: "Đối tượng TransactionBroadcast tách biệt dữ liệu giao dịch ngay lập tức khỏi việc lấy trace async:",

    frbtcWrapTitle: "Bọc BTC thành frBTC",
    frbtcWrapDesc: "Sử dụng frbtcWrapTyped để chuyển đổi BTC thành frBTC (token Bitcoin được bọc trên Alkanes). Điều này cần thiết để tham gia Alkanes DeFi:",

    ammPoolTitle: "Tạo Pool AMM",
    ammPoolDesc: "Sử dụng alkanesInitPoolTyped để tạo pool thanh khoản mới. Ví dụ này từ script deploy-regtest-bindgen.ts:",

    ammSwapTitle: "Thực hiện Swap",
    ammSwapDesc: "Sử dụng alkanesSwapTyped để thực hiện swap token thông qua các pool AMM:",

    verifyContractTitle: "Xác minh Hợp đồng",
    verifyContractDesc: "Xác minh hợp đồng đã được triển khai thành công bằng cách kiểm tra bytecode của nó:",

    regtestTitle: "Phát triển Regtest",
    regtestDesc: "Để phát triển cục bộ, kết nối với node regtest và sử dụng Bitcoin RPC để tạo block:",

    testingTitle: "Kiểm thử Tích hợp",
    testingDesc: "Các bài kiểm thử tích hợp của chúng tôi xác minh SDK hoạt động chính xác với RPC trực tiếp:",

    troubleshootTitle: "Khắc phục Sự cố",
    troubleshootItems: [
      { issue: "WASM không tải trong Node.js", solution: "Đảm bảo bạn gọi provider.initialize() trước khi sử dụng bất kỳ phương thức nào. SDK tự động xử lý việc tải WASM đa nền tảng." },
      { issue: "Phản hồi trống từ các script Lua", solution: "Kiểm tra rằng script Lua của bạn trả về một giá trị. SDK sử dụng JSON.parse nội bộ để deserialize phản hồi." },
      { issue: "Lỗi hết thời gian RPC", solution: "Các script Lua thực hiện nhiều cuộc gọi RPC có thể hết thời gian. Giảm số lượng chiều cao block được truy vấn hoặc tăng khoảng thời gian." }
    ],

    resourcesTitle: "Tài nguyên",
    resources: [
      { text: "alkanes-rs GitHub", href: "https://github.com/kungfuflex/alkanes-rs", desc: "Mã nguồn giao thức và SDK Alkanes" },
      { text: "Kiểm thử Tích hợp Trực tiếp", href: "https://github.com/alkanes-rs/alkanes-rs/tree/develop/ts-sdk", desc: "Ví dụ kiểm thử TS SDK" },
      { text: "Subfrost API", href: "https://api.subfrost.io", desc: "Nhận khóa API cho sử dụng sản xuất" }
    ]
  },
  ko: {
    title: "@alkanes/ts-sdk 가이드",
    subtitle: "alkanes.build 코드베이스의 실제 예제",
    intro: "이 가이드는 alkanes.build가 @alkanes/ts-sdk를 사용하여 블록체인 데이터를 가져오고, Lua 스크립트를 실행하고, 완전한 DeFi 대시보드를 구축하는 방법을 문서화합니다. 모든 예제는 실제 프로덕션 코드에서 가져온 것입니다.",

    installTitle: "설치",
    installDesc: "alkanes 패키지 레지스트리에서 SDK를 설치합니다. 아래 URL은 develop 브랜치의 최신 커밋에 고정되어 있습니다:",
    installDirect: "또는 버전이 지정된 URL로 직접 설치:",
    installLoading: "최신 버전 가져오는 중...",
    installError: "최신 버전을 가져올 수 없습니다. 기본 URL 사용:",
    installVersionLabel: "최신 버전:",

    architectureTitle: "아키텍처 개요",
    architectureDesc: "SDK는 WASM 바인딩 위에 통합된 TypeScript 인터페이스를 제공합니다. 완전한 메서드 문서는 전체 API 참조를 확인하세요.",
    architectureItems: [
      { name: "AlkanesProvider", desc: "각 API에 대한 서브 클라이언트가 있는 주요 진입점", anchor: "AlkanesProvider" },
      { name: "EsploraClient", desc: "Bitcoin UTXO 및 트랜잭션 데이터", anchor: "EsploraClient" },
      { name: "AlkanesRpcClient", desc: "Alkane 토큰 잔액 및 계약 호출", anchor: "AlkanesRpcClient" },
      { name: "MetashrewClient", desc: "저수준 metashrew_view RPC 접근", anchor: "MetashrewClient" },
      { name: "LuaClient", desc: "캐싱이 있는 서버 측 Lua 스크립트 실행", anchor: "LuaClient" },
      { name: "DataApiClient", desc: "시장 데이터, 캔들 및 BTC 가격", anchor: "DataApiClient" },
      { name: "BitcoinRpcClient", desc: "Bitcoin Core RPC 메서드", anchor: "BitcoinRpcClient" }
    ],
    apiRefLink: "전체 API 참조 보기",

    providerTitle: "Provider 생성",
    providerDesc: "AlkanesProvider는 주요 진입점입니다. alkanes.build가 초기화하는 방법입니다:",

    clientTitle: "싱글톤 클라이언트 패턴",
    clientDesc: "반복적인 WASM 초기화를 피하기 위해 provider에 싱글톤 패턴을 사용합니다:",

    heightTitle: "블록 높이 가져오기",
    heightDesc: "provider를 사용하여 현재 블록체인 높이를 가져옵니다:",

    balancesTitle: "지갑 잔액 가져오기",
    balancesDesc: "주소의 BTC 잔액 및 Alkane 토큰 보유량을 가져옵니다:",

    btcPriceTitle: "Bitcoin 가격 가져오기",
    btcPriceDesc: "Data API에서 현재 BTC/USD 가격을 가져옵니다:",

    metashrewTitle: "Metashrew View 호출",
    metashrewDesc: "풀 준비금 및 토큰 데이터를 위해 metashrew_view를 사용하여 alkane 계약을 호출합니다:",

    luaTitle: "Lua 스크립트 실행",
    luaDesc: "자동 scripthash 캐싱으로 일괄 쿼리를 위한 Lua 스크립트를 실행합니다:",
    luaAdvantages: [
      "여러 쿼리에 대한 단일 RPC 왕복",
      "동일한 블록 높이에서 원자적 데이터 스냅샷",
      "자동 scripthash 캐싱 (lua_evalsaved 폴백)",
      "서버 측 JSON 인코딩"
    ],

    candleTitle: "풀 캔들 데이터 가져오기",
    candleDesc: "차트를 위한 과거 풀 데이터 가져오기의 전체 예제:",

    walletOpsTitle: "지갑 작업",
    walletOpsDesc: "SDK는 rawProvider를 통해 지갑 관리를 제공합니다. 지갑 생성, 니모닉 로드 및 주소 가져오기:",

    contractDeployTitle: "계약 배포",
    contractDeployDesc: "protostones를 사용하여 WASM 계약을 배포합니다. 이 패턴은 alkanes-rs의 deploy-regtest-bindgen.ts 스크립트에서 가져온 것입니다:",

    executeTypedTitle: "트랜잭션 실행",
    executeTypedDesc: "alkanesExecuteTyped를 사용하여 완전한 타입 안전성으로 alkane 트랜잭션을 실행합니다. 이 메서드는 트랜잭션 정보에 대한 즉각적인 접근과 지연 로드된 실행 트레이스를 제공하는 TransactionBroadcast 객체를 반환합니다:",
    executeTypedBroadcastTitle: "TransactionBroadcast 인터페이스",
    executeTypedBroadcastDesc: "TransactionBroadcast 객체는 즉각적인 트랜잭션 데이터와 비동기 트레이스 가져오기를 분리합니다:",

    frbtcWrapTitle: "BTC를 frBTC로 래핑",
    frbtcWrapDesc: "frbtcWrapTyped를 사용하여 BTC를 frBTC (Alkanes의 래핑된 Bitcoin 토큰)로 변환합니다. 이는 Alkanes DeFi에 참여하는 데 필수적입니다:",

    ammPoolTitle: "AMM 풀 생성",
    ammPoolDesc: "alkanesInitPoolTyped를 사용하여 새 유동성 풀을 생성합니다. 이 예제는 deploy-regtest-bindgen.ts 스크립트에서 가져온 것입니다:",

    ammSwapTitle: "스왑 실행",
    ammSwapDesc: "alkanesSwapTyped를 사용하여 AMM 풀을 통해 토큰 스왑을 실행합니다:",

    verifyContractTitle: "계약 검증",
    verifyContractDesc: "bytecode를 확인하여 계약이 성공적으로 배포되었는지 확인합니다:",

    regtestTitle: "Regtest 개발",
    regtestDesc: "로컬 개발의 경우, regtest 노드에 연결하고 블록 생성을 위해 Bitcoin RPC를 사용합니다:",

    testingTitle: "통합 테스트",
    testingDesc: "통합 테스트는 SDK가 라이브 RPC에 대해 올바르게 작동하는지 확인합니다:",

    troubleshootTitle: "문제 해결",
    troubleshootItems: [
      { issue: "Node.js에서 WASM이 로드되지 않음", solution: "메서드를 사용하기 전에 provider.initialize()를 호출해야 합니다. SDK는 크로스 플랫폼 WASM 로딩을 자동으로 처리합니다." },
      { issue: "Lua 스크립트에서 빈 응답", solution: "Lua 스크립트가 값을 반환하는지 확인하세요. SDK는 응답을 역직렬화하기 위해 내부적으로 JSON.parse를 사용합니다." },
      { issue: "RPC 시간 초과 오류", solution: "많은 RPC 호출을 하는 Lua 스크립트는 시간 초과될 수 있습니다. 쿼리하는 블록 높이 수를 줄이거나 간격을 늘리세요." }
    ],

    resourcesTitle: "리소스",
    resources: [
      { text: "alkanes-rs GitHub", href: "https://github.com/kungfuflex/alkanes-rs", desc: "Alkanes 프로토콜 및 SDK 소스" },
      { text: "라이브 통합 테스트", href: "https://github.com/alkanes-rs/alkanes-rs/tree/develop/ts-sdk", desc: "TS SDK 테스트 예제" },
      { text: "Subfrost API", href: "https://api.subfrost.io", desc: "프로덕션 사용을 위한 API 키 받기" }
    ]
  }
};

function CodeBlock({ children, title, language = "typescript" }: { children: string; title?: string; language?: string }) {
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

function InstallationSection({ t }: { t: typeof content.en }) {
  const { data: sdkVersion, isLoading, error } = useSdkVersion();

  return (
    <Section title={t.installTitle} id="installation">
      <p className="mb-4 text-[color:var(--sf-muted)]">{t.installDesc}</p>

      {/* Dynamic versioned URL */}
      {isLoading ? (
        <div className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] text-sm text-[color:var(--sf-muted)]">
          {t.installLoading}
        </div>
      ) : error || !sdkVersion ? (
        <>
          <p className="mb-2 text-sm text-orange-500">{t.installError}</p>
          <CodeBlock language="bash">{`npm install https://pkg.alkanes.build/dist/@alkanes/ts-sdk`}</CodeBlock>
        </>
      ) : (
        <>
          {/* Show version info */}
          <div className="mb-3 p-3 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)] text-sm">
            <span className="text-[color:var(--sf-muted)]">{t.installVersionLabel} </span>
            <code className="text-[color:var(--sf-primary)] font-semibold">{sdkVersion.versionWithHash}</code>
            <span className="text-[color:var(--sf-muted)]"> - {sdkVersion.commitMessage}</span>
            <span className="text-[color:var(--sf-muted)] ml-2 text-xs">({formatCommitDate(sdkVersion.commitDate)})</span>
          </div>

          <CodeBlock language="bash">{`# Install with npm
npm install ${sdkVersion.packageUrl}

# Or with pnpm
pnpm add ${sdkVersion.packageUrl}

# Or with yarn
yarn add ${sdkVersion.packageUrl}`}</CodeBlock>
        </>
      )}

      <p className="mt-6 mb-2 text-[color:var(--sf-muted)]">Or configure npm to use the alkanes registry:</p>
      <CodeBlock language="bash">{`# Configure npm registry (alternative)
npm config set @alkanes:registry https://pkg.alkanes.build/
npm install @alkanes/ts-sdk`}</CodeBlock>
    </Section>
  );
}

export default function TsSdkGuidePage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-sm text-[color:var(--sf-primary)] mb-4">{t.subtitle}</p>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      {/* Installation */}
      <InstallationSection t={t} />

      {/* Architecture */}
      <Section title={t.architectureTitle} id="architecture">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.architectureDesc}</p>
        <CodeBlock>{`// SDK Structure
import { AlkanesProvider } from '@alkanes/ts-sdk';

const provider = new AlkanesProvider({ network: 'mainnet' });
await provider.initialize();

// Sub-clients available after initialization:
provider.esplora      // EsploraClient - UTXOs, transactions
provider.alkanes      // AlkanesRpcClient - token balances, contract calls
provider.metashrew    // MetashrewClient - low-level metashrew_view
provider.lua          // LuaClient - Lua script execution
provider.dataApi      // DataApiClient - market data, BTC price
provider.bitcoin      // BitcoinRpcClient - bitcoind RPC calls`}</CodeBlock>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)] mt-4">
          {t.architectureItems.map((item, i) => (
            <li key={i}>
              <Link
                href={`/docs/api/ts-sdk#${item.anchor}`}
                className="text-[color:var(--sf-primary)] hover:underline font-mono"
              >
                {item.name}
              </Link>
              <span> - {item.desc}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Link
            href="/docs/api/ts-sdk"
            className="inline-flex items-center gap-2 text-[color:var(--sf-primary)] hover:underline font-medium"
          >
            {t.apiRefLink} →
          </Link>
        </div>
      </Section>

      {/* Provider Setup */}
      <Section title={t.providerTitle} id="provider">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.providerDesc}</p>
        <CodeBlock title="lib/alkanes-client.ts">{`import { AlkanesProvider } from '@alkanes/ts-sdk';

// Network presets available: 'mainnet', 'testnet', 'signet', 'regtest'
const provider = new AlkanesProvider({
  network: 'mainnet',
  // Optional: Override RPC URL
  rpcUrl: process.env.ALKANES_RPC_URL || 'https://mainnet.subfrost.io/v4/jsonrpc',
});

// IMPORTANT: Must call initialize() before using the provider
// This loads the WASM module (works in both Node.js and browser)
await provider.initialize();`}</CodeBlock>
      </Section>

      {/* Singleton Pattern */}
      <Section title={t.clientTitle} id="singleton">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.clientDesc}</p>
        <CodeBlock title="lib/alkanes-client.ts (singleton pattern)">{`class AlkanesClient {
  private provider: AlkanesProvider | null = null;
  private initPromise: Promise<void> | null = null;
  private rpcUrl: string;

  constructor() {
    this.rpcUrl = process.env.ALKANES_RPC_URL || 'https://mainnet.subfrost.io/v4/jsonrpc';
  }

  // Lazy, singleton initialization
  private async ensureProvider(): Promise<AlkanesProvider> {
    if (this.provider) return this.provider;

    if (!this.initPromise) {
      this.initPromise = (async () => {
        this.provider = new AlkanesProvider({
          network: 'mainnet',
          rpcUrl: this.rpcUrl,
        });
        await this.provider.initialize();
      })();
    }

    await this.initPromise;
    return this.provider!;
  }

  // Example method using the provider
  async getCurrentHeight(): Promise<number> {
    const provider = await this.ensureProvider();
    return provider.getBlockHeight();
  }
}

// Export singleton instance
export const alkanesClient = new AlkanesClient();`}</CodeBlock>
      </Section>

      {/* Block Height */}
      <Section title={t.heightTitle} id="height">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.heightDesc}</p>
        <CodeBlock title="Getting current block height">{`// Using the convenience method
const height = await provider.getBlockHeight();
console.log('Current height:', height); // e.g., 927618

// Or using the metashrew client directly
const height = await provider.metashrew.getHeight();`}</CodeBlock>
      </Section>

      {/* Wallet Balances */}
      <Section title={t.balancesTitle} id="balances">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.balancesDesc}</p>
        <CodeBlock title="Fetching wallet balances">{`// Get BTC UTXOs
const utxos = await provider.esplora.getAddressUtxos(address);
const btcBalance = utxos.reduce((sum, utxo) => sum + utxo.value, 0);
console.log('BTC Balance:', btcBalance, 'sats');

// Get Alkane token balances
const balances = await provider.alkanes.getBalance(address);
console.log('Token balances:', balances);
// Returns: [{ alkane_id: { block: 2, tx: 0 }, balance: 444121520576, ... }]

// Format balances with known token metadata
const KNOWN_TOKENS = {
  '2:0': { symbol: 'DIESEL', decimals: 8 },
  '32:0': { symbol: 'frBTC', decimals: 8 },
  '2:56801': { symbol: 'bUSD', decimals: 8 },
};

for (const b of balances) {
  const id = \`\${b.alkane_id.block}:\${b.alkane_id.tx}\`;
  const token = KNOWN_TOKENS[id] || { symbol: id, decimals: 8 };
  const formatted = Number(b.balance) / Math.pow(10, token.decimals);
  console.log(\`\${token.symbol}: \${formatted.toLocaleString()}\`);
}`}</CodeBlock>
      </Section>

      {/* BTC Price */}
      <Section title={t.btcPriceTitle} id="btc-price">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.btcPriceDesc}</p>
        <CodeBlock title="Fetching Bitcoin price">{`// Using the Data API client
const result = await provider.dataApi.getBitcoinPrice();

// Response structure varies, handle multiple formats:
const price = result?.data?.bitcoin?.usd
           ?? result?.bitcoin?.usd
           ?? result?.price
           ?? result?.usd;

if (typeof price === 'number' && price > 0) {
  console.log('BTC Price:', '$' + price.toLocaleString());
}`}</CodeBlock>
      </Section>

      {/* Metashrew View */}
      <Section title={t.metashrewTitle} id="metashrew">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.metashrewDesc}</p>
        <CodeBlock title="Fetching pool reserves via metashrew_view">{`// Pool configurations with protobuf payloads
const POOLS = {
  DIESEL_FRBTC: {
    name: 'DIESEL/frBTC',
    protobufPayload: '0x2096ce382a06029fda04e7073001',
    alkaneId: { block: 2, tx: 77087 },
  },
  DIESEL_BUSD: {
    name: 'DIESEL/bUSD',
    protobufPayload: '0x2096ce382a0602d99604e7073001',
    alkaneId: { block: 2, tx: 68441 },
  },
};

// Call metashrew_view with 'simulate' view function
const hex = await provider.metashrew.view(
  'simulate',
  POOLS.DIESEL_FRBTC.protobufPayload,
  'latest'  // or a specific block height as string
);

// Parse the response (little-endian u128 values)
function parsePoolReserves(hex: string) {
  const data = hex.startsWith('0x') ? hex.slice(2) : hex;
  // Find inner data after protobuf wrapper
  const marker = data.indexOf('1a');
  if (marker === -1) return null;

  const lenByte = parseInt(data.slice(marker + 2, marker + 4), 16);
  const innerStart = marker + (lenByte < 128 ? 4 : 6);
  const inner = data.slice(innerStart);

  // Pool layout: token_a[32], token_b[32], reserve_a[16], reserve_b[16], total_supply[16]
  return {
    reserve0: parseU128LE(inner, 64),
    reserve1: parseU128LE(inner, 80),
    totalSupply: parseU128LE(inner, 96),
  };
}

// Helper: parse little-endian u128
function parseU128LE(hex: string, byteOffset: number): bigint {
  const slice = hex.slice(byteOffset * 2, byteOffset * 2 + 32);
  let reversed = '';
  for (let i = slice.length - 2; i >= 0; i -= 2) {
    reversed += slice.slice(i, i + 2);
  }
  return BigInt('0x' + (reversed || '0'));
}`}</CodeBlock>
      </Section>

      {/* Lua Scripts */}
      <Section title={t.luaTitle} id="lua">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.luaDesc}</p>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)] mb-4">
          {t.luaAdvantages.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <CodeBlock title="Executing Lua scripts with provider.lua.eval()">{`// The LuaClient automatically handles scripthash caching:
// 1. Computes SHA256 hash of script
// 2. Tries lua_evalsaved (cached) first
// 3. Falls back to lua_evalscript if not cached

const STATS_LUA_SCRIPT = \`
-- Fetch DIESEL stats in a single RPC call
local results = { diesel = {}, pools = {}, height = 0 }

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

-- Fetch pool reserves
local frbtc_response = _RPC.metashrew_view(
    "simulate",
    "0x2096ce382a06029fda04e7073001",
    "latest"
)
-- Parse and add to results...

return results
\`;

// Execute the script
const result = await provider.lua.eval(STATS_LUA_SCRIPT, []);

// Result structure: { calls: number, returns: any, runtime: number }
console.log('RPC calls made:', result.calls);
console.log('Runtime (ms):', result.runtime);
console.log('Data:', result.returns);`}</CodeBlock>
      </Section>

      {/* Candle Data */}
      <Section title={t.candleTitle} id="candles">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.candleDesc}</p>
        <CodeBlock title="lib/pools/candle-fetcher.ts">{`// Lua script for fetching historical pool data
export const CANDLES_LUA_SCRIPT = \`
local params = args[1] or {}
local pool_payload = params[1]
local start_height = tonumber(params[2])
local end_height = tonumber(params[3])
local interval = tonumber(params[4]) or 144  -- ~1 day in blocks

local function parse_u128_le(hex_str, byte_offset)
    -- Little-endian u128 parsing
    local hex_offset = byte_offset * 2
    local hex_slice = hex_str:sub(hex_offset + 1, hex_offset + 32)
    local reversed = ""
    for i = #hex_slice - 1, 1, -2 do
        reversed = reversed .. hex_slice:sub(i, i + 1)
    end
    return tonumber(reversed, 16) or 0
end

local function get_block_timestamp(height)
    local ok, hash = pcall(function() return _RPC.btc_getblockhash(height) end)
    if not ok then return nil end
    local ok2, block = pcall(function() return _RPC.btc_getblock(hash, 1) end)
    if not ok2 then return nil end
    return block.time
end

local results = { data_points = {} }

for height = start_height, end_height, interval do
    local ok, response = pcall(function()
        return _RPC.metashrew_view("simulate", pool_payload, tostring(height))
    end)

    if ok and response then
        local hex = response:sub(1, 2) == "0x" and response:sub(3) or response
        -- Parse reserves from response...
        table.insert(results.data_points, {
            height = height,
            timestamp = get_block_timestamp(height),
            reserve_a = parse_u128_le(inner, 64),
            reserve_b = parse_u128_le(inner, 80),
            total_supply = parse_u128_le(inner, 96)
        })
    end
end

results.count = #results.data_points
return results
\`;

// Execute and process results
export async function fetchPoolDataPoints(
  poolKey: 'DIESEL_FRBTC' | 'DIESEL_BUSD',
  startHeight: number,
  endHeight: number,
  interval: number = 144
) {
  const pool = POOLS[poolKey];
  const provider = await ensureProvider();

  const result = await provider.lua.eval(CANDLES_LUA_SCRIPT, [
    [pool.protobufPayload, startHeight.toString(), endHeight.toString(), interval.toString()]
  ]);

  // Convert to typed data points
  return result.returns.data_points.map(dp => ({
    height: dp.height,
    timestamp: dp.timestamp,
    reserve0: BigInt(dp.reserve_a),
    reserve1: BigInt(dp.reserve_b),
    totalSupply: BigInt(dp.total_supply),
  }));
}`}</CodeBlock>
      </Section>

      {/* Wallet Operations */}
      <Section title={t.walletOpsTitle} id="wallet-ops">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.walletOpsDesc}</p>
        <CodeBlock title="Wallet management with rawProvider">{`import { AlkanesProvider } from '@alkanes/ts-sdk';

const provider = new AlkanesProvider({
  network: 'regtest',
  rpcUrl: 'http://127.0.0.1:18888'
});
await provider.initialize();

// Access the raw WASM provider for wallet operations
const rawProvider = provider.rawProvider;

// Create a new wallet
const walletInfo = rawProvider.walletCreate();
console.log('Mnemonic:', walletInfo.mnemonic);
console.log('Address:', walletInfo.address);

// Load an existing wallet from mnemonic
rawProvider.walletLoadMnemonic('your twelve word mnemonic phrase here ...');

// Get addresses (type: 'p2tr' | 'p2wpkh' | 'p2sh-p2wpkh')
const addresses = rawProvider.walletGetAddresses('p2tr', 0, 5);
addresses.forEach((addr, i) => {
  console.log(\`Address \${i}: \${addr.address}\`);
});`}</CodeBlock>
      </Section>

      {/* Regtest Development */}
      <Section title={t.regtestTitle} id="regtest">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.regtestDesc}</p>
        <CodeBlock title="Regtest setup and block generation">{`import { AlkanesProvider } from '@alkanes/ts-sdk';

const provider = new AlkanesProvider({
  network: 'regtest',
  rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:18888'
});
await provider.initialize();

// Check if node is running
const height = await provider.bitcoin.getBlockCount();
console.log('Regtest node running at height:', height);

// Fund a wallet by mining blocks
const walletAddress = 'bcrt1q...';  // Your regtest address

// Mine 101 blocks to mature coinbase
await provider.bitcoin.generateToAddress(101, walletAddress);

// Check wallet UTXOs
const utxos = await provider.esplora.getAddressUtxos(walletAddress);
console.log('Wallet has', utxos.length, 'UTXOs');

// Get total balance
const totalSats = utxos.reduce((sum, u) => sum + u.value, 0);
console.log('Balance:', totalSats / 100_000_000, 'BTC');`}</CodeBlock>
      </Section>

      {/* Contract Deployment */}
      <Section title={t.contractDeployTitle} id="deploy">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.contractDeployDesc}</p>
        <CodeBlock title="Deploy a WASM contract">{`import { readFileSync } from 'fs';
import { AlkanesProvider } from '@alkanes/ts-sdk';

// Read WASM file as hex
function readWasmAsHex(wasmPath: string): string {
  const buffer = readFileSync(wasmPath);
  return buffer.toString('hex');
}

async function deployContract(
  provider: AlkanesProvider,
  walletAddress: string,
  wasmPath: string,
  targetTx: number,
  initArgs: string = ''
): Promise<string> {
  // Read WASM as hex for envelope
  const envelopeHex = readWasmAsHex(wasmPath);

  // Build protostone for deployment
  // Format: [3,targetTx,initArgs...]:v0:v0
  // [3,...] = deploy opcode, creates contract at [4,targetTx]
  const protostone = initArgs
    ? \`[3,\${targetTx},\${initArgs}]:v0:v0\`
    : \`[3,\${targetTx}]:v0:v0\`;

  console.log('Deploying with protostone:', protostone);
  console.log('WASM size:', envelopeHex.length / 2, 'bytes');

  // Execute deployment
  const result = await provider.alkanesExecuteTyped({
    toAddresses: [walletAddress],
    inputRequirements: '',
    protostones: protostone,
    feeRate: 1,
    envelopeHex: envelopeHex,
    fromAddresses: [walletAddress],
    changeAddress: walletAddress,
    traceEnabled: true,
    autoConfirm: true,
    mineEnabled: true,  // Auto-mine on regtest
  });

  console.log('Deployed to [4,', targetTx, ']');
  return result.reveal_txid || result.txid;
}

// Example: Deploy a token contract at [4, 0x1234]
await deployContract(
  provider,
  walletAddress,
  './contracts/my_token.wasm',
  0x1234,
  '0,1000000000'  // Init args: owner=0, total_supply=1B
);`}</CodeBlock>
      </Section>

      {/* Transaction Execution */}
      <Section title={t.executeTypedTitle} id="execute">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.executeTypedDesc}</p>
        <CodeBlock title="Execute alkane transactions">{`// Call a contract method (e.g., mint DIESEL tokens)
const mintResult = await provider.alkanesExecuteTyped({
  toAddresses: [walletAddress],
  inputRequirements: '',
  // [2,0,77] = call DIESEL contract (2:0) with opcode 77 (mint)
  protostones: '[2,0,77]:v0:v0',
  feeRate: 1,
  fromAddresses: [walletAddress],
  changeAddress: walletAddress,
  traceEnabled: true,
  autoConfirm: true,
  mineEnabled: true,
});

// Transfer tokens between addresses
const transferResult = await provider.alkanesExecuteTyped({
  toAddresses: [recipientAddress],
  // Input requirements specify token amounts needed
  inputRequirements: '2:0:1000000',  // Need 1M units of 2:0 (DIESEL)
  protostones: '',  // No contract call, just transfer
  feeRate: 2,
  fromAddresses: [walletAddress],
  changeAddress: walletAddress,
  autoConfirm: true,
});

// Create a liquidity pool
const poolResult = await provider.alkanesExecuteTyped({
  toAddresses: [walletAddress],
  inputRequirements: '2:0:300000000,32:0:50000',  // DIESEL + frBTC
  // Call factory contract to create pool
  protostones: \`[4,\${FACTORY_ID},1,2,0,32,0]:v0:v0\`,
  feeRate: 1,
  fromAddresses: [walletAddress],
  changeAddress: walletAddress,
  traceEnabled: true,
  autoConfirm: true,
  mineEnabled: true,
});`}</CodeBlock>
      </Section>

      {/* frBTC Wrap */}
      <Section title={t.frbtcWrapTitle} id="frbtc-wrap">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.frbtcWrapDesc}</p>
        <CodeBlock title="Wrap BTC to frBTC">{`// Wrap BTC to frBTC using the typed method
const result = await provider.frbtcWrapTyped({
  // Amount in satoshis to wrap
  amount: BigInt(100000000), // 1 BTC = 100,000,000 sats
  toAddress: walletAddress,
  fromAddress: walletAddress,
  feeRate: 1,
  traceEnabled: true,
  mineEnabled: true,   // Auto-mine on regtest
  autoConfirm: true,
});

console.log('Wrap transaction:', result.reveal_txid);

// Verify frBTC balance after wrap
const balances = await provider.alkanes.getBalance(walletAddress);
const frbtc = balances.find(b =>
  b.alkane_id.block === 32 && b.alkane_id.tx === 0
);
console.log('frBTC balance:', frbtc?.balance);`}</CodeBlock>
      </Section>

      {/* AMM Pool Creation */}
      <Section title={t.ammPoolTitle} id="amm-pool">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.ammPoolDesc}</p>
        <CodeBlock title="Create AMM liquidity pool">{`// Initialize a new AMM pool with two tokens
const txid = await provider.alkanesInitPoolTyped({
  // Factory contract ID (where to create the pool)
  factoryId: { block: 4, tx: 65522 },  // AMM Factory

  // Token pair for the pool
  token0: { block: 2, tx: 0 },    // DIESEL
  token1: { block: 32, tx: 0 },   // frBTC

  // Initial liquidity amounts (in smallest units)
  amount0: '300000000',  // 3 DIESEL (8 decimals)
  amount1: '50000',      // 0.0005 frBTC

  // Minimum LP tokens to receive (optional, for slippage protection)
  minimumLp: '0',

  toAddress: walletAddress,
  fromAddress: walletAddress,
  feeRate: 1,
  trace: true,
  autoConfirm: true,
});

console.log('Pool created! TXID:', txid);

// The pool will be created at a new alkane ID
// Query the factory to find the pool ID`}</CodeBlock>
      </Section>

      {/* AMM Swap */}
      <Section title={t.ammSwapTitle} id="amm-swap">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.ammSwapDesc}</p>
        <CodeBlock title="Execute token swap">{`// Swap tokens through an AMM pool
const txid = await provider.alkanesSwapTyped({
  // Factory to route through
  factoryId: { block: 4, tx: 65522 },

  // Swap path: array of token IDs from input to output
  path: [
    { block: 2, tx: 0 },   // DIESEL (input)
    { block: 32, tx: 0 },  // frBTC (output)
  ],

  // Amount of input token to swap
  inputAmount: '100000000',  // 1 DIESEL

  // Minimum output (slippage protection)
  minimumOutput: '10',  // Minimum frBTC to receive

  // Expiration block height (deadline for swap)
  expires: currentHeight + 10,

  toAddress: walletAddress,
  fromAddress: walletAddress,
  feeRate: 1,
  trace: true,
  autoConfirm: true,
});

console.log('Swap executed! TXID:', txid);

// For multi-hop swaps, extend the path:
// path: [tokenA, tokenB, tokenC]  // A -> B -> C`}</CodeBlock>
      </Section>

      {/* Contract Verification */}
      <Section title={t.verifyContractTitle} id="verify">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.verifyContractDesc}</p>
        <CodeBlock title="Verify contract deployment">{`async function verifyDeployment(
  provider: AlkanesProvider,
  contractId: string  // Format: "4:1234"
): Promise<boolean> {
  // Retry a few times as indexer may lag
  for (let i = 0; i < 3; i++) {
    try {
      const bytecode = await provider.alkanes.getBytecode(contractId);

      if (bytecode && bytecode.length > 0) {
        console.log(\`Contract \${contractId} verified!\`);
        console.log(\`Bytecode size: \${bytecode.length / 2} bytes\`);
        return true;
      }
    } catch {
      // Ignore and retry
    }

    console.log('Waiting for indexer...');
    await new Promise(r => setTimeout(r, 2000));
  }

  console.error(\`Contract \${contractId} not found\`);
  return false;
}

// Verify after deployment
await verifyDeployment(provider, '4:0x1234');

// Get contract storage
const storage = await provider.alkanes.getStorageSlot(
  '4:0x1234',  // Contract ID
  '0x00'       // Storage key
);
console.log('Storage value:', storage);`}</CodeBlock>
      </Section>

      {/* Testing */}
      <Section title={t.testingTitle} id="testing">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.testingDesc}</p>
        <CodeBlock title="tests/integration/live-rpc.test.ts">{`import { describe, it, expect } from "vitest";
import { AlkanesProvider } from "@alkanes/ts-sdk";

const TEST_ADDRESS = "bc1puvfmy5whzdq35nd2trckkm09em9u7ps6lal564jz92c9feswwrpsr7ach5";

describe("Live SDK Integration", () => {
  it("should fetch wallet balances", async () => {
    const provider = new AlkanesProvider({
      network: "mainnet",
      rpcUrl: "https://mainnet.subfrost.io/v4/jsonrpc"
    });
    await provider.initialize();

    // Get UTXOs
    const utxos = await provider.esplora.getAddressUtxos(TEST_ADDRESS);
    expect(Array.isArray(utxos)).toBe(true);
    expect(utxos.length).toBeGreaterThan(0);

    // Get alkane balances
    const balances = await provider.alkanes.getBalance(TEST_ADDRESS);
    expect(balances).toBeDefined();
    console.log('Found', balances.length, 'token balances');
  }, 60000);

  it("should execute Lua scripts", async () => {
    const provider = new AlkanesProvider({ network: "mainnet" });
    await provider.initialize();

    const result = await provider.lua.eval(\`
      local height = tonumber(_RPC.metashrew_height()) or 0
      return { height = height }
    \`, []);

    expect(result.returns.height).toBeGreaterThan(900000);
  }, 60000);
});

// Run with: RUN_INTEGRATION=true pnpm vitest run tests/integration/`}</CodeBlock>
      </Section>

      {/* Troubleshooting */}
      <Section title={t.troubleshootTitle} id="troubleshooting">
        <div className="space-y-4">
          {t.troubleshootItems.map((item, i) => (
            <div key={i} className="p-4 rounded-lg border border-[color:var(--sf-outline)] bg-[color:var(--sf-surface)]">
              <h4 className="font-semibold mb-2 text-[color:var(--sf-text)]">{item.issue}</h4>
              <p className="text-sm text-[color:var(--sf-muted)]">{item.solution}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Resources */}
      <Section title={t.resourcesTitle} id="resources">
        <ul className="space-y-3">
          {t.resources.map((resource, i) => (
            <li key={i}>
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--sf-primary)] hover:underline font-medium"
              >
                {resource.text}
              </a>
              <span className="text-[color:var(--sf-muted)]"> - {resource.desc}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
