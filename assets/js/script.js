document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            
            // Jika tab daftar mahasiswa aktif, load data
            if (tabId === 'daftar') {
                loadMahasiswa();
            }
        });
    });
    
    // Form Registrasi
    const formRegistrasi = document.getElementById('formRegistrasi');
    const responseMessage = document.getElementById('responseMessage');
    
    formRegistrasi.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            nim: document.getElementById('nim').value,
            nama: document.getElementById('nama').value,
            domisili: document.getElementById('domisili').value,
            jurusan: document.getElementById('jurusan').value
        };
        
        // Validasi client-side
        if (!formData.nim || !formData.nama || !formData.domisili || !formData.jurusan) {
            showResponse('error', 'Semua field harus diisi!');
            return;
        }
        
        // Kirim data ke API
        fetch('api/mahasiswa.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showResponse('success', 'Mahasiswa berhasil terdaftar!');
                formRegistrasi.reset();
            } else {
                showResponse('error', data.error || 'Gagal mendaftarkan mahasiswa');
            }
        })
        .catch(error => {
            showResponse('error', 'Terjadi kesalahan: ' + error.message);
        });
    });
    
    // Fungsi untuk menampilkan pesan response
    function showResponse(type, message) {
        responseMessage.className = `response-message ${type}`;
        responseMessage.textContent = message;
        
        // Hilangkan pesan setelah 5 detik
        setTimeout(() => {
            responseMessage.style.display = 'none';
        }, 5000);
    }
    
    // Daftar Mahasiswa
    const filterDomisili = document.getElementById('filterDomisili');
    const btnRefresh = document.getElementById('btnRefresh');
    const daftarMahasiswa = document.getElementById('daftarMahasiswa');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const totalMahasiswa = document.getElementById('totalMahasiswa');
    const totalDomisili = document.getElementById('totalDomisili');
    
    filterDomisili.addEventListener('change', loadMahasiswa);
    btnRefresh.addEventListener('click', loadMahasiswa);
    
    function loadMahasiswa() {
        const domisili = filterDomisili.value;
        let url = 'api/mahasiswa.php';
        
        if (domisili) {
            url += `?domisili=${encodeURIComponent(domisili)}`;
        }
        
        loadingIndicator.style.display = 'block';
        daftarMahasiswa.innerHTML = '';
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                loadingIndicator.style.display = 'none';
                
                if (data.error) {
                    daftarMahasiswa.innerHTML = `<p class="error-message">${data.error}</p>`;
                    return;
                }
                
                totalMahasiswa.textContent = data.count;
                totalDomisili.textContent = domisili ? `${data.count} mahasiswa` : '-';
                
                if (data.count === 0) {
                    daftarMahasiswa.innerHTML = '<p>Tidak ada data mahasiswa</p>';
                    return;
                }
                
                data.data.forEach(mahasiswa => {
                    const card = document.createElement('div');
                    card.className = 'mahasiswa-card';
                    card.innerHTML = `
                        <h3>${mahasiswa.nama}</h3>
                        <p><strong>NIM:</strong> ${mahasiswa.nim}</p>
                        <p><strong>Jurusan:</strong> ${mahasiswa.jurusan}</p>
                        <p><strong>Domisili:</strong> ${mahasiswa.domisili}</p>
                    `;
                    daftarMahasiswa.appendChild(card);
                });
            })
            .catch(error => {
                loadingIndicator.style.display = 'none';
                daftarMahasiswa.innerHTML = `<p class="error-message">Gagal memuat data: ${error.message}</p>`;
            });
    }
});