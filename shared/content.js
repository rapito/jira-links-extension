(() => {
  let popup = null;
  let hideTimeout = null;
  let settings = null;

  function createPopup() {
    const el = document.createElement('div');
    el.id = 'jira-link-popup';
    el.style.cssText = `
      position: fixed;
      z-index: 2147483647;
      background: #0052CC;
      color: #fff;
      padding: 6px 12px;
      border-radius: 4px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      pointer-events: auto;
      display: none;
      max-width: 360px;
      line-height: 1.4;
    `;
    document.body.appendChild(el);
    return el;
  }

  function sanitizeSubdomain(raw) {
    const stripped = raw.replace(/\.atlassian\.net\/?$/, '').replace(/^https?:\/\//, '');
    if (!/^[a-z0-9][a-z0-9\-]*[a-z0-9]$/i.test(stripped) && !/^[a-z0-9]$/i.test(stripped)) {
      return null;
    }
    return stripped;
  }

  function getJiraUrl(ticket) {
    if (!settings || !settings.subdomain) return null;
    const sub = sanitizeSubdomain(settings.subdomain);
    if (!sub) return null;
    return `https://${sub}.atlassian.net/browse/${ticket}`;
  }

  function buildPopupContent(ticket, url) {
    const frag = document.createDocumentFragment();

    if (!url) {
      const strong = document.createElement('strong');
      strong.textContent = ticket;
      const br = document.createElement('br');
      const hint = document.createElement('span');
      hint.style.cssText = 'font-size:11px;opacity:0.8';
      hint.textContent = 'Set Jira subdomain in extension settings';
      frag.appendChild(strong);
      frag.appendChild(br);
      frag.appendChild(hint);
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.style.cssText = 'color:#fff;text-decoration:none;display:flex;align-items:center;gap:6px';

      const globe = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      globe.setAttribute('width', '16');
      globe.setAttribute('height', '16');
      globe.setAttribute('viewBox', '0 0 24 24');
      globe.innerHTML = '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#fff"/>';

      const label = document.createElement('span');
      const bold = document.createElement('strong');
      bold.textContent = ticket;
      label.appendChild(bold);
      label.append(' \u2014 Open in Jira');

      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('width', '12');
      arrow.setAttribute('height', '12');
      arrow.setAttribute('viewBox', '0 0 24 24');
      arrow.style.opacity = '0.7';
      arrow.innerHTML = '<path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" fill="#fff"/>';

      a.appendChild(globe);
      a.appendChild(label);
      a.appendChild(arrow);
      frag.appendChild(a);
    }

    return frag;
  }

  function showPopup(ticket, x, y) {
    if (!popup) popup = createPopup();
    clearTimeout(hideTimeout);

    const url = getJiraUrl(ticket);
    popup.textContent = '';
    popup.appendChild(buildPopupContent(ticket, url));

    popup.style.display = 'block';

    const rect = popup.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = x + 10;
    let top = y - rect.height - 10;

    if (left + rect.width > vw - 10) left = vw - rect.width - 10;
    if (left < 10) left = 10;
    if (top < 10) top = y + 20;
    if (top + rect.height > vh - 10) top = vh - rect.height - 10;

    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
  }

  function hidePopup() {
    hideTimeout = setTimeout(() => {
      if (popup) popup.style.display = 'none';
    }, 200);
  }

  function isWhitelisted(whitelist) {
    const host = window.location.hostname;
    return whitelist.some((domain) => host === domain || host.endsWith('.' + domain));
  }

  function getTextNodeAtPoint(x, y) {
    if (document.caretRangeFromPoint) {
      const range = document.caretRangeFromPoint(x, y);
      if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
        return range.startContainer;
      }
    } else if (document.caretPositionFromPoint) {
      const pos = document.caretPositionFromPoint(x, y);
      if (pos && pos.offsetNode && pos.offsetNode.nodeType === Node.TEXT_NODE) {
        return pos.offsetNode;
      }
    }
    return null;
  }

  function findTicketAtPoint(x, y) {
    const node = getTextNodeAtPoint(x, y);
    if (!node) return null;

    const text = node.textContent;
    const regex = new RegExp(JIRA_TICKET_REGEX.source, 'g');
    let match;

    while ((match = regex.exec(text)) !== null) {
      const range = document.createRange();
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      const rect = range.getBoundingClientRect();

      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return match[1];
      }
    }
    return null;
  }

  let lastTicket = null;

  function onMouseMove(e) {
    // Skip detection if hovering over popup
    if (popup && popup.style.display !== 'none') {
      const rect = popup.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        return;
      }
    }

    const ticket = findTicketAtPoint(e.clientX, e.clientY);
    if (ticket) {
      if (ticket !== lastTicket) {
        lastTicket = ticket;
        showPopup(ticket, e.clientX, e.clientY);
      }
    } else if (lastTicket) {
      lastTicket = null;
      hidePopup();
    }
  }

  async function init() {
    settings = await Storage.getSettings();

    if (!settings.enabled) return;
    if (!isWhitelisted(settings.whitelist)) return;

    document.addEventListener('mousemove', onMouseMove, { passive: true });

    document.addEventListener('mouseover', (e) => {
      if (popup && e.target === popup || popup?.contains(e.target)) {
        clearTimeout(hideTimeout);
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (popup && (e.target === popup || popup?.contains(e.target))) {
        hidePopup();
      }
    });
  }

  init();
})();
