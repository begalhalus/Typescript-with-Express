import { Request, Response, NextFunction } from 'express'
import response from '../helpers/response'
import * as jwt from 'jsonwebtoken'

export const validation = (schema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (schema) {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      })
    }

    next()
  } catch (error) {
    let errorMessage = error.message
    if (error.hasOwnProperty('issues')) {
      errorMessage = 'failed'
    }
    return await response.failed(error, errorMessage, res)
  }
}

export const auth = (req: Request, res: Response, next: NextFunction): any => {
  if (!req.headers.authorization) {
    return response.auth('', 'Unauthorized', res)
  }

  try {
    if (req.headers.authorization) {
      const secretKey = process.env.JWT_USER_SECRET_KEY
      const token: string = req.headers.authorization.split(' ')[1]
      const credential: string | object = jwt.verify(token, secretKey)
      if (credential) {
        req.app.locals.credential = credential
        return next()
      }
    }

    return response.auth('', 'Invalid Token', res)
  } catch (error) {
    return response.failed(error, 'Error Token', res)
  }
}
