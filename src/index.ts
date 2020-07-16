import knex from "knex";
import dotenv from 'dotenv'
import express, {Request, Response} from 'express'
import {AddressInfo} from 'net'
import {Userbase} from './data/Userbase'

dotenv.config()

const app = express()

app.use(express.json())

const server = app.listen(process.env.PORT || 3303, () => {
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