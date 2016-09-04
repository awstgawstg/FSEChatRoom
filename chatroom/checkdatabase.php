<?php
/**
 * Created by PhpStorm.
 * User: dingzhang
 * Date: 8/30/16
 * Time: 11:04 AM
 */
$dis = $_REQUEST["dis"];
$dis_no = $_REQUEST["dis_no"];
$user_id = $_REQUEST["user_id"];
$response_array['status'] = 'error';
$response_array['message'] = 'RFQ Sent!';
$dbconn = pg_connect("host=localhost port=5432 dbname=chatroom user=postgres password=postgres");
$result = pg_execute($dbconn, 'Select * FROM messages');


echo $result;
