<?php
require_once 'connection.php';

$tanggal = $_POST["tanggal"];
$nama = $_POST["nama"];
$no_pol = $_POST["no_pol"];
$dari_pt = $_POST["dari_pt"];
$keperluan = $_POST["keperluan"];
$nomor_visitor = $_POST["nomor_visitor"];
$bertemu = $_POST["bertemu"];
$in_time = $_POST["in_time"];
$out_time = $_POST["out_time"];
$jumlah_tamu = isset($_POST["jumlah_tamu"]) ? (int) $_POST["jumlah_tamu"] : null;

// Determine the type based on the input fields
if (empty($keperluan) && empty($nomor_visitor) && empty($bertemu) && empty($jumlah_tamu)) {
    $type = 'delivery';
} else {
    $type = 'guest';
}

// Prepare the SQL statement with parameterized queries to prevent SQL injection
$conn = getConnectionMysqli();
$stmt = $conn->prepare("INSERT INTO meet (tanggal, nama, no_pol, dari_pt, keperluan, nomor_visitor, bertemu, in_time, out_time, jumlah_tamu, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

// Bind the parameters
$stmt->bind_param(
    "sssssssssis",
    $tanggal,
    $nama,
    $no_pol,
    $dari_pt,
    $keperluan,
    $nomor_visitor,
    $bertemu,
    $in_time,
    $out_time,
    $jumlah_tamu,
    $type
);

// Execute the statement
$stmt->execute();

// Close the statement and connection
$stmt->close();
$conn->close();

// Redirect to the list page
header("Location: list.php");
exit();
?>
