import { useState, useEffect } from 'react';

const BASLANGIC_STATLARI = {
    akademik: 50,
    saglik: 70,
    sosyal: 60,
    enerji: 100,
    para: 500
};

const SAATLIK_DUSUS = {
    enerji: -2,
    sosyal: -1,
    saglik: 0,
    akademik: 0,
    para: 0
};

// Rastgele olaylar listesi
const OLAYLAR = [
    {
        id: 'is',
        baslik: 'Staj Başvurusu',
        mesaj: 'Kaliteli bir şirket seni çağırıyor',
        miniOyunTip: 'is',
        kosul: (statlar) => statlar.akademik > 70,
        secenekler: [
            {
                yazi: 'Kabul Et',
                miniOyunBaslat: true,
                etkiler: { akademik: 30, enerji: -60, sosyal: -50 },
                sonuc: 'Notların düzeldi Akademik hayatın artık güzel'
            },
            {
                yazi: 'Reddet',
                etkiler: { sosyal: 25, enerji: 32 },
                sonuc: 'Kariyerin zedelendi ama yorulmadın'
            }
        ]
    },
    {
        id: 'okey',
        baslik: 'Arkadaşların Okeye Çağırıyor',
        mesaj: 'Dikkatli olmak lazım',
        miniOyunTip: 'arkadas',
        kosul: (statlar) => statlar.akademik < 70,
        secenekler: [
            {
                yazi: 'Kabul Et',
                miniOyunBaslat: true,
                etkiler: { akademik: -20, enerji: -40, sosyal: +25 },
                sonuc: 'Kafa Dağıttın'
            },
            {
                yazi: 'Gitme Bahane Uydur',
                etkiler: { sosyal: -15, enerji: 20 },
                sonuc: 'Arkadaşların sana kızgın'
            }
        ]
    },
    {
        id: 'sinav',
        baslik: 'Sinav Haberi!',
        miniOyunTip: 'hafiza',
        mesaj: 'Yarin sinavin var. Calissan iyi olur.',
        kosul: (statlar) => statlar.akademik < 70,
        secenekler: [
            {
                yazi: 'Gece boyunca calis',
                miniOyunBaslat: true,
                etkiler: { akademik: 0, enerji: -40 }, // minigame will give the academic points
                sonuc: 'Gece calistın, başarına göre not alacaksın.'
            },
            {
                yazi: 'Sansına birak',
                etkiler: { sosyal: 10, enerji: 10 },
                sonuc: 'Dinlendin ama sinav riski var...'
            }
        ]
    },
    {
        id: 'burs',
        baslik: 'Burs Firsati!',
        miniOyunTip: 'temizlik',
        mesaj: 'Akademik basarindan dolayi burs basvurusu yapabilirsin. Formları hızlıca doldurman lazım!',
        kosul: (statlar) => statlar.akademik >= 75,
        secenekler: [
            {
                yazi: 'Hızlıca Başvur',
                miniOyunBaslat: true,
                etkiler: { para: 0 }, // minigame handles reward
                sonuc: 'Burs başvuru sürecini tamamladın.'
            },
            {
                yazi: 'Vazgec',
                etkiler: {},
                sonuc: 'Basvurmadin, bir dahaki sefere.'
            }
        ]
    },
    {
        id: 'parti',
        baslik: 'Parti Daveti!',
        miniOyunTip: 'parti',
        mesaj: 'Arkadaslarin bu gece parti yapiyor. Gidecek misin?',
        kosul: (statlar) => statlar.sosyal < 60,
        secenekler: [
            {
                yazi: 'Partiye git',
                miniOyunBaslat: true,
                etkiler: { sosyal: 30, enerji: -20, akademik: -5 },
                sonuc: 'Muhtesem bir gece gecirdin!'
            },
            {
                yazi: 'Evde kal',
                etkiler: { enerji: 15, akademik: 10 },
                sonuc: 'Eve kaldın, biraz ders calistın.'
            }
        ]
    },
    {
        id: 'hastalik',
        baslik: 'Hasta Oldun!',
        miniOyunTip: 'hafiza',
        mesaj: 'Kendini iyi hissetmiyorsun. Hangi ilaç neyeydi hatırlaman lazım.',
        kosul: (statlar) => statlar.saglik < 30,
        secenekler: [
            {
                yazi: 'İlaçları hatırla ve iyileş',
                miniOyunBaslat: true,
                etkiler: { enerji: -10 },
                sonuc: 'İlaçları doğru hatırlamaya çalıştın.'
            },
            {
                yazi: 'Hiçbir şey yapmadan yat',
                etkiler: { saglik: 10, enerji: 20, akademik: -10 },
                sonuc: 'Sadece yattın, yavaş yavaş toparlıyorsun.'
            }
        ]
    },
    {
        id: 'ek_is',
        baslik: 'Is Teklifi!',
        miniOyunTip: 'parttime',
        mesaj: 'Bir kafe sana part-time is teklif ediyor.',
        kosul: (statlar) => statlar.para < 300,
        secenekler: [
            {
                yazi: 'Kabul et',
                miniOyunBaslat: true,
                etkiler: { para: 300, enerji: -20, sosyal: 10 },
                sonuc: 'Ise basladın, ekstra para kazandın.'
            },
            {
                yazi: 'Reddet',
                etkiler: { enerji: 10 },
                sonuc: 'Reddettın, vakit kazandın.'
            }
        ]
    },
    // ── Yeni Olaylar ──────────────────────────────────────────
    {
        id: 'depresyon',
        baslik: 'Ruhsal Çöküntü',
        miniOyunTip: 'arkadas',
        mesaj: 'Son günlerde hiçbir şeyden zevk alamıyorsun. Biriyle dertleşmek iyi gelebilir.',
        kosul: (statlar) => statlar.sosyal < 30 && statlar.enerji < 40,
        secenekler: [
            {
                yazi: 'Arkadaşınla dertleş',
                miniOyunBaslat: true,
                etkiler: { enerji: -10 },
                sonuc: 'İçini dökmek sana iyi gelip gelmeyeceğini göreceğiz...'
            },
            {
                yazi: 'Kendi halinde takıl',
                etkiler: { enerji: -15, saglik: -10, sosyal: -10 },
                sonuc: 'Kimseyle konuşmadın. İçin daha da karardı...'
            }
        ]
    },
    {
        id: 'yurt_kavga',
        baslik: 'Oda Arkadaşıyla Tartışma!',
        miniOyunTip: 'arkadas',
        mesaj: 'Oda arkadaşın gece 3\'te sesli müzik açtı. Doğru kelimelerle çözmeyi dene.',
        kosul: (statlar) => statlar.enerji < 50 && statlar.sosyal > 20,
        secenekler: [
            {
                yazi: 'Sakin bir şekilde konuşmayı dene',
                miniOyunBaslat: true,
                etkiler: { enerji: -5, saglik: 5 },
                sonuc: 'İletişim kurmaya çalıştın.'
            },
            {
                yazi: 'Kulaklığını tak, yorganına gir',
                etkiler: { enerji: -20, sosyal: -10, saglik: -10 },
                sonuc: 'Sabaha kadar uyuyamadın ama çatışmadan kaçındın.'
            }
        ]
    },
    {
        id: 'freelance',
        baslik: 'Freelance Proje Teklifi',
        miniOyunTip: 'kodlama',
        mesaj: 'LinkedIn\'den bir startup sana web sitesi yapımı için yazdı. Deadline çok yakın!',
        kosul: (statlar) => statlar.akademik > 60 && statlar.para < 500,
        secenekler: [
            {
                yazi: 'Kabul et ve hemen kodla!',
                miniOyunBaslat: true,
                etkiler: { enerji: -40, saglik: -10 },
                sonuc: 'Klavye başında sabahlayacaksın.'
            },
            {
                yazi: 'Pazarlık yap, süreyi uzat',
                etkiler: { para: 350, enerji: -25, akademik: -5 },
                sonuc: 'Makul bir anlaşma yaptın. Hem para kazandın hem çok yıpranmadın.'
            },
            {
                yazi: 'Şu an müsait değilim de',
                etkiler: { enerji: 5, sosyal: 5 },
                sonuc: 'Reddetttin. Belki ileride başka fırsat çıkar.'
            }
        ]
    },
    {
        id: 'eski_sevgili',
        baslik: 'Eski Sevgilinden Mesaj',
        miniOyunTip: 'arkadas',
        mesaj: '"Konuşabilir miyiz?" diye mesaj geldi. Kalbin hızlandı. Dikkatlice cevap ver.',
        kosul: (statlar) => statlar.sosyal > 40,
        secenekler: [
            {
                yazi: 'Buluş ve konuş',
                miniOyunBaslat: true,
                etkiler: { enerji: -15, akademik: -10 },
                sonuc: 'Duygusal bir görüşme olacak.'
            },
            {
                yazi: 'Kibar bir şekilde reddet',
                etkiler: { enerji: -5, sosyal: 5, saglik: 5 },
                sonuc: 'Sınırlarını korudun. Zor ama doğru karar.'
            },
            {
                yazi: 'Mesajı görüp cevap verme',
                etkiler: { sosyal: -10, enerji: -10 },
                sonuc: 'Görmezden geldin ama gece boyunca düşünüp durdun...'
            }
        ]
    },
    {
        id: 'hackathon',
        baslik: 'Hackathon Duyurusu!',
        miniOyunTip: 'kodlama',
        mesaj: 'Üniversite 48 saatlik bir hackathon düzenliyor. Ödül büyük: 2000 TL!',
        kosul: (statlar) => statlar.akademik > 55 && statlar.enerji > 50,
        secenekler: [
            {
                yazi: 'Katıl ve kodlamaya başla!',
                miniOyunBaslat: true,
                etkiler: { enerji: -50, sosyal: 10 },
                sonuc: 'Parmakların klavyede alev aldı!'
            },
            {
                yazi: 'Bu sefer pas geç',
                etkiler: { enerji: 10 },
                sonuc: 'İzlemekle yetindin. Belki bir dahaki sefere...'
            }
        ]
    },
    {
        id: 'su_kesintisi',
        baslik: 'Yurtta Su Kesintisi!',
        miniOyunTip: 'temizlik',
        mesaj: 'Sabah 6\'da kalktın, su yok. Borular patlamış, hemen müdahale etmen lazım!',
        kosul: (statlar) => statlar.saglik > 30,
        secenekler: [
            {
                yazi: 'Boruları kendi tamir et',
                miniOyunBaslat: true,
                etkiler: { enerji: -15, akademik: 10 },
                sonuc: 'Tamirat işlerine giriştin.'
            },
            {
                yazi: 'Arkadaşının yurduna git duş al',
                etkiler: { sosyal: 10, enerji: -15, akademik: -5 },
                sonuc: 'Arkadaşın kurtardı! Ama güne geç başladın.'
            }
        ]
    },
    {
        id: 'aile_ziyareti',
        baslik: 'Aile Sürpriz Ziyareti!',
        miniOyunTip: 'temizlik',
        mesaj: 'Annen ve baban haber vermeden yurda geldi. Odan çok dağınık, hemen topla!',
        kosul: (statlar) => statlar.saglik > 20,
        secenekler: [
            {
                yazi: 'Hızlıca etrafı topla!',
                miniOyunBaslat: true,
                etkiler: { enerji: -20, saglik: 5 },
                sonuc: 'Zamanla yarışıyorsun!'
            },
            {
                yazi: 'Dışarıda buluş, odayı gösterme',
                etkiler: { sosyal: 10, para: -80, enerji: -10 },
                sonuc: 'Güzel bir yemek yediniz ama hesabı sen ödedin...'
            }
        ]
    },
    {
        id: 'asistanlik',
        baslik: 'Ders Asistanlığı Teklifi',
        miniOyunTip: 'is',
        mesaj: 'Profesörün seni bu dönem asistanlığa davet ediyor. Başvuru formunu doldurmalısın.',
        kosul: (statlar) => statlar.akademik >= 70 && statlar.enerji > 40,
        secenekler: [
            {
                yazi: 'Kabul et ve formu doldur',
                miniOyunBaslat: true,
                etkiler: { enerji: -30, sosyal: -15 },
                sonuc: 'Asistan olmak için belgeleri hazırlıyorsun.'
            },
            {
                yazi: 'Teşekkürler ama şimdi olmaz',
                etkiler: { sosyal: 5, enerji: 5 },
                sonuc: 'Kibarca reddetttin. Profesör anlayışla karşıladı.'
            }
        ]
    },
    {
        id: 'telefon_kirildi',
        baslik: 'Telefonun Yere Düştü!',
        miniOyunTip: 'temizlik',
        mesaj: 'Ekranı paramparça. Kendi başına tamir etmeye ne dersin?',
        kosul: (statlar) => statlar.para > 100,
        secenekler: [
            {
                yazi: 'Lehim makinesini al ve tamir et!',
                miniOyunBaslat: true,
                etkiler: { enerji: -15, para: -20 }, // just parts cost
                sonuc: 'Ekranı kendin değiştirmeyi deniyorsun.'
            },
            {
                yazi: 'Tamirciye götür (150 TL)',
                etkiler: { para: -150, enerji: -5 },
                sonuc: 'Tamir edildi ama cüzdanın ağladı.'
            },
            {
                yazi: 'Eski telefonu kullan',
                etkiler: { sosyal: -15, enerji: -5 },
                sonuc: 'Dokunmatik zor çalışıyor ama idare ediyor.'
            }
        ]
    },
    {
        id: 'yangin_alarmi',
        baslik: 'Gece Yangın Alarmı!',
        miniOyunTip: 'temizlik',
        mesaj: 'Saat 3\'te alarm çaldı! Elektrik panosunda bir arıza var, yangın büyümeden söndür!',
        kosul: (statlar) => statlar.enerji < 60,
        secenekler: [
            {
                yazi: 'Söndürücüyü kap ve müdahale et',
                miniOyunBaslat: true,
                etkiler: { enerji: -20, saglik: -5 },
                sonuc: 'Kendini tehlikeye atıp yangına koştun!'
            },
            {
                yazi: 'Hemen dışarı çık kaç',
                etkiler: { enerji: -20, saglik: 5, sosyal: 15 },
                sonuc: 'Güvenliğe haber verdin ve binayı tahliye ettin.'
            }
        ]
    }
];
const GUNLUK_GOREVLER = [
    { id: 'g1', isim: 'Bugun ders calis', hedef: 'akademik', miktar: 10, odul: { para: 50 }, aciklama: 'Akademik statini 10 artir' },
    { id: 'g2', isim: 'Spor yap', hedef: 'saglik', miktar: 15, odul: { enerji: 20 }, aciklama: 'Saglik statini 15 artir' },
    { id: 'g3', isim: 'Arkadaslarinla vakit gec', hedef: 'sosyal', miktar: 20, odul: { para: 30 }, aciklama: 'Sosyal statini 20 artir' },
    { id: 'g4', isim: 'Para kazan', hedef: 'para', miktar: 100, odul: { enerji: 30 }, aciklama: '100 TL kazan' },
    { id: 'g5', isim: 'Enerjini koru', hedef: 'enerji', miktar: 80, odul: { para: 40 }, aciklama: 'Enerjiyi 80in ustunde tut' },
    { id: 'g6', isim: 'Saglikli kal', hedef: 'saglik', miktar: 70, odul: { para: 60 }, aciklama: 'Sagligi 70in ustunde tut' },
    { id: 'g7', isim: 'Cok calis', hedef: 'akademik', miktar: 80, odul: { para: 100 }, aciklama: 'Akademigi 80in ustunde tut' },
    { id: 'g8', isim: 'Sosyal ol', hedef: 'sosyal', miktar: 75, odul: { sosyal: 10 }, aciklama: 'Sosyali 75in ustunde tut' },
];

