import { BaseDatabase } from "./BaseDatabase";
import moment = require("moment");

export class RecipeDatabase extends BaseDatabase {
  private tableName = "Recipe";

  async create(
    id: string,
    title: string,
    description: string,
    user_id: string,
    date_register: string = moment().format("YYYY-MM-DD")
  ) {
    try {
      await this.getConnection()
        .insert({
          id,
          title,
          description,
          date_register,
          user_id,
        })
        .into(this.tableName);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    } finally {
      // BaseDatabase.destroyConnection();
    }
  }
}
