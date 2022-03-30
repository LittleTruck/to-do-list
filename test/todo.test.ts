import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import Todo from "../src/models/todo"
import {getTodos, getTodo, addTodo, updateTodo, deleteTodo} from "../src/controllers/todos"

chai.use(chaiHttp);

const PORT: string | number = process.env.PORT || 8000
const uri = `http://127.0.0.1:${PORT}/api`
const sinon = require("sinon");

let todoCount = 0;
let addedTodoId = "";

describe("Todo List", function () {
    this.beforeEach(async () => {
        await sinon.restore();
    })
    it("#1 getTodos", async function () {
        await chai.request(uri)
            .get('/todos')
            .then(async (res) => {
                expect(await res.status).to.equal(200)
                todoCount = res.body.todos.length;
            })
    })

    it("#2 addTodo", async function () {
        let todo = {
            name: "name1",
            description: "description1",
            status: false
        }

        let res = {} as any;
        const todoRequest = {
            body: {
                name: "name1",
                description: "description1",
                status: false
            },
        } as any;

        sinon.stub(Todo.prototype, 'save').returns(todo);
        sinon.stub(Todo, 'find').returns(todoRequest);
        
        try {
             await addTodo(todoRequest, res);
        }catch (err){
            console.log(err)
        }
        await console.log(res)
        // await expect(todo.name).to.equal(res.body.name);
    })

    it("#3 getTodo", async function () {
        let id: string | undefined = undefined, name: null, description: null;

        await chai.request(uri)
            .get('/todos')
            .then(async (res) => {
                id = res.body.todos[0]._id;
                name = res.body.todos[0].name;
                description = res.body.todos[0].description;
            })

        await chai.request(uri)
            .get(`/todos/${id}`)
            .then(async (res) => {
                expect(await res.status).to.equal(200)
                expect(await res.body.todo.name).to.equal(name)
                expect(await res.body.todo.description).to.equal(description)
            });
    })

    it("#4 updateTodo", async function () {
        let todo = {
            name: "changed name",
            description: "changed description",
            status: true
        }

        await chai.request(uri)
            .put(`/todos/${addedTodoId}`)
            .send(todo)
            .then(async (res: any) => {
                expect(await res.status).to.equal(200)
                expect(await res.body.updatedTodo.name).to.equal(todo.name)
                expect(await res.body.updatedTodo.description).to.equal(todo.description)
                expect(await res.body.updatedTodo.status).to.equal(todo.status)
                expect(await res.body.todos.length).to.equal(todoCount)
            });
    })

    it("#5 deleteTodo", async function () {
        todoCount--;

        await chai.request(uri)
            .delete(`/todos/${addedTodoId}`)
            .then(async (res) => {
                expect(await res.status).to.equal(200)
                expect(await res.body.todos.length).to.equal(todoCount);
            });
    })
})