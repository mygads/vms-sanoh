<?php
require_once 'connection.php';
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>VMS PT SANOH INDONESIA</title>
    <link rel="stylesheet" href="style/style.css">
    <link rel="icon" type="image/png" href="./assets/icon_sanoh.png">
</head>
<body>
    <div class="container">
        <h1>Guestbook</h1>
        <form action="process.php" method="POST">
            <label for="tanggal">Tanggal:</label>
            <input type="date" id="tanggal" name="tanggal" required>

            <label for="nama">Nama:</label>
            <input type="text" id="nama" name="nama" required>

            <label for="no_pol">No Pol:</label>
            <input type="text" id="no_pol" name="no_pol" required>

            <label for="dari_pt">Dari:</label>
            <input type="text" id="dari_pt" name="dari_pt" required>

            <label for="keperluan">Keperluan:</label>
            <textarea id="keperluan" name="keperluan"></textarea>

            <label for="nomor_visitor">Nomor Visitor:</label>
            <input type="text" id="nomor_visitor" name="nomor_visitor">

            <label for="bertemu">Bertemu:</label>
            <input type="text" id="bertemu" name="bertemu">

            <label for="in_time">In:</label>
            <input type="time" id="in_time" name="in_time" required>

            <label for="out_time">Out:</label>
            <input type="time" id="out_time" name="out_time">

            <label for="jumlah_tamu">Jumlah Tamu:</label>
            <input type="number" id="jumlah_tamu" name="jumlah_tamu">

            <input type="submit" value="Submit">
        </form>
    </div>
</body>
</html>
