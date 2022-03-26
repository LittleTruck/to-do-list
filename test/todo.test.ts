import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

const PORT: string | number = process.env.PORT || 8000
const uri = `http://127.0.0.1:${PORT}/api`

let todoCount = 0;
let addedTodoId = "";

describe("Todo List", function () {

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
        todoCount++;

        await chai.request(uri)
            .post('/todos')
            .send(todo)
            .then(async (res: any) => {
                expect(await res.status).to.equal(201)
                addedTodoId = res.body.todo._id;
                expect(await res.body.todo.name).to.equal(todo.name)
                expect(await res.body.todo.description).to.equal(todo.description)
                expect(await res.body.todo.status).to.equal(todo.status)
                expect(await res.body.todos.length).to.equal(todoCount)
            });
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