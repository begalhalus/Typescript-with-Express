import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

class Function {
  public static malform = async (tar: any): Promise<any> => {
    const obj = {}
    tar = tar.replace(/^\{|\}$/g, '').split(',')
    for (let i = 0, cur: any, pair: any; (cur = tar[i]); i++) {
      pair = cur.split(':')
      obj[pair[0]] = /^\d*$/.test(pair[1]) ? +pair[1] : pair[1]
    }
    return obj
  }

  public static GenerateSlug = async (str: any): Promise<any> => {
    str = str.replace(/^\s+|\s+$/g, '')
    str = str.toLowerCase()

    const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
    const to = 'aaaaeeeeiiiioooouuuunc------'
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
    }

    str = str
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    return str
  }

  public static passwordHash = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10)
  }

  static isJsonString = (str: string): boolean => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  public static passwordCompare = async (text: string, encryptedText: string): Promise<boolean> => {
    const result = await bcrypt.compare(text, encryptedText)
    return result
  }

  public static generateToken = (user_id: number, name: string, username: string): string => {
    const secretKey: string = process.env.JWT_USER_SECRET_KEY

    const token: string = jwt.sign({ user_id, name, username }, secretKey, {
      issuer: process.env.JWT_USER_ISS,
      expiresIn: process.env.JWT_USER_TOKEN_DURATION
    })
    return token
  }
}

export default Function
