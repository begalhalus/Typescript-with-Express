import { Router } from 'express'
import RolesController from '../controllers/RolesController'
import { validation, auth } from '../midlewares/validation'
import { PostRolesSchema, PutRolesSchema, DeleteRolesSchema, DetailRolesSchema } from '../schema/Roles'

const routes = Router()

routes.post('/create', auth, validation(PostRolesSchema), RolesController.create)
routes.get('/detail/:id', auth, validation(DetailRolesSchema), RolesController.detail)
routes.get('/list', auth, RolesController.list)
routes.put('/update/:id', auth, validation(PutRolesSchema), RolesController.update)
routes.delete('/delete/:id', auth, validation(DeleteRolesSchema), RolesController.delete)
routes.delete('/soft-delete/:id', auth, validation(DeleteRolesSchema), RolesController.soft_delete)

export default routes
