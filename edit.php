<?php
require_once 'connection.php';

// Get the database connection
$conn = getConnectionMysqli();

// Initialize variables
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$out_time = '';
$error = '';

// Check if the ID is valid
if ($id <= 0) {
    die('Invalid ID.');
}

// Fetch the existing record
$query = "SELECT * FROM meet WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();

// Check if the record exists
if ($result->num_rows == 0) {
    die('Record not found.');
}

$row = $result->fetch_assoc();

// If the form is submitted, update the 'out_time'
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $out_time = $_POST['out_time'] ?? '';

    // Validate the input
    if (empty($out_time)) {
        $error = 'Out Time is required.';
    } else {
        // Append ':00' to 'out_time' to match 'HH:MM:SS' format
        $out_time_db = $out_time . ':00';

        // Update the record
        $update_query = "UPDATE meet SET out_time = ? WHERE id = ?";
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->bind_param('si', $out_time_db, $id);

        if ($update_stmt->execute()) {
            // Redirect back to the main page or display a success message
            header('Location: list.php'); // Replace 'index.php' with your main page
            exit();
        } else {
            $error = 'Failed to update the record.';
        }
    }
} else {
    // Pre-fill the form with existing 'out_time'
    $out_time = $row['out_time'];

    // Convert 'out_time' from 'HH:MM:SS' to 'HH:MM' for the input field
    if (!empty($out_time)) {
        $out_time = substr($out_time, 0, 5); // Extract 'HH:MM'
    }
}

// Close the connection
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Edit Out Time</title>
    <link rel="icon" type="image/png" href="./assets/icon_sanoh.png">
    <!-- Include Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <!-- Custom Styles -->
    <style>
        form input[type="time"], form textarea {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border: 1px solid #000; /* Set border to black */
            border-radius: 5px;
            background: rgba(255,255,255,255);
            color: #000; /* Set text color to black for visibility */
        }
        form label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        /* Optional: Center the form and limit its width */
        .form-container {
            max-width: 500px;
            margin: 0 auto;
        }
        /* Set body background color for better contrast */
        body {
            background-color: #f8f9fa; /* Light gray background */
        }
    </style>
</head>
<body>
    <div class="container mt-5 form-container">
        <h2>Edit Out Time for <?php echo htmlspecialchars($row['nama']); ?></h2>
        <?php if (!empty($error)): ?>
            <div class="alert alert-danger">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        <form method="post" action="">
            <label for="out_time">Out:</label>
            <input type="time" id="out_time" name="out_time" value="<?php echo htmlspecialchars($out_time); ?>">
            <button type="submit" class="btn btn-primary">Update</button>
            <a href="list.php" class="btn btn-secondary">Cancel</a>
        </form>
    </div>
</body>
</html>
