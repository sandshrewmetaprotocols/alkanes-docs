"use client";

import { useLocale } from "next-intl";

const content = {
  en: {
    title: "Storage & State Management",
    subtitle: "Patterns for persisting data in Alkanes smart contracts",
    intro: "Alkanes contracts store state using key-value storage accessed through StoragePointer. This guide covers storage patterns from simple values to complex data structures.",

    basicsTitle: "Storage Basics",
    basicsDesc: "All contract state is stored in a key-value store. The StoragePointer type provides a convenient API for reading and writing values.",

    storagePointerTitle: "StoragePointer API",
    storagePointerDesc: "StoragePointer wraps a key path and provides methods for reading/writing values:",

    primitiveTypesTitle: "Storing Primitive Types",
    primitiveTypesDesc: "Use get_value/set_value for types that implement byte serialization:",
    primitiveTypes: [
      { type: "u128", note: "Most common - token amounts, counts, etc." },
      { type: "u64", note: "Timestamps, heights" },
      { type: "u32", note: "Smaller counters, block timestamps" },
      { type: "u8", note: "Flags, small enums" },
      { type: "bool", note: "Via u8 (0 = false, 1 = true)" },
    ],

    stringsTitle: "Storing Strings",
    stringsDesc: "Store strings as raw bytes using Arc<Vec<u8>>:",

    alkaneIdTitle: "Storing AlkaneId",
    alkaneIdDesc: "AlkaneId can be converted to/from Vec<u8>:",

    hierarchicalTitle: "Hierarchical Storage",
    hierarchicalDesc: "Use .select() to create nested storage namespaces:",

    mappingTitle: "Mapping Pattern",
    mappingDesc: "Create key-value mappings by combining base paths with keys:",

    initializationTitle: "Initialization Pattern",
    initializationDesc: "Use observe_initialization() to ensure a contract is only initialized once:",

    poolStorageTitle: "Real-World Example: AMM Pool",
    poolStorageDesc: "Here's how an AMM pool manages multiple storage values:",

    customTypesTitle: "Custom Storable Types",
    customTypesDesc: "For complex types, implement byte serialization manually:",

    storagePathsTitle: "Storage Path Conventions",
    storagePathsDesc: "Follow these conventions for consistent storage layout:",
    storagePaths: [
      { path: "/initialized", desc: "Contract initialization flag" },
      { path: "/name", desc: "Token/contract name" },
      { path: "/symbol", desc: "Token symbol" },
      { path: "/totalsupply", desc: "Total supply for tokens" },
      { path: "/auth", desc: "Auth token AlkaneId for authenticated contracts" },
      { path: "/owner", desc: "Owner address or AlkaneId" },
      { path: "/balances/{addr}", desc: "User balances (mapping pattern)" },
      { path: "/allowances/{owner}/{spender}", desc: "Token allowances" },
      { path: "/seen/{hash}", desc: "Prevent replay attacks" },
    ],

    bestPracticesTitle: "Best Practices",
    bestPractices: [
      { title: "Use descriptive paths", desc: "Path names should be self-documenting: /reserves/token0 not /r/0" },
      { title: "Prefix with slash", desc: "Always start paths with / for consistency" },
      { title: "Group related data", desc: "Use hierarchical paths: /pool/reserves, /pool/fees" },
      { title: "Consider key size", desc: "Short paths save storage but be descriptive enough" },
      { title: "Handle missing values", desc: "get() returns empty Vec for missing keys - check length" },
      { title: "Use checked arithmetic", desc: "Always use checked_add/checked_sub for amounts" },
    ],

    readBeforeWriteTitle: "Read-Modify-Write Pattern",
    readBeforeWriteDesc: "When modifying values, always read first then write the new value:",

    nextStepsTitle: "Next Steps",
    nextSteps: [
      { text: "Build a Token", href: "/docs/tutorials/token", desc: "Apply storage patterns" },
      { text: "Testing Guide", href: "/docs/contracts/testing", desc: "Test your storage logic" },
      { text: "Deployment", href: "/docs/contracts/deployment", desc: "Deploy your contract" },
    ],
  },
  zh: {
    title: "存储与状态管理",
    subtitle: "在 Alkanes 智能合约中持久化数据的模式",
    intro: "Alkanes 合约通过 StoragePointer 访问键值存储来保存状态。本指南涵盖从简单值到复杂数据结构的存储模式。",

    basicsTitle: "存储基础",
    basicsDesc: "所有合约状态都存储在键值存储中。StoragePointer 类型提供了便捷的读写 API。",

    storagePointerTitle: "StoragePointer API",
    storagePointerDesc: "StoragePointer 包装一个键路径并提供读写方法：",

    primitiveTypesTitle: "存储原始类型",
    primitiveTypesDesc: "对于实现字节序列化的类型使用 get_value/set_value：",
    primitiveTypes: [
      { type: "u128", note: "最常用 - 代币数量、计数等" },
      { type: "u64", note: "时间戳、高度" },
      { type: "u32", note: "较小的计数器、区块时间戳" },
      { type: "u8", note: "标志、小型枚举" },
      { type: "bool", note: "通过 u8（0 = false, 1 = true）" },
    ],

    stringsTitle: "存储字符串",
    stringsDesc: "使用 Arc<Vec<u8>> 将字符串存储为原始字节：",

    alkaneIdTitle: "存储 AlkaneId",
    alkaneIdDesc: "AlkaneId 可以与 Vec<u8> 相互转换：",

    hierarchicalTitle: "层级存储",
    hierarchicalDesc: "使用 .select() 创建嵌套存储命名空间：",

    mappingTitle: "映射模式",
    mappingDesc: "通过组合基本路径和键来创建键值映射：",

    initializationTitle: "初始化模式",
    initializationDesc: "使用 observe_initialization() 确保合约只初始化一次：",

    poolStorageTitle: "实际示例：AMM 池",
    poolStorageDesc: "AMM 池如何管理多个存储值：",

    customTypesTitle: "自定义可存储类型",
    customTypesDesc: "对于复杂类型，手动实现字节序列化：",

    storagePathsTitle: "存储路径约定",
    storagePathsDesc: "遵循这些约定以保持一致的存储布局：",
    storagePaths: [
      { path: "/initialized", desc: "合约初始化标志" },
      { path: "/name", desc: "代币/合约名称" },
      { path: "/symbol", desc: "代币符号" },
      { path: "/totalsupply", desc: "代币总供应量" },
      { path: "/auth", desc: "认证合约的认证代币 AlkaneId" },
      { path: "/owner", desc: "所有者地址或 AlkaneId" },
      { path: "/balances/{addr}", desc: "用户余额（映射模式）" },
      { path: "/allowances/{owner}/{spender}", desc: "代币授权额度" },
      { path: "/seen/{hash}", desc: "防止重放攻击" },
    ],

    bestPracticesTitle: "最佳实践",
    bestPractices: [
      { title: "使用描述性路径", desc: "路径名应自文档化：使用 /reserves/token0 而非 /r/0" },
      { title: "以斜杠开头", desc: "为保持一致性，路径始终以 / 开头" },
      { title: "分组相关数据", desc: "使用层级路径：/pool/reserves, /pool/fees" },
      { title: "考虑键大小", desc: "短路径节省存储，但要足够描述性" },
      { title: "处理缺失值", desc: "get() 对缺失键返回空 Vec - 检查长度" },
      { title: "使用安全算术", desc: "金额计算始终使用 checked_add/checked_sub" },
    ],

    readBeforeWriteTitle: "读取-修改-写入模式",
    readBeforeWriteDesc: "修改值时，始终先读取然后写入新值：",

    nextStepsTitle: "下一步",
    nextSteps: [
      { text: "构建代币", href: "/docs/tutorials/token", desc: "应用存储模式" },
      { text: "测试指南", href: "/docs/contracts/testing", desc: "测试存储逻辑" },
      { text: "部署", href: "/docs/contracts/deployment", desc: "部署合约" },
    ],
  },
  ms: {
    title: "Penyimpanan & Pengurusan Keadaan",
    subtitle: "Corak untuk menyimpan data dalam kontrak pintar Alkanes",
    intro: "Kontrak Alkanes menyimpan keadaan menggunakan penyimpanan kunci-nilai yang diakses melalui StoragePointer. Panduan ini merangkumi corak penyimpanan dari nilai mudah hingga struktur data yang kompleks.",

    basicsTitle: "Asas Penyimpanan",
    basicsDesc: "Semua keadaan kontrak disimpan dalam penyimpanan kunci-nilai. Jenis StoragePointer menyediakan API yang mudah untuk membaca dan menulis nilai.",

    storagePointerTitle: "API StoragePointer",
    storagePointerDesc: "StoragePointer membungkus laluan kunci dan menyediakan kaedah untuk membaca/menulis nilai:",

    primitiveTypesTitle: "Menyimpan Jenis Primitif",
    primitiveTypesDesc: "Gunakan get_value/set_value untuk jenis yang melaksanakan penserilan byte:",
    primitiveTypes: [
      { type: "u128", note: "Paling biasa - jumlah token, kiraan, dll." },
      { type: "u64", note: "Cap masa, ketinggian" },
      { type: "u32", note: "Pembilang yang lebih kecil, cap masa blok" },
      { type: "u8", note: "Bendera, enum kecil" },
      { type: "bool", note: "Melalui u8 (0 = false, 1 = true)" },
    ],

    stringsTitle: "Menyimpan String",
    stringsDesc: "Simpan string sebagai byte mentah menggunakan Arc<Vec<u8>>:",

    alkaneIdTitle: "Menyimpan AlkaneId",
    alkaneIdDesc: "AlkaneId boleh ditukar ke/dari Vec<u8>:",

    hierarchicalTitle: "Penyimpanan Hierarki",
    hierarchicalDesc: "Gunakan .select() untuk mencipta ruang nama penyimpanan bersarang:",

    mappingTitle: "Corak Pemetaan",
    mappingDesc: "Cipta pemetaan kunci-nilai dengan menggabungkan laluan asas dengan kunci:",

    initializationTitle: "Corak Permulaan",
    initializationDesc: "Gunakan observe_initialization() untuk memastikan kontrak hanya dimulakan sekali:",

    poolStorageTitle: "Contoh Sebenar: Kolam AMM",
    poolStorageDesc: "Bagaimana kolam AMM mengurus pelbagai nilai penyimpanan:",

    customTypesTitle: "Jenis Boleh Simpan Tersuai",
    customTypesDesc: "Untuk jenis kompleks, laksanakan penserilan byte secara manual:",

    storagePathsTitle: "Konvensyen Laluan Penyimpanan",
    storagePathsDesc: "Ikuti konvensyen ini untuk susun atur penyimpanan yang konsisten:",
    storagePaths: [
      { path: "/initialized", desc: "Bendera permulaan kontrak" },
      { path: "/name", desc: "Nama token/kontrak" },
      { path: "/symbol", desc: "Simbol token" },
      { path: "/totalsupply", desc: "Jumlah bekalan untuk token" },
      { path: "/auth", desc: "AlkaneId token pengesahan untuk kontrak yang disahkan" },
      { path: "/owner", desc: "Alamat pemilik atau AlkaneId" },
      { path: "/balances/{addr}", desc: "Baki pengguna (corak pemetaan)" },
      { path: "/allowances/{owner}/{spender}", desc: "Elaun token" },
      { path: "/seen/{hash}", desc: "Cegah serangan main semula" },
    ],

    bestPracticesTitle: "Amalan Terbaik",
    bestPractices: [
      { title: "Gunakan laluan deskriptif", desc: "Nama laluan harus mendokumentasi sendiri: /reserves/token0 bukan /r/0" },
      { title: "Awali dengan garis miring", desc: "Sentiasa mulakan laluan dengan / untuk konsistensi" },
      { title: "Kumpulkan data berkaitan", desc: "Gunakan laluan hierarki: /pool/reserves, /pool/fees" },
      { title: "Pertimbangkan saiz kunci", desc: "Laluan pendek menjimatkan penyimpanan tetapi cukup deskriptif" },
      { title: "Kendalikan nilai hilang", desc: "get() mengembalikan Vec kosong untuk kunci hilang - periksa panjang" },
      { title: "Gunakan aritmetik yang diperiksa", desc: "Sentiasa gunakan checked_add/checked_sub untuk jumlah" },
    ],

    readBeforeWriteTitle: "Corak Baca-Ubah-Tulis",
    readBeforeWriteDesc: "Semasa mengubah nilai, sentiasa baca dahulu kemudian tulis nilai baru:",

    nextStepsTitle: "Langkah Seterusnya",
    nextSteps: [
      { text: "Bina Token", href: "/docs/tutorials/token", desc: "Terapkan corak penyimpanan" },
      { text: "Panduan Ujian", href: "/docs/contracts/testing", desc: "Uji logik penyimpanan" },
      { text: "Penempatan", href: "/docs/contracts/deployment", desc: "Tempatkan kontrak" },
    ],
  },
  vi: {
    title: "Lưu Trữ & Quản Lý Trạng Thái",
    subtitle: "Các mẫu để lưu trữ dữ liệu bền vững trong hợp đồng thông minh Alkanes",
    intro: "Hợp đồng Alkanes lưu trữ trạng thái bằng cách sử dụng lưu trữ khóa-giá trị được truy cập thông qua StoragePointer. Hướng dẫn này bao gồm các mẫu lưu trữ từ giá trị đơn giản đến cấu trúc dữ liệu phức tạp.",

    basicsTitle: "Cơ Bản Về Lưu Trữ",
    basicsDesc: "Tất cả trạng thái hợp đồng được lưu trữ trong kho khóa-giá trị. Kiểu StoragePointer cung cấp API thuận tiện để đọc và ghi giá trị.",

    storagePointerTitle: "API StoragePointer",
    storagePointerDesc: "StoragePointer bao bọc một đường dẫn khóa và cung cấp các phương thức để đọc/ghi giá trị:",

    primitiveTypesTitle: "Lưu Trữ Kiểu Nguyên Thủy",
    primitiveTypesDesc: "Sử dụng get_value/set_value cho các kiểu triển khai tuần tự hóa byte:",
    primitiveTypes: [
      { type: "u128", note: "Phổ biến nhất - số lượng token, bộ đếm, v.v." },
      { type: "u64", note: "Dấu thời gian, chiều cao" },
      { type: "u32", note: "Bộ đếm nhỏ hơn, dấu thời gian khối" },
      { type: "u8", note: "Cờ, enum nhỏ" },
      { type: "bool", note: "Thông qua u8 (0 = false, 1 = true)" },
    ],

    stringsTitle: "Lưu Trữ Chuỗi",
    stringsDesc: "Lưu trữ chuỗi dưới dạng byte thô bằng Arc<Vec<u8>>:",

    alkaneIdTitle: "Lưu Trữ AlkaneId",
    alkaneIdDesc: "AlkaneId có thể chuyển đổi sang/từ Vec<u8>:",

    hierarchicalTitle: "Lưu Trữ Phân Cấp",
    hierarchicalDesc: "Sử dụng .select() để tạo không gian tên lưu trữ lồng nhau:",

    mappingTitle: "Mẫu Ánh Xạ",
    mappingDesc: "Tạo ánh xạ khóa-giá trị bằng cách kết hợp đường dẫn cơ sở với khóa:",

    initializationTitle: "Mẫu Khởi Tạo",
    initializationDesc: "Sử dụng observe_initialization() để đảm bảo hợp đồng chỉ được khởi tạo một lần:",

    poolStorageTitle: "Ví Dụ Thực Tế: Pool AMM",
    poolStorageDesc: "Cách một pool AMM quản lý nhiều giá trị lưu trữ:",

    customTypesTitle: "Kiểu Có Thể Lưu Trữ Tùy Chỉnh",
    customTypesDesc: "Đối với kiểu phức tạp, triển khai tuần tự hóa byte thủ công:",

    storagePathsTitle: "Quy Ước Đường Dẫn Lưu Trữ",
    storagePathsDesc: "Tuân theo các quy ước này để có bố cục lưu trữ nhất quán:",
    storagePaths: [
      { path: "/initialized", desc: "Cờ khởi tạo hợp đồng" },
      { path: "/name", desc: "Tên token/hợp đồng" },
      { path: "/symbol", desc: "Ký hiệu token" },
      { path: "/totalsupply", desc: "Tổng cung cho token" },
      { path: "/auth", desc: "AlkaneId token xác thực cho hợp đồng được xác thực" },
      { path: "/owner", desc: "Địa chỉ chủ sở hữu hoặc AlkaneId" },
      { path: "/balances/{addr}", desc: "Số dư người dùng (mẫu ánh xạ)" },
      { path: "/allowances/{owner}/{spender}", desc: "Hạn mức token" },
      { path: "/seen/{hash}", desc: "Ngăn chặn tấn công phát lại" },
    ],

    bestPracticesTitle: "Thực Hành Tốt Nhất",
    bestPractices: [
      { title: "Sử dụng đường dẫn mô tả", desc: "Tên đường dẫn nên tự mô tả: /reserves/token0 không phải /r/0" },
      { title: "Bắt đầu bằng dấu gạch chéo", desc: "Luôn bắt đầu đường dẫn bằng / để nhất quán" },
      { title: "Nhóm dữ liệu liên quan", desc: "Sử dụng đường dẫn phân cấp: /pool/reserves, /pool/fees" },
      { title: "Xem xét kích thước khóa", desc: "Đường dẫn ngắn tiết kiệm lưu trữ nhưng phải đủ mô tả" },
      { title: "Xử lý giá trị bị thiếu", desc: "get() trả về Vec rỗng cho khóa bị thiếu - kiểm tra độ dài" },
      { title: "Sử dụng số học được kiểm tra", desc: "Luôn sử dụng checked_add/checked_sub cho số lượng" },
    ],

    readBeforeWriteTitle: "Mẫu Đọc-Sửa-Ghi",
    readBeforeWriteDesc: "Khi sửa đổi giá trị, luôn đọc trước sau đó ghi giá trị mới:",

    nextStepsTitle: "Các Bước Tiếp Theo",
    nextSteps: [
      { text: "Xây Dựng Token", href: "/docs/tutorials/token", desc: "Áp dụng mẫu lưu trữ" },
      { text: "Hướng Dẫn Kiểm Thử", href: "/docs/contracts/testing", desc: "Kiểm thử logic lưu trữ" },
      { text: "Triển Khai", href: "/docs/contracts/deployment", desc: "Triển khai hợp đồng" },
    ],
  },
  ko: {
    title: "스토리지 및 상태 관리",
    subtitle: "Alkanes 스마트 컨트랙트에서 데이터 영속화 패턴",
    intro: "Alkanes 컨트랙트는 StoragePointer를 통해 접근하는 키-값 스토리지를 사용하여 상태를 저장합니다. 이 가이드는 간단한 값부터 복잡한 데이터 구조까지의 스토리지 패턴을 다룹니다.",

    basicsTitle: "스토리지 기초",
    basicsDesc: "모든 컨트랙트 상태는 키-값 저장소에 저장됩니다. StoragePointer 타입은 값을 읽고 쓰기 위한 편리한 API를 제공합니다.",

    storagePointerTitle: "StoragePointer API",
    storagePointerDesc: "StoragePointer는 키 경로를 래핑하고 값을 읽고 쓰는 메서드를 제공합니다:",

    primitiveTypesTitle: "원시 타입 저장",
    primitiveTypesDesc: "바이트 직렬화를 구현하는 타입에 대해 get_value/set_value 사용:",
    primitiveTypes: [
      { type: "u128", note: "가장 일반적 - 토큰 수량, 카운트 등" },
      { type: "u64", note: "타임스탬프, 높이" },
      { type: "u32", note: "더 작은 카운터, 블록 타임스탬프" },
      { type: "u8", note: "플래그, 작은 열거형" },
      { type: "bool", note: "u8을 통해 (0 = false, 1 = true)" },
    ],

    stringsTitle: "문자열 저장",
    stringsDesc: "Arc<Vec<u8>>를 사용하여 문자열을 원시 바이트로 저장:",

    alkaneIdTitle: "AlkaneId 저장",
    alkaneIdDesc: "AlkaneId는 Vec<u8>로 변환할 수 있습니다:",

    hierarchicalTitle: "계층적 스토리지",
    hierarchicalDesc: ".select()를 사용하여 중첩된 스토리지 네임스페이스 생성:",

    mappingTitle: "매핑 패턴",
    mappingDesc: "기본 경로와 키를 결합하여 키-값 매핑 생성:",

    initializationTitle: "초기화 패턴",
    initializationDesc: "observe_initialization()을 사용하여 컨트랙트가 한 번만 초기화되도록 보장:",

    poolStorageTitle: "실제 예제: AMM 풀",
    poolStorageDesc: "AMM 풀이 여러 스토리지 값을 관리하는 방법:",

    customTypesTitle: "사용자 정의 저장 가능 타입",
    customTypesDesc: "복잡한 타입의 경우 바이트 직렬화를 수동으로 구현:",

    storagePathsTitle: "스토리지 경로 규칙",
    storagePathsDesc: "일관된 스토리지 레이아웃을 위해 다음 규칙을 따르세요:",
    storagePaths: [
      { path: "/initialized", desc: "컨트랙트 초기화 플래그" },
      { path: "/name", desc: "토큰/컨트랙트 이름" },
      { path: "/symbol", desc: "토큰 심볼" },
      { path: "/totalsupply", desc: "토큰 총 공급량" },
      { path: "/auth", desc: "인증된 컨트랙트의 인증 토큰 AlkaneId" },
      { path: "/owner", desc: "소유자 주소 또는 AlkaneId" },
      { path: "/balances/{addr}", desc: "사용자 잔액 (매핑 패턴)" },
      { path: "/allowances/{owner}/{spender}", desc: "토큰 허용량" },
      { path: "/seen/{hash}", desc: "재생 공격 방지" },
    ],

    bestPracticesTitle: "모범 사례",
    bestPractices: [
      { title: "설명적인 경로 사용", desc: "경로 이름은 자체 문서화되어야 함: /reserves/token0 사용, /r/0 사용 안 함" },
      { title: "슬래시로 시작", desc: "일관성을 위해 항상 경로를 /로 시작" },
      { title: "관련 데이터 그룹화", desc: "계층적 경로 사용: /pool/reserves, /pool/fees" },
      { title: "키 크기 고려", desc: "짧은 경로가 스토리지를 절약하지만 충분히 설명적이어야 함" },
      { title: "누락된 값 처리", desc: "get()은 누락된 키에 대해 빈 Vec 반환 - 길이 확인" },
      { title: "검사된 산술 사용", desc: "수량에 대해 항상 checked_add/checked_sub 사용" },
    ],

    readBeforeWriteTitle: "읽기-수정-쓰기 패턴",
    readBeforeWriteDesc: "값을 수정할 때 항상 먼저 읽은 다음 새 값을 쓰세요:",

    nextStepsTitle: "다음 단계",
    nextSteps: [
      { text: "토큰 구축", href: "/docs/tutorials/token", desc: "스토리지 패턴 적용" },
      { text: "테스트 가이드", href: "/docs/contracts/testing", desc: "스토리지 로직 테스트" },
      { text: "배포", href: "/docs/contracts/deployment", desc: "컨트랙트 배포" },
    ],
  },
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

export default function StoragePage() {
  const locale = useLocale();
  const t = content[locale as keyof typeof content] || content.en;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-sm text-[color:var(--sf-primary)] mb-4">{t.subtitle}</p>
        <p className="text-lg text-[color:var(--sf-muted)]">{t.intro}</p>
      </div>

      {/* Storage Basics */}
      <Section title={t.basicsTitle} id="basics">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.basicsDesc}</p>

        <CodeBlock>{`use alkanes_runtime::storage::StoragePointer;
use metashrew_support::index_pointer::KeyValuePointer;
use std::sync::Arc;

// Create a storage pointer from a path
let pointer = StoragePointer::from_keyword("/my-value");

// Read raw bytes
let data: Arc<Vec<u8>> = pointer.get();

// Write raw bytes
pointer.set(Arc::new(vec![1, 2, 3, 4]));

// Check if value exists
if pointer.get().len() == 0 {
    println!("Value not set");
}`}</CodeBlock>
      </Section>

      {/* StoragePointer API */}
      <Section title={t.storagePointerTitle} id="storage-pointer">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.storagePointerDesc}</p>

        <CodeBlock>{`use alkanes_runtime::storage::StoragePointer;
use metashrew_support::index_pointer::KeyValuePointer;
use std::sync::Arc;

// ===== Creating Pointers =====

// From a keyword/path
let ptr = StoragePointer::from_keyword("/totalsupply");

// Hierarchical selection (creates: /balances/{user_bytes})
let balance_ptr = StoragePointer::from_keyword("/balances/")
    .select(&user_address_bytes);

// ===== Reading Values =====

// Raw bytes
let raw: Arc<Vec<u8>> = ptr.get();

// Typed value (for types implementing byte conversion)
let supply: u128 = ptr.get_value::<u128>();

// ===== Writing Values =====

// Raw bytes (requires Arc)
ptr.set(Arc::new(b"hello".to_vec()));

// Typed value
ptr.set_value::<u128>(1000000);

// ===== Existence Check =====
if ptr.get().len() == 0 {
    // Value doesn't exist or is empty
}`}</CodeBlock>
      </Section>

      {/* Primitive Types */}
      <Section title={t.primitiveTypesTitle} id="primitive-types">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.primitiveTypesDesc}</p>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-[color:var(--sf-outline)] rounded-lg">
            <thead className="bg-[color:var(--sf-surface)]">
              <tr>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Type</th>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Usage</th>
              </tr>
            </thead>
            <tbody>
              {t.primitiveTypes.map((item, i) => (
                <tr key={i} className="border-t border-[color:var(--sf-outline)]">
                  <td className="p-3 font-mono text-[color:var(--sf-primary)]">{item.type}</td>
                  <td className="p-3 text-[color:var(--sf-muted)]">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CodeBlock>{`// u128 - Most common for token amounts
fn total_supply_pointer(&self) -> StoragePointer {
    StoragePointer::from_keyword("/totalsupply")
}

fn total_supply(&self) -> u128 {
    self.total_supply_pointer().get_value::<u128>()
}

fn set_total_supply(&self, v: u128) {
    self.total_supply_pointer().set_value::<u128>(v);
}

// u64 - Timestamps, heights
fn last_update_pointer(&self) -> StoragePointer {
    StoragePointer::from_keyword("/lastupdated")
}

fn last_update(&self) -> u64 {
    self.last_update_pointer().get_value::<u64>()
}

// u32 - Smaller values
fn block_timestamp_last(&self) -> u32 {
    StoragePointer::from_keyword("/blockTimestampLast").get_value::<u32>()
}

// u8 - Flags
fn is_paused(&self) -> bool {
    StoragePointer::from_keyword("/paused").get_value::<u8>() == 1
}

fn set_paused(&self, paused: bool) {
    StoragePointer::from_keyword("/paused")
        .set_value::<u8>(if paused { 1 } else { 0 });
}`}</CodeBlock>
      </Section>

      {/* Strings */}
      <Section title={t.stringsTitle} id="strings">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.stringsDesc}</p>

        <CodeBlock>{`use std::sync::Arc;

fn name_pointer(&self) -> StoragePointer {
    StoragePointer::from_keyword("/name")
}

fn name(&self) -> String {
    let bytes = self.name_pointer().get();
    String::from_utf8(bytes.as_ref().clone())
        .expect("name not valid utf-8")
}

fn set_name(&self, name: String) {
    self.name_pointer().set(Arc::new(name.into_bytes()));
}

// More robust version with fallback
fn name_or_default(&self) -> String {
    let bytes = self.name_pointer().get();
    if bytes.len() == 0 {
        String::from("Unknown")
    } else {
        String::from_utf8(bytes.as_ref().clone())
            .unwrap_or_else(|_| String::from("Invalid"))
    }
}`}</CodeBlock>
      </Section>

      {/* AlkaneId */}
      <Section title={t.alkaneIdTitle} id="alkane-id">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.alkaneIdDesc}</p>

        <CodeBlock>{`use alkanes_support::id::AlkaneId;
use std::sync::Arc;

fn factory_pointer(&self) -> StoragePointer {
    StoragePointer::from_keyword("/factory_id")
}

fn factory(&self) -> Result<AlkaneId> {
    let bytes = self.factory_pointer().get();
    if bytes.len() == 0 {
        return Err(anyhow!("factory not set"));
    }
    // Convert bytes to AlkaneId
    bytes.as_ref().clone().try_into()
        .map_err(|_| anyhow!("invalid factory id"))
}

fn set_factory(&self, factory_id: AlkaneId) {
    let bytes: Vec<u8> = factory_id.into();
    self.factory_pointer().set(Arc::new(bytes));
}

// Store two AlkaneIds (e.g., token pair)
fn alkane_pair_pointer(&self) -> StoragePointer {
    StoragePointer::from_keyword("/alkane/pair")
}

fn set_alkane_pair(&self, a: AlkaneId, b: AlkaneId) {
    StoragePointer::from_keyword("/alkane/0")
        .set(Arc::new(a.into()));
    StoragePointer::from_keyword("/alkane/1")
        .set(Arc::new(b.into()));
}

fn get_alkane_pair(&self) -> Result<(AlkaneId, AlkaneId)> {
    let a_bytes = StoragePointer::from_keyword("/alkane/0").get();
    let b_bytes = StoragePointer::from_keyword("/alkane/1").get();
    Ok((
        a_bytes.as_ref().clone().try_into()?,
        b_bytes.as_ref().clone().try_into()?,
    ))
}`}</CodeBlock>
      </Section>

      {/* Hierarchical Storage */}
      <Section title={t.hierarchicalTitle} id="hierarchical">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.hierarchicalDesc}</p>

        <CodeBlock>{`// Base pointer
let base = StoragePointer::from_keyword("/users/");

// Select by user address (appends bytes to path)
let user_key = user_address.as_bytes();
let user_ptr = base.select(user_key);

// Further nesting
let balance_ptr = user_ptr.select(b"/balance");
let stake_ptr = user_ptr.select(b"/stake");

// Practical example: User balances per token
fn balance_of(&self, user: &[u8], token: &AlkaneId) -> u128 {
    let token_bytes: Vec<u8> = token.clone().into();
    StoragePointer::from_keyword("/balances/")
        .select(user)
        .select(&token_bytes)
        .get_value::<u128>()
}

// Multi-level nesting for allowances
fn allowance(&self, owner: &[u8], spender: &[u8]) -> u128 {
    StoragePointer::from_keyword("/allowances/")
        .select(owner)
        .select(spender)
        .get_value::<u128>()
}

fn set_allowance(&self, owner: &[u8], spender: &[u8], amount: u128) {
    StoragePointer::from_keyword("/allowances/")
        .select(owner)
        .select(spender)
        .set_value::<u128>(amount);
}`}</CodeBlock>
      </Section>

      {/* Mapping Pattern */}
      <Section title={t.mappingTitle} id="mapping">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.mappingDesc}</p>

        <CodeBlock>{`// Simple mapping: hash -> bool (for tracking seen values)
pub fn seen_pointer(&self, hash: &[u8]) -> StoragePointer {
    StoragePointer::from_keyword("/seen/").select(hash)
}

pub fn is_seen(&self, hash: &[u8]) -> bool {
    self.seen_pointer(hash).get().len() > 0
}

pub fn mark_seen(&self, hash: &[u8]) {
    self.seen_pointer(hash).set_value::<u8>(1);
}

// Counter with unique key
pub fn nonce_pointer(&self, address: &[u8]) -> StoragePointer {
    StoragePointer::from_keyword("/nonces/").select(address)
}

pub fn get_and_increment_nonce(&self, address: &[u8]) -> u128 {
    let mut ptr = self.nonce_pointer(address);
    let current = ptr.get_value::<u128>();
    ptr.set_value::<u128>(current + 1);
    current
}

// Indexed list pattern
fn item_count(&self) -> u128 {
    StoragePointer::from_keyword("/items/count").get_value::<u128>()
}

fn item_at(&self, index: u128) -> Option<Vec<u8>> {
    let ptr = StoragePointer::from_keyword("/items/")
        .select(&index.to_le_bytes());
    let data = ptr.get();
    if data.len() > 0 {
        Some(data.as_ref().clone())
    } else {
        None
    }
}

fn push_item(&self, data: Vec<u8>) {
    let index = self.item_count();
    StoragePointer::from_keyword("/items/")
        .select(&index.to_le_bytes())
        .set(Arc::new(data));
    StoragePointer::from_keyword("/items/count")
        .set_value::<u128>(index + 1);
}`}</CodeBlock>
      </Section>

      {/* Initialization Pattern */}
      <Section title={t.initializationTitle} id="initialization">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.initializationDesc}</p>

        <CodeBlock>{`// Built-in initialization check (from AlkaneResponder trait)
fn observe_initialization(&self) -> Result<()> {
    let mut pointer = StoragePointer::from_keyword("/initialized");
    if pointer.get().len() == 0 {
        pointer.set_value::<u8>(0x01);
        Ok(())
    } else {
        Err(anyhow!("already initialized"))
    }
}

// Usage in your contract
impl MyContract {
    fn initialize(&self, name: String, symbol: String) -> Result<CallResponse> {
        // This will fail if called twice
        self.observe_initialization()?;

        // Safe to initialize state
        self.set_name(name);
        self.set_symbol(symbol);

        let context = self.context()?;
        Ok(CallResponse::forward(&context.incoming_alkanes))
    }
}

// Custom initialization flags for features
fn observe_feature_enabled(&self, feature: &str) -> Result<()> {
    let key = format!("/feature/{}/enabled", feature);
    let mut pointer = StoragePointer::from_keyword(&key);
    if pointer.get().len() == 0 {
        pointer.set_value::<u8>(0x01);
        Ok(())
    } else {
        Err(anyhow!("feature {} already enabled", feature))
    }
}`}</CodeBlock>
      </Section>

      {/* Pool Storage Example */}
      <Section title={t.poolStorageTitle} id="pool-example">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.poolStorageDesc}</p>

        <CodeBlock>{`// Real-world AMM pool storage layout
pub trait AMMPoolBase: MintableToken + AlkaneResponder {
    // Token pair
    fn alkanes_for_self(&self) -> Result<(AlkaneId, AlkaneId)> {
        Ok((
            StoragePointer::from_keyword("/alkane/0")
                .get().as_ref().clone().try_into()?,
            StoragePointer::from_keyword("/alkane/1")
                .get().as_ref().clone().try_into()?,
        ))
    }

    // Factory reference
    fn factory(&self) -> Result<AlkaneId> {
        let ptr = StoragePointer::from_keyword("/factory_id").get();
        ptr.as_ref().clone().try_into()
    }

    fn set_factory(&self, factory_id: AlkaneId) {
        StoragePointer::from_keyword("/factory_id")
            .set(Arc::new(factory_id.into()));
    }

    // Fee configuration
    fn total_fee_pointer(&self) -> StoragePointer {
        StoragePointer::from_keyword("/totalfeeper1000")
    }

    fn total_fee_per_1000(&self) -> u128 {
        let ptr = self.total_fee_pointer();
        if ptr.get().len() == 0 {
            3 // Default: 0.3% fee
        } else {
            ptr.get_value::<u128>()
        }
    }

    // Claimable protocol fees
    fn claimable_fees_pointer(&self) -> StoragePointer {
        StoragePointer::from_keyword("/claimablefees")
    }

    fn claimable_fees(&self) -> u128 {
        self.claimable_fees_pointer().get_value::<u128>()
    }

    // Time-weighted average price (TWAP) tracking
    fn price_cumulative_pointers(&self) -> (StoragePointer, StoragePointer) {
        (
            StoragePointer::from_keyword("/price0CumLast"),
            StoragePointer::from_keyword("/price1CumLast"),
        )
    }

    fn block_timestamp_last(&self) -> u32 {
        StoragePointer::from_keyword("/blockTimestampLast").get_value::<u32>()
    }

    // K-value for invariant tracking
    fn k_last_pointer(&self) -> StoragePointer {
        StoragePointer::from_keyword("/klast")
    }

    fn k_last(&self) -> U256 {
        self.k_last_pointer().get_value::<StorableU256>().into()
    }

    // Initialize all storage in one transaction
    fn init_pool(
        &self,
        alkane_a: AlkaneId,
        alkane_b: AlkaneId,
        factory: AlkaneId,
    ) -> Result<CallResponse> {
        self.observe_initialization()?;

        // Store token pair
        StoragePointer::from_keyword("/alkane/0")
            .set(Arc::new(alkane_a.into()));
        StoragePointer::from_keyword("/alkane/1")
            .set(Arc::new(alkane_b.into()));

        // Store factory
        self.set_factory(factory);

        // Initialize K to 0
        self.set_k_last(U256::from(0));

        // Add initial liquidity
        self.add_liquidity()
    }
}`}</CodeBlock>
      </Section>

      {/* Custom Types */}
      <Section title={t.customTypesTitle} id="custom-types">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.customTypesDesc}</p>

        <CodeBlock>{`use std::io::{Cursor, Read, Write};

// Custom type that can be stored
#[derive(Clone)]
pub struct UserInfo {
    pub balance: u128,
    pub last_claim: u64,
    pub multiplier: u32,
}

impl UserInfo {
    pub fn to_bytes(&self) -> Vec<u8> {
        let mut bytes = Vec::with_capacity(28); // 16 + 8 + 4
        bytes.extend_from_slice(&self.balance.to_le_bytes());
        bytes.extend_from_slice(&self.last_claim.to_le_bytes());
        bytes.extend_from_slice(&self.multiplier.to_le_bytes());
        bytes
    }

    pub fn from_bytes(bytes: &[u8]) -> Result<Self> {
        if bytes.len() < 28 {
            return Err(anyhow!("insufficient bytes for UserInfo"));
        }
        Ok(Self {
            balance: u128::from_le_bytes(bytes[0..16].try_into()?),
            last_claim: u64::from_le_bytes(bytes[16..24].try_into()?),
            multiplier: u32::from_le_bytes(bytes[24..28].try_into()?),
        })
    }
}

// Storage functions for custom type
fn user_info_pointer(&self, user: &[u8]) -> StoragePointer {
    StoragePointer::from_keyword("/userinfo/").select(user)
}

fn get_user_info(&self, user: &[u8]) -> Option<UserInfo> {
    let bytes = self.user_info_pointer(user).get();
    if bytes.len() == 0 {
        None
    } else {
        UserInfo::from_bytes(bytes.as_ref()).ok()
    }
}

fn set_user_info(&self, user: &[u8], info: &UserInfo) {
    self.user_info_pointer(user)
        .set(Arc::new(info.to_bytes()));
}

// Update a single field efficiently
fn update_user_balance(&self, user: &[u8], new_balance: u128) -> Result<()> {
    let mut info = self.get_user_info(user)
        .ok_or(anyhow!("user not found"))?;
    info.balance = new_balance;
    self.set_user_info(user, &info);
    Ok(())
}`}</CodeBlock>
      </Section>

      {/* Storage Path Conventions */}
      <Section title={t.storagePathsTitle} id="paths">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.storagePathsDesc}</p>

        <div className="overflow-x-auto my-4">
          <table className="w-full text-sm border border-[color:var(--sf-outline)] rounded-lg">
            <thead className="bg-[color:var(--sf-surface)]">
              <tr>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Path</th>
                <th className="text-left p-3 font-semibold text-[color:var(--sf-text)]">Description</th>
              </tr>
            </thead>
            <tbody>
              {t.storagePaths.map((item, i) => (
                <tr key={i} className="border-t border-[color:var(--sf-outline)]">
                  <td className="p-3 font-mono text-[color:var(--sf-primary)]">{item.path}</td>
                  <td className="p-3 text-[color:var(--sf-muted)]">{item.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Best Practices */}
      <Section title={t.bestPracticesTitle} id="best-practices">
        <div className="space-y-4">
          {t.bestPractices.map((item, i) => (
            <div key={i} className="p-4 rounded-lg bg-[color:var(--sf-surface)] border border-[color:var(--sf-outline)]">
              <h4 className="font-semibold text-[color:var(--sf-text)] mb-1">{item.title}</h4>
              <p className="text-sm text-[color:var(--sf-muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Read Before Write */}
      <Section title={t.readBeforeWriteTitle} id="read-write">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.readBeforeWriteDesc}</p>

        <CodeBlock>{`use alkanes_support::utils::overflow_error;

// CORRECT: Read, modify, write with overflow check
fn increase_balance(&self, user: &[u8], amount: u128) -> Result<()> {
    let current = self.balance_pointer(user).get_value::<u128>();
    let new_balance = overflow_error(current.checked_add(amount))?;
    self.balance_pointer(user).set_value::<u128>(new_balance);
    Ok(())
}

fn decrease_balance(&self, user: &[u8], amount: u128) -> Result<()> {
    let current = self.balance_pointer(user).get_value::<u128>();
    let new_balance = overflow_error(current.checked_sub(amount))?;
    self.balance_pointer(user).set_value::<u128>(new_balance);
    Ok(())
}

// Transfer pattern: decrease from one, increase to another
fn transfer(&self, from: &[u8], to: &[u8], amount: u128) -> Result<()> {
    // Read both balances first
    let from_balance = self.balance_pointer(from).get_value::<u128>();
    let to_balance = self.balance_pointer(to).get_value::<u128>();

    // Check and calculate new values
    let new_from = overflow_error(from_balance.checked_sub(amount))?;
    let new_to = overflow_error(to_balance.checked_add(amount))?;

    // Write both values
    self.balance_pointer(from).set_value::<u128>(new_from);
    self.balance_pointer(to).set_value::<u128>(new_to);

    Ok(())
}`}</CodeBlock>
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
