import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

const PORT: string | number = process.env.PORT || 8000
const uri = `http://127.0.0.1:${PORT}/api`

describe("Todo List", function () {

    it("#1 add", async function () {
        let todo = {
            name: "name1",
            description: "description1",
            status: false
        }

        await chai.request(uri)
            .post('/todos')
            .send(todo)
            .then(async (res: any) => {
                await res.should.have.status(201);
                await res.body.todo.name.should.be.eql(todo.name);
                await res.body.todo.description.should.be.eql(todo.description);
                await res.body.todo.status.should.be.eql(todo.status);
                await res.body.todos.length.should.be.eql(1);
            });
    })

    it("#2 get", async function () {
        await chai.request(uri)
            .get('/todos')
            .then(async (res) => {
                await res.should.have.status(200);
                await res.body.todos.should.be.a('array');
                await res.body.todos.length.should.be.eql(1);
            })
    })
})