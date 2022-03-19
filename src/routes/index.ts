import { Router } from "express"
import { getTodos, addTodo } from "../controllers/todos"

const router: Router = Router()

router.route('/api/todos')
    .get(getTodos)
    .post(addTodo)

export default router