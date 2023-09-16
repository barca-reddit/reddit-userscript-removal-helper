module.exports = {
    root: true,
    env: {
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:react/recommended'
    ],
    plugins: [
        'react',
        '@typescript-eslint'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
            jsx: true
        },
        jsxPragma: null,
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json']
    },
    ignorePatterns: ['*.*', '!src/**/*'],
    rules: {
        'semi': ['warn', 'always'],
        'quotes': ['warn', 'single'],
        'eqeqeq': ['error', 'always', {
            'null': 'ignore'
        }],
        'no-unsafe-optional-chaining': ['error', {
            'disallowArithmeticOperators': true
        }],
        '@typescript-eslint/no-unused-vars': ['warn', {
            "argsIgnorePattern": "^_"
        }],
        '@typescript-eslint/no-floating-promises': ['error', {
            'ignoreVoid': false,
            'ignoreIIFE': false
        }],
        '@typescript-eslint/no-misused-promises': ['error', {
            'checksVoidReturn': false
        }],
        '@typescript-eslint/await-thenable': ['error'],
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        '@typescript-eslint/consistent-type-imports': ['warn', {
            'prefer': 'type-imports'
        }],
        '@typescript-eslint/consistent-type-exports': ['warn', {
            'fixMixedExportsWithInlineTypeSpecifier': true
        }],
        '@typescript-eslint/explicit-member-accessibility': ['warn', {
            'accessibility': 'explicit',
            'overrides': {
                'constructors': 'off'
            }
        }],
        'jsx-quotes': ['warn', 'prefer-single'],
        'react/jsx-tag-spacing': ['warn', {
            "closingSlash": "never",
            "beforeSelfClosing": "always",
            "afterOpening": "never",
            "beforeClosing": "never"
        }],
        'react/react-in-jsx-scope': 0,
        'react/jsx-uses-react': 0,
    }
};