import {Router} from "express"
import {getTodos, getTodo, addTodo, updateTodo, deleteTodo} from "../controllers/todos"

const router: Router = Router()

router.route('/api/todos')
    .get(getTodos)
    .post(addTodo)

router.route('/api/todos/:id')
    .get(getTodo)
    .put(updateTodo)
    .delete(deleteTodo)

export default router