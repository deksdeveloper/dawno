# DAWNO - SA-MP PAWN Editor

DAWNO, SA-MP ve Open.mp geliştiricileri için tasarlanmış, modern ve performans odaklı bir PAWN kod editörüdür. Klasik Pawno editörüne modern bir alternatif olarak Next.js, Electron ve Monaco Editor teknolojileriyle geliştirilmiştir.

## Özellikler

-   **Modern UI/UX**: VS Code esintili, karanlık mod destekli ve premium arayüz.
-   **Gelişmiş Monaco Editor**: Sözdizimi vurgulama (syntax highlighting), akıllı kod tamamlama ve yüksek performanslı kaydırma.
-   **Otomatik Dosya Algılama**: Sunucu executables (`samp-server.exe`, `omp-server.exe`) ve konfigürasyon dosyalarını (`server.cfg`, `config.json`) derinlemesine (4 seviye) otomatik algılar.
-   **Sunucu Yöneticisi**: Editör içinden sunucuyu başlatma, durdurma ve canlı log takibi.
-   **Config Editörü**: Sunucu ayarlarını tablo arayüzü ile kolayca düzenleme.
-   **Çoklu Dil Desteği**: Geniş encoding listesi (Türkçe Windows-1254 dahil) ve hızlı encoding değiştirme.
-   **Discord Rich Presence**: Ne üzerinde çalıştığınızı Discord profilinizde gösterir.

## Kurulum ve Çalıştırma

### Gereksinimler
-   [Node.js](https://nodejs.org/) (v18+)
-   npm

### Adımlar
1.  Depoyu klonlayın:
    ```bash
    git clone https://github.com/kullaniciadi/dawno.git
    cd dawno
    ```
2.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
3.  Geliştirme modunda başlatın:
    ```bash
    npm run dev
    ```

## Lisans
Bu proje MIT lisansı ile lisanslanmıştır.
