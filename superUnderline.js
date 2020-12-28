// See files in superUnderline/*

CSS.registerProperty({
  name: '--extra-underlineNumber',
  syntax: '<number>',
  inherits: false,
  initialValue: 3
});

CSS.registerProperty({
  name: '--extra-underlineColor',
  syntax: '<color>',
  inherits: true,
  initialValue: 'black'
});

CSS.registerProperty({
  name: '--extra-underlineSpread',
  syntax: '<number>',
  inherits: false,
  initialValue: 20
});

CSS.registerProperty({
  name: '--extra-underlineWidth',
  syntax: '<number>',
  inherits: false,
  initialValue: 2
});

(() => { const worklet = `
  const lineCoordinates = [
    {
      'start': 7,
      'end': 13
    },
    {
      'start': 0,
      'end': 5
    },
    {
      'start': 6,
      'end': 10
    },
    {
      'start': 12,
      'end': 3
    },
    {
      'start': 10,
      'end': 8
    }
  ];

  if (typeof registerPaint !== 'undefined') {
    class SuperUnderline {
      static get inputProperties() {
        return ['--extra-underlineNumber', '--extra-underlineColor', '--extra-underlineSpread', '--extra-underlineWidth']
      }
    
      paint(ctx, size, properties) {
        const numUnderlines = properties.get('--extra-underlineNumber')
        const lineWidth = properties.get('--extra-underlineWidth')
        const color = properties.get('--extra-underlineColor')
        const spread = properties.get('--extra-underlineSpread')

        ctx.lineWidth = lineWidth
        ctx.strokeStyle = color

        for (let i = 0; i < numUnderlines; i++) {
          ctx.beginPath()
          ctx.moveTo(0, lineCoordinates[i]['start'] + size.height/1.4)
          ctx.lineTo(size.width, lineCoordinates[i]['end'] + size.height/1.4)
          ctx.stroke()
        }
      }
    }
    
    registerPaint('extra-superUnderline', SuperUnderline)
  }`;

  const workletBlob = URL.createObjectURL(new Blob([worklet], { type: 'application/javascript' }));

  window.CSS.paintWorklet.addModule(workletBlob);
})();