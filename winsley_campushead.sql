-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: mysql.campushead.com
-- Generation Time: Jul 31, 2019 at 08:24 PM
-- Server version: 5.7.24-log
-- PHP Version: 7.1.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `winsley_campushead`
--

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `title`, `content`, `created_by`, `created_date`, `pid`, `type`) VALUES
(142, NULL, 'comment\n1', 218, '2019-07-24 03:27:22', 481, 'post'),
(143, NULL, 'asdf', 218, '2019-07-24 03:41:11', 483, 'post'),
(145, NULL, 'adsf', 218, '2019-07-24 05:01:32', 481, 'post'),
(146, NULL, 'aaaaa', 218, '2019-07-24 05:01:51', 484, 'post'),
(147, NULL, 'hhh', 218, '2019-07-24 05:02:15', 483, 'post'),
(148, NULL, 'yes!', 222, '2019-07-24 18:58:44', 477, 'post'),
(149, NULL, 'test', 218, '2019-07-25 09:26:02', 484, 'post'),
(150, NULL, 'shj????????????dgg', 218, '2019-07-25 13:47:47', 496, 'post'),
(151, NULL, 'xcvzxcv????????????kkh', 218, '2019-07-25 13:51:01', 500, 'post'),
(152, NULL, 'ddd', 218, '2019-07-29 10:24:12', 485, 'post'),
(153, NULL, 'fff', 218, '2019-07-29 12:42:09', 490, 'post'),
(154, NULL, 'we should totally sing your song and resurrecting king like the one in the video of the guy', 222, '2019-07-30 05:18:32', 521, 'post'),
(155, NULL, 'how many songs do you see?', 216, '2019-07-30 05:22:44', 524, 'post'),
(156, NULL, 'I see 11 but was just wondering if that was an option. ', 222, '2019-07-30 05:51:52', 524, 'post'),
(157, NULL, 'yeah, you can delete songs', 216, '2019-07-30 05:56:29', 524, 'post'),
(158, NULL, 'yaweh*', 216, '2019-07-30 06:08:08', 523, 'post'),
(159, NULL, 'good song', 218, '2019-07-30 09:43:10', 523, 'post'),
(160, NULL, 'comment', 216, '2019-07-30 10:06:08', 523, 'post'),
(161, NULL, 'k', 218, '2019-07-30 10:07:15', 524, 'post'),
(162, NULL, 'my time is 01:10 AM', 218, '2019-07-30 10:09:53', 523, 'post'),
(163, NULL, 'aaa', 218, '2019-07-30 21:15:31', 526, 'post'),
(164, NULL, 'aaa', 218, '2019-07-30 21:17:11', 523, 'post'),
(165, NULL, 'aaa', 223, '2019-07-30 21:25:20', 526, 'post'),
(166, NULL, 'ds', 223, '2019-07-30 22:15:31', 527, 'post'),
(167, NULL, 'test', 223, '2019-07-31 02:17:37', 527, 'post'),
(168, NULL, 'adf\n', 224, '2019-07-31 07:19:50', 529, 'post'),
(169, NULL, 'aaa', 223, '2019-07-31 14:30:57', 534, 'post'),
(170, NULL, 'sdfsdf', 223, '2019-07-31 14:32:14', 536, 'post'),
(171, NULL, 'sdf', 223, '2019-07-31 14:34:06', 537, 'post'),
(172, NULL, 'asdf', 223, '2019-07-31 14:34:24', 536, 'post'),
(173, NULL, 'fasdf', 223, '2019-07-31 14:44:29', 540, 'post'),
(174, NULL, 'aaaaa', 223, '2019-07-31 14:45:37', 542, 'post'),
(175, NULL, 'sadf', 223, '2019-07-31 14:48:17', 540, 'post'),
(176, NULL, 'sdf', 223, '2019-07-31 14:48:34', 542, 'post');

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `title` varchar(125) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_date` date DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`id`, `title`, `description`, `start`, `end`, `created_by`, `created_date`) VALUES
(165, 'New event', 'some description of event \nlong description also ahshdvd d\nddjduxuduhd\ndjxhdndkjd did did so did duck d\ndud dud dud dud UCLA d\nd dhd did duck dud df\nf fudge during d', '2019-07-26T16:00:00.587', '2019-07-26T16:00:00.587', 216, '2019-07-26'),
(166, 'aaa', 'aaa', '2019-07-27T04:00:00.863', '2019-07-27T04:00:00.863', 218, '2019-07-26'),
(167, 'Service', 'Be Lifted\nAfrican Medley\nNo Bondage\n', '2019-07-28T13:00:00.000', '2019-07-28T16:00:00.496', 216, '2019-07-28'),
(168, 'New Event', 'test desc.', '2019-07-29T16:00:00.147', '2019-07-29T16:00:00.147', 216, '2019-07-29'),
(169, 'time test', '', '2019-07-30T04:00:00.052', '2019-07-31T04:00:00.000', 218, '2019-07-30'),
(170, 'New test', 'some description ', '2019-07-30T16:00:00.320', '2019-07-30T16:00:00.320', 216, '2019-07-30'),
(171, '55555', '55555', '2019-07-30T16:00:00.283', '2019-07-30T16:00:00.283', 216, '2019-07-30'),
(172, 'New new', '', '2019-07-30T16:30:00.000', '2019-07-30T16:00:00.735', 216, '2019-07-30'),
(219, 'Event events ', 'DTCC has been a ', '2019-07-31T16:00:00.363', '2019-07-31T16:00:00.363', 216, '2019-07-31'),
(218, 'test event', '', '2019-07-31T04:00:00.673', '2019-07-31T04:00:00.673', 224, '2019-07-31'),
(216, 'New 31st event', 'the first time for the u.s. ', '2019-07-31T16:00:00.817', '2019-07-31T16:00:00.817', 216, '2019-07-31');

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int(11) NOT NULL,
  `song_id` int(11) DEFAULT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `song_id`, `path`, `name`, `created_date`) VALUES
(15, 216, 'public/uploads/media/image-bb1e3d53-0788-48ee-8bfe-fda3f4abed12.jpg', 'image-bb1e3d53-0788-48ee-8bfe-fda3f4abed12.jpg', '2019-07-22 09:19:57'),
(17, 217, 'public/uploads/media/image-78551142-9f9e-4313-8052-5462365c3a69.jpg', 'image-78551142-9f9e-4313-8052-5462365c3a69.jpg', '2019-07-30 05:12:56');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `song_id` int(11) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`id`, `title`, `content`, `created_by`, `created_date`, `song_id`, `team_id`) VALUES
(485, '', 'asdf', 218, '2019-07-24 05:02:04', 216, NULL),
(484, '', 'afds', 218, '2019-07-24 04:47:54', 216, NULL),
(483, '', 'Hello\n', 218, '2019-07-23 23:17:58', 216, NULL),
(494, '', 'asdf', 218, '2019-07-24 15:43:23', NULL, 137),
(481, '', 'test ', 218, '2019-07-23 07:40:57', NULL, 137),
(480, '', 'test', 218, '2019-07-23 07:40:18', NULL, 137),
(477, '', 'Be lifted!', 216, '2019-07-22 08:51:04', 215, NULL),
(478, '', 'asdf', 218, '2019-07-23 03:17:58', NULL, 137),
(479, '', 'hello', 218, '2019-07-23 06:25:00', NULL, 137),
(497, '', 'asdfasdf????????????????????????????????????????????‍????‍????????‍????‍????‍????sdfadf', 218, '2019-07-25 12:03:16', NULL, 137),
(490, '', 'sadfasdf', 218, '2019-07-24 06:29:05', 216, NULL),
(496, '', 'hellosdf ????????????????????⛔sdfsdf????????????????', 218, '2019-07-25 12:02:12', NULL, 137),
(495, '', 'another version https://youtu.be/KeXcHAurv5A', 216, '2019-07-25 07:55:10', 218, NULL),
(498, '', 'c2RmZ3NkZg==', 218, '2019-07-25 12:07:42', NULL, 137),
(499, '', 'dk9mRk', 218, '2019-07-25 12:09:11', NULL, 137),
(500, '', 'fdgdsdfsdf????????????fsdfsd', 218, '2019-07-25 12:11:36', NULL, 137),
(501, '', 'test 😅 test', 218, '2019-07-26 03:07:13', NULL, 137),
(502, '', 'sdf', 218, '2019-07-26 03:21:54', NULL, 137),
(503, '', 'test????ss', 218, '2019-07-26 03:22:59', NULL, 137),
(504, '', 'sdf', 218, '2019-07-26 03:28:40', NULL, 137),
(505, '', 'a????????b', 218, '2019-07-26 03:34:25', NULL, 137),
(506, '', '????', 218, '2019-07-26 03:35:36', NULL, 137),
(507, '', 's????a', 218, '2019-07-26 03:38:44', NULL, 137),
(508, '', '????', 218, '2019-07-26 03:41:11', NULL, 137),
(509, '', '????', 218, '2019-07-26 03:43:33', NULL, 137),
(510, '', '????', 218, '2019-07-26 03:44:15', NULL, 137),
(511, '', '????', 218, '2019-07-26 03:45:43', NULL, 137),
(512, '', '????', 218, '2019-07-26 03:46:07', NULL, 137),
(513, '', '????', 218, '2019-07-26 03:53:36', NULL, 137),
(514, '', '????', 218, '2019-07-26 03:54:35', NULL, 137),
(515, '', '????', 218, '2019-07-26 03:55:26', NULL, 137),
(516, '', '????', 218, '2019-07-26 03:57:15', NULL, 137),
(517, '', '????', 218, '2019-07-26 04:06:52', NULL, 137),
(518, '', '????', 218, '2019-07-26 04:10:57', NULL, 137),
(519, '', '\\uD83E\\uDD11', 218, '2019-07-26 04:12:13', NULL, 137),
(520, '', '????', 218, '2019-07-26 04:45:24', NULL, 137),
(521, '', '@Alescia See if you can add a song.', 216, '2019-07-26 16:37:21', NULL, 135),
(522, '', 'test', 218, '2019-07-29 12:43:44', 225, NULL),
(523, '', 'Eh oh Wey!', 216, '2019-07-30 05:14:26', 217, NULL),
(524, '', 'Can I delete a song?', 222, '2019-07-30 05:19:36', NULL, 135),
(525, '', 't', 218, '2019-07-30 19:15:25', NULL, 135),
(526, '', 'aaa', 218, '2019-07-30 21:14:41', NULL, 135),
(527, '', 'aa', 223, '2019-07-30 21:26:25', NULL, 135),
(528, '', '????', 216, '2019-07-31 05:17:40', NULL, 135),
(529, '', 'asd', 224, '2019-07-31 05:25:42', NULL, 139),
(530, '', 'aaa', 224, '2019-07-31 08:23:30', NULL, 139),
(531, '', 'asdf', 224, '2019-07-31 09:18:40', NULL, 139),
(532, '', 'test post', 224, '2019-07-31 14:19:25', NULL, 135),
(533, '', 'aa', 224, '2019-07-31 14:21:25', 229, NULL),
(534, '', 'test post\n', 223, '2019-07-31 14:23:17', NULL, 140),
(535, '', 'aaa', 223, '2019-07-31 14:31:13', NULL, 140),
(536, '', 'aaa', 223, '2019-07-31 14:32:00', 230, NULL),
(537, '', 'sdf', 223, '2019-07-31 14:34:01', NULL, 140),
(538, '', 'sfg', 223, '2019-07-31 14:38:53', 230, NULL),
(539, '', 'asdf', 223, '2019-07-31 14:40:06', 230, NULL),
(540, '', 'asdf', 223, '2019-07-31 14:44:18', NULL, 140),
(541, '', 'asdfasdf', 223, '2019-07-31 14:45:11', 230, NULL),
(542, '', 'aaa', 223, '2019-07-31 14:45:24', 230, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `song`
--

CREATE TABLE `song` (
  `id` int(11) NOT NULL,
  `name` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL,
  `artist` varchar(125) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `songkey` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tempo` varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lyrics` longtext COLLATE utf8mb4_unicode_ci,
  `uid` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `postid` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `song`
--

INSERT INTO `song` (`id`, `name`, `artist`, `songkey`, `tempo`, `link`, `lyrics`, `uid`, `created_date`, `postid`) VALUES
(217, 'African Medley', 'Tye Tribbett', 'F', '', 'https://youtu.be/45hDqPHfLPs', 'Eh oh wey yaweh oh wey yaweh yah\nEh oh wey yaweh oh wey yaweh yah\nEh oh wey Yahweh oh wey yaweh yah (wey yah)\nEh oh wey Yahweh oh wey Yahweh yah (wey yah)\n\nEh eh eh eh\nMy God is good oh\nEh eh eh eh\nMy God is good oh\nEh eh eh eh\nMy God is good oh\nEh eh eh eh\nMy God is good oh\n\nHere we go now, uh yeah\n\nIn the morning when I wake up\nAnd I will sing my praise unto You, my Lord\nAnd I will shout and dance to You (yeah)\nFor You have been my help from now till ever\n\nCome on\n\nEh eh eh your God is good oh\nEh eh eh my God is good oh\nEh eh eh eh eh eh your God is good oh\nEh eh eh my God is good oh (Here we go)\n\nIn the morning when I wake up\nI will sing my praise unto You, my Lord\nHey, I will shout and dance to You\nFor You have been my help another level, yeah\n\nEh eh eh eh eh my God is good oh\nEh eh eh my God is good oh\nSing: Eh eh eh eh eh eh your God is good oh\nEh eh eh my God is good oh\n\nEverything now double double oh\nNa double double\nAnointing double double oh\nNa double double\nAll power double double oh\nNa double double\nAll wisdom double double oh\nNa double double\nYour house so double double oh, let\'s go\nNa double double\nYour money double double oh\nNa double double\nYeah, anointing double double oh, hey\nNa double double (halleluja)\nYour business double double oh\nNa double double\nCome on\n\nEh eh eh eh your God is good oh\nEh eh eh my God is good oh\nSing: Eh eh eh eh eh eh your God is good oh\nEh eh eh my God is good oh\nCome on\n\nLu wey Lu wey Lu wey\nLu wey\nLu wey Jesu Lu wey\nLu wey\nLu wey Lu wey Lu wey\nLu wey\nLu wey Jesu Lu wey\nLu wey\nLu wey Lu wey Lu wey\nLu wey\nLu wey Jesu Lu wey\nLu wey\nLu wey Lu wey Lu wey\nLu wey\nLu wey Jesu\nHere we go now\nEverybody clap your hands\nYeah, come on\n\nEh\nTere muka Tere muka\nEh\nTere muka Tere muka\nEh\nNigeria Tere muka\nEh\n\nAnd you are good and your mercy is forever\nHallelujah\nHallelujah, ey\nYou are good and your mercy is forever\nHallelujah\nSay you are good and your mercy is forever\nHallelujah\nHallelujah\nYou are good and your mercy is forever\nHallelujah\nHalllelelelelelujah\n\nJehovah\nYou are the most high\nJehovah\nYou are the most high God\nJehovah, You\nYou are the most high\nJehovah\nYou are the most high God\nJehovah\nYou are the most high\nJehovah\nYou are the most high God\nJehovah\nYou are the most high\nJehovah\nYou are the most high God\nJehovah, hey\n\nJehovah eh\nHey, Jehovah ah\nJehovah ah\nJehovah eh\nJehovah eh\nJehovah ah\nJehovah ah\nJehovah eh\nJehovah eh\nJehovah ah\nJehovah ah\nJehovah eh\nJehovah eh\nJehovah ah\nJehovah ah (here we go, here we go)\nListen\n\nWho has the final say, you say\nJehovah has the final say\nCome on\nWho has the final say, come on\nJehovah has the final say\nWho has the final say\nJehovah has the final say\nWho has the final say (come on)\nJehovah has the final say\n\nJehovah turned my life around (here we go, come on)\nHe has turned my life around (He makes a way)\nHe makes a way where is no way (come on)\nJehovah has the final say (here we go, sing it up now)\n\nSay: Who has the final say, come on\nJehovah has the final say\nOh, who has the final say\nJehovah has the final say\nWho has the final say\nJehovah has the final say\nHe said: Who has the final say (yeah)\nJehovah has the final say\n\nJehovah turned my life around (turn around, turn around, come on)\nHe has turned my life around (make some way)\nHe makes a way where is no way (Jehovah)\nJehovah, Jehovah (Jehovah), Jehovah has the final say\n\nAmen amen (Amen amen)\nYes Sir\n(Amen amen)\nAmen amen\n(Amen amen)\nAmen\n(Amen amen)\nAmen amen\n(Amen amen) It is so, so let it be\n(Amen amen)\nAmen amen\n(Amen amen) Hallelujah\n(Amen amen) You say\n\nMe and my house\n(Me and my house) Will serve the Lord\n(Will serve the Lord)\nMe and my house\n(Me and my house) Will serve\n(Will serve the Lord)\nMe and my house\n(Me and my house) Will serve, will serve\n(Will serve the Lord) Hey oh oh oh\n(Me and my house) Will serve (will serve the Lord)\nHere we go\n\nHallelujah (Hallelujah)\nHallelujah (Hallelujah)\nHallelujah (Hallelujah) yeah\n(Hallelujah)\nHallelujah (Hallelujah)\nHallelujah\n(Hallelujah) ouh oh oh\n(Hallelujah, Hallelujah)\n\nYou say\nThank you Jesus (Thank you Jesus)\nJesus thank you, thank you\n(Thank you Jesus)\nI just wanna thank you, yes I\n(Thank you Jesus)\nThank you, thank you Jesus\nThank you Jesus\n(Thank you Jesus, thank you Jesus)\nOh oh oh (Thank you Jesus)\nHey, oh oh oh (Thank you Jesus)\nOnce again, oh oh oh\n(Thank you Jesus)\nOnce again, oh oh oh\n(Thank you Jesus)\n\nYou say: Hallelujah (Hallelujah)\n(Oh oh oh oh, Hallelujah)\nIn the good times, in the bad times (Hallelujah)\n(Oh oh oh oh, Hallelujah)\n(You\'ll be, Hallelujah)\n(Oh oh oh oh, Hallelujah)\n(You\'ll be, Hallelujah)\n(Oh oh oh oh, Hallelujah)\n(You\'ll be, Hallelujah)\n(Oh oh oh oh, Hallelujah)\n(You\'ll be, Hallelujah)\n(Oh oh oh oh, Hallelujah)\nHallelu- (Hallelujah), -lelujah\nHallelujah\n\n', 135, '2019-07-24 19:18:55', NULL),
(218, 'Waymaker', 'Sinach', '', '', 'https://youtu.be/n4XWfwLHeLM', 'You are here\nMoving in our midst\nI worship you\nI worship you\nYou are here\nWorking in this place\nI worship you\nI worship you\nYou are here\nMoving in our midst\nI worship you\nI worship you\nYou are here\nWorking in this place\nI worship you\nI worship you\n\nWay maker\nMiracle worker\nPromise keeper\nLight in the darkness\nMy God\nThat is who you are\nWay maker\nMiracle worker\nPromise keeper\nLight in the darkness\nMy God\nThat is who you are\n\nYou are here\nTouching every heart\nI worship you\nI worship you\nYou are here\nHealing every heart\nI worship you\nI worship you\nYou are here\nTurning lives around\nI worship you\nI worship you\nYou are here\nMending every heart\nI worship you\nI worship you\n\nWay maker\nMiracle worker\nPromise keeper\nLight in the darkness\nThat is who you are\nWay maker\nMiracle worker\nPromise keeper\nLight in the darkness\nMy God\nThat is who you are\n\nYou wipe away all tears\nYou mend the broken heart\nYou\'re the answer to it all\nJesus\nYou wipe away all tears\nYou mend the broken heart\nYou\'re the answer to it all (to it all)\nJesus\n\nWay maker\nMiracle worker\nPromise keeper\nLight in the darkness\nMy God\nThat is who you are\nWay maker\nMiracle worker\nPromise keeper\nLight in the darkness\nMy God\nThat is who you are\n\nYou are here\nTouching every life\nI worship you\nI worship you\nYou are here\nMeeting every need\nI worship you\nI worship you\n\n', 135, '2019-07-24 19:19:53', NULL),
(219, 'Overcomer', 'William McDowell', '', '', 'https://youtu.be/jlvVnEmFjo0', 'Oh-oh-oh-oh... (x6) Oh...\nCan you hear the sound of the righteous rising?\nCan you hear the sound of freedom?\nThe curse of sin is broken\nChrist has set us free\nWe have the victory, He gave us victory\n\nI\'m an overcomer (I\'m an overcomer)\nI am more than a conqueror (more than a conqueror)\n\nOh-oh-oh-oh... (x6) Oh...\nWe can that all creation\'s waiting\nTo walk in this glorious liberty\nThe curse of sin is broken\nChrist has set us free\nWe have the victory, He gave us victory\n\nI may go through persecution, tribulation\nI\'m persuaded that nothing ever will be able\nTo separate me from this love\nIn all these things, through Him that loved us\nWe are more than conquerors!\n\nI may go through persecution, tribulation\nI\'m persuaded that nothing ever will be able\nTo separate me from this love\nIn all these things, through Him that loved us\nWe are more than conquerors!\n\nI am more than a conqueror (more than a conqueror)\n(Repeat several times)\n\nI\'m alive (I\'m alive), I\'m alive (I\'m alive)\nI\'m alive (I\'m alive, I\'m alive in Christ)\n(Repeat several times)\n\nI\'m alive in Christ, and in Him I have the victory!\n\n', 135, '2019-07-24 19:21:19', NULL),
(220, 'Awesome God', 'Gerald & Tammi Haddin', '', '', 'https://youtu.be/BNVU1MiOpZI', '', 135, '2019-07-24 19:22:43', NULL),
(221, 'Awesome Wonder', 'Youthful Praise', '', '', 'https://youtu.be/uHkFEdU5DPs', 'Provider, Defender, Master of the Universe, You know me. You are an Awesome Wonder. (Repeat)\nOhhhhhh, what a wonder You are. Ohhhhhh, You are an awesome wonder. (Repeat 2x)\n\nYou know me, my weakness. You know just where I hurt the most, that’s why, I call You healer. (Repeat 2x)\nOhhhhhhh, what a healer You are. Ohhhhhhh, You are an awesome healer! (Repeat)\n\nYour kingdom, is established. You rule the heavens and the earth. In my life, You are an awesome ruler! (Repeat)\nOhhhhhhh, what a ruler You are! Ohhhhhhh, You are an awesome ruler! (Repeat)\n\nReign In Me. (Repeat 3x)\nRule in me. (Repeat 3x)\nYou Reign. (Repeat 4x) You Rule. (Repeat 4x) You’re awesome! (Repeat 8x)\n\nOhhhhhh, what a wonder You are. Ohhhhhh, You are an awesome wonder. (Repeat 2x)\n\n', 135, '2019-07-24 19:23:59', NULL),
(222, 'Free Worshipper', 'Todd Dulaney', '', '', 'https://youtu.be/q449Jy5eId4', 'Free to dance and sing,\nFree to lift my hands and worship, Lord I\'m free, Lord I\'m free.\n\nFree to dance and sing,\nFree to lift my hands and worship, Lord I\'m free, Lord I\'m free.\n\nFree to dance and sing,\nFree to lift my hands and worship, Lord I\'m free, Lord I\'m free.\n\nFree to dance and sing,\nFree to lift my hands and worship, Lord I\'m free, Lord I\'m free.\n\nI\'m a free worshipper,\nI\'m a free worshipper,\nI\'m a free worshipper\nLord I\'m free.\n\nI\'m a free worshipper,\nI\'m a free worshipper,\nI\'m a free worshipper\nLord I\'m free.\n\nFree to dance and sing,\nFree to lift my hands and worship, Lord I\'m free, Lord I\'m free.\n\nFree to dance and sing,\nFree to lift my hands and worship, Lord I\'m free, Lord I\'m free.\n\nI\'m a free worshipper,\nI\'m a free worshipper,\nI\'m a free worshipper\nLord I\'m free.\n\nI\'m a free worshipper,\nI\'m a free worshipper,\nI\'m a free worshipper\nLord I\'m free.\n\nI thank God I\'m free and I\'ll never be bound again.\nI thank God I\'m free and I\'ll never be bound again.\nI thank God I\'m free and I\'ll never be bound again.\nI thank God I\'m free and I\'ll never be bound again.\nI thank God I\'m free and I\'ll never be bound again.\nI thank God I\'m free and I\'ll never be bound again.\n\nI\'m a free worshipper,\nI\'m a free worshipper,\nI\'m a free worshipper\nLord I\'m free.\n\nI\'m a free worshipper,\nI\'m a free worshipper,\nI\'m a free worshipper\nLord I\'m free.\n\nLord I\'m free.\nLord I\'m free.\nLord I\'m free.\nLord I\'m free.\nLord I\'m free.\nLord I\'m free.\n\nOhh, Ohh, Ohh,\nOh oh oh\nOh oh oh\nLord I\'m Free\n\nOhh, Ohh, Ohh,\nOh oh oh\nOh oh oh\nLord I\'m Free\n\nOhh, Ohh, Ohh,\nOh oh oh\nOh oh oh\nLord I\'m Free\n\nWhom the Son sets free is free indeed.\nWhom the Son sets free is free indeed.\nWhom the Son sets free is free indeed.\n\n', 135, '2019-07-24 19:25:43', NULL),
(227, 'This is a move', 'Tasha Cobbs ', '', '', 'https://youtu.be/JrP63AbapVo', '', 135, '2019-07-26 16:57:17', NULL),
(215, 'Be Lifted', 'Micah Stampley', 'A', '', 'https://youtu.be/hkJa4UEbfuU', 'Jesus We Lift Your Name On High\nYour Name On High\nBe Lifted High\n\nJesus We Lift Your Name On High\nYour Name On High\nBe Lifted High\n\nJesus We Lift Your Name On High\nYour Name On High\nBe Lifted High\n\nJesus We Lift Your Name On High\nYour Name On High, Be Lifted High-\n\nEverybody clap your hands\n\nJesus We Lift Your Name On High\nYour Name On High\nBe Lifted High\n\nJesus We Lift Your Name On High\nYour Name On High\nBe Lifted High\n\nBe Lifted High, Be Lifted High, Be lifted High,\nBe Lifted High in All the Earth\n\nBe Lifted High, Be Lifted High, Be lifted High,\nBe Lifted High in All the Earth\n\n2-Jesus Your Name Be Glorified, Be Glorified, Be Lifted High\n\nJesus Your Name Be Glorified, Be Glorified, Be Lifted High\n\nClap Your Hands if You Love Jesus, Clap Your Hands if You\'re a Believer\nClap Your Hands if You Love Jesus, Clap Your Hands if You\'re a Believer\nClap Your Hands if You Love Jesus,\nClap Your Hands if You\'re a Believer\nClap Your Hands if You Love Jesus,\nClap Your Hands if You\'re a Believer\n\nChristo Tu Nombre Alabare, Alabare, TeAlabare\nChristo Tu Nombre Alabare, Alabare, TeAlabare\nTeAlabare, Alabare, Alabare\nTu Nombre Alabare\n\nClap Your Hands if You Love Jesus, Clap Your Hands if You\'re a Believer\nClap Your Hands if You Love Jesus,\nClap Your Hands if You\'re a Believer\nClap Your Hands if You Love Jesus, Clap Your Hands if You\'re a Believer\nClap Your Hands if You Love Jesus,\nClap Your Hands if You\'re a Believer\n\nVAMP-oh oh oh oh oh oh, oh oh oh oh\noh oh oh oh oh, oh oh oh oh oh\n\nVAMP 2-oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh\n\nVAMP 2-oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh\n\nVAMP 2-oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh\n\nVAMP 2-oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh oh\n\nBe Lifted High, Be Lifted High, Be Lifted High\n\nHigh in All The Earth\nBe Lifted High, High, High\nHigh in all the Earth\nBe Lifted High, Be Lifted High, Be Lifted High\n\nBe Lifted High In All The Earth\nBe Lifted High, Be Lifted High, Be Lifted High\n\n', 135, '2019-07-22 08:50:39', NULL),
(216, 'test song', 'tester', 'c', '128bmp', 'https://www.youtube.com/watch?v=BXHQ5NxU2p8', 'test song', 137, '2019-07-23 06:32:00', NULL),
(224, 'I Believe ', 'Jonathan Nelson', '', '', 'https://youtu.be/vDLByAnQ93Q', 'Jehovah, You\nI trust\nIn You\nOh Lord\nJehovah, You\nI trust\nIn You\nI believe, I believe\n\nYou are the God of miracles\nYou are the God of wonders\nYou are the God all powerful\nI believe, I believe, I believe, I believe, I believe, I believe\n\nSo long, bye bye\nSo long, bye bye\nGoodbye to my pain\nAnd my sorrow\nSo long, bye bye\n\n', 135, '2019-07-24 19:53:05', NULL),
(225, 'While I\'m Waiting', 'tester11', 'c', '128bmp', 'https://www.youtube.com/watch?v=BXHQ5NxU2p8', 'Oh-ohh, oh-ohhh\r\nNo other name but the name… of Jesus\r\n\r\n[Verse 1]\r\nThere\'s no hurt that can outlive\r\nThe grace You freely give\r\nIt\'s the raging flood\r\nThat covers us\r\n\r\n[Verse 2]\r\nFor the thoughts that come to decay\r\nYou\'ve sent love to strip them away\r\nAnd You\'ve left the truth\r\nThat we\'re free in You\r\n\r\n[Chorus]\r\nThere is no bondage\r\nEvery chain is broken\r\nThere is no bondage\r\nJesus, our hearts are open\r\nNo guilt, no shame\r\nAll my stains erased\r\nThere is no bondage\r\nEvery chain is broken\r\nYeahh-eh-ehhhh, every chain broken, oh-ohh', 137, '2019-07-23 06:32:00', NULL),
(226, 'No Bondage', 'Jubilee Worship ', '', '', 'https://youtu.be/3H_NwhsAqwM', 'Oh-ohh, oh-ohhh\nNo other name but the name… of Jesus\n\n[Verse 1]\nThere\'s no hurt that can outlive\nThe grace You freely give\nIt\'s the raging flood\nThat covers us\n\n[Verse 2]\nFor the thoughts that come to decay\nYou\'ve sent love to strip them away\nAnd You\'ve left the truth\nThat we\'re free in You\n\n[Chorus]\nThere is no bondage\nEvery chain is broken\nThere is no bondage\nJesus, our hearts are open\nNo guilt, no shame\nAll my stains erased\nThere is no bondage\nEvery chain is broken\nYeahh-eh-ehhhh, every chain broken, oh-ohh', 135, '2019-07-25 18:15:41', NULL),
(228, 'While I\'m Waiting', 'Travis Greene', '', '', 'https://youtu.be/bNVC_dLVDkQ', '', 135, '2019-07-27 08:02:29', NULL),
(229, 'aa', 'as', 's', 's', '', '', 135, '2019-07-31 11:52:42', NULL),
(230, 'asdf', 's', 'sd', 's', '', 'sdf', 140, '2019-07-31 14:31:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `song_to_event`
--

CREATE TABLE `song_to_event` (
  `id` int(11) NOT NULL,
  `song_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `song_name` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `song_artist` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `song_to_event`
