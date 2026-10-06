<p align="center">
  <img src="media/icon.png" height="100px">
</p>

<samp>
  <h1 align="center">Emulator in VS Code Panel</h1>
</samp>

<h4 align="center">
  <samp>VS Code extension that runs the Android Emulator and the iOS Simulator headless <br> and controls the device screen inside the sidebar, like Android Studio's "Running Devices".</samp>
</h4>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=izakdvlpr.vscode-emulator-panel"><img src="https://raw.githubusercontent.com/izakdvlpr/emulator-in-vscode-panel/main/media/marketplace-badge.png" height="56" alt="Download on the VS Code Marketplace"></a>
  <a href="https://open-vsx.org/extension/izakdvlpr/vscode-emulator-panel"><img src="https://raw.githubusercontent.com/izakdvlpr/emulator-in-vscode-panel/main/media/openvsx-badge.png" height="56" alt="Download on the Open VSX Registry"></a>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=izakdvlpr.vscode-emulator-panel"><img src="https://img.shields.io/badge/Marketplace-000000?&style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZmZmZiI+PHJlY3QgeD0iMiIgeT0iNyIgd2lkdGg9IjciIGhlaWdodD0iNyIgcng9IjEiLz48cmVjdCB4PSIyIiB5PSIxNSIgd2lkdGg9IjciIGhlaWdodD0iNyIgcng9IjEiLz48cmVjdCB4PSIxMCIgeT0iMTUiIHdpZHRoPSI3IiBoZWlnaHQ9IjciIHJ4PSIxIi8+PHJlY3QgeD0iMTMiIHk9IjIiIHdpZHRoPSI3IiBoZWlnaHQ9IjciIHJ4PSIxIiB0cmFuc2Zvcm09InJvdGF0ZSgxNSAxNi41IDUuNSkiLz48L3N2Zz4K"></a>
  <a href="https://emulator-in-vscode-panel.vercel.app/"><img src="https://img.shields.io/badge/Documentation-000000?&style=for-the-badge&logo=readthedocs&logoColor=ffffff"></a>
  <a href="https://github.com/izakdvlpr/emulator-in-vscode-panel"><img src="https://img.shields.io/badge/Github-000000?&style=for-the-badge&logo=github&logoColor=ffffff"></a>
  <a href="https://github.com/izakdvlpr/emulator-in-vscode-panel/issues"><img src="https://img.shields.io/badge/Issues-000000?&style=for-the-badge&logo=github&logoColor=ffffff"></a>
  <br>
  <a href="https://emulator-in-vscode-panel.vercel.app/en/docs/requirements"><img src="https://img.shields.io/badge/Android-000000?&style=for-the-badge&logo=android&logoColor=ffffff"></a>
  <a href="https://emulator-in-vscode-panel.vercel.app/en/docs/ios"><img src="https://img.shields.io/badge/iOS-000000?&style=for-the-badge&logo=apple&logoColor=ffffff"></a>
</p>

<p align="center">
  <img src="docs/public/example.gif" alt="Emulator: Device panel running a Pixel 10 inside VS Code" width="660">
</p>

## <samp>Install</samp>

<samp>Install it from the <a href="https://marketplace.visualstudio.com/items?itemName=izakdvlpr.vscode-emulator-panel">VS Code Marketplace</a>, search for <code>izakdvlpr.vscode-emulator-panel</code> in the Extensions view, or run:</samp>

```bash
code --install-extension izakdvlpr.vscode-emulator-panel
```

<samp>The Emulator icon shows up in the Activity Bar. To build from source instead:</samp>

```bash
bun install
bun run install:local   # build + .vsix + install into VS Code
```

## <samp>Documentation</samp>

<samp>

- [Requirements](https://emulator-in-vscode-panel.vercel.app/en/docs/requirements): What needs to be installed before the first build.
- [Install](https://emulator-in-vscode-panel.vercel.app/en/docs/install): The Marketplace, or a local `.vsix` build from source.
- [Usage](https://emulator-in-vscode-panel.vercel.app/en/docs/usage): Open the panel, boot a device and run several at once.
- [Controls](https://emulator-in-vscode-panel.vercel.app/en/docs/controls): Touch, gestures, device buttons, keyboard, clipboard and where the screen can live.
- [Settings](https://emulator-in-vscode-panel.vercel.app/en/docs/settings): Extension settings, read straight from the manifest.
- [Scripts](https://emulator-in-vscode-panel.vercel.app/en/docs/scripts): The `package.json` scripts and what each one does.
- [How it works](https://emulator-in-vscode-panel.vercel.app/en/docs/architecture): From the emulator process to the webview canvas: video, input, attach and clipboard.
- [iOS Simulator](https://emulator-in-vscode-panel.vercel.app/en/docs/ios): The Swift helper, Xcode private frameworks and the same video path as Android.
- [Shutdown](https://emulator-in-vscode-panel.vercel.app/en/docs/shutdown): Stop, Detach, closing the window and what happens if the extension host dies.
- [Known limitations](https://emulator-in-vscode-panel.vercel.app/en/docs/limitations): What does not work yet and where behaviour comes from Android or Xcode.
- [Roadmap](https://emulator-in-vscode-panel.vercel.app/en/docs/roadmap): What landed in phases 2 and 3, what was dropped and what comes next.

</samp>
