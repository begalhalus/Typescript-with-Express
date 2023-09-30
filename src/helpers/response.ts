import { Response } from 'express'
import { ObjectID } from 'mongodb'
import helper from '../helpers/function'

class Handler {
  static convertToObjectID = (value: string | ObjectID): ObjectID => {
    return typeof value === 'string' ? new ObjectID(value) : value
  }
  /* Response failed */
  static failed = async (value: any, messages: string, res: Response): Promise<any> => {
    let parse: any, data: any

    try {
      const isJson = helper.isJsonString(value)
      if (value && isJson) {
        parse = JSON.parse(value)
        value = await helper.malform('{' + parse[0].path.slice(1) + ':' + parse[0].message + '}')
      }

      data = {
        status: 400,
        validation: value || {},
        data: {},
        message: messages
      }
    } catch (error) {
      console.log(error)
    }
    res.statusCode = 400
    res.send(data)
  }

  /* Response Success */
  static success = async (values: any, messages: string, res: Response): Promise<any> => {
    let data: any

    try {
      data = {
        status: 200,
        validation: {},
        data: values || {},
        message: messages
      }
    } catch (error) {
      console.log(error)
    }

    res.statusCode = 200
    res.send(data)
  }

  /* Response Auth */
  static auth = async (values: any, messages: string, res: Response): Promise<any> => {
    let data: any

    try {
      data = {
        status: 401,
        validation: {},
        data: values || {},
        message: messages
      }
    } catch (error) {
      console.log(error)
    }

    res.statusCode = 401
    res.send(data)
  }
}
export default Handler
