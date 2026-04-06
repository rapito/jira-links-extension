const subdomainInput = document.getElementById('subdomain');
const whitelistInput = document.getElementById('whitelist');
const enabledInput = document.getElementById('enabled');
const saveBtn = document.getElementById('save');
const resetBtn = document.getElementById('reset');
const statusEl = document.getElementById('status');

async function loadSettings() {
  const s = await Storage.getSettings();
  subdomainInput.value = s.subdomain;
  whitelistInput.value = s.whitelist.join('\n');
  enabledInput.checked = s.enabled;
}

function flashStatus(msg) {
  statusEl.textContent = msg;
  statusEl.classList.add('visible');
  setTimeout(() => statusEl.classList.remove('visible'), 2000);
}

function isValidSubdomain(val) {
  if (!val) return true;
  return /^[a-z0-9]([a-z0-9\-]*[a-z0-9])?$/i.test(val);
}

saveBtn.addEventListener('click', async () => {
  const subdomain = subdomainInput.value.trim()
    .replace(/\.atlassian\.net\/?$/, '')
    .replace(/^https?:\/\//, '');

  if (subdomain && !isValidSubdomain(subdomain)) {
    flashStatus('Invalid subdomain — letters, digits, hyphens only');
    statusEl.style.color = '#DE350B';
    setTimeout(() => { statusEl.style.color = ''; }, 2000);
    return;
  }

  const whitelist = whitelistInput.value
    .split('\n')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  await Storage.saveSettings({
    subdomain,
    whitelist,
    enabled: enabledInput.checked
  });
  flashStatus('Saved!');
});

resetBtn.addEventListener('click', async () => {
  await Storage.saveSettings(DEFAULT_SETTINGS);
  await loadSettings();
  flashStatus('Defaults restored');
});

loadSettings();
