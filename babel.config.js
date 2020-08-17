module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      polyfills: [
        'es.array.fill',
        'es.array.iterator',
        'es.object.assign',
        'es.object.keys',
        'es.promise',
        'es.string.includes',
        'es.symbol',
        'es.array.includes',
        'es.object.entries',
        'es.promise.finally',
        'es.symbol.async-iterator'
      ],
      corejs: 3
    }]
  ]
}
