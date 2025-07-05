<?php
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "datamahasiswa"; 

// koneksi db
$conn = new mysqli($servername, $username, $password, $dbname);

// ngecek koneksi
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset
$conn->set_charset("utf8");
?>