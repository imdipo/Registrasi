# Sistem Registrasi Mahasiswa 🎓

![Preview](preview.png) *(Optional: Add screenshot later)*

## 🔐 **Security Notice**
> ⚠️ File `api/koneksi.php` containing database credentials has been **purged from Git history**. Always use `.env` or `koneksi.example.php` for configuration.

## 🌟 Fitur
- 📝 Form registrasi mahasiswa (AJAX)
- 📊 Tampilan data dengan filter domisili
- 🔌 API endpoint (`GET`/`POST`)
- 📱 Responsive design

## 🚀 Instalasi
1. Clone repo:
   ```bash
   git clone https://github.com/username/repo.git
```
2. Setup database: 
```
    CREATE TABLE mahasiswa (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nim VARCHAR(20) NOT NULL UNIQUE,
        nama VARCHAR(100) NOT NULL,
        domisili VARCHAR(100) NOT NULL,
        jurusan VARCHAR(100) NOT NULL,
        tanggal_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
```
3. Buat api/koneksi.php dari template:
```
    <?php
    $servername = "localhost";
    $username = "DB_USERNAME";
    $password = "DB_PASSWORD";
    $dbname = "mahasiswa_db";
    ?>
```
📂 Struktur File
```
api/
├── koneksi.example.php  
├── mahasiswa.php  
├── testAPI.php    
assets/
├── css/style.css     
├── js/script.js      
index.html            
```
🛠️ Penggunaan API
```
GET Data Mahasiswa

curl http://localhost/api/mahasiswa.php?domisili=Jakarta
// Response:
{
  "count": 5,
  "data": [
    {
      "nim": "20220001",
      "nama": "Budi Santoso",
      "domisili": "Jakarta",
      "jurusan": "Teknik Informatika"
    }
  ]
}
```