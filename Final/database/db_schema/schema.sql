/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE TABLE IF NOT EXISTS `user` (
  `usr_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usr_first_name` varchar(100) NOT NULL,
  `usr_last_name` varchar(100) NOT NULL,
  `usr_username` varchar(150) NOT NULL,
  `usr_password` varchar(255) NOT NULL,
  `usr_salt` varchar(100) NOT NULL,
  PRIMARY KEY (`usr_id`),
  UNIQUE KEY `uq_user_username` (`usr_username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `game` (
  `gme_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `gme_slug` varchar(100) NOT NULL,
  `gme_name` varchar(100) NOT NULL,
  `gme_image` varchar(255) NOT NULL,
  PRIMARY KEY (`gme_id`),
  UNIQUE KEY `uq_game_slug` (`gme_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `review` (
  `rev_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rev_usr_id` int(10) unsigned NOT NULL,
  `rev_gam_id` int(10) unsigned NOT NULL,
  `rev_score` int(11) NOT NULL,
  `rev_message` varchar(500) NOT NULL,
  `rev_created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `rev_updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`rev_id`),
  UNIQUE KEY `uq_review_user_game` (`rev_usr_id`,`rev_gam_id`),
  KEY `FK_REV_USR` (`rev_usr_id`),
  KEY `FK_REV_GAM` (`rev_gam_id`),
  CONSTRAINT `FK_REV_GAM` FOREIGN KEY (`rev_gam_id`) REFERENCES `game` (`gme_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_REV_USR` FOREIGN KEY (`rev_usr_id`) REFERENCES `user` (`usr_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `activity` (
  `act_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `act_usr_id` int(10) unsigned NOT NULL,
  `act_gam_id` int(10) unsigned NOT NULL,
  `act_action` ENUM('playing', 'finished', 'dropped') DEFAULT NULL,
  PRIMARY KEY (`act_id`),
  UNIQUE KEY `uq_activity_user_game` (`act_usr_id`, `act_gam_id`),  -- ADD THIS
  KEY `FK_ACT_USR` (`act_usr_id`),
  KEY `FK_ACT_GAM` (`act_gam_id`),
  CONSTRAINT `FK_ACT_GAM` FOREIGN KEY (`act_gam_id`) REFERENCES `game` (`gme_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_ACT_USR` FOREIGN KEY (`act_usr_id`) REFERENCES `user` (`usr_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `follow` (
  `flw_following_user_id` int(10) unsigned NOT NULL,
  `flw_followed_user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`flw_following_user_id`,`flw_followed_user_id`),
  KEY `FK_FLW_FOLLOWED` (`flw_followed_user_id`),
  CONSTRAINT `FK_FLW_FOLLOWED` FOREIGN KEY (`flw_followed_user_id`) REFERENCES `user` (`usr_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_FLW_FOLLOWING` FOREIGN KEY (`flw_following_user_id`) REFERENCES `user` (`usr_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_game` (
  `urg_usr_id` int(10) unsigned NOT NULL,
  `urg_gme_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`urg_usr_id`,`urg_gme_id`),
  KEY `FK_URG_GME` (`urg_gme_id`),
  CONSTRAINT `FK_URG_GME` FOREIGN KEY (`urg_gme_id`) REFERENCES `game` (`gme_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_URG_USR` FOREIGN KEY (`urg_usr_id`) REFERENCES `user` (`usr_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
