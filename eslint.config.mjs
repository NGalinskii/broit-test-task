import js from '@eslint/js';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. Side effect imports at the start. For me this is important because I want to import reset.css and global styles at the top of my main file.
            ['^\\u0000'],
            // 2. `react` and packages: Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ['^react$', '^@?\\w'],
            // 3. Absolute imports and other imports such as Vue-style `@/foo`.
            // Anything not matched in another group. (also relative imports starting with "../")
            ['^@', '^'],
            // 4. relative imports from same folder "./" (I like to have them grouped together)
            ['^\\./'],
            // 5. style module imports always come last, this helps to avoid CSS order issues
            // 6. media imports
            ['^.+\\.(gif|png|svg|jpg)$'],
            ['^.+\\.(module.css|module.scss|scss)$'],
          ],
        },
      ],
    },
  }
);
