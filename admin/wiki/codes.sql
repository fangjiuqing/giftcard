/*
 Navicat Premium Data Transfer

 Source Server         : 腾讯云111.231.106.198
 Source Server Type    : MySQL
 Source Server Version : 50643
 Source Host           : 111.231.106.198
 Source Database       : codes

 Target Server Type    : MySQL
 Target Server Version : 50643
 File Encoding         : utf-8

 Date: 11/23/2019 17:05:09 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `pre_admin`
-- ----------------------------
DROP TABLE IF EXISTS `pre_admin`;
CREATE TABLE `pre_admin` (
  `admin_id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '管理编号',
  `admin_salt` char(6) CHARACTER SET utf8 DEFAULT '',
  `admin_account` varchar(64) DEFAULT '' COMMENT '管理账号',
  `admin_passwd` varchar(32) DEFAULT '' COMMENT '管理密码',
  `admin_realname` varchar(64) DEFAULT NULL COMMENT '管理姓名',
  `admin_group` tinyint(3) unsigned DEFAULT NULL COMMENT '权限组',
  `admin_lastlogin` int(10) unsigned DEFAULT NULL COMMENT '最近登录时间',
  `admin_lastip` int(11) unsigned DEFAULT NULL COMMENT '最近登录IP',
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_account` (`admin_account`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COMMENT=' 管理员表';

-- ----------------------------
--  Records of `pre_admin`
-- ----------------------------
BEGIN;
INSERT INTO `pre_admin` VALUES ('10', 'qvDMTP', '18915991080', '8b5a4667355ec89bee69768197c9d950', '张坊', '0', '1503380289', '1927090359'), ('11', 'JjF6MF', '13382768737', '670d9788a14a5d16ea4b39a26cbb88c2', '梁群', '2', '1502071455', '1927091158'), ('12', 'hwGhRn', '15996222836', '3070cc03022b07379128eaa5db77dc7a', '凌启飞', '4', '1501737408', '1927091865'), ('13', 'uPVkpn', '13655199312', 'cf45286b28357284a4018eb86f189095', '周瑶越', '4', '1499303963', '1927091774'), ('14', 'EagCAb', '13611513682', '0a5b5495db824ba9405a8f8a6410af84', '张斗星', '2', '1502939097', '1927090952'), ('15', 'xQcwmm', '18761618689', 'd68c7574cbfdd660e96977eac293f607', '赵华', '4', '1507707060', '3027075659'), ('16', '3JS9MB', '18168638599', 'a998b4feed7bf706401f2c1eb8adbff3', '李悦', '2', '1502939288', '1927090952'), ('17', 'mJaJWp', '17625935251', '11d248a67d11bb120c715215783fd1b2', '任峥茹', '4', '1507709381', '3027075659'), ('18', 'S2B9MQ', '18913970000', 'd88c574fd23dd44fe3c5035e85e8b074', '陈亚峰', '0', '1507856948', '3026642112'), ('20', 'AUcycp', '18651858125', '59430d8fe1de9a1b5a1d569ef566f7bb', '刘婷婷', '4', '1506735435', '3027075571'), ('21', 'njt67k', '15380426789', 'ace7057f3321ff44d224c057f2786c21', '沈雷', '11', '1501465222', '1927091151'), ('22', '8UFyNU', '18502559536', '6e26ca797d3c52430eba21282a58d2a4', '周放', '11', '1502932748', '3083734711'), ('23', '3MKAKT', '15651880922', '818c33b7c581e14b2a9799b1f152f9cd', '郭涛', '11', '1502777756', '3083734588'), ('24', 'abcdef', 'admin', 'c7935cc8ee50b752345290d8cf136827', '管理员', '0', '1508047365', '3026643934');
COMMIT;

-- ----------------------------
--  Table structure for `pre_code_use`
-- ----------------------------
DROP TABLE IF EXISTS `pre_code_use`;
CREATE TABLE `pre_code_use` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(30) DEFAULT NULL,
  `pro_id` int(10) DEFAULT NULL,
  `use_nums` int(10) unsigned DEFAULT '1' COMMENT '消耗数量',
  `client_name` varchar(100) DEFAULT NULL,
  `client_mobile` varchar(20) DEFAULT NULL,
  `client_info` varchar(500) DEFAULT NULL,
  `remark` varchar(500) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`) USING BTREE,
  KEY `pid` (`pro_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `pre_code_use`
-- ----------------------------
BEGIN;
INSERT INTO `pre_code_use` VALUES ('1', 'FHHNCR9C', '1', '3', '张总', '13711221223', '送货地址：江苏省南京市建邺区南湖大厦17楼1701', '周六晚上8点左右送达', '2019-11-17 10:55:36'), ('2', '70405139', '4', '1', '', '', '', '', '2019-11-17 12:17:13'), ('3', 'IHZFLVTD', '3', '1', '张大宝', '13711221223', '', '', '2019-11-17 12:17:38');
COMMIT;

-- ----------------------------
--  Table structure for `pre_codes`
-- ----------------------------
DROP TABLE IF EXISTS `pre_codes`;
CREATE TABLE `pre_codes` (
  `code_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(30) DEFAULT NULL,
  `code_status` tinyint(1) unsigned DEFAULT '1',
  `code_level` smallint(5) unsigned DEFAULT '1' COMMENT '卡类型',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`code_id`),
  UNIQUE KEY `code` (`code`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `pre_codes`
-- ----------------------------
BEGIN;
INSERT INTO `pre_codes` VALUES ('1', '76Q87UNF', '1', '1', '2019-11-17 10:09:31'), ('2', 'GGPCS1L3', '1', '1', '2019-11-17 10:09:31'), ('3', 'FHHNCR9C', '1', '1', '2019-11-17 10:09:31'), ('4', 'TCH40IM0', '1', '1', '2019-11-17 10:09:31'), ('5', 'IB6BIWO1', '1', '1', '2019-11-17 10:09:31'), ('6', '86575992', '1', '2', '2019-11-17 10:09:49'), ('7', '79441281', '1', '2', '2019-11-17 10:09:49'), ('8', '23295208', '1', '2', '2019-11-17 10:09:49'), ('9', '10378157', '1', '2', '2019-11-17 10:09:49'), ('10', '50706280', '1', '2', '2019-11-17 10:09:49'), ('11', 'GSKFCZHL', '1', '3', '2019-11-17 10:10:09'), ('12', 'IHZFLVTD', '3', '3', '2019-11-17 10:10:09'), ('13', 'UYOTJVNB', '1', '3', '2019-11-17 10:10:09'), ('14', 'FHFVSYCL', '1', '3', '2019-11-17 10:10:09'), ('15', 'QTEAFWFZ', '1', '3', '2019-11-17 10:10:09'), ('16', '578250234704', '1', '1', '2019-11-17 11:04:17'), ('17', '304955128745', '1', '1', '2019-11-17 11:04:17'), ('18', '223685495679', '1', '1', '2019-11-17 11:04:17'), ('19', '180757012653', '1', '1', '2019-11-17 11:04:17'), ('20', '612936459118', '1', '1', '2019-11-17 11:04:17'), ('21', '290503851358', '1', '1', '2019-11-17 11:04:17'), ('22', '715230261306', '1', '1', '2019-11-17 11:04:17'), ('23', '469930851069', '1', '1', '2019-11-17 11:04:17'), ('24', '012034776236', '1', '1', '2019-11-17 11:04:17'), ('25', '918168238974', '1', '1', '2019-11-17 11:04:17'), ('26', '70405139', '2', '1', '2019-11-17 11:56:18'), ('27', '01264001', '1', '1', '2019-11-17 11:56:18'), ('28', '87172098', '1', '1', '2019-11-17 11:56:18');
COMMIT;

-- ----------------------------
--  Table structure for `pre_product`
-- ----------------------------
DROP TABLE IF EXISTS `pre_product`;
CREATE TABLE `pre_product` (
  `pro_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pro_no` varchar(20) DEFAULT NULL,
  `pro_name` varchar(200) DEFAULT NULL,
  `pro_type` smallint(4) DEFAULT NULL,
  `pro_attr` varchar(200) DEFAULT NULL,
  `pro_desc` varchar(255) DEFAULT NULL,
  `pro_store` int(10) DEFAULT NULL,
  PRIMARY KEY (`pro_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `pre_product`
-- ----------------------------
BEGIN;
INSERT INTO `pre_product` VALUES ('1', 'PRO20191117104157420', '红色金龙鱼', '4', '一斤二两，通体红色，天界极品', '采购地：泰国曼谷', '150'), ('2', 'PRO20191117104711677', '黑色金龙鱼', '2', '通体黑色，人间极品', '产地：黑龙潭', '30'), ('3', 'PRO2019111710485952', '绿色金龙鱼', '3', '三眼双鳍，浑身碧绿，长二尺一', '产地：此物只应天上有', '1999'), ('4', 'PRO2019111712646907', '杂鱼', '1', '品相差', '', '199'), ('5', 'PRO2019111713134316', '黑色金龙鱼二等品', '2', '', '', '100');
COMMIT;

-- ----------------------------
--  Table structure for `pre_store_log`
-- ----------------------------
DROP TABLE IF EXISTS `pre_store_log`;
CREATE TABLE `pre_store_log` (
  `log_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `pro_id` int(10) DEFAULT NULL,
  `ori_store` int(10) unsigned DEFAULT '0' COMMENT '原来库存',
  `opd_store` int(10) unsigned DEFAULT '0' COMMENT '操作后库存',
  `op_type` varchar(20) DEFAULT NULL,
  `op_time` datetime DEFAULT NULL COMMENT '操作时间',
  `op_remark` varchar(200) DEFAULT '' COMMENT '操作说明',
  PRIMARY KEY (`log_id`),
  KEY `pid` (`pro_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `pre_store_log`
-- ----------------------------
BEGIN;
INSERT INTO `pre_store_log` VALUES ('1', '1', '0', '100', '增加', '2019-11-17 10:47:12', '增加了100'), ('2', '2', '0', '30', '增加', '2019-11-17 10:47:57', '增加了30'), ('3', '3', '0', '2000', '增加', '2019-11-17 10:49:53', '增加了2000'), ('4', '1', '100', '97', '减少', '2019-11-17 10:55:36', '使用兑换码【FHHNCR9C】兑换，减少库存3'), ('5', '1', '97', '150', '增加', '2019-11-17 10:57:10', '增加了53'), ('6', '4', '0', '200', '增加', '2019-11-17 12:07:11', '增加了200'), ('7', '4', '200', '199', '减少', '2019-11-17 12:17:13', '使用兑换码【70405139】兑换，减少库存1'), ('8', '3', '2000', '1999', '减少', '2019-11-17 12:17:38', '使用兑换码【IHZFLVTD】兑换，减少库存1'), ('9', '5', '0', '100', '增加', '2019-11-17 13:01:51', '增加了100');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
