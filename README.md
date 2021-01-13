# WasteAlertServer

# Instructions:

- Create a file .env
- Create Mysql Database
- Create Table by command line or admin client page:
```
CREATE TABLE IF NOT EXISTS `S2I1`.`APP_DATA` ( `ID` INT NOT NULL AUTO_INCREMENT , `phone` TEXT NOT NULL , `latitude` TEXT NOT NULL , `longitude` TEXT NOT NULL , `type` TEXT NOT NULL , PRIMARY KEY (`ID`)) ENGINE = InnoDB;
```
- Log on client admin page and create

# .env content

MYSQLHOST=
MYSQLUSER=
MYSQLPASSWORD=
MYSQLDATABASE=

