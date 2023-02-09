import * as SQLite from "expo-sqlite";
import { RollResult } from "../components/DiceRoll";
import { diceList } from "../types";

const tableName = "dice_roll_history";
type columns = keyof RollResult | "diceName";
const cols: columns[] = ["date", "diceCount", "diceName", "modifier", "rolls", "total"];

export const getDBConnection = async () => {
  return await new Promise<SQLite.WebSQLDatabase>((resolve, reject) => {
    SQLite.openDatabase("dice-rolls.db", undefined, undefined, undefined, (db) => {
      if (!db) reject("Could Not Connect to DB");
      resolve(db);
    });
  });
};

export const createTable = async (db: SQLite.WebSQLDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (
        ${cols.map((col) => `${col} TEXT NOT NULL`)}
      );`;

  await new Promise<boolean>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        [],
        (tx) => {
          resolve(true);
        },
        (tx, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

type RollDBResponse = {
  date: string;
  diceCount: string;
  diceName: string;
  modifier: string;
  rolls: string;
  total: string;
};

export const getDiceRolls = async (
  db: SQLite.WebSQLDatabase,
  diceName: string
): Promise<RollResult[]> => {
  try {
    const query = `SELECT * FROM ${tableName} WHERE diceName = :diceName or (:diceName is null and diceName like '%')`;

    const diceRolls = await new Promise<RollResult[]>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          query,
          [diceName],
          (tx, result) => {
            const temp: RollDBResponse[] = result.rows._array;
            const resp: RollResult[] = [];

            temp.forEach((row: RollDBResponse) => {
              const DiceType = diceList.find((d) => d.diceName === row.diceName);

              if (!DiceType) throw new Error("Unexpected Error Occurred");

              resp.push({
                date: row.date,
                diceType: DiceType,
                diceCount: parseInt(row.diceCount),
                modifier: parseInt(row.modifier),
                rolls: row.rolls.split(",").map((roll) => parseInt(roll)),
                total: parseInt(row.total),
              });
            });

            resolve(resp);
          },
          (tx, error) => {
            reject(error);
            return false;
          }
        );
      });
    });

    return diceRolls;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get DiceRolls !!!");
  }
};

export const saveDiceRolls = async (db: SQLite.WebSQLDatabase, DiceRolls: RollResult) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(${cols.map((col) => `${col}`)}) values` +
    `('${DiceRolls.date}', '${DiceRolls.diceCount}', '${DiceRolls.diceType.diceName}', '${DiceRolls.modifier}', '${DiceRolls.rolls}', '${DiceRolls.total}')`;

  await new Promise<boolean>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        insertQuery,
        [],
        (tx) => {
          resolve(true);
        },
        (tx, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

export const deleteTable = async (db: SQLite.WebSQLDatabase) => {
  const query = `drop table ${tableName}`;

  await db.transaction((tx) => {
    tx.executeSql(query);
  });
};
