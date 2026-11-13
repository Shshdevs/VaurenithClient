# Tauri desktop client

Vaurenith uses the same React application in the browser and in a Tauri 2 desktop shell. The current native core exposes only a read-only `get_client_info` command. Git, SSH, Docker, local files, and secret storage are outside this implementation.

## Requirements

- Node.js 22.22.2 and pnpm 12.18.0.
- Rust stable with the `cargo` tools.
- Windows: Visual Studio C++ Build Tools and WebView2 Runtime.
- macOS: Xcode Command Line Tools.
- Linux: a C toolchain, `libwebkit2gtk-4.1-dev`, `build-essential`, `curl`, `wget`, `file`, `libxdo-dev`, `libssl-dev`, `librsvg2-dev`, and `libayatana-appindicator3-dev`.

Install web dependencies with `pnpm install`. Tauri's official system prerequisites are platform-specific; use the [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/) for package names and current setup steps.

## Run and build

| Goal                        | Command              |
| --------------------------- | -------------------- |
| Web development             | `pnpm dev`           |
| Web production build        | `pnpm build`         |
| Desktop development         | `pnpm desktop:dev`   |
| Desktop packages            | `pnpm desktop:build` |
| Desktop environment details | `pnpm desktop:check` |
| Rust formatting             | `pnpm rust:fmt`      |
| Rust lint                   | `pnpm rust:clippy`   |
| Rust unit tests             | `pnpm rust:test`     |

The desktop window loads the local Vite server in development and `dist` in production. The Vite server uses port 5173 and refuses to switch ports for Tauri. Native packaging is configured for NSIS/MSI on Windows, app/DMG on macOS, and AppImage/deb on Linux. Build each target on its corresponding operating system; this checkout has no signing configuration.

## Architecture and IPC

TypeScript defines the Application `Platform` port in `src/application/ports/Platform.ts`. `WebPlatform` never invokes Tauri and reports native details as unavailable. `TauriPlatform` is the sole frontend adapter that imports Tauri `invoke`; `src/app/platform.ts` chooses it with the official `isTauri()` function. React Presentation does not import Tauri APIs.

The Rust layers are intentionally small: `domain.rs` defines the serializable client information model, `application.rs` assembles it, and `presentation/commands.rs` exposes the Tauri command. `lib.rs` composes and registers the command. Keep business decisions and system integrations out of command handlers. Add a command by defining its Application operation first, adding a narrowly scoped Presentation wrapper, registering that command in `lib.rs`, and updating the typed TypeScript adapter.

Desktop uses `HashRouter` so localized routes work when loaded from Tauri's application origin. Web keeps `BrowserRouter`. Initial language selection reads the hash route only in Tauri. Set `VITE_API_BASE_URL` to an absolute backend URL to enable API requests in Desktop. When it is absent, Desktop API requests fail through the existing `ApiNetworkError` classification without attempting to contact the WebView origin. Web preserves relative API requests.

## Security and troubleshooting

The application loads only the bundled local frontend in production. Content Security Policy is enabled. No shell, filesystem, updater, or secret-storage plugins are registered. Custom Tauri commands have typed, narrow inputs and outputs; do not add generic command execution. The capability file grants no plugin permissions because the current command requires none.

If `desktop:dev` cannot find port 5173, stop the process already using it. If a native build reports missing system libraries, install the platform prerequisites above. The first Rust build downloads crates and can take several minutes. Desktop API calls need an absolute `VITE_API_BASE_URL`; do not put credentials in `VITE_*` variables.

The bundled images in `src-tauri/icons` are the generated Tauri starter icons and should be replaced with Vaurenith brand assets before release.