--

INSERT INTO `song_to_event` (`id`, `song_id`, `event_id`, `song_name`, `song_artist`) VALUES
(19, 225, 166, 'While I\'m Waiting', 'tester11'),
(21, 216, 166, 'test song', 'tester'),
(25, 221, 168, 'African Medley', 'Tye Tribbett'),
(27, 226, 167, 'No Bondage', ''),
(28, 227, 167, 'No Bondage', ''),
(29, 220, 167, 'No Bondage', ''),
(34, 219, 168, 'Overcomer', 'William McDowell'),
(36, 218, 168, 'Waymaker', 'Sinach'),
(55, 220, 168, 'Awesome God', 'Gerald & Tammi Haddin'),
(56, 226, 168, 'No Bondage', ''),
(57, 215, 168, 'Be Lifted', 'Micah Stampley'),
(58, 218, 170, 'Waymaker', 'Sinach'),
(59, 219, 170, 'Overcomer', 'William McDowell'),
(60, 217, 170, 'African Medley', 'Tye Tribbett'),
(62, 218, 170, 'Waymaker', 'Sinach'),
(63, 221, 170, 'Awesome Wonder', 'Youthful Praise'),
(64, 215, 170, 'Be Lifted', 'Micah Stampley'),
(65, 217, 212, 'African Medley', 'Tye Tribbett'),
(66, 217, 213, 'African Medley', 'Tye Tribbett'),
(67, 218, 215, 'Waymaker', 'Sinach'),
(68, 222, 215, 'Free Worshipper', 'Todd Dulaney'),
(69, 215, 215, 'Be Lifted', 'Micah Stampley'),
(71, 222, 216, 'Free Worshipper', 'Todd Dulaney'),
(72, 219, 216, 'Overcomer', 'William McDowell'),
(73, 215, 216, 'Be Lifted', 'Micah Stampley'),
(74, 226, 216, 'No Bondage', 'Jubilee Worship '),
(75, 228, 216, 'While I\'m Waiting', 'Travis Greene'),
(76, 220, 216, 'Awesome God', 'Gerald & Tammi Haddin'),
(77, 217, 216, 'African Medley', 'Tye Tribbett'),
(80, 221, 220, 'Awesome Wonder', 'Youthful Praise');

