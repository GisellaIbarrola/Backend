const { ADMIN_NAME, ADMIN_PASSWORD } = require('../config/config')
const userService = require('../services/user.service')

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if(email === ADMIN_NAME && password === ADMIN_PASSWORD){
      req.session.admin = true
      let user = {
        firstName: 'Coder',
        lastName: 'Coder',
        age: 20,
        email: email,
      }
      req.session.user = user
      res.send(user)
    } else{
      user = await userService.login(email, password)
      if (user) {
        req.session.user = user
        res.send({
          firstName: req.session.user.firstName,
          lastName: req.session.user.lastName,
          age: req.session.user.age,
          email: req.session.user.email,
        })
      }
    }
  } catch (error) {
    return res.status(401).json({
      status: 'Error',
      payload: 'Email o contraseña incorrectos',
    })
  }
}

const register = async (req, res) => {
  try {
    const user = req.body
    const userCreated = await userService.register(user)
    res.send(userCreated)
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      payload: 'Error al crear usuario',
    })
  }
}

const logout = async (req, res) => {
try {
  req.session.destroy(err => {
    if(!err) res.send('Logout exitoso')
    else res.status(500).json({
      status: 'Error',
      payload: 'Error al desloguearse',
    })
  })
} catch (error) {
  
}
}

module.exports = { login , register, logout}
