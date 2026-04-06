const JIRA_TICKET_REGEX = /\b([A-Z][A-Z0-9]+-\d+)\b/g;

const DEFAULT_WHITELIST = [
  'github.com',
  'gitlab.com',
  'bitbucket.org',
  'dev.azure.com',
  'stackoverflow.com',
  'slack.com',
  'notion.so',
  'confluence.atlassian.net',
  'linear.app'
];

const DEFAULT_SETTINGS = {
  subdomain: '',
  whitelist: DEFAULT_WHITELIST,
  enabled: true
};