-- --------------------------------------------------------

--
-- Table structure for table `song_to_team`
--

CREATE TABLE `song_to_team` (
  `id` int(11) NOT NULL,
  `song_id` int(11) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `id` int(11) NOT NULL,
  `name` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date` datetime NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postid` int(11) DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`id`, `name`, `created_by`, `created_date`, `city`, `state`, `postid`, `location`) VALUES
(138, 'Marty\'s Praise Team', 221, '2019-07-24 12:59:15', NULL, NULL, NULL, 'Laconia, NH'),
(137, 'peter\'s team', 218, '2019-07-22 23:17:22', NULL, NULL, NULL, 'china'),
(136, '1\'s Team', 217, '2019-07-22 10:00:23', NULL, NULL, NULL, 'china'),
(135, 'Divine Truth Christian Center', 216, '2019-07-22 07:08:12', NULL, NULL, NULL, 'Casselberry, FL'),
(139, '1', 224, '2019-07-31 05:14:30', NULL, NULL, NULL, '1'),
(140, 'my team', 223, '2019-07-31 14:23:01', NULL, NULL, NULL, '1');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(125) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(125) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'http://api.campushead.com:8080/public/uploads/assets/profile.png',
  `date_registration` datetime NOT NULL,
  `membership` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'non-member',
  `position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `join_state` int(11) NOT NULL DEFAULT '0',
  `purchased_date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '2019-08-01T00:00:00.000'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `username`, `password`, `pic`, `date_registration`, `membership`, `team_id`, `role`, `position`, `join_state`, `purchased_date`) VALUES
