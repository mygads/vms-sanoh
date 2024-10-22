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
$type = $_POST['type'];

// if (empty($keperluan) && empty($nomor_visitor) && empty($bertemu) && empty($jumlah_tamu)) {
//     $type = 'delivery';
// } else {
//     $type = 'guest';
// }

$conn = getConnectionMysqli();
$stmt = $conn->prepare("INSERT INTO meet (tanggal, nama, no_pol, dari_pt, keperluan, nomor_visitor, bertemu, in_time, out_time, jumlah_tamu, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

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

$stmt->execute();

$stmt->close();
$conn->close();

header("Location: list.php");
exit();
?>
