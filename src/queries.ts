import { ipcMain } from "electron";
import { Knex } from "knex";

const handleFetchItems = (db: Knex) => {
  ipcMain.handle("database:fetch-items", async () => {
    const items = await db("items").select("*");
    return items;
  });
}

const handleAddItem = (db: Knex) => {
  ipcMain.handle("database:add-item", async (event, item) => {
    console.log("item in query: ", item);
    const id = await db("items").insert(item);
    return { id, ...item };
  });
}

const handleDeleteItem = (db: Knex) => {
  ipcMain.handle("database:delete-item", async (event, id) => {
    await db("items").where({ id }).del();
    return true;
  });
}

const handleMarkAsPacked = (db: Knex) => {
  ipcMain.handle("database:mark-as-packed", async (event, id) => {
    await db("items").where({ id }).update({ packed: true });
    return true;
  });
}

const handleMarkAllAsUnpacked = (db: Knex) => {
  ipcMain.handle("mark-all-as-unpacked", async () => {
    await db("items").update({ packed: false });
    return true;
  });
}

const handleDeleteUnpackedItems = (db: Knex) => {
  ipcMain.handle("database:delete-unpacked-items", async () => {
    await db("items").where({ packed: false }).del();
    return true;
  });
}

const setupQueries = (db: Knex) => {
    handleFetchItems(db);
    handleAddItem(db);
    handleDeleteItem(db);
    handleMarkAsPacked(db);
    handleMarkAllAsUnpacked(db);
    handleDeleteUnpackedItems(db);
}

export default setupQueries;