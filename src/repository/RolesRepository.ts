import { EntityManager } from 'typeorm'
import { Roles } from '../entity/Roles'

class RolesRepository {
  manage: EntityManager

  constructor(manage: EntityManager) {
    this.manage = manage
  }

  private async generateQuery(options: Record<string, any>): Promise<any> {
    const wheres: any = { where: {} }
    const query: any = { where: {} }

    // filter
    if (Object.prototype.hasOwnProperty.call(options, 'q') && options.q) {
      query.where.name = new RegExp(options.q.toString(), 'i')
      wheres.where.name = new RegExp(options.q.toString(), 'i')
    }
    if (
      Object.prototype.hasOwnProperty.call(options, 'sortField') &&
      Object.prototype.hasOwnProperty.call(options, 'sort')
    ) {
      query.order = {
        [options.sortField]: options.sort.toString().toUpperCase()
      }
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

  async RolesList(options: Record<string, any>): Promise<any> {
    const CustomRepos = this.manage.getRepository(Roles)
    try {
      const { wheres, query } = await this.generateQuery(options)
      const rows: Roles[] = await CustomRepos.find(wheres)

      // get data list
      const list: Roles[] = await CustomRepos.find(query)
      return { list, total: rows.length }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

export default RolesRepository
