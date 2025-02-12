module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'custom-properties': false
      }
    },
    tailwindcss: {},
    autoprefixer: {},
  },
}
