import { useEffect, useRef, useState } from 'react';
import { CHARACTER_CONFIG } from '../config/characterConfig';

const TILE = 32;

// ============================================================
// SPRITE TANIMI
// ============================================================
const SPRITES = {
    'buzdolabıKapalı': { file: 'kitchen_LRK.png', sx: 355, sy: 22, sw: 26, sh: 60 },
    'buzdolabıAcık': { file: 'kitchen_LRK.png', sx: 352, sy: 102, sw: 34, sh: 63 },
    'ocak': { file: 'kitchen_LRK.png', sx: 191, sy: 79, sw: 34, sh: 44 },
    'tezgah': { file: 'kitchen_LRK.png', sx: 11, sy: 75, sw: 166, sh: 45 },
    'yatak': { file: 'beds_BR.png', sx: 11, sy: 23, sw: 40, sh: 60 },
    'yatak2': { file: 'beds_BR.png', sx: 126, sy: 23, sw: 36, sh: 62 },
    'kitaplık1': { file: 'cabinets_LRK.png', sx: 10, sy: 13, sw: 57, sh: 56 },
    'kitaplık2': { file: 'cabinets_LRK.png', sx: 12, sy: 271, sw: 53, sh: 52 },
    'bank': { file: 'cabinets_LRK.png', sx: 685, sy: 30, sw: 54, sh: 22 },
    'kitapDolabı': { file: 'cabinets_LRK.png', sx: 206, sy: 18, sw: 53, sh: 49 },
    'halıYuvarlak': { file: 'decorations_BR.png', sx: 13, sy: 126, sw: 73, sh: 52 },
    'halıKare': { file: 'decorations_BR.png', sx: 90, sy: 126, sw: 76, sh: 53 },
    'tablo1': { file: 'decorations_BR.png', sx: 131, sy: 17, sw: 42, sh: 28 },
    'lamba1': { file: 'decorations_LRK.png', sx: 10, sy: 14, sw: 30, sh: 56 },
    'lamba2': { file: 'decorations_LRK.png', sx: 46, sy: 14, sw: 19, sh: 51 },
    'lamba3': { file: 'decorations_LRK.png', sx: 76, sy: 12, sw: 25, sh: 59 },
    'kucukLamba1': { file: 'decorations_LRK.png', sx: 118, sy: 20, sw: 21, sh: 33 },
    'tablo2': { file: 'decorations_LRK.png', sx: 109, sy: 61, sw: 39, sh: 24 },
    'ayna': { file: 'decorations_LRK.png', sx: 156, sy: 60, sw: 23, sh: 53 },
    'duvarSaati': { file: 'decorations_LRK.png', sx: 14, sy: 128, sw: 18, sh: 19 },
    'kucukAgac1': { file: 'decorations_LRK.png', sx: 14, sy: 79, sw: 19, sh: 37 },
    'kucukAgac2': { file: 'decorations_LRK.png', sx: 47, sy: 76, sw: 16, sh: 39 },
    'kucukAgac3': { file: 'decorations_LRK.png', sx: 79, sy: 78, sw: 18, sh: 34 },
    'kapıKapalı': { file: 'doorswindowsstairs_LRK.png', sx: 111, sy: 14, sw: 33, sh: 53 },
    'kapıAcık': { file: 'doorswindowsstairs_LRK.png', sx: 159, sy: 12, sw: 35, sh: 60 },
    'pencere1': { file: 'doorswindowsstairs_LRK.png', sx: 206, sy: 14, sw: 53, sh: 35 },
    'buyukKoltuk': { file: 'livingroom_LRK.png', sx: 9, sy: 28, sw: 61, sh: 45 },
    'masa': { file: 'livingroom_LRK.png', sx: 12, sy: 158, sw: 54, sh: 37 },
    'kucukKoltuk': { file: 'livingroom_LRK.png', sx: 235, sy: 29, sw: 39, sh: 40 },
    'sandalye': { file: 'livingroom_LRK.png', sx: 123, sy: 142, sw: 26, sh: 40 },
    'gardropKapalı': { file: 'wardrobes_BR.png', sx: 13, sy: 29, sw: 55, sh: 70 },
    'gardropAcık': { file: 'wardrobes_BR.png', sx: 76, sy: 29, sw: 72, sh: 79 },
    'cekmece': { file: 'wardrobes_BR.png', sx: 204, sy: 21, sw: 56, sh: 44 },
    // ── teknolojik.png ──────────────────────────────────────────────────────
    // TV Sehpalar (Satır 1)
    'tvSehpa1':              { file: 'teknolojik.png', sx: 61,   sy: 57,   sw: 333, sh: 315 }, // Koyu LCD TV + koyu ahşap sehpa (DVD dahil)
    'tvSehpa2':              { file: 'teknolojik.png', sx: 428,  sy: 91,   sw: 315, sh: 281 }, // Koyu LCD TV + ahşap sehpa
    'tvSehpaOyun':           { file: 'teknolojik.png', sx: 778,  sy: 91,   sw: 309, sh: 281 }, // Oyun ekranlı renkli TV + açık sehpa
    'crtTvSehpa':            { file: 'teknolojik.png', sx: 1128, sy: 109,  sw: 229, sh: 263 }, // Retro CRT TV + dolaplı ahşap sehpa
    'crtTvEski':             { file: 'teknolojik.png', sx: 1395, sy: 117,  sw: 221, sh: 255 }, // Eski parazitli CRT TV
    'tvArabali':             { file: 'teknolojik.png', sx: 1672, sy: 91,   sw: 241, sh: 281 }, // Düz monitör + tekerlekli metal sehpa
    'tvKucuk':               { file: 'teknolojik.png', sx: 1961, sy: 119,  sw: 217, sh: 253 }, // Küçük koyu TV + basit sehpa
    // TV Sehpalar (Satır 2) + Medya + Kumandalar
    'tvSehpaAcik':           { file: 'teknolojik.png', sx: 61,   sy: 427,  sw: 333, sh: 311 }, // Büyük mavi ekran TV + açık ahşap sehpa
    'tvSehpaGri':            { file: 'teknolojik.png', sx: 428,  sy: 441,  sw: 315, sh: 297 }, // Düz TV + gri sehpa
    'tvSehpaBeyaz':          { file: 'teknolojik.png', sx: 778,  sy: 441,  sw: 309, sh: 297 }, // Geniş düz TV + beyaz sehpa
    'tvSehpaSiyah':          { file: 'teknolojik.png', sx: 1128, sy: 447,  sw: 231, sh: 291 }, // Düz TV + siyah ince sehpa
    'tvSehpaKoyu':           { file: 'teknolojik.png', sx: 1394, sy: 451,  sw: 223, sh: 287 }, // Koyu TV + koyu sehpa
    'medyaKonsol1':          { file: 'teknolojik.png', sx: 1674, sy: 413,  sw: 237, sh: 153 }, // Koyu medya rafı / set-top box
    'medyaKonsol2':          { file: 'teknolojik.png', sx: 1674, sy: 580,  sw: 237, sh: 153 }, // Gri medya rafı / set-top box
    'kumanda1':              { file: 'teknolojik.png', sx: 1971, sy: 463,  sw: 43,  sh: 119 }, // TV kumandası (siyah)
    'kumanda2':              { file: 'teknolojik.png', sx: 2030, sy: 463,  sw: 47,  sh: 119 }, // TV kumandası (koyu gri)
    'kumanda3':              { file: 'teknolojik.png', sx: 2092, sy: 463,  sw: 41,  sh: 119 }, // TV kumandası (ince)
    'kumanda4':              { file: 'teknolojik.png', sx: 2149, sy: 477,  sw: 37,  sh: 83  }, // TV kumandası (mini)
    // Masaüstü Bilgisayarlar (Satır 3)
    'masaustuBilgisayar1':   { file: 'teknolojik.png', sx: 65,   sy: 788,  sw: 431, sh: 357 }, // Gri kule PC + monitör + kahve masa
    'masaustuBilgisayar2':   { file: 'teknolojik.png', sx: 539,  sy: 796,  sw: 433, sh: 349 }, // Koyu kule PC + monitör + çevre birimleri
    'masaustuBilgisayar3':   { file: 'teknolojik.png', sx: 1026, sy: 806,  sw: 469, sh: 339 }, // Kule + mavi monitör + tam kurulum
    'masaustuBilgisayar4':   { file: 'teknolojik.png', sx: 1553, sy: 842,  sw: 301, sh: 303 }, // İnce PC + monitör
    'bilgisayarMasasi':      { file: 'teknolojik.png', sx: 1905, sy: 916,  sw: 301, sh: 229 }, // Boş bilgisayar masası
    // Dizüstü + Dolap + Ofis Koltuğu (Satır 4)
    'dizustuBilgisayar1':    { file: 'teknolojik.png', sx: 71,   sy: 1202, sw: 335, sh: 253 }, // 2 laptop + açık ahşap masa
    'dizustuBilgisayar2':    { file: 'teknolojik.png', sx: 444,  sy: 1202, sw: 301, sh: 253 }, // Laptop + koyu masa
    'hepsibirArada':         { file: 'teknolojik.png', sx: 788,  sy: 1186, sw: 277, sh: 269 }, // All-in-one / iMac tarzı bilgisayar
    'dosyaDolabiKoyu':       { file: 'teknolojik.png', sx: 1118, sy: 1226, sw: 127, sh: 229 }, // 2 çekmeceli koyu dosya dolabı
    'dosyaDolabiGri':        { file: 'teknolojik.png', sx: 1288, sy: 1226, sw: 129, sh: 229 }, // 2 çekmeceli gri dosya dolabı
    'ofisKoltugu1':          { file: 'teknolojik.png', sx: 1530, sy: 1232, sw: 131, sh: 223 }, // Ofis koltuğu siyah 1
    'ofisKoltugu2':          { file: 'teknolojik.png', sx: 1692, sy: 1232, sw: 139, sh: 223 }, // Ofis koltuğu siyah 2
    'ofisKoltugu3':          { file: 'teknolojik.png', sx: 1868, sy: 1232, sw: 137, sh: 223 }, // Ofis koltuğu kahverengi
    'ofisKoltugu4':          { file: 'teknolojik.png', sx: 2046, sy: 1232, sw: 139, sh: 223 }, // Ofis koltuğu bej
    // Konsollar (Satır 5 üst)
    'ps1Konsol':             { file: 'teknolojik.png', sx: 65,   sy: 1538, sw: 145, sh: 109 }, // PlayStation tarzı koyu konsol
    'snesKonsol':            { file: 'teknolojik.png', sx: 256,  sy: 1518, sw: 145, sh: 129 }, // SNES tarzı bej konsol
    'kasetKonsol':           { file: 'teknolojik.png', sx: 455,  sy: 1524, sw: 139, sh: 127 }, // Kaset/kartuş konsol
    // Hoparlörler (Satır 5 üst)
    'kucukHoparlor':         { file: 'teknolojik.png', sx: 659,  sy: 1524, sw: 75,  sh: 115 }, // Küçük siyah hoparlör
    'hoparlor1':             { file: 'teknolojik.png', sx: 797,  sy: 1512, sw: 79,  sh: 127 }, // Kahverengi orta hoparlör
    // Masa Lambaları (Satır 5 alt — r5c1-c3)
    'masaLambasiKoyu':       { file: 'teknolojik.png', sx: 71,   sy: 1672, sw: 125, sh: 157 }, // Masa lambası koyu (eklemli kol)
    'masaLambasiBeyaz':      { file: 'teknolojik.png', sx: 254,  sy: 1670, sw: 125, sh: 159 }, // Masa lambası beyaz/gümüş
    'masaLambasiBej':        { file: 'teknolojik.png', sx: 435,  sy: 1678, sw: 135, sh: 151 }, // Masa lambası bej/ahşap
    // Büyük Hoparlörler (Satır 5 alt — r5c4-c6)
    'ortaHoparlor':          { file: 'teknolojik.png', sx: 651,  sy: 1678, sw: 89,  sh: 151 }, // Orta boy koyu hoparlör
    'hoparlor2':             { file: 'teknolojik.png', sx: 787,  sy: 1657, sw: 103, sh: 173 }, // Koyu orta hoparlör
    'hoparlor3':             { file: 'teknolojik.png', sx: 946,  sy: 1511, sw: 107, sh: 319 }, // Uzun 3 wooferli kule hoparlör
    // Yazıcı + Faks + Lambalar + Küre (r5c7)
    'yazici':                { file: 'teknolojik.png', sx: 1182, sy: 1507, sw: 154, sh: 151 }, // Lazer/mürekkep yazıcı
    'faks':                  { file: 'teknolojik.png', sx: 1374, sy: 1507, sw: 156, sh: 155 }, // Faks makinesi (ahizeli)
    'masaLambasi1':          { file: 'teknolojik.png', sx: 1129, sy: 1679, sw: 102, sh: 151 }, // Masa lambası gri (klasik)
    'masaLambasi2':          { file: 'teknolojik.png', sx: 1275, sy: 1688, sw: 94,  sh: 142 }, // Masa lambası kahve/bej
    'masaKure':              { file: 'teknolojik.png', sx: 1374, sy: 1717, sw: 128, sh: 113 }, // Dünya küresi (masa)
    // Stereo + Saat + Düzenleyici (r5c8)
    'stereo1':               { file: 'teknolojik.png', sx: 1583, sy: 1526, sw: 148, sh: 127 }, // Stereo/kaset çalar koyu
    'stereo2':               { file: 'teknolojik.png', sx: 1772, sy: 1501, sw: 139, sh: 153 }, // HiFi/stereo bej/kahve
    'masaSaati':             { file: 'teknolojik.png', sx: 1557, sy: 1731, sw: 76,  sh: 89  }, // Yuvarlak masa saati
    'masaDuzenleyici':       { file: 'teknolojik.png', sx: 1685, sy: 1703, sw: 227, sh: 127 }, // Masa düzenleyici (kağıt + kalemlik)
    // Projektör + Kağıt Destesi (r5c9)
    'projektor':             { file: 'teknolojik.png', sx: 2027, sy: 1501, sw: 140, sh: 148 }, // Tavan projektörü
    'kagitDeste':            { file: 'teknolojik.png', sx: 1959, sy: 1684, sw: 229, sh: 145 }, // Kağıt + dosya destesi
    // ── kantin_esyalar.png ──────────────────────────────────────────────────
    'otomat_icecek':        { file: 'kantin_esyalar.png', sx: 101,  sy: 84,   sw: 210, sh: 318 }, // İçecek otomatı (ön görünüm)
    'otomat_yiyecek':       { file: 'kantin_esyalar.png', sx: 324,  sy: 84,   sw: 186, sh: 318 }, // Yiyecek otomatı (ön görünüm)
    'yemek_tezgahi_sicak':  { file: 'kantin_esyalar.png', sx: 552,  sy: 84,   sw: 410, sh: 318 }, // Sıcak yemek tezgahı
    'tatli_reyonu_camli':   { file: 'kantin_esyalar.png', sx: 1007, sy: 84,   sw: 261, sh: 318 }, // Sandviç / pasta reyonu
    'kahve_makinesi':       { file: 'kantin_esyalar.png', sx: 1324, sy: 84,   sw: 342, sh: 318 }, // Kahve makineleri + tezgah
    'kantin_masasi':        { file: 'kantin_esyalar.png', sx: 1720, sy: 84,   sw: 478, sh: 318 }, // Kantin masası + tabureler
    'tepsi_istasyonu':      { file: 'kantin_esyalar.png', sx: 69,   sy: 1510, sw: 167, sh: 320 }, // Tepsi arabası (arka görünüm)
    'menu_panosu':          { file: 'kantin_esyalar.png', sx: 449,  sy: 1510, sw: 148, sh: 320 }, // Menü panosu (şövale)
    'mikrodalga':           { file: 'kantin_esyalar.png', sx: 650,  sy: 1510, sw: 199, sh: 320 }, // Mikrodalga + sehpa
    'su_sebili':            { file: 'kantin_esyalar.png', sx: 873,  sy: 1510, sw: 190, sh: 320 }, // İçecek dolabı (cam kapılı)

    // ── spor_salonu.png ─────────────────────────────────────────────────────
    'dumbell_raki':         { file: 'spor_salonu.png', sx: 357,  sy: 836,  sw: 343, sh: 332 }, // Büyük dumbbell rafı (izometrik)
    'squat_rack':           { file: 'spor_salonu.png', sx: 751,  sy: 836,  sw: 287, sh: 332 }, // Power cage (izometrik)
    'agirlik_sehpasi':      { file: 'spor_salonu.png', sx: 996,  sy: 84,   sw: 295, sh: 318 }, // Bench press + halter rack (ön)
    'barfiks_istasyonu':    { file: 'spor_salonu.png', sx: 2006, sy: 84,   sw: 195, sh: 318 }, // Barfiks / dip istasyonu (ön)
    'kosu_bandi':           { file: 'spor_salonu.png', sx: 1294, sy: 470,  sw: 119, sh: 293 }, // Koşu bandı (ön)
    'kondisyon_bisikleti':  { file: 'spor_salonu.png', sx: 1585, sy: 470,  sw: 97,  sh: 293 }, // Kondisyon bisikleti (ön)
    'plates_set':           { file: 'spor_salonu.png', sx: 1846, sy: 836,  sw: 366, sh: 332 }, // Fitnes topları + eğik bench (izometrik)
    'sporcu_dolabi':        { file: 'spor_salonu.png', sx: 1148, sy: 836,  sw: 252, sh: 332 }, // Sporcu dolabı (izometrik)
    'mat_rulo':             { file: 'spor_salonu.png', sx: 113,  sy: 1226, sw: 246, sh: 224 }, // Yoga matı açık
    'havlu_askisi':         { file: 'spor_salonu.png', sx: 463,  sy: 1226, sw: 220, sh: 224 }, // Havlu askısı
    'vucut_tartisi':        { file: 'spor_salonu.png', sx: 1236, sy: 1664, sw: 133, sh: 165 }, // Vücut tartısı (baskül)
};

