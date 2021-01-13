import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { InitializeDB } from "./helpers.mjs";
import {
  GetDataFromDB,
  InsertDataToDB,
  CreateFileByID,
  DeleteDataByID,
  GetAllDataFromDB,
} from "./helpers.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

var upload = multer();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

//GET
app.get("/", async (req, res) => {
  //const result = await InitializeDB();
  const result = await GetDataFromDB(req.query.phone);
  res.status(200).json({ result });
});

//UPLOAD
app.post("/", upload.single("file"), async function (req, res, next) {
  try {
    const result = await InsertDataToDB(
      req.body.phone,
      req.body.latitude,
      req.body.longitude,
      req.body.type,
      req.file
    );
    await CreateFileByID(result.insertId, req.file.buffer);
    const result2 = await GetDataFromDB(req.body.phone);
    res.status(200).json({ status: "success", result: result2 });
  } catch (error) {
    res
      .status(200)
      .json({ status: "error", result: "Impossibile inserire dati" });
  }
});

//DELETE
app.delete("/", async (req, res) => {
  const result = await DeleteDataByID(req.body.id);
  res.status(200).json({ result });
});

//---------------
//ADMIN
//---------------

//GET
app.get("/admin", async (req, res) => {
  console.log("GETTING ALL DATA FROM DB");
  const result = await GetAllDataFromDB();
  res.status(200).json({ result });
});

app.get("/createDB", async (req, res) => {
  console.log("CREATING DB");
  const result = await InitializeDB();
  res.status(200).json({ result });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
