"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Testing Contracts",
    subtitle: "Test your Alkanes smart contracts before deployment",
    intro: "Testing Alkanes contracts involves both unit tests in Rust and integration tests using the CLI simulator. This guide covers testing strategies, test utilities, and best practices.",

    approachesTitle: "Testing Approaches",
    approachesDesc: "There are three main approaches to testing Alkanes contracts:",
    approaches: [
      {
        title: "CLI Simulation",
        desc: "Use alkanes-cli simulate to test contract calls without deploying. Fast feedback loop for testing opcodes and state changes."
      },
      {
        title: "Regtest Integration",
        desc: "Deploy to a local regtest environment and test actual on-chain behavior. Required for testing transaction flows and token transfers."
      },
      {
        title: "Unit Tests",
        desc: "Test individual functions in isolation using Rust's #[test] framework. Good for testing pure logic and edge cases."
      }
    ],

    simulatorTitle: "Using the CLI Simulator",
    simulatorDesc: "The alkanes-cli simulate command lets you test contract calls without creating transactions:",

    simulatorExamplesTitle: "Simulation Examples",
    simulatorExamples: [
      { desc: "Query a token name (opcode 99):", cmd: 'alkanes-cli -p regtest simulate 2:100:99' },
      { desc: "Query token balance for an address:", cmd: 'alkanes-cli -p regtest simulate 2:100:103 --args "bcrt1q..."' },
      { desc: "Simulate with trace for debugging:", cmd: 'alkanes-cli -p regtest simulate 2:100:99 --trace' },
      { desc: "Test genesis alkane (subfrost public key):", cmd: 'alkanes-cli -p regtest simulate 32:0:103' }
    ],

    regtestTitle: "Regtest Integration Testing",
    regtestDesc: "For full integration tests, deploy contracts to regtest and execute real transactions:",

    traceTitle: "Debugging with Traces",
    traceDesc: "The --trace flag provides detailed execution traces for debugging:",
    traceFeatures: [
      "Call stack showing contract-to-contract calls",
      "Gas consumption at each step",
      "Storage reads and writes",
      "Return values and error messages"
    ],

    unitTestsTitle: "Rust Unit Tests",
    unitTestsDesc: "Test pure functions and logic in isolation using standard Rust tests:",

    testUtilsTitle: "Test Utilities",
    testUtilsDesc: "The alkanes-rs codebase provides test helpers in crates/alkanes/src/tests/helpers.rs:",
    testUtils: [
      { name: "init_with_multiple_cellpacks", desc: "Create a test block with multiple contract deployments" },
      { name: "create_cellpack_with_witness", desc: "Build a transaction with WASM payload" },
      { name: "assert_binary_deployed_to_id", desc: "Verify contract was deployed to expected AlkaneId" },
      { name: "get_sheet_for_outpoint", desc: "Get balance sheet for a specific UTXO" },
      { name: "assert_return_context", desc: "Assert the contract returned expected data" },
      { name: "assert_revert_context", desc: "Assert the contract reverted with expected error" }
    ],

    mockProviderTitle: "Mock Provider for CLI Tests",
    mockProviderDesc: "For testing CLI operations without a live node, use MockProvider:",

    balanceTestTitle: "Testing Token Balances",
    balanceTestDesc: "Verify token balances after transactions:",

    traceTestTitle: "Testing with Trace Events",
    traceTestDesc: "Assert on specific trace events for detailed verification:",

    ciTitle: "CI/CD Integration",
    ciDesc: "Run tests in your CI pipeline:",

    bestPracticesTitle: "Testing Best Practices",
    bestPractices: [
      {
        title: "Test edge cases",
        desc: "Test zero amounts, max values, empty strings, unauthorized callers"
      },
      {
        title: "Test error paths",
        desc: "Verify your contract reverts with appropriate messages for invalid inputs"
      },
      {
        title: "Test authorization",
        desc: "Ensure only authorized callers can execute privileged operations"
      },
      {
        title: "Test storage limits",
        desc: "Verify behavior when approaching storage limits or with large data"
      },
      {
        title: "Use simulation first",
        desc: "Test with simulate before deploying to catch errors early"
      },
      {
        title: "Test multi-call sequences",
        desc: "Verify state is consistent across multiple contract calls"
      }
    ],

    nextStepsTitle: "Next Steps",
    nextSteps: [
      { text: "Deployment Guide", href: "/docs/contracts/deployment", desc: "Deploy to regtest or mainnet" },
      { text: "Storage & State", href: "/docs/contracts/storage", desc: "Understand contract storage" },
      { text: "Build a Token", href: "/docs/tutorials/token", desc: "Full token tutorial" }
    ]
  },
  zh: {
    title: "测试合约",
    subtitle: "在部署前测试您的 Alkanes 智能合约",
    intro: "测试 Alkanes 合约包括 Rust 中的单元测试和使用 CLI 模拟器的集成测试。本指南涵盖测试策略、测试工具和最佳实践。",

    approachesTitle: "测试方法",
    approachesDesc: "测试 Alkanes 合约有三种主要方法：",
    approaches: [
      {
        title: "CLI 模拟",
        desc: "使用 alkanes-cli simulate 测试合约调用而无需部署。快速反馈循环用于测试操作码和状态变化。"
      },
      {
        title: "Regtest 集成",
        desc: "部署到本地 regtest 环境并测试实际链上行为。需要用于测试交易流程和代币转账。"
      },
      {
        title: "单元测试",
        desc: "使用 Rust 的 #[test] 框架独立测试单个函数。适合测试纯逻辑和边界情况。"
      }
    ],

    simulatorTitle: "使用 CLI 模拟器",
    simulatorDesc: "alkanes-cli simulate 命令让您无需创建交易即可测试合约调用：",

    simulatorExamplesTitle: "模拟示例",
    simulatorExamples: [
      { desc: "查询代币名称（操作码 99）：", cmd: 'alkanes-cli -p regtest simulate 2:100:99' },
      { desc: "查询地址的代币余额：", cmd: 'alkanes-cli -p regtest simulate 2:100:103 --args "bcrt1q..."' },
      { desc: "带跟踪的模拟用于调试：", cmd: 'alkanes-cli -p regtest simulate 2:100:99 --trace' },
      { desc: "测试创世 alkane（subfrost 公钥）：", cmd: 'alkanes-cli -p regtest simulate 32:0:103' }
    ],

    regtestTitle: "Regtest 集成测试",
    regtestDesc: "对于完整的集成测试，将合约部署到 regtest 并执行实际交易：",

    traceTitle: "使用跟踪调试",
    traceDesc: "--trace 标志提供详细的执行跟踪用于调试：",
    traceFeatures: [
      "显示合约间调用的调用栈",
      "每一步的 gas 消耗",
      "存储读取和写入",
      "返回值和错误消息"
    ],

    unitTestsTitle: "Rust 单元测试",
    unitTestsDesc: "使用标准 Rust 测试独立测试纯函数和逻辑：",

    testUtilsTitle: "测试工具",
    testUtilsDesc: "alkanes-rs 代码库在 crates/alkanes/src/tests/helpers.rs 中提供测试辅助函数：",
    testUtils: [
      { name: "init_with_multiple_cellpacks", desc: "创建包含多个合约部署的测试区块" },
      { name: "create_cellpack_with_witness", desc: "构建带有 WASM 载荷的交易" },
      { name: "assert_binary_deployed_to_id", desc: "验证合约已部署到预期的 AlkaneId" },
      { name: "get_sheet_for_outpoint", desc: "获取特定 UTXO 的余额表" },
      { name: "assert_return_context", desc: "断言合约返回了预期数据" },
      { name: "assert_revert_context", desc: "断言合约以预期错误回滚" }
    ],

    mockProviderTitle: "CLI 测试的 Mock Provider",
    mockProviderDesc: "对于无需实时节点的 CLI 操作测试，使用 MockProvider：",

    balanceTestTitle: "测试代币余额",
    balanceTestDesc: "验证交易后的代币余额：",

    traceTestTitle: "使用跟踪事件测试",
    traceTestDesc: "对特定跟踪事件进行断言以进行详细验证：",

    ciTitle: "CI/CD 集成",
    ciDesc: "在 CI 流水线中运行测试：",

    bestPracticesTitle: "测试最佳实践",
    bestPractices: [
      {
        title: "测试边界情况",
        desc: "测试零值、最大值、空字符串、未授权调用者"
      },
      {
        title: "测试错误路径",
        desc: "验证您的合约对无效输入返回适当的错误消息"
      },
      {
        title: "测试授权",
        desc: "确保只有授权的调用者才能执行特权操作"
      },
      {
        title: "测试存储限制",
        desc: "验证接近存储限制或处理大数据时的行为"
      },
      {
        title: "先使用模拟",
        desc: "在部署前使用 simulate 测试以尽早发现错误"
      },
      {
        title: "测试多调用序列",
        desc: "验证跨多个合约调用的状态一致性"
      }
    ],

    nextStepsTitle: "下一步",
    nextSteps: [
      { text: "部署指南", href: "/docs/contracts/deployment", desc: "部署到 regtest 或主网" },
      { text: "存储和状态", href: "/docs/contracts/storage", desc: "理解合约存储" },
      { text: "构建代币", href: "/docs/tutorials/token", desc: "完整代币教程" }
    ]
  },
  ms: {
    title: "Menguji Kontrak",
    subtitle: "Uji kontrak pintar Alkanes anda sebelum penempatan",
    intro: "Menguji kontrak Alkanes melibatkan ujian unit dalam Rust dan ujian integrasi menggunakan simulator CLI. Panduan ini merangkumi strategi ujian, utiliti ujian, dan amalan terbaik.",

    approachesTitle: "Pendekatan Ujian",
    approachesDesc: "Terdapat tiga pendekatan utama untuk menguji kontrak Alkanes:",
    approaches: [
      {
        title: "Simulasi CLI",
        desc: "Gunakan alkanes-cli simulate untuk menguji panggilan kontrak tanpa penempatan. Gelung maklum balas pantas untuk menguji opcode dan perubahan keadaan."
      },
      {
        title: "Integrasi Regtest",
        desc: "Tempatkan ke persekitaran regtest tempatan dan uji tingkah laku on-chain sebenar. Diperlukan untuk menguji aliran transaksi dan pemindahan token."
      },
      {
        title: "Ujian Unit",
        desc: "Uji fungsi individu secara berasingan menggunakan rangka kerja #[test] Rust. Baik untuk menguji logik tulen dan kes sempadan."
      }
    ],

    simulatorTitle: "Menggunakan Simulator CLI",
    simulatorDesc: "Arahan alkanes-cli simulate membolehkan anda menguji panggilan kontrak tanpa mencipta transaksi:",

    simulatorExamplesTitle: "Contoh Simulasi",
    simulatorExamples: [
      { desc: "Tanya nama token (opcode 99):", cmd: 'alkanes-cli -p regtest simulate 2:100:99' },
      { desc: "Tanya baki token untuk alamat:", cmd: 'alkanes-cli -p regtest simulate 2:100:103 --args "bcrt1q..."' },
      { desc: "Simulasi dengan jejak untuk nyahpepijat:", cmd: 'alkanes-cli -p regtest simulate 2:100:99 --trace' },
      { desc: "Uji alkane genesis (kunci awam subfrost):", cmd: 'alkanes-cli -p regtest simulate 32:0:103' }
    ],

    regtestTitle: "Ujian Integrasi Regtest",
    regtestDesc: "Untuk ujian integrasi penuh, tempatkan kontrak ke regtest dan laksanakan transaksi sebenar:",

    traceTitle: "Nyahpepijat dengan Jejak",
    traceDesc: "Bendera --trace menyediakan jejak pelaksanaan terperinci untuk nyahpepijat:",
    traceFeatures: [
      "Tindanan panggilan yang menunjukkan panggilan kontrak ke kontrak",
      "Penggunaan gas pada setiap langkah",
      "Bacaan dan penulisan penyimpanan",
      "Nilai pulangan dan mesej ralat"
    ],

    unitTestsTitle: "Ujian Unit Rust",
    unitTestsDesc: "Uji fungsi tulen dan logik secara berasingan menggunakan ujian Rust standard:",

    testUtilsTitle: "Utiliti Ujian",
    testUtilsDesc: "Kod asas alkanes-rs menyediakan pembantu ujian dalam crates/alkanes/src/tests/helpers.rs:",
    testUtils: [
      { name: "init_with_multiple_cellpacks", desc: "Cipta blok ujian dengan pelbagai penempatan kontrak" },
      { name: "create_cellpack_with_witness", desc: "Bina transaksi dengan muatan WASM" },
      { name: "assert_binary_deployed_to_id", desc: "Sahkan kontrak telah ditempatkan ke AlkaneId yang dijangka" },
      { name: "get_sheet_for_outpoint", desc: "Dapatkan helaian baki untuk UTXO tertentu" },
      { name: "assert_return_context", desc: "Tegaskan kontrak mengembalikan data yang dijangka" },
      { name: "assert_revert_context", desc: "Tegaskan kontrak dikembalikan dengan ralat yang dijangka" }
    ],

    mockProviderTitle: "Mock Provider untuk Ujian CLI",
    mockProviderDesc: "Untuk menguji operasi CLI tanpa nod langsung, gunakan MockProvider:",

    balanceTestTitle: "Menguji Baki Token",
    balanceTestDesc: "Sahkan baki token selepas transaksi:",

    traceTestTitle: "Menguji dengan Acara Jejak",
    traceTestDesc: "Tegaskan pada acara jejak tertentu untuk pengesahan terperinci:",

    ciTitle: "Integrasi CI/CD",
    ciDesc: "Jalankan ujian dalam pipeline CI anda:",

    bestPracticesTitle: "Amalan Terbaik Ujian",
    bestPractices: [
      {
        title: "Uji kes sempadan",
        desc: "Uji jumlah sifar, nilai maksimum, string kosong, pemanggil tidak dibenarkan"
      },
      {
        title: "Uji laluan ralat",
        desc: "Sahkan kontrak anda dikembalikan dengan mesej yang sesuai untuk input tidak sah"
      },
      {
        title: "Uji kebenaran",
        desc: "Pastikan hanya pemanggil yang dibenarkan boleh melaksanakan operasi istimewa"
      },
      {
        title: "Uji had penyimpanan",
        desc: "Sahkan tingkah laku semasa menghampiri had penyimpanan atau dengan data besar"
      },
      {
        title: "Gunakan simulasi dahulu",
        desc: "Uji dengan simulate sebelum penempatan untuk menangkap ralat awal"
      },
      {
        title: "Uji urutan panggilan berbilang",
        desc: "Sahkan keadaan konsisten merentasi pelbagai panggilan kontrak"
      }
    ],

    nextStepsTitle: "Langkah Seterusnya",
    nextSteps: [
      { text: "Panduan Penempatan", href: "/docs/contracts/deployment", desc: "Tempatkan ke regtest atau mainnet" },
      { text: "Penyimpanan & Keadaan", href: "/docs/contracts/storage", desc: "Fahami penyimpanan kontrak" },
      { text: "Bina Token", href: "/docs/tutorials/token", desc: "Tutorial token penuh" }
    ]
  },
  vi: {
    title: "Kiểm Thử Hợp Đồng",
    subtitle: "Kiểm thử hợp đồng thông minh Alkanes của bạn trước khi triển khai",
    intro: "Kiểm thử hợp đồng Alkanes bao gồm cả kiểm thử đơn vị trong Rust và kiểm thử tích hợp sử dụng trình mô phỏng CLI. Hướng dẫn này bao gồm các chiến lược kiểm thử, tiện ích kiểm thử và thực hành tốt nhất.",

    approachesTitle: "Các Phương Pháp Kiểm Thử",
    approachesDesc: "Có ba phương pháp chính để kiểm thử hợp đồng Alkanes:",
    approaches: [
      {
        title: "Mô Phỏng CLI",
        desc: "Sử dụng alkanes-cli simulate để kiểm thử các lời gọi hợp đồng mà không cần triển khai. Vòng phản hồi nhanh để kiểm thử opcode và thay đổi trạng thái."
      },
      {
        title: "Tích Hợp Regtest",
        desc: "Triển khai lên môi trường regtest cục bộ và kiểm thử hành vi on-chain thực tế. Cần thiết để kiểm thử luồng giao dịch và chuyển token."
      },
      {
        title: "Kiểm Thử Đơn Vị",
        desc: "Kiểm thử các hàm riêng lẻ độc lập bằng framework #[test] của Rust. Tốt để kiểm thử logic thuần và các trường hợp biên."
      }
    ],

    simulatorTitle: "Sử Dụng Trình Mô Phỏng CLI",
    simulatorDesc: "Lệnh alkanes-cli simulate cho phép bạn kiểm thử các lời gọi hợp đồng mà không tạo giao dịch:",

    simulatorExamplesTitle: "Ví Dụ Mô Phỏng",
    simulatorExamples: [
      { desc: "Truy vấn tên token (opcode 99):", cmd: 'alkanes-cli -p regtest simulate 2:100:99' },
      { desc: "Truy vấn số dư token cho một địa chỉ:", cmd: 'alkanes-cli -p regtest simulate 2:100:103 --args "bcrt1q..."' },
      { desc: "Mô phỏng với trace để gỡ lỗi:", cmd: 'alkanes-cli -p regtest simulate 2:100:99 --trace' },
      { desc: "Kiểm thử alkane genesis (khóa công khai subfrost):", cmd: 'alkanes-cli -p regtest simulate 32:0:103' }
    ],

    regtestTitle: "Kiểm Thử Tích Hợp Regtest",
    regtestDesc: "Để kiểm thử tích hợp đầy đủ, triển khai hợp đồng lên regtest và thực thi các giao dịch thực:",

    traceTitle: "Gỡ Lỗi Với Trace",
    traceDesc: "Flag --trace cung cấp trace thực thi chi tiết để gỡ lỗi:",
    traceFeatures: [
      "Call stack hiển thị các lời gọi hợp đồng-đến-hợp đồng",
      "Tiêu thụ gas tại mỗi bước",
      "Đọc và ghi storage",
      "Giá trị trả về và thông báo lỗi"
    ],

    unitTestsTitle: "Kiểm Thử Đơn Vị Rust",
    unitTestsDesc: "Kiểm thử các hàm thuần và logic độc lập bằng kiểm thử Rust chuẩn:",

    testUtilsTitle: "Tiện Ích Kiểm Thử",
    testUtilsDesc: "Codebase alkanes-rs cung cấp các helper kiểm thử trong crates/alkanes/src/tests/helpers.rs:",
    testUtils: [
      { name: "init_with_multiple_cellpacks", desc: "Tạo khối kiểm thử với nhiều triển khai hợp đồng" },
      { name: "create_cellpack_with_witness", desc: "Xây dựng giao dịch với payload WASM" },
      { name: "assert_binary_deployed_to_id", desc: "Xác minh hợp đồng đã được triển khai đến AlkaneId mong đợi" },
      { name: "get_sheet_for_outpoint", desc: "Lấy bảng cân đối cho UTXO cụ thể" },
      { name: "assert_return_context", desc: "Khẳng định hợp đồng trả về dữ liệu mong đợi" },
      { name: "assert_revert_context", desc: "Khẳng định hợp đồng hoàn nguyên với lỗi mong đợi" }
    ],

    mockProviderTitle: "Mock Provider Cho Kiểm Thử CLI",
    mockProviderDesc: "Để kiểm thử các hoạt động CLI mà không cần node trực tiếp, sử dụng MockProvider:",

    balanceTestTitle: "Kiểm Thử Số Dư Token",
    balanceTestDesc: "Xác minh số dư token sau giao dịch:",

    traceTestTitle: "Kiểm Thử Với Sự Kiện Trace",
    traceTestDesc: "Khẳng định trên các sự kiện trace cụ thể để xác minh chi tiết:",

    ciTitle: "Tích Hợp CI/CD",
    ciDesc: "Chạy kiểm thử trong pipeline CI của bạn:",

    bestPracticesTitle: "Thực Hành Tốt Nhất Về Kiểm Thử",
    bestPractices: [
      {
        title: "Kiểm thử các trường hợp biên",
        desc: "Kiểm thử số lượng bằng 0, giá trị tối đa, chuỗi rỗng, người gọi không được ủy quyền"
      },
      {
        title: "Kiểm thử các đường dẫn lỗi",
        desc: "Xác minh hợp đồng của bạn hoàn nguyên với thông báo phù hợp cho đầu vào không hợp lệ"
      },
      {
        title: "Kiểm thử ủy quyền",
        desc: "Đảm bảo chỉ người gọi được ủy quyền mới có thể thực thi các hoạt động đặc quyền"
      },
      {
        title: "Kiểm thử giới hạn storage",
        desc: "Xác minh hành vi khi gần đến giới hạn storage hoặc với dữ liệu lớn"
      },
      {
        title: "Sử dụng mô phỏng trước",
        desc: "Kiểm thử với simulate trước khi triển khai để phát hiện lỗi sớm"
      },
      {
        title: "Kiểm thử chuỗi đa lời gọi",
        desc: "Xác minh trạng thái nhất quán qua nhiều lời gọi hợp đồng"
      }
    ],

    nextStepsTitle: "Các Bước Tiếp Theo",
    nextSteps: [
      { text: "Hướng Dẫn Triển Khai", href: "/docs/contracts/deployment", desc: "Triển khai lên regtest hoặc mainnet" },
      { text: "Lưu Trữ & Trạng Thái", href: "/docs/contracts/storage", desc: "Hiểu storage của hợp đồng" },
      { text: "Xây Dựng Token", href: "/docs/tutorials/token", desc: "Hướng dẫn token đầy đủ" }
    ]
  },
  ko: {
    title: "컨트랙트 테스트",
    subtitle: "배포 전에 Alkanes 스마트 컨트랙트 테스트하기",
    intro: "Alkanes 컨트랙트 테스트는 Rust의 단위 테스트와 CLI 시뮬레이터를 사용한 통합 테스트를 모두 포함합니다. 이 가이드는 테스트 전략, 테스트 유틸리티 및 모범 사례를 다룹니다.",

    approachesTitle: "테스트 접근법",
    approachesDesc: "Alkanes 컨트랙트를 테스트하는 세 가지 주요 접근법이 있습니다:",
    approaches: [
      {
        title: "CLI 시뮬레이션",
        desc: "alkanes-cli simulate를 사용하여 배포 없이 컨트랙트 호출을 테스트합니다. opcode 및 상태 변경을 테스트하기 위한 빠른 피드백 루프."
      },
      {
        title: "Regtest 통합",
        desc: "로컬 regtest 환경에 배포하고 실제 온체인 동작을 테스트합니다. 트랜잭션 플로우 및 토큰 전송 테스트에 필요."
      },
      {
        title: "단위 테스트",
        desc: "Rust의 #[test] 프레임워크를 사용하여 개별 함수를 독립적으로 테스트합니다. 순수 로직 및 엣지 케이스 테스트에 적합."
      }
    ],

    simulatorTitle: "CLI 시뮬레이터 사용",
    simulatorDesc: "alkanes-cli simulate 명령을 사용하면 트랜잭션을 생성하지 않고 컨트랙트 호출을 테스트할 수 있습니다:",

    simulatorExamplesTitle: "시뮬레이션 예제",
    simulatorExamples: [
      { desc: "토큰 이름 조회 (opcode 99):", cmd: 'alkanes-cli -p regtest simulate 2:100:99' },
      { desc: "주소의 토큰 잔액 조회:", cmd: 'alkanes-cli -p regtest simulate 2:100:103 --args "bcrt1q..."' },
      { desc: "디버깅을 위한 trace와 함께 시뮬레이션:", cmd: 'alkanes-cli -p regtest simulate 2:100:99 --trace' },
      { desc: "제네시스 alkane 테스트 (subfrost 공개키):", cmd: 'alkanes-cli -p regtest simulate 32:0:103' }
    ],

    regtestTitle: "Regtest 통합 테스트",
    regtestDesc: "전체 통합 테스트를 위해 컨트랙트를 regtest에 배포하고 실제 트랜잭션을 실행합니다:",

    traceTitle: "Trace로 디버깅",
    traceDesc: "--trace 플래그는 디버깅을 위한 상세한 실행 추적을 제공합니다:",
    traceFeatures: [
      "컨트랙트 간 호출을 보여주는 호출 스택",
      "각 단계의 가스 소비",
      "스토리지 읽기 및 쓰기",
      "반환 값 및 오류 메시지"
    ],

    unitTestsTitle: "Rust 단위 테스트",
    unitTestsDesc: "표준 Rust 테스트를 사용하여 순수 함수와 로직을 독립적으로 테스트:",

    testUtilsTitle: "테스트 유틸리티",
    testUtilsDesc: "alkanes-rs 코드베이스는 crates/alkanes/src/tests/helpers.rs에 테스트 헬퍼를 제공합니다:",
    testUtils: [
      { name: "init_with_multiple_cellpacks", desc: "여러 컨트랙트 배포가 포함된 테스트 블록 생성" },
      { name: "create_cellpack_with_witness", desc: "WASM 페이로드가 포함된 트랜잭션 구축" },
      { name: "assert_binary_deployed_to_id", desc: "예상된 AlkaneId로 컨트랙트가 배포되었는지 검증" },
      { name: "get_sheet_for_outpoint", desc: "특정 UTXO의 잔액 시트 가져오기" },
      { name: "assert_return_context", desc: "컨트랙트가 예상 데이터를 반환했는지 단언" },
      { name: "assert_revert_context", desc: "컨트랙트가 예상 오류로 되돌려졌는지 단언" }
    ],

    mockProviderTitle: "CLI 테스트를 위한 Mock Provider",
    mockProviderDesc: "라이브 노드 없이 CLI 작업을 테스트하려면 MockProvider를 사용하세요:",

    balanceTestTitle: "토큰 잔액 테스트",
    balanceTestDesc: "트랜잭션 후 토큰 잔액 확인:",

    traceTestTitle: "Trace 이벤트로 테스트",
    traceTestDesc: "상세한 검증을 위해 특정 trace 이벤트에 대해 단언:",

    ciTitle: "CI/CD 통합",
    ciDesc: "CI 파이프라인에서 테스트 실행:",

    bestPracticesTitle: "테스트 모범 사례",
    bestPractices: [
      {
        title: "엣지 케이스 테스트",
        desc: "0 값, 최대값, 빈 문자열, 권한 없는 호출자 테스트"
      },
      {
        title: "오류 경로 테스트",
        desc: "잘못된 입력에 대해 컨트랙트가 적절한 메시지로 되돌려지는지 확인"
      },
      {
        title: "권한 테스트",
        desc: "권한이 있는 호출자만 특권 작업을 실행할 수 있는지 확인"
      },
      {
        title: "스토리지 제한 테스트",
        desc: "스토리지 제한에 가까워지거나 큰 데이터로 작업할 때의 동작 확인"
      },
      {
        title: "시뮬레이션 먼저 사용",
        desc: "배포 전에 simulate로 테스트하여 오류를 조기에 포착"
      },
      {
        title: "다중 호출 시퀀스 테스트",
        desc: "여러 컨트랙트 호출에 걸쳐 상태가 일관된지 확인"
      }
    ],

    nextStepsTitle: "다음 단계",
    nextSteps: [
      { text: "배포 가이드", href: "/docs/contracts/deployment", desc: "regtest 또는 메인넷에 배포" },
      { text: "스토리지 및 상태", href: "/docs/contracts/storage", desc: "컨트랙트 스토리지 이해" },
      { text: "토큰 구축", href: "/docs/tutorials/token", desc: "전체 토큰 튜토리얼" }
    ]
  }
};

