function Saat({ saat, gun }) {
    // 8 → "08:00", 14 → "14:00"
    const saatYazi = `${String(saat).padStart(2, '0')}:00`;
    
    // Günün vaktine göre arka plan
    let vakit, renk;
    if (saat >= 6 && saat < 12)  { vakit = 'Sabah';   renk = '#ff9800'; }
    else if (saat < 17)           { vakit = 'Öğleden Sonra'; renk = '#2196F3'; }
    else if (saat < 21)           { vakit = 'Akşam';   renk = '#9C27B0'; }
    else                          { vakit = 'Gece';    renk = '#1a1a2e'; }

    return (
        <div style={{
            background: renk,
            padding: '12px 24px',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '20px',
            transition: 'background 1s ease'
        }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{saatYazi}</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>{vakit} — {gun}. Gün</div>
        </div>
    );
}

export default Saat;