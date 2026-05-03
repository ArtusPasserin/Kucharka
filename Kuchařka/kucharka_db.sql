-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: kucharka
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `ingredience`
--

DROP TABLE IF EXISTS `ingredience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredience` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nazev` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredience`
--

LOCK TABLES `ingredience` WRITE;
/*!40000 ALTER TABLE `ingredience` DISABLE KEYS */;
INSERT INTO `ingredience` VALUES (1,'Brambory'),(2,'Vajíčka'),(3,'Sýr'),(4,'Máslo');
/*!40000 ALTER TABLE `ingredience` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recepty`
--

DROP TABLE IF EXISTS `recepty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recepty` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nazev` varchar(255) NOT NULL,
  `postup` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recepty`
--

LOCK TABLES `recepty` WRITE;
/*!40000 ALTER TABLE `recepty` DISABLE KEYS */;
INSERT INTO `recepty` VALUES (1,'Pečené brambory','Dej péct brambory'),(2,'Míchaná vajíčka','Dej vajíčka na pánev');
/*!40000 ALTER TABLE `recepty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recepty_ma_ingredience`
--

DROP TABLE IF EXISTS `recepty_ma_ingredience`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recepty_ma_ingredience` (
  `recept_id` int NOT NULL,
  `ingredience_id` int NOT NULL,
  `mnozstvi` varchar(50) NOT NULL,
  PRIMARY KEY (`recept_id`,`ingredience_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recepty_ma_ingredience`
--

LOCK TABLES `recepty_ma_ingredience` WRITE;
/*!40000 ALTER TABLE `recepty_ma_ingredience` DISABLE KEYS */;
INSERT INTO `recepty_ma_ingredience` VALUES (1,1,'150g'),(1,2,'70g'),(2,3,'2x'),(2,4,'30g');
/*!40000 ALTER TABLE `recepty_ma_ingredience` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-21  9:55:36
