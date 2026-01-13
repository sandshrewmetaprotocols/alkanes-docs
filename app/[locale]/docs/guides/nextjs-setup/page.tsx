"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSdkVersion, formatCommitDate } from "@/hooks/useSdkVersion";

const content = {
  en: {
    title: "Next.js Setup with @alkanes/ts-sdk",
    subtitle: "Configuring Turbopack, Webpack, and WASM for development and production",
    intro: "This guide documents how to integrate @alkanes/ts-sdk into a Next.js application. The SDK uses WebAssembly (WASM) and requires specific bundler configuration to work correctly in both development and production environments.",

    overviewTitle: "Overview",
    overviewContent: "The @alkanes/ts-sdk package contains WASM bindings compiled from Rust. Running WASM in Next.js requires:",
    overviewItems: [
      "WASM module loading configuration for both Turbopack (dev) and Webpack (production)",
      "Browser polyfills for Node.js built-ins used by crypto libraries",
      "Module alias resolution for the WASM entry point"
    ],

    installTitle: "Installation",
    installDesc: "Install the SDK and required polyfills. The URL below is pinned to the latest commit on the develop branch:",
    installLoading: "Fetching latest version...",
    installError: "Could not fetch latest version. Use the base URL:",
    installVersionLabel: "Latest version:",

    configTitle: "Next.js Configuration",
    configDesc: "The complete next.config.ts handles both Turbopack (for fast development) and Webpack (for production builds). Here's the full configuration:",

    turbopackTitle: "Turbopack Configuration (Development)",
    turbopackDesc: "Turbopack is Next.js's new Rust-based bundler, offering faster refresh times during development. For WASM support, we configure module aliases:",
    turbopackNotes: [
      "resolveAlias maps the WASM import path to the built WASM module",
      "The alias is conditional—only enabled if the WASM files exist",
      "Run development with: next dev --turbopack or pnpm dev:turbo"
    ],

    webpackTitle: "Webpack Configuration (Production & Local Dev)",
    webpackDesc: "Webpack handles production builds and can be used for local development as an alternative to Turbopack. The configuration includes WASM loading, polyfills, and fallbacks:",
    webpackSections: [
      { name: "WASM Support", desc: "Enables async WebAssembly loading with proper module rules" },
      { name: "Browser Fallbacks", desc: "Disables Node.js modules (fs, net, tls, crypto) that don't exist in browsers" },
      { name: "Polyfills", desc: "Provides Buffer and process globals required by bitcoinjs-lib and ecpair" },
      { name: "Global Definition", desc: "Maps 'global' to 'globalThis' for universal compatibility" }
    ],

    polyfillsTitle: "Required Polyfills",
    polyfillsDesc: "The SDK depends on Bitcoin libraries that require Node.js globals. These must be polyfilled for browser environments:",
    polyfillsItems: [
      { name: "Buffer", package: "buffer", reason: "Used by bitcoinjs-lib for binary data handling" },
      { name: "process", package: "process/browser", reason: "Used by randombytes and other crypto utilities" }
    ],
    polyfillsNote: "These packages are included as dependencies and webpack's ProvidePlugin makes them globally available.",

    devModesTitle: "Development Modes",
    devModesDesc: "You can choose between two development modes based on your needs:",
    devModes: [
      {
        name: "Turbopack (Recommended)",
        command: "next dev --turbopack",
        script: "pnpm dev:turbo",
        pros: ["Faster hot module replacement", "Lower memory usage", "Incremental compilation"],
        cons: ["Newer, may have edge cases"]
      },
      {
        name: "Webpack",
        command: "next dev --webpack",
        script: "pnpm dev",
        pros: ["Battle-tested", "More plugin compatibility", "Same as production"],
        cons: ["Slower rebuild times"]
      }
    ],

    packageJsonTitle: "Package.json Scripts",
    packageJsonDesc: "Configure these scripts for easy switching between modes:",

    wasmAliasTitle: "WASM Module Aliasing",
    wasmAliasDesc: "The SDK exports WASM bindings at @alkanes/ts-sdk/wasm. This path must resolve to the compiled WebAssembly module:",
    wasmAliasNote: "If you're using the SDK from npm, the WASM files are included in the package. If building locally, ensure ts-sdk/build/wasm/alkanes_web_sys.js exists.",

    localDevTitle: "Local SDK Development",
    localDevDesc: "When developing the SDK locally alongside your Next.js app, the configuration detects the local build:",
    localDevSteps: [
      "Clone the ts-sdk repository to ./ts-sdk",
      "Build the WASM module: cd ts-sdk && pnpm build:wasm",
      "The config automatically detects and uses the local build"
    ],

    tsConfigTitle: "TypeScript Configuration",
    tsConfigDesc: "Add path aliases for the SDK in your tsconfig.json:",

    testingTitle: "Testing Configuration",
    testingDesc: "For Vitest or other test runners, you'll need similar WASM handling. Here's a vitest.config.ts example:",

    troubleshootTitle: "Troubleshooting",
    troubleshootItems: [
      {
        issue: "Error: Cannot find module '@alkanes/ts-sdk/wasm'",
        solution: "Ensure the WASM files are built. For local development, run the build:wasm script in the ts-sdk directory. For npm packages, reinstall the dependency."
      },
      {
        issue: "ReferenceError: Buffer is not defined",
        solution: "The ProvidePlugin configuration is missing or not applied to client bundles. Ensure the polyfill config is inside the !isServer block."
      },
      {
        issue: "ReferenceError: process is not defined",
        solution: "Add the process polyfill to ProvidePlugin. Use 'process/browser' (not 'process') to avoid including the full Node.js process module."
      },
      {
        issue: "Turbopack: WASM module not loading",
        solution: "Verify the resolveAlias path is correct. Turbopack requires relative paths starting with './' for local files."
      },
      {
        issue: "Build error: Can't resolve 'fs' (or net, tls, crypto)",
        solution: "Add browser fallbacks in webpack config: resolve.fallback = { fs: false, net: false, tls: false, crypto: false }"
      }
    ],

    exampleTitle: "Complete Example",
    exampleDesc: "Here's a minimal example using the SDK in a Next.js component:",

    resourcesTitle: "Resources",
    resources: [
      { text: "Next.js Turbopack Docs", href: "https://nextjs.org/docs/architecture/turbopack", desc: "Official Turbopack documentation" },
      { text: "Next.js Webpack Config", href: "https://nextjs.org/docs/app/api-reference/next-config-js/webpack", desc: "Customizing webpack configuration" },
      { text: "@alkanes/ts-sdk Guide", href: "/docs/guides/ts-sdk", desc: "Full SDK usage documentation" },
      { text: "alkanes-rs GitHub", href: "https://github.com/kungfuflex/alkanes-rs", desc: "SDK source code" }
    ]
  },
  zh: {
    title: "使用 @alkanes/ts-sdk 配置 Next.js",
    subtitle: "配置 Turbopack、Webpack 和 WASM 用于开发和生产",
    intro: "本指南记录了如何将 @alkanes/ts-sdk 集成到 Next.js 应用程序中。该 SDK 使用 WebAssembly (WASM)，需要特定的打包器配置才能在开发和生产环境中正常工作。",

    overviewTitle: "概述",
    overviewContent: "@alkanes/ts-sdk 包含从 Rust 编译的 WASM 绑定。在 Next.js 中运行 WASM 需要：",
    overviewItems: [
      "为 Turbopack（开发）和 Webpack（生产）配置 WASM 模块加载",
      "为加密库使用的 Node.js 内置模块提供浏览器 polyfills",
      "为 WASM 入口点配置模块别名解析"
    ],

    installTitle: "安装",
    installDesc: "安装 SDK 和所需的 polyfills。下面的 URL 已固定到 develop 分支的最新提交：",
    installLoading: "正在获取最新版本...",
    installError: "无法获取最新版本。使用基础 URL：",
    installVersionLabel: "最新版本：",

    configTitle: "Next.js 配置",
    configDesc: "完整的 next.config.ts 同时处理 Turbopack（用于快速开发）和 Webpack（用于生产构建）。以下是完整配置：",

    turbopackTitle: "Turbopack 配置（开发）",
    turbopackDesc: "Turbopack 是 Next.js 新的基于 Rust 的打包器，在开发期间提供更快的刷新时间。对于 WASM 支持，我们配置模块别名：",
    turbopackNotes: [
      "resolveAlias 将 WASM 导入路径映射到构建的 WASM 模块",
      "别名是条件性的——仅在 WASM 文件存在时启用",
      "使用以下命令运行开发：next dev --turbopack 或 pnpm dev:turbo"
    ],

    webpackTitle: "Webpack 配置（生产和本地开发）",
    webpackDesc: "Webpack 处理生产构建，也可用于本地开发作为 Turbopack 的替代。配置包括 WASM 加载、polyfills 和 fallbacks：",
    webpackSections: [
      { name: "WASM 支持", desc: "使用适当的模块规则启用异步 WebAssembly 加载" },
      { name: "浏览器 Fallbacks", desc: "禁用浏览器中不存在的 Node.js 模块（fs、net、tls、crypto）" },
      { name: "Polyfills", desc: "提供 bitcoinjs-lib 和 ecpair 所需的 Buffer 和 process 全局变量" },
      { name: "全局定义", desc: "将 'global' 映射到 'globalThis' 以实现通用兼容性" }
    ],

    polyfillsTitle: "必需的 Polyfills",
    polyfillsDesc: "SDK 依赖于需要 Node.js 全局变量的比特币库。这些必须为浏览器环境提供 polyfill：",
    polyfillsItems: [
      { name: "Buffer", package: "buffer", reason: "被 bitcoinjs-lib 用于二进制数据处理" },
      { name: "process", package: "process/browser", reason: "被 randombytes 和其他加密工具使用" }
    ],
    polyfillsNote: "这些包作为依赖项包含，webpack 的 ProvidePlugin 使它们全局可用。",

    devModesTitle: "开发模式",
    devModesDesc: "您可以根据需要在两种开发模式之间选择：",
    devModes: [
      {
        name: "Turbopack（推荐）",
        command: "next dev --turbopack",
        script: "pnpm dev:turbo",
        pros: ["更快的热模块替换", "更低的内存使用", "增量编译"],
        cons: ["较新，可能有边缘情况"]
      },
      {
        name: "Webpack",
        command: "next dev --webpack",
        script: "pnpm dev",
        pros: ["经过实战检验", "更多插件兼容性", "与生产环境相同"],
        cons: ["重建时间较慢"]
      }
    ],

    packageJsonTitle: "Package.json 脚本",
    packageJsonDesc: "配置这些脚本以便在模式之间轻松切换：",

    wasmAliasTitle: "WASM 模块别名",
    wasmAliasDesc: "SDK 在 @alkanes/ts-sdk/wasm 导出 WASM 绑定。此路径必须解析到编译的 WebAssembly 模块：",
    wasmAliasNote: "如果您从 npm 使用 SDK，WASM 文件包含在包中。如果本地构建，请确保 ts-sdk/build/wasm/alkanes_web_sys.js 存在。",

    localDevTitle: "本地 SDK 开发",
    localDevDesc: "在本地开发 SDK 与 Next.js 应用程序时，配置会检测本地构建：",
    localDevSteps: [
      "将 ts-sdk 仓库克隆到 ./ts-sdk",
      "构建 WASM 模块：cd ts-sdk && pnpm build:wasm",
      "配置会自动检测并使用本地构建"
    ],

    tsConfigTitle: "TypeScript 配置",
    tsConfigDesc: "在 tsconfig.json 中为 SDK 添加路径别名：",

    testingTitle: "测试配置",
    testingDesc: "对于 Vitest 或其他测试运行器，您需要类似的 WASM 处理。以下是 vitest.config.ts 示例：",

    troubleshootTitle: "故障排除",
    troubleshootItems: [
      {
        issue: "错误：Cannot find module '@alkanes/ts-sdk/wasm'",
        solution: "确保 WASM 文件已构建。对于本地开发，在 ts-sdk 目录中运行 build:wasm 脚本。对于 npm 包，重新安装依赖项。"
      },
      {
        issue: "ReferenceError: Buffer is not defined",
        solution: "ProvidePlugin 配置缺失或未应用于客户端包。确保 polyfill 配置在 !isServer 块内。"
      },
      {
        issue: "ReferenceError: process is not defined",
        solution: "将 process polyfill 添加到 ProvidePlugin。使用 'process/browser'（不是 'process'）以避免包含完整的 Node.js process 模块。"
      },
      {
        issue: "Turbopack：WASM 模块未加载",
        solution: "验证 resolveAlias 路径是否正确。Turbopack 要求本地文件使用以 './' 开头的相对路径。"
      },
      {
        issue: "构建错误：Can't resolve 'fs'（或 net、tls、crypto）",
        solution: "在 webpack 配置中添加浏览器 fallbacks：resolve.fallback = { fs: false, net: false, tls: false, crypto: false }"
      }
    ],

    exampleTitle: "完整示例",
    exampleDesc: "以下是在 Next.js 组件中使用 SDK 的最小示例：",

    resourcesTitle: "资源",
    resources: [
      { text: "Next.js Turbopack 文档", href: "https://nextjs.org/docs/architecture/turbopack", desc: "官方 Turbopack 文档" },
      { text: "Next.js Webpack 配置", href: "https://nextjs.org/docs/app/api-reference/next-config-js/webpack", desc: "自定义 webpack 配置" },
      { text: "@alkanes/ts-sdk 指南", href: "/docs/guides/ts-sdk", desc: "完整的 SDK 使用文档" },
      { text: "alkanes-rs GitHub", href: "https://github.com/kungfuflex/alkanes-rs", desc: "SDK 源代码" }
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
          <CodeBlock language="bash">{`# Install required dependencies
pnpm add https://pkg.alkanes.build/dist/@alkanes/ts-sdk buffer process

# Or with npm
npm install https://pkg.alkanes.build/dist/@alkanes/ts-sdk buffer process`}</CodeBlock>
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

          <CodeBlock language="bash">{`# Install required dependencies
pnpm add ${sdkVersion.packageUrl} buffer process

# Or with npm
npm install ${sdkVersion.packageUrl} buffer process`}</CodeBlock>
        </>
      )}
    </Section>
  );
}

