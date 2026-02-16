export interface HijriDate {
    day: number;
    month: number;
    year: number;
    monthName: string;
}

export const getHijriDate = (date: Date = new Date()): HijriDate => {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    });
    
    const parts = formatter.formatToParts(date);
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '0');
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '0');
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');

    // Month names (0-indexed for array access usually, but let's keep it simple)
    const monthNames = [
        "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
        "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
        "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ];

    return {
        day,
        month,
        year,
        monthName: monthNames[month - 1] || 'Unknown'
    };
};

export const getContext = () => {
    const today = new Date();
    const hijri = getHijriDate(today);
    const dayOfWeek = today.getDay(); // 0 = Sun, 5 = Fri

    const isJummah = dayOfWeek === 5;
    const isWhiteDay = [13, 14, 15].includes(hijri.day);
    const isRamadan = hijri.month === 9;
    
    // Check for other events could be added here (e.g. Eid)
    const isEidAlFitr = hijri.month === 10 && hijri.day === 1;
    const isEidAlAdha = hijri.month === 12 && hijri.day === 10;
    const isAshura = hijri.month === 1 && hijri.day === 10;
    const isArafah = hijri.month === 12 && hijri.day === 9;

    let specialDayName = '';
    if (isEidAlFitr) specialDayName = 'Eid al-Fitr';
    else if (isEidAlAdha) specialDayName = 'Eid al-Adha';
    else if (isArafah) specialDayName = 'Day of Arafah';
    else if (isAshura) specialDayName = 'Ashura';
    else if (isRamadan) specialDayName = 'Ramadan'; // prioritized correctly later in UI logic? 
    // Actually, Ramadan is a month, Jummah is a day. They can overlap.
    
    return {
        hijri,
        isJummah,
        isWhiteDay,
        isRamadan,
        specialDayName
    };
};
