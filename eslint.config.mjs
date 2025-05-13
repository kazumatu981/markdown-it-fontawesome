// @ts-check

import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsdoc from 'eslint-plugin-jsdoc';

const namingRules = [
    {
        selector: 'default',
        format: ['camelCase'],
    },

    {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
    },
    {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
    },

    {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
    },
    {
        selector: 'memberLike',
        modifiers: ['protected'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
    },
    {
        selector: 'typeLike',
        format: ['PascalCase'],
    },

    {
        selector: 'typeParameter',
        format: ['PascalCase'],
        prefix: ['T'],
    },
];

const srcConfig = tseslint.config({
    files: ['lib/**/*.{ts,tsx}'],
    extends: [eslint.configs.recommended, tseslint.configs.strict],
    plugins: {
        jsdoc,
    },
    languageOptions: {
        globals: {
            ...globals.node,
        },
        parserOptions: {
            project: './tsconfig.lint.json',
        },
    },

    rules: {
        // about code metrics
        'max-lines-per-function': ['error', 300],
        'max-lines': ['error', 300],
        'max-len': ['error', { code: 120, ignoreComments: true }],
        'max-statements-per-line': ['error', { max: 1 }],
        'max-statements': ['error', 30],
        'max-nested-callbacks': ['error', 3],
        'max-params': ['error', 5],
        'max-depth': ['error', 5],
        complexity: ['error', 15],
        // about redundancy
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                args: 'all',
                argsIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            },
        ],
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
        '@typescript-eslint/consistent-type-exports': 'warn',
        '@typescript-eslint/naming-convention': ['warn', ...namingRules],
        // no debugging code
        'no-console': 'warn',
        'jsdoc/require-jsdoc': [
            'warn',
            {
                publicOnly: true,
                require: {
                    ArrowFunctionExpression: true,
                    ClassDeclaration: true,
                    ClassExpression: true,
                    FunctionDeclaration: true,
                    FunctionExpression: true,
                    MethodDefinition: true,
                },
                contexts: [
                    'TSInterfaceDeclaration',
                    'TSTypeAliasDeclaration',
                    'TSPropertySignature',
                    'TSMethodSignature',
                ],
            },
        ],
        'jsdoc/check-tag-names': [
            'warn',
            {
                definedTags: ['group'],
            },
        ],
        'jsdoc/require-param-type': 'off',
        'jsdoc/require-returns-type': 'off',
        'jsdoc/require-yields': 'off',
    },
});

export default [
    {
        ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'demo/**'],
    },
    jsdoc.configs['flat/recommended'],
    ...srcConfig,
];
