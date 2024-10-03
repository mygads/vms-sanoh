<?php

function getConnectionMysqli()
{
    $server = 'localhost';
    $host = 3306;
    $username = 'root';
    $password = '';
    $dbName = 'vms';

    // Create connection
    $conn = mysqli_connect($server, $username, $password, $dbName, $host);

    // Check connection
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    return $conn;
}

?>
