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

  async update(user:User, id:string): Promise<number> {
    user = {
      id,
      name: user.name || '',
      surname: user.surname || '',
      birthdate: user.birthdate || new Date().toISOString(),
      profession: user.profession || ''
    };
    return this.db.query(`UPDATE users SET \
      name = CASE WHEN '${user.name}' != '' THEN '${user.name}' ELSE name END, \
      surname = CASE WHEN '${user.surname}' != '' THEN '${user.surname}' ELSE surname END, \
      birthdate = CASE WHEN '${user.birthdate}' != '${new Date().toISOString()}' THEN '${user.birthdate}' ELSE birthdate END, \
      profession = CASE WHEN '${user.profession}' != '' THEN '${user.profession}' ELSE profession END \
      WHERE id = '${id}';
    `);
  }
}

export default UserRepository;
