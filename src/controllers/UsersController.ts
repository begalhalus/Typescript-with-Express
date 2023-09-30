import { Request, Response } from 'express'
import UsersService from '../services/UsersService'
import response from '../helpers/response'

class UsersController {
  static login = async (req: Request, res: Response): Promise<void> => {
    const service: UsersService = new UsersService(req, res)

    try {
      await service.login()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }

  static list = async (req: Request, res: Response): Promise<void> => {
    const service: UsersService = new UsersService(req, res)

    try {
      await service.list()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }

  static create = async (req: Request, res: Response): Promise<void> => {
    const service: UsersService = new UsersService(req, res)

    try {
      await service.create()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }

  static update = async (req: Request, res: Response): Promise<void> => {
    const service: UsersService = new UsersService(req, res)

    try {
      await service.update()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }

  static detail = async (req: Request, res: Response): Promise<void> => {
    const service: UsersService = new UsersService(req, res)

    try {
      await service.detail()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }

  static delete = async (req: Request, res: Response): Promise<void> => {
    const service: UsersService = new UsersService(req, res)

    try {
      await service.delete()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }

  static soft_delete = async (req: Request, res: Response): Promise<void> => {
    const service: UsersService = new UsersService(req, res)

    try {
      await service.soft_delete()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }

  static profile = async (req: Request, res: Response): Promise<void> => {
    const service: UsersService = new UsersService(req, res)

    try {
      await service.profile()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }
}

export default UsersController
