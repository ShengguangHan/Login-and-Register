import axios from 'axios'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

async function login(req, res) {
  console.log(req.body);
  const username = req.body.username
  const password = req.body.password

  const userDBAddress = process.env.DB_PATH + "/user"
  const users = await axios.get(userDBAddress).then(res => res.data).catch(err => console.log(err))

  //  制作Token 
  const userTokenInfo = { name: username }
  const accessToken = jwt.sign(userTokenInfo, process.env.ACCESS_TOKEN_SECRET)

  if (users && users.length > 0) {
    let getUser, getPassword

    users.some(user => {
      if (user.name === username) {
        getUser = user.name
        getPassword = user.password
      }
    })
    if (!getUser) {
      res.status(200).send({
        info: "cannot find username", code: '1'
      })
    } else if (getPassword) {
      const match = await bcrypt.compare(password, getPassword)
      if (match) {
        res.status(200).send({ info: "login success", code: '0', token: accessToken })
      } else {
        res.status(200).send({ info: "password error", code: '2' })
      }
    }
  }
}


export { login }