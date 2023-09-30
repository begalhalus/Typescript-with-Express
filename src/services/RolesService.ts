import { Request, Response } from 'express'
import { Roles, RolesListEntity } from '../entity/Roles'
import RolesRepository from '../repository/RolesRepository'
import { Repository } from 'typeorm'
import response from '../helpers/response'
import message from '../helpers/message'
import helper from '../helpers/function'
import MongoDB from '../sources/mongo'

class RolesService {
  credential: {
    user_id: string
    name: string
  }
  body: Request['body']
  params: Request['params']
  res: Response
  req: any
  repoRoles: Repository<Roles>

  constructor(req: any, res: Response) {
    this.credential = req.app.locals.credential
    this.body = req.body
    this.params = req.params
    this.res = res
    this.req = req
    this.repoRoles = MongoDB.getRepository(Roles)
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description create roles
   */

  create = async (): Promise<any> => {
    const { name, description } = this.body

    try {
      // check exist slug
      const checked: any = await this.repoRoles.findOne({
        where: {
          slug: await helper.GenerateSlug(name)
        }
      })
      if (checked) {
        return await response.failed(null, message.existing(name), this.res)
      }

      // payload
      const payload: any = {
        created_by: '',
        name,
        description,
        slug: await helper.GenerateSlug(name),
        created_at: null,
        updated_at: null,
        deleted_at: null
      }

      payload.created_by = {
        id: this.credential.user_id,
        name: this.credential.name
      }

      await this.repoRoles.save(payload)
      return await response.success(null, 'success', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description list roles
   */
  list = async (): Promise<any> => {
    // declaration variables
    const CustomRepos = new RolesRepository(this.repoRoles.manager)
    const { search, sort, sort_field } = this.req.query
    const pages: number = parseInt(this.req.query.page) || 1
    const limit: number = parseInt(this.req.query.limit) || 10
    const offset: number = (pages - 1) * limit

    try {
      const filterRepo: Record<string, any> = {}
      if (typeof search !== 'undefined') {
        filterRepo.q = search
      }
      if (typeof sort !== 'undefined' && typeof sort_field !== 'undefined') {
        filterRepo.sort = sort
        filterRepo.sortField = sort_field
      }
      filterRepo.pages = pages
      filterRepo.limit = limit
      filterRepo.offset = offset
      let { list, total } = await CustomRepos.RolesList(filterRepo)
      if (list.length) {
        list = list.map((data: any) => {
          return RolesListEntity(data)
        })
      }
      const result = {
        list,
        total_page: Math.ceil(total / limit),
        total_data: total,
        page: pages,
        limit
      }
      return await response.success(result, 'success', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description update roles
   */
  update = async (): Promise<any> => {
    const { name, description } = this.body

    try {
      // get data
      const row: any = await this.repoRoles.findOne(response.convertToObjectID(this.params.id))
      if (!row) {
        return await response.failed(null, message.notFound('role'), this.res)
      }

      if (name !== row.name) {
        // check exist slug
        const checked: any = await this.repoRoles.findOne({
          where: {
            slug: await helper.GenerateSlug(name)
          }
        })
        if (checked) {
          return await response.failed(null, message.existing(name), this.res)
        }
      }

      // update
      row.name = name
      row.description = description
      row.slug = await helper.GenerateSlug(name)
      await this.repoRoles.save(row)
      return await response.success(null, 'success', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description detail role
   */
  detail = async (): Promise<any> => {
    try {
      // get data
      const row: Roles = await this.repoRoles.findOne(response.convertToObjectID(this.params.id))
      if (!row) {
        return await response.failed(null, message.notFound('role'), this.res)
      }

      const result = RolesListEntity(row)
      return await response.success(result, 'success', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description delete role
   */
  delete = async (): Promise<any> => {
    try {
      // get data
      const row: Roles = await this.repoRoles.findOne(response.convertToObjectID(this.params.id))
      if (!row) {
        return await response.failed(null, message.notFound('role'), this.res)
      }

      // delete
      await this.repoRoles.delete(row)
      return await response.success(null, 'success', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description soft delete role
   */
  soft_delete = async (): Promise<any> => {
    try {
      // get data
      const row: Roles = await this.repoRoles.findOne(response.convertToObjectID(this.params.id))
      if (!row) {
        return await response.failed(null, message.notFound('role'), this.res)
      }

      // delete
      await this.repoRoles.softRemove(row)
      return await response.success(null, 'success', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }
}

export default RolesService
