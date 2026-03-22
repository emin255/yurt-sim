import { useState, useEffect } from 'react';
import { CHARACTER_CONFIG } from '../config/characterConfig';

const STORAGE_KEY = 'yurt_sim_karakter_ayarlari';

const defaultAyarlar = {
  skinTone: 0,   // 0-5
  hairType: 1,   // 0-7 (0 = yok)
  hairColor: 0,  // 0-5
  outfit: 1      // 0-6 (0 = yok)
};

export const useKarakter = () => {
    const [ayarlar, setAyarlar] = useState(() => {
        const kayitli = localStorage.getItem(STORAGE_KEY);
        if (kayitli) {
            try {
                const parsed = JSON.parse(kayitli);
                // Eğer önceki versiyondan kalan veya out of bounds bir deger varsa sınırla:
                if (parsed.skinTone >= CHARACTER_CONFIG.ASSETS.SKIN_COUNT) parsed.skinTone = 0;
                if (parsed.hairType >= CHARACTER_CONFIG.ASSETS.HAIR_COUNT) parsed.hairType = 1;
                if (parsed.outfit >= CHARACTER_CONFIG.ASSETS.OUTFITS.length) parsed.outfit = 1;

                return { ...defaultAyarlar, ...parsed };
            } catch (e) {
                console.error("Karakter ayarlari yuklenemedi:", e);
                return defaultAyarlar;
            }
        }
        return defaultAyarlar;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ayarlar));
    }, [ayarlar]);

    const objeyiGuncelle = (yeniAyarlar) => {
        setAyarlar(prev => ({ ...prev, ...yeniAyarlar }));
    };

    return {
        ayarlar,
        setAyarlar: objeyiGuncelle,
        
        // Helper getter metodlari
        gorunum: {
            skinYOffset: ayarlar.skinTone * CHARACTER_CONFIG.SPRITE_HEIGHT,
            outfitImageSrc: CHARACTER_CONFIG.ASSETS.OUTFITS[ayarlar.outfit] ? 
                `${CHARACTER_CONFIG.ASSETS.BASE_URL}${CHARACTER_CONFIG.ASSETS.OUTFITS[ayarlar.outfit]}` : null,
            hairTypeImageSrc: ayarlar.hairType > 0 ? 
                `${CHARACTER_CONFIG.ASSETS.BASE_URL}${CHARACTER_CONFIG.ASSETS.HAIR_SPRITESHEET}` : null,
            hairColorYOffset: ayarlar.hairType > 0 ? (ayarlar.hairType - 1) * CHARACTER_CONFIG.SPRITE_HEIGHT : 0
        }
    };
};