const ZEMIN_SPRITES = {
    // Satır 1
    'tahta_acik': { file: 'floorswalls_LRK.png', sx: 25, sy: 17, sw: 16, sh: 16 },
    'fayans_mavi': { file: 'floorswalls_LRK.png', sx: 79, sy: 17, sw: 16, sh: 16 },
    'tahta_koyu': { file: 'floorswalls_LRK.png', sx: 133, sy: 17, sw: 16, sh: 16 },
    // Satır 2
    'fayans_gri': { file: 'floorswalls_LRK.png', sx: 25, sy: 53, sw: 16, sh: 16 },
    'tugla_turuncu': { file: 'floorswalls_LRK.png', sx: 79, sy: 53, sw: 16, sh: 16 },
    'tugla_beyaz': { file: 'floorswalls_LRK.png', sx: 133, sy: 53, sw: 16, sh: 16 },
    // Satır 3
    'tugla_acik': { file: 'floorswalls_LRK.png', sx: 25, sy: 89, sw: 16, sh: 16 },
    'kahverengi_karo': { file: 'floorswalls_LRK.png', sx: 79, sy: 89, sw: 16, sh: 16 },
    'tahta_karanlik': { file: 'floorswalls_LRK.png', sx: 133, sy: 89, sw: 16, sh: 16 },
    // Satır 4 (İkinci blok bölümü)
    'karo_seftali': { file: 'floorswalls_LRK.png', sx: 25, sy: 137, sw: 16, sh: 16 },
    'karo_yesil': { file: 'floorswalls_LRK.png', sx: 79, sy: 137, sw: 16, sh: 16 },
    'karo_beyaz': { file: 'floorswalls_LRK.png', sx: 133, sy: 137, sw: 16, sh: 16 },
    // Satır 5
    'karo_bej': { file: 'floorswalls_LRK.png', sx: 25, sy: 173, sw: 16, sh: 16 },
    'tas_gri': { file: 'floorswalls_LRK.png', sx: 79, sy: 173, sw: 16, sh: 16 },
    'arduvaz_koyu': { file: 'floorswalls_LRK.png', sx: 133, sy: 173, sw: 16, sh: 16 },
    // Satır 6
    'karo_pembe': { file: 'floorswalls_LRK.png', sx: 25, sy: 207, sw: 16, sh: 16 },
    'beton': { file: 'floorswalls_LRK.png', sx: 79, sy: 207, sw: 16, sh: 16 },
    'karo_acik_gri': { file: 'floorswalls_LRK.png', sx: 133, sy: 207, sw: 16, sh: 16 },
};

