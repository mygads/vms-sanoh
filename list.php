<?php
require_once 'connection.php';

$conn = getConnectionMysqli();

$filter_date = '';
$sort_order = 'ASC';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!empty($_POST['tanggal'])) {
        $filter_date = $_POST['tanggal'];
    }

    if (!empty($_POST['sort_order'])) {
        $sort_order = $_POST['sort_order'];
    }
}

$query = "SELECT * FROM meet";

if (!empty($filter_date)) {
    $query .= " WHERE tanggal = '" . mysqli_real_escape_string($conn, $filter_date) . "'";
}

$query .= " ORDER BY tanggal " . $sort_order;

$result = mysqli_query($conn, $query);

if (!$result) {
    die("Query failed: " . mysqli_error($conn));
}

$meet = mysqli_fetch_all($result, MYSQLI_ASSOC);

mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VMS PT SANOH INDONESIA</title>
    <link rel="icon" type="image/png" href="./assets/icon_sanoh.png">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <style>
        .card-deck .card {
            margin-bottom: 20px;
        }
        .custom-row {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
        }
        .custom-card {
            flex: 0 0 calc(25% - 20px); /* Make 4 cards in a row (25% width each) with space between */
            margin: 10px;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <!-- Add the form here -->
        <form method="post" action="" class="mb-4">
            <div class="form-row align-items-end">
                <div class="col-auto">
                    <label for="tanggal">Select Date</label>
                    <input type="date" class="form-control" id="tanggal" name="tanggal" value="<?php echo htmlspecialchars($filter_date); ?>">
                </div>
                <div class="col-auto">
                    <label for="sort_order">Sort By Tanggal</label>
                    <select class="form-control" id="sort_order" name="sort_order">
                        <option value="ASC" <?php if ($sort_order == 'ASC') echo 'selected'; ?>>Ascending</option>
                        <option value="DESC" <?php if ($sort_order == 'DESC') echo 'selected'; ?>>Descending</option>
                    </select>
                </div>
                <div class="col-auto">
                    <button type="submit" class="btn btn-primary">Apply</button>
                </div>
            </div>
        </form>

        <!-- Guests Section -->
        <h2>Guests</h2>
        <div class="custom-row">
            <?php
            foreach ($meet as $row) {
                if ($row['type'] == 'guest') {
            ?>
                <div class="card custom-card">
                    <div class="card-body">
                        <h5 class="card-title"><?php echo htmlspecialchars($row['nama']); ?></h5>
                        <p class="card-text">
                            <strong>Tanggal:</strong> <?php echo htmlspecialchars($row['tanggal']); ?><br>
                            <strong>No Pol:</strong> <?php echo htmlspecialchars($row['no_pol']); ?><br>
                            <strong>Dari:</strong> <?php echo htmlspecialchars($row['dari_pt']); ?><br>
                            <strong>Keperluan:</strong> <?php echo htmlspecialchars($row['keperluan']); ?><br>
                            <strong>Nomor Visitor:</strong> <?php echo htmlspecialchars($row['nomor_visitor']); ?><br>
                            <strong>Bertemu:</strong> <?php echo htmlspecialchars($row['bertemu']); ?><br>
                            <strong>In Time:</strong> <?php echo htmlspecialchars($row['in_time']); ?><br>
                            <strong>Out Time:</strong> <?php echo htmlspecialchars($row['out_time']); ?><br>
                            <strong>Jumlah Tamu:</strong> <?php echo htmlspecialchars($row['jumlah_tamu']); ?>
                        </p>
                    </div>
                    <div class="card-footer">
                        <a href="edit.php?id=<?php echo urlencode($row['id']); ?>" class="btn btn-primary">Edit</a>
                    </div>
                </div>
            <?php
                }
            }
            ?>
        </div>

        <!-- Deliveries Section -->
        <h2>Deliveries</h2>
        <div class="custom-row">
            <?php
            foreach ($meet as $row) {
                if ($row['type'] == 'delivery') {
            ?>
                <div class="card custom-card">
                    <div class="card-body">
                        <h5 class="card-title"><?php echo htmlspecialchars($row['nama']); ?></h5>
                        <p class="card-text">
                            <strong>Tanggal:</strong> <?php echo htmlspecialchars($row['tanggal']); ?><br>
                            <strong>No Pol:</strong> <?php echo htmlspecialchars($row['no_pol']); ?><br>
                            <strong>Dari:</strong> <?php echo htmlspecialchars($row['dari_pt']); ?><br>
                            <strong>In Time:</strong> <?php echo htmlspecialchars($row['in_time']); ?><br>
                            <strong>Out Time:</strong> <?php echo htmlspecialchars($row['out_time']); ?>
                        </p>
                    </div>
                    <div class="card-footer">
                        <a href="edit.php?id=<?php echo urlencode($row['id']); ?>" class="btn btn-primary">Edit</a>
                    </div>
                </div>
            <?php
                }
            }
            ?>
        </div>
    </div>

    <!-- Existing scripts -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
</body>
</html>
