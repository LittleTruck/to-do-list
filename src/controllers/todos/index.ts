import {Response, Request} from "express"
import {ITodo} from "../../types/todo"
import Todo from "../../models/todo"

const getTodos = async (req: Request, res: Response): Promise<void> => {
    let keyword = req.query.keyword || ""
    let priority = req.query.priority || 1
    const reg = new RegExp(keyword.toString(), 'i')

    let query: any;
    query = {
        $and: [
            {
                $or: [
                    {name: {$regex: reg}},
                    {description: {$regex: reg}}
                ]
            }
        ]
    };
    if (req.query.status) {
        query['$and'].push({status: req.query.status});
    }
    if (req.query.priority) {
        query['$and'].push({priority: priority});
    }

    try {
        let todos: ITodo[]
        todos = await Todo.find(
            query,
            {},
            {
                sort: {status: 1, priority: 1, createdAt: -1}
            },
        )

        res.status(200).json({todos})
    } catch (error) {
        res
            .status(500)
            .json({message: error})
        console.log(error)
    }
}

const getTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const todo = await Todo.findById(req.params.id)

        res.status(200).json({todo: todo})
    } catch (error) {
        res
            .status(500)
            .json({message: error})
        console.log(error)
    }
}

const addTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as Pick<ITodo, "name" | "description" | "status" | "priority">

        const todo: ITodo = new Todo({
            name: body.name,
            description: body.description,
            status: body.status,
            priority: body.priority,
        })

        const newTodo: ITodo = await todo.save()
        const allTodos: ITodo[] = await Todo.find()

        res
            .status(201)
            .json({message: "Todo added", todo: newTodo, todos: allTodos})
    } catch (error) {
        res
            .status(500)
            .json({message: error})
        console.log(error)
    }
}

const updateTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            params: {id},
            body,
        } = req

        await Todo.findByIdAndUpdate(
            {_id: id},
            body
        )

        const updatedTodo = await Todo.findById(id);
        const allTodos: ITodo[] = await Todo.find()

        res.status(200).json({
            message: "Todo updated",
            updatedTodo: updatedTodo,
            todos: allTodos
        })
    } catch (error) {
        res
            .status(500)
            .json({message: error})
        console.log(error)
    }
}

const deleteTodo = async (req: Request, res: Response): Promise<void> => {
    try {
        await Todo.findByIdAndRemove(req.params.id)

        const allTodos: ITodo[] = await Todo.find()

        res.status(200).json({
            message: "Todo deleted",
            todos: allTodos
        })
    } catch (error) {
        res
            .status(500)
            .json({message: error})
        console.log(error)
    }
}

export {getTodos, getTodo, addTodo, updateTodo, deleteTodo}


