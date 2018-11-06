let config = {}
const form = document.forms[0]
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const dpr = window.devicePixelRatio || 1

function serializeForm (form) {
  let config = {}
  formData = new FormData(form)
  const formDataItems = [...formData.entries()]
  for (var key of formData.keys()) {
    config[key] = formData.get(key)
  }
  return config
}

(function initialize () {
  config = serializeForm(form)

  form
    .querySelectorAll('input')
    .forEach(input => {
      input.addEventListener('input', (_) => {
        config = serializeForm(form)
        renderCanvas(canvas, context, config)
      })
    })

  document
    .querySelector('button[name="refuck"]')
    .addEventListener('click', (_) => {
      renderCanvas(canvas, context, config)
    })

  document
    .querySelector('a[name="download-raster"]')
    .addEventListener('click', (e) => {
      e.currentTarget.download = 'disarray.png';
      e.currentTarget.href = canvas.toDataURL('image/png')
    })

  renderCanvas(canvas, context, config)
})()

function renderCanvas (canvas, ctx, config) {
  const {
    stringToPrint,
    showBoxes,
    fontMultiplier,
    fontName,
    textStyle,
    displacement,
    rotation,
    negative,
  } = config

  const canvasWidth = 480
  const canvasHeight = 720
  const offset = canvasWidth / 20 // maintains ratio

  canvas.width = canvasWidth
  canvas.height = canvasHeight
  ctx.scale(dpr, dpr)

  let foregroundColor = negative ? 'white' : 'black'
  let backgroundColor = negative ? 'black' : 'white'

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const squaresAcross = stringToPrint.length
  const squareSize = ((canvasWidth / dpr) - (offset * 2)) / squaresAcross
  const squaresDown = Math.floor(((canvasHeight / dpr) - (offset * 2)) / squareSize)

  for(var i = 0; i < squaresAcross; i++) {
    for(var j = 0; j < squaresDown; j++) {
      let plusOrMinus = Math.random() < 0.5 ? -1 : 1
      const rotateAmt = j * Math.PI / 180 * plusOrMinus * Math.random() * rotation

      plusOrMinus = Math.random() < 0.5 ? -1 : 1
      const horizontalPlacement = i * squareSize
      const verticalPlacement = j * squareSize
      const translateAmt = j / squareSize * plusOrMinus * Math.random() * (displacement * 10)

      ctx.save()
      ctx.translate(
        horizontalPlacement + translateAmt + (squareSize / 2) + offset,
        verticalPlacement + (squareSize / 2) + offset
      )
      ctx.rotate(rotateAmt)
      // draw
      ctx.beginPath()
      ctx.rect(-squareSize/2, -squareSize/2, squareSize, squareSize)

      ctx.fillStyle = foregroundColor
      ctx.strokeStyle = foregroundColor
      showBoxes && ctx.stroke()
      ctx.font = `${squareSize * fontMultiplier}px ${fontName}`
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx[`${textStyle}Text`](stringToPrint[i], 0, 0)
      ctx.restore()
    }
  }
}
