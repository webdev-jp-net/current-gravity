// stylelint.config.cjs
module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order'],
  customSyntax: 'postcss-scss',
  plugins: ['stylelint-order'],
  // TSXファイルをlintの対象から除外
  ignoreFiles: ['**/*.tsx', '**/*.ts', '**/*.js', '**/*.jsx'],
  rules: {
    'value-keyword-case': [
      'lower',
      {
        ignoreKeywords: [/.*/],
      },
    ],
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'use',
          'forward',
          'include',
          'mixin',
          'function',
          'return',
          'for',
          'each',
          'if',
          'else',
        ],
      },
    ],
    // パーシャルのインポートに関するルールを無効化
    'scss/load-no-partial-leading-underscore': null,

    // クラス名のパターンに関するルールを無効化
    'selector-class-pattern': null,

    // ミックスイン名のパターンに関するルールを無効化
    'scss/at-mixin-pattern': null,
    
    // 変数名のパターンに関するルールを無効化
    'scss/dollar-variable-pattern': null,
    
    // @if null チェックのルールを無効化
    'scss/at-if-no-null': null,

    // TSXファイルのCSSシンタックスエラーを回避するための設定
    'no-invalid-position-at-import-rule': null,

    // ベンダープレフィックスの制御
    'property-no-vendor-prefix': [true, { ignoreProperties: ['background-clip'] }],

    // カラー・命名パターン
    'color-hex-length': 'short',
    'custom-property-pattern': null,
    'function-no-unknown': null,
    'keyframes-name-pattern': null,
    'length-zero-no-unit': true,

    // その他のプロジェクト固有のルール
    'order/order': [
      'custom-properties',
      'dollar-variables',
      {
        type: 'at-rule',
        name: 'extend',
      },
      {
        type: 'at-rule',
        name: 'include',
      },
      'declarations',
      {
        type: 'at-rule',
        name: 'include',
        parameter: '^mq',
      },
      {
        type: 'at-rule',
        name: 'include',
        parameter: '^cq',
      },
      {
        type: 'at-rule',
        name: 'media',
      },
      'rules',
    ],
  },
}