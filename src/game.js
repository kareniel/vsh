var path = require('path')

module.exports = {
  fakeRoot: path.join(process.cwd(), '/rootfs'),
  shell: 'vsh',
  user: {
    name: 'user'
  },
  host: {
    name: 'host'
  }
}
