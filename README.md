# Yurt Sim (Dormitory Simulation)

Yurt Sim, üniversite yurt hayatını deneyimleyebileceğiniz web tabanlı, etkileşimli bir simülasyon ve rol yapma (RPG) oyunudur. Karakterinizi özelleştirin, günlük rutinlerinizi yönetin, mini oyunlar oynayın ve diğer öğrencilerle (NPC'ler) etkileşime girerek üniversite yıllarınızı en iyi şekilde geçirmeye çalışın!

## 🌟 Özellikler

* **Kapsamlı Karakter Yönetimi:** Akademik başarı, sağlık, sosyal hayat ve enerji seviyelerinizi dengede tutmaya çalışın. Unutmayın, paranızı da idareli harcamalısınız!
* **Etkileşimli NPC Sistemi:** Yurdun çeşitli alanlarında dolaşan diğer öğrencilerle gelişmiş, çoktan seçmeli diyaloglara girin.
* **Geniş Oyun Dünyası:** Koridor, Ortak Alan, Bahçe, Kafeterya, Kütüphane ve Spor Sahası gibi farklı mekanları keşfedin.
* **Mini Oyunlar:** Garsonluk gibi mini-oyunlarla para kazanın veya eğlenceli vakit geçirin.
* **Karakter Özelleştirme:** Karakterinizin saç tipini ve görünümünü kendi zevkinize göre ayarlayın.
* **Zaman ve Dönem İlerlemesi:** Günlük görevleri tamamlayın, rastgele gelişen olaylara (Olay Modalları) tepki verin ve dönem sonlarında genel durumunuzu değerlendirin.
* **Sürükleyici Görsel Efektler:** Uyuma gibi eylemlerde ekran kararma (fade transition) efektleriyle desteklenen atmosferik oyun deneyimi.

## 🛠️ Teknolojiler

Bu proje [Create React App](https://github.com/facebook/create-react-app) kullanılarak oluşturulmuştur.

* **Frontend:** React.js
* **Oyun Motoru & Görüntüleme:** HTML5 Canvas API (`OdaCanvas.js` üzerinden)
* **Durum Yönetimi (State Management):** React Hooks (Custom Hooks: `useOyun`, `useKarakter`)
* **Stil:** CSS / Inline Styles (Modern, karanlık tema ağırlıklı tasarım)

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

1. **Bağımlılıkları Yükleyin:**
   Proje dizininde terminali açın ve aşağıdaki komutu çalıştırarak gerekli paketleri indirin:
   ```bash
   npm install
   ```

2. **Geliştirme Sunucusunu Başlatın:**
   Aşağıdaki komut ile oyunu geliştirme modunda çalıştırabilirsiniz:
   ```bash
   npm start
   ```
   Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresi otomatik olarak açılacaktır. Sayfa, kodda yaptığınız değişikliklerle anında güncellenir.

3. **Üretime (Production) Hazırlama:**
   Projeyi canlıya almak veya derlemek isterseniz:
   ```bash
   npm run build
   ```
   Bu komut, uygulamayı `build` klasörüne en iyi performans için optimize edilmiş şekilde çıkarır.

## 🎮 Nasıl Oynanır?

* **Hareket:** Klavye yön tuşları veya W/A/S/D ile karakterinizi hareket ettirin.
* **Etkileşim:** Etkileşime girilebilecek nesnelerin (yatak, çalışma masası vb.) yeya karakterlerin (NPC) yakınına giderek **'E'** tuşuna basın.
* **Arayüz:** Sol panelden mevcut saati, günü, statlarınızı (Akademik, Sağlık, Sosyal, Enerji), paranızı ve günlük görevlerinizi takip edebilirsiniz.
* **Karakter Menüsü:** Sağ üst köşedeki "Karakter" butonuna tıklayarak karakterinizin fiziki özelliklerini değiştirebilirsiniz.

## 🤝 Katkıda Bulunma

Eğer oyunu geliştirmek, yeni özellikler veya bölümler eklemek isterseniz PR (Pull Request) oluşturmaktan çekinmeyin!

---
*İyi eğlenceler ve zorlu öğrencilik hayatında başarılar!* 🎓