// ============================================================
// ODA TANIMLARI
// ============================================================
const ODALAR = {
    yurtOdasi: {
        isim: 'Yurt Odasi',
        w: 24, h: 14,
        zeminRenk: '#8B7355',
        duvarRenk: '#5a4a3a',
        zeminSprite: 'tahta_acik',
        duvarSprite: 'tugla_acik',
        nesneler: [
            { x: 1, y: 1.5, w: 3, h: 2, sprite: 'yatak', isim: 'Yatak', aktiviteId: 'uyu' },
            { x: 5, y: 1.5, w: 3, h: 2, sprite: 'dizustuBilgisayar2', isim: 'Bilgisayar', aktiviteId: 'ders' },
            { x: 10, y: 1, w: 2, h: 2, sprite: 'kitaplık1', isim: 'Kitaplik', aktiviteId: 'ders' },
            { x: 13, y: 0, w: 2, h: 2, sprite: 'pencere1', isim: 'Pencere', aktiviteId: null },
            { x: 1, y: 9, w: 2, h: 2, sprite: 'halıKare', isim: 'Hali', aktiviteId: null },
            { x: 3, y: 1.5, w: 2, h: 2, sprite: 'kucukLamba1', isim: 'Telefon', aktiviteId: 'sosyal' },
            { x: 18, y: 0, w: 2, h: 3, sprite: 'gardropKapalı', isim: 'Gardrop', aktiviteId: null },
            { x: 8, y: 1.5, w: 1, h: 2, sprite: 'masaLambasiKoyu', isim: 'Masa Lambasi', aktiviteId: null },
        ],
        kapılar: [
            { x: 11, y: 12, w: 2, h: 2, hedef: 'koridor', isim: 'Koridor ↓', sprite: 'kapıKapalı' },
        ]
    },
    koridor: {
        isim: 'Koridor',
        w: 24, h: 10,
        zeminRenk: '#707070',
        duvarRenk: '#555',
        zeminSprite: 'tas_gri',
        duvarSprite: 'beton',
        nesneler: [],
        kapılar: [
            { x: 11, y: 0, w: 2, h: 2, hedef: 'yurtOdasi', isim: 'Yurt Odasi ↑', sprite: 'kapıKapalı' },
            { x: 0, y: 4, w: 2, h: 2, hedef: 'kutuphane', isim: 'Kutuphane ←', sprite: 'kapıKapalı' },
            { x: 22, y: 4, w: 2, h: 2, hedef: 'ortakAlan', isim: 'Ortak Alan →', sprite: 'kapıKapalı' },
            { x: 11, y: 8, w: 2, h: 2, hedef: 'bahce', isim: 'Bahce ↓', sprite: 'kapıKapalı' },
        ]
    },
    kutuphane: {
        isim: 'Kutuphane',
        w: 22, h: 12,
        zeminRenk: '#5c3d1a',
        duvarRenk: '#3a2510',
        zeminSprite: 'tahta_karanlik',
        duvarSprite: 'kahverengi_karo',
        nesneler: [
            { x: 1, y: 2, w: 2, h: 4, sprite: 'kitaplık1', isim: 'Kitaplik1', aktiviteId: 'dersDerin' },
            { x: 4, y: 2, w: 2, h: 4, sprite: 'kitaplık2', isim: 'Kitaplik2', aktiviteId: 'dersDerin' },
            { x: 8, y: 3, w: 4, h: 3, sprite: 'masaustuBilgisayar4', isim: 'Okuma Masasi', aktiviteId: 'arastir' },
            { x: 13, y: 2, w: 2, h: 3, sprite: 'dosyaDolabiKoyu', isim: 'Dosya Dolabi', aktiviteId: null },
            { x: 17, y: 2, w: 2, h: 4, sprite: 'kitapDolabı', isim: 'Kitap Dolabi', aktiviteId: 'dersDerin' },
            { x: 16, y: 2, w: 1, h: 2, sprite: 'masaLambasiBej', isim: 'Lamba', aktiviteId: null },
            { x: 7, y: 8, w: 3, h: 2, sprite: 'kagitDeste', isim: 'Kagitlar', aktiviteId: null },
        ],
        kapılar: [
            { x: 21, y: 5, w: 2, h: 2, hedef: 'koridor', isim: 'Koridor →', sprite: 'kapıKapalı' },
        ]
    },
    ortakAlan: {
        isim: 'Ortak Alan',
        w: 22, h: 12,
        zeminRenk: '#8B6914',
        duvarRenk: '#5a4010',
        zeminSprite: 'tugla_turuncu',
        duvarSprite: 'tugla_beyaz',
        nesneler: [
            { x: 2, y: 2, w: 4, h: 3, sprite: 'buyukKoltuk', isim: 'Kanepe', aktiviteId: 'dinlen' },
            { x: 7, y: 1, w: 4, h: 3, sprite: 'tvSehpa1', isim: 'Televizyon', aktiviteId: 'tv' },
            { x: 11, y: 2, w: 1, h: 2, sprite: 'hoparlor2', isim: 'Hoparlor', aktiviteId: null },
            { x: 6, y: 2, w: 1, h: 2, sprite: 'hoparlor1', isim: 'Hoparlor', aktiviteId: null },
            { x: 13, y: 2, w: 2, h: 2, sprite: 'ps1Konsol', isim: 'Oyun Konsolu', aktiviteId: 'tv' },
            { x: 2, y: 7, w: 3, h: 3, sprite: 'sandalye', isim: 'Masa1', aktiviteId: 'sosyal' },
            { x: 10, y: 7, w: 3, h: 3, sprite: 'sandalye', isim: 'Masa2', aktiviteId: 'sosyal' },
            { x: 16, y: 2, w: 2, h: 3, sprite: 'lamba1', isim: 'Lamba', aktiviteId: null },
            { x: 16, y: 7, w: 2, h: 2, sprite: 'stereo1', isim: 'Stereo', aktiviteId: null },
        ],
        kapılar: [
            { x: 0, y: 5, w: 2, h: 2, hedef: 'koridor', isim: 'Koridor ←', sprite: 'kapıKapalı' },
        ]
    },
    bahce: {
        isim: 'Bahce',
        w: 28, h: 16,
        zeminRenk: '#3a7a3a',
        duvarRenk: '#2a5a2a',
        zeminSprite: 'karo_yesil',
        duvarSprite: 'karo_yesil',
        nesneler: [
            { x: 1, y: 2, w: 2, h: 3, sprite: 'kucukAgac1', isim: 'Agac1', aktiviteId: null },
            { x: 4, y: 2, w: 2, h: 3, sprite: 'kucukAgac2', isim: 'Agac2', aktiviteId: null },
            { x: 15, y: 2, w: 2, h: 3, sprite: 'kucukAgac3', isim: 'Agac3', aktiviteId: null },
            { x: 17, y: 2, w: 2, h: 3, sprite: 'kucukAgac1', isim: 'Agac4', aktiviteId: null },
            { x: 8, y: 4, w: 4, h: 3, sprite: 'masa', isim: 'Cim Alan', aktiviteId: 'spor' },
            { x: 3, y: 9, w: 3, h: 2, sprite: 'bank', isim: 'Bank1', aktiviteId: 'dinlen' },
            { x: 13, y: 9, w: 3, h: 2, sprite: 'bank', isim: 'Bank2', aktiviteId: 'dinlen' },
        ],
        kapılar: [
            { x: 13, y: 0, w: 2, h: 2, hedef: 'koridor', isim: 'Koridor ↑', sprite: 'kapıKapalı' },
            { x: 27, y: 7, w: 2, h: 2, hedef: 'kantin', isim: 'Kantin →', sprite: 'kapıKapalı' },
            { x: 0, y: 7, w: 2, h: 2, hedef: 'sporAlani', isim: 'Spor Alani ←', sprite: 'kapıKapalı' },
        ]
    },
    kantin: {
        isim: 'Kantin',
        w: 24, h: 14,
        zeminRenk: '#c8a96e',
        duvarRenk: '#a07840',
        zeminSprite: 'karo_seftali',
        duvarSprite: 'tugla_beyaz',
        nesneler: [
            // --- Yemek Servis Hattı (Üst Duvar Boyunca) ---
            { x: 1, y: 1, w: 2, h: 3, sprite: 'tepsi_istasyonu', isim: 'Tepsi Alanı', aktiviteId: null },
            { x: 3, y: 1.5, w: 4, h: 3, sprite: 'yemek_tezgahi_sicak', isim: 'Sıcak Yemek', aktiviteId: 'yemek' },
            { x: 7, y: 1.5, w: 2.5, h: 2, sprite: 'tatli_reyonu_camli', isim: 'Tatlı Reyonu', aktiviteId: 'atistir' },
            { x: 10, y: 1.2, w: 1.5, h: 2.5, sprite: 'menu_panosu', isim: 'Günün Menüsü', aktiviteId: null },
            
            // --- Otomatlar ve Su (Sağ Duvar) ---
            { x: 13, y: 1, w: 2, h: 3.5, sprite: 'otomat_yiyecek', isim: 'Yiyecek Otomatı', aktiviteId: 'atistir' },
            { x: 15, y: 1, w: 2, h: 3.5, sprite: 'otomat_icecek', isim: 'İçecek Otomatı', aktiviteId: 'atistir' },
            { x: 17, y: 1, w: 2, h: 3.5, sprite: 'su_sebili', isim: 'Su Sebili', aktiviteId: null },
            
            // --- Kahve ve Isıtma Köşesi (Sol Alt) ---
            { x: 1, y: 10, w: 3, h: 2.5, sprite: 'kahve_makinesi', isim: 'Kahve Makinesi', aktiviteId: 'atistir' },
            { x: 4, y: 10, w: 2, h: 2.5, sprite: 'mikrodalga', isim: 'Mikrodalga', aktiviteId: null },
            
            // --- Oturma Alanı (Merkezi Bölge) ---
            { x: 7.5, y: 6.5, w: 5, h: 3, sprite: 'kantin_masasi', isim: 'Masa 1', aktiviteId: 'yemek' },
            { x: 13.5, y: 6.5, w: 5, h: 3, sprite: 'kantin_masasi', isim: 'Masa 2', aktiviteId: 'yemek' },
            { x: 7.5, y: 10, w: 5, h: 3, sprite: 'kantin_masasi', isim: 'Masa 3', aktiviteId: 'yemek' },
            { x: 13.5, y: 10, w: 5, h: 3, sprite: 'kantin_masasi', isim: 'Masa 4', aktiviteId: 'yemek' },
            
            // --- Eğlence ve Dekor ---
            { x: 20, y: 1, w: 2, h: 2, sprite: 'crtTvEski', isim: 'TV', aktiviteId: 'tv' },
        ],
        kapılar: [
            { x: 0, y: 6, w: 2, h: 2, hedef: 'bahce', isim: 'Bahce ←', sprite: 'kapıKapalı' },
        ]
    },
    sporAlani: {
        isim: 'Spor Alani',
        w: 26, h: 14,
        zeminRenk: '#5a8a5a',
        duvarRenk: '#3a6a3a',
        zeminSprite: 'arduvaz_koyu',
        duvarSprite: 'beton',
        nesneler: [
            // Ağırlık Bölümü (Üst)
            { x: 1, y: 1, w: 4, h: 3, sprite: 'squat_rack', isim: 'Squat Rack', aktiviteId: 'spor' },
            { x: 6, y: 1.5, w: 4, h: 2, sprite: 'dumbell_raki', isim: 'Dumbell Seti', aktiviteId: 'spor' },
            { x: 11, y: 2, w: 3, h: 2, sprite: 'agirlik_sehpasi', isim: 'Ağırlık Sehpası', aktiviteId: 'spor' },
            { x: 15, y: 1, w: 2, h: 3, sprite: 'barfiks_istasyonu', isim: 'Barfiks Barı', aktiviteId: 'spor' },
            
            // Kardiyo Bölümü (Orta)
            { x: 2, y: 7, w: 2, h: 3, sprite: 'kosu_bandi', isim: 'Koşu Bandı', aktiviteId: 'spor' },
            { x: 5, y: 7, w: 2, h: 3, sprite: 'kondisyon_bisikleti', isim: 'Egzersiz Bisikleti', aktiviteId: 'spor' },
            { x: 8, y: 7, w: 2, h: 3, sprite: 'plates_set', isim: 'Plates Alanı', aktiviteId: 'spor' },
            
            // Soyunma ve Dinlenme (Alt ve Sağ)
            { x: 18, y: 1, w: 2, h: 4, sprite: 'sporcu_dolabi', isim: 'Soyunma Dolabı', aktiviteId: null },
            { x: 21, y: 1, w: 2, h: 4, sprite: 'sporcu_dolabi', isim: 'Soyunma Dolabı', aktiviteId: null },
            { x: 12, y: 8, w: 3, h: 2, sprite: 'mat_rulo', isim: 'Yoga Matı', aktiviteId: 'spor' },
            { x: 16, y: 8, w: 2, h: 2, sprite: 'havlu_askisi', isim: 'Havlu Askısı', aktiviteId: null },
            { x: 2, y: 11, w: 2, h: 2, sprite: 'vucut_tartisi', isim: 'Tartı', aktiviteId: null },
        ],
        kapılar: [
            { x: 0, y: 5, w: 2, h: 2, hedef: 'bahce', isim: 'Bahce ←', sprite: 'kapıKapalı' },
        ]
    },
    bilgisayarLab: {
        isim: 'Bilgisayar Lab',
        w: 26, h: 14,
        zeminRenk: '#4a4a5a',
        duvarRenk: '#2a2a3a',
        zeminSprite: 'fayans_gri',
        duvarSprite: 'beton',
        nesneler: [
            { x: 1, y: 1, w: 4, h: 3, sprite: 'masaustuBilgisayar1', isim: 'Bilgisayar 1', aktiviteId: 'bilgisayar' },
            { x: 6, y: 1, w: 4, h: 3, sprite: 'masaustuBilgisayar2', isim: 'Bilgisayar 2', aktiviteId: 'bilgisayar' },
            { x: 11, y: 1, w: 4, h: 3, sprite: 'masaustuBilgisayar3', isim: 'Bilgisayar 3', aktiviteId: 'bilgisayar' },
            { x: 16, y: 1, w: 3, h: 3, sprite: 'hepsibirArada', isim: 'iMac', aktiviteId: 'bilgisayar' },
            { x: 1, y: 7, w: 4, h: 3, sprite: 'dizustuBilgisayar1', isim: 'Laptop Masasi', aktiviteId: 'arastir' },
            { x: 6, y: 7, w: 3, h: 3, sprite: 'masaustuBilgisayar4', isim: 'Bilgisayar 4', aktiviteId: 'bilgisayar' },
            { x: 20, y: 1, w: 2, h: 2, sprite: 'yazici', isim: 'Yazici', aktiviteId: null },
            { x: 20, y: 4, w: 2, h: 2, sprite: 'faks', isim: 'Faks', aktiviteId: null },
            { x: 20, y: 7, w: 2, h: 2, sprite: 'dosyaDolabiGri', isim: 'Dosya Dolabi', aktiviteId: null },
            { x: 10, y: 7, w: 1, h: 2, sprite: 'ofisKoltugu1', isim: 'Koltuk', aktiviteId: null },
            { x: 16, y: 5, w: 1, h: 2, sprite: 'masaKure', isim: 'Dunya Kuresi', aktiviteId: null },
            { x: 14, y: 5, w: 2, h: 2, sprite: 'projektor', isim: 'Projektor', aktiviteId: null },
        ],
        kapılar: [
            { x: 12, y: 12, w: 2, h: 2, hedef: 'koridor', isim: 'Koridor ↓', sprite: 'kapıKapalı' },
        ]
    }
};

