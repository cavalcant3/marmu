import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: "marmu-sqlite" });

export const SQLite = {
  exec: (sql: string, params?: any[]) => {
    const key = `query_${Date.now()}`;
    storage.set(key, JSON.stringify({ sql, params }));
    return { rowsAffected: 1 };
  },

  query: (sql: string, params?: any[]) => {
    const key = `data_${sql.split(" ")[2]}`;
    const data = storage.getString(key);
    return { rows: { _array: data ? JSON.parse(data) : [] } };
  },
};

export function initDatabase() {
  // Initialize tables
  SQLite.exec(require("./schema.js").ORCAMENTOS_TABLE);
  SQLite.exec(require("./schema.js").PEDIDOS_TABLE);
  SQLite.exec(require("./schema.js").MATERIAIS_TABLE);
}
