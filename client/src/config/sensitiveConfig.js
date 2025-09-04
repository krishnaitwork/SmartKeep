// Configuration for sensitive content masking
export const sensitiveConfig = {
  // Keywords that should trigger masking when followed by : or =
  sensitiveKeywords: [
    'password',
    'pwd',
    'pass',
    'pin',
    'secret',
    'key',
    'token',
    'auth',
    'api_key',
    'apikey',
    'private_key',
    'privatekey',
    'access_token',
    'refresh_token',
    'session',
    'cookie',
    'jwt',
    'otp',
    'cvv',
    'ssn',
    'social_security',
    'credit_card',
    'card_number',
    'account_number',
    'routing_number',
    'bank_account',
    'license',
    'passport',
    'id_number',
    'phone',
    'mobile',
    'email_password',
    'wifi_password',
    'database_password',
    'admin_password',
    'user_password',
    'login_password',
    'encryption_key'
  ],

  // Separators that indicate a value follows the keyword
  separators: [':', '=', '->', '=>', ' is ', ' = ', ' : '],

  // Mask character to use for hiding sensitive data
  maskCharacter: '•',

  // Number of mask characters to show
  maskLength: 8,

  // Whether to show partial content (first and last characters)
  showPartial: false,

  // Number of characters to show at start and end if showPartial is true
  partialLength: 2,

  // Custom patterns for specific formats
  customPatterns: [
    {
      name: 'credit_card',
      pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
      replacement: '**** **** **** ****'
    },
    {
      name: 'ssn',
      pattern: /\b\d{3}-?\d{2}-?\d{4}\b/g,
      replacement: '***-**-****'
    },
    {
      name: 'phone',
      pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
      replacement: '***-***-****'
    },
    {
      name: 'email',
      pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      replacement: (match) => {
        const [local, domain] = match.split('@');
        const maskedLocal = local.charAt(0) + '***' + local.charAt(local.length - 1);
        const maskedDomain = domain.charAt(0) + '***' + domain.slice(-4);
        return `${maskedLocal}@${maskedDomain}`;
      }
    }
  ],

  // Whether masking is enabled globally
  enabled: true,

  // Whether to mask in search results
  maskInSearch: true,

  // Whether to show unmask option in UI
  allowUnmask: true
};

// Function to check if content contains sensitive keywords
export const hasSensitiveContent = (content) => {
  if (!content || !sensitiveConfig.enabled) return false;

  const lowerContent = content.toLowerCase();
  
  // Check for sensitive keywords followed by separators
  for (const keyword of sensitiveConfig.sensitiveKeywords) {
    for (const separator of sensitiveConfig.separators) {
      if (lowerContent.includes(keyword.toLowerCase() + separator.toLowerCase())) {
        return true;
      }
    }
  }

  // Check custom patterns
  for (const pattern of sensitiveConfig.customPatterns) {
    if (pattern.pattern.test(content)) {
      return true;
    }
  }

  return false;
};

// Function to mask sensitive content
export const maskSensitiveContent = (content, isUnmasked = false) => {
  if (!content || !sensitiveConfig.enabled || isUnmasked) return content;

  let maskedContent = content;

  // Apply keyword-based masking
  for (const keyword of sensitiveConfig.sensitiveKeywords) {
    for (const separator of sensitiveConfig.separators) {
      const regex = new RegExp(
        `(${keyword})${separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*([^\\s\\n\\r]+)`,
        'gi'
      );
      
      maskedContent = maskedContent.replace(regex, (match, keywordPart, valuePart) => {
        const maskStr = sensitiveConfig.maskCharacter.repeat(sensitiveConfig.maskLength);
        
        if (sensitiveConfig.showPartial && valuePart.length > sensitiveConfig.partialLength * 2) {
          const start = valuePart.substring(0, sensitiveConfig.partialLength);
          const end = valuePart.substring(valuePart.length - sensitiveConfig.partialLength);
          return `${keywordPart}${separator}${start}${maskStr}${end}`;
        }
        
        return `${keywordPart}${separator}${maskStr}`;
      });
    }
  }

  // Apply custom pattern masking
  for (const pattern of sensitiveConfig.customPatterns) {
    if (typeof pattern.replacement === 'function') {
      maskedContent = maskedContent.replace(pattern.pattern, pattern.replacement);
    } else {
      maskedContent = maskedContent.replace(pattern.pattern, pattern.replacement);
    }
  }

  return maskedContent;
};

// Function to update configuration
export const updateSensitiveConfig = (newConfig) => {
  Object.assign(sensitiveConfig, newConfig);
};

// Function to add custom keywords
export const addSensitiveKeywords = (keywords) => {
  if (Array.isArray(keywords)) {
    sensitiveConfig.sensitiveKeywords.push(...keywords);
  } else {
    sensitiveConfig.sensitiveKeywords.push(keywords);
  }
  // Remove duplicates
  sensitiveConfig.sensitiveKeywords = [...new Set(sensitiveConfig.sensitiveKeywords)];
};

// Function to remove keywords
export const removeSensitiveKeywords = (keywords) => {
  const keywordsToRemove = Array.isArray(keywords) ? keywords : [keywords];
  sensitiveConfig.sensitiveKeywords = sensitiveConfig.sensitiveKeywords.filter(
    keyword => !keywordsToRemove.includes(keyword)
  );
};

// Function to add custom patterns
export const addCustomPattern = (name, pattern, replacement) => {
  const existingIndex = sensitiveConfig.customPatterns.findIndex(p => p.name === name);
  if (existingIndex >= 0) {
    sensitiveConfig.customPatterns[existingIndex] = { name, pattern, replacement };
  } else {
    sensitiveConfig.customPatterns.push({ name, pattern, replacement });
  }
};

export default sensitiveConfig;
