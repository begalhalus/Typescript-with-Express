import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'
import { ObjectId } from 'mongodb'

@Entity()
export class Users {
  @ObjectIdColumn()
  id: ObjectId

  @Column()
  role: object

  @Column()
  created_by: object

  @Column()
  name: string

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  last_login: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @DeleteDateColumn()
  deleted_at: Date
}

export const UsersListEntity = (data): any => {
  data = data || {}
  return {
    id: data.id,
    created_by: data.created_by,
    role: data.role,
    name: data.name,
    username: data.username,
    password: data.password,
    last_login: data.last_login,
    created_at: data.created_at,
    updated_at: data.updated_at || '',
    deleted_at: data.deleted_at || ''
  }
}

export const LoginParamsEntity = (data): any => {
  data = data || {}
  return {
    token: data.token,
    user_id: data.id,
    role: data.role,
    name: data.name,
    username: data.username,
    last_login: data.last_login
  }
}

export const ProfileListEntity = (data): any => {
  data = data || {}
  return {
    id: data.id,
    role: data.role,
    name: data.name,
    username: data.username,
    last_login: data.last_login,
    created_at: data.created_at,
    updated_at: data.updated_at || '',
    deleted_at: data.deleted_at || ''
  }
}
