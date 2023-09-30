import { Router } from 'express'
import UsersController from '../controllers/UsersController'
import { validation, auth } from '../midlewares/validation'
import { PostLoginSchema, PostUsersSchema, PutUsersSchema, DeleteUsersSchema, DetailUsersSchema } from '../schema/Users'

const routes = Router()

routes.post('/login', validation(PostLoginSchema), UsersController.login)
routes.post('/create', auth, validation(PostUsersSchema), UsersController.create)
routes.get('/detail/:id', auth, validation(DetailUsersSchema), UsersController.detail)
routes.get('/list', auth, validation(null), UsersController.list)
routes.put('/update/:id', auth, validation(PutUsersSchema), UsersController.update)
routes.delete('/delete/:id', auth, validation(DeleteUsersSchema), UsersController.delete)
routes.delete('/soft-delete/:id', auth, validation(DeleteUsersSchema), UsersController.soft_delete)
routes.get('/profile', auth, validation(null), UsersController.profile)

export default routes
