# Kotatsu-dl GUI (Modernized)

Cross-platform desktop application to download manga from various services, featuring a modern Material 3 design and responsive layout system.

[![AUR version](https://img.shields.io/aur/version/kotatsu-dl-git)](https://aur.archlinux.org/packages/kotatsu-dl-git) [![License](https://img.shields.io/github/license/nv95/Kotatsu)](https://github.com/nv95/kotatsu-dl/blob/master/LICENSE) [![Discord](https://img.shields.io/discord/898363402467045416?color=5865f2&label=discord)](https://discord.gg/NNJ5RgVBC5)

![Screenshot](metadata/scr1.png)

## ✨ Recent Updates

This fork includes significant UI/UX modernization:

- **🎨 Material 3 Design**: Updated with modern Material Design 3 color schemes and typography
- **📱 Responsive Layout**: Adaptive grid system that adjusts to different window sizes
- **🔧 Updated Dependencies**: 
  - Gradle 8.5
  - Compose Desktop 1.5.12
  - Java 21 support
- **💫 Enhanced UI Components**: Better spacing, typography, and visual hierarchy
- **🌙 Improved Themes**: Refined light and dark mode color schemes

### Current Status
- ✅ Modern Material 3 design implementation
- ✅ Responsive breakpoint system (Compact/Medium/Expanded)
- ✅ Updated build system and dependencies
- 🔄 **In Progress**: Layout alignment improvements and single-window navigation

### Installation

#### Requirements
- Java 21 or later
- Modern desktop environment (Windows 10+, macOS 10.14+, or Linux with X11/Wayland)

#### Arch linux

Package `kotatsu-dl-git` is available on AUR:

```shell
yay -S kotatsu-dl-git
```

#### Windows or other Linux distro

Just download an appropriate archive from the [latest release](https://github.com/nv95/kotatsu-dl/releases/latest).

#### Building from Source

This modernized version requires:
```shell
# Clone the repository
git clone https://github.com/renzaspiras/kotatsu-dl-gui.git
cd kotatsu-dl-gui

# Build the application
./gradlew packageDeb  # For Debian/Ubuntu
./gradlew packageRpm  # For RedHat/Fedora
./gradlew package     # For other platforms
```

### Features

- **📚 Multi-source Support**: Download manga from various online sources
- **💾 Multiple Formats**: Export as CBZ archives or organized folders
- **🔍 Advanced Search**: Find manga across different platforms
- **📱 Responsive Design**: Adapts to different window sizes and screen densities
- **🌙 Theme Support**: Light and dark modes with Material 3 design
- **⚡ Performance**: Optimized download management with progress tracking

### License
[![GNU GPLv3 Image](https://www.gnu.org/graphics/gplv3-127x51.png)](http://www.gnu.org/licenses/gpl-3.0.en.html)

Kotatsu is Free Software: You can use, study share and improve it at your
will. Specifically you can redistribute and/or modify it under the terms of the
[GNU General Public License](https://www.gnu.org/licenses/gpl.html) as
published by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

### DMCA disclaimer

The developers of this application have no affiliation with the content available in the app. It is collected from sources freely available through any web browser.