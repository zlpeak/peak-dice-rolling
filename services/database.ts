import * as SQLite from "expo-sqlite";
import { RollResult } from "../components/DiceRoll";

const tableName = "dice_roll_history";
type columns = keyof RollResult | "diceName";
const cols: columns[] = ["date", "diceCount", "diceName", "modifier", "rolls", "total"];

export const getDBConnection = async () => {
  return await new Promise<SQLite.WebSQLDatabase>((resolve, reject) => {
    SQLite.openDatabase("dice-rolls.db", undefined, undefined, undefined, (db) => {
      resolve(db);
    });
  });
};

export const createTable = async (db: SQLite.WebSQLDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
        ${cols.map((col) => `${col} TEXT NOT NULL`)}
      );`;

  db.transaction((tx) => {
    tx.executeSql(query);
  });
};

export const getDiceRolls = async (db: SQLite.WebSQLDatabase): Promise<RollResult[]> => {
  try {
    const DiceRolls: RollResult[] = [];

    const query = `SELECT * FROM ${tableName}`;

    const response = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          query,
          [],
          (tx, result) => {
            resolve(result);
          },
          (tx, error) => {
            reject(error);
            return false;
          }
        );
      });
    });

    console.log("response: ", response);

    return DiceRolls;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get DiceRolls !!!");
  }
};

export const saveDiceRolls = async (db: SQLite.WebSQLDatabase, DiceRolls: RollResult) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, value) values` +
    `(${DiceRolls.date}, '${DiceRolls.diceCount}', '${DiceRolls.diceType.diceName}', '${DiceRolls.modifier}', '${DiceRolls.rolls}', '${DiceRolls.total}')`;

  return await db.transaction((tx) => {
    tx.executeSql(insertQuery);
  });
};

// export const deleteDiceRoll = async (db: SQLite.WebSQLDatabase, id: number) => {
//   const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
//   await db.executeSql(deleteQuery);
// };

export const deleteTable = async (db: SQLite.WebSQLDatabase) => {
  const query = `drop table ${tableName}`;

  await db.transaction((tx) => {
    tx.executeSql(query);
  });
};
