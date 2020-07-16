import knex from "knex";
import dotenv from 'dotenv'
import express, {Request, Response} from 'express'
import {AddressInfo} from 'net'
import {Userbase} from './data/Userbase'
import {Authenticator} from './service/Authenticator'
import {IdGenerator} from './service/IdGenerator'
import {HashManager} from './service/HashManager'

dotenv.config()

const app = express()

app.use(express.json())

const server = app.listen(process.env.PORT || 3003, () => {
    if(server) {
        const address = server.address() as AddressInfo
        console.log(`Server is runing in ${address.port}`)
    }else{
        console.log(`Server Failure`)
    }
})

app.get('/movie', async (req: Request, res: Response) => {
    try{
        const userDb = new Userbase()
        const movie = await userDb.getMovies()

        res.status(200).send({
            movie
        })
    }
    catch(err){
        res.status(400).send({
            message: err.message
        })
    }
})

app.post('/signup', async (req: Request, res: Response) => {
    try{

        if (!req.body.email || req.body.email.indexOf("@") === -1) {
            throw new Error("Invalid email");
        }

        const userData = {
            email: req.body.email,
            password: req.body.password,
        }

        const generateId = new IdGenerator()
        const id = generateId.generate()

        const hashManager = new HashManager()
        const hashPassword = await hashManager.hash(userData.password)

        const userDb = new Userbase()
        await userDb.createUser(id, userData.email, hashPassword)

        const authenticator = new Authenticator()
        const token = authenticator.generateToken({
            id
        })

        res.status(200).send({
            message: token
        })


    }
    catch(err){
        res.status(400).send({
            message: err.message
        })
    }
})

app.post('/login', async (req: Request, res: Response) => {
    try{
        if (!req.body.email || req.body.email.indexOf("@") === -1) {
            throw new Error("Invalid email");
        }

        const userData = {
            email: req.body.email,
            password: req.body.password
        }

        const userDb = new Userbase()
        const user = await userDb.getUserByEmail(userData.email)

        const hashManager = new HashManager()
        const compareResults = await hashManager.compare(
            userData.password,
            user.password
        )

        if(!compareResults){
            throw new Error("Invalid password")
        }

        const authenticator = new Authenticator()
        const token = authenticator.generateToken({
            id: user.id
        })

        res.status(200).send({
            token
        })
    }
    catch(err){
        res.status(400).send({
            message: err.message
        })
    }
})

app.get('/user/profile', async (req: Request, res: Response) => {
    try{
        const token = req.headers.authorization as string

        const authenticator = new Authenticator()
        const authenticationData = authenticator.getData(token)

        const userDb = new Userbase()
        const user = await userDb.getUserById(authenticationData.id)

        res.status(200).send({
            id: user.id,
            email: user.email
        })

    }
    catch(err){
        res.status(400).send({
            message: err.message
        })
    }
})