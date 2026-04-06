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

saveBtn.addEventListener('click', async () => {
  const whitelist = whitelistInput.value
    .split('\n')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  await Storage.saveSettings({
    subdomain: subdomainInput.value.trim(),
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
