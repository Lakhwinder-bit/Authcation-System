// utils/validation.js

// valid top-level domains (expand as needed)
const VALID_TLDS = [
  "com", "in", "org", "net", "edu", "gov", "io", "co",
  "info", "biz", "me", "dev", "app", "ai", "uk", "us",
  "ca", "au", "de", "fr", "jp", "cn", "br", "mx", "ru",
  "pk", "ng", "za", "sg", "ae", "nz", "se", "no", "fi",
  "dk", "nl", "be", "ch", "at", "es", "it", "pt", "pl",
];

// known disposable / fake email domains to block
const BLOCKED_DOMAINS = [
  "mailinator.com", "tempmail.com", "throwaway.email",
  "guerrillamail.com", "yopmail.com", "sharklasers.com",
  "trashmail.com", "fakeinbox.com", "dispostable.com",
  "maildrop.cc", "spamgourmet.com", "mintemail.com",
  "tempr.email", "temp-mail.org", "mailnull.com",
];

export const validateForm = (data, isLogin) => {
  const errors = {};

  // ── username (register only) ──────────────────────────
  if (!isLogin) {
    if (!data.username || data.username.trim() === "") {
      errors.username = "Full name is required.";
    }
  }

  // ── email ─────────────────────────────────────────────
  const email = (data.email || "").trim().toLowerCase();

  if (!email) {
    errors.email = "Email is required.";
  } else if (email.length > 254) {
    errors.email = "Email address is too long.";
  } else if ((email.match(/@/g) || []).length !== 1) {
    // must have exactly one @
    errors.email = "Enter a valid email address.";
  } else {
    const [local, domain] = email.split("@");

    if (!local || local.length < 1) {
      errors.email = "Enter the part before @.";
    } else if (local.length > 64) {
      errors.email = "The part before @ is too long.";
    } else if (!/^[a-zA-Z0-9._%+\-]+$/.test(local)) {
      errors.email = "Email contains invalid characters before @.";
    } else if (local.startsWith(".") || local.endsWith(".")) {
      errors.email = "Email cannot start or end with a dot.";
    } else if (local.includes("..")) {
      errors.email = "Email cannot have two consecutive dots.";
    } else if (!domain || !domain.includes(".")) {
      errors.email = "Enter a valid domain (e.g. gmail.com).";
    } else {
      const domainParts = domain.split(".");
      const tld = domainParts[domainParts.length - 1];
      const domainName = domainParts.slice(0, -1).join(".");

      if (!domainName || domainName.length < 2) {
        errors.email = "Enter a valid domain name.";
      } else if (!/^[a-zA-Z0-9\-]+$/.test(domainName.replace(/\./g, ""))) {
        errors.email = "Domain contains invalid characters.";
      } else if (!tld || tld.length < 2) {
        errors.email = "Enter a valid domain ending (e.g. .com, .in).";
      } else if (!VALID_TLDS.includes(tld)) {
        errors.email = `".${tld}" is not a recognised domain. Try .com, .in, .org etc.`;
      } else if (BLOCKED_DOMAINS.includes(domain)) {
        errors.email = "Temporary or disposable emails are not allowed.";
      }
    }
  }

  // ── password ──────────────────────────────────────────
  if (!data.password || data.password.trim() === "") {
    errors.password = "Password is required.";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
};