export default function NextjsSetupPage() {
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
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.overviewContent}</p>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)]">
          {t.overviewItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </Section>

      {/* Installation */}
      <InstallationSection t={t} />

      {/* Complete Config */}
      <Section title={t.configTitle} id="config">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.configDesc}</p>
        <CodeBlock title="next.config.ts">{`import type { NextConfig } from "next";
import path from "path";
import fs from "fs";
import webpack from "webpack";

// Check if local ts-sdk WASM is built (for local development)
const tsSdkWasmPath = path.join(process.cwd(), "ts-sdk/build/wasm/alkanes_web_sys.js");
const hasTsSdk = fs.existsSync(tsSdkWasmPath);

const nextConfig: NextConfig = {
  // Turbopack configuration (for dev mode with --turbopack)
  turbopack: hasTsSdk
    ? {
        resolveAlias: {
          "@alkanes/ts-sdk/wasm": "./ts-sdk/build/wasm/alkanes_web_sys.js",
        },
      }
    : {},

  // Webpack configuration (for production and dev with --webpack)
  webpack: (config, { isServer }) => {
    // WASM alias for local development (only if ts-sdk exists)
    if (hasTsSdk) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@alkanes/ts-sdk/wasm": tsSdkWasmPath,
      };
    }

    // Enable async WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // WASM loader rule
    config.module.rules.push({
      test: /\\.wasm$/,
      type: "webassembly/async",
    });

    // Client-side only configuration
    if (!isServer) {
      // Disable Node.js built-ins for browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };

      // Polyfill Buffer and process for browser
      // Required by bitcoinjs-lib, ecpair, randombytes
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        })
      );

      // Define global as globalThis for universal compatibility
      config.plugins.push(
        new webpack.DefinePlugin({
          global: "globalThis",
        })
      );
    }

    return config;
  },
};

export default nextConfig;`}</CodeBlock>
      </Section>

      {/* Turbopack */}
      <Section title={t.turbopackTitle} id="turbopack">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.turbopackDesc}</p>
        <CodeBlock title="Turbopack WASM alias">{`// next.config.ts - Turbopack section
turbopack: {
  resolveAlias: {
    // Map the WASM import to the built module
    "@alkanes/ts-sdk/wasm": "./ts-sdk/build/wasm/alkanes_web_sys.js",
  },
},`}</CodeBlock>
        <ul className="list-disc list-inside space-y-2 text-[color:var(--sf-muted)] mt-4">
          {t.turbopackNotes.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      </Section>

      {/* Webpack */}
      <Section title={t.webpackTitle} id="webpack">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.webpackDesc}</p>
        <div className="grid gap-4 md:grid-cols-2 mb-4">
          {t.webpackSections.map((section, i) => (
            <div key={i} className="p-4 rounded-lg border border-[color:var(--sf-outline)] bg-[color:var(--sf-surface)]">
              <h4 className="font-semibold mb-2 text-[color:var(--sf-text)]">{section.name}</h4>
              <p className="text-sm text-[color:var(--sf-muted)]">{section.desc}</p>
            </div>
          ))}
        </div>
        <CodeBlock title="Webpack WASM and polyfill configuration">{`webpack: (config, { isServer }) => {
  // Enable async WebAssembly experiments
  config.experiments = {
    ...config.experiments,
    asyncWebAssembly: true,
  };

  // Add WASM loader
  config.module.rules.push({
    test: /\\.wasm$/,
    type: "webassembly/async",
  });

  // Client-side configuration
  if (!isServer) {
    // Fallbacks for Node.js built-ins
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Provide Buffer and process globally
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
        process: "process/browser",
      })
    );

    // Map global to globalThis
    config.plugins.push(
      new webpack.DefinePlugin({
        global: "globalThis",
      })
    );
  }

  return config;
},`}</CodeBlock>
      </Section>

      {/* Polyfills */}
      <Section title={t.polyfillsTitle} id="polyfills">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.polyfillsDesc}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[color:var(--sf-outline)]">
                <th className="text-left p-3 font-semibold">Global</th>
                <th className="text-left p-3 font-semibold">Package</th>
                <th className="text-left p-3 font-semibold">Why Needed</th>
              </tr>
            </thead>
            <tbody>
              {t.polyfillsItems.map((item, i) => (
                <tr key={i} className="border-b border-[color:var(--sf-outline)]">
                  <td className="p-3 font-mono text-[color:var(--sf-primary)]">{item.name}</td>
                  <td className="p-3 font-mono">{item.package}</td>
                  <td className="p-3 text-[color:var(--sf-muted)]">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-[color:var(--sf-muted)]">{t.polyfillsNote}</p>
      </Section>

      {/* Development Modes */}
      <Section title={t.devModesTitle} id="dev-modes">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.devModesDesc}</p>
        <div className="grid gap-6 md:grid-cols-2">
          {t.devModes.map((mode, i) => (
            <div key={i} className="p-4 rounded-lg border border-[color:var(--sf-outline)] bg-[color:var(--sf-surface)]">
              <h4 className="font-semibold mb-2 text-[color:var(--sf-text)]">{mode.name}</h4>
              <code className="text-sm bg-[color:var(--sf-background)] px-2 py-1 rounded">{mode.command}</code>
              <p className="text-xs text-[color:var(--sf-muted)] mt-1">Script: <code>{mode.script}</code></p>
              <div className="mt-3">
                <p className="text-xs font-semibold text-green-500 mb-1">Pros:</p>
                <ul className="text-xs text-[color:var(--sf-muted)] list-disc list-inside">
                  {mode.pros.map((pro, j) => <li key={j}>{pro}</li>)}
                </ul>
              </div>
              <div className="mt-2">
                <p className="text-xs font-semibold text-orange-500 mb-1">Cons:</p>
                <ul className="text-xs text-[color:var(--sf-muted)] list-disc list-inside">
                  {mode.cons.map((con, j) => <li key={j}>{con}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Package.json Scripts */}
      <Section title={t.packageJsonTitle} id="scripts">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.packageJsonDesc}</p>
        <CodeBlock title="package.json" language="json">{`{
  "scripts": {
    "dev": "next dev --webpack",
    "dev:turbo": "next dev --turbopack",
    "build": "next build --webpack",
    "start": "next start"
  }
}`}</CodeBlock>
      </Section>

      {/* WASM Alias */}
      <Section title={t.wasmAliasTitle} id="wasm-alias">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.wasmAliasDesc}</p>
        <CodeBlock>{`// The SDK imports WASM like this:
import { someWasmFunction } from '@alkanes/ts-sdk/wasm';

// This resolves to (depending on your setup):
// - npm package: node_modules/@alkanes/ts-sdk/wasm/alkanes_web_sys.js
// - local build: ./ts-sdk/build/wasm/alkanes_web_sys.js`}</CodeBlock>
        <p className="mt-4 text-sm text-[color:var(--sf-muted)]">{t.wasmAliasNote}</p>
      </Section>

      {/* Local SDK Development */}
      <Section title={t.localDevTitle} id="local-dev">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.localDevDesc}</p>
        <CodeBlock title="Automatic local build detection">{`import path from "path";
import fs from "fs";

// Check if local WASM build exists
const tsSdkWasmPath = path.join(process.cwd(), "ts-sdk/build/wasm/alkanes_web_sys.js");
const hasTsSdk = fs.existsSync(tsSdkWasmPath);

// Conditionally apply alias based on local build availability
turbopack: hasTsSdk
  ? { resolveAlias: { "@alkanes/ts-sdk/wasm": "./ts-sdk/build/wasm/alkanes_web_sys.js" } }
  : {},`}</CodeBlock>
        <ol className="list-decimal list-inside space-y-2 text-[color:var(--sf-muted)] mt-4">
          {t.localDevSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </Section>

      {/* TypeScript Config */}
      <Section title={t.tsConfigTitle} id="tsconfig">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.tsConfigDesc}</p>
        <CodeBlock title="tsconfig.json" language="json">{`{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/ts-sdk": ["./ts-sdk"],
      "@/ts-sdk/*": ["./ts-sdk/*"]
    }
  },
  "exclude": [
    "ts-sdk"  // Exclude local SDK from type checking if needed
  ]
}`}</CodeBlock>
      </Section>

      {/* Testing */}
      <Section title={t.testingTitle} id="testing">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.testingDesc}</p>
        <CodeBlock title="vitest.config.ts">{`import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  test: {
    environment: 'happy-dom',
  },
  resolve: {
    alias: {
      '@alkanes/ts-sdk/wasm': 'ts-sdk/build/wasm/index.js',
      '@alkanes/ts-sdk': 'ts-sdk/dist/index.mjs',
    },
  },
  optimizeDeps: {
    exclude: ['@alkanes/ts-sdk'],
  },
  server: {
    deps: {
      inline: ['@alkanes/ts-sdk'],
    },
  },
});`}</CodeBlock>
      </Section>

      {/* Troubleshooting */}
      <Section title={t.troubleshootTitle} id="troubleshooting">
        <div className="space-y-4">
          {t.troubleshootItems.map((item, i) => (
            <div key={i} className="p-4 rounded-lg border border-[color:var(--sf-outline)] bg-[color:var(--sf-surface)]">
              <h4 className="font-semibold mb-2 text-red-400 font-mono text-sm">{item.issue}</h4>
              <p className="text-sm text-[color:var(--sf-muted)]">{item.solution}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Complete Example */}
      <Section title={t.exampleTitle} id="example">
        <p className="mb-4 text-[color:var(--sf-muted)]">{t.exampleDesc}</p>
        <CodeBlock title="app/components/BlockHeight.tsx">{`"use client";

import { useEffect, useState } from "react";
import { AlkanesProvider } from "@alkanes/ts-sdk";

export function BlockHeight() {
  const [height, setHeight] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHeight() {
      try {
        const provider = new AlkanesProvider({
          network: "mainnet",
          rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
        });

        // Initialize loads the WASM module
        await provider.initialize();

        // Now we can use the provider
        const currentHeight = await provider.getBlockHeight();
        setHeight(currentHeight);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        setLoading(false);
      }
    }

    fetchHeight();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>Current Block Height: {height?.toLocaleString()}</div>;
}`}</CodeBlock>
      </Section>

      {/* Resources */}
      <Section title={t.resourcesTitle} id="resources">
        <ul className="space-y-3">
          {t.resources.map((resource, i) => (
            <li key={i}>
              {resource.href.startsWith('/') ? (
                <Link
                  href={resource.href}
                  className="text-[color:var(--sf-primary)] hover:underline font-medium"
                >
                  {resource.text}
                </Link>
              ) : (
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--sf-primary)] hover:underline font-medium"
                >
                  {resource.text}
                </a>
              )}
              <span className="text-[color:var(--sf-muted)]"> - {resource.desc}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
