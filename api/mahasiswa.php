<?php
header('Content-Type: application/json');
require 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetRequest();
        break;
    case 'POST':
        handlePostRequest();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

function handleGetRequest() {
    global $conn;
    
    $domisili = isset($_GET['domisili']) ? $_GET['domisili'] : null;
    
    try {
        if ($domisili) {
            $stmt = $conn->prepare("SELECT * FROM mahasiswa WHERE domisili = ?");
            $stmt->bind_param("s", $domisili);
        } else {
            $stmt = $conn->prepare("SELECT * FROM mahasiswa");
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $mahasiswa = [];
        while ($row = $result->fetch_assoc()) {
            $mahasiswa[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'count' => count($mahasiswa),
            'data' => $mahasiswa
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function handlePostRequest() {
    global $conn;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        return;
    }
    
    $required = ['nim', 'nama', 'domisili', 'jurusan'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Field $field harus diisi"]);
            return;
        }
    }
    
    try {
        // Cek apakah NIM sudah ada
        $check = $conn->prepare("SELECT id FROM mahasiswa WHERE nim = ?");
        $check->bind_param("s", $data['nim']);
        $check->execute();
        $check->store_result();
        
        if ($check->num_rows > 0) {
            http_response_code(400);
            echo json_encode(['error' => 'NIM sudah terdaftar']);
            return;
        }
        
        // Insert data baru
        $stmt = $conn->prepare("INSERT INTO mahasiswa (nim, nama, domisili, jurusan) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $data['nim'], $data['nama'], $data['domisili'], $data['jurusan']);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Mahasiswa berhasil terdaftar'
            ]);
        } else {
            throw new Exception("Gagal menyimpan data");
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}