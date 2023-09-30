import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'
import { ObjectId } from 'mongodb'

@Entity()
export class Roles {
  @ObjectIdColumn()
  id: ObjectId

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  slug: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export const RolesListEntity = (data): any => {
  data = data || {}
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    slug: data.slug,
    created_at: data.created_at,
    updated_at: data.updated_at || '',
    deleted_at: data.deleted_at || ''
  }
}

export const RolesPayloadEntity = (data): any => {
  data = data || {}
  return {
    id: data.id.toString(),
    name: data.name
  }
}
