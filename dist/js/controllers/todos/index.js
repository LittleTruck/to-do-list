"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.addTodo = exports.getTodo = exports.getTodos = void 0;
const todo_1 = __importDefault(require("../../models/todo"));
const getTodos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let keyword = req.query.keyword || "";
    let priority = req.query.priority || 1;
    const reg = new RegExp(keyword.toString(), 'i');
    let query;
    query = {
        $and: [
            {
                $or: [
                    { name: { $regex: reg } },
                    { description: { $regex: reg } }
                ]
            }
        ]
    };
    if (req.query.status) {
        query['$and'].push({ status: req.query.status });
    }
    if (req.query.priority) {
        query['$and'].push({ priority: priority });
    }
    try {
        let todos;
        todos = yield todo_1.default.find(query, {}, {
            sort: { status: 1, priority: 1, createdAt: -1 }
        });
        res.status(200).json({ todos });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error });
        console.log(error);
    }
});
exports.getTodos = getTodos;
const getTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const todo = yield todo_1.default.findById(req.params.id);
        res.status(200).json({ todo: todo });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error });
        console.log(error);
    }
});
exports.getTodo = getTodo;
const addTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const todo = new todo_1.default({
            name: body.name,
            description: body.description,
            status: body.status,
            priority: body.priority,
        });
        const newTodo = yield todo.save();
        const allTodos = yield todo_1.default.find();
        res
            .status(201)
            .json({ message: "Todo added", todo: newTodo, todos: allTodos });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error });
        console.log(error);
    }
});
exports.addTodo = addTodo;
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id }, body, } = req;
        yield todo_1.default.findByIdAndUpdate({ _id: id }, body);
        const updatedTodo = yield todo_1.default.findById(id);
        const allTodos = yield todo_1.default.find();
        res.status(200).json({
            message: "Todo updated",
            updatedTodo: updatedTodo,
            todos: allTodos
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error });
        console.log(error);
    }
});
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield todo_1.default.findByIdAndRemove(req.params.id);
        const allTodos = yield todo_1.default.find();
        res.status(200).json({
            message: "Todo deleted",
            todos: allTodos
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error });
        console.log(error);
    }
});
exports.deleteTodo = deleteTodo;
