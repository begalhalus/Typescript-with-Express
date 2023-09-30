import { Router } from 'express'
import users from './users'
import roles from './roles'
require('express-group-routes')

const routes: any = Router()

// users
routes.group('/user/v1', (router) => {
  router.use('/', users)
  router.use('/role', roles)
})

export default routes
