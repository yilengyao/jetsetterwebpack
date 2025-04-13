import { Knex } from "knex";

const handleFetchItems = (db, ipcMain) => {
  ipcMain.handle("database:fetch-items", async () => {
    const items = await db("items").select("*");
    return items;
  });
}

const handleAddItem = (db, ipcMain) => {
  ipcMain.handle("database:add-item", async (event, item) => {
    const id = await db("items").insert(item);
    return { id, ...item };
  });
}

const handleDeleteItem = (db, ipcMain) => {
  ipcMain.handle("database:delete-item", async (event, id) => {
    await db("items").where({ id }).del();
    return true;
  });
}

const handleMarkAsPacked = (db, ipcMain) => {
  ipcMain.handle("database:mark-as-packed", async (event, id) => {
    await db("items").where({ id }).update({ packed: true });
    return true;
  });
}

const handleMarkAllAsUnpacked = (db, ipcMain) => {
  ipcMain.handle("database:mark-all-as-unpacked", async () => {
    await db("items").update({ packed: false });
    return true;
  });
}

const handleDeleteUnpackedItems = (db, ipcMain) => {
  ipcMain.handle("database:delete-unpacked-items", async () => {
    await db("items").where({ packed: false }).del();
    return true;
  });
}

const setupQueries = (db, ipcMain) => {
    handleFetchItems(db, ipcMain);
    handleAddItem(db, ipcMain);
    handleDeleteItem(db, ipcMain);
    handleMarkAsPacked(db, ipcMain);
    handleMarkAllAsUnpacked(db, ipcMain);
    handleDeleteUnpackedItems(db, ipcMain);
}

export default setupQueries;