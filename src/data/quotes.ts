/**
 * Motivational Islamic quotes database
 * Carefully selected quotes about dhikr, patience, gratitude, and remembrance
 */

export interface MotivationalQuote {
  id: string;
  arabic: string;
  transliteration?: string;
  meaning: string;
  source: string;
  category: 'quran' | 'hadith' | 'scholar';
}

export const motivationalQuotes: MotivationalQuote[] = [
  {
    id: 'quote-1',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    transliteration: 'Fadhkuruni adhkurkum',
    meaning: 'So remember Me; I will remember you.',
    source: 'Quran 2:152',
    category: 'quran',
  },
  {
    id: 'quote-2',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    transliteration: 'Ala bidhikrillahi tatma\'innu al-quloob',
    meaning: 'Verily, in the remembrance of Allah do hearts find rest.',
    source: 'Quran 13:28',
    category: 'quran',
  },
  {
    id: 'quote-3',
    arabic: 'الصَّبْرُ ضِيَاءٌ',
    transliteration: 'As-sabru diya\'',
    meaning: 'Patience is illumination.',
    source: 'Sahih Muslim',
    category: 'hadith',
  },
  {
    id: 'quote-4',
    arabic: 'مَنْ قَالَ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، فِي يَوْمٍ مِائَةَ مَرَّةٍ، حُطَّتْ خَطَايَاهُ',
    transliteration: 'Man qala: Subhanallahi wa bihamdihi, fi yawmin mi\'ata marratin, huttat khatayahu',
    meaning: 'Whoever says SubhanAllah wa bihamdihi 100 times a day, his sins will be forgiven.',
    source: 'Sahih Bukhari',
    category: 'hadith',
  },
  {
    id: 'quote-5',
    arabic: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ',
    transliteration: 'Kalimatani khafifatani \'ala al-lisan, thaqilatani fi al-mizan',
    meaning: 'Two words are light on the tongue but heavy on the Scale.',
    source: 'Sahih Bukhari',
    category: 'hadith',
  },
  {
    id: 'quote-6',
    arabic: 'الْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ',
    transliteration: 'Alhamdulillahi tamla\'u al-mizan',
    meaning: 'Alhamdulillah fills the Scale.',
    source: 'Sahih Muslim',
    category: 'hadith',
  },
  {
    id: 'quote-7',
    arabic: 'أَفْضَلُ الذِّكْرِ لَا إِلَهَ إِلَّا اللَّهُ',
    transliteration: 'Afdalu al-dhikri la ilaha illallah',
    meaning: 'The best dhikr is La ilaha illallah.',
    source: 'Sunan al-Tirmidhi',
    category: 'hadith',
  },
  {
    id: 'quote-8',
    arabic: 'مَنْ لَزِمَ الِاسْتِغْفَارَ جَعَلَ اللَّهُ لَهُ مِنْ كُلِّ ضِيقٍ مَخْرَجًا',
    transliteration: 'Man lazima al-istighfara ja\'ala Allahu lahu min kulli diqin makhrajan',
    meaning: 'Whoever persists in seeking forgiveness, Allah will provide a way out from every difficulty.',
    source: 'Sunan Abu Dawud',
    category: 'hadith',
  },
  {
    id: 'quote-9',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    transliteration: 'Inna ma\'a al-\'usri yusra',
    meaning: 'Indeed, with hardship comes ease.',
    source: 'Quran 94:6',
    category: 'quran',
  },
  {
    id: 'quote-10',
    arabic: 'وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    transliteration: 'Wasbir fa-inna Allaha la yudi\'u ajra al-muhsinin',
    meaning: 'And be patient, for indeed, Allah does not allow the reward of the good-doers to be lost.',
    source: 'Quran 11:115',
    category: 'quran',
  },
  {
    id: 'quote-11',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ كَنْزٌ مِنْ كُنُوزِ الْجَنَّةِ',
    transliteration: 'La hawla wa la quwwata illa billah kanzun min kunuzi al-jannah',
    meaning: 'La hawla wa la quwwata illa billah is a treasure from the treasures of Paradise.',
    source: 'Sahih Bukhari',
    category: 'hadith',
  },
  {
    id: 'quote-12',
    arabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
    transliteration: 'Ad-du\'a\'u huwa al-\'ibadah',
    meaning: 'Supplication is worship itself.',
    source: 'Sunan al-Tirmidhi',
    category: 'hadith',
  },
  {
    id: 'quote-13',
    arabic: 'وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    transliteration: 'Wa man yatawakkal \'ala Allahi fahuwa hasbuhu',
    meaning: 'And whoever relies upon Allah - then He is sufficient for him.',
    source: 'Quran 65:3',
    category: 'quran',
  },
  {
    id: 'quote-14',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا',
    transliteration: 'Allahumma inni as\'aluka \'ilman nafi\'a',
    meaning: 'O Allah, I ask You for beneficial knowledge.',
    source: 'Sunan Ibn Majah',
    category: 'hadith',
  },
  {
    id: 'quote-15',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    transliteration: 'Khairukum man ta\'allama al-Qur\'ana wa \'allamahu',
    meaning: 'The best among you are those who learn the Quran and teach it.',
    source: 'Sahih Bukhari',
    category: 'hadith',
  },
  {
    id: 'quote-16',
    arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    transliteration: 'Inna Allaha ma\'a as-sabirin',
    meaning: 'Indeed, Allah is with the patient.',
    source: 'Quran 2:153',
    category: 'quran',
  },
  {
    id: 'quote-17',
    arabic: 'تَفَكُّرُ سَاعَةٍ خَيْرٌ مِنْ عِبَادَةِ سَنَةٍ',
    transliteration: 'Tafakkuru sa\'atin khayrun min \'ibadati sanah',
    meaning: 'An hour of contemplation is better than a year of worship.',
    source: 'Attributed to scholars',
    category: 'scholar',
  },
  {
    id: 'quote-18',
    arabic: 'مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا',
    transliteration: 'Man salla \'alayya wahidatan salla Allahu \'alayhi \'ashran',
    meaning: 'Whoever sends blessings upon me once, Allah will send blessings upon him ten times.',
    source: 'Sahih Muslim',
    category: 'hadith',
  },
  {
    id: 'quote-19',
    arabic: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ',
    transliteration: 'Al-mu\'minu al-qawiyyu khayrun wa ahabbu ila Allahi mina al-mu\'mini ad-da\'if',
    meaning: 'The strong believer is better and more beloved to Allah than the weak believer.',
    source: 'Sahih Muslim',
    category: 'hadith',
  },
  {
    id: 'quote-20',
    arabic: 'وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ',
    transliteration: 'Wa quli i\'malu fasayara Allahu \'amalakum',
    meaning: 'And say: Do [as you will], for Allah will see your deeds.',
    source: 'Quran 9:105',
    category: 'quran',
  },
];

/**
 * Get a random quote
 */
export const getRandomQuote = (): MotivationalQuote => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

/**
 * Get quote by category
 */
export const getQuotesByCategory = (category: 'quran' | 'hadith' | 'scholar'): MotivationalQuote[] => {
  return motivationalQuotes.filter(q => q.category === category);
};
