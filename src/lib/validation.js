export function validatePublicUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'Enter a valid HTTP or HTTPS website URL.' };
  }

  const cleanUrl = rawUrl.trim();
  if (!cleanUrl) {
    return { valid: false, error: 'Enter a valid HTTP or HTTPS website URL.' };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(
      /^[a-z][a-z\d+.-]*:\/\//i.test(cleanUrl)
        ? cleanUrl
        : `https://${cleanUrl}`
    );
  } catch {
    return { valid: false, error: 'That address does not look valid. Check it and try again.' };
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return { valid: false, error: 'Only HTTP and HTTPS website URLs are supported.' };
  }

  if (parsedUrl.username || parsedUrl.password) {
    return { valid: false, error: 'The URL must contain a host and cannot contain credentials.' };
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  if (!hostname.includes('.') || hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    return { valid: false, error: 'CAN cannot scan local or internal network addresses.' };
  }

  // Basic IPv4 private/loopback/link-local range check
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = hostname.match(ipv4Regex);
  if (match) {
    const p1 = parseInt(match[1], 10);
    const p2 = parseInt(match[2], 10);
    if (
      p1 === 10 ||
      (p1 === 172 && p2 >= 16 && p2 <= 31) ||
      (p1 === 192 && p2 === 168) ||
      p1 === 127 ||
      p1 === 0 ||
      p1 === 169
    ) {
      return { valid: false, error: 'CAN cannot scan private or loopback IP addresses.' };
    }
  }

  // Basic IPv6 check for loopback and private ranges
  if (hostname.includes('::1') || hostname.startsWith('[fd') || hostname.startsWith('[fc') || hostname.startsWith('[fe80') || hostname === '[::]') {
    return { valid: false, error: 'CAN cannot scan private or loopback IPv6 addresses.' };
  }

  return { valid: true, url: parsedUrl.href };
}
