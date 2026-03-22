import React, { useState, useEffect, useRef } from 'react';
import { CHARACTER_CONFIG } from '../config/characterConfig';

const KarakterOzellistirme = ({ onClose, karakterAyarlari, setKarakterAyarlari }) => {
    const [aktifTab, setAktifTab] = useState('skin');
    const canvasRef = useRef(null);

    // Önizleme için resimleri tut
    const [resimler, setResimler] = useState({
        shadow: null,
        body: null,
        outfit: null,
        hair: null
    });

    // Assetleri yükle (Önizleme için)
    useEffect(() => {
        const loadImages = async () => {
            const loadImage = (src) => {
                if (!src) return Promise.resolve(null);
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(null);
                });
            };

            const baseURL = CHARACTER_CONFIG.ASSETS.BASE_URL;
            const bodySrc = `${baseURL}${CHARACTER_CONFIG.ASSETS.SKIN_TONES}`;
            const shadowSrc = `${baseURL}${CHARACTER_CONFIG.ASSETS.SHADOW}`;
            
            const outfitObj = CHARACTER_CONFIG.ASSETS.OUTFITS[karakterAyarlari.outfit];
            const outfitSrc = outfitObj ? `${baseURL}${outfitObj}` : null;
            
            const hairSrc = karakterAyarlari.hairType > 0 ? `${baseURL}${CHARACTER_CONFIG.ASSETS.HAIR_SPRITESHEET}` : null;

            const [bodyImg, shadowImg, outfitImg, hairImg] = await Promise.all([
                loadImage(bodySrc),
                loadImage(shadowSrc),
                loadImage(outfitSrc),
                loadImage(hairSrc)
            ]);

            setResimler({
                body: bodyImg,
                shadow: shadowImg,
                outfit: outfitImg,
                hair: hairImg
            });
        };

        loadImages();
    }, [karakterAyarlari]);

    // Canvas üzerine önizlemeyi çiz
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;

        ctx.clearRect(0, 0, W, H);

        const sW = CHARACTER_CONFIG.SPRITE_WIDTH;
        const sH = CHARACTER_CONFIG.SPRITE_HEIGHT;
        const frameX = 0; // İleri bakış için ilk frame
        const frameY = 0; // Aşağı yön

        // Daha büyük çizmek için ölçek
        const scale = 2.5; 
        const drawX = (W - sW * scale) / 2;
        const drawY = (H - sH * scale) / 2 + 10;

        // Gölge
        if (resimler.shadow) {
            ctx.drawImage(resimler.shadow, drawX, drawY, sW * scale, sH * scale);
        }

        // Vücut
        if (resimler.body) {
            const bodyYOffset = karakterAyarlari.skinTone * sH;
            ctx.drawImage(
                resimler.body,
                frameX * sW, bodyYOffset, sW, sH,
                drawX, drawY, sW * scale, sH * scale
            );
        }

        // Kıyafet
        if (resimler.outfit) {
            ctx.drawImage(
                resimler.outfit,
                frameX * sW, 0, sW, sH,
                drawX, drawY, sW * scale, sH * scale
            );
        }

        // Saç
        if (resimler.hair && karakterAyarlari.hairType > 0) {
            const hairYOffset = (karakterAyarlari.hairType - 1) * sH;
            ctx.drawImage(
                resimler.hair,
                frameX * sW, hairYOffset, sW, sH,
                drawX, drawY, sW * scale, sH * scale
            );
        }
    }, [resimler, karakterAyarlari]);

    // Seçenek oluşturucu helper
    const renderOptions = (type, count, currentSetting) => {
        const options = [];
        for (let i = 0; i < count; i++) {
            const isSelected = currentSetting === i;
            options.push(
                <button
                    key={`${type}-${i}`}
                    onClick={() => setKarakterAyarlari({ [type]: i })}
                    style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: isSelected ? 'rgba(80, 200, 120, 0.3)' : 'rgba(255,255,255,0.05)',
                        border: `2px solid ${isSelected ? '#50c878' : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    }}
                >
                    {i === 0 && (type === 'hairType' || type === 'outfit') ? 'Yok' : i + 1}
                </button>
            );
        }
        return options;
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                width: '600px', height: '450px',
                background: 'rgba(15,15,25,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                display: 'flex',
                boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                overflow: 'hidden'
            }}>
                {/* SOL: Önizleme */}
                <div style={{
                    width: '250px',
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '24px',
                    backgroundColor: 'rgba(0,0,0,0.3)'
                }}>
                    <h2 style={{ color: 'white', margin: '0 0 20px 0', fontSize: '18px', textAlign: 'center' }}>Karakterin</h2>
                    <canvas 
                        ref={canvasRef} 
                        width={200} 
                        height={250} 
                        style={{
                            imageRendering: 'pixelated', // Pixel art görünümü için önemli
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}
                    />
                </div>

                {/* SAĞ: Seçenekler */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Sekmeler */}
                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        {['Cilt', 'Saç', 'Kıyafet'].map((tab, idx) => {
                            const mapTabToKey = ['skin', 'hair', 'outfit'];
                            const tabKey = mapTabToKey[idx];
                            return (
                                <button
                                    key={tabKey}
                                    onClick={() => setAktifTab(tabKey)}
                                    style={{
                                        flex: 1, padding: '16px 0', border: 'none',
                                        backgroundColor: aktifTab === tabKey ? 'rgba(255,255,255,0.05)' : 'transparent',
                                        color: aktifTab === tabKey ? '#f0c040' : '#888',
                                        borderBottom: aktifTab === tabKey ? '2px solid #f0c040' : '2px solid transparent',
                                        cursor: 'pointer', fontWeight: '600', fontSize: '14px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {tab}
                                </button>
                            );
                        })}
                    </div>

                    {/* Seçenek İçeriği */}
                    <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                        {aktifTab === 'skin' && (
                            <div>
                                <h3 style={{ color: 'white', fontSize: '14px', marginBottom: '16px' }}>Cilt Tonu Seçimi</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {renderOptions('skinTone', CHARACTER_CONFIG.ASSETS.SKIN_COUNT, karakterAyarlari.skinTone)}
                                </div>
                            </div>
                        )}
                        {aktifTab === 'hair' && (
                            <div>
                                <h3 style={{ color: 'white', fontSize: '14px', marginBottom: '16px' }}>Saç Tipi</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {renderOptions('hairType', CHARACTER_CONFIG.ASSETS.HAIR_COUNT, karakterAyarlari.hairType)}
                                </div>
                            </div>
                        )}
                        {aktifTab === 'outfit' && (
                            <div>
                                <h3 style={{ color: 'white', fontSize: '14px', marginBottom: '16px' }}>Kıyafet Seçimi</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {renderOptions('outfit', CHARACTER_CONFIG.ASSETS.OUTFITS.length, karakterAyarlari.outfit)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Alt Çubuk */}
                    <div style={{
                        padding: '16px 24px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex', justifyContent: 'flex-end'
                    }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '10px 24px',
                                backgroundColor: '#50c878',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >
                            Kaydet ve Kapat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KarakterOzellistirme;
