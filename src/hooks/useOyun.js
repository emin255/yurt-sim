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
        id: 'sinav',
        baslik: 'Sinav Haberi!',
        mesaj: 'Yarin sinavin var. Calissan iyi olur.',
        kosul: (statlar) => statlar.akademik < 70,
        secenekler: [
            {
                yazi: 'Gece boyunca calis',
                etkiler: { akademik: 20, enerji: -40 },
                sonuc: 'Gece calistın, akademik becerin arttı ama yoruldun.'
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
        mesaj: 'Akademik basarindan dolayi burs basvurusu yapabilirsin.',
        kosul: (statlar) => statlar.akademik >= 75,
        secenekler: [
            {
                yazi: 'Basvur',
                etkiler: { para: 500, akademik: 5 },
                sonuc: 'Bursu kazandin! 500 TL hesabina gecti.'
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
        mesaj: 'Arkadaslarin bu gece parti yapiyor. Gidecek misin?',
        kosul: (statlar) => statlar.sosyal < 60,
        secenekler: [
            {
                yazi: 'Partiye git',
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
        mesaj: 'Kendini iyi hissetmiyorsun, dinlenmen lazim.',
        kosul: (statlar) => statlar.saglik < 30,
        secenekler: [
            {
                yazi: 'Dinlen',
                etkiler: { saglik: 30, enerji: 20, akademik: -10 },
                sonuc: 'Dinlendikten sonra kendine geldin.'
            },
            {
                yazi: 'Yine de derse git',
                etkiler: { saglik: -20, akademik: 5 },
                sonuc: 'Hasta olarak derse gittin, sagligin daha da bozuldu.'
            }
        ]
    },
    {
        id: 'ek_is',
        baslik: 'Is Teklifi!',
        mesaj: 'Bir kafe sana part-time is teklif ediyor.',
        kosul: (statlar) => statlar.para < 300,
        secenekler: [
            {
                yazi: 'Kabul et',
                etkiler: { para: 300, enerji: -20, sosyal: 10 },
                sonuc: 'Ise basladın, ekstra para kazandın.'
            },
            {
                yazi: 'Reddet',
                etkiler: { enerji: 10 },
                sonuc: 'Reddettın, vakit kazandın.'
            }
        ]
    }
];

export function useOyun() {
    const [statlar, setStatlar] = useState(BASLANGIC_STATLARI);
    const [saat, setSaat] = useState(8);
    const [gun, setGun] = useState(1);
    const [calisiyor, setCalisiyor] = useState(true);
    const [mesaj, setMesaj] = useState('Güne başlıyorsun...');
    const [mevcutOlay, setMevcutOlay] = useState(null); // Aktif olay

    // Gerçek zamanlı saat
    useEffect(() => {
        if (!calisiyor || mevcutOlay) return; // Olay varken saat durur

        const interval = setInterval(() => {
            setSaat(oncekiSaat => {
                const yeniSaat = oncekiSaat + 1;
                if (yeniSaat >= 24) {
                    setGun(g => g + 1);
                    setMesaj(`Yeni bir güne uyanıyorsun...`);
                    return 8;
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
        setCalisiyor(true); // Saati tekrar başlat
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
                return 8;
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
        olaySecimi
    };
}