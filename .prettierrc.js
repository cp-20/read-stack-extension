/**
 * @type {import('prettier').Options}
 */
module.exports = {
  printWidth: 80,
  singleQuote: true,
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    '<BUILTIN_MODULES>', // Node.js built-in modules
    '<THIRD_PARTY_MODULES>', // Imports not matched by other special words or groups.
    '', // Empty line
    '^@plasmo/(.*)$',
    '^@plasmohq/(.*)$',
    '',
    '^@/(.*)$',
    '',
    '^[./]',
  ],
};
