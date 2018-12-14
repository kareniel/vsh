#!/usr/bin/env node

var path = require('path')
var fse = require('fs-extra')
var inquirer = require('inquirer')
var inquirerCmd = require('inquirer-command-prompt')
var chalk = require('chalk')

var game = require('./game')
var commands = require('./commands')

const validCommands = Object.keys(commands)

;(async () => {
  init()

  while (true) {
    await loop()
  }
})()

function init () {
  clear()
  inquirer.registerPrompt('command', inquirerCmd)
  genRootFS()
  process.chdir(game.fakeRoot)
}

function genRootFS () {
  if (fse.existsSync(game.fakeRoot)) return

  var src = path.join(process.cwd(), 'data/rootfs')

  fse.copySync(src, game.fakeRoot)
}

async function exec (cmd, args) {
  if (!cmd) return

  if (validCommands.includes(cmd)) {
    return commands[cmd](args)
  }

  if (['exit', 'quit', 'q'].includes(cmd)) {
    return exit(0)
  }

  print(`${game.shell}: ${cmd}: not found`)
}

async function loop () {
  var { statement } = await inquirer.prompt([{
    name: 'statement',
    type: 'command',
    message: getPromptCursor(),
    autoCompletion: validCommands,
    context: 0,
    short: false,
    prefix: chalk.green('»')
  }])

  statement = statement.split(' ')

  var cmd = statement[0]
  var args = statement.slice(1)

  await exec(cmd, args)
}

function getPromptCursor () {
  var u = chalk.blue(game.user.name)
  var h = chalk.green(game.host.name)
  var d = chalk.yellow(commands.pwd(false))

  return `${u}@${h}:${d}$`
}

function clear () {
  process.stdout.write('\x1Bc')
}

function print () {
  console.log.apply(console.log, arguments)
}

function exit (code) {
  process.exit(code)
}

process.on('SIGINT', function () {
  print('\n')
  exit()
})