function rastgeleGorevler() {
    const karisik = [...GUNLUK_GOREVLER].sort(() => Math.random() - 0.5);
    return karisik.slice(0, 3).map(g => ({ ...g, tamamlandi: false, baslangic: null }));
}

export function useOyun() {
    const [donem, setDonem] = useState(1);
    const [donemSonu, setDonemSonu] = useState(false);
    const [statlar, setStatlar] = useState(BASLANGIC_STATLARI);
    const [saat, setSaat] = useState(8);
    const [gun, setGun] = useState(1);
    const [calisiyor, setCalisiyor] = useState(true);
    const [mesaj, setMesaj] = useState('Güne başlıyorsun...');
    const [mevcutOlay, setMevcutOlay] = useState(null);
    const [gunlukGorevler, setGunlukGorevler] = useState(rastgeleGorevler);
    const [tamamlananGorevler, setTamamlananGorevler] = useState([]);
    const [miniOyun, setMiniOyun] = useState(null);
    const statGuncelle = (etkiler) => {
        setStatlar(s => {
            const yeni = { ...s };
            Object.entries(etkiler).forEach(([k, v]) => {
                if (k === 'para') yeni[k] = Math.max(0, (yeni[k] || 0) + v);
                else yeni[k] = Math.max(0, Math.min(100, (yeni[k] || 0) + v));
            });
            return yeni;
        });
    };

    useEffect(() => {
        // 30 günde bir dönem sonu
        if (gun > 1 && gun % 30 === 1) {
            setCalisiyor(false);
            setDonemSonu(true);
        }
    }, [gun]);


    // Gerçek zamanlı saat
    useEffect(() => {
        if (!calisiyor || mevcutOlay) return; // Olay varken saat durur

        const interval = setInterval(() => {
            setSaat(oncekiSaat => {
                const yeniSaat = oncekiSaat + 1;
                if (yeniSaat >= 24) {
                    setGun(g => g + 1);
                    setMesaj(`Yeni bir güne uyanıyorsun...`);
                    return 0;
                }
                return yeniSaat;
            });

            setStatlar(onceki => {
                const yeni = { ...onceki };
                for (let stat in SAATLIK_DUSUS) {
                    yeni[stat] = Math.max(0, Math.min(100,
                        yeni[stat] + SAATLIK_DUSUS[stat]
                    ));
                }

                // Her 6 saatte bir rastgele olay tetikle
                olayKontrol(yeni);

                return yeni;
            });

        }, 3000);

        return () => clearInterval(interval);
    }, [calisiyor, mevcutOlay, gun]);

    // Görev takibi — stat değişince kontrol et
    useEffect(() => {
        setGunlukGorevler(onceki => {
            let degisti = false;
            const yeni = onceki.map(gorev => {
                if (gorev.tamamlandi) return gorev;

                let tamamlandi = false;
                if (gorev.hedef === 'para') {
                    tamamlandi = statlar.para >= gorev.miktar;
                } else {
                    tamamlandi = statlar[gorev.hedef] >= gorev.miktar;
                }

                if (tamamlandi) {
                    degisti = true;
                    return { ...gorev, tamamlandi: true };
                }
                return gorev;
            });

            if (degisti) {
                // Ödülleri ayrı ver
                yeni.forEach((gorev, i) => {
                    if (gorev.tamamlandi && !onceki[i].tamamlandi) {
                        setTimeout(() => {
                            setStatlar(s => {
                                const yeniS = { ...s };
                                for (let stat in gorev.odul) {
                                    if (stat === 'para') yeniS.para += gorev.odul.para;
                                    else yeniS[stat] = Math.min(100, s[stat] + gorev.odul[stat]);
                                }
                                return yeniS;
                            });
                            setMesaj(`Gorev tamamlandi: ${gorev.isim}!`);
                        }, 100);
                    }
                });
            }

            return degisti ? yeni : onceki;
        });
    }, [statlar.akademik, statlar.saglik, statlar.sosyal, statlar.enerji, statlar.para]);
    // Yeni gün — görevleri yenile
    useEffect(() => {
        setGunlukGorevler(rastgeleGorevler());
        setTamamlananGorevler([]);
    }, [gun]);

    // Olay tetikleme
    function olayKontrol(mevcutStatlar) {
        if (mevcutOlay) return;
        if (Math.random() > 0.15) return; // %15 ihtimalle olay çıkar

        const uygunOlaylar = OLAYLAR.filter(o =>
            o.kosul(mevcutStatlar)
        );

        if (uygunOlaylar.length > 0) {
            const rastgele = uygunOlaylar[
                Math.floor(Math.random() * uygunOlaylar.length)
            ];
            setMevcutOlay(rastgele);
            setCalisiyor(false); // Saat dursun
        }
    }

    // Olay seçeneğine tıklandı
    function olaySecimi(secenek) {
        if (secenek.miniOyunBaslat && mevcutOlay.miniOyunTip) {
            setMiniOyun(mevcutOlay.miniOyunTip);
            setMevcutOlay(null);
            return;
        }
        setStatlar(onceki => {
            const yeni = { ...onceki };
            for (let stat in secenek.etkiler) {
                if (stat === 'para') {
                    yeni.para = Math.max(0, onceki.para + secenek.etkiler.para);
                } else {
                    yeni[stat] = Math.max(0, Math.min(100,
                        yeni[stat] + secenek.etkiler[stat]
                    ));
                }
            }
            return yeni;
        });

        setMesaj(secenek.sonuc);
        setMevcutOlay(null);
        setCalisiyor(true);
    }

    // Aktivite yap
    function aktiviteYap(aktivite) {
        setStatlar(onceki => {
            const yeni = { ...onceki };
            for (let stat in aktivite.etkiler) {
                if (stat === 'para') {
                    yeni.para = Math.max(0, onceki.para + aktivite.etkiler.para);
                } else {
                    yeni[stat] = Math.max(0, Math.min(100,
                        yeni[stat] + aktivite.etkiler[stat]
                    ));
                }
            }
            return yeni;
        });

        setSaat(s => {
            const yeniSaat = s + (aktivite.sure || 1);
            if (yeniSaat >= 24) {
                setGun(g => g + 1);
                return yeniSaat % 24;
            }
            return yeniSaat;
        });

        setMesaj(aktivite.mesaj || '');
    }

    return {
        statlar,
        saat,
        gun,
        mesaj,
        aktiviteYap,
        mevcutOlay,
        olaySecimi,
        gunlukGorevler,
        donem,
        donemSonu,
        devamEt: (sonuclar) => {
            // Burs varsa para ekle
            if (sonuclar.bursFirsati) {
                setStatlar(s => ({ ...s, para: s.para + 300 }));
            }
            // Statları dönem başına sıfırla (kısmen)
            setStatlar(s => ({
                ...s,
                akademik: Math.max(30, s.akademik - 20),
                enerji: 80,
                sosyal: sonuclar.arkadasKaybetti
                    ? Math.max(0, s.sosyal - 15)
                    : sonuclar.arkadasKazandi
                        ? Math.min(100, s.sosyal + 10)
                        : s.sosyal
            }));
            setDonem(d => d + 1);
            setDonemSonu(false);
            setCalisiyor(true);
            setMesaj(`${donem + 1}. doneme hosgeldin!`);
        },
        statGuncelle,
        miniOyun,
        setMiniOyun
    };
}