import axios from 'axios';
import 'dotenv/config';// 链接后台
import bcrypt from 'bcrypt';// 加密

async function register(req, res) {
  try {
    const userAddress = process.env.DB_PATH + '/user'
    const users = await axios.get(userAddress).then(res => res.data)

    // 重名检测，遇到重名后退出
    if (users && users.length) {
      let status = false
      users.some(user => {
        if (user.name && user.name === req.body.username) {
          res.status(200).send({
            'info': "Already have same username",
            'code': "1",
            "username": req.body.username
          })
          status = true
          return true
        }
      })
      if (status) {
        return
      }
    }

    if (!req.body.password) {
      res.status(200).send({
        "info": "password incorrect",
        "code": "2",
        "password": req.body.password
      })
    } else {

      const saltRounds = await getSalt()
      const password = await bcrypt.hash(req.body.password, saltRounds)

      await axios.post(userAddress, {
        name: req.body.username,
        password
      })// 把注册的信息传回数据库

      // TODO: 需要做二次检测，确保数据写入成功

      res.status(200).send({
        "info": "success",
        "code": "0",
      })
    }
  } catch (err) {
    console.log(err);
  }
}

async function getSalt() {
  const bcryptAddress = process.env.DB_PATH + '/bcrypt/1'
  const getBcrypt = await axios.get(bcryptAddress)
  const saltRounds = getBcrypt.data.saltRounds
  return saltRounds
}

export { register }