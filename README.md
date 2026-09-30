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
  <a href="https://marketplace.visualstudio.com/items?itemName=izakdvlpr.vscode-emulator-panel"><img src="https://vsmarketplacebadges.dev/version-short/izakdvlpr.vscode-emulator-panel.svg?style=for-the-badge&color=75beff&labelColor=00315f"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=izakdvlpr.vscode-emulator-panel"><img src="https://vsmarketplacebadges.dev/installs-short/izakdvlpr.vscode-emulator-panel.svg?style=for-the-badge&color=75beff&labelColor=00315f"></a>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=izakdvlpr.vscode-emulator-panel"><img src="https://img.shields.io/badge/Marketplace-75beff?&style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwMzE1ZiI+PHJlY3QgeD0iMiIgeT0iNyIgd2lkdGg9IjciIGhlaWdodD0iNyIgcng9IjEiLz48cmVjdCB4PSIyIiB5PSIxNSIgd2lkdGg9IjciIGhlaWdodD0iNyIgcng9IjEiLz48cmVjdCB4PSIxMCIgeT0iMTUiIHdpZHRoPSI3IiBoZWlnaHQ9IjciIHJ4PSIxIi8+PHJlY3QgeD0iMTMiIHk9IjIiIHdpZHRoPSI3IiBoZWlnaHQ9IjciIHJ4PSIxIiB0cmFuc2Zvcm09InJvdGF0ZSgxNSAxNi41IDUuNSkiLz48L3N2Zz4K"></a>
  <a href="https://izakdvlpr.github.io/emulator-in-vscode-panel/"><img src="https://img.shields.io/badge/Documentation-75beff?&style=for-the-badge&logo=readthedocs&logoColor=00315f"></a>
  <a href="https://github.com/izakdvlpr/emulator-in-vscode-panel"><img src="https://img.shields.io/badge/Github-75beff?&style=for-the-badge&logo=github&logoColor=00315f"></a>
  <a href="https://github.com/izakdvlpr/emulator-in-vscode-panel/issues"><img src="https://img.shields.io/badge/Issues-75beff?&style=for-the-badge&logo=github&logoColor=00315f"></a>
  <br>
  <a href="https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/requirements"><img src="https://img.shields.io/badge/Android-75beff?&style=for-the-badge&logo=android&logoColor=00315f"></a>
  <a href="https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/ios"><img src="https://img.shields.io/badge/iOS-75beff?&style=for-the-badge&logo=apple&logoColor=00315f"></a>
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

- [Requirements](https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/requirements): What needs to be installed before the first build.
- [Install](https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/install): The Marketplace, or a local `.vsix` build from source.
- [Usage](https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/usage): Open the panel, boot a device and run several at once.
- [Controls](https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/controls): Touch, gestures, device buttons, keyboard, clipboard and where the screen can live.
- [Settings](https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/settings): Extension settings, read straight from the manifest.
- [Scripts](https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/scripts): The `package.json` scripts and what each one does.
- [How it works](https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/architecture): From the emulator process to the webview canvas: video, input, attach and clipboard.
- [iOS Simulator](https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/ios): The Swift helper, Xcode private frameworks and the same video path as Android.
- [Shutdown](https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/shutdown): Stop, Detach, closing the window and what happens if the extension host dies.
- [Known limitations](https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/limitations): What does not work yet and where behaviour comes from Android or Xcode.
- [Roadmap](https://izakdvlpr.github.io/emulator-in-vscode-panel/en/docs/roadmap): What landed in phases 2 and 3 and what was dropped.

</samp>
