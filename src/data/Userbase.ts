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
}