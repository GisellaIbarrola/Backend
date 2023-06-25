const dotenv = require('dotenv')

const path = require('path')

const { program } = require('commander')

program.requiredOption('--mode <mode>', 'Server execution mode', 'production')

program.parse()

const ambiente = program.opts().mode

dotenv.config({
  path: path.join(
    __dirname,

    ambiente == 'production'
      ? '/./../../.env.production'
      : '/./../../.env.development'
  ),
})


const TYPE_DOCUMENTS = [
  'Identificación',
  'Comprobante de domicilio',
  'Comprobante de estado de cuenta'
]

module.exports = {
  PORT: process.env.PORT,
  PERSISTENCE: process.env.PERSISTENCE,
  USERMAILING: process.env.USERMAILING,
  USERPASSWORD: process.env.USERPASSWORD,
  TYPE_DOCUMENTS
}