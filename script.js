let currentIndex = 0;
const slides = document.querySelectorAll(".slide");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

function updateSlide() {
    const slider = document.querySelector(".slides");
    if (!slider) return;

    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// SAFETY CHECK (INI PENTING)
if (nextBtn && prevBtn && slides.length > 0) {

    nextBtn.onclick = function () {
        currentIndex++;
        if (currentIndex >= slides.length) currentIndex = 0;
        updateSlide();
    };

    prevBtn.onclick = function () {
        currentIndex--;
        if (currentIndex < 0) currentIndex = slides.length - 1;
        updateSlide();
    };
}
// 1. Variabel Global (Hanya satu variabel untuk menampung belanjaan)
let keranjang = [];
let ukuranTerpilih = ""; 

// 2. Fungsi Pilih Ukuran
// Fungsi ini memastikan ukuran yang diklik tersimpan sebelum ditambah ke keranjang
function pilihUkuran(btn) {
    const parent = btn.parentElement;
    const semuaTombol = parent.querySelectorAll(".size-btn");

    // Hapus warna aktif dari tombol lain
    semuaTombol.forEach(b => b.classList.remove("active"));
    
    // Tambah warna aktif ke tombol yang diklik
    btn.classList.add("active");
    
    // Simpan teks ukuran (M/L/XL)
    ukuranTerpilih = btn.innerText;
}

// 3. Fungsi Tambah ke Keranjang
function tambahKeranjang(btn) {
    const card = btn.closest(".produk-card");
    const namaProduk = card.querySelector("h4").innerText;
    const hargaTeks = card.querySelector(".harga").innerText;
    
    // Ambil angka saja dari harga (contoh: Rp150.000 jadi 150000)
    const harga = parseInt(hargaTeks.replace(/[^0-9]/g, ""));

    // CEK: Harus pilih ukuran dulu
    if (ukuranTerpilih === "") {
        alert("Silakan pilih ukuran (M, L, atau XL) terlebih dahulu!");
        return;
    }

    // Masukkan data ke array keranjang
    keranjang.push({ 
        nama: namaProduk, 
        harga: harga, 
        ukuran: ukuranTerpilih 
    });

    // Update angka merah di ikon tas
    document.getElementById("cart-count").innerText = keranjang.length;

    alert(`${namaProduk} (Size ${ukuranTerpilih}) berhasil ditambah!`);
    
    // Reset ukuran setelah ditambahkan agar tidak tertukar ke produk lain
    ukuranTerpilih = "";
    const semuaTombol = document.querySelectorAll(".size-btn");
    semuaTombol.forEach(b => b.classList.remove("active"));
}

// 4. Fungsi Buka & Tutup Modal (Pop-up Keranjang)
function toggleModal() {
    const modal = document.getElementById("modalKeranjang");
    const overlay = document.getElementById("modalOverlay");

    if (!modal || !overlay) return;

    if (modal.style.display === "block") {
        modal.style.display = "none";
        overlay.style.display = "none";
    } else {
        modal.style.display = "block";
        overlay.style.display = "block";
        updateTampilanKeranjang(); // Refresh daftar belanja saat dibuka
    }
}

// 5. Fungsi Update Tampilan di Dalam Modal
function updateTampilanKeranjang() {
    const container = document.getElementById("cart-items-list");
    const totalElement = document.getElementById("total-harga");
    
    if (keranjang.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: #888; padding: 20px;">Keranjang kosong</p>';
        totalElement.innerText = "Rp 0";
        return;
    }

    let htmlItem = "";
    let totalHarga = 0;

    keranjang.forEach((item, index) => {
        htmlItem += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom: 1px solid #eee; padding-bottom:5px;">
                <div>
                    <strong style="font-size:14px;">${item.nama}</strong><br>
                    <small>Ukuran: ${item.ukuran} | Jumlah: 1</small>
                </div>
                <div style="text-align:right;">
                    <span style="color: blue;">Rp ${item.harga.toLocaleString('id-ID')}</span><br>
                    <small style="color:red; cursor:pointer;" onclick="hapusItem(${index})">Hapus</small>
                </div>
            </div>`;
        totalHarga += item.harga;
    });

    container.innerHTML = htmlItem;
    totalElement.innerText = "Rp " + totalHarga.toLocaleString('id-ID');
}

// 6. Fungsi Hapus Item & Kosongkan
function hapusItem(index) {
    keranjang.splice(index, 1);
    document.getElementById("cart-count").innerText = keranjang.length;
    updateTampilanKeranjang();
}

function kosongkanKeranjang() {
    keranjang = [];
    document.getElementById("cart-count").innerText = "0";
    updateTampilanKeranjang();
}

// 7. Fungsi Checkout WhatsApp
function kirimKeWhatsApp() {
    const nama = document.getElementById("namaPelanggan").value;
    const alamat = document.getElementById("alamatPelanggan").value;

    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }
    if (!nama || !alamat) {
        alert("Mohon isi Nama dan Alamat lengkap!");
        return;
    }

    let listBarang = "";
    let total = 0;
    keranjang.forEach(item => {
        listBarang += `- ${item.nama} (Size: ${item.ukuran}) - Rp ${item.harga.toLocaleString('id-ID')}\n`;
        total += item.harga;
    });

    const pesan = `Halo Threzo Collection,\n\nSaya ingin memesan:\n${listBarang}\n*Total: Rp ${total.toLocaleString('id-ID')}*\n\n*Data Pengiriman:*\nNama: ${nama}\nAlamat: ${alamat}`;
    
    const urlWA = `https://wa.me/62816811192?text=${encodeURIComponent(pesan)}`;
    
    window.open(urlWA, '_blank');

    // 🔥 TAMBAHAN DI SINI
    keranjang = [];

    const cartCounter = document.getElementById("cart-count");
    if(cartCounter) cartCounter.innerText = "0";

    updateTampilanKeranjang();

    document.getElementById("namaPelanggan").value = "";
    document.getElementById("alamatPelanggan").value = "";

}
    // RESET KERANJANG SETELAH CHECKOUT
    keranjang = [];

    const cartCounter = document.getElementById("cart-count");
    if(cartCounter) cartCounter.innerText = "0";

    updateTampilanKeranjang();

    // Kosongkan input form
    document.getElementById("namaPelanggan").value = "";
    document.getElementById("alamatPelanggan").value = "";

    