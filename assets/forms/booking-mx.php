<?php
// Conectar con la API local para pruebas
// Para producción, cambia API_BASE_URL a 'https://anderslanguages.com/2025'
define('API_BASE_URL', 'http://localhost:3000');
$api_url = API_BASE_URL . '/api/bookings';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['url']) && $_POST['url'] == '') {

    $data = [
        'startdate' => $_POST['startdate'],
        'altdate' => $_POST['altdate'],
        'firstname' => $_POST['firstname'],
        'lastname' => $_POST['lastname'],
        'dob' => $_POST['dob'],
        'citizenship' => $_POST['citizenship'],
        'address' => $_POST['address'],
        'cell' => $_POST['cell'],
        'recell' => $_POST['recell'],
        'email' => $_POST['email'],
        'remail' => $_POST['remail'],
        'program' => $_POST['program'],
        'schedule' => $_POST['schedule'],
        'instructor' => $_POST['instructor'],
        'room' => $_POST['room'],
        'extranight' => $_POST['extranight'] === 'yes',
        'duration' => $_POST['duration'],
        'business' => $_POST['business'] === 'yes',
        'cultural' => $_POST['cultural'] === 'yes',
        'fiestas' => $_POST['fiestas'] === 'yes',
        'gastronomic' => $_POST['gastronomic'] === 'yes',
        'golf' => $_POST['golf'] === 'yes',
        'luxury' => false,
        'meetgreet' => $_POST['meetgreet'] === 'yes',
        'comment' => $_POST['comment'],
        'company' => $_POST['company'],
        'bill' => $_POST['bill'],
        'second' => $_POST['second'],
        'agree' => $_POST['agree'] === 'yes',
        'residence' => 'CUERNAVACA',
        'language' => 'Spanish'
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
        header('Location: ../../en/thankyou-bookings.html');
        exit();
    } else {
        echo 'Error al procesar la solicitud. Intenta nuevamente.';
    }
} else {
    echo 'Acceso no autorizado';
}
