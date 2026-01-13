"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Deployment Guide",
    subtitle: "Deploy and interact with Alkanes smart contracts on regtest and mainnet",
    intro: "This guide covers deploying Alkanes contracts using alkanes-cli. You'll learn the deployment patterns, CLI commands, and how to interact with deployed contracts.",

    patternsTitle: "Deployment Patterns",
    patternsDesc: "Alkanes uses specific cellpack patterns for different deployment operations:",
    patterns: [
      { pattern: "[3, tx]", desc: "Deploy WASM to factory slot [4, tx] - use for templates and factories" },
      { pattern: "[6, tx]", desc: "Clone from template [4, tx] to next available [2, n]" },
      { pattern: "[1, 0]", desc: "Deploy via CREATE to next available [2, n]" },
    ],

    alkaneIdRangesTitle: "AlkaneId Ranges",
    alkaneIdRangesDesc: "Different block prefixes indicate different contract types:",
    alkaneIdRanges: [
      { range: "[2, n]", desc: "Regular deployed contracts (CREATE or CLONE)" },
      { range: "[4, n]", desc: "Factory templates - deployed via [3, n]" },
      { range: "[6, n]", desc: "Clone operations (specifies template to clone)" },
      { range: "[32, n]", desc: "Genesis contracts (frBTC, etc.)" },
      { range: "[31, n]", desc: "System contracts (ftrBTC, etc.)" },
    ],

    cliSetupTitle: "CLI Setup",
    cliSetupDesc: "First, set up alkanes-cli and create a wallet:",

    regtestSetupTitle: "Regtest Environment",
    regtestSetupDesc: "Start a local regtest environment for testing:",

    walletSetupTitle: "Wallet Setup",
    walletSetupDesc: "Create and fund a wallet for deployment:",

    deployCommandTitle: "Deploy Command",
    deployCommandDesc: "Use the alkanes execute command with an envelope to deploy WASM:",

    protostoneTitle: "Protostone Format",
    protostoneDesc: "The protostone format is: [block,tx,opcode,...args]:output0:output1",
    protostoneExamples: [
      { example: "[3,1000,0]:v0:v0", desc: "Deploy WASM to [4, 1000], call opcode 0 (initialize)" },
      { example: "[6,1000,0,arg1,arg2]:v0:v0", desc: "Clone from [4, 1000], pass args to opcode 0" },
      { example: "[2,0,77]:v0:v0", desc: "Call opcode 77 (mint) on DIESEL [2,0]" },
      { example: "[4,65522,0]:v0:v0", desc: "Call opcode 0 on factory at [4, 65522]" },
    ],

    deployTemplateTitle: "Deploying a Template",
    deployTemplateDesc: "Deploy a contract as a factory template at [4, tx]:",

    cloningTitle: "Cloning from Templates",
    cloningDesc: "Create instances from templates using [6, template_tx]:",

    initializationTitle: "Contract Initialization",
    initializationDesc: "Most contracts need initialization after deployment:",

    mintingDieselTitle: "Minting DIESEL",
    mintingDieselDesc: "Mine DIESEL tokens by calling opcode 77 on [2,0]:",

    wrappingBtcTitle: "Wrapping BTC to frBTC",
    wrappingBtcDesc: "Convert BTC to frBTC using the wrap-btc command:",

    poolCreationTitle: "Creating AMM Pools",
    poolCreationDesc: "Create liquidity pools using init-pool:",

    swapTitle: "Performing Swaps",
    swapDesc: "Swap tokens through AMM pools:",

    simulateTitle: "Simulating Calls",
    simulateDesc: "Test calls without broadcasting using simulate:",

    verifyDeploymentTitle: "Verifying Deployments",
    verifyDeploymentDesc: "Check that contracts deployed correctly:",

    mainnetTitle: "Mainnet Deployment",
    mainnetDesc: "For mainnet deployment, change the network flag:",
    mainnetWarnings: [
      "Test thoroughly on regtest first",
      "Use higher fee rates for faster confirmation",
      "Keep wallet passphrase secure",
      "Verify contract bytecode before deploying",
      "Consider using multisig for admin operations",
    ],

    troubleshootingTitle: "Troubleshooting",
    troubleshooting: [
      { issue: "UTXO not found", solution: "Wait for indexer to sync or mine more blocks" },
      { issue: "Bytecode not found", solution: "Check deployment tx confirmed, wait for indexer" },
      { issue: "Already initialized", solution: "Contract already initialized - this is expected" },
      { issue: "Insufficient funds", solution: "Mine more blocks to your wallet address" },
      { issue: "Auth token required", solution: "Include auth token with --inputs flag" },
    ],

    exampleScriptTitle: "Complete Deployment Script",
    exampleScriptDesc: "Here's a complete script for deploying a token contract:",

    nextStepsTitle: "Next Steps",
    nextSteps: [
      { text: "Build a Token", href: "/docs/tutorials/token", desc: "Token tutorial" },
      { text: "Build an AMM", href: "/docs/tutorials/amm", desc: "AMM tutorial" },
      { text: "CLI Reference", href: "/docs/cli", desc: "Full CLI documentation" },
    ],
  },
  zh: {
    title: "部署指南",
    subtitle: "在 regtest 和主网上部署并与 Alkanes 智能合约交互",
    intro: "本指南介绍如何使用 alkanes-cli 部署 Alkanes 合约。您将学习部署模式、CLI 命令以及如何与已部署的合约交互。",

    patternsTitle: "部署模式",
    patternsDesc: "Alkanes 使用特定的 cellpack 模式进行不同的部署操作：",
    patterns: [
      { pattern: "[3, tx]", desc: "将 WASM 部署到工厂槽位 [4, tx] - 用于模板和工厂" },
      { pattern: "[6, tx]", desc: "从模板 [4, tx] 克隆到下一个可用的 [2, n]" },
      { pattern: "[1, 0]", desc: "通过 CREATE 部署到下一个可用的 [2, n]" },
    ],

    alkaneIdRangesTitle: "AlkaneId 范围",
    alkaneIdRangesDesc: "不同的区块前缀表示不同的合约类型：",
    alkaneIdRanges: [
      { range: "[2, n]", desc: "常规部署的合约（CREATE 或 CLONE）" },
      { range: "[4, n]", desc: "工厂模板 - 通过 [3, n] 部署" },
      { range: "[6, n]", desc: "克隆操作（指定要克隆的模板）" },
      { range: "[32, n]", desc: "创世合约（frBTC 等）" },
      { range: "[31, n]", desc: "系统合约（ftrBTC 等）" },
    ],

    cliSetupTitle: "CLI 设置",
    cliSetupDesc: "首先，设置 alkanes-cli 并创建钱包：",

    regtestSetupTitle: "Regtest 环境",
    regtestSetupDesc: "启动本地 regtest 环境进行测试：",

    walletSetupTitle: "钱包设置",
    walletSetupDesc: "创建并为钱包充值以进行部署：",

    deployCommandTitle: "部署命令",
    deployCommandDesc: "使用带有 envelope 的 alkanes execute 命令部署 WASM：",

    protostoneTitle: "Protostone 格式",
    protostoneDesc: "Protostone 格式为：[block,tx,opcode,...args]:output0:output1",
    protostoneExamples: [
      { example: "[3,1000,0]:v0:v0", desc: "将 WASM 部署到 [4, 1000]，调用 opcode 0（初始化）" },
      { example: "[6,1000,0,arg1,arg2]:v0:v0", desc: "从 [4, 1000] 克隆，将参数传递给 opcode 0" },
      { example: "[2,0,77]:v0:v0", desc: "在 DIESEL [2,0] 上调用 opcode 77（铸造）" },
      { example: "[4,65522,0]:v0:v0", desc: "在工厂 [4, 65522] 上调用 opcode 0" },
    ],

    deployTemplateTitle: "部署模板",
    deployTemplateDesc: "将合约作为工厂模板部署到 [4, tx]：",

    cloningTitle: "从模板克隆",
    cloningDesc: "使用 [6, template_tx] 从模板创建实例：",

    initializationTitle: "合约初始化",
    initializationDesc: "大多数合约在部署后需要初始化：",

    mintingDieselTitle: "铸造 DIESEL",
    mintingDieselDesc: "通过在 [2,0] 上调用 opcode 77 来挖掘 DIESEL 代币：",

    wrappingBtcTitle: "将 BTC 封装为 frBTC",
    wrappingBtcDesc: "使用 wrap-btc 命令将 BTC 转换为 frBTC：",

    poolCreationTitle: "创建 AMM 池",
    poolCreationDesc: "使用 init-pool 创建流动性池：",

    swapTitle: "执行交换",
    swapDesc: "通过 AMM 池交换代币：",

    simulateTitle: "模拟调用",
    simulateDesc: "使用 simulate 测试调用而不广播：",

    verifyDeploymentTitle: "验证部署",
    verifyDeploymentDesc: "检查合约是否正确部署：",

    mainnetTitle: "主网部署",
    mainnetDesc: "对于主网部署，更改网络标志：",
    mainnetWarnings: [
      "首先在 regtest 上彻底测试",
      "使用更高的费率以更快确认",
      "保护钱包密码安全",
      "部署前验证合约字节码",
      "考虑使用多签进行管理操作",
    ],

    troubleshootingTitle: "故障排除",
    troubleshooting: [
      { issue: "找不到 UTXO", solution: "等待索引器同步或挖更多区块" },
      { issue: "找不到字节码", solution: "检查部署交易是否确认，等待索引器" },
      { issue: "已初始化", solution: "合约已初始化 - 这是预期的" },
      { issue: "资金不足", solution: "向您的钱包地址挖掘更多区块" },
      { issue: "需要认证代币", solution: "使用 --inputs 标志包含认证代币" },
    ],

    exampleScriptTitle: "完整部署脚本",
    exampleScriptDesc: "以下是部署代币合约的完整脚本：",

    nextStepsTitle: "下一步",
    nextSteps: [
      { text: "构建代币", href: "/docs/tutorials/token", desc: "代币教程" },
      { text: "构建 AMM", href: "/docs/tutorials/amm", desc: "AMM 教程" },
      { text: "CLI 参考", href: "/docs/cli", desc: "完整 CLI 文档" },
    ],
  },
  ms: {
    title: "Panduan Penempatan",
    subtitle: "Tempatkan dan berinteraksi dengan kontrak pintar Alkanes pada regtest dan mainnet",
    intro: "Panduan ini merangkumi penempatan kontrak Alkanes menggunakan alkanes-cli. Anda akan mempelajari corak penempatan, arahan CLI, dan cara berinteraksi dengan kontrak yang ditempatkan.",

    patternsTitle: "Corak Penempatan",
    patternsDesc: "Alkanes menggunakan corak cellpack tertentu untuk operasi penempatan yang berbeza:",
    patterns: [
      { pattern: "[3, tx]", desc: "Tempatkan WASM ke slot kilang [4, tx] - gunakan untuk templat dan kilang" },
      { pattern: "[6, tx]", desc: "Klon dari templat [4, tx] ke [2, n] tersedia seterusnya" },
      { pattern: "[1, 0]", desc: "Tempatkan melalui CREATE ke [2, n] tersedia seterusnya" },
    ],

    alkaneIdRangesTitle: "Julat AlkaneId",
    alkaneIdRangesDesc: "Awalan blok yang berbeza menunjukkan jenis kontrak yang berbeza:",
    alkaneIdRanges: [
      { range: "[2, n]", desc: "Kontrak yang ditempatkan biasa (CREATE atau CLONE)" },
      { range: "[4, n]", desc: "Templat kilang - ditempatkan melalui [3, n]" },
      { range: "[6, n]", desc: "Operasi klon (menentukan templat untuk diklon)" },
      { range: "[32, n]", desc: "Kontrak genesis (frBTC, dll.)" },
      { range: "[31, n]", desc: "Kontrak sistem (ftrBTC, dll.)" },
    ],

    cliSetupTitle: "Persediaan CLI",
    cliSetupDesc: "Pertama, sediakan alkanes-cli dan cipta dompet:",

    regtestSetupTitle: "Persekitaran Regtest",
    regtestSetupDesc: "Mulakan persekitaran regtest tempatan untuk ujian:",

    walletSetupTitle: "Persediaan Dompet",
    walletSetupDesc: "Cipta dan danai dompet untuk penempatan:",

    deployCommandTitle: "Arahan Tempatkan",
    deployCommandDesc: "Gunakan arahan alkanes execute dengan envelope untuk menempatkan WASM:",

    protostoneTitle: "Format Protostone",
    protostoneDesc: "Format protostone ialah: [block,tx,opcode,...args]:output0:output1",
    protostoneExamples: [
      { example: "[3,1000,0]:v0:v0", desc: "Tempatkan WASM ke [4, 1000], panggil opcode 0 (initialize)" },
      { example: "[6,1000,0,arg1,arg2]:v0:v0", desc: "Klon dari [4, 1000], hantar args ke opcode 0" },
      { example: "[2,0,77]:v0:v0", desc: "Panggil opcode 77 (mint) pada DIESEL [2,0]" },
      { example: "[4,65522,0]:v0:v0", desc: "Panggil opcode 0 pada kilang di [4, 65522]" },
    ],

    deployTemplateTitle: "Menempatkan Templat",
    deployTemplateDesc: "Tempatkan kontrak sebagai templat kilang di [4, tx]:",

    cloningTitle: "Mengklon dari Templat",
    cloningDesc: "Cipta instance dari templat menggunakan [6, template_tx]:",

    initializationTitle: "Permulaan Kontrak",
    initializationDesc: "Kebanyakan kontrak memerlukan permulaan selepas penempatan:",

    mintingDieselTitle: "Mencetak DIESEL",
    mintingDieselDesc: "Lombong token DIESEL dengan memanggil opcode 77 pada [2,0]:",

    wrappingBtcTitle: "Membungkus BTC kepada frBTC",
    wrappingBtcDesc: "Tukar BTC kepada frBTC menggunakan arahan wrap-btc:",

    poolCreationTitle: "Mencipta Kolam AMM",
    poolCreationDesc: "Cipta kolam kecairan menggunakan init-pool:",

    swapTitle: "Melakukan Pertukaran",
    swapDesc: "Tukar token melalui kolam AMM:",

    simulateTitle: "Mensimulasikan Panggilan",
    simulateDesc: "Uji panggilan tanpa penyiaran menggunakan simulate:",

    verifyDeploymentTitle: "Mengesahkan Penempatan",
    verifyDeploymentDesc: "Semak bahawa kontrak ditempatkan dengan betul:",

    mainnetTitle: "Penempatan Mainnet",
    mainnetDesc: "Untuk penempatan mainnet, tukar bendera rangkaian:",
    mainnetWarnings: [
      "Uji dengan teliti pada regtest dahulu",
      "Gunakan kadar yuran yang lebih tinggi untuk pengesahan lebih cepat",
      "Simpan kata laluan dompet dengan selamat",
      "Sahkan bytecode kontrak sebelum menempatkan",
      "Pertimbangkan untuk menggunakan multisig untuk operasi pentadbir",
    ],

    troubleshootingTitle: "Penyelesaian Masalah",
    troubleshooting: [
      { issue: "UTXO tidak ditemui", solution: "Tunggu pengindeks disegerakkan atau lombong lebih banyak blok" },
      { issue: "Bytecode tidak ditemui", solution: "Semak tx penempatan disahkan, tunggu pengindeks" },
      { issue: "Sudah dimulakan", solution: "Kontrak sudah dimulakan - ini dijangka" },
      { issue: "Dana tidak mencukupi", solution: "Lombong lebih banyak blok ke alamat dompet anda" },
      { issue: "Token pengesahan diperlukan", solution: "Sertakan token pengesahan dengan bendera --inputs" },
    ],

    exampleScriptTitle: "Skrip Penempatan Lengkap",
    exampleScriptDesc: "Berikut adalah skrip lengkap untuk menempatkan kontrak token:",

    nextStepsTitle: "Langkah Seterusnya",
    nextSteps: [
      { text: "Bina Token", href: "/docs/tutorials/token", desc: "Tutorial token" },
      { text: "Bina AMM", href: "/docs/tutorials/amm", desc: "Tutorial AMM" },
      { text: "Rujukan CLI", href: "/docs/cli", desc: "Dokumentasi CLI penuh" },
    ],
  },
  vi: {
    title: "Hướng Dẫn Triển Khai",
    subtitle: "Triển khai và tương tác với hợp đồng thông minh Alkanes trên regtest và mainnet",
    intro: "Hướng dẫn này bao gồm việc triển khai hợp đồng Alkanes bằng alkanes-cli. Bạn sẽ học các mẫu triển khai, lệnh CLI và cách tương tác với hợp đồng đã triển khai.",

    patternsTitle: "Các Mẫu Triển Khai",
    patternsDesc: "Alkanes sử dụng các mẫu cellpack cụ thể cho các hoạt động triển khai khác nhau:",
    patterns: [
      { pattern: "[3, tx]", desc: "Triển khai WASM vào slot factory [4, tx] - sử dụng cho template và factory" },
      { pattern: "[6, tx]", desc: "Sao chép từ template [4, tx] đến [2, n] có sẵn tiếp theo" },
      { pattern: "[1, 0]", desc: "Triển khai qua CREATE đến [2, n] có sẵn tiếp theo" },
    ],

    alkaneIdRangesTitle: "Phạm Vi AlkaneId",
    alkaneIdRangesDesc: "Các tiền tố block khác nhau chỉ ra các loại hợp đồng khác nhau:",
    alkaneIdRanges: [
      { range: "[2, n]", desc: "Hợp đồng triển khai thông thường (CREATE hoặc CLONE)" },
      { range: "[4, n]", desc: "Template factory - triển khai qua [3, n]" },
      { range: "[6, n]", desc: "Hoạt động sao chép (chỉ định template để sao chép)" },
      { range: "[32, n]", desc: "Hợp đồng genesis (frBTC, v.v.)" },
      { range: "[31, n]", desc: "Hợp đồng hệ thống (ftrBTC, v.v.)" },
    ],

    cliSetupTitle: "Thiết Lập CLI",
    cliSetupDesc: "Đầu tiên, thiết lập alkanes-cli và tạo ví:",

    regtestSetupTitle: "Môi Trường Regtest",
    regtestSetupDesc: "Khởi động môi trường regtest cục bộ để kiểm thử:",

    walletSetupTitle: "Thiết Lập Ví",
    walletSetupDesc: "Tạo và nạp tiền vào ví để triển khai:",

    deployCommandTitle: "Lệnh Triển Khai",
    deployCommandDesc: "Sử dụng lệnh alkanes execute với envelope để triển khai WASM:",

    protostoneTitle: "Định Dạng Protostone",
    protostoneDesc: "Định dạng protostone là: [block,tx,opcode,...args]:output0:output1",
    protostoneExamples: [
      { example: "[3,1000,0]:v0:v0", desc: "Triển khai WASM vào [4, 1000], gọi opcode 0 (initialize)" },
      { example: "[6,1000,0,arg1,arg2]:v0:v0", desc: "Sao chép từ [4, 1000], truyền args cho opcode 0" },
      { example: "[2,0,77]:v0:v0", desc: "Gọi opcode 77 (mint) trên DIESEL [2,0]" },
      { example: "[4,65522,0]:v0:v0", desc: "Gọi opcode 0 trên factory tại [4, 65522]" },
    ],

    deployTemplateTitle: "Triển Khai Template",
    deployTemplateDesc: "Triển khai hợp đồng như một template factory tại [4, tx]:",

    cloningTitle: "Sao Chép Từ Template",
    cloningDesc: "Tạo instance từ template sử dụng [6, template_tx]:",

    initializationTitle: "Khởi Tạo Hợp Đồng",
    initializationDesc: "Hầu hết các hợp đồng cần khởi tạo sau khi triển khai:",

    mintingDieselTitle: "Đúc DIESEL",
    mintingDieselDesc: "Khai thác token DIESEL bằng cách gọi opcode 77 trên [2,0]:",

    wrappingBtcTitle: "Bọc BTC thành frBTC",
    wrappingBtcDesc: "Chuyển đổi BTC thành frBTC bằng lệnh wrap-btc:",

    poolCreationTitle: "Tạo Pool AMM",
    poolCreationDesc: "Tạo pool thanh khoản bằng init-pool:",

    swapTitle: "Thực Hiện Swap",
    swapDesc: "Hoán đổi token qua pool AMM:",

    simulateTitle: "Mô Phỏng Lời Gọi",
    simulateDesc: "Kiểm thử lời gọi mà không phát sóng bằng simulate:",

    verifyDeploymentTitle: "Xác Minh Triển Khai",
    verifyDeploymentDesc: "Kiểm tra xem hợp đồng đã được triển khai đúng chưa:",

    mainnetTitle: "Triển Khai Mainnet",
    mainnetDesc: "Để triển khai mainnet, thay đổi cờ mạng:",
    mainnetWarnings: [
      "Kiểm thử kỹ lưỡng trên regtest trước",
      "Sử dụng tỷ lệ phí cao hơn để xác nhận nhanh hơn",
      "Giữ an toàn mật khẩu ví",
      "Xác minh bytecode hợp đồng trước khi triển khai",
      "Cân nhắc sử dụng multisig cho các hoạt động quản trị",
    ],

    troubleshootingTitle: "Khắc Phục Sự Cố",
    troubleshooting: [
      { issue: "Không tìm thấy UTXO", solution: "Đợi indexer đồng bộ hoặc khai thác thêm block" },
      { issue: "Không tìm thấy bytecode", solution: "Kiểm tra tx triển khai đã xác nhận, đợi indexer" },
      { issue: "Đã được khởi tạo", solution: "Hợp đồng đã khởi tạo - điều này mong đợi" },
      { issue: "Không đủ tiền", solution: "Khai thác thêm block đến địa chỉ ví của bạn" },
      { issue: "Yêu cầu token xác thực", solution: "Bao gồm token xác thực với cờ --inputs" },
    ],

    exampleScriptTitle: "Script Triển Khai Hoàn Chỉnh",
    exampleScriptDesc: "Đây là script hoàn chỉnh để triển khai hợp đồng token:",

    nextStepsTitle: "Các Bước Tiếp Theo",
    nextSteps: [
      { text: "Xây Dựng Token", href: "/docs/tutorials/token", desc: "Hướng dẫn token" },
      { text: "Xây Dựng AMM", href: "/docs/tutorials/amm", desc: "Hướng dẫn AMM" },
      { text: "Tài Liệu CLI", href: "/docs/cli", desc: "Tài liệu CLI đầy đủ" },
    ],
  },
  ko: {
    title: "배포 가이드",
    subtitle: "regtest 및 메인넷에서 Alkanes 스마트 컨트랙트 배포 및 상호작용",
    intro: "이 가이드는 alkanes-cli를 사용한 Alkanes 컨트랙트 배포를 다룹니다. 배포 패턴, CLI 명령 및 배포된 컨트랙트와 상호작용하는 방법을 배웁니다.",

    patternsTitle: "배포 패턴",
    patternsDesc: "Alkanes는 다양한 배포 작업에 특정 cellpack 패턴을 사용합니다:",
    patterns: [
      { pattern: "[3, tx]", desc: "WASM을 팩토리 슬롯 [4, tx]에 배포 - 템플릿 및 팩토리용" },
      { pattern: "[6, tx]", desc: "템플릿 [4, tx]에서 다음 사용 가능한 [2, n]으로 복제" },
      { pattern: "[1, 0]", desc: "CREATE를 통해 다음 사용 가능한 [2, n]으로 배포" },
    ],

    alkaneIdRangesTitle: "AlkaneId 범위",
    alkaneIdRangesDesc: "다른 블록 접두사는 다른 컨트랙트 유형을 나타냅니다:",
    alkaneIdRanges: [
      { range: "[2, n]", desc: "일반 배포된 컨트랙트 (CREATE 또는 CLONE)" },
      { range: "[4, n]", desc: "팩토리 템플릿 - [3, n]을 통해 배포됨" },
      { range: "[6, n]", desc: "복제 작업 (복제할 템플릿 지정)" },
      { range: "[32, n]", desc: "제네시스 컨트랙트 (frBTC 등)" },
      { range: "[31, n]", desc: "시스템 컨트랙트 (ftrBTC 등)" },
    ],

    cliSetupTitle: "CLI 설정",
    cliSetupDesc: "먼저 alkanes-cli를 설정하고 지갑을 생성합니다:",

    regtestSetupTitle: "Regtest 환경",
    regtestSetupDesc: "테스트를 위한 로컬 regtest 환경 시작:",

    walletSetupTitle: "지갑 설정",
    walletSetupDesc: "배포를 위한 지갑 생성 및 자금 조달:",

    deployCommandTitle: "배포 명령",
    deployCommandDesc: "envelope와 함께 alkanes execute 명령을 사용하여 WASM 배포:",

    protostoneTitle: "Protostone 형식",
    protostoneDesc: "protostone 형식: [block,tx,opcode,...args]:output0:output1",
    protostoneExamples: [
      { example: "[3,1000,0]:v0:v0", desc: "WASM을 [4, 1000]에 배포, opcode 0 (initialize) 호출" },
      { example: "[6,1000,0,arg1,arg2]:v0:v0", desc: "[4, 1000]에서 복제, opcode 0에 인자 전달" },
      { example: "[2,0,77]:v0:v0", desc: "DIESEL [2,0]에서 opcode 77 (mint) 호출" },
      { example: "[4,65522,0]:v0:v0", desc: "[4, 65522]의 팩토리에서 opcode 0 호출" },
    ],

    deployTemplateTitle: "템플릿 배포",
    deployTemplateDesc: "컨트랙트를 [4, tx]의 팩토리 템플릿으로 배포:",

    cloningTitle: "템플릿에서 복제",
    cloningDesc: "[6, template_tx]를 사용하여 템플릿에서 인스턴스 생성:",

    initializationTitle: "컨트랙트 초기화",
    initializationDesc: "대부분의 컨트랙트는 배포 후 초기화가 필요합니다:",

    mintingDieselTitle: "DIESEL 발행",
    mintingDieselDesc: "[2,0]에서 opcode 77을 호출하여 DIESEL 토큰 채굴:",

    wrappingBtcTitle: "BTC를 frBTC로 래핑",
    wrappingBtcDesc: "wrap-btc 명령을 사용하여 BTC를 frBTC로 변환:",

    poolCreationTitle: "AMM 풀 생성",
    poolCreationDesc: "init-pool을 사용하여 유동성 풀 생성:",

    swapTitle: "스왑 수행",
    swapDesc: "AMM 풀을 통해 토큰 스왑:",

    simulateTitle: "호출 시뮬레이션",
    simulateDesc: "simulate를 사용하여 브로드캐스트 없이 호출 테스트:",

    verifyDeploymentTitle: "배포 검증",
    verifyDeploymentDesc: "컨트랙트가 올바르게 배포되었는지 확인:",

    mainnetTitle: "메인넷 배포",
    mainnetDesc: "메인넷 배포의 경우 네트워크 플래그를 변경:",
    mainnetWarnings: [
      "먼저 regtest에서 철저히 테스트",
      "더 빠른 확인을 위해 더 높은 수수료율 사용",
      "지갑 암호를 안전하게 보관",
      "배포 전에 컨트랙트 바이트코드 확인",
      "관리 작업에 멀티시그 사용 고려",
    ],

    troubleshootingTitle: "문제 해결",
    troubleshooting: [
      { issue: "UTXO를 찾을 수 없음", solution: "인덱서 동기화 대기 또는 더 많은 블록 채굴" },
      { issue: "바이트코드를 찾을 수 없음", solution: "배포 tx 확인 확인, 인덱서 대기" },
      { issue: "이미 초기화됨", solution: "컨트랙트가 이미 초기화됨 - 예상된 동작" },
      { issue: "자금 부족", solution: "지갑 주소로 더 많은 블록 채굴" },
      { issue: "인증 토큰 필요", solution: "--inputs 플래그로 인증 토큰 포함" },
    ],

    exampleScriptTitle: "전체 배포 스크립트",
    exampleScriptDesc: "토큰 컨트랙트를 배포하는 전체 스크립트:",

    nextStepsTitle: "다음 단계",
    nextSteps: [
      { text: "토큰 구축", href: "/docs/tutorials/token", desc: "토큰 튜토리얼" },
      { text: "AMM 구축", href: "/docs/tutorials/amm", desc: "AMM 튜토리얼" },
      { text: "CLI 참조", href: "/docs/cli", desc: "전체 CLI 문서" },
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

export default function DeploymentPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-sm text-[color:var(--sf-primary)] mb-4">{t.subtitle}</p>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      {/* Deployment Patterns */}
      <Section title={t.patternsTitle} id="patterns">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.patternsDesc}</p>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-[color:var(--sf-outline)] rounded-lg">
            <thead className="bg-[color:var(--sf-surface)]">
              <tr>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Pattern</th>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Description</th>
              </tr>
            </thead>
            <tbody>
              {t.patterns.map((item, i) => (
                <tr key={i} className="border-t border-[color:var(--sf-outline)]">
                  <td className="p-3 font-mono text-[color:var(--sf-primary)]">{item.pattern}</td>
                  <td className="p-3 text-[color:var(--sf-muted)]">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* AlkaneId Ranges */}
      <Section title={t.alkaneIdRangesTitle} id="ranges">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.alkaneIdRangesDesc}</p>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-[color:var(--sf-outline)] rounded-lg">
            <thead className="bg-[color:var(--sf-surface)]">
              <tr>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Range</th>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Description</th>
              </tr>
            </thead>
            <tbody>
              {t.alkaneIdRanges.map((item, i) => (
                <tr key={i} className="border-t border-[color:var(--sf-outline)]">
                  <td className="p-3 font-mono text-[color:var(--sf-primary)]">{item.range}</td>
                  <td className="p-3 text-[color:var(--sf-muted)]">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* CLI Setup */}
      <Section title={t.cliSetupTitle} id="cli-setup">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.cliSetupDesc}</p>
        <CodeBlock>{`# Build alkanes-cli from source
cd alkanes-rs
cargo build --release -p alkanes-cli

# Add to PATH
export PATH="$PATH:$(pwd)/target/release"

# Verify installation
alkanes-cli --help`}</CodeBlock>
      </Section>

      {/* Regtest Setup */}
      <Section title={t.regtestSetupTitle} id="regtest">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.regtestSetupDesc}</p>
        <CodeBlock>{`# Clone alkanes-rs if you haven't
git clone https://github.com/kungfuflex/alkanes-rs.git
cd alkanes-rs

# Start regtest node with Docker
docker-compose up -d

# Wait for services to start
sleep 10

# Check if node is running
curl -s http://127.0.0.1:18888 | head -c 100

# Check metashrew indexer height
curl -X POST http://127.0.0.1:18888 \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"metashrew_height","params":[],"id":1}'`}</CodeBlock>
      </Section>

      {/* Wallet Setup */}
      <Section title={t.walletSetupTitle} id="wallet">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.walletSetupDesc}</p>
        <CodeBlock>{`# Create a new wallet
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-secure-passphrase" \\
  wallet create

# Mine 400 blocks to fund wallet (regtest only)
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-secure-passphrase" \\
  bitcoind generatetoaddress 400 "p2tr:0"

# Check balance
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-secure-passphrase" \\
  wallet balance

# List UTXOs
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-secure-passphrase" \\
  wallet utxos p2tr:0`}</CodeBlock>
      </Section>

      {/* Protostone Format */}
      <Section title={t.protostoneTitle} id="protostone">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.protostoneDesc}</p>
        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-[color:var(--sf-outline)] rounded-lg">
            <thead className="bg-[color:var(--sf-surface)]">
              <tr>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Example</th>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Description</th>
              </tr>
            </thead>
            <tbody>
              {t.protostoneExamples.map((item, i) => (
                <tr key={i} className="border-t border-[color:var(--sf-outline)]">
                  <td className="p-3 font-mono text-[color:var(--sf-primary)]">{item.example}</td>
                  <td className="p-3 text-[color:var(--sf-muted)]">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CodeBlock language="text">{`Protostone Format: [block,tx,opcode,...args]:output0:output1

Components:
- block,tx: Target AlkaneId (3 for deploy, 6 for clone, 4 for call)
- opcode: The function to call (0 = initialize, etc.)
- ...args: Additional arguments as u128 values
- :output0:output1: Where to send outputs (v0 = vout 0, etc.)`}</CodeBlock>
      </Section>

      {/* Deploy Template */}
      <Section title={t.deployTemplateTitle} id="deploy-template">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.deployTemplateDesc}</p>
        <CodeBlock>{`# Deploy WASM to [4, 1000] as a template
# Use [3, target_tx] to specify the slot
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-secure-passphrase" \\
  alkanes execute "[3,1000,0]:v0:v0" \\
  --envelope ./target/wasm32-unknown-unknown/release/my_token.wasm \\
  --from p2tr:0 \\
  --fee-rate 1 \\
  --mine \\
  -y

# Verify deployment
alkanes-cli -p regtest alkanes getbytecode "4:1000"

# The bytecode should return non-empty if deployment succeeded`}</CodeBlock>
      </Section>

      {/* Cloning */}
      <Section title={t.cloningTitle} id="cloning">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.cloningDesc}</p>
        <CodeBlock>{`# Clone from template [4, 1000] with initialization args
# This creates a new instance at the next available [2, n]
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-secure-passphrase" \\
  alkanes execute "[6,1000,0,1000000000]:v0:v0" \\
  --from p2tr:0 \\
  --fee-rate 1 \\
  --mine \\
  -y

# Parameters:
# - 6: Clone operation
# - 1000: Template at [4, 1000]
# - 0: Opcode (initialize)
# - 1000000000: Initial supply argument

# The new instance will be at [2, sequence]
# Check logs or use alkanes list to find the new ID`}</CodeBlock>
      </Section>

      {/* Initialization */}
      <Section title={t.initializationTitle} id="initialization">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.initializationDesc}</p>
        <CodeBlock>{`# Initialize a contract at [4, 65522] (e.g., AMM Factory)
# Call opcode 0 with initialization parameters
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-secure-passphrase" \\
  alkanes execute "[4,65522,0,780993,4,65523]:v0:v0" \\
  --from p2tr:0 \\
  --inputs 2:1:1 \\
  --fee-rate 1 \\
  --mine \\
  -y

# Parameters:
# - 4,65522: Target contract (factory proxy)
# - 0: Initialize opcode
# - 780993: Pool beacon proxy tx
# - 4,65523: Pool upgradeable beacon ID
# --inputs 2:1:1: Include 1 unit of auth token [2:1]`}</CodeBlock>
      </Section>

      {/* Minting DIESEL */}
      <Section title={t.mintingDieselTitle} id="mint-diesel">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.mintingDieselDesc}</p>
        <CodeBlock>{`# Mint DIESEL by calling opcode 77 on [2,0]
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-secure-passphrase" \\
  alkanes execute "[2,0,77]:v0:v0" \\
  --to p2tr:0 \\
  --from p2tr:0 \\
  --mine \\
  --change p2tr:0 \\
  -y

# DIESEL minting follows Bitcoin's emission schedule
# Rewards decrease over time similar to BTC halving`}</CodeBlock>
      </Section>

      {/* Wrapping BTC */}
      <Section title={t.wrappingBtcTitle} id="wrap-btc">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.wrappingBtcDesc}</p>
        <CodeBlock>{`# Wrap 1 BTC (100000000 sats) to frBTC
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-secure-passphrase" \\
  alkanes wrap-btc \\
  100000000 \\
  --to p2tr:0 \\
  --from p2tr:0 \\
  --mine \\
  --change p2tr:0 \\
  -y

# frBTC will be credited at [32, 0]
# The wrapped BTC is held in the protocol`}</CodeBlock>
      </Section>

      {/* Pool Creation */}
      <Section title={t.poolCreationTitle} id="create-pool">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.poolCreationDesc}</p>
        <CodeBlock>{`# Create a DIESEL/frBTC liquidity pool
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-secure-passphrase" \\
  alkanes init-pool \\
  --pair "2:0,32:0" \\
  --liquidity "300000000:50000" \\
  --to p2tr:0 \\
  --from p2tr:0 \\
  --mine \\
  --change p2tr:0 \\
  --factory "4:65522" \\
  -y

# Parameters:
# --pair: Token pair (DIESEL [2:0], frBTC [32:0])
# --liquidity: Initial liquidity amounts
# --factory: AMM factory contract ID`}</CodeBlock>
      </Section>

      {/* Swap */}
      <Section title={t.swapTitle} id="swap">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.swapDesc}</p>
        <CodeBlock>{`# Swap DIESEL for frBTC through a pool
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-secure-passphrase" \\
  alkanes swap \\
  --pool "2:12345" \\
  --amount-in "1000000" \\
  --token-in "2:0" \\
  --min-out "900" \\
  --to p2tr:0 \\
  --from p2tr:0 \\
  --mine \\
  -y

# Parameters:
# --pool: Pool contract ID
# --amount-in: Amount of input token
# --token-in: Input token ID (DIESEL)
# --min-out: Minimum output (slippage protection)`}</CodeBlock>
      </Section>

      {/* Simulate */}
      <Section title={t.simulateTitle} id="simulate">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.simulateDesc}</p>
        <CodeBlock>{`# Simulate a call to get contract state
alkanes-cli -p regtest \\
  alkanes simulate "2:0:101"

# This calls opcode 101 (GetTotalSupply) on DIESEL
# Returns the total supply without making a transaction

# Simulate pool reserves query
alkanes-cli -p regtest \\
  alkanes simulate "2:12345:97"

# Returns reserve0 and reserve1 as bytes

# Simulate with trace for debugging
alkanes-cli -p regtest \\
  alkanes simulate "4:1000:99" --trace`}</CodeBlock>
      </Section>

      {/* Verify Deployment */}
      <Section title={t.verifyDeploymentTitle} id="verify">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.verifyDeploymentDesc}</p>
        <CodeBlock>{`# Check bytecode exists
alkanes-cli -p regtest alkanes getbytecode "4:1000"

# Get contract name (opcode 99)
alkanes-cli -p regtest alkanes simulate "4:1000:99"

# Get total supply (opcode 101)
alkanes-cli -p regtest alkanes simulate "4:1000:101"

# List all alkanes for an address
alkanes-cli -p regtest \\
  --wallet-file ~/.alkanes/wallet.json \\
  --passphrase "your-secure-passphrase" \\
  alkanes getbalance`}</CodeBlock>
      </Section>

      {/* Mainnet */}
      <Section title={t.mainnetTitle} id="mainnet">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.mainnetDesc}</p>

        <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-600 mb-4">
          <h4 className="font-semibold text-yellow-400 mb-2">Mainnet Warnings</h4>
          <ul className="list-disc list-inside space-y-1 text-[color:var(--sf-muted)]">
            {t.mainnetWarnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </div>

        <CodeBlock>{`# Deploy to mainnet
alkanes-cli -p mainnet \\
  --jsonrpc-url "https://mainnet.subfrost.io/v4/jsonrpc" \\
  --wallet-file ~/.alkanes/mainnet-wallet.json \\
  --passphrase "your-secure-passphrase" \\
  alkanes execute "[3,1000,0]:v0:v0" \\
  --envelope ./my_contract.wasm \\
  --from p2tr:0 \\
  --fee-rate 10 \\
  -y

# Key differences from regtest:
# - Use -p mainnet
# - Set proper --jsonrpc-url for mainnet
# - Use appropriate fee rates (check mempool.space)
# - No --mine flag (wait for real confirmations)
# - Ensure wallet has real BTC`}</CodeBlock>
      </Section>

      {/* Troubleshooting */}
      <Section title={t.troubleshootingTitle} id="troubleshooting">
        <div className="space-y-3">
          {t.troubleshooting.map((item, i) => (
            <div key={i} className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
              <h4 className="font-semibold text-red-400 mb-1">{item.issue}</h4>
              <p className="text-sm text-[color:var(--sf-muted)]">{item.solution}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Example Script */}
      <Section title={t.exampleScriptTitle} id="example-script">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.exampleScriptDesc}</p>
        <CodeBlock title="deploy-token.sh">{`#!/bin/bash

# Configuration
WALLET_FILE="$HOME/.alkanes/wallet.json"
PASSPHRASE="your-secure-passphrase"
WASM_FILE="./target/wasm32-unknown-unknown/release/my_token.wasm"
TARGET_TX=1000  # Will deploy to [4, 1000]

# Common CLI options
CLI_OPTS="-p regtest --wallet-file $WALLET_FILE --passphrase $PASSPHRASE"

echo "Building contract..."
cargo build --release --target wasm32-unknown-unknown

echo "Deploying to [4, $TARGET_TX]..."
alkanes-cli $CLI_OPTS \\
  alkanes execute "[3,$TARGET_TX,0]:v0:v0" \\
  --envelope "$WASM_FILE" \\
  --from p2tr:0 \\
  --fee-rate 1 \\
  --mine \\
  -y

echo "Waiting for indexer..."
sleep 5

echo "Verifying deployment..."
BYTECODE=$(alkanes-cli -p regtest alkanes getbytecode "4:$TARGET_TX")

if [ -n "$BYTECODE" ] && [ "$BYTECODE" != "null" ]; then
  echo "Success! Contract deployed to [4, $TARGET_TX]"

  # Get contract name
  echo "Contract name:"
  alkanes-cli -p regtest alkanes simulate "4:$TARGET_TX:99"
else
  echo "Error: Deployment failed"
  exit 1
fi`}</CodeBlock>
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
