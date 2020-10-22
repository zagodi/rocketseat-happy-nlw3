import { Router } from 'express'
import multer from 'multer'

import uploadConfig from './config/upload'
import OrphanagesController from './controllers/OrphanagesController'
import UsersControllers from './controllers/UsersControllers'

const routes = Router()
const upload = multer(uploadConfig)

routes.get('/orphanages', OrphanagesController.index)
routes.get('/orphanages/:id', OrphanagesController.show)
routes.post('/orphanages', upload.array('images'), OrphanagesController.create)

routes.post('/login', UsersControllers.login)
routes.post('/users', UsersControllers.create)

export default routes 