import './style.scss'
import axios from 'axios'
import * as animation from './src/animation'
import * as utils from './src/utils'
import { gsap } from "gsap";


const loginBtn = document.querySelector('.login-btn')
const registerBtn = document.querySelector('.register-btn')
const username = document.querySelector('#username')
const password = document.querySelector('#password')
const new_username = document.querySelector('#new-username')
const password_one = document.querySelector('#reg-password-one')
const password_two = document.querySelector('#reg-password-two')
const signOutBtn = document.querySelector('#sign-out')

loginBtn.addEventListener('click', login)
registerBtn.addEventListener('click', register)
signOutBtn.addEventListener('click', signOut)

const backendPath = "http://localhost:12980/api/"

async function login(event) {
  event.preventDefault()
  if (utils.checkInputEmpty([username, password])) {
    animation.showError()
    return
  }

  const response = await axios.post(backendPath + "login", {
    username: username.value,
    password: password.value
  }).then(res => res.data).catch(err => {
    console.log(err);
  })

  console.log(response);

  switch (Number(response.code)) {
    case 0:
      localStorage.setItem('token', response.token)// 把token存储在前端
      animation.showCorrect()
      document.querySelector("#welcome-user-name").textContent = username.value
      username.value = ""
      password.value = ""
      animation.LoginToWelcome()
      break;

    case 1:
      animation.showUnknown()
      break;

    case 2:
      animation.showError()
      break;

    default:
      animation.showUnknown()
      break;
  }
}

async function register(event) {
  event.preventDefault()
  if (utils.checkInputEmpty([new_username, password_one, password_two])) {
    animation.showError()
    return
  } else if (password_one.value === password_two.value) {
    const address = backendPath + "register"
    const response = await axios.post(address, {
      username: new_username.value,
      password: password_one.value
    }).then(res => res.data).catch(err => {
      console.log(err);
    })
    switch (Number(response.code)) {
      case 0:
        animation.showCorrect()
        new_username.value = ''
        password_one.value = ''
        password_two.value = ''
        // 当所有东西搞定后要清空
        animation.RegisterToLogin()
        // 然后回归登陆界面
        break;

      case 1:
        animation.showUnknown()
        break;

      case 2:
        animation.showError()
        break;

      default:
        animation.showUnknown()
        break;
    }
  }

}
async function signOut(event) {
  event.preventDefault()
  localStorage.removeItem('token')
  animation.WelcomeToLogin()
}

// ===== To Register and Login Btn Function=====
const toRegisterBtn = document.querySelector('.to-register-btn')
const toLoginBtn = document.querySelector('.to-login-btn')

toRegisterBtn.addEventListener('click', showRegister)
toLoginBtn.addEventListener('click', showLogin)

function showRegister(event) {
  event.preventDefault()
  animation.LoginToRegister()
}

function showLogin(event) {
  event.preventDefault()
  animation.RegisterToLogin()
}

// ===== Check Token for Login =====

async function checkToken() {
  const token = localStorage.getItem('token')
  if (token) {
    // 此处为重点，一定要加上请求头
    const config = {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }

    // 询问Token是否有效
    const response = await axios.post(backendPath + "loginToken", { test: "hello" }, config).then(res => res.data).catch(err => {
      console.log(err);
    })

    console.log(response);

    if (Number(response.code) === 0) {
      animation.LoginToWelcome()
      document.querySelector("#welcome-user-name").textContent = response.user.name
    }

  }
}

checkToken()// 直接执行上述操作