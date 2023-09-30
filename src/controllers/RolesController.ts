import { Request, Response } from 'express'
import RolesService from '../services/RolesService'
import response from '../helpers/response'

class RolesController {
  static list = async (req: Request, res: Response): Promise<void> => {
    const service: RolesService = new RolesService(req, res)

    try {
      await service.list()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }

  static create = async (req: Request, res: Response): Promise<void> => {
    const service: RolesService = new RolesService(req, res)

    try {
      await service.create()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }

  static update = async (req: Request, res: Response): Promise<void> => {
    const service: RolesService = new RolesService(req, res)

    try {
      await service.update()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }

  static detail = async (req: Request, res: Response): Promise<void> => {
    const service: RolesService = new RolesService(req, res)

    try {
      await service.detail()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }

  static delete = async (req: Request, res: Response): Promise<void> => {
    const service: RolesService = new RolesService(req, res)

    try {
      await service.delete()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }

  static soft_delete = async (req: Request, res: Response): Promise<void> => {
    const service: RolesService = new RolesService(req, res)

    try {
      await service.soft_delete()
    } catch (error) {
      return await response.failed('', 'failed', res)
    }
  }
}

export default RolesController
