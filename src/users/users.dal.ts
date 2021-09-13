import CommonDal from "../common/common.dal";
import {IDatabase} from "pg-promise";

interface IExtensions {
  getAll(): Promise<any>;
}

class UsersDal extends CommonDal implements IExtensions {
  constructor(db:IDatabase<any>) {
    super(db);
  }

  async getAll(): Promise<any> {
    return await this.db.query('SELECT * from users');
  }
}

export default UsersDal;
