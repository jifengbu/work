<meta charset="utf-8">
<?php
define('DB_HOST','localhost:3306');
define('DB_USER','root');
define('DB_PWD','123456');//密码
define('DB_NAME','db_smart_city');

//连接数据库
$con = @new mysqli(DB_HOST, DB_USER, DB_PWD, DB_NAME);
if (mysqli_connect_errno($con)) {
    die("连接 MySQL 失败: " . mysqli_connect_error());
}

//从数据库里把表的数据提出来（获取记录集）
$query = "SELECT * FROM tb_organization";
$result = mysqli_query($con, $query) or die('SQL错误，错误信息：'.mysqli_error($con));
print_r($result->fetch_array(MYSQLI_ASSOC));

mysqli_close($con);
?>
