import { NextFunction, Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import Users from '../models/User'

export default {
  async create(req: Request, res: Response) {
    const {
      name,
      email,
      password,
    } = req.body

    const usersRespository = getRepository(Users)

    const data = {
      name,
      email,
      password
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required()
    })

    await schema.validate(data, {
      abortEarly: false
    })

    try {
      const password = await bcrypt.hash(data.password, 10)
      data.password = password
    } catch (error) {
      return res.status(500).send({ error })
    }

    const user = usersRespository.create(data)

    await usersRespository.save(user)

    return res.status(201).json(user)
  },
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body

      const usersRespository = getRepository(Users)

      const user = await usersRespository.findOneOrFail({ where: { email } })

      if (!user) {
        return res.status(401).send("Authentication failed")
      }

      if (!bcrypt.compare(password, user.password)) {
        return res.status(401).send("Authentication failed")
      }

      return res.json({
        user,
        token: jwt.sign({ id: user.id }, "secret", {
          expiresIn: "1h"
        })
      })
    } catch (error) {
      return res.status(401).send("Authentication failed")
    }
  }
}