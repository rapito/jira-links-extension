const Storage = {
  get(keys) {
    return new Promise((resolve) => {
      const api = typeof browser !== 'undefined' ? browser : chrome;
      api.storage.sync.get(keys, resolve);
    });
  },

  set(data) {
    return new Promise((resolve) => {
      const api = typeof browser !== 'undefined' ? browser : chrome;
      api.storage.sync.set(data, resolve);
    });
  },

  async getSettings() {
    const data = await this.get(DEFAULT_SETTINGS);
    return {
      subdomain: data.subdomain || '',
      whitelist: data.whitelist || DEFAULT_WHITELIST,
      enabled: data.enabled !== false
    };
  },

  saveSettings(settings) {
    return this.set(settings);
  }
};
