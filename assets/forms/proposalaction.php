<?php
// Conectar con la API local para pruebas
// Para producción, cambia API_BASE_URL a 'https://anderslanguages.com/2025'
define('API_BASE_URL', 'http://localhost:3000');
$api_url = API_BASE_URL . '/api/proposals';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['url']) && $_POST['url'] == '') {

    $data = [
        'name' => $_POST['name'],
        'email' => $_POST['email'],
        'whatsapp' => $_POST['whatsapp'],
        'program' => $_POST['program'] ?? null,
        'boletin' => isset($_POST['boletin']) && $_POST['boletin'] === 'yes'
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
        header('Location: ../../en/thankyou-prices.html');
        exit();
    } else {
        echo 'Error al procesar la solicitud. Intenta nuevamente.';
    }
} else {
    echo 'Acceso no autorizado';
}
?>