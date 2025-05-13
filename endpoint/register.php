<?php
require '../conn/connection.php';
require '../endpoint/config.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstname = $_POST['student_firstname'];
    $middle = $_POST['student_middle'];
    $lastname = $_POST['student_lastname'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT); // Hash the password

    // Check if the email already exists
    $checkEmail = "SELECT * FROM student WHERE student_email = '$email'";
    $result = mysqli_query($database, $checkEmail);

    if (mysqli_num_rows($result) > 0) {
        echo "<script type='text/javascript'>
        alert('This email is already registered. Please use a different email.');
        window.location.href = '../index.php';
        </script>";
        exit(); // Stop further execution
    }

    $otp = rand(100000, 999999); // Generate a 6-digit OTP
    $verification_code = md5(rand()); // Random verification code

    // Insert into the student table
    $sql = "INSERT INTO student (student_firstname, student_middle, student_lastname, student_email, student_password, verification_code, otp) 
            VALUES ('$firstname', '$middle', '$lastname', '$email', '$password', '$verification_code' , '$otp')";

    if (mysqli_query($database, $sql)) {
        // Retrieve the auto-incremented student_id
        $student_id = mysqli_insert_id($database);

        $_SESSION['otp'] = $otp;
        $_SESSION['email'] = $email;
        $_SESSION['verification_code'] = $verification_code;

        $subject = 'Your OTP Code';
        $verify_url = "http://localhost/ojt_mis_qrcode/endpoint/verify.php?student_id=$student_id";
        $body = "
            <p>Your OTP code is <b>$otp</b>. Please enter this code to verify your email address.</p>
            <p>Alternatively, click the button below to input your OTP code:</p>
            <a href='$verify_url' style='
                display: inline-block;
                background-color: #095d40;
                color: #ffffff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
            '>Verify Page</a>
        ";

        if (sendMail($email, $subject, $body)) {
            echo "<script type='text/javascript'>
            window.location.href = './verify.php?registration=success&student_id=$student_id';
            </script>";
            exit();
        } else {
            echo "<script type='text/javascript'>
            alert('Failed to send OTP. Please try again.');
            window.location.href = '../index.php';
            </script>";
        }
    } else {
        $error_message = "Error: " . $sql . "<br>" . mysqli_error($database);
        echo "<script type='text/javascript'>
        alert('$error_message');
        window.location.href = '../index.php';
        </script>";
    }
}
?>