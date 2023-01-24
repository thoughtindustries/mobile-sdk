import * as SQLite from "expo-sqlite";
import { WebSQLDatabase } from "expo-sqlite";
import _ from "lodash";
import { courseListType } from "../../types";

class Db {
  db: WebSQLDatabase;

  constructor() {
    this.db = SQLite.openDatabase("db.heliumDb");
  }

  init() {
    return this.createUserTable()
      .then(() => this.tableUpdates())
      .then(() => this.createCourseListTable());
  }

  tableUpdates() {
    //const sql = `DROP TABLE courseList;`;

    return new Promise((resolve, reject) => {
      /*this.db.transaction((tx) => {
        tx.executeSql(sql, [], resolve);
      });*/
      resolve({});
    });
  }

  createUserTable() {
    const sql = `CREATE TABLE IF NOT EXISTS "users" (
        "id"	INTEGER NOT NULL,
        "email"	TEXT NOT NULL UNIQUE,
        PRIMARY KEY("id" AUTOINCREMENT)
    )`;

    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(sql, [], resolve);
      });
    });
  }

  createCourseListTable() {
    const sql = `CREATE TABLE IF NOT EXISTS "courseList" (
        "user_id"	INTEGER NOT NULL,
        "cid"	TEXT NOT NULL UNIQUE,
        "title"	TEXT NOT NULL,
        "description"	BLOB,
        "contentTypeLabel"	TEXT,
        "percentComplete"	NUMERIC,
        "courseThumbnail"	TEXT,
        "createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP
    );`;

    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(sql, [], resolve);
      });
    });
  }

  userLookup(email: string) {
    return new Promise<number>((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          "SELECT id FROM users WHERE email=?",
          [email],
          (tx, { rows: { _array, length } }) => {
            if (length > 0) {
              resolve(_array[0].id);
            } else {
              this.insertUser(email).then(resolve).catch(reject);
            }
          },
          (tx, error) => {
            console.log(error);
            resolve(0);
            return false;
          }
        );
      });
    });
  }

  insertUser(email: string) {
    return new Promise<number>((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO users (email) VALUES (?)",
          [email],
          (tx, results) =>
            resolve(_.isUndefined(results.insertId) ? 0 : results.insertId),
          (tx, error) => {
            console.log("Insert user error", error);
            resolve(0);
            return false;
          }
        );
      });
    });
  }

  saveCourse(user_id: number, course: courseListType, mode: boolean) {
    return new Promise<void>((resolve, reject) => {
      this.db.transaction((tx) => {
        let p1: string = "",
          p2: Array<number | string> = [];

        if (mode) {
          p1 =
            "INSERT INTO courseList (user_id,cid,title,contentTypeLabel,percentComplete,courseThumbnail) VALUES (?,?,?,?,?,?)";
          p2 = [
            user_id,
            course.id,
            course.title,
            course.contentTypeLabel || "",
            course.progress || 0,
            course.asset,
          ];
        } else {
          p1 = "DELETE FROM courseList WHERE user_id=? AND cid=?";
          p2 = [user_id, course.id];
        }

        tx.executeSql(
          p1,
          p2,
          () => resolve(),
          (tx, error) => {
            console.log(error);
            return false;
          }
        );
      });
    });
  }
}
export default new Db();
