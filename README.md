<div align="center">
**DAWNO - Professional PAWN IDE**


![Version](https://img.shields.io/badge/version-0.0.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)

**A powerful, modern IDE for SA-MP and open.mp development**

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Building](#building) • [Contributing](#contributing)

</div>

---

## Overview

DAWNO is a professional-grade PAWN code editor designed specifically for SA-MP (San Andreas Multiplayer) and open.mp developers. It serves as a modern, high-performance alternative to the classic Pawno editor, built with cutting-edge web technologies.

## Features

### 🎨 Modern Interface
- VS Code-inspired design with native dark mode
- Sleek and intuitive user experience
- Monaco Editor integration for premium text editing

### ✨ Editor Capabilities
- Advanced syntax highlighting for PAWN language
- Intelligent code completion
- Find & Replace with regex support
- Minimap navigation
- Word wrap toggle
- Go to Line functionality
- Smooth scrolling experience

### 🔧 Server Management
- Integrated server start/stop/restart controls
- Live console log tracking
- Automatic detection of server executables (samp-server.exe, omp-server.exe)
- Configuration file editor (server.cfg, config.json)

### 📦 Source Control
- Complete Git integration from sidebar
- Stage, commit, push, pull operations
- Visual diff viewer
- .gitignore management

### 🌐 Internationalization
- Built-in support for **13 languages**:
  - Arabic, Chinese, English, French, German, Italian, Japanese, Korean, Portuguese, Russian, Spanish, Turkish, Vietnamese

### 💬 Discord Integration
- Rich Presence showing current project and file
- Real-time status updates

### 🔄 Auto-Save
- Configurable auto-save with customizable delay
- Never lose your work

### 📝 Encoding Support
- Multiple character encodings
- Full Turkish (Windows-1254) support
- Instant encoding switching

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Electron** | Desktop application shell |
| **Next.js** | React-based UI framework |
| **Monaco Editor** | High-performance code editor |
| **TypeScript** | Type-safe development |
| **iconv-lite** | Character encoding conversion |

## Installation

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Steps

```bash
# Clone the repository
git clone https://github.com/deksdeveloper/dawno.git

# Navigate to project directory
cd dawno

# Install root dependencies
npm install

# Install renderer dependencies
npm run postinstall

# Start development mode
npm run dev
```

## Building

### Development Mode

```bash
# Run Next.js dev server
npm run dev:next

# Or run Electron directly with dev tools
npm run dev
```

### Production Build

```bash
# Build and package for Windows (x64)
npm run package
```

This command will:
1. Compile the Next.js renderer
2. Package the Electron application for Windows x64
3. Generate a professional installer using Inno Setup

## Project Structure

```
dawno/
├── main.js              # Electron main process
├── preload.js           # Preload script for IPC
├── package.json         # Root dependencies & scripts
├── assets/              # Application icons
├── renderer/            # Next.js frontend
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── i18n/            # Internationalization
│   ├── pawn-lib/        # PAWN language definitions
│   ├── public/          # Static assets
│   └── styles/          # Global styles
├── scripts/             # Build scripts
└── LICENSE
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ for SA-MP & open.mp developers

</div>
