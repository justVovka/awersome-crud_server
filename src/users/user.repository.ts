import {IDatabase} from "pg-promise";
import {User} from "./user.model";
import {IResult} from "pg-promise/typescript/pg-subset";

class UserRepository {
  constructor(private db:IDatabase<any>) {}

  async all():Promise<Array<User>> {
    return this.db.any('SELECT * FROM users');
  }

  async findById(id: string): Promise<User | null> {
    return this.db.oneOrNone(`SELECT * FROM users WHERE id = ${id}`);
  }

  async findByName(name: string): Promise<User | null> {
    return this.db.oneOrNone(`SELECT * FROM users WHERE name = ${name}`);
  }

  async add(id: string, name: string, surname: string, birthdate: Date, profession?: string): Promise<User> {
    return this.db.one(
      `INSERT INTO users(id, name, surname, birthdate, profession) 
            VALUES (${id}, ${name}, ${surname}, ${birthdate}, ${profession});`);
  }

  async remove(id: string): Promise<number> {
    return this.db.result(`DELETE FROM users WHERE id = ${id}`, (r: IResult) => r.rowCount);
  }

  async total(): Promise<number> {
    return this.db.one('SELECT count(*) FROM users', [], (a: { count: string }) => +a.count);
  }

  async empty(): Promise<null> {
    return this.db.none(`TRUNCATE TABLE users CASCADE`);
  }
}

export default UserRepository;
