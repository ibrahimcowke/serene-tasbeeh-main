export interface QuranVerse {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  surah: string;
  verse: string;
  dhikrTag: string; // e.g. "subahanallah", "alhamdulillah", "istighfar", "allahuakbar"
}

export const quranVerses: QuranVerse[] = [
  {
    id: 'verse_tasbeeh_1',
    arabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَكُن مِّنَ السَّاجِدِينَ',
    transliteration: 'Fasabbih bihamdi Rabbika wa kum-minas-sajideen',
    translation: 'So exalt [Allah] with praise of your Lord and be of those who prostrate [to Him].',
    surah: 'Al-Hijr',
    verse: '15:98',
    dhikrTag: 'subahanallah'
  },
  {
    id: 'verse_tasbeeh_2',
    arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا * وَسَبِّحُوهُ بُكْرَةً وَأَصِيلًا',
    transliteration: 'Ya ayyuhal-ladheena amanudhkurul-laha dhikran katheera * Wa sabbihuho bukratan wa aseela',
    translation: 'O you who have believed, remember Allah with much remembrance, And exalt Him morning and afternoon.',
    surah: 'Al-Ahzab',
    verse: '33:41-42',
    dhikrTag: 'subahanallah'
  },
  {
    id: 'verse_tahmeed_1',
    arabic: 'وَقُلِ الْحَمْدُ لِلَّهِ الَّذِي لَمْ يَتَّخِذْ وَلَدًا',
    transliteration: 'Wa qulil-hamdu lillahil-ladhi lam yattakhidh walada',
    translation: 'And say, "Praise to Allah, who has not taken a son."',
    surah: 'Al-Isra',
    verse: '17:111',
    dhikrTag: 'alhamdulillah'
  },
  {
    id: 'verse_tahmeed_2',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    transliteration: 'Fadhkuroonee adhkurkum washkuroo lee wa la takfuroon',
    translation: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
    surah: 'Al-Baqarah',
    verse: '2:152',
    dhikrTag: 'alhamdulillah'
  },
  {
    id: 'verse_istighfar_1',
    arabic: 'فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا * يُرْسِلِ السَّمَاءَ عَلَيْكُم مِّدْرَارًا',
    transliteration: 'Faqultus-taghfiroo rabbakum innaho kana ghaffara * Yursilis-sama-a alaykum midrara',
    translation: 'And said, "Ask forgiveness of your Lord. Indeed, He is ever a Perpetual Forgiver. He will send [rain from] the sky upon you in [abundance]."',
    surah: 'Nuh',
    verse: '71:10-11',
    dhikrTag: 'istighfar'
  },
  {
    id: 'verse_istighfar_2',
    arabic: 'وَمَن يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَّحِيمًا',
    transliteration: 'Wa man ya\'mal soo\'an aw yazlim nafsahu thumma yastaghfiril-laha yajidil-laha ghafooran raheema',
    translation: 'And whoever does a wrong or wrongs himself but then seeks forgiveness of Allah will find Allah Forgiving and Merciful.',
    surah: 'An-Nisa',
    verse: '4:110',
    dhikrTag: 'istighfar'
  },
  {
    id: 'verse_tahleel_1',
    arabic: 'شَهِدَ اللَّهُ أَنَّهُ لَا إِلَهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ قَائِمًا بِالْقِسْطِ',
    transliteration: 'Shahidal-lahu annahu la ilaha illa Huwa wal-mala-ikatu wa ulul-ilmi qa-imam bil-qist',
    translation: 'Allah witnesses that there is no deity except Him, and [so do] the angels and those of knowledge - [that He is] maintaining [creation] in justice.',
    surah: 'Ali \'Imran',
    verse: '3:18',
    dhikrTag: 'la-ilaha-illallah'
  },
  {
    id: 'verse_takbeer_1',
    arabic: 'وَرَبَّكَ فَكَبِّرْ',
    transliteration: 'Wa Rabbaka fakabbir',
    translation: 'And your Lord glorify [Allahu Akbar].',
    surah: 'Al-Muddaththir',
    verse: '74:3',
    dhikrTag: 'allahuakbar'
  },
  {
    id: 'verse_protection_1',
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    transliteration: 'Wa idha sa\'alaka ibadee annee fa-innee qareebun ujeebu da\'watad-da\'i idha da\'ani',
    translation: 'And when My servants ask you, [O Muhammad], concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.',
    surah: 'Al-Baqarah',
    verse: '2:186',
    dhikrTag: 'protection'
  },
  {
    id: 'verse_peace_1',
    arabic: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    transliteration: 'Alladheena amanoo wa tatma-innu quloobuhum bidhikril-lah * Ala bidhikril-lahi tatma-innul-quloob',
    translation: 'Those who have believed and whose hearts are assured by the remembrance of Allah. Unquestionably, by the remembrance of Allah hearts are assured.',
    surah: 'Ar-Ra\'d',
    verse: '13:28',
    dhikrTag: 'peace'
  }
];
