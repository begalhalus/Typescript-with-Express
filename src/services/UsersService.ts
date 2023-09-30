import { Request, Response } from 'express'
import { Users, UsersListEntity, LoginParamsEntity, ProfileListEntity } from '../entity/Users'
import { Roles, RolesPayloadEntity } from '../entity/Roles'
import { Repository } from 'typeorm'
import UsersRepository from '../repository/UsersRepository'
import response from '../helpers/response'
import message from '../helpers/message'
import helper from '../helpers/function'
import MongoDB from '../sources/mongo'
import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc'
import * as timezone from 'dayjs/plugin/timezone'

// set config datetime
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Jakarta')

class UsersService {
  credential: {
    user_id: string
    name: string
  }
  body: Request['body']
  params: Request['params']
  res: Response
  req: any
  repoUsers: Repository<Users>
  repoRoles: Repository<Roles>

  constructor(req: any, res: Response) {
    this.credential = req.app.locals.credential
    this.body = req.body
    this.params = req.params
    this.res = res
    this.req = req
    this.repoUsers = MongoDB.getRepository(Users)
    this.repoRoles = MongoDB.getRepository(Roles)
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description create login
   */

  login = async (): Promise<any> => {
    const { username, password } = this.body
    let users: any, compare: any

    try {
      users = await this.repoUsers.findOne({
        where: { username }
      })
      if (!users) {
        return await response.failed({}, 'Email atau password salah !', this.res)
      }

      compare = await helper.passwordCompare(password, users.password)
      if (compare) {
        users.token = helper.generateToken(users.id, users.name, users.username)
        const data = LoginParamsEntity(users)
        users.last_login = dayjs().format()
        await this.repoUsers.save(users)
        return await response.success(data, 'success', this.res)
      }
      return await response.failed({}, 'Username atau password salah !', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description create users
   */

  create = async (): Promise<any> => {
    const { role_id, name, password, username } = this.body
    try {
      // check exist name
      const checked: any = await this.repoUsers.findOne({
        where: {
          name: name.toLowerCase()
        }
      })
      if (checked) {
        return await response.failed(null, message.existing(name), this.res)
      }

      // check exist username
      const checked_user: any = await this.repoUsers.findOne({
        where: {
          username
        }
      })
      if (checked_user) {
        return await response.failed(null, message.existing(username), this.res)
      }

      // get role
      let role: any = await this.repoRoles.findOne(response.convertToObjectID(role_id))
      if (!role) {
        return await response.failed(null, message.notFound('role'), this.res)
      }
      role = await RolesPayloadEntity(role)

      // payload
      const payload: any = {
        created_by: '',
        role,
        name: name.toLowerCase()
      }

      payload.username = username
      payload.password = await helper.passwordHash(password)

      payload.created_by = {
        id: this.credential.user_id,
        name: this.credential.name
      }
      payload.created_at = null
      payload.updated_at = null
      payload.deleted_at = null
      await this.repoUsers.save(payload)
      return await response.success(null, 'success', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description list users
   */
  list = async (): Promise<any> => {
    // declaration variables
    const CustomeRepos = new UsersRepository(this.repoUsers.manager)
    const { search, sort, sort_field, users_type } = this.req.query
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
      if (typeof users_type !== 'undefined') {
        filterRepo.users_type = users_type
      }
      filterRepo.pages = pages
      filterRepo.limit = limit
      filterRepo.offset = offset
      let { list, total } = await CustomeRepos.UsersList(filterRepo)
      if (list.length) {
        list = list.map((data: any) => {
          return UsersListEntity(data)
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
   * @description update users
   */
  update = async (): Promise<any> => {
    const { role_id, name, password, username } = this.body

    try {
      // get detail data
      const row: any = await this.repoUsers.findOne(response.convertToObjectID(this.params.id))
      if (!row) {
        return await response.failed(null, message.notFound('user'), this.res)
      }

      if (name !== row.name) {
        // check exist name
        const checked: any = await this.repoUsers.findOne({
          where: {
            name: name.toLowerCase()
          }
        })
        if (checked) {
          return await response.failed(null, message.existing(name), this.res)
        }
      }

      if (name !== row.name) {
        // check exist username
        const checked_user: any = await this.repoUsers.findOne({
          where: {
            username
          }
        })
        if (checked_user) {
          return await response.failed(null, message.existing(username), this.res)
        }
      }

      // get role
      let role: any = await this.repoRoles.findOne(response.convertToObjectID(role_id))
      if (!role) {
        return await response.failed(null, message.notFound('role'), this.res)
      }
      role = await RolesPayloadEntity(role)

      // update
      row.role = role
      row.name = name.toLowerCase()
      row.password = row.password ?? (await helper.passwordHash(password))
      row.username = username

      await this.repoUsers.save(row)
      return await response.success(null, 'success', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description detail users
   */
  detail = async (): Promise<any> => {
    try {
      // get detail
      const row: Users = await this.repoUsers.findOne(response.convertToObjectID(this.params.id))
      if (!row) {
        return await response.failed(null, message.notFound('user'), this.res)
      }

      const result = UsersListEntity(row)
      return await response.success(result, 'success', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description delete users
   */
  delete = async (): Promise<any> => {
    try {
      // get detail
      const row: Users = await this.repoUsers.findOne(response.convertToObjectID(this.params.id))
      if (!row) {
        return await response.failed(null, message.notFound('user'), this.res)
      }

      // delete
      await this.repoUsers.delete(row)
      return await response.success(null, 'success', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description soft delete users
   */
  soft_delete = async (): Promise<any> => {
    try {
      // get detail
      const row: Users = await this.repoUsers.findOne(response.convertToObjectID(this.params.id))
      if (!row) {
        return await response.failed(null, message.notFound('user'), this.res)
      }

      // delete
      await this.repoUsers.softRemove(row)
      return await response.success(null, 'success', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }

  /**
   *
   * @param {*} this.body
   * @return {import response from '../helpers/response').success}
   * @description detail profile
   */
  profile = async (): Promise<any> => {
    try {
      // check credential
      if (!this.credential) {
        return await response.failed(null, message.notFound('credential'), this.res)
      }

      // get detail
      const row: Users = await this.repoUsers.findOne(response.convertToObjectID(this.credential.user_id))
      if (!row) {
        return await response.failed(null, message.notFound('user'), this.res)
      }

      const result = ProfileListEntity(row)
      return await response.success(result, 'success', this.res)
    } catch (error) {
      return await response.failed({}, error.message, this.res)
    }
  }
}

export default UsersService
