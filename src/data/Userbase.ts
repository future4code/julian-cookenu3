import knex from "knex";

export class Userbase {
    private connection = knex({
        client: "mysql",
        connection: {
            host: process.env.DB_HOST,
            port: 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE_NAME,
        },
    });

    public async getMovies(): Promise<any> {
        const result = await this.connection
            .select("*")
            .from("Movie")
        return result
    }

    private static TABLE_NAME = "User_Cookenu";

    public async createUser(id: string, email: string, password: string): Promise<void>{
        await this.connection
            .insert({
                id,
                email,
                password
            })
            .into(Userbase.TABLE_NAME)
    }

    public async getUserByEmail(email: string): Promise<any> {
        const result = await this.connection
            .select("*")
            .from(Userbase.TABLE_NAME)
            .where({email})

        return result[0]
    }

    public async getUserById(id: string): Promise<any> {
        const result = await this.connection
            .select("*")
            .from(Userbase.TABLE_NAME)
            .where({id})
        return result[0]
    }
}