import mysql from "mysql";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
});

export const InitializeDB = async () => {
  return new Promise((resolve) => {
    try {
      connection.query(
        "CREATE TABLE IF NOT EXISTS `S2I1`.`APP_DATA` ( `ID` INT NOT NULL AUTO_INCREMENT , `phone` TEXT NOT NULL , `latitude` TEXT NOT NULL , `longitude` TEXT NOT NULL , `type` TEXT NOT NULL , PRIMARY KEY (`ID`)) ENGINE = InnoDB;",
        function (error, results) {
          if (error) resolve({ status: "error", data: error.code });
          resolve({ status: "success", data: results });
        }
      );
    } catch (error) {
      resolve({
        status: "error",
        data: "Connessiona al Database non riuscita.",
      });
    }
  });
};

export const GetDataFromDB = async (phone) => {
  console.log("GETTING DATA FROM DB");
  return new Promise((resolve) => {
    connection.query(
      `SELECT * FROM APP_DATA WHERE phone=${phone}`,
      function (error, results) {
        if (error) resolve({ status: "error", data: error.code });
        resolve({ status: "success", data: results });
      }
    );
  });
};

export const GetAllDataFromDB = async () => {
  console.log("GETTING DATA FROM DB");
  return new Promise((resolve) => {
    connection.query("SELECT * FROM `APP_DATA`", function (error, results) {
      if (error) resolve({ status: "error", data: error.code });
      resolve({ status: "success", data: results });
    });
  });
};

export const InsertDataToDB = async (phone, latitude, longitude, type) => {
  console.log(
    `INSERT DATA TO DB >>> PHONE:${phone}, LATITUDE: ${latitude}, LONGITUDE: ${longitude}, TYPE: ${type}`
  );
  return new Promise((resolve) => {
    connection.query(
      `INSERT INTO APP_DATA (id, phone, latitude, longitude, type) VALUES (NULL, '${phone}', '${latitude}', '${longitude}', '${type}');`,
      function (error, results) {
        if (error) throw error;
        resolve(results);
      }
    );
  });
};

export const CreateFileByID = async (ID, buffer) => {
  return new Promise((resolve) => {
    fs.writeFile(`${__dirname}/uploads/${ID}.jpg`, buffer, (err) => {
      if (!err) console.log("Data written");
      resolve("Upload Effettuato");
    });
  });
};

export const DeleteDataByID = async (ID) => {
  return new Promise((resolve) => {
    connection.query(
      `DELETE FROM APP_DATA WHERE ID=${ID}`,
      function (error, results) {
        if (error) resolve({ status: "error", data: error.code });
        fs.unlink(`${__dirname}/uploads/${ID}.jpg`, (err) => {
          resolve({ status: "error", data: "Impossibile cancellare il file" });
        });
        resolve({ status: "success" });
      }
    );
  });
};
