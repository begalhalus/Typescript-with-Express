import { EntityManager, Repository } from 'typeorm'
import { Users } from '../entity/Users'
import MongoDB from '../sources/mongo'

class UsersRepository {
  manage: EntityManager
  repoUsers: Repository<Users>

  constructor(manage: EntityManager) {
    this.manage = manage
    this.repoUsers = MongoDB.getRepository(Users)
  }

  private async generateQuery(options: Record<string, any>): Promise<any> {
    const wheres: any = { where: {} }
    const query: any = { where: {} }

    // filter
    if (Object.prototype.hasOwnProperty.call(options, 'q') && options.q) {
      query.where = {
        $expr: {
          $or: [
            { $regexMatch: { input: '$name', regex: new RegExp(options.q.toString(), 'i') } },
            { $regexMatch: { input: '$username', regex: new RegExp(options.q.toString(), 'i') } },
            { $regexMatch: { input: '$role.name', regex: new RegExp(options.q.toString(), 'i') } }
          ]
        }
      }
      wheres.where = {
        $expr: {
          $or: [
            { $regexMatch: { input: '$name', regex: new RegExp(options.q.toString(), 'i') } },
            { $regexMatch: { input: '$username', regex: new RegExp(options.q.toString(), 'i') } },
            { $regexMatch: { input: '$role.name', regex: new RegExp(options.q.toString(), 'i') } }
          ]
        }
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(options, 'sortField') &&
      Object.prototype.hasOwnProperty.call(options, 'sort')
    ) {
      query.order = {
        [options.sortField]: options.sort.toString().toUpperCase()
      }
    }
    if (Object.prototype.hasOwnProperty.call(options, 'users_type') && options.users_type) {
      query.where['role.name'] = { $eq: options.users_type }
      wheres.where['role.name'] = { $eq: options.users_type }
    }

    // paginate
    if (
      Object.prototype.hasOwnProperty.call(options, 'offset') &&
      Object.prototype.hasOwnProperty.call(options, 'limit')
    ) {
      const offset: number = options.offset ?? 1
      const limit: number = options.limit ?? 100
      if (limit !== -1) {
        query.take = limit
        query.skip = offset
      }
    }
    return { wheres, query }
  }

  async UsersList(options: Record<string, any>): Promise<any> {
    const CustomRepos = this.manage.getRepository(Users)
    try {
      const { wheres, query } = await this.generateQuery(options)
      const rows: Users[] = await CustomRepos.find(wheres)

      // get data list
      const list: Users[] = await CustomRepos.find(query)
      return { list, total: rows.length }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default UsersRepository
