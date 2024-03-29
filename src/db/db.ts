import * as SQLite from "expo-sqlite";
import { TI_INSTANCE_NAME } from "@env";
import { courseListType } from "../../types";

const dbName = TI_INSTANCE_NAME.toLocaleLowerCase().replace(/\s+/g, "_");

let db = SQLite.openDatabase(`${dbName}.db`);
db.exec([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false, () => null);

export const initDB = async () => {
  try {
    db = SQLite.openDatabase(`${dbName}.db`);
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
        `SELECT name FROM sqlite_master WHERE type='table' AND name='users';`,
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
        `CREATE TABLE IF NOT EXISTS users (
            id TEXT UNIQUE PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
          );`,
        [],
        (result) => {
          resolve(result);
        },
        (_, error) => {
          console.log(error.message);
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
        `CREATE TABLE IF NOT EXISTS content (
            id TEXT UNIQUE PRIMARY KEY,
            user_id TEXT UNIQUE,
            title TEXT NOT NULL,
            asset TEXT,
            kind TEXT,
            contentTypeLabel TEXT,
            description TEXT,
            progress TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
          );`,
        [],
        (result) => {
          resolve(result);
        },
        (_, error) => {
          console.log(error.message);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const createUser = ({
  id,
  firstName,
  lastName,
  email,
}: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT OR IGNORE INTO users (id, firstName, lastName, email) VALUES (?, ?, ?, ?)",
        [id, firstName, lastName, email],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          console.log(error.message);
          reject(error);
          return false;
        }
      );
    });
  });
};

export const saveContent = ({
  id,
  title,
  asset,
  kind,
  contentTypeLabel,
  progress,
  description,
}: courseListType) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO content (id, title, asset, kind, contentTypeLabel, progress, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          title || "",
          asset || "",
          kind || "",
          contentTypeLabel || "",
          progress || 0,
          description || "",
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const removeContent = ({ id }: courseListType) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM content WHERE id = ?`,
        [id],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const getContent = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM content`,
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const closeDB = async () => {
  await db.closeAsync();
};

export const updateDatabaseSchema = (statement: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const schemaUpdates = [statement];
      const queries = schemaUpdates.join("; ");

      tx.executeSql(
        queries,
        [],
        (_, result) => {
          console.log("Database schema updated successfully");
        },
        (_, error) => {
          console.error("Error updating database schema:", error);
          reject(error);
          return false;
        }
      );
    });
  });
};
