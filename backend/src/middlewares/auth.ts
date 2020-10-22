import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthRequest extends Request {
  user: User | any
}

export default async function (req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).send({ error: "Not authenticated" })
  }

  const [scheme, token] = authHeader.split(" ")

  try {
    const decoded = await promisify(jwt.verify)(token, "secret")
    req.user = decoded

    return next()
  } catch (error) {
    return res.status(401).send({ error: "Invalid token" })
  }
}