(222, 'alesciawinsley@gmail.com', 'Alescia', '$2a$08$5wCGZFv5AWMC.mX9DNesOed/5yP8wjpvzK9006QW.8Z75fzl/L8gO', 'http://api.campushead.com:8080/public/uploads/profile/image-4a543f7a-addc-4f4b-b64f-e10856805396.jpg', '2019-07-24 18:54:14', 'individual', 135, '', 'Dance', 2, '2019-07-30T11:24:24.000'),
(219, 'alrest@email.com', 'AL Test', '$2a$08$fbas6YpHxQoRxHY2stDO.eGFQ5rnPNbWEuaFeZAnvEL.1ov0Qyz12', NULL, '2019-07-23 05:38:49', NULL, 135, '', NULL, 2, '0000-00-00 00:00:00'),
(220, 'rxplus2018rxplus2018@gmail.com', 'fggghh', '$2a$08$rKa.yiUtyNE.bLqARhqFC.lSt4JZzeo6ZpBPHQq1zyEYoGMyY5jv6', NULL, '2019-07-24 08:45:24', NULL, NULL, NULL, NULL, 0, '0000-00-00 00:00:00'),
(221, 'marty111@marty.com', 'marty', '$2a$08$/9/G1r2cM3dPk9b6Dz.VN.unpx4kd4iR8w3DGvbWt2UcMY1MEQsua', NULL, '2019-07-24 12:57:52', NULL, 138, NULL, NULL, 0, '0000-00-00 00:00:00'),
(216, 'awinsley@divinetruthcc.org', 'AL Winsley', '$2a$08$IyoVn3C8W/IWBzNwj/GOueCHqLloOAaSsdcjAHOJZecocwdGvTvgy', 'http://api.campushead.com:8080/public/uploads/profile/image-dfe99b21-336e-46e0-8b2b-e1a095412e7b.jpg', '2019-07-22 07:07:11', 'individual', 135, NULL, 'Musician', 0, '2019-07-30T11:24:24.000'),
(223, 'peter@mail.com', 'peter', '$2a$08$56TRgAo5p/eLrZWalBmifu98xXPf8ZR2dLduXZl7kbsrKp4eRUaj.', 'http://api.campushead.com:8080/public/uploads/assets/default_profile.png', '2019-07-30 21:23:29', NULL, 140, NULL, NULL, 0, '2019-08-01T00:00:00.000'),
(224, '1@mail.com', '1', '$2a$08$xtj9amiupk8RM5q4pLfZQOMcqvXE8hk86ixKl6m.ccXXHH1eqsvz.', 'http://api.campushead.com:8080/public/uploads/assets/default_profile.png', '2019-07-31 05:11:16', 'individual', 135, 'Member', NULL, 2, '2019-07-31T18:52:06.000');

-- --------------------------------------------------------

--
-- Table structure for table `user_to_team`
--

CREATE TABLE `user_to_team` (
  `id` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `tid` int(11) NOT NULL,
  `position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `song`
--
ALTER TABLE `song`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `song_to_event`
--
ALTER TABLE `song_to_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `song_to_team`
--
ALTER TABLE `song_to_team`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_to_team`
--
ALTER TABLE `user_to_team`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=177;

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=222;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=543;

--
-- AUTO_INCREMENT for table `song`
--
ALTER TABLE `song`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=231;

--
-- AUTO_INCREMENT for table `song_to_event`
--
ALTER TABLE `song_to_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=225;

--
-- AUTO_INCREMENT for table `user_to_team`
--
ALTER TABLE `user_to_team`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
