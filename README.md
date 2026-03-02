# DAWNO - PAWN Editor

DAWNO is a modern, performance-oriented PAWN code editor designed specifically for SA-MP (San Andreas Multiplayer) and open.mp developers. It serves as a modern alternative to the classic Pawno editor, built using Next.js, Electron, and Monaco Editor technologies.

## Overview

Traditional PAWN editing can be cumbersome with outdated tools. DAWNO bridges this gap by providing a professional environment that mirrors the functionality and aesthetics of modern code editors like Visual Studio Code, while maintaining a lightweight footprint tailored for San Andreas modding.

## Key Features

- Modern UI/UX: A sleek, VS Code-inspired interface with native dark mode support and a premium feel.
- Advanced Monaco Editor: High-performance text editing with syntax highlighting, intelligent code completion, and smooth scrolling.
- Automated Detection: Deep scanning (up to 4 levels) to automatically identify server executables (samp-server.exe, omp-server.exe) and configuration files (server.cfg, config.json).
- Integrated Server Manager: Control your server directly from the editor with start, stop, and restart capabilities along with live console log tracking.
- Configuration Editor: A dedicated table-based interface for managing server settings without manual text editing.
- Encoding Support: Comprehensive list of character encodings, including full support for Turkish (Windows-1254) and others, with instant encoding switching.
- Discord Rich Presence: Automatically updates your Discord status to show which project and file you are currently working on.
- Multilingual Support: Built-in internationalization (i18n) supporting English, Turkish, and German out of the box.

## Technology Stack

- Core Framework: Next.js (React)
- Shell: Electron
- Editor Engine: Monaco Editor
- Encoding: iconv-lite
- Build System: Electron Packager and Inno Setup

## Installation and Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm (Node Package Manager)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/deksdeveloper/dawno.git
   cd dawno
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start in development mode:
   ```bash
   npm run dev
   ```

## Building and Packaging

DAWNO includes a custom build pipeline to generate standalone executables and professional installers.

### Creating a Distribution
To build the application for distribution:
```bash
npm run package
```
This command runs the following sequence:
1. Compiles the Next.js renderer.
2. Packages the Electron application for Windows x64.
3. Invokes the Inno Setup compiler to generate a professional setup wizard.

The resulting installer can be found in the `scripts/Output/` directory.

## Internationalization (i18n)

DAWNO supports multiple languages through a custom React Context-based i18n solution. Developers can easily extend the language support by adding new locale files in `renderer/i18n/locales/`.

Current Supported Languages:
- English
- Turkish
- German
- Arabic
- Spanish
- French
- Italian
- Japanese
- Korean
- Portuguese
- Russian
- Vietnamese
- Chinese

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Author

Developed by deksdeveloper.
For more information, visit the [GitHub repository](https://github.com/deksdeveloper/dawno).
