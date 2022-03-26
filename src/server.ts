require('dotenv').config();
import express, {Express} from "express"
import mongoose from "mongoose"
import cors from "cors"
import bodyParser from "body-parser"
import todoRoutes from "./routes"
import swaggerUi from "swagger-ui-express"

const app: Express = express()
const PORT: string | number = process.env.PORT || 8000
const swaggerDocument = require('./swagger');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors())
app.use(todoRoutes)

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

const uri: string = `mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`

mongoose
    .connect(uri)
    .then(() =>
        app.listen(PORT, () =>
            console.log(`Server running on http://${process.env.HOST}:${PORT}`)
        )
    )
    .catch(error => {
        throw error
    })