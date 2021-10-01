-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: mysql-48654-0.cloudclusters.net    Database: appchat
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `idadmin` int NOT NULL,
  `user_idUser` int NOT NULL,
  PRIMARY KEY (`idadmin`,`user_idUser`),
  KEY `fk_admin_user_idx` (`user_idUser`),
  CONSTRAINT `fk_admin_user` FOREIGN KEY (`user_idUser`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `callqueue`
--

DROP TABLE IF EXISTS `callqueue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `callqueue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Userid` int DEFAULT NULL,
  `_Into` varchar(50) DEFAULT NULL,
  `isbussy` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Userid` (`Userid`),
  CONSTRAINT `callqueue_ibfk_1` FOREIGN KEY (`Userid`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=1852 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idfavorite` int NOT NULL,
  `user_idUser` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_favorite_user1_idx` (`user_idUser`),
  KEY `fk_favorite_user2` (`idfavorite`),
  CONSTRAINT `fk_favorite_user1` FOREIGN KEY (`user_idUser`) REFERENCES `user` (`idUser`),
  CONSTRAINT `fk_favorite_user2` FOREIGN KEY (`idfavorite`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=211 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `gifts`
--

DROP TABLE IF EXISTS `gifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gifts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img` text,
  `amount` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inbox`
--

DROP TABLE IF EXISTS `inbox`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inbox` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `receiverId` int NOT NULL,
  `Hash` varchar(100) DEFAULT NULL,
  `lastMessage` varchar(120) DEFAULT NULL,
  `seen` tinyint(1) DEFAULT NULL,
  `unseenNumber` int DEFAULT NULL,
  `deleted_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Hash` (`Hash`),
  KEY `user_fk` (`user_id`),
  KEY `receiver_fk` (`receiverId`),
  KEY `deleted_id_fk` (`deleted_id`),
  CONSTRAINT `deleted_id_fk` FOREIGN KEY (`deleted_id`) REFERENCES `user` (`idUser`),
  CONSTRAINT `receiver_fk` FOREIGN KEY (`receiverId`) REFERENCES `user` (`idUser`),
  CONSTRAINT `user_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `livechatcomments`
--

DROP TABLE IF EXISTS `livechatcomments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `livechatcomments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Username` varchar(100) DEFAULT NULL,
  `Message` text,
  `Gift` int DEFAULT NULL,
  `channelId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `matchhistory`
--

DROP TABLE IF EXISTS `matchhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matchhistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `FirstUserID` int DEFAULT NULL,
  `SecondtUserID` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FirstUserID` (`FirstUserID`),
  KEY `SecondtUserID` (`SecondtUserID`),
  CONSTRAINT `matchhistory_ibfk_1` FOREIGN KEY (`FirstUserID`) REFERENCES `user` (`idUser`),
  CONSTRAINT `matchhistory_ibfk_2` FOREIGN KEY (`SecondtUserID`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=1096 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sendTime` datetime DEFAULT NULL,
  `readTime` datetime DEFAULT NULL,
  `contentImage` text,
  `contentText` text,
  `contentAudio` text,
  `giftCoins` int DEFAULT NULL,
  `SenderId` int NOT NULL,
  `Delete_id` int DEFAULT NULL,
  `Hash_id` varchar(120) NOT NULL,
  `CallsDuration` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `SenderId_fk` (`SenderId`),
  KEY `Delete_fk` (`Delete_id`),
  KEY `Hash__fk` (`Hash_id`),
  CONSTRAINT `Delete_fk` FOREIGN KEY (`Delete_id`) REFERENCES `user` (`idUser`),
  CONSTRAINT `Hash__fk` FOREIGN KEY (`Hash_id`) REFERENCES `inbox` (`Hash`),
  CONSTRAINT `SenderId_fk` FOREIGN KEY (`SenderId`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=701 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `publisherId` int NOT NULL,
  `ContentImg` text,
  PRIMARY KEY (`id`),
  KEY `fk` (`publisherId`),
  CONSTRAINT `fk` FOREIGN KEY (`publisherId`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stories`
--

DROP TABLE IF EXISTS `stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stories` (
  `idstories` int NOT NULL AUTO_INCREMENT,
  `mediaUrl` text,
  `mimeType` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `uploadTime` date DEFAULT NULL,
  `user_idUser` int NOT NULL,
  PRIMARY KEY (`idstories`),
  KEY `fk_stories_user1_idx` (`user_idUser`),
  CONSTRAINT `fk_stories_user1` FOREIGN KEY (`user_idUser`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactionhistory`
--

DROP TABLE IF EXISTS `transactionhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactionhistory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `UserID` int DEFAULT NULL,
  `Amount` int DEFAULT NULL,
  `DateOfTransaction` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `transactionhistory_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=597 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `phoneNumber` varchar(45) DEFAULT NULL,
  `gender` varchar(15) NOT NULL,
  `country` varchar(45) NOT NULL,
  `about` varchar(100) DEFAULT NULL,
  `job` varchar(45) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `education` varchar(45) DEFAULT NULL,
  `profileImage` longtext,
  `IsStreaming` tinyint(1) DEFAULT NULL,
  `isAvailable` tinyint(1) DEFAULT NULL,
  `confirmationStatus` tinyint(1) DEFAULT NULL,
  `activationStatus` tinyint(1) DEFAULT NULL,
  `coins` int DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `_Into` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'appchat'
--
/*!50003 DROP FUNCTION IF EXISTS `InsertUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `InsertUser`( 
  Name VARCHAR(45)  ,
  PhoneNumber VARCHAR(45) ,
  Gender VARCHAR(15)  ,
  Country VARCHAR(45)  ,
  About VARCHAR(100) ,
  Job VARCHAR(45) ,
  Age INT ,
  Education VARCHAR(45) ,
  ProfileImage longtext ,
  _IsStreaming boolean ,
  IsAvailable boolean ,
  ConfirmationStatus boolean ,
  ActivationStatus boolean ,
  Coins INT,
  Password VARCHAR(45),
  Email VARCHAR(45) ) RETURNS int
Begin 
	insert into user(  name,  phoneNumber ,gender ,country ,about ,  job ,age ,education,
    profileImage,IsStreaming ,isAvailable ,confirmationStatus,activationStatus ,coins ,email, password)
      values
      ( Name,PhoneNumber,Gender,Country ,About, Job,Age,Education,ProfileImage,_IsStreaming,IsAvailable,ConfirmationStatus ,ActivationStatus,Coins,Email,Password);
    RETURN LAST_INSERT_ID();

	END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `InsertUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertUser`( 
  Name VARCHAR(45)  ,
  PhoneNumber VARCHAR(45) ,
  Gender VARCHAR(15)  ,
  Country VARCHAR(45)  ,
  About VARCHAR(100) ,
  Job VARCHAR(45) ,
  Age INT ,
  Education VARCHAR(45) ,
  ProfileImage NVARCHAR(50) ,
  _IsStreaming boolean ,
  IsAvailable boolean ,
  ConfirmationStatus boolean ,
  ActivationStatus boolean ,
  Coins INT,
  OUT ID INT,
  Password VARCHAR(45),
  Email VARCHAR(45) )
Begin 
     DECLARE UserId INT DEFAULT 0;
	insert into user(  name,  phoneNumber ,gender ,country ,about ,  job ,age ,education,
    profileImage,IsStreaming ,isAvailable ,confirmationStatus,activationStatus ,coins ,email, password)
      values
      ( Name,PhoneNumber,Gender ,Country ,About, Job,Age,Education,ProfileImage,_IsStreaming,IsAvailable,ConfirmationStatus ,ActivationStatus,Coins,Email,Password);
    set ID = LAST_INSERT_ID();

	END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `MakeTransiction` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `MakeTransiction`( SenderId int, ReciverId int, amount int)
Begin 
		 if (exists(select * from user where coins - amount>=0 and idUser =SenderId)) then
			
            update  user set coins = coins - amount where idUser =SenderId;
			insert into `transactionhistory`(UserID,Amount,DateOfTransaction)values(SenderId,-1*amount,date(now()));

			update  user set coins = coins + amount where idUser =ReciverId;
			insert into `transactionhistory`(UserID,Amount,DateOfTransaction)values(ReciverId,amount,date(now()));
			
            select 0 as "res";
		else
			select 1 as "res";
		end if;
	END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `MakeTransictionToSystem` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`admin`@`%` PROCEDURE `MakeTransictionToSystem`( SenderId int, amount int)
Begin 
		 if (exists(select * from user where coins - amount>=0 and idUser =SenderId)) then
			update  user set coins = coins - amount where idUser =SenderId;
            insert into `transactionhistory`(UserID,Amount,DateOfTransaction)values(SenderId,-1*amount,date(now()));
			select 0 as "res";
		else
			select 1 as "res";
		end if;
	END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `SendMesage` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `SendMesage`(
	ContentImage text ,
	ContentText text ,
	ContentAudio text ,
	giftnumber int ,
	_SenderId int  ,
	_receiverId int,
    _HASH varchar(120),
	Duration int)
begin 
     DECLARE Hash_id VARCHAR(60);
		if(_HASH="") then
        select concat("if",_HASH) ;
			if(exists(select `Hash` from inbox where (user_id =_SenderId or receiverId =_SenderId) and (user_id =_receiverId or receiverId =_receiverId)))then
			select @Hash_id := `Hash` from inbox where user_id =_SenderId or receiverId =_SenderId;
			update inbox set lastMessage=ContentText, unseenNumber=unseenNumber+1 where `Hash`=@Hash_id;
			select Concat('data ',@Hash_id);
			else
				insert into inbox(user_id,receiverId,Hash,lastMessage,seen,unseenNumber,deleted_id)values
				(_SenderId,_receiverId,CONCAT(_SenderId,"-",_receiverId,"-",now()),ContentText,false,10,null);
				set @Hash_id := CONCAT(_SenderId,"-",_receiverId,"-",now());
				select Concat('else data ',Hash_id);
			end if; 
		else
		select concat("else",_HASH) ;
		select @Hash_id :=_HASH;
		update inbox set lastMessage=ContentText, unseenNumber=unseenNumber+1 where `Hash`=_HASH;
        end if;
        insert into message (sendTime,readTime,contentImage,contentText,contentAudio,giftCoins,SenderId,Delete_id,Hash_id,CallsDuration) 
			values (now(),null,ContentImage,ContentText,ContentAudio,giftnumber,_SenderId,null,@Hash_id,Duration);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-10-01  9:02:06
