import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";

import { setup } from "../index.js";
import { endpoint } from "./config/config";
import routes from "./routes";

const port = "3001";
const app = express();

if (process.env.NODE === "development") {
  app.use(logger("dev"));
}

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "500mb" }));

app.use((req: any, res: any, next: any) => {
  next();
});

app.use("/", routes.base);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      substrate: any;
      keyring: any;
    }
  }
}

app.listen(port, async () => {
  console.log(`Api listening on port ${port}!`);
  const returned: any = await setup(endpoint);

  global.substrate = returned.api;
  global.keyring = returned.keyring;
});
