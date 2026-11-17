<?php
require_once __DIR__ . '/../config.php';
unset($_SESSION['admin_usuario']);
unset($_SESSION['admin_nome']);
session_destroy();
header("Location: login.php");
exit;
