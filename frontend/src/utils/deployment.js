// Pages is a public showcase unless an external API is explicitly enabled.
export const API_ENABLED = import.meta.env.VITE_API_ENABLED === 'true' ||
  (import.meta.env.VITE_API_ENABLED !== 'false' && import.meta.env.MODE !== 'pages');
