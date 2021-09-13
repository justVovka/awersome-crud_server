import {IDatabase} from "pg-promise";

abstract class CommonDal {
  protected readonly db:IDatabase<any>;

  protected constructor(db:IDatabase<any>) {
    this.db = db;
  }
}

export default CommonDal;
