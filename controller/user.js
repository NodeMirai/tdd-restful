/**
 * 
 */

import UserModel from '../model/user'
import jwt from 'jsonwebtoken'  // used to create, sign, and verify tokens
import config from '../config'

const UserController = {

  login(req, res, next) {
    let userParam = req.body
    UserModel.findOne({ username: userParam.username }, (err, user) => {
      if (err) {
        console.error(err)
        res.send({
          status: 500
        })
      }
      console.log(userParam)
      if (user) {
        // 如果查到用户且密码正确，则回传给用户token
        if (userParam.password === user.password) {
          // 为token添加payload，secret，expiresInMinutes
          const payload = {
            admin: user.username
          }
          var token = jwt.sign(payload, config.secret, {
            expiresIn: "1d"   //  24小时后过期
          })
          res.json({
            status: 200,
            message: 'Enjoy your token!',
            token: token,
          })
        } else {
          // 前端提示用户密码输入错误
          res.json({
            status: 500,
            message: '认证失败，用户密码错误',
          })
        }
      } else {
        // 前端提示该用户名不存在，请注册
        res.json({
          status: 500,
          message: '认证失败，用户不存在',
        })
      }
    })
  },

  // 注册时查询用户是否重复
  findUserByUserName(req, res, next) {
    let username = req.params.username
    UserModel.findOne({ username }, (err, user) => {
      if (err) {
        console.error(err)
        res.send({
          status: 500
        })
      }

      if (user) {
        // 提示用户已存在
        res.send({
          status: 200,
          data: user,
          message: '无法注册，用户已存在',
        })
      } else {
        // 提示该用户名可注册
        res.send({
          status: 200,
          data: null,
          message: '可注册',
        })
      }

    })
  },

  register(req, res, next) {
    let user = req.body
    UserModel.create(user, (err, user) => {
      if (err) {
        console.error(err)
        res.send({
          status: 500,
          message: 'error',
        })
      }
      res.send({
        status: 200,
        data: user,
        message: 'add success',
      })
    })
  },

  updateUserInfo(req, res, next) {
    let uesr = req.body
    UserModel.findOneAndUpdate({ username: user.username }, user, function(err, user) {
      if (err) {
        consolr.err(err)
        res.send({
          status: 500,
          message: 'error',
        })
      } 
      
      res.send({
        status: 200,
        message: 'update user success',
        data: user,
      })

    })
  },

}

export default UserController
