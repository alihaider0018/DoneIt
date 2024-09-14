import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";

import router from "./routes/index";

const app: Application = express();
const PORT: number = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is lisenting on port ${PORT}`);
});
