# Preset Importer - Alight Motion Style

Website editor preset berbasis HTML, CSS, dan JavaScript yang tampilannya mirip Alight Motion.  
Fungsi utama: Import preset, ganti foto dari galeri, atur efek, lalu export.

Dibuat 100% di browser. Tidak perlu install aplikasi.

## ✨ Fitur Utama

- **UI Mirip Alight Motion**  
  Tema gelap background hitam + aksen biru. Clean & modern.
- **Import Preset 2 Cara**  
 1. Import dari file `.json` 
 2. Import dari Link URL preset
- **Ganti Media dari Galeri**  
  Bisa pilih semua foto yang ada di galeri HP untuk mengganti placeholder di preset.
- **Edit Layer Lengkap**  
  Atur Posisi X/Y, Scale, Timing, Brightness, Contrast, Saturate, dan Transisi.
- **Efek Tambahan**  
  Fade, Zoom, Slide + Color Grading dasar agar hasil lebih bagus dari preset asli.
- **Alur Kerja 3 Tahap**  
  `Gunakan Preset` > `Ekspor` > `Simpan ke Galeri`
- **Setting Tinggi**  
  Simulasi Resolusi: 2990p  
  Simulasi FPS: 1020fps
- **No Bug**  
  Kode sudah dipisah rapi: `index.html`, `style.css`, `script.js`

## 📁 Struktur File

## 🚀 Cara Pakai

1.  Download 3 file di atas ke dalam 1 folder.
2.  Buka `index.html` di browser Chrome di HP atau PC.
3.  Klik `Import File` untuk load preset `.json` atau `Import Dari Link` untuk load dari URL.
4.  Klik layer > `Ganti` untuk mengganti foto dari galeri.
5.  Atur posisi, scale, dan efek di panel kanan.
6.  Klik `Gunakan Preset` > `Ekspor` > `Simpan ke Galeri`.

## 📄 Format File Preset .json

Contoh struktur preset yang bisa di import:

```json
{
  "title": "Cinematic Glow",
  "duration": 5.0,
  "layers": [
    {
      "id": "l1",
      "name": "Background",
      "imgSrc": "https://link-gambar.com/bg.jpg",
      "posX": 0,
      "posY": 0,
      "scale": 1.0,
      "startTime": 0,
      "endTime": 5.0,
      "brightness": 100,
      "contrast": 100,
      "saturate": 100,
      "transition": "fade"
    }
  ]
}
#### Penjelasan singkat tiap bagian:
- **Fitur Utama**: Biar orang langsung paham keunggulannya
- **Cara Pakai**: Step by step biar gak bingung
- **Format JSON**: Biar kamu dan orang lain bisa bikin preset sendiri
- **Catatan Penting**: Biar gak ada yang nanya "kok 1020fps gak kerasa"

Mau aku bikinin juga contoh file `preset-contoh.json` biar bisa langsung dites?
