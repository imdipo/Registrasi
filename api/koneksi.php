<?php
$servername = "NamaServer";
$username = "Namauser"; 
$password = "Password"; 
$dbname = "NamaDatabase"; 

// koneksi db
$conn = new mysqli($servername, $username, $password, $dbname);

// ngecek koneksi
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset
$conn->set_charset("utf8");
?>