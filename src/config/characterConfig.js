export const CHARACTER_CONFIG = {
  // Sprite boyutlari ve animasyon ayarlari
  SPRITE_WIDTH: 32,   // Her bir karenin genisligi (px)
  SPRITE_HEIGHT: 32,  // Her bir karenin yuksekligi (px)
  FRAMES_PER_DIR: 6,  // Her yondeki animasyon karesi sayisi

  // Yön satirlari yerine her yon icin baslangic indexi:
  // (24 frame yan yana -> 0-pw Down, vb.)
  DIRECTIONS: {
    DOWN: 0,
    RIGHT: 1,
    UP: 2,
    LEFT: 3
  },

  ASSETS: {
    BASE_URL: '/assets/MetroCity',
    SHADOW: '/CharacterModel/Shadow.png',

    // Cilt tonlari: tek dosya icinde satirlar (768x192 => 6 satir)
    SKIN_TONES: '/CharacterModel/Character Model.png',
    SKIN_COUNT: 6,

    // Sac tipleri icin animasyon dosyasi (768x256 => 8 satir)
    HAIR_SPRITESHEET: '/Hair/Hairs.png',
    HAIR_COUNT: 8,

    // Kiyafetler: Outfit1.png - Outfit6.png (her biri 768x32 => 1 satir)
    OUTFITS: [
      null, // Ciplak/Ickamasiri
      '/Outfits/Outfit1.png',
      '/Outfits/Outfit2.png',
      '/Outfits/Outfit3.png',
      '/Outfits/Outfit4.png',
      '/Outfits/Outfit5.png',
      '/Outfits/Outfit6.png',
    ]
  }
};