function CodeBlock({ children, title, language = "rust" }: { children: string; title?: string; language?: string }) {
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

export default function TestingPage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-sm text-[color:var(--sf-primary)] mb-4">{t.subtitle}</p>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      {/* Testing Approaches */}
      <Section title={t.approachesTitle} id="approaches">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.approachesDesc}</p>
        <div className="grid gap-4 md:grid-cols-3">
          {t.approaches.map((approach, i) => (
            <div key={i} className="p-4 rounded-lg border border-[color:var(--sf-outline)]">
              <h4 className="font-semibold text-[color:var(--sf-text)] mb-2">{approach.title}</h4>
              <p className="text-sm text-[color:var(--sf-muted)]">{approach.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CLI Simulator */}
      <Section title={t.simulatorTitle} id="simulator">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.simulatorDesc}</p>
        <CodeBlock language="bash">{`# Simulate syntax: alkanes-cli simulate <alkane_id>:<opcode> [--args "..."]
# alkane_id format: block:tx (e.g., 2:100 for deployed contract)

# Basic simulation - call opcode 99 on contract 2:100
alkanes-cli -p regtest simulate 2:100:99

# Simulation with arguments
alkanes-cli -p regtest simulate 2:100:103 --args "bcrt1q..."

# Simulation with detailed trace
alkanes-cli -p regtest simulate 2:100:99 --trace

# Simulation returning raw bytes
alkanes-cli -p regtest simulate 2:100:99 --raw`}</CodeBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">{t.simulatorExamplesTitle}</h3>
        {t.simulatorExamples.map((ex, i) => (
          <div key={i} className="mb-4">
            <p className="text-sm text-[color:var(--sf-muted)] mb-1">{ex.desc}</p>
            <CodeBlock language="bash">{ex.cmd}</CodeBlock>
          </div>
        ))}
      </Section>

      {/* Regtest Integration */}
      <Section title={t.regtestTitle} id="regtest">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.regtestDesc}</p>
        <CodeBlock language="bash" title="test-token.sh">{`#!/bin/bash
set -e

WALLET="--wallet-file ~/.alkanes/wallet.json --passphrase test"
NETWORK="-p regtest"

# 1. Deploy the token contract
echo "Deploying token contract..."
alkanes-cli $NETWORK $WALLET alkanes deploy \\
  --wasm ./target/wasm32-unknown-unknown/release/my_token.wasm \\
  --cellpack "[3,0]:100:0" \\
  --auto-confirm

# Mine a block to confirm
alkanes-cli $NETWORK $WALLET bitcoind generatetoaddress 1 "p2tr:0"

# 2. Simulate to verify deployment
echo "Verifying deployment..."
NAME=$(alkanes-cli $NETWORK simulate 4:1:99)
echo "Token name: $NAME"

# 3. Test mint operation
echo "Testing mint..."
alkanes-cli $NETWORK $WALLET alkanes execute \\
  --to "[4,1]:1" \\
  --cellpack "[4,1]:1000000:p2tr:0" \\
  --auto-confirm

alkanes-cli $NETWORK $WALLET bitcoind generatetoaddress 1 "p2tr:0"

# 4. Verify balance
echo "Checking balance..."
BALANCE=$(alkanes-cli $NETWORK simulate 4:1:103 --args "$(alkanes-cli $NETWORK wallet address)")
echo "Balance: $BALANCE"

# 5. Test transfer
echo "Testing transfer..."
alkanes-cli $NETWORK $WALLET alkanes execute \\
  --inputs "4:1:500000" \\
  --cellpack "[4,1]:500000:bcrt1q...recipient" \\
  --auto-confirm

echo "All tests passed!"`}</CodeBlock>
      </Section>

      {/* Debugging with Traces */}
      <Section title={t.traceTitle} id="traces">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.traceDesc}</p>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)] mb-4">
          {t.traceFeatures.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
        <CodeBlock language="text" title="Example trace output">{`[TRACE] alkanes-cli simulate 2:100:1 --trace --args "1000"

CallContext {
  target: AlkaneId { block: 2, tx: 100 },
  opcode: 1,
  incoming_alkanes: [],
  args: [0x03e8]  // 1000 in hex
}

[0] CALL to 2:100 opcode=1
    fuel: 100000000

[1] STORAGE_READ key="/balances/caller"
    value: 5000000

[2] STORAGE_WRITE key="/balances/caller"
    old: 5000000
    new: 5001000

[3] STORAGE_WRITE key="/total_supply"
    old: 10000000
    new: 10001000

ReturnContext {
  success: true,
  data: [],
  fuel_remaining: 99998500,
  alkanes_returned: []
}`}</CodeBlock>
      </Section>

      {/* Unit Tests */}
      <Section title={t.unitTestsTitle} id="unit-tests">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.unitTestsDesc}</p>
        <CodeBlock title="src/lib.rs">{`#[cfg(test)]
mod tests {
    use super::*;

    // Test pure functions that don't need the runtime
    #[test]
    fn test_amount_calculation() {
        // Test fee calculation logic
        let amount = 1000u128;
        let fee_bps = 30u128; // 0.3%
        let fee = (amount * fee_bps) / 10000;
        assert_eq!(fee, 3);
    }

    #[test]
    fn test_price_impact() {
        // Test AMM price calculation
        let reserve_a = 1000000u128;
        let reserve_b = 1000000u128;
        let amount_in = 10000u128;

        // With 0.3% fee
        let amount_in_with_fee = amount_in * 997;
        let numerator = amount_in_with_fee * reserve_b;
        let denominator = reserve_a * 1000 + amount_in_with_fee;
        let amount_out = numerator / denominator;

        assert!(amount_out < amount_in); // Should get less due to fees
        assert_eq!(amount_out, 9870); // Expected output
    }

    #[test]
    fn test_storage_key_generation() {
        // Test that storage keys are generated correctly
        use metashrew_support::index_pointer::KeyValuePointer;

        let ptr = StoragePointer::from_keyword("/balances/");
        let key = ptr.select(b"user1").keyword();

        assert!(key.starts_with(b"/balances/"));
    }

    #[test]
    #[should_panic(expected = "overflow")]
    fn test_overflow_protection() {
        let max = u128::MAX;
        let result = max.checked_add(1).expect("overflow");
    }
}`}</CodeBlock>
      </Section>

      {/* Test Utilities */}
      <Section title={t.testUtilsTitle} id="test-utils">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.testUtilsDesc}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[color:var(--sf-outline)]">
                <th className="text-left py-2 pr-4">Function</th>
                <th className="text-left py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {t.testUtils.map((util, i) => (
                <tr key={i} className="border-b border-[color:var(--sf-outline)]">
                  <td className="py-2 pr-4 font-mono text-[color:var(--sf-primary)]">{util.name}</td>
                  <td className="py-2 text-[color:var(--sf-muted)]">{util.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Mock Provider */}
      <Section title={t.mockProviderTitle} id="mock-provider">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.mockProviderDesc}</p>
        <CodeBlock title="tests/mock_test.rs">{`use alkanes_cli_common::mock_provider::MockProvider;
use alkanes_cli_common::traits::{AlkanesProvider, WalletProvider};
use bitcoin::{Amount, Network, OutPoint, TxOut};

#[tokio::test]
async fn test_with_mock_provider() -> anyhow::Result<()> {
    // Create mock provider for regtest
    let mut provider = MockProvider::new(Network::Regtest);

    // Create mock UTXOs
    let txid = bitcoin::Txid::from_str(
        "8a6465187b53d05405f49851a13d44a1e95b2803835b132145540c89a70af83d"
    )?;
    let outpoint = OutPoint::new(txid, 0);

    let address = WalletProvider::get_address(&provider).await?;
    let script_pubkey = address.script_pubkey();

    // Add a 1 BTC UTXO
    provider.utxos.lock().unwrap().push((
        outpoint,
        TxOut {
            value: Amount::from_sat(100_000_000),
            script_pubkey: script_pubkey.clone(),
        }
    ));

    // Set up alkane balances
    use alkanes_cli_common::alkanes::protorunes::*;
    use std::collections::HashMap;

    let mut balances = HashMap::new();
    balances.insert(
        AlkaneId { block: 2, tx: 1 },
        5u128  // 5 units of alkane 2:1
    );

    provider.set_protorunes_response(
        txid.to_string(),
        0,
        ProtoruneOutpointResponse {
            outpoint: outpoint.to_string(),
            balance_sheet: BalanceSheet {
                cached: Balances { balances },
            },
        },
    );

    // Now test operations against the mock
    // ...

    Ok(())
}`}</CodeBlock>
      </Section>

      {/* Balance Testing */}
      <Section title={t.balanceTestTitle} id="balance-test">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.balanceTestDesc}</p>
        <CodeBlock>{`use crate::tests::helpers::*;
use alkanes_support::id::AlkaneId;
use protorune_support::balance_sheet::BalanceSheet;

#[test]
fn test_token_balance_after_mint() -> anyhow::Result<()> {
    clear();  // Reset test state

    // Create test block with deploy + mint
    let wasm = get_token_wasm();
    let deploy_cellpack = Cellpack::new(vec![3, 0], vec![100, 0]);  // Deploy
    let mint_cellpack = Cellpack::new(vec![4, 1], vec![1, 1000000]);  // Mint 1M

    let test_block = init_with_cellpack_pairs(vec![
        BinaryAndCellpack::new(wasm, deploy_cellpack),
        BinaryAndCellpack::cellpack_only(mint_cellpack),
    ]);

    // Index the block
    index_block(&test_block)?;

    // Check balance at output 0 of last tx
    let sheet = get_last_outpoint_sheet(&test_block)?;
    let token_id = AlkaneId { block: 4, tx: 1 };

    assert_eq!(
        sheet.get(&token_id.into()),
        Some(&1000000u128),
        "Should have 1M tokens"
    );

    Ok(())
}`}</CodeBlock>
      </Section>

      {/* Trace Event Testing */}
      <Section title={t.traceTestTitle} id="trace-test">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.traceTestDesc}</p>
        <CodeBlock>{`use crate::tests::helpers::*;
use alkanes_support::trace::TraceResponse;

#[test]
fn test_contract_returns_expected_data() -> anyhow::Result<()> {
    clear();

    // Deploy and call contract
    let test_block = setup_test_contract()?;
    index_block(&test_block)?;

    // Get the outpoint we want to check
    let outpoint = OutPoint {
        txid: test_block.txdata.last().unwrap().compute_txid(),
        vout: 0,
    };

    // Assert the contract returned "MyToken"
    assert_return_context(&outpoint, |response: TraceResponse| {
        let name = String::from_utf8(response.inner.data.clone())?;
        assert_eq!(name, "MyToken");
        Ok(())
    })?;

    Ok(())
}

#[test]
fn test_unauthorized_call_reverts() -> anyhow::Result<()> {
    clear();

    // Try to call admin function without authorization
    let test_block = setup_unauthorized_call()?;
    index_block(&test_block)?;

    let outpoint = OutPoint {
        txid: test_block.txdata.last().unwrap().compute_txid(),
        vout: 0,
    };

    // Assert the contract reverted with expected message
    assert_revert_context(&outpoint, "unauthorized")?;

    Ok(())
}`}</CodeBlock>
      </Section>

      {/* CI/CD */}
      <Section title={t.ciTitle} id="ci">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.ciDesc}</p>
        <CodeBlock language="yaml" title=".github/workflows/test.yml">{`name: Test Contracts

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install Rust
        uses: dtolnay/rust-action@stable
        with:
          targets: wasm32-unknown-unknown

      - name: Run unit tests
        run: cargo test --lib

      - name: Build WASM contracts
        run: cargo build --release --target wasm32-unknown-unknown

      - name: Start regtest environment
        run: |
          docker-compose up -d
          sleep 30  # Wait for services

      - name: Run integration tests
        run: |
          cargo build --release -p alkanes-cli
          export PATH="$PATH:$(pwd)/target/release"
          ./scripts/run-tests.sh

      - name: Stop regtest
        if: always()
        run: docker-compose down`}</CodeBlock>
      </Section>

      {/* Best Practices */}
      <Section title={t.bestPracticesTitle} id="best-practices">
        <div className="grid gap-4 md:grid-cols-2">
          {t.bestPractices.map((practice, i) => (
            <div key={i} className="p-4 rounded-lg border border-[color:var(--sf-outline)]">
              <h4 className="font-semibold text-[color:var(--sf-text)] mb-2">{practice.title}</h4>
              <p className="text-sm text-[color:var(--sf-muted)]">{practice.desc}</p>
            </div>
          ))}
        </div>
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