const AKTIVITE_MAP = {
    'ders': { sure: 2, etkiler: { akademik: 15, enerji: -20, sosyal: -5 }, mesaj: 'Masada ders calistın.' },
    'uyu': { sure: 8, etkiler: { enerji: 80, saglik: 10, sosyal: -5 }, mesaj: 'Iyi uyku cektin.' },
    'sosyal': { sure: 2, etkiler: { sosyal: 25, enerji: -10, akademik: -5 }, mesaj: 'Arkadaslarinla konustun.' },
    'yemek': { sure: 1, etkiler: { saglik: 20, enerji: 15, para: -30 }, mesaj: 'Yemek yedin, 30 TL harcadin.' },
    'atistir': { sure: 1, etkiler: { enerji: 10, saglik: -5, para: -10 }, mesaj: 'Atistirdin.' },
    'dinlen': { sure: 2, etkiler: { enerji: 20, sosyal: 10, akademik: -5 }, mesaj: 'Dinlendın.' },
    'tv': { sure: 2, etkiler: { enerji: 15, sosyal: 5, akademik: -10 }, mesaj: 'TV izledin.' },
    'dersDerin': { sure: 3, etkiler: { akademik: 25, enerji: -25, sosyal: -10 }, mesaj: 'Derin calisma yaptın!' },
    'arastir': { sure: 2, etkiler: { akademik: 20, enerji: -15, sosyal: -5 }, mesaj: 'Arastirma yaptın.' },
    'spor': { sure: 1, etkiler: { saglik: 25, enerji: -20, sosyal: 10 }, mesaj: 'Spor yaptın!' },
};

// ============================================================
// NPC YAPILANDIRMASI
// ============================================================
const NPC_CONFIG = {
    koridor: { sayı: 2 },
    ortakAlan: { sayı: 3 },
    kutuphane: { sayı: 2 },
    bahce: { sayı: 4 },
    kantin: { sayı: 2, gorevli: true }, // 2 gezgin öğrenci + 1 sabit görevli
    sporAlani: { sayı: 2 },
};

const NPC_ISIMLERI = [
    'Ahmet', 'Elif', 'Mehmet', 'Zeynep', 'Ali', 'Ayşe',
    'Can', 'Selin', 'Burak', 'Merve', 'Efe', 'Deniz',
    'Kaan', 'Yağmur', 'Emre', 'Gizem', 'Ömer', 'Ceren',
    'Berk', 'Naz', 'Serkan', 'Duygu', 'Tolga', 'İrem',
];

const NPC_TIPLER = ['sosyal', 'akademik', 'yorgun', 'enerjik', 'sakin', 'merakli', 'endiseli', 'mutlu'];

