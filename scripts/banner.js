var fs = require('fs')
var path = require('path')
var chalk = require('chalk')

var log = console.log.bind(console.log)

class Banner {
  constructor (filename) {
    this.width = 0
    this.height = 0
    this.color = 'whiteBright'

    this.text = this.load(filename)
  }

  load (filename) {
    var src = path.join(__dirname, '../data/art/', filename)
    var buf = fs.readFileSync(src, 'utf8')
    var text = buf.toString()
    var dimensions = text.split('\n')[0].split('x')

    this.width = dimensions[0]
    this.height = dimensions[1]

    return text.split('\n').slice(1, this.height).join('\n')
  }

  print (glitchy) {
    this.clear()

    var text = glitchy ? this.glitch(this.text) : this.text

    for (let line of text.split('\n')) {
      log(chalk[this.color](line))
    }
  }

  glitch (text) {
    var lines = text.split('\n')

    var y1 = this.randomInt(0, lines.length - 2)
    var y2 = this.randomInt(0, lines.length - 2)

    var c1 = this.randomInt(0, 5)
    var c2 = this.randomInt(0, 8)

    if (c1 !== 0) lines[y1] = this.offsetLine(lines[y1])
    if (c2 !== 0) lines[y2] = this.eraseLine(lines[y2])

    return lines.join('\n')
  }

  offsetLine (line) {
    var size = this.randomInt(0, this.width - 1)
    var chars = line.split('')

    for (let i = 0; i < size; i++) {
      chars.push(chars.shift())
    }

    return chars.join('')
  }

  eraseLine (line) {
    var size = this.randomInt(0, this.width - 1)
    var x = Math.min(this.randomInt(0, this.width), this.width - size)

    var chars = line.split('')
    var empty = Array(size).fill(' ')

    chars.splice(x, size, ...empty)

    return chars.join('')
  }

  randomInt (min, max) {
    return Math.floor(Math.random() * Math.floor(max))
  }

  async scan () {
    this.clear()

    for (let line of this.text.split('\n')) {
      log(chalk[this.color](line))
      await this.sleep(100)
    }
  }

  async loop () {
    this.looping = true

    while (this.looping) {
      if (this.randomInt(0, 6) === 0) {
        this.print()
        await this.sleep(1500)
      }
      await this.sleep(this.randomInt(60, 400))
      this.print(true)
    }
  }

  sleep (t) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, t)
    })
  }

  clear () {
    process.stdout.write('\x1Bc')
  }
}

var filename = process.argv[2] || 'banner.txt'
var banner = new Banner(filename)

;(async () => {
  await banner.scan()
  banner.loop()
})()
