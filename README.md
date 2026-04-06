# Jira Links

Browser extension that detects Jira ticket IDs on web pages and shows a hover popup with a direct link to your Jira instance. No DOM modification — original page content stays intact.

Works on Chrome, Firefox, and Edge.

![Jira Blue](https://img.shields.io/badge/Jira-0052CC?style=flat&logo=jira&logoColor=white)

## Features

- **Hover Detection** — hover over any ticket ID (e.g. `GP-123`, `PROJ-4567`) to get a clickable Jira link
- **Non-Invasive** — floating popup only, page content is never modified
- **Domain Whitelist** — only activates on configured sites (GitHub, GitLab, Bitbucket, etc. by default)
- **Cross-Browser** — single shared codebase, works on Chrome, Firefox, and Edge
- **Settings Page** — configure your Jira subdomain and allowed sites with a clean Jira-themed UI
- **Zero Dependencies** — plain JavaScript, no build tools required beyond a shell script

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
2. Enter your Jira **subdomain** — just the prefix, e.g. `mycompany` for `mycompany.atlassian.net`
3. Review the **domain whitelist** — add or remove sites where ticket detection should be active
4. Click **Save Settings**

## Default Whitelisted Sites

- github.com
- gitlab.com
- bitbucket.org
- dev.azure.com
- stackoverflow.com
- slack.com
- notion.so
- confluence.atlassian.net
- linear.app

## How It Works

Content script listens for mouse movement on whitelisted pages. When cursor hovers over text matching the Jira ticket pattern (`[A-Z][A-Z0-9]+-\d+`), a popup appears above the cursor with a direct link to `{subdomain}.atlassian.net/browse/{ticket}`.

Detection uses `document.caretRangeFromPoint` (Chrome/Edge) and `caretPositionFromPoint` (Firefox) to identify the exact text under the cursor without scanning or modifying the DOM.

## Building

```sh
./build.sh
```

Copies shared source files and icons into each browser's folder. Run after any edit to files in `shared/`.

## Project Structure

```
shared/          Shared source — all logic lives here
  constants.js   Ticket regex, default whitelist
  storage.js     Cross-browser storage abstraction
  content.js     Content script — hover detection + popup
  settings.html  Options page (Jira-themed)
  settings.js    Options page logic
chrome/          Chrome extension (Manifest V3)
firefox/         Firefox extension (Manifest V2)
edge/            Edge extension (Manifest V3)
icons/           Extension icons
build.sh         Copies shared code into browser folders
```

## License

MIT