// Boş placeholder — AI her konuşmada mesaj ve seçenekleri doldurur
const BOŞ_DIYALOG = {
    ilkDugum: 'giris',
    dugumler: {
        'giris': { mesaj: '', secenekler: [] }
    }
};

const YONLER = ['asagi', 'sol', 'sag', 'yukari'];

function rastgeleNpcAyarlar() {
    return {
        skinTone: Math.floor(Math.random() * 6),
        hairType: Math.floor(Math.random() * 8) + 1,
        outfit: Math.floor(Math.random() * 6) + 1,
    };
}

function npcOlustur(oda, dinamikTile) {
    const margin = 3;
    const minX = margin * dinamikTile;
    const maxX = (oda.w - margin) * dinamikTile;
    const minY = (margin + 1) * dinamikTile;
    const maxY = (oda.h - margin) * dinamikTile;

    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);
    const hedefX = minX + Math.random() * (maxX - minX);
    const hedefY = minY + Math.random() * (maxY - minY);

    return {
        x, y,
        hedefX, hedefY,
        yon: YONLER[Math.floor(Math.random() * YONLER.length)],
        adim: 0,
        bekle: 0,
        hiz: 0.8 + Math.random() * 0.7,
        isim: NPC_ISIMLERI[Math.floor(Math.random() * NPC_ISIMLERI.length)],
        diyalogAgaci: BOŞ_DIYALOG.dugumler,
        ilkDugum: BOŞ_DIYALOG.ilkDugum,
        npcTip: NPC_TIPLER[Math.floor(Math.random() * NPC_TIPLER.length)],
        ayarlar: rastgeleNpcAyarlar(),
        minX, maxX, minY, maxY,
        id: Math.random().toString(36).slice(2),
    };
}

function kantinGorevlisiOlustur(oda, dinamikTile) {
    const x = 5 * dinamikTile;
    const y = 1.8 * dinamikTile;
    return {
        x, y,
        hedefX: x, hedefY: y,
        yon: 'asagi',
        adim: 0, bekle: 0, hiz: 0,
        isim: 'Hatice Teyze',
        diyalogAgaci: BOŞ_DIYALOG.dugumler,
        ilkDugum: BOŞ_DIYALOG.ilkDugum,
        npcTip: 'kantin_gorevlisi',
        ayarlar: { skinTone: 2, hairType: 4, outfit: 3 },
        minX: x, maxX: x, minY: y, maxY: y,
        sabit: true,
        id: 'kantin_gorevlisi_sabit',
    };
}

function npcGuncelle(npc) {
    if (npc.sabit) return; // Sabit görevli hareket etmez
    if (npc.bekle > 0) {
        npc.bekle--;
        npc.adim = 0;
        return;
    }

    const dx = npc.hedefX - npc.x;
    const dy = npc.hedefY - npc.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < npc.hiz + 1) {
        // Hedefe ulaştı — yeni hedef belirle veya bekle
        npc.bekle = 40 + Math.floor(Math.random() * 80);
        npc.hedefX = npc.minX + Math.random() * (npc.maxX - npc.minX);
        npc.hedefY = npc.minY + Math.random() * (npc.maxY - npc.minY);
        return;
    }

    npc.x += (dx / dist) * npc.hiz;
    npc.y += (dy / dist) * npc.hiz;
    npc.adim++;

    // Yön belirle
    if (Math.abs(dx) > Math.abs(dy)) {
        npc.yon = dx > 0 ? 'sag' : 'sol';
    } else {
        npc.yon = dy > 0 ? 'asagi' : 'yukari';
    }
}

function npcCiz(ctx, npc, dinamikTile, imgMap, yakin) {
    karakterSpriteCiz(ctx, npc.x, npc.y, npc.yon, npc.adim, dinamikTile, imgMap, npc.ayarlar);

    const sW = 2 * dinamikTile * (32 / 32);
    const labelX = npc.x + dinamikTile / 2;
    const labelY = npc.y - sW * 0.55;
    const padding = 4;

    // Yakınsa [E] ipucu göster
    if (yakin) {
        const eText = '[E] Selam Ver';
        ctx.font = 'bold 10px Arial';
        const eTw = ctx.measureText(eText).width;
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.beginPath();
        ctx.roundRect(labelX - eTw / 2 - 6, labelY - 30, eTw + 12, 16, 6);
        ctx.fill();
        ctx.fillStyle = '#ffd700';
        ctx.textAlign = 'center';
        ctx.fillText(eText, labelX, labelY - 18);

        // Altın çerçeve (karakter etrafı)
        const chW = sW;
        const chH = sW;
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.strokeRect(npc.x + dinamikTile / 2 - chW / 2, npc.y - chH + dinamikTile, chW, chH);
    }

    // İsim etiketi
    ctx.font = 'bold 9px Arial';
    const tw = ctx.measureText(npc.isim).width;
    ctx.fillStyle = yakin ? 'rgba(180,140,0,0.85)' : 'rgba(0,0,0,0.65)';
    ctx.beginPath();
    ctx.roundRect(
        labelX - tw / 2 - padding,
        labelY - 11,
        tw + padding * 2,
        14,
        6
    );
    ctx.fill();
    ctx.fillStyle = yakin ? '#fff' : '#ffe066';
    ctx.textAlign = 'center';
    ctx.fillText(npc.isim, labelX, labelY);
}

// ============================================================
// KARAKTER ÇİZİMİ
// ============================================================
function karakterSpriteCiz(ctx, x, y, yon, adimFrame, tile, imgMap, ayarlar) {
    if (!ayarlar) { // Fallback, eger henuz ayarlar gelmediyse
        return;
    }

    const sW = CHARACTER_CONFIG.SPRITE_WIDTH;
    const sH = CHARACTER_CONFIG.SPRITE_HEIGHT;

    // Yön tespiti (0, 1, 2, 3)
    let dirIndex = CHARACTER_CONFIG.DIRECTIONS.DOWN;
    if (yon === 'sol') dirIndex = CHARACTER_CONFIG.DIRECTIONS.LEFT;
    else if (yon === 'sag') dirIndex = CHARACTER_CONFIG.DIRECTIONS.RIGHT;
    else if (yon === 'yukari') dirIndex = CHARACTER_CONFIG.DIRECTIONS.UP;

    // Animasyon frame'i (0..5)
    const animFrame = adimFrame > 0 ? (Math.floor(adimFrame / 8) % CHARACTER_CONFIG.FRAMES_PER_DIR) : 0;

    // 24 frame yan yana: (Direction * 6) + AnimFrame
    const frameX = (dirIndex * CHARACTER_CONFIG.FRAMES_PER_DIR) + animFrame;

    // Çizim ölçeği ve konumu (32x32 yerine Tile orantılı büyütüyoruz)
    // 32 size yerine daha büyük cizmek icin ölcek artirildi
    const drawW = sW * (tile / 32) * 2;
    const drawH = sH * (tile / 32) * 2;
    const drawX = x - drawW / 2 + tile / 2;
    const drawY = y - drawH + tile;

    const baseURL = CHARACTER_CONFIG.ASSETS.BASE_URL;

    // 1. Gölge (sabit 32x32)
    const shadowSrc = baseURL + CHARACTER_CONFIG.ASSETS.SHADOW;
    if (imgMap[shadowSrc] && imgMap[shadowSrc].complete) {
        ctx.drawImage(imgMap[shadowSrc], 0, 0, sW, sH, drawX, drawY, drawW, drawH);
    }

    // 2. Vücut (Character Model.png 6 satır, her satır farklı ten rengi)
    const bodySrc = baseURL + CHARACTER_CONFIG.ASSETS.SKIN_TONES;
    if (imgMap[bodySrc] && imgMap[bodySrc].complete) {
        const bodyYOffset = ayarlar.skinTone * sH;
        ctx.drawImage(imgMap[bodySrc], frameX * sW, bodyYOffset, sW, sH, drawX, drawY, drawW, drawH);
    }

    // 3. Kıyafet (Tek satır animasyon dosyaları)
    if (ayarlar.outfit > 0) {
        const outfitSrc = baseURL + CHARACTER_CONFIG.ASSETS.OUTFITS[ayarlar.outfit];
        if (imgMap[outfitSrc] && imgMap[outfitSrc].complete) {
            ctx.drawImage(imgMap[outfitSrc], frameX * sW, 0, sW, sH, drawX, drawY, drawW, drawH);
        }
    }

    // 4. Saç (Hairs.png 8 satır, her satır farklı saç tipi/rengi)
    if (ayarlar.hairType > 0) {
        const hairSrc = baseURL + CHARACTER_CONFIG.ASSETS.HAIR_SPRITESHEET;
        if (imgMap[hairSrc] && imgMap[hairSrc].complete) {
            const hairYOffset = (ayarlar.hairType - 1) * sH;
            ctx.drawImage(imgMap[hairSrc], frameX * sW, hairYOffset, sW, sH, drawX, drawY, drawW, drawH);
        }
    }
}

