<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>VMS PT SANOH INDONESIA</title>
    <link rel="icon" type="image/png" href="./assets/icon_sanoh.png">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visitor Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
        }

        .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            width: 250px;
            height: 100%;
            background-color: #ffffff;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        }

        .sidebar img {
            display: block;
            margin: 20px auto;
            width: 150px;
            height: auto;
        }

        .sidebar ul {
            list-style-type: none;
            padding: 0;
        }

        .sidebar ul li {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #e6e6e6;
        }

        .sidebar ul li a {
            text-decoration: none;
            color: #333;
            display: block;
        }

        .sidebar ul li a:hover {
            background-color: #ffebee;
            color: #ff6f61;
        }

        .content {
            margin-left: 250px;
            padding: 20px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background-color: #ffffff;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .header h2 {
            margin: 0;
            color: #333;
        }

        .header img {
            height: 40px;
        }

        .cards-container {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }

        .card {
            flex: 1;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            text-align: center;
            border-radius: 10px;
        }

        .card h3 {
            margin: 0;
            font-size: 2em;
            color: #333;
        }

        .chart-container {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }

        .chart {
            flex: 1;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }

        .chart canvas {
            max-width: 100%;
        }

        .dropdown {
            padding: 10px;
            border: 1px solid #ddd;
            background-color: #ff6f61;
            color: #ffffff;
            cursor: pointer;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <img src="./assets/icon_sanoh.png" alt="SANOH Logo">
        <ul>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Visitor Log</a></li>
            <li><a href="#">Invite</a></li>
            <li><a href="#">Reporting</a></li>
        </ul>
    </div>

    <div class="content">
        <div class="cards-container">
            <div class="card">
                <h3>2</h3>
                <p>Organization Occupancy</p>
            </div>
            <div class="card">
                <h3>9 AM</h3>
                <p>Visitors Peak Time</p>
            </div>
            <div class="card">
                <h3>0</h3>
                <p>Total Invites</p>
            </div>
            <div class="card">
                <h3>Tuesday</h3>
                <p>Busiest Week Day</p>
            </div>
        </div>

        <div class="chart-container">
            <div class="chart">
                <canvas id="visitorChart"></canvas>
            </div>
            <div class="chart">
                <canvas id="employeeChart"></canvas>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Visitor chart data
        var visitorChart = document.getElementById('visitorChart').getContext('2d');
        new Chart(visitorChart, {
            type: 'line',
            data: {
                labels: ['7/Oct', '8/Oct'],
                datasets: [{
                    label: 'Visitor',
                    data: [5, 0],
                    borderColor: '#a259ff',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Employee with most visits chart data
        var employeeChart = document.getElementById('employeeChart').getContext('2d');
        new Chart(employeeChart, {
            type: 'doughnut',
            data: {
                labels: ['jamal', 'fajar Sidik'],
                datasets: [{
                    data: [60, 40],
                    backgroundColor: ['#f8bbd0', '#90caf9']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    </script>
</body>
</html>