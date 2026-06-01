# Jira Links

Browser extension that detects Jira ticket IDs on web pages and shows a hover popup with a direct link to your Jira instance. 

Works on Chrome, Firefox, and Edge.

<img width="394" height="79" alt="image" src="https://github.com/user-attachments/assets/d473af00-3031-4191-8496-644b6071e76b" />

## Features

- **Hover Detection** hover over any ticket ID (e.g. `GP-123`, `PROJ-4567`) to get a clickable Jira link
- **Domain Whitelist** only activates on configured sites (GitHub, GitLab, Bitbucket, etc. by default)
- **Settings Page** configure your Jira subdomain and allowed sites with a clean Jira-themed UI
- **Zero Dependencies** plain JavaScript, no build tools required beyond a shell script

## Installation

### Chrome

1. Clone or download this repository
2. Run `./build.sh`
3. Open `chrome://extensions`
4. Enable **Developer mode** (top right)
5. Click **Load unpacked**
6. Select the `chrome/` folder (or `dist/chrome/` if using dist build)

### Firefox

1. Run `./build.sh`
2. Open `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on**
4. Select `firefox/manifest.json` (or `dist/firefox/manifest.json`)

### Edge

1. Run `./build.sh`
2. Open `edge://extensions`
3. Enable **Developer mode** (left sidebar)
4. Click **Load unpacked**
5. Select the `edge/` folder (or `dist/edge/`)

## Setup

1. After installing, right-click the extension icon and select **Options** (or go to the extension's settings)
2. Enter your Jira **subdomain**.
3. Review the **domain whitelist** add or remove sites where ticket detection should be active
4. Click **Save Settings**

## Building

```sh
./build.sh
```

Copies shared source files and icons into each browser's folder. Run after any edit to files in `shared/`.

## License

MIT
