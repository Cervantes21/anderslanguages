<?php
// Conectar con la API local para pruebas
// Para producción, cambia API_BASE_URL a 'https://anderslanguages.com/2025'
define('API_BASE_URL', 'http://localhost:3000');
$api_url = API_BASE_URL . '/2025/api/contact';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit'])) {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $message = $_POST['message'] ?? '';
    $human = intval($_POST['human'] ?? 0);

    $errors = [];
    if (!$name) $errors[] = 'Falta el nombre';
    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email inválido';
    if (!$message) $errors[] = 'Falta el mensaje';
    if ($human !== 5) $errors[] = 'Verificación anti-spam incorrecta';

    if (empty($errors)) {
        $data = [
            'name' => $name,
            'email' => $email,
            'message' => $message
        ];

        $json_data = json_encode($data);

        $ch = curl_init($api_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);

        $response = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($http_code == 201) {
            header('Location: ../../en/thankyou-contact.html');
            exit();
        } else {
            echo '<div class="alert alert-danger">Error al enviar el mensaje. Intenta nuevamente.</div>';
        }
    } else {
        foreach ($errors as $err) {
            echo "<div class=\"alert alert-warning\">$err</div>";
        }
    }
} else {
    echo 'Acceso no autorizado';
}
