<?php
require_once 'connection.php';

$conn = getConnectionMysqli();

$used_guest_numbers = array();
$sql = "SELECT DISTINCT nomor_visitor FROM meet WHERE type='guest' AND nomor_visitor IS NOT NULL";
$result = $conn->query($sql);
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $used_guest_numbers[] = $row['nomor_visitor'];
    }
}

$used_delivery_numbers = array();
$sql = "SELECT DISTINCT nomor_visitor FROM meet WHERE type='delivery' AND nomor_visitor IS NOT NULL";
$result = $conn->query($sql);
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $used_delivery_numbers[] = $row['nomor_visitor'];
    }
}

$conn->close();
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
            <label for="type">Type:</label>
            <select id="type" name="type" required>
                <option value=""></option>
                <option value="guest">Guest</option>
                <option value="delivery">Delivery</option>
            </select>

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
            <select id="nomor_visitor" name="nomor_visitor" disabled></select>

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

    <script>
        var usedGuestNumbers = <?php echo json_encode($used_guest_numbers); ?>;
        var usedDeliveryNumbers = <?php echo json_encode($used_delivery_numbers); ?>;

        document.addEventListener('DOMContentLoaded', function() {
            var typeSelect = document.getElementById('type');
            var nomorVisitorSelect = document.getElementById('nomor_visitor');

            typeSelect.addEventListener('change', function() {
                var selectedType = this.value;
                populateNomorVisitorOptions(selectedType);
            });

            function populateNomorVisitorOptions(type) {
                // Clear existing options
                nomorVisitorSelect.innerHTML = '';

                // Add a default option
                var defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.text = '--Select Nomor Visitor--';
                nomorVisitorSelect.appendChild(defaultOption);

                var numbers = [];
                var usedNumbers = [];

                if (type === 'guest') {
                    numbers = generateNumbers(1, 12, true); // '001' to '012'
                    usedNumbers = usedGuestNumbers;
                } else if (type === 'delivery') {
                    numbers = generateNumbers(1, 5, false); // '01' to '05'
                    usedNumbers = usedDeliveryNumbers;
                }

                // Populate options
                numbers.forEach(function(number) {
                    var option = document.createElement('option');
                    option.value = number;
                    option.text = number;

                    if (usedNumbers.includes(number)) {
                        option.disabled = true;
                        option.text += ' (Used)';
                    }

                    nomorVisitorSelect.appendChild(option);
                });

                // Enable or disable the Nomor Visitor select based on type selection
                nomorVisitorSelect.disabled = (type === '');
            }

            // Function to generate numbers with leading zeros
            function generateNumbers(start, end, threeDigits) {
                var nums = [];
                for (var i = start; i <= end; i++) {
                    var numStr = i.toString();
                    if (threeDigits) {
                        numStr = numStr.padStart(3, '0');
                    } else {
                        numStr = numStr.padStart(2, '0');
                    }
                    nums.push(numStr);
                }
                return nums;
            }
        });
    </script>
</body>
</html>
