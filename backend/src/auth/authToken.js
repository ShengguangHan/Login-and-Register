import 'dotenv/config'
import jwt from 'jsonwebtoken'

function authToken(req, res, next) {
  const headers = req.headers
  const authHeader = headers['authorization']

  const token = authHeader && authHeader.split(' ')[1]// 拆开头取第二个
  if (!token) return res.sendStatus(401)
  console.log("TOKEN", token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user //如果令牌验证成功，将从令牌解码的用户信息分配给req.user，使其在后续中间件或路由处理程序中可访问
  })
  next()
}

export { authToken }