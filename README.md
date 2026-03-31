<p align="center">
  <img src="frontend/src/app/icon.png" width="128" height="128">
</p>

<h1 align="center">VR Rookie Downloader</h1>

<p align="center">
  🌐 <a href="README-PT.md">Português</a> | <a href="README.md">English</a>
</p>

<p align="center">
  Advanced and automated system for cataloging, downloading, and sideloading VR content from Rutracker.
</p>

<p align="center">
  <a href="https://nodejs.org/" target="_blank"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/></a>
  <a href="https://nextjs.org/" target="_blank"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/></a>
</p>

## Legal Disclaimer

**VR Rookie Downloader** is a technical indexing tool. It is imperative to understand the nature of the software:

- **Indexing Only:** This system does not host, store, or distribute any type of copyrighted content. The software works exclusively as a scraper that organizes metadata from third-party sources (Rutracker Forum).
- **Disclaimer:** The project is provided "as is", without warranties of any kind. The use of this tool to access or download content is the sole and exclusive responsibility of the end user.
- **Intellectual Property:** We respect intellectual property rights. If you are the owner of any content and wish for it not to be accessible through standard search means, please contact the original indexed sources.
- **Development:** This application was built with the help of AI tools for code and design optimization.
- **Purpose:** The software was designed to facilitate the organization of personal VR libraries and technical studies of systems automation.

## TLDR; Games on your VR in a few steps

1. Open the app and follow the **Initial Setup Wizard** to validate your session, dependencies (ADB/qBittorrent) and language.
2. Start the indexer to build your catalog.
3. Choose a game, download via qBitTorrent, and install on Quest via USB.

## Dynamic Features

### Rutracker Link Indexing

**Automated metadata capture directly from the original forum**

- Extraction of **Genre**, **Version**, **Developer**, and **Seeds/Leechers** statistics.
- **Multi-language System:** Interface available in **English (default)** and **Portuguese**, with dynamic switching in settings.
- **Flexible Translation:** Choose the destination language for game translations (English or Portuguese).
- **Optimized Interface:** Toggle button to hide/show the filter sidebar to focus on game viewing.

### Download Management

**Full integration with qBitTorrent Web UI**

- Remote control of downloads.
- Real-time progress monitoring directly in the library.
- Automatic synchronization between physical files on the HDD and the database.

### Sideloading

**Native installation via ADB (Android Debug Bridge)**

- Automated transfer of APK files and data folders (OBB).
- Support for multiple devices detected via USB.

## 🛠️ Installation

> **Note:** The project currently works best on Windows. MacOS support is experimental (sideloading requires manual ADB configuration).

### 1. Pre-requisites

- **[Node.js](https://nodejs.org/)** (v18.x or higher)
- **[Git](https://git-scm.com/)**

### 2. Automatic Setup (Windows)

Clone the repository and run the setup script. The script will automatically check for Node.js, install project dependencies, and optionally download and configure **ADB** and **qBitTorrent** for you!

```powershell
git clone https://github.com/yGuilhermy/VRRookieDownloader.git
cd VRRookieDownloader
.\setup.bat
```

_(During the setup, you will be prompted to automatically install qBitTorrent if it's not found on your system.)_

### 3. qBitTorrent Configuration

If you installed qBitTorrent manually or want to verify the auto-installation, you **MUST** enable the Web UI:

1. Open qBitTorrent and go to `Tools` -> `Options` -> `Web UI`.
2. Check **Web User Interface (Remote Control)**.
3. IP Address: `127.0.0.1` | Port: `8080` (Default).
4. Authentication: Username `admin` | Password `adminadmin`. _(If you change the password, you must update the `loginQbit` function in `backend/src/index.ts`)_.
5. _(Optional)_ Check **Bypass authentication for clients on localhost** for a smoother experience.

### 4. Running the App

```powershell
.\start.bat
```

_Run as Administrator if you want to use the local domain `http://vrrookie.local` to access it from other devices on your network._

## 🎮 Usage Guide

### 1. Setup Wizard

Upon first launching, the **Setup Wizard** will greet you. It automatically validates your environment:

- Verifies if **ADB** is globally available for sideloading.
- Tests the connection to your **qBitTorrent Web UI**.
- Validates the **RuTracker** session (handling background login and captchas).
- Sets your global **Games Download Folder**.

### 2. Browsing and Downloading

- Use the **Filter Sidebar** to search by genres, developers, or text. You can toggle the sidebar visibility for a wider, distraction-free view.
- Click a game card to see complete details and translated descriptions.
- Click **Download on Server** to send the magnet link directly to qBitTorrent. The UI will show real-time progress.

### 3. Sideloading to Quest

- Once the download hits 100%, the card button will change to **Install on Quest**.
- Connect your Meta Quest via USB (ensure Developer Mode and USB Debugging are active).
- Click the install button or navigate to the **Sideloading** tab to manage multiple local APKs/OBBs at once. The app will automatically push `.apk` and `.obb` files to the headset.

### 4. Using an External Torrent Client (Optional)

If you opted not to install or use qBitTorrent, you can download games using any other P2P client:

1. On the game details page, click **Download Local** to open the magnet link in your default torrent app.
2. Once the download is completely finished, move or copy the game folder to your configured **Global Games Folder**.
3. Go to the **My Games (Sideloading)** tab in the app and turn on "Show Folders" (Update Local Files).
4. Find the newly added folder in the list, click on it, and select **Index Game** to manually link it. The install button will then become available!

## ☑️ To-Do (Maybe)

- [ ] Pre-compiled portable version.
- [ ] Add support for multiple indexing sources beyond RuTracker.
- [ ] Implement MacOS/Linux native setup scripts (`setup.sh`).
- [ ] Add a native torrent downloader.
- [x] Background RuTracker captcha bypassing.
- [x] Multi-language support (English/Portuguese).

## Technical Stack

| Layer             | Technology                                       |
| :---------------- | :----------------------------------------------- |
| **Frontend**      | Next.js 15 (App Router), Tailwind CSS, Shadcn UI |
| **Backend**       | Node.js, Express, TypeScript                     |
| **Persistence**   | SQLite (Better-SQLite3)                          |
| **Automation**    | Puppeteer Stealth, Cheerio, ADB Tools            |
| **Communication** | Socket.io, React Query, Zustand                  |

---

_Manage your local VR library efficiently and automatically._
