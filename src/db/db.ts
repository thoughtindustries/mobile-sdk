import * as SQLite from "expo-sqlite";
import { TI_INSTANCE_NAME } from "@env";

const db = SQLite.openDatabase(`${TI_INSTANCE_NAME}.db`);

export const initDB = async () => {
  try {
    await createUsersTable();
    await createContentTable();
    console.log("Database successfully initiated!");
  } catch (error) {
    console.log("Database initialization failed: ", error);
  }
};

export const checkUsersTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='Users';`,
        [],
        (_, result) => {
          const rowCount = result.rows.length;
          const tableExists = rowCount > 0;
          resolve(tableExists);
        },
        (error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const createUsersTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
          );`,
        [],
        (result) => {
          resolve(result);
        },
        (error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

const createContentTable = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Content (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description BLOB,
                contentTypeLabel TEXT,
                percentComplete TEXT,
                courseThumbnail TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES Users (id)
            );`,
        [],
        (result) => {
          resolve(result);
        },
        (error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};