// ============================================================
// ODA ÇİZİMİ
// ============================================================
function odaCiz(ctx, oda, kamera, yakinRef, karakterPos, TILE, images) {
    const ox = -kamera.x;
    const oy = -kamera.y;

    // Zemin karoları (sprite veya fallback renk)
    const zeminSp = oda.zeminSprite ? ZEMIN_SPRITES[oda.zeminSprite] : null;
    const zeminImg = zeminSp ? images[zeminSp.file] : null;
    ctx.imageSmoothingEnabled = false;
    for (let gy = 0; gy < oda.h; gy++) {
        for (let gx = 0; gx < oda.w; gx++) {
            const px = ox + gx * TILE;
            const py = oy + gy * TILE;
            const koyu = (gx + gy) % 2 === 0;
            ctx.fillStyle = koyu ? oda.zeminRenk : shiftColor(oda.zeminRenk, -15);
            ctx.fillRect(px, py, TILE, TILE);
            if (zeminImg && zeminImg.complete) {
                ctx.drawImage(zeminImg,
                    zeminSp.sx, zeminSp.sy, zeminSp.sw, zeminSp.sh,
                    px, py, TILE, TILE
                );
            }
        }
    }

    // Duvarlar (üst) — sprite veya fallback renk
    const duvarSp = oda.duvarSprite ? ZEMIN_SPRITES[oda.duvarSprite] : null;
    const duvarImg = duvarSp ? images[duvarSp.file] : null;
    for (let gx = 0; gx < oda.w; gx++) {
        if (duvarImg && duvarImg.complete) {
            ctx.drawImage(duvarImg,
                duvarSp.sx, duvarSp.sy, duvarSp.sw, duvarSp.sh,
                ox + gx * TILE, oy, TILE, TILE
            );
            ctx.drawImage(duvarImg,
                duvarSp.sx, duvarSp.sy, duvarSp.sw, duvarSp.sh,
                ox + gx * TILE, oy + TILE, TILE, TILE
            );
        } else {
            ctx.fillStyle = oda.duvarRenk;
            ctx.fillRect(ox + gx * TILE, oy, TILE, TILE * 2);
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 1;
            if (gx % 2 === 0) {
                ctx.strokeRect(ox + gx * TILE + 2, oy + 2, TILE - 4, TILE / 2 - 2);
                ctx.strokeRect(ox + gx * TILE + 2, oy + TILE / 2 + 2, TILE - 4, TILE / 2 - 2);
            } else {
                ctx.strokeRect(ox + gx * TILE + 2, oy + 4, TILE - 4, TILE - 6);
            }
        }
        // Duvar alt gölgesi
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fillRect(ox + gx * TILE, oy + TILE * 2, TILE, 3);
    }

    // Kapılar
    for (let kapi of oda.kapılar) {
        const px = ox + kapi.x * TILE;
        const py = oy + kapi.y * TILE;
        const kw = kapi.w * TILE;
        const kh = kapi.h * TILE;
        const yakin = yakinRef.current?.tip === 'kapi' && yakinRef.current?.hedef === kapi.hedef;

        const sp = kapi.sprite ? SPRITES[yakin ? 'kapıAcık' : kapi.sprite] : null;

        if (sp && images[sp.file]) {
            ctx.imageSmoothingEnabled = false;
            const oran = Math.min(kw / sp.sw, kh / sp.sh);
            const cizW = sp.sw * oran;
            const cizH = sp.sh * oran;
            const cizX = px + (kw - cizW) / 2;
            const cizY = py + (kh - cizH) / 2;
            ctx.drawImage(images[sp.file], sp.sx, sp.sy, sp.sw, sp.sh, cizX, cizY, cizW, cizH);
        } else {
            ctx.fillStyle = yakin ? '#ffd700' : '#8B5E3C';
            ctx.fillRect(px, py, kw, kh);
        }

        if (yakin) {
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.strokeRect(px, py, kw, kh);
        }

        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(px, py + kh, kw, 18);
        ctx.fillStyle = yakin ? '#ffd700' : '#fff';
        ctx.font = yakin ? 'bold 10px Arial' : '9px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(kapi.isim, px + kw / 2, py + kh + 13);
    }

    // Nesneler
    for (let nesne of oda.nesneler) {
        const px = ox + nesne.x * TILE;
        const py = oy + nesne.y * TILE;
        const nw = nesne.w * TILE;
        const nh = nesne.h * TILE;
        const yakin = yakinRef.current?.tip === 'nesne' && yakinRef.current?.isim === nesne.isim && yakinRef.current?.x === nesne.x;

        // Sprite çiz

        const sp = nesne.sprite ? SPRITES[nesne.sprite] : null;
        if (sp && images[sp.file]) {
            ctx.imageSmoothingEnabled = false;
            const oran = Math.min(nw / sp.sw, nh / sp.sh);
            const cizW = sp.sw * oran;
            const cizH = sp.sh * oran;
            const cizX = px + (nw - cizW) / 2;
            const cizY = py + (nh - cizH) / 2;
            ctx.drawImage(images[sp.file], sp.sx, sp.sy, sp.sw, sp.sh, cizX, cizY, cizW, cizH);
        } else {
            ctx.fillStyle = '#888';
            ctx.fillRect(px, py, nw, nh);
        }

        // Yakınsa altın çerçeve + [E] ipucu
        if (yakin) {
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.strokeRect(px, py, nw, nh);
            if (nesne.aktiviteId) {
                ctx.fillStyle = 'rgba(0,0,0,0.75)';
                ctx.fillRect(px, py - 20, nw, 18);
                ctx.fillStyle = '#ffd700';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('[E] ' + nesne.isim, px + nw / 2, py - 6);
            }
        }
    }
}

// ============================================================
// KONUŞMA BALONCUĞU
// ============================================================
function konusmaBalonuCiz(ctx, cx, topY, tile, isim, nodeData, seciliIndex, yukleniyor = false) {
    const fontSize = Math.max(9, Math.round(tile * 0.38));
    const lineH = fontSize + 4;
    const pad = { x: 12, y: 10 };
    const tailH = 10;
    const radius = 10;

    ctx.font = `bold ${fontSize}px Arial`;

    // Metni satırlara böl (word wrap ve \n desteği)
    const satirlara = (metin, maxPx) => {
        const anaSatirlar = metin.split('\n');
        const sonuclar = [];
        for (const anaSatir of anaSatirlar) {
            const kelimeler = anaSatir.split(' ');
            let satir = '';
            for (const kelime of kelimeler) {
                const deneme = satir ? satir + ' ' + kelime : kelime;
                if (ctx.measureText(deneme).width > maxPx && satir) {
                    sonuclar.push(satir);
                    satir = kelime;
                } else {
                    satir = deneme;
                }
            }
            if (satir) sonuclar.push(satir);
        }
        return sonuclar;
    };

    // Maksimum genişliği sınırla
    const maxW = tile * 7;

    // NPC'nin Mesajı
    ctx.font = `${fontSize}px Arial`;
    const mesajSatirlar = satirlara(nodeData.mesaj, maxW - pad.x * 2);

    // Seçenekler (varsa)
    const seceneklerVarsa = nodeData.secenekler && nodeData.secenekler.length > 0;
    const secenekSatirlar = [];
    if (seceneklerVarsa) {
        nodeData.secenekler.forEach((sec, idx) => {
            const isaret = seciliIndex === idx ? '▶ ' : '   ';
            const s = satirlara(isaret + sec.metin, maxW - pad.x * 2);
            secenekSatirlar.push({ secenek: idx, lines: s });
        });
    }

    // Genişlik hesabı (isim, mesaj veya en uzun seçenek)
    ctx.font = `bold ${fontSize}px Arial`;
    const isimW = ctx.measureText(isim).width;
    ctx.font = `${fontSize}px Arial`;
    const maxMesajW = Math.max(...mesajSatirlar.map(s => ctx.measureText(s).width));
    let maxSecenekW = 0;
    secenekSatirlar.forEach(s => {
        const w = Math.max(...s.lines.map(l => ctx.measureText(l).width));
        if (w > maxSecenekW) maxSecenekW = w;
    });

    // Toplam Genişlik ve Yükseklik
    const icerikW = Math.max(isimW, maxMesajW, maxSecenekW, tile * 3);
    const balonW = Math.min(icerikW + pad.x * 2, maxW + pad.x * 2);

    const altYaziH = (!seceneklerVarsa && !yukleniyor) ? lineH : 0; // Kapat yazısı için
    const yuklenigorH = yukleniyor ? lineH * 1.5 : 0;
    let toplamSecenekSatir = 0;
    if (!yukleniyor) secenekSatirlar.forEach(s => toplamSecenekSatir += s.lines.length);

    const boslukOrtasi = (seceneklerVarsa && !yukleniyor) ? lineH * 0.5 : 0;
    const balonH = pad.y + lineH + 4 + (mesajSatirlar.length * lineH) + boslukOrtasi + (toplamSecenekSatir * lineH) + altYaziH + yuklenigorH + pad.y;

    const balonX = cx - balonW / 2;
    const balonY = topY - (tile * 2) - balonH - tailH + tile * 0.5;

    // Gölge
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    // Balon gövdesi
    ctx.fillStyle = 'rgba(15, 12, 30, 0.93)';
    ctx.beginPath();
    ctx.roundRect(balonX, balonY, balonW, balonH, radius);
    ctx.fill();

    // Kenarlık
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(balonX, balonY, balonW, balonH, radius);
    ctx.stroke();

    // Kuyruk
    const tailX = cx;
    const tailTipY = balonY + balonH + tailH;
    ctx.fillStyle = 'rgba(15, 12, 30, 0.93)';
    ctx.beginPath();
    ctx.moveTo(tailX - 7, balonY + balonH - 1);
    ctx.lineTo(tailX + 7, balonY + balonH - 1);
    ctx.lineTo(tailX, tailTipY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tailX - 7, balonY + balonH);
    ctx.lineTo(tailX, tailTipY);
    ctx.lineTo(tailX + 7, balonY + balonH);
    ctx.stroke();

    // İçerik çizimi
    let curY = balonY + pad.y + fontSize;

    // İsim
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = '#ffd700';
    ctx.textAlign = 'center';
    ctx.fillText(isim, cx, curY);

    // Ayraç
    ctx.strokeStyle = 'rgba(255,215,0,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(balonX + pad.x, curY + 4);
    ctx.lineTo(balonX + balonW - pad.x, curY + 4);
    ctx.stroke();

    curY += lineH + 2;

    // Mesaj
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = '#f0f0f0';
    ctx.textAlign = 'center';
    mesajSatirlar.forEach(satir => {
        ctx.fillText(satir, cx, curY);
        curY += lineH;
    });

    curY += boslukOrtasi;

    // Seçenekler
    if (yukleniyor) {
        // Yükleniyor animasyonu
        const nokta = Math.floor(Date.now() / 350) % 4;
        const noktalar = '.'.repeat(nokta);
        ctx.textAlign = 'center';
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(255,215,0,0.6)';
        curY += lineH * 0.8;
        ctx.fillText('⏳ Yanıt bekleniyor' + noktalar, cx, curY);
    } else if (seceneklerVarsa) {
        ctx.textAlign = 'left';
        secenekSatirlar.forEach(s => {
            const isSelected = s.secenek === seciliIndex;
            ctx.fillStyle = isSelected ? '#ffd700' : '#888';
            if (isSelected) ctx.font = `bold ${fontSize}px Arial`;
            else ctx.font = `${fontSize}px Arial`;

            s.lines.forEach(satir => {
                ctx.fillText(satir, balonX + pad.x, curY);
                curY += lineH;
            });
        });
    } else {
        // Seçenek yoksa (Kapat yazısı)
        ctx.textAlign = 'center';
        ctx.fillStyle = '#aaa';
        curY += lineH * 0.5;
        ctx.fillText('✕ Kapat [E]', cx, curY);
    }
}

