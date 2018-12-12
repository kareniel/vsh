var path = require('path')
var shell = require('shelljs')
var posix = require('posix')

var game = require('../game')

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
  "Aug", "Sep", "Oct", "Nov", "Dec"
]

const permissions = [
  '---',
  '--x',
  '-w-',
  '-wx',
  'r--',
  'r-x',
  'rw-',
  'rwx'
]

module.exports = {
  echo (args) {
    return shell.echo.apply(shell, args)
  },
  whoami () {
    return console.log(game.user.name)
  },
  hostname () {
    return console.log(game.host.name)
  },
  cd (args) {
    // such chroot, very wow
    if (args[0] === '..' && process.cwd() === game.fakeRoot) return

    return shell.cd.apply(shell, args)
  },
  ls (args) {
    var list = shell.ls.apply(shell, args)

    if (!list.length) return

    if (typeof list[0] === 'string') {
      return console.log(list.join('\t'))
    }

    list.forEach(item => {
      console.log(formatLS(item))
    })
  },
  pwd (flag) {
    var relative = path.relative(game.fakeRoot, process.cwd())
    var dir = path.join('/', relative)

    if (flag !== false) console.log(dir)

    return dir
  }
}

function formatLS (item) {
  return (
    `${formatPermissions(item.mode, item.isDirectory())}\t` +
    `${item.nlink}\t` +
    posix.getpwnam(item.uid).name + '\t' +
    posix.getgrnam(item.gid).name + '\t' +
    `${item.size}\t` + 
    `${formatDate(item.mtime)}\t` +
    item.name
  )
}

function formatPermissions (mode, isDir) {
  var octal = (mode & 0777).toString(8)

  var owner = permissions[Number(octal[0])]
  var group = permissions[Number(octal[1])]
  var all = permissions[Number(octal[2])]

  return `${isDir ? 'd' : ''}${owner}${group}${all}`
}

function formatDate (ms) {
  var date = new Date(ms)

  var day = date.getDate()
  var month = monthNames[date.getMonth()]
  var h = date.getHours()
  var m = date.getMinutes()

  return `${day} ${month} ${h}:${m}`
}
