/********************************
 * KERANJANG + WHATSAPP (FIX)
 ********************************/
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// update jumlah cart
function updateCartCount() {
    const count = document.getElementById("cart-count");
    if (count) count.innerText = cart.length;
}

// PILIH UKURAN
function pilihUkuran(btn) {
    const parent = btn.parentElement;
    const semua = parent.querySelectorAll(".size-btn");

    semua.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

// TAMBAH KE KERANJANG
function tambahKeranjang(btn) {
    const card = btn.closest(".produk-card");

    const nama = card.querySelector("h4").innerText;

    const hargaText = card.querySelector(".harga").innerText
        .replace("Rp", "")
        .replace(".", "");
    const harga = parseInt(hargaText);

    const ukuranEl = card.querySelector(".size-btn.active");

    if (!ukuranEl) {
        alert("Pilih ukuran dulu!");
        return;
    }

    const ukuran = ukuranEl.innerText;

    cart.push({ nama, harga, ukuran });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    alert("Produk ditambahkan ke keranjang 🛒");
}

// CHECKOUT KE WA
function checkoutWA() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong");
        return;
    }

    let pesan = "Halo, saya ingin memesan:%0A%0A";
    let total = 0;

    cart.forEach((item, i) => {
        pesan += `${i + 1}. ${item.nama} (Size ${item.ukuran}) - Rp${item.harga}%0A`;
        total += item.harga;
    });

    pesan += `%0ATotal: Rp${total}`;

    let noWA = "62816811192"; // TANPA +
    window.open(`https://wa.me/${noWA}?text=${pesan}`, "_blank");

    // reset keranjang
    cart = [];
    localStorage.removeItem("cart");
    updateCartCount();
}

updateCartCount();

/********************************
 * SCROLL KE ATAS
 ********************************/
window.onscroll = function () {
    const btn = document.querySelector(".scroll-top");
    if (!btn) return;

    if (document.documentElement.scrollTop > 200) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

function scrollTopPage() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/********************************
 * SLIDER
 ********************************/
document.addEventListener("DOMContentLoaded", function () {

    let slideIndex = 0;
    const slides = document.querySelector(".slides");
    const slide = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (!slides || slide.length === 0) return;

    function showSlide(index) {
        if (index >= slide.length) slideIndex = 0;
        if (index < 0) slideIndex = slide.length - 1;

        slides.style.transform = `translateX(-${slideIndex * 100}%)`;

        dots.forEach(dot => dot.classList.remove("active"));
        if (dots[slideIndex]) {
            dots[slideIndex].classList.add("active");
        }
    }

    // DOT
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            slideIndex = i;
            showSlide(slideIndex);
        });
    });

    // PANAH
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            slideIndex++;
            showSlide(slideIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            slideIndex--;
            showSlide(slideIndex);
        });
    }

    // AUTO
    setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 4000);

    showSlide(slideIndex);
    
});

function toggleDropdown(event) {
    event.preventDefault(); // supaya link tidak pindah
    const navItem = event.currentTarget.parentElement;
    navItem.classList.toggle("show");
}

// klik di luar dropdown untuk menutup
window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
        const dropdowns = document.querySelectorAll('.nav-item');
        dropdowns.forEach(dd => dd.classList.remove('show'));
    }
}



