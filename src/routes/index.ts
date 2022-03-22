import {Router} from "express"
import {getTodos, addTodo, updateTodo, deleteTodo} from "../controllers/todos"

const router: Router = Router()

router.route('/api/todos')
    .get(getTodos)
    .post(addTodo)

router.route('/api/todos/:id')
    .put(updateTodo)
    .delete(deleteTodo)

export default router