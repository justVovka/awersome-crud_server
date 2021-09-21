import {IDatabase} from "pg-promise";
import {User} from "./user.model";

class UserRepository {
  constructor(private db:IDatabase<any>) {}

  async all():Promise<Array<User>> {
    return this.db.any('SELECT * FROM users');
  }

  async findById(id: string): Promise<User | null> {
    return this.db.one(`SELECT * FROM users WHERE id = '${id}'`);
  }

  async findByName(name: string): Promise<User | null> {
    return this.db.oneOrNone(`SELECT * FROM users WHERE name = ${name}`);
  }

  async add(id: string, name: string, surname: string, birthdate: Date, profession?: string): Promise<User> {
    if (!id) {
      throw new Error('Property "id" is required');
    }
    if (!name) {
      throw new Error('Property "name" is required');
    }
    if (!surname) {
      throw new Error('Property "surname" is required');
    }
    if (!birthdate) {
      throw new Error('Property "birthdate" is required');
    }

    return this.db.query(
      `INSERT INTO users(id, name, surname, birthdate, profession) 
            VALUES ('${id}', '${name}', '${surname}', '${birthdate}', '${profession}');`);
  }

  async remove(id: string): Promise<number> {
    return this.db.query(`DELETE FROM users WHERE id = '${id}';`);
  }

  async total(): Promise<number> {
    return this.db.one('SELECT count(*) FROM users', [], (a: { count: string }) => +a.count);
  }

  async empty(): Promise<null> {
    return this.db.none(`TRUNCATE TABLE users CASCADE`);
  }
}

export default UserRepository;
