// ===============================
// THREZO COLLECTION SYSTEM (FIX TOTAL)
// ===============================

console.log("JavaScript aktif");

// Array keranjang
let cart = [];

document.addEventListener("DOMContentLoaded", function () {

    const buttons = document.querySelectorAll(".add-to-cart");
    const cartCounter = document.getElementById("cart-count");
    const cartIcon = document.querySelector(".cart");

    const galeriBtn = document.getElementById("galeriBtn");
    const galeriMenu = document.getElementById("galeriMenu");


    // ===============================
    // PILIH SIZE
    // ===============================
    document.querySelectorAll(".size-btn").forEach(btn => {
        btn.addEventListener("click", function () {

            const parent = this.closest(".product-card");

            // reset dalam 1 card
            parent.querySelectorAll(".size-btn").forEach(b => {
                b.classList.remove("active");
            });

            this.classList.add("active");
        });
    });


    // ===============================
    // TAMBAH KE KERANJANG
    // ===============================
    buttons.forEach(button => {
        button.addEventListener("click", function () {

            const productCard = this.closest(".product-card");

            const name = productCard.querySelector("h3").innerText;
            const priceText = productCard.querySelector(".price").innerText;
            const price = Number(priceText.replace(/[^\d]/g, ""));

            //  AMBIL SIZE YANG DIPILIH
            const selectedSize = productCard.querySelector(".size-btn.active");

            if (!selectedSize) {
                alert("Pilih ukuran dulu ya!");
                return;
            }

           const size = selectedSize.innerText;
            cart.push({ name, price, size });

            cartCounter.innerText = cart.length;

            alert(name + " (Size " + size + ") berhasil ditambahkan");
        });
    });


    // ===============================
    // DROPDOWN GALERI
    // ===============================
    if (galeriBtn && galeriMenu) {

        galeriBtn.addEventListener("click", function (e) {
            e.preventDefault();
            galeriMenu.classList.toggle("show");
        });

        document.addEventListener("click", function (e) {
            if (!galeriBtn.contains(e.target) && !galeriMenu.contains(e.target)) {
                galeriMenu.classList.remove("show");
            }
        });
    }

});

// 1. Variabel Global Tunggal
let keranjang = [];
let ukuranTerpilih = "";

// 2. Fungsi Pilih Ukuran (Panggil di onclick tombol size)
function pilihUkuran(btn) {
    const parent = btn.parentElement;
    const semuaTombol = parent.querySelectorAll(".size-btn");

    semuaTombol.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    
    ukuranTerpilih = btn.innerText;
}

// 3. Fungsi Tambah ke Keranjang
function tambahKeranjang(btn) {
    // Mencari card produk (sesuaikan dengan class pembungkus di HTML-mu)
    const card = btn.closest(".product-card") || btn.closest(".produk-card");
    
    // Ambil Nama (Cek h3 atau h4)
    const elemenNama = card.querySelector("h3") || card.querySelector("h4");
    const namaProduk = elemenNama.innerText;
    
    // Ambil Harga
    const elemenHarga = card.querySelector(".price") || card.querySelector(".harga");
    const hargaTeks = elemenHarga.innerText;
    const harga = parseInt(hargaTeks.replace(/[^0-9]/g, ""));

    // Ambil Ukuran dari tombol yang sedang 'active' di card tersebut
    const tombolAktif = card.querySelector(".size-btn.active");
    
    if (!tombolAktif) {
        alert("Silakan pilih ukuran (M, L, atau XL) terlebih dahulu!");
        return;
    }

    const ukuran = tombolAktif.innerText;

    // Masukkan ke array
    keranjang.push({ 
        nama: namaProduk, 
        harga: harga, 
        ukuran: ukuran 
    });

    // Update angka di icon tas
    const cartCounter = document.getElementById("cart-count");
    if(cartCounter) cartCounter.innerText = keranjang.length;

    alert(`${namaProduk} (Size ${ukuran}) berhasil ditambah!`);
}

// 4. Fungsi Buka/Tutup Modal
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
        updateTampilanKeranjang(); 
    }
}

// 5. Render Tampilan Keranjang
function updateTampilanKeranjang() {
    const container = document.getElementById("cart-items-list");
    const totalElement = document.getElementById("total-harga");
    
    if (!container || !totalElement) return;

    if (keranjang.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: #888; padding: 20px;">Keranjang kosong</p>';
        totalElement.innerText = "Rp 0";
        return;
    }

    let htmlItem = "";
    let totalHarga = 0;

    keranjang.forEach((item, index) => {
        htmlItem += `
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom: 1px solid #eee; padding-bottom:5px; color: #333;">
                <div style="text-align:left;">
                    <strong style="font-size:14px;">${item.nama}</strong><br>
                    <small>Ukuran: ${item.ukuran} | Jumlah: 1</small>
                </div>
                <div style="text-align:right;">
                    <span style="color: blue; font-weight:bold;">Rp ${item.harga.toLocaleString('id-ID')}</span><br>
                    <small style="color:red; cursor:pointer;" onclick="hapusItem(${index})">Hapus</small>
                </div>
            </div>`;
        totalHarga += item.harga;
    });

    container.innerHTML = htmlItem;
    totalElement.innerText = "Rp " + totalHarga.toLocaleString('id-ID');
}

// 6. Hapus Item
function hapusItem(index) {
    keranjang.splice(index, 1);
    const cartCounter = document.getElementById("cart-count");
    if(cartCounter) cartCounter.innerText = keranjang.length;
    updateTampilanKeranjang();
}

// 7. Checkout WA
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

    alert("Pesanan berhasil dikirim ke WhatsApp!");
}
