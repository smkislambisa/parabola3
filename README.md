# AbdUmar Lab Maya — Gerak Parabola (Tahap 3)

Laboratorium virtual Fisika SMA kelas X–XI. Proyek statis, tanpa backend, dirancang untuk GitHub Pages dan custom domain.

## Fitur
- Materi gerak parabola, simulasi interaktif Tahap 1–2, grafik kinematika, perbandingan sudut, eksperimen, LKPD, evaluasi, dan panduan.
- Virtual Lab Pro: model proyektil dengan integrasi numerik RK4 dan hambatan udara kuadratik berbasis massa, luas penampang, koefisien drag, serta kerapatan udara.
- Parameter massa, luas penampang, Cd, kerapatan udara, kecepatan awal, sudut, ketinggian, dan gravitasi.
- Tampilan 2D dan tampilan perspektif 3D (proyeksi visual edukatif, bukan simulasi dinamika benda tegar/mesin 3D penuh).
- Perhitungan energi kinetik, potensial, dan mekanik.
- Skenario basket, sepak bola, lompat jauh, dan air mancur.
- Bank eksperimen, dashboard ringkas guru/siswa lokal, ekspor CSV, dan laporan siap cetak/simpan PDF melalui browser.
- Penyimpanan lokal dengan `localStorage`.

## Menjalankan secara lokal
Buka `index.html` di browser modern. Untuk pengalaman yang lebih konsisten, jalankan server statis lokal (misalnya Live Server pada VS Code).

## Deploy GitHub Pages
1. Buat repository GitHub, misalnya `abdumar-lab-maya`.
2. Unggah seluruh isi folder proyek ke root repository.
3. Buka **Settings → Pages** dan pilih **GitHub Actions** sebagai source.
4. Workflow `.github/workflows/pages.yml` akan membangun dan menerbitkan situs saat perubahan didorong ke branch `main`.
5. Untuk custom domain, atur domain melalui **Settings → Pages → Custom domain**, kemudian atur DNS sesuai instruksi GitHub Pages.

## Catatan ilmiah
Model hambatan menggunakan gaya kuadratik `F_d = 1/2 ρ Cd A v²`, berlawanan arah kecepatan. Persamaan percepatan numeriknya menggunakan rasio gaya terhadap massa. Integrasi RK4 dengan langkah waktu 0,01 s digunakan untuk mendekati lintasan. Model menganggap gravitasi konstan, angin nol, dan tidak menghitung rotasi, spin, deformasi, turbulensi rinci, maupun efek Magnus. Parameter skenario merupakan nilai ilustratif untuk pembelajaran, bukan data kalibrasi alat ukur.

Energi mekanik `Ek + Ep` tidak harus konstan saat hambatan udara aktif karena energi mekanik terdisipasi ke lingkungan. Energi pada panel ditampilkan di titik puncak dan dibandingkan dengan energi mekanik awal.

## Privasi dan batasan tanpa backend
Data percobaan disimpan di browser/perangkat yang digunakan. Data tidak dikirim ke guru atau server, tidak sinkron antarperangkat, dan dapat hilang jika penyimpanan situs dibersihkan. Dashboard guru hanya meringkas data lokal pada perangkat yang sama; bukan sistem manajemen kelas terpusat. Ekspor CSV dan cetak PDF disediakan untuk pemindahan/arsip manual.

## Struktur
```text
abdumar-lab-maya/
├── index.html
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── physics-engine.js
│       ├── simulation.js
│       ├── app.js
│       └── lab-pro.js
├── .github/workflows/pages.yml
└── README.md
```


## Tahap 3 Pro — Catatan teknis

- 2D menggunakan Canvas API dan mesin numerik lokal.
- 3D menggunakan Three.js dari CDN jsDelivr; tidak ada backend.
- Laporan PDF menggunakan dialog cetak browser (pilih Save as PDF).
- Data eksperimen disimpan di localStorage perangkat.
- GitHub Pages tetap menjadi target deployment statis.
