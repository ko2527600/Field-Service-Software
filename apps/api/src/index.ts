import { createApp } from "./app.js";

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const app = createApp();

app.listen(port, "0.0.0.0", () => {
  console.log(`Fire Armour API listening on http://0.0.0.0:${port}`);
});
