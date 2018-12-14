var os = require('os')
var path = require('path')

module.exports = {
  fakeRoot: path.join(os.homedir(), '.diagonal/vsh/rootfs'),
  shell: 'vsh',
  user: {
    name: 'user'
  },
  host: {
    name: 'host'
  }
}
