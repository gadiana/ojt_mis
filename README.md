How to Run the Project and Open the Database (local Testing)
The project is developed based on PHP and MySQL and is run locally using XAMPP. The following are the steps for opening both the project and the database on a local machine.

First, start off by opening the XAMPP Control Panel and running the Apache and MySQL modules. They have to run to enable the server and database to function effectively.

Then, move the project directory ojt_mis_qrcode into the htdocs folder in your directory where XAMPP was installed. The usual path in most systems would be C:\\xampp\\htdocs\\ojt_mis_qrcode.

Once you have moved the project folder into htdocs, launch any web browser and navigate to http://localhost This will launch phpMyAdmin, from where you can administer the local MySQL database.

Inside phpMyAdmin, click the Import tab at the top. Then, click the Choose File button and select the ccs_ojt.sql from the database folder. Once selected, click Go to begin the import. This will create all the tables and data needed for the project.

After importing the database, go into the PHP file that manages database connection connection.php and ensure the database credentials are in sync with your local setup. For a standard XAMPP installation, the values would be as follows:

$host = 'localhost';
$username = 'root';
$password = '';
$database = 'your_database_name';

Replace 'your_database_name' with the name of the database imported from the SQL file.

Lastly, to execute the project, open a browser and access http://localhost/ojt_mis_qrcode. This will display the application's login, and from there, the project should work as intended with the database established.

In case of any problems during installation, kindly ensure that Apache and MySQL are running in XAMPP, and that the database was successfully imported in phpMyAdmin.