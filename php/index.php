<?php

$camp = $_REQUEST['camp'];
$note = $_REQUEST['note'];
$player = $_REQUEST['player'];
$visible = $_REQUEST['visible'];

// sql

$servername = 'localhost';
$username = 'illiamy9_william';
$password = 'rains99$G';
$dbname = 'illiamy9_timers';

$conn = new mysqli($servername,$username,$password)
mysql_select_db($dbname)

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$stmt = $conn->prepare('INSERT INTO logs (camp, note, player, visible) VALUES (?,?,?,?)');
$stmt->bind_param('issi', $camp, $note, $player, $visible);

$stmt->execute();

$stmt->close();
$conn->close();

?>