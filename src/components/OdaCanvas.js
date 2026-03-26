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
            { x: 5, y: 1.5, w: 3, h: 2, sprite: 'masa', isim: 'Calisma Masasi', aktiviteId: 'ders' },
            { x: 10, y: 1, w: 2, h: 2, sprite: 'kitaplık1', isim: 'Kitaplik', aktiviteId: 'ders' },
            { x: 13, y: 0, w: 2, h: 2, sprite: 'pencere1', isim: 'Pencere', aktiviteId: null },
            { x: 1, y: 9, w: 2, h: 2, sprite: 'halıKare', isim: 'Hali', aktiviteId: null },
            { x: 3, y: 1.5, w: 2, h: 2, sprite: 'kucukLamba1', isim: 'Telefon', aktiviteId: 'sosyal' },
            { x: 18, y: 0, w: 2, h: 3, sprite: 'gardropKapalı', isim: 'Gardrop', aktiviteId: null },
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
            { x: 8, y: 3, w: 4, h: 3, sprite: 'masa', isim: 'Okuma Masasi', aktiviteId: 'arastir' },
            { x: 13, y: 2, w: 2, h: 3, sprite: 'cekmece', isim: 'Bilgisayar', aktiviteId: 'dersDerin' },
            { x: 17, y: 2, w: 2, h: 4, sprite: 'kitapDolabı', isim: 'Kitap Dolabi', aktiviteId: 'dersDerin' },
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
            { x: 8, y: 2, w: 3, h: 3, sprite: 'masa', isim: 'TV Masasi', aktiviteId: 'tv' },
            { x: 2, y: 7, w: 3, h: 3, sprite: 'sandalye', isim: 'Masa1', aktiviteId: 'sosyal' },
            { x: 10, y: 7, w: 3, h: 3, sprite: 'sandalye', isim: 'Masa2', aktiviteId: 'sosyal' },
            { x: 16, y: 2, w: 2, h: 3, sprite: 'lamba1', isim: 'Lamba', aktiviteId: null },
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
        w: 22, h: 12,
        zeminRenk: '#c8a96e',
        duvarRenk: '#a07840',
        zeminSprite: 'karo_seftali',
        duvarSprite: 'tugla_beyaz',
        nesneler: [
            { x: 1, y: 2, w: 6, h: 2, sprite: 'tezgah', isim: 'Tezgah', aktiviteId: 'yemek' },
            { x: 9, y: 2, w: 2, h: 3, sprite: 'buzdolabıKapalı', isim: 'Buzdolabi', aktiviteId: 'atistir' },
            { x: 2, y: 5, w: 3, h: 2, sprite: 'masa', isim: 'Masa1', aktiviteId: 'yemek' },
            { x: 7, y: 5, w: 3, h: 2, sprite: 'masa', isim: 'Masa2', aktiviteId: 'yemek' },
            { x: 12, y: 5, w: 3, h: 2, sprite: 'masa', isim: 'Masa3', aktiviteId: 'yemek' },
        ],
        kapılar: [
            { x: 0, y: 5, w: 2, h: 2, hedef: 'bahce', isim: 'Bahce ←', sprite: 'kapıKapalı' },
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
            { x: 2, y: 2, w: 4, h: 3, sprite: 'masa', isim: 'Kale1', aktiviteId: 'spor' },
            { x: 12, y: 2, w: 4, h: 3, sprite: 'masa', isim: 'Kale2', aktiviteId: 'spor' },
            { x: 2, y: 8, w: 3, h: 3, sprite: 'cekmece', isim: 'Aletler1', aktiviteId: 'spor' },
            { x: 13, y: 8, w: 3, h: 3, sprite: 'cekmece', isim: 'Aletler2', aktiviteId: 'spor' },
            { x: 7, y: 6, w: 4, h: 2, sprite: 'masa', isim: 'Kort', aktiviteId: 'spor' },
        ],
        kapılar: [
            { x: 0, y: 5, w: 2, h: 2, hedef: 'bahce', isim: 'Bahce ←', sprite: 'kapıKapalı' },
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
    kantin: { sayı: 3 },
    sporAlani: { sayı: 2 },
};

const NPC_ISIMLERI = [
    'Ahmet', 'Elif', 'Mehmet', 'Zeynep', 'Ali', 'Ayşe',
    'Can', 'Selin', 'Burak', 'Merve', 'Efe', 'Deniz',
    'Kaan', 'Yağmur', 'Emre', 'Gizem', 'Ömer', 'Ceren',
    'Berk', 'Naz', 'Serkan', 'Duygu', 'Tolga', 'İrem',
];

// Her script: { tip, ilkDugum, dugumler: { [id]: { mesaj, secenekler: [{metin, hedef}] } } } }
const NPC_DIYALOG_HAVUZU = [
    {
        tip: 'sosyal',
        ilkDugum: 'giris',
        dugumler: {
            'giris': {
                mesaj: 'Selam! Seni görmek ne güzel! Bugün ortak alanda çok eğlendim.',
                secenekler: [
                    { metin: 'Selam! Sen ne yapıyordun orda?', hedef: 'sohbet', etkiler: { sosyal: 5 } },
                    { metin: 'Şu an acelem var, sonra konuşuruz.', hedef: 'veda', etkiler: { sosyal: -2 } }
                ]
            },
            'sohbet': {
                mesaj: 'Biraz TV izledim, biraz da kantine indim. Sen naptın?',
                secenekler: [
                    { metin: 'Ders çalıştım kütüphanede.', hedef: 'ders', etkiler: { sosyal: 2 } },
                    { metin: 'Sadece odada dinlendim.', hedef: 'dinlenme', etkiler: { sosyal: 2 } }
                ]
            },
            'ders': {
                mesaj: 'Kolay gelsin! Ben de vizeler için başlamalıyım yakında. Görüşürüz!',
                secenekler: [{ metin: 'Görüşürüz.', hedef: null }]
            },
            'dinlenme': {
                mesaj: 'En iyisi! Bazen sadece yatmak gerekiyor. Hadi görüşürüz.',
                secenekler: [{ metin: 'Görüşürüz!', hedef: null }]
            },
            'veda': {
                mesaj: 'Tamamdır, işine bak. Görüşürüz!',
                secenekler: []
            }
        }
    },
    {
        tip: 'akademik',
        ilkDugum: 'giris',
        dugumler: {
            'giris': {
                mesaj: 'Hey! Vize yaklaşıyor, çalışmaya başladın mı?',
                secenekler: [
                    { metin: 'Evet, kütüphaneden çıkmıyorum.', hedef: 'evet', etkiler: { sosyal: 3, akademik: 2 } },
                    { metin: 'Daha başlamadım maalesef.', hedef: 'hayir', etkiler: { sosyal: 2, akademik: -2 } }
                ]
            },
            'evet': {
                mesaj: 'Harikasın! Eğer notlara ihtiyacın olursa haber ver paslaşırız.',
                secenekler: [
                    { metin: 'Teşekkürler, söylerim.', hedef: null, etkiler: { sosyal: 5 } }
                ]
            },
            'hayir': {
                mesaj: 'Hadi ya... Acele etsen iyi olur, konular çok birikti!',
                secenekler: [
                    { metin: 'Haklısın, bugün başlıyorum.', hedef: null, etkiler: { enerji: -5 } },
                    { metin: 'Daha çok var ya hallederim.', hedef: 'rahat', etkiler: { sosyal: -2 } }
                ]
            },
            'rahat': {
                mesaj: 'Sen bilirsin... Son gece sabahlamazsın umarım. Görüşürüz.',
                secenekler: []
            }
        }
    },
    {
        tip: 'yorgun',
        ilkDugum: 'giris',
        dugumler: {
            'giris': {
                mesaj: 'Ugh... sabahtan beri ayaktayım, çok uykum var.',
                secenekler: [
                    { metin: 'Neden uyumadın?', hedef: 'sebep', etkiler: { sosyal: 3 } },
                    { metin: 'Hemen gidip uyu bence.', hedef: 'git_uyu', etkiler: { sosyal: -2 } }
                ]
            },
            'sebep': {
                mesaj: 'Yandaki odada gece boyu müzik açıktı... Neyse, ayakta uyuyacağım şimdi.',
                secenekler: [{ metin: 'Geçmiş olsun, görüşürüz.', hedef: null, etkiler: { sosyal: 2 } }]
            },
            'git_uyu': {
                mesaj: 'Evet, yatağıma doğru sürükleniyorum şu an. Bay bay...',
                secenekler: []
            }
        }
    },
    {
        tip: 'enerjik',
        ilkDugum: 'giris',
        dugumler: {
            'giris': {
                mesaj: 'Yeeyy! Bugün spor yaptım, harika hissediyorum! Sen de spor yapar mısın?',
                secenekler: [
                    { metin: 'Kesinlikle! Her gün yaparım.', hedef: 'yaparim', etkiler: { sosyal: 5 } },
                    { metin: 'Pek bana göre değil ya.', hedef: 'yapmam', etkiler: { sosyal: 0 } }
                ]
            },
            'yaparim': {
                mesaj: 'Süper! Bir ara beraber açık alanda koçalım o zaman!',
                secenekler: [{ metin: 'Olur, konuşuruz.', hedef: null, etkiler: { enerji: 5 } }]
            },
            'yapmam': {
                mesaj: 'Ah, bir başlasan çok seversin aslında. Bir düşün!',
                secenekler: [{ metin: 'Belki bir gün... bay bay!', hedef: null }]
            }
        }
    },
    {
        tip: 'sakin',
        ilkDugum: 'giris',
        dugumler: {
            'giris': {
                mesaj: 'Merhaba, bugün hava ne kadar güzel değil mi?',
                secenekler: [
                    { metin: 'Evet çok huzurlu.', hedef: 'evet' },
                    { metin: 'Ben içerde kalmayı tercih ederim.', hedef: 'hayir' }
                ]
            },
            'evet': {
                mesaj: 'Kesinlikle. Biraz bahçede oturacağım sanırım. Görüşürüz.',
                secenekler: []
            },
            'hayir': {
                mesaj: 'Anlıyorum, odanın rahatlığı da güzeldir. Kendine iyi bak.',
                secenekler: []
            }
        }
    }
];

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

    const script = NPC_DIYALOG_HAVUZU[Math.floor(Math.random() * NPC_DIYALOG_HAVUZU.length)];

    return {
        x, y,
        hedefX, hedefY,
        yon: YONLER[Math.floor(Math.random() * YONLER.length)],
        adim: 0,
        bekle: 0,
        hiz: 0.8 + Math.random() * 0.7,
        isim: NPC_ISIMLERI[Math.floor(Math.random() * NPC_ISIMLERI.length)],
        diyalogAgaci: script.dugumler,
        ilkDugum: script.ilkDugum,
        npcTip: script.tip,
        ayarlar: rastgeleNpcAyarlar(),
        minX, maxX, minY, maxY,
        id: Math.random().toString(36).slice(2),
    };
}

function npcGuncelle(npc) {
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
            if (zeminImg && zeminImg.complete) {
                ctx.drawImage(zeminImg,
                    zeminSp.sx, zeminSp.sy, zeminSp.sw, zeminSp.sh,
                    px, py, TILE, TILE
                );
            } else {
                const koyu = (gx + gy) % 2 === 0;
                ctx.fillStyle = koyu ? oda.zeminRenk : shiftColor(oda.zeminRenk, -15);
                ctx.fillRect(px, py, TILE, TILE);
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
function konusmaBalonuCiz(ctx, cx, topY, tile, isim, nodeData, seciliIndex) {
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

    const altYaziH = !seceneklerVarsa ? lineH : 0; // Kapat yazısı için
    let toplamSecenekSatir = 0;
    secenekSatirlar.forEach(s => toplamSecenekSatir += s.lines.length);

    const boslukOrtasi = seceneklerVarsa ? lineH * 0.5 : 0;
    const balonH = pad.y + lineH + 4 + (mesajSatirlar.length * lineH) + boslukOrtasi + (toplamSecenekSatir * lineH) + altYaziH + pad.y;

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
    if (seceneklerVarsa) {
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
function OdaCanvas({ odaId = 'yurtOdasi', setOdaId, aktiviteYap, ekleEtki, aktif = true, karakterAyarlari, statlar }) {
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
            aiMesajRef.current[npc.id] = data.mesaj;
        } catch (e) {
            console.error('AI mesaj hatası:', e);
            aiMesajRef.current[npc.id + '_loading'] = false;
        }
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
                const nodeData = diyalog.dugumler[diyalog.aktifDugumId];
                if (nodeData && nodeData.secenekler && nodeData.secenekler.length > 0) {
                    const secilen = nodeData.secenekler[diyalog.seciliIndex];

                    // Seçeneğin yan etkisi varsa (stat değiştirme) uygula
                    if (secilen && secilen.etkiler && ekleEtki) {
                        ekleEtki(secilen.etkiler, 'Diyalog Seçimi');
                    }

                    if (secilen && secilen.hedef) {
                        // Yeni düğüme geç (varsa)
                        npcDiyalogRef.current = {
                            ...diyalog,
                            aktifDugumId: secilen.hedef,
                            seciliIndex: 0
                        };
                    } else {
                        // Hedef yoksa veya sonuncuysa kapat
                        npcDiyalogRef.current = null;
                    }
                } else {
                    // Seçenek yoksa direkt kapat
                    npcDiyalogRef.current = null;
                }
                return;
            }

            const yakin = yakinRef.current;
            const yakinNpc = yakinNpcRef.current;
            if (yakinNpcRef.current) {
                aiMesajCek(yakinNpcRef.current);
            }
            if (yakinNpc) {
                const aiMesaj = aiMesajRef.current[yakinNpc.id];
                const dugumler = { ...yakinNpc.diyalogAgaci };

                if (aiMesaj) {
                    dugumler['giris'] = {
                        ...dugumler['giris'],
                        mesaj: aiMesaj
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
                    const aktifDugum = diyalogData.dugumler[diyalogData.aktifDugumId];
                    if (aktifDugum) {
                        konusmaBalonuCiz(
                            ctx,
                            diyalogNpc.x + dinamikTile / 2,
                            diyalogNpc.y,
                            dinamikTile,
                            diyalogData.isim,
                            aktifDugum,
                            diyalogData.seciliIndex
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