function shiftColor(hex, amount) {
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount));
    return `rgb(${r},${g},${b})`;
}

// ============================================================
// ANA COMPONENT
// ============================================================
function OdaCanvas({ odaId = 'yurtOdasi', setOdaId, aktiviteYap, ekleEtki, aktif = true, karakterAyarlari, statlar, onNpcKonustu }) {
    const canvasRef = useRef(null);
    const karakterRef = useRef({ x: 7 * TILE, y: 7 * TILE, yon: 'sag' });
    const tuslarRef = useRef({});
    const yakinRef = useRef(null);
    const adimRef = useRef(0);
    const mevcutOdaRef = useRef('yurtOdasi');
    const imgMapRef = useRef({});
    const npclerRef = useRef([]);
    const yakinNpcRef = useRef(null);
    const npcDiyalogRef = useRef(null); // { npcId, isim, dugumler, aktifDugumId, seciliIndex }
    const aiMesajRef = useRef({});
    const npcDiyalogYukleniyor = useRef(false);

    async function aiMesajCek(npc) {
        if (aiMesajRef.current[npc.id]) return; // zaten çekilmişse tekrar çekme
        if (aiMesajRef.current[npc.id + '_loading']) return; // zaten çekiliyorsa tekrar çekme
        aiMesajRef.current[npc.id + '_loading'] = true;

        try {
            const res = await fetch('http://localhost:3001/api/npc-dialog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    npcTip: npc.npcTip,
                    statlar: statlar,
                    npcIsim: npc.isim
                })
            });
            const data = await res.json();
            // mesaj + secenekler nesnesini sakla
            aiMesajRef.current[npc.id] = {
                mesaj: data.mesaj,
                secenekler: Array.isArray(data.secenekler) ? data.secenekler : []
            };
        } catch (e) {
            console.error('AI mesaj hatası:', e);
            aiMesajRef.current[npc.id + '_loading'] = false;
        }
    }
    async function devamMesajCek(npc, oyuncuYaniti, npcMesaj, tur) {
        npcDiyalogYukleniyor.current = true;
        // Yükleniyor göstergesi
        if (npcDiyalogRef.current?.dugumler['giris']) {
            npcDiyalogRef.current.dugumler['giris'] = {
                ...npcDiyalogRef.current.dugumler['giris'],
                mesaj: '...',
                secenekler: []
            };
        }
        try {
            const res = await fetch('http://localhost:3001/api/npc-dialog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    npcTip: npc.npcTip,
                    statlar: statlar,
                    npcIsim: npc.isim,
                    gecmis: { npcMesaj, oyuncuYaniti },
                    tur
                })
            });
            const data = await res.json();
            if (npcDiyalogRef.current) {
                const yeniVeri = {
                    mesaj: data.mesaj || '',
                    secenekler: Array.isArray(data.secenekler) ? data.secenekler : []
                };
                npcDiyalogRef.current.dugumler['giris'] = yeniVeri;
                npcDiyalogRef.current.seciliIndex = 0;
                // Render döngüsünün ilk selamlamayı geri yazmasını önle
                aiMesajRef.current[npc.id] = yeniVeri;
            }
        } catch (e) {
            console.error('Devam mesaj hatası:', e);
            if (npcDiyalogRef.current?.dugumler['giris']) {
                npcDiyalogRef.current.dugumler['giris'].mesaj = 'Bir şeyler ters gitti...';
            }
        }
        npcDiyalogYukleniyor.current = false;
    }

    const [mevcutOdaId, setMevcutOdaId] = useState('yurtOdasi');


    useEffect(() => {
        const dosyalar = [...new Set([
            ...Object.values(SPRITES).map(s => s.file),
            ...Object.values(ZEMIN_SPRITES).map(s => s.file),
        ])];
        // Resmi temizleme fonksiyonu (Yarı saydam gölge / gri filtreleri siler)
        const resmiTemizle = (img, url) => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0);

            // Eğer resim karakter shadow ise dokunma (isteğe bağlı ama karakterin gölgesi kalabilir)
            if (url.includes('Shadow')) return img;

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                // Eğer pixel tam opak değilse (a < 255) ve tamamen saydam değilse (a > 0)
                // Bu genellikle baked-in drop shadow'dur. Veya eğer rgb çok koyu (siyah) ve opacity düşükse
                if (data[i + 3] > 0 && data[i + 3] < 255) {
                    if (data[i] < 50 && data[i + 1] < 50 && data[i + 2] < 50) {
                        data[i + 3] = 0; // Şeffaf yap
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0);

            const temizImg = new Image();
            temizImg.src = canvas.toDataURL();
            return temizImg;
        };

        dosyalar.forEach(dosya => {
            const img = new Image();
            img.onload = () => {
                imgMapRef.current[dosya] = resmiTemizle(img, dosya);
            };
            img.src = `/assets/${dosya}`;
        });

        // Karakter assetlerini yukle
        const charAssets = [
            CHARACTER_CONFIG.ASSETS.BASE_URL + CHARACTER_CONFIG.ASSETS.SHADOW,
            CHARACTER_CONFIG.ASSETS.BASE_URL + CHARACTER_CONFIG.ASSETS.SKIN_TONES,
            CHARACTER_CONFIG.ASSETS.BASE_URL + CHARACTER_CONFIG.ASSETS.HAIR_SPRITESHEET,
            ...CHARACTER_CONFIG.ASSETS.OUTFITS.filter(Boolean).map(o => CHARACTER_CONFIG.ASSETS.BASE_URL + o)
        ];
        charAssets.forEach(src => {
            const img = new Image();
            img.onload = () => {
                imgMapRef.current[src] = resmiTemizle(img, src);
            };
            img.src = src;
        });
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const onResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        onResize();
        window.addEventListener('resize', onResize);

        const tusBasildi = e => {
            const anahtar = e.key.toLowerCase();
            tuslarRef.current[anahtar] = true;
            tuslarRef.current[e.key] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
        };
        const tusBirakti = e => {
            const anahtar = e.key.toLowerCase();
            tuslarRef.current[anahtar] = false;
            tuslarRef.current[e.key] = false;
        };
        const blur = () => {
            tuslarRef.current = {};
        };
        const eBasildi = e => {
            // ESC ile konuşmayı kapat
            if (e.key === 'Escape') {
                if (npcDiyalogRef.current) {
                    npcDiyalogRef.current = null;
                    npcDiyalogYukleniyor.current = false;
                }
                return;
            }

            const diyalog = npcDiyalogRef.current;

            // Yön tuşlarıyla seçenek değiştirme
            if (diyalog) {
                const nodeData = diyalog.dugumler[diyalog.aktifDugumId];
                if (nodeData && nodeData.secenekler && nodeData.secenekler.length > 0) {
                    if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
                        diyalog.seciliIndex = Math.max(0, diyalog.seciliIndex - 1);
                        return;
                    }
                    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
                        diyalog.seciliIndex = Math.min(nodeData.secenekler.length - 1, diyalog.seciliIndex + 1);
                        return;
                    }
                }
            }

            if (e.key !== 'e' && e.key !== 'E') return;

            // Diyalog içi E basımı (seçim onayı)
            if (diyalog) {
                // Yüklenirken E'ye basılmasını engelle
                if (npcDiyalogYukleniyor.current) return;

                const nodeData = diyalog.dugumler[diyalog.aktifDugumId];
                if (nodeData && nodeData.secenekler && nodeData.secenekler.length > 0) {
                    const secilen = nodeData.secenekler[diyalog.seciliIndex];

                    // Seçeneğin yan etkisi varsa (stat değiştirme) uygula
                    if (secilen && secilen.etkiler && ekleEtki) {
                        ekleEtki(secilen.etkiler, 'Diyalog Seçimi');
                    }

                    if (secilen && secilen.hedef) {
                        // Hardcoded ağaçta başka düğüm varsa geç
                        npcDiyalogRef.current = {
                            ...diyalog,
                            aktifDugumId: secilen.hedef,
                            seciliIndex: 0
                        };
                    } else {
                        // AI konuşması — seçilen yanıta göre NPC'den yeni cevap al
                        const mevcutNpcMesaj = nodeData.mesaj;
                        const diyalogNpc = npclerRef.current.find(n => n.id === diyalog.npcId);
                        if (diyalogNpc) {
                            diyalog.tur = (diyalog.tur || 1) + 1;
                            devamMesajCek(diyalogNpc, secilen.metin, mevcutNpcMesaj, diyalog.tur);
                        }
                    }
                } else {
                    // Seçenek yok = konuşma bitti, kapat
                    delete aiMesajRef.current[diyalog.npcId];
                    delete aiMesajRef.current[diyalog.npcId + '_loading'];
                    npcDiyalogRef.current = null;
                    onNpcKonustu?.();
                }
                return;
            }

            const yakin = yakinRef.current;
            const yakinNpc = yakinNpcRef.current;
            if (yakinNpcRef.current) {
                aiMesajCek(yakinNpcRef.current);
            }
            if (yakinNpc) {
                const aiVeri = aiMesajRef.current[yakinNpc.id];
                const dugumler = { ...yakinNpc.diyalogAgaci };

                if (aiVeri) {
                    dugumler['giris'] = {
                        ...dugumler['giris'],
                        mesaj: aiVeri.mesaj,
                        ...(aiVeri.secenekler.length > 0 && { secenekler: aiVeri.secenekler })
                    };
                }

                npcDiyalogRef.current = {
                    npcId: yakinNpc.id,
                    isim: yakinNpc.isim,
                    dugumler: dugumler,
                    aktifDugumId: yakinNpc.ilkDugum,
                    seciliIndex: 0,
                };
                return;
            }

            if (!yakin) return;
            if (yakin.tip === 'kapi') {
                mevcutOdaRef.current = yakin.hedef;
                setMevcutOdaId(yakin.hedef);
                const hedefOda = ODALAR[yakin.hedef];
                karakterRef.current = {
                    x: Math.floor(hedefOda.w / 2) * 32,
                    y: Math.floor(hedefOda.h / 2) * 32,
                    yon: 'sag'
                };
            } else if (yakin.tip === 'nesne' && yakin.aktiviteId) {
                const a = AKTIVITE_MAP[yakin.aktiviteId];
                if (a) aktiviteYap({ id: yakin.aktiviteId, ...a });
            }
        };
        if (!aktif) {
            return () => {
                window.removeEventListener('resize', onResize);
            };
        }
        window.addEventListener('keydown', tusBasildi);
        window.addEventListener('keyup', tusBirakti);
        window.addEventListener('keydown', eBasildi);
        window.addEventListener('blur', blur);

        let animFrame;
        function loop() {
            const W = canvas.width;
            const H = canvas.height;
            const panelGenislik = 220;
            const oyunW = W - panelGenislik;
            const oda = ODALAR[mevcutOdaRef.current];

            const dinamikTile = Math.max(
                Math.ceil(oyunW / oda.w),
                Math.ceil(H / oda.h)
            );

            const odaGenislik = oda.w * dinamikTile;
            const odaYukseklik = oda.h * dinamikTile;
            const offsetX = panelGenislik + Math.floor((oyunW - odaGenislik) / 2);
            const offsetY = Math.floor((H - odaYukseklik) / 2);

            // NPC'leri başlat (oda değişince veya ilk yüklemede)
            const odaId = mevcutOdaRef.current;
            if (npclerRef.current._odaId !== odaId) {
                const cfg = NPC_CONFIG[odaId];
                npclerRef.current = cfg
                    ? Array.from({ length: cfg.sayı }, () => npcOlustur(oda, dinamikTile))
                    : [];
                if (cfg?.gorevli) {
                    npclerRef.current.push(kantinGorevlisiOlustur(oda, dinamikTile));
                }
                npclerRef.current._odaId = odaId;
            }

            // NPC hareket güncelle (diyaloğu açık NPC dursun, idle poz göstersin)
            npclerRef.current.forEach(npc => {
                if (npcDiyalogRef.current?.npcId === npc.id) {
                    npc.adim = 0; // idle frame
                    return;
                }
                npcGuncelle(npc);
            });

            const kar = karakterRef.current;
            const tuslar = tuslarRef.current;
            const hiz = 5;
            let hareket = false;

            if (tuslar['ArrowLeft'] || tuslar['a']) { kar.x -= hiz; kar.yon = 'sol'; hareket = true; }
            if (tuslar['ArrowRight'] || tuslar['d']) { kar.x += hiz; kar.yon = 'sag'; hareket = true; }
            if (tuslar['ArrowUp'] || tuslar['w']) { kar.y -= hiz; kar.yon = 'yukari'; hareket = true; }
            if (tuslar['ArrowDown'] || tuslar['s']) { kar.y += hiz; kar.yon = 'asagi'; hareket = true; }

            if (hareket) adimRef.current++;
            else adimRef.current = 0;

            kar.x = Math.max(dinamikTile, Math.min((oda.w - 2) * dinamikTile, kar.x));
            kar.y = Math.max(dinamikTile * 2, Math.min((oda.h - 2) * dinamikTile, kar.y));

            const kamera = {
                x: kar.x - oyunW / 2 + 12,
                y: kar.y - H / 2 + 20
            };
            kamera.x = Math.max(0, Math.min(Math.max(0, odaGenislik - oyunW), kamera.x));
            kamera.y = Math.max(0, Math.min(Math.max(0, odaYukseklik - H), kamera.y));

            // Yakın kontrol
            yakinRef.current = null;
            yakinNpcRef.current = null;
            const karMx = kar.x + 12;
            const karMy = kar.y + 20;

            // NPC yakınlık tespiti (öncelikli)
            for (let npc of npclerRef.current) {
                const npcCx = npc.x + dinamikTile / 2;
                const npcCy = npc.y + dinamikTile / 2;
                const dx = karMx - npcCx;
                const dy = karMy - npcCy;
                if (Math.sqrt(dx * dx + dy * dy) < dinamikTile * 2) {
                    yakinNpcRef.current = npc;
                    aiMesajCek(npc);
                    break;
                }
            }

            if (!yakinNpcRef.current) {
                for (let nesne of oda.nesneler) {
                    if (!nesne.aktiviteId) continue;
                    const nx = nesne.x * dinamikTile + nesne.w * dinamikTile / 2;
                    const ny = nesne.y * dinamikTile + nesne.h * dinamikTile / 2;
                    if (Math.abs(karMx - nx) < dinamikTile * 1.8 && Math.abs(karMy - ny) < dinamikTile * 1.8) {
                        yakinRef.current = { ...nesne, tip: 'nesne' };
                        break;
                    }
                }
                if (!yakinRef.current) {
                    for (let kapi of oda.kapılar) {
                        const kx = kapi.x * dinamikTile + kapi.w * dinamikTile / 2;
                        const ky = kapi.y * dinamikTile + kapi.h * dinamikTile / 2;
                        if (Math.abs(karMx - kx) < dinamikTile * 2 && Math.abs(karMy - ky) < dinamikTile * 2) {
                            yakinRef.current = { ...kapi, tip: 'kapi' };
                            break;
                        }
                    }
                }
            }

            // ÇİZİM
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, W, H);

            ctx.save();
            ctx.translate(-kamera.x + offsetX, -kamera.y + offsetY);
            odaCiz(ctx, oda, { x: 0, y: 0 }, yakinRef, kar, dinamikTile, imgMapRef.current);
            // NPC'leri çiz (oyuncunun altında)
            npclerRef.current.forEach(npc => npcCiz(ctx, npc, dinamikTile, imgMapRef.current, yakinNpcRef.current?.id === npc.id));
            // Oyuncu karakterini üste çiz
            karakterSpriteCiz(ctx, kar.x, kar.y, kar.yon, adimRef.current, dinamikTile, imgMapRef.current, karakterAyarlari || { skinTone: 0, hairType: 1, outfit: 1 });

            // Konuşma baloncuğunu en üste çiz (kamera transform içinde)
            if (npcDiyalogRef.current) {
                const diyalogData = npcDiyalogRef.current;
                const diyalogNpc = npclerRef.current.find(n => n.id === diyalogData.npcId);

                if (diyalogNpc) {
                    // Diyalog açıkken AI mesajı yüklenirse girişi canlı güncelle
                    // Diyalog açıkken AI verisi yüklenirse giris düğümünü canlı güncelle
                    const aiVeri = aiMesajRef.current[diyalogData.npcId];
                    if (aiVeri && diyalogData.dugumler['giris'] && diyalogData.dugumler['giris'].mesaj !== aiVeri.mesaj) {
                        diyalogData.dugumler['giris'] = {
                            ...diyalogData.dugumler['giris'],
                            mesaj: aiVeri.mesaj,
                            ...(aiVeri.secenekler.length > 0 && { secenekler: aiVeri.secenekler })
                        };
                    }
                    const aktifDugum = diyalogData.dugumler[diyalogData.aktifDugumId];
                    if (aktifDugum) {
                        konusmaBalonuCiz(
                            ctx,
                            diyalogNpc.x + dinamikTile / 2,
                            diyalogNpc.y,
                            dinamikTile,
                            diyalogData.isim,
                            aktifDugum,
                            diyalogData.seciliIndex,
                            npcDiyalogYukleniyor.current
                        );
                    }
                }
            }

            ctx.restore();

            // Oda ismi
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(panelGenislik + 8, 8, 160, 26);
            ctx.fillStyle = '#ffd700';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(oda.isim.toUpperCase(), panelGenislik + 16, 26);

            // Kontroller
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(W - 140, H - 28, 132, 22);
            ctx.fillStyle = '#888';
            ctx.font = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText('WASD / Ok: Hareket  E: Etkilesim', W - 8, H - 12);

            animFrame = requestAnimationFrame(loop);
        }

        loop();
        return () => {
            cancelAnimationFrame(animFrame);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('keydown', tusBasildi);
            window.removeEventListener('keyup', tusBirakti);
            window.removeEventListener('keydown', eBasildi);
            window.removeEventListener('blur', blur);
        };
    }, [aktiviteYap, aktif]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                display: 'block',
                imageRendering: 'pixelated'
            }}
        />
    );
}

export default OdaCanvas;
