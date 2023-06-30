import axios from 'axios'
import 'dotenv/config'

async function loginToken(req, res) {
  const userAddress = process.env.DB_PATH + '/user'
  const users = await axios.get(userAddress).then(res => res.data)

  let flag = false
  users.some(user => {
    if (user.name === req.user.name) {
      res.json({
        "code": "0",
        "info": "success",
        user
      })
      flag = true
      return true
    }
  })

  if (!flag) {
    res.json({
      "code": "1",
      "info": "cannot find user"
    })
  }
}

export { loginToken }