import { useTasbeehStore } from '@/store/tasbeehStore';

type Lang = 'en' | 'ar' | 'hi' | 'ur' | 'tr' | 'ms' | 'id' | 'fr' | 'so';

const translations: Record<string, Partial<Record<Lang, string>>> = {
  // --- Navigation ---
  'nav.dhikr': {
    en: 'Dhikr', ar: 'ذكر', hi: 'ज़िक्र', ur: 'ذکر', tr: 'Zikir', ms: 'Zikir', id: 'Zikir', fr: 'Dhikr', so: 'Xusuus'
  },
  'nav.target': {
    en: 'Target', ar: 'الهدف', hi: 'लक्ष्य', ur: 'ہدف', tr: 'Hedef', ms: 'Sasaran', id: 'Target', fr: 'Objectif', so: 'Yoolka'
  },
  'nav.reminders': {
    en: 'Reminders', ar: 'التذكيرات', hi: 'अनुस्मारक', ur: 'یاد دہانی', tr: 'Hatırlatıcılar', ms: 'Peringatan', id: 'Pengingat', fr: 'Rappels', so: 'Xusuusinta'
  },
  'nav.menu': {
    en: 'Menu', ar: 'القائمة', hi: 'मेनू', ur: 'مینو', tr: 'Menü', ms: 'Menu', id: 'Menu', fr: 'Menu', so: 'Menu'
  },
  'nav.history': {
    en: 'History', ar: 'السجل', hi: 'इतिहास', ur: 'تاریخ', tr: 'Geçmiş', ms: 'Sejarah', id: 'Riwayat', fr: 'Historique', so: 'Taariikhda'
  },
  'nav.stats': {
    en: 'Stats', ar: 'الإحصاء', hi: 'आँकड़े', ur: 'اعداد وشمار', tr: 'İstatistik', ms: 'Statistik', id: 'Statistik', fr: 'Statistiques', so: 'Tirakoobka'
  },
  'nav.progress': {
    en: 'Progress', ar: 'التقدم', hi: 'प्रगति', ur: 'پیشرفت', tr: 'İlerleme', ms: 'Kemajuan', id: 'Kemajuan', fr: 'Progrès', so: 'Horumarinta'
  },
  'nav.achievements': {
    en: 'Achievements', ar: 'الإنجازات', hi: 'उपलब्धियाँ', ur: 'کامیابیاں', tr: 'Başarılar', ms: 'Pencapaian', id: 'Pencapaian', fr: 'Réalisations', so: 'Guulaha'
  },
  'nav.routines': {
    en: 'Routines', ar: 'الروتين', hi: 'दिनचर्या', ur: 'روٹین', tr: 'Rutinler', ms: 'Rutin', id: 'Rutinitas', fr: 'Routines', so: 'Caadooyinka'
  },
  'nav.duas': {
    en: 'Duas', ar: 'الأدعية', hi: 'दुआएं', ur: 'دعائیں', tr: 'Dualar', ms: 'Doa', id: 'Doa', fr: 'Invocations', so: 'Ducada'
  },
  'nav.challenges': {
    en: 'Challenges', ar: 'التحديات', hi: 'चुनौतियाँ', ur: 'چیلنجز', tr: 'Mücadeleler', ms: 'Cabaran', id: 'Tantangan', fr: 'Défis', so: 'Caqabadaha'
  },
  'nav.calendar': {
    en: 'Calendar', ar: 'التقويم', hi: 'कैलेंडर', ur: 'کیلنڈر', tr: 'Takvim', ms: 'Kalendar', id: 'Kalender', fr: 'Calendrier', so: 'Kalandarka'
  },
  'nav.settings': {
    en: 'Settings', ar: 'الإعدادات', hi: 'सेटिंग्स', ur: 'ترتیبات', tr: 'Ayarlar', ms: 'Tetapan', id: 'Pengaturan', fr: 'Paramètres', so: 'Goobaha'
  },
  'nav.qibla': {
    en: 'Qibla', ar: 'القبلة', hi: 'क़िबला', ur: 'قبلہ', tr: 'Kıble', ms: 'Kiblat', id: 'Kiblat', fr: 'Qibla', so: 'Qiblada'
  },
  'nav.names': {
    en: '99 Names', ar: 'أسماء الله', hi: '99 नाम', ur: '99 نام', tr: '99 İsim', ms: '99 Nama', id: '99 Nama', fr: '99 Noms', so: '99 Magac'
  },
  'nav.multi': {
    en: 'Multi', ar: 'متعدد', hi: 'बहु', ur: 'ملٹی', tr: 'Çoklu', ms: 'Pelbagai', id: 'Multi', fr: 'Multi', so: 'Badan'
  },
  'nav.ambient': {
    en: 'Ambient', ar: 'الأجواء', hi: 'परिवेश', ur: 'ماحول', tr: 'Ortam', ms: 'Suasana', id: 'Ambient', fr: 'Ambiance', so: 'Jawiga'
  },

  // --- Dua Library ---
  'duas.title': {
    en: 'Dua Library', ar: 'مكتبة الأدعية', hi: 'दुआ पुस्तकालय', ur: 'دعا لائبریری', tr: 'Dua Kütüphanesi', ms: 'Perpustakaan Doa', id: 'Perpustakaan Doa', fr: 'Bibliothèque de Duaa', so: 'Maktabadda Ducada'
  },
  'duas.search': {
    en: 'Search duas...', ar: 'ابحث عن الأدعية...', hi: 'दुआ खोजें...', ur: 'دعائیں تلاش کریں...', tr: 'Dua ara...', ms: 'Cari doa...', id: 'Cari doa...', fr: 'Rechercher des invocations...', so: 'Raadi ducada...'
  },
  'duas.empty': {
    en: 'No duas found', ar: 'لم يتم العثور على أدعية', hi: 'कोई दुआ नहीं मिली', ur: 'کوئی دعا नहीं मिली', tr: 'Dua bulunamadı', ms: 'Tiada doa dijumpai', id: 'Tidak ada doa ditemukan', fr: 'Aucune invocation trouvée', so: 'Ducad lama helin'
  },
  'duas.category.all': {
    en: 'All Duas', ar: 'كل الأدعية', hi: 'सभी दुआएं', ur: 'تمام دعائیں', tr: 'Tüm Dualar', ms: 'Semua Doa', id: 'Semua Doa', fr: 'Toutes les invocations', so: 'Dhammaan Ducada'
  },
  'duas.category.morning': {
    en: 'Morning', ar: 'الصباح', hi: 'सुबह', ur: 'صبح', tr: 'Sabah', ms: 'Pagi', id: 'Pagi', fr: 'Matin', so: 'Subaxda'
  },
  'duas.category.evening': {
    en: 'Evening', ar: 'المساء', hi: 'शाम', ur: 'شام', tr: 'Akşam', ms: 'Petang', id: 'Sore', fr: 'Soir', so: 'Galabtii'
  },
  'duas.category.prayer': {
    en: 'After Prayer', ar: 'بعد الصلاة', hi: 'नमाज के बाद', ur: 'نماز کے بعد', tr: 'Namazdan Sonra', ms: 'Selepas Solat', id: 'Setelah Shalat', fr: 'Après la prière', so: 'Kadib Salaadda'
  },
  'duas.category.protection': {
    en: 'Protection', ar: 'التحصين', hi: 'सुरक्षा', ur: 'حفاظت', tr: 'Koruma', ms: 'Perlindungan', id: 'Perlindungan', fr: 'Protection', so: 'Difaaca'
  },
  'duas.category.gratitude': {
    en: 'Gratitude', ar: 'الحمد والشكر', hi: 'कृतज्ञता', ur: 'شکرگزاری', tr: 'Şükür', ms: 'Syukur', id: 'Syukur', fr: 'Gratitude', so: 'Mahadnaqda'
  },
  'duas.category.general': {
    en: 'General', ar: 'عام', hi: 'सामान्य', ur: 'عام', tr: 'Genel', ms: 'Umum', id: 'Umum', fr: 'Général', so: 'Guud'
  },

  // --- Sidebar ---
  'sidebar.practice': {
    en: 'Practice', ar: 'الممارسة', hi: 'अभ्यास', ur: 'مشق', tr: 'Uygulama', ms: 'Amalan', id: 'Latihan', fr: 'Pratique', so: 'Tababar'
  },
  'sidebar.insights': {
    en: 'Insights', ar: 'التحليلات', hi: 'अंतर्दृष्टि', ur: 'بصیرت', tr: 'Analizler', ms: 'Wawasan', id: 'Wawasan', fr: 'Analyses', so: 'Fahamka'
  },
  'sidebar.after_prayer': {
    en: 'After Prayer', ar: 'بعد الصلاة', hi: 'नमाज के बाद', ur: 'نماز کے بعد', tr: 'Namazdan Sonra', ms: 'Selepas Solat', id: 'Setelah Shalat', fr: 'Après la prière', so: 'Kadib Salaadda'
  },
  'sidebar.select_dhikr': {
    en: 'Select Dhikr', ar: 'اختر الذكر', hi: 'ज़िक्र चुनें', ur: 'ذکر منتخب کریں', tr: 'Zikir Seç', ms: 'Pilih Zikir', id: 'Pilih Zikir', fr: 'Choisir Dhikr', so: 'Xulan Xususta'
  },
  'sidebar.set_target': {
    en: 'Set Target', ar: 'حدد الهدف', hi: 'लक्ष्य निर्धारित करें', ur: 'ہدف مقرر کریں', tr: 'Hedef Belirle', ms: 'Tetapkan Sasaran', id: 'Atur Target', fr: 'Définir Objectif', so: 'Dejin Yoolka'
  },

  // --- Counter ---
  'counter.reset': {
    en: 'Reset', ar: 'إعادة', hi: 'रीसेट', ur: 'ری سیٹ', tr: 'Sıfırla', ms: 'Tetap Semula', id: 'Reset', fr: 'Réinitialiser', so: 'Dib u dejin'
  },
  'counter.undo': {
    en: 'Undo', ar: 'تراجع', hi: 'पूर्ववत', ur: 'واپس', tr: 'Geri Al', ms: 'Buat Asal', id: 'Batalkan', fr: 'Annuler', so: 'Noqo'
  },
  'counter.target': {
    en: 'Target', ar: 'الهدف', hi: 'लक्ष्य', ur: 'ہدف', tr: 'Hedef', ms: 'Sasaran', id: 'Target', fr: 'Objectif', so: 'Yoolka'
  },
  'counter.daily_goal': {
    en: 'Daily Goal', ar: 'الهدف اليومي', hi: 'दैनिक लक्ष्य', ur: 'روزانہ ہدف', tr: 'Günlük Hedef', ms: 'Matlamat Harian', id: 'Target Harian', fr: 'Objectif quotidien', so: 'Yoolka Maalinlaha'
  },
  'counter.set_intention': {
    en: 'Set Intention', ar: 'اضبط النية', hi: 'नियत करें', ur: 'نیت करें', tr: 'Niyet Et', ms: 'Tetapkan Niat', id: 'Tentukan Niat', fr: 'Fixer intention', so: 'Dejin Niyada'
  },
  'counter.intention': {
    en: 'Intention', ar: 'النية', hi: 'नियत', ur: 'नیت', tr: 'Niyet', ms: 'Niat', id: 'Niat', fr: 'Intention', so: 'Niyada'
  },
  'counter.total': {
    en: 'Total', ar: 'الإجمالي', hi: 'कुल', ur: 'کل', tr: 'Toplam', ms: 'Jumlah', id: 'Total', fr: 'Total', so: 'Wadarta'
  },
  'counter.rounds': {
    en: 'Rounds', ar: 'الجولات', hi: 'राउंड', ur: 'راؤنڈ', tr: 'Turlar', ms: 'Pusingan', id: 'Putaran', fr: 'Tours', so: 'Wareegyada'
  },
  'counter.streak': {
    en: 'Streak', ar: 'التتابع', hi: 'श्रृंखला', ur: 'لگاتار', tr: 'Seri', ms: 'Jujukan', id: 'Streak', fr: 'Série', so: 'Silsilada'
  },
  'counter.session_timer': {
    en: 'Session Timer', ar: 'مؤقت الجلسة', hi: 'सत्र टाइमर', ur: 'سیشن ٹائمر', tr: 'Oturum Zamanlayıcısı', ms: 'Pemasa Sesi', id: 'Timer Sesi', fr: 'Minuteur de session', so: 'Turjumaaha Faslanka'
  },
  'counter.voice_on': {
    en: 'Voice On', ar: 'الصوت مفعل', hi: 'आवाज चालू', ur: 'آواز آن', tr: 'Ses Açık', ms: 'Suara Pasang', id: 'Suara Aktif', fr: 'Voix active', so: 'Codka Daar'
  },
  'counter.voice_off': {
    en: 'Voice Off', ar: 'الصوت معطل', hi: 'आवाज बंद', ur: 'آواز آف', tr: 'Ses Kapalı', ms: 'Suara Tutup', id: 'Suara Nonaktif', fr: 'Voix désactive', so: 'Codka Demi'
  },
  'counter.start': {
    en: 'Start', ar: 'ابدأ', hi: 'शुरू', ur: 'شروع', tr: 'Başla', ms: 'Mula', id: 'Mulai', fr: 'Commencer', so: 'Bilow'
  },
  'counter.pause': {
    en: 'Pause', ar: 'إيقاف مؤقت', hi: 'रोकें', ur: 'وقفہ', tr: 'Duraklat', ms: 'Jeda', id: 'Jeda', fr: 'Pause', so: 'Jooji Ku Meel Gaar'
  },
  'counter.stop': {
    en: 'Stop', ar: 'إيقاف', hi: 'रोकें', ur: 'روکیں', tr: 'Durdur', ms: 'Berhenti', id: 'Berhenti', fr: 'Arrêter', so: 'Jooji'
  },

  // --- Settings ---
  'settings.title': {
    en: 'Settings', ar: 'الإعدادات', hi: 'सेटिंग्स', ur: 'ترتیبات', tr: 'Ayarlar', ms: 'Tetapan', id: 'Pengaturan', fr: 'Paramètres', so: 'Goobaha'
  },
  'settings.themes': {
    en: 'Themes', ar: 'السمات', hi: 'थीम', ur: 'تھیمز', tr: 'Temalar', ms: 'Tema', id: 'Tema', fr: 'Thèmes', so: 'Qaabaabka'
  },
  'settings.counter': {
    en: 'Counter', ar: 'العداد', hi: 'काउंटर', ur: 'کاؤنٹر', tr: 'Sayaç', ms: 'Pembilang', id: 'Penghitung', fr: 'Compteur', so: 'Tiriyaha'
  },
  'settings.behavior': {
    en: 'Behavior', ar: 'السلوك', hi: 'व्यवहार', ur: 'رویہ', tr: 'Davranış', ms: 'Tingkah Laku', id: 'Perilaku', fr: 'Comportement', so: 'Dhaqanka'
  },
  'settings.data': {
    en: 'Data', ar: 'البيانات', hi: 'डेटा', ur: 'ڈیٹا', tr: 'Veriler', ms: 'Data', id: 'Data', fr: 'Données', so: 'Xogta'
  },
  'settings.language': {
    en: 'Language', ar: 'اللغة', hi: 'भाषा', ur: 'زبان', tr: 'Dil', ms: 'Bahasa', id: 'Bahasa', fr: 'Langue', so: 'Luuqadda'
  },
  'settings.language_en': {
    en: 'English', ar: 'الإنجليزية', hi: 'अंग्रेज़ी', ur: 'انگریزی', tr: 'İngilizce', ms: 'Bahasa Inggeris', id: 'Bahasa Inggris', fr: 'Anglais', so: 'Ingiriisi'
  },
  'settings.language_ar': {
    en: 'Arabic', ar: 'العربية', hi: 'अरबी', ur: 'عربی', tr: 'Arapça', ms: 'Bahasa Arab', id: 'Bahasa Arab', fr: 'Arabe', so: 'Carabi'
  },
  'settings.haptic': {
    en: 'Haptic Feedback', ar: 'الاهتزاز', hi: 'हैप्टिक फीडबैक', ur: 'ہیپٹک فیڈبیک', tr: 'Titreşim', ms: 'Maklum Balas Haptik', id: 'Umpan Balik Haptic', fr: 'Retour haptique', so: 'Gariirka'
  },
  'settings.sound': {
    en: 'Sound Effects', ar: 'المؤثرات الصوتية', hi: 'ध्वनि प्रभाव', ur: 'आواز के اثرات', tr: 'Ses Efektleri', ms: 'Kesan Bunyi', id: 'Efek Suara', fr: 'Effets sonores', so: 'Codadka'
  },
  'settings.sound_type': {
    en: 'Sound Type', ar: 'نوع الصوت', hi: 'ध्वनि प्रकार', ur: 'آواز کی قسم', tr: 'Ses Türü', ms: 'Jenis Bunyi', id: 'Jenis Suara', fr: 'Type de son', so: 'Nooca Codka'
  },
  'settings.breathing': {
    en: 'Breathing Guide', ar: 'دليل التنفس', hi: 'श्वास मार्गदर्शिका', ur: 'سانس لینے की रहनुमाई', tr: 'Nefes Kılavuzu', ms: 'Panduan Pernafasan', id: 'Panduan Pernapasan', fr: 'Guide respiratoire', so: 'Hagaha Neefsashada'
  },
  'settings.shake': {
    en: 'Shake to Reset', ar: 'هز للإعادة', hi: 'हिलाकर रीसेट', ur: 'ہلائیں تو ری سیٹ', tr: 'Sallamak için Sıfırla', ms: 'Goncang untuk Tetap Semula', id: 'Kocok untuk Reset', fr: 'Secouer pour réinitialiser', so: 'Garaaci si dib loo dejin'
  },
  'settings.wake_lock': {
    en: 'Keep Screen On', ar: 'إبقاء الشاشة مضاءة', hi: 'स्क्रीन चालू रखें', ur: 'اسکرین آن رکھیں', tr: 'Ekranı Açık Tut', ms: 'Pastikan Skrin Menyala', id: 'Jaga Layar Tetap Aktif', fr: 'Garder l\'écran allumé', so: 'Shuub Shaashada'
  },
  'settings.zen': {
    en: 'Zen Mode', ar: 'وضع التأمل', hi: 'ज़ेन मोड', ur: 'زین موڈ', tr: 'Zen Modu', ms: 'Mod Zen', id: 'Mode Zen', fr: 'Mode Zen', so: 'Habka Nafaynta'
  },
  'settings.volume_buttons': {
    en: 'Volume Button Counting', ar: 'عد بأزرار الصوت', hi: 'वॉल्यूम बटन से गिनें', ur: 'والیوم بٹن سے گنتی', tr: 'Ses Düğmesiyle Sayma', ms: 'Kira dengan Butang Kelantangan', id: 'Hitung dengan Tombol Volume', fr: 'Compter via bouton volume', so: 'Tirida Badhanka Codka'
  },
  'settings.auto_theme': {
    en: 'Auto Theme by Time', ar: 'تغيير السمة تلقائياً', hi: 'समय के अनुसार थीम', ur: 'وقت کے مطابق تھیم', tr: 'Saate Göre Otomatik Tema', ms: 'Tema Auto Mengikut Masa', id: 'Tema Otomatis Berdasarkan Waktu', fr: 'Thème auto selon l\'heure', so: 'Qaabka Taariikhda'
  },
  'settings.export': {
    en: 'Export Data', ar: 'تصدير البيانات', hi: 'डेटा निर्यात', ur: 'ڈیٹا برآمد', tr: 'Veriyi Dışa Aktar', ms: 'Eksport Data', id: 'Ekspor Data', fr: 'Exporter les données', so: 'Dhoofinta Xogta'
  },
  'settings.import': {
    en: 'Import Data', ar: 'استيراد البيانات', hi: 'डेटा आयात', ur: 'ڈیٹا درآمد', tr: 'Veriyi İçe Aktar', ms: 'Import Data', id: 'Impor Data', fr: 'Importer les données', so: 'Keenista Xogta'
  },
  'settings.clear': {
    en: 'Clear All Data', ar: 'مسح جميع البيانات', hi: 'सभी डेटा साफ़ करें', ur: 'تمام ڈیٹا صاف کریں', tr: 'Tüm Verileri Temizle', ms: 'Padam Semua Data', id: 'Hapus Semua Data', fr: 'Effacer toutes les données', so: 'Nadiifi Dhammaan Xogta'
  },
  'settings.ambient_sound': {
    en: 'Ambient Sound', ar: 'صوت الخلفية', hi: 'परिवेशी ध्वनि', ur: 'پس منظر کی آواز', tr: 'Ortam Sesi', ms: 'Bunyi Persekitaran', id: 'Suara Ambient', fr: 'Son ambiant', so: 'Codka Jawiga'
  },
  'settings.ambient_none': {
    en: 'None', ar: 'بدون', hi: 'कोई नहीं', ur: 'کوئی नहीं', tr: 'Yok', ms: 'Tiada', id: 'Tidak Ada', fr: 'Aucun', so: 'Maan'
  },
  'settings.ambient_rain': {
    en: 'Rain', ar: 'مطر', hi: 'बारिश', ur: 'बारिश', tr: 'Yağmur', ms: 'Hujan', id: 'Hujan', fr: 'Pluie', so: 'Roob'
  },
  'settings.ambient_water': {
    en: 'Flowing Water', ar: 'ماء جاري', hi: 'बहता पानी', ur: 'بہتا पानी', tr: 'Akan Su', ms: 'Air Mengalir', id: 'Air Mengalir', fr: 'Eau courante', so: 'Biyo Socda'
  },
  'settings.ambient_masjid': {
    en: 'Masjid', ar: 'مسجد', hi: 'मस्जिद', ur: 'مسجد', tr: 'Cami', ms: 'Masjid', id: 'Masjid', fr: 'Mosquée', so: 'Masaajidka'
  },
  'settings.ambient_volume': {
    en: 'Volume', ar: 'مستوى الصوت', hi: 'वॉल्यूम', ur: 'والیوم', tr: 'Ses Seviyesi', ms: 'Kelantangan', id: 'Volume', fr: 'Volume', so: 'Codka'
  },
  'settings.haptic_pattern': {
    en: 'Haptic Pattern', ar: 'نمط الاهتزاز', hi: 'हैप्टिक पैटर्न', ur: 'ہیپٹک پیٹرن', tr: 'Titreşim Deseni', ms: 'Corak Haptik', id: 'Pola Haptic', fr: 'Modèle haptique', so: 'Qaabka Gariirka'
  },
  'settings.haptic_default': {
    en: 'Default', ar: 'افتراضي', hi: 'डिफ़ॉल्ट', ur: 'ڈیفالٹ', tr: 'Varsayılan', ms: 'Lalai', id: 'Default', fr: 'Par défaut', so: 'Asalka'
  },
  'settings.haptic_double': {
    en: 'Double Tap', ar: 'نقرة مزدوجة', hi: 'डबल टैप', ur: 'دوہرا ٹیپ', tr: 'Çift Dokunuş', ms: 'Dua Ketukan', id: 'Ketuk Dua Kali', fr: 'Double touche', so: 'Labanlaab'
  },
  'settings.haptic_triple': {
    en: 'Triple', ar: 'ثلاثية', hi: 'तिहरा', ur: 'تہرا', tr: 'Üçlü', ms: 'Tiga Kali', id: 'Tiga Kali', fr: 'Triple', so: 'Saddexaad'
  },

  // --- Niyyah ---
  'niyyah.title': {
    en: 'Set Your Intention', ar: 'اضبط نيتك', hi: 'अपनी नियत करें', ur: 'اپنی نیت کریں', tr: 'Niyetini Belirle', ms: 'Tetapkan Niat Anda', id: 'Tetapkan Niat Anda', fr: 'Fixer votre intention', so: 'Dejin Niyadadaada'
  },
  'niyyah.subtitle': {
    en: 'What is your intention for this dhikr session?', ar: 'ما نيتك لجلسة الذكر هذه؟', hi: 'इस ज़िक्र सत्र के लिए आपकी नियत क्या है?', ur: 'اس ذکر سیشن کے لیے آپ کی نیت کیا ہے? ', tr: 'Bu zikir oturumu için niyetin nedir?', ms: 'Apakah niat anda untuk sesi zikir ini?', id: 'Apa niat Anda untuk sesi zikir ini?', fr: 'Quelle est votre intention pour cette session de dhikr?', so: 'Maxay tahay niyadadaada ee fasalkan xususta?'
  },
  'niyyah.placeholder': {
    en: 'e.g. For the sake of Allah, seeking forgiveness...', ar: 'مثال: لوجه الله، طلبًا للمغفرة...', hi: 'उदा. अल्लाह के लिए, माफी के लिए...', ur: 'مثال: اللہ کی خاطر، مغفرت کی طلب...', tr: 'örn. Allah rızası için, bağışlanma talep etmek...', ms: 'contoh. Kerana Allah, memohon keampunan...', id: 'contoh. Karena Allah, memohon ampunan...', fr: 'ex. Pour l\'amour d\'Allah, cherchant pardon...', so: 'tusaale. Waxaan u samaynayaa Alle, baadanaya cafis...'
  },
  'niyyah.confirm': {
    en: 'Begin Session', ar: 'ابدأ الجلسة', hi: 'सत्र शुरू करें', ur: 'سیشن شروع کریں', tr: 'Oturumu Başlat', ms: 'Mulakan Sesi', id: 'Mulai Sesi', fr: 'Commencer la session', so: 'Bilow Faslanka'
  },
  'niyyah.skip': {
    en: 'Skip', ar: 'تخطى', hi: 'छोड़ें', ur: 'چھوڑیں', tr: 'Atla', ms: 'Langkau', id: 'Lewati', fr: 'Passer', so: 'Kicinso'
  },

  // --- Mood Tracker ---
  'mood.title': {
    en: 'How is your mood today?', ar: 'كيف تشعر اليوم؟', hi: 'आज आपका मूड कैसा है?', ur: 'آج آپ کا موڈ کیسا ہے؟', tr: 'Bugün nasıl hissediyorsun?', ms: 'Bagaimana perasaan anda hari ini?', id: 'Bagaimana suasana hati Anda hari ini?', fr: 'Comment vous sentez-vous aujourd\'hui?', so: 'Sidee tahay xaalkagu maanta?'
  },
  'mood.focus': {
    en: 'Focus Level', ar: 'مستوى التركيز', hi: 'फोकस स्तर', ur: 'توجہ کی سطح', tr: 'Odaklanma Seviyesi', ms: 'Tahap Fokus', id: 'Tingkat Fokus', fr: 'Niveau de concentration', so: 'Heerka Xoogga'
  },
  'mood.peaceful': {
    en: 'Peaceful', ar: 'هادئ', hi: 'शांत', ur: 'پرسکون', tr: 'Huzurlu', ms: 'Damai', id: 'Damai', fr: 'Paisible', so: 'Xasilloon'
  },
  'mood.distracted': {
    en: 'Distracted', ar: 'مشتت', hi: 'विचलित', ur: 'توجہ بٹی ہوئی', tr: 'Dağınık', ms: 'Terganggu', id: 'Terganggu', fr: 'Distrait', so: 'Iska maqan'
  },
  'mood.connected': {
    en: 'Connected', ar: 'متصل', hi: 'जुड़ा हुआ', ur: 'متصل', tr: 'Bağlı', ms: 'Bersambung', id: 'Terhubung', fr: 'Connecté', so: 'Xidnaa'
  },
  'mood.spiritual': {
    en: 'Spiritual', ar: 'روحاني', hi: 'आध्यात्मिक', ur: 'روحانی', tr: 'Manevi', ms: 'Rohani', id: 'Spiritual', fr: 'Spiritual', so: 'Ruuxi'
  },
  'mood.grateful': {
    en: 'Grateful', ar: 'ممتن', hi: 'कृतज्ञ', ur: 'شکرگزاری', tr: 'Minnettarlık', ms: 'Bersyukur', id: 'Bersyukur', fr: 'Reconnaissant', so: 'Mahadnaqda'
  },
  'mood.repentant': {
    en: 'Regretful', ar: 'نادم / مقصر', hi: 'पछतावा', ur: 'نادم', tr: 'Pişman', ms: 'Menyesal', id: 'Menyesal', fr: 'Repentant', so: 'Naaxdin'
  },
  'mood.save': {
    en: 'Save & Close', ar: 'حفظ وإغلاق', hi: 'सहेजें और बंद करें', ur: 'محفوظ کریں اور بند کریں', tr: 'Kaydet ve Kapat', ms: 'Simpan & Tutup', id: 'Simpan & Tutup', fr: 'Sauvegarder & Fermer', so: 'Keydi oo Xidh'
  },
  'mood.skip': {
    en: 'Skip', ar: 'تخطى', hi: 'छोड़ें', ur: 'چھوڑیں', tr: 'Atla', ms: 'Langkau', id: 'Lewati', fr: 'Passer', so: 'Kicinso'
  },

  // --- Qibla ---
  'qibla.title': {
    en: 'Qibla Direction', ar: 'اتجاه القبلة', hi: 'क़िबला दिशा', ur: 'قبلہ سمت', tr: 'Kıble Yönü', ms: 'Arah Kiblat', id: 'Arah Kiblat', fr: 'Direction de la Qibla', so: 'Jihada Qiblada'
  },
  'qibla.subtitle': {
    en: 'Point your device to find the Qibla', ar: 'حرك جهازك لإيجاد القبلة', hi: 'क़िबला खोजने के लिए डिवाइस घुमाएं', ur: 'قبلہ تلاش کرنے کے لیے آلہ گھمائیں', tr: 'Kıbleyi bulmak için cihazı çevir', ms: 'Tunjukkan peranti untuk mencari kiblat', id: 'Arahkan perangkat untuk mencari kiblat', fr: 'Pointez votre appareil pour trouver la Qibla', so: 'U jeedi telefoonkaaga si aad u hesho Qiblada'
  },
  'qibla.permission': {
    en: 'Allow compass access', ar: 'اسمح بالوصول للبوصلة', hi: 'कंपास एक्सेस अनुमति दें', ur: 'کمپاس تک رسائی دیں', tr: 'Pusulaya erişime izin ver', ms: 'Benarkan akses kompas', id: 'Izinkan akses kompas', fr: 'Autoriser l\'accès à la boussole', so: 'Ogolow helida kombaaska'
  },
  'qibla.calibrate': {
    en: 'Move phone in figure-8 to calibrate', ar: 'حرك الهاتف بشكل رقم 8 للمعايرة', hi: 'कैलिब्रेट करने के लिए 8 के आकार में हिलाएं', ur: '8 کی شکل میں موبائل ہلائیں', tr: 'Kalibrasyon için telefonu 8 şeklinde hareket ettirin', ms: 'Gerak telefon dalam bentuk 8 untuk kalibrasi', id: 'Gerakkan ponsel dalam angka 8 untuk kalibrasi', fr: 'Déplacez le téléphone en figure 8 pour calibrer', so: 'U ruxux telefoonka si lambar 8 ah si calibrateyn'
  },
  'qibla.facing': {
    en: 'Facing Qibla', ar: 'مواجه القبلة', hi: 'क़िबला की ओर', ur: 'قبلہ کی طرف', tr: 'Kıbleye Yönelik', ms: 'Menghadap Kiblat', id: 'Menghadap Kiblat', fr: 'Face à la Qibla', so: 'Wejiga Qiblada'
  },
  'qibla.bearing': {
    en: 'Bearing to Mecca', ar: 'الاتجاه نحو مكة', hi: 'मक्का की दिशा', ur: 'مکہ کی طرف', tr: 'Mekke\'ye Yön', ms: 'Bearing ke Mekah', id: 'Arah ke Mekkah', fr: 'Cap vers La Mecque', so: 'Jiheynta Makkah'
  },
  'qibla.degrees': {
    en: 'degrees', ar: 'درجة', hi: 'डिग्री', ur: 'درجے', tr: 'derece', ms: 'darjah', id: 'derajat', fr: 'degrés', so: 'darajo'
  },
  'qibla.location_error': {
    en: 'Could not get location. Using default.', ar: 'تعذر الحصول على الموقع. استخدام الافتراضي.', hi: 'स्थान नहीं मिला। डिफ़ॉल्ट उपयोग कर रहे हैं।', ur: 'مقام نہیں ملا۔ ڈیفالٹ استعمال ہو رہا ہے۔', tr: 'Konum alınamadı. Varsayılan kullanılıyor.', ms: 'Tidak dapat mendapatkan lokasi. Menggunakan lalai.', id: 'Tidak dapat mendapatkan lokasi. Menggunakan default.', fr: 'Localisation impossible. Valeur par défaut utilisée.', so: 'Meeshaan lama heli karo. Asalka la isticmaalayo.'
  },

  // --- Asmaul Husna ---
  'names.title': {
    en: '99 Names of Allah', ar: 'أسماء الله الحسنى', hi: 'अल्लाह के 99 नाम', ur: 'اللہ کے 99 نام', tr: 'Allah\'ın 99 İsmi', ms: '99 Nama Allah', id: '99 Nama Allah', fr: '99 Noms d\'Allah', so: '99 Magacyada Alle'
  },
  'names.subtitle': {
    en: 'Asma ul Husna', ar: 'التسعة والتسعون اسماً', hi: 'अस्मा उल हुस्ना', ur: 'اسماء الحسنیٰ', tr: 'Esma-ül Hüsna', ms: 'Asma ul Husna', id: 'Asma ul Husna', fr: 'Asma ul Husna', so: 'Asmaa ul Husna'
  },
  'names.count_this': {
    en: 'Count This Name', ar: 'عد هذا الاسم', hi: 'इस नाम को गिनें', ur: 'یہ نام گنیں', tr: 'Bu İsmi Say', ms: 'Kira Nama Ini', id: 'Hitung Nama Ini', fr: 'Compter ce Nom', so: 'Tiri Magacaan'
  },
  'names.search': {
    en: 'Search names...', ar: 'ابحث عن اسم...', hi: 'नाम खोजें...', ur: 'نام تلاش کریں...', tr: 'İsimleri ara...', ms: 'Cari nama...', id: 'Cari nama...', fr: 'Rechercher des noms...', so: 'Raadi magacyada...'
  },

  // --- Ambient ---
  'ambient.title': {
    en: 'Ambient Sound', ar: 'صوت الخلفية', hi: 'परिवेशी ध्वनि', ur: 'پس منظر की آواز', tr: 'Ortam Sesi', ms: 'Bunyi Persekitaran', id: 'Suara Ambient', fr: 'Son ambiant', so: 'Codka Jawiga'
  },
  'ambient.playing': {
    en: 'Playing', ar: 'يعزف', hi: 'बज रहा है', ur: 'چل رہا है', tr: 'Çalıyor', ms: 'Dimainkan', id: 'Diputar', fr: 'En lecture', so: 'Ciyaaraya'
  },
  'ambient.stopped': {
    en: 'Stopped', ar: 'متوقف', hi: 'रोका गया', ur: 'رکا ہوا', tr: 'Durduruldu', ms: 'Dihentikan', id: 'Dihentikan', fr: 'Arrêté', so: 'Joojiyay'
  },

  // --- Multi Counter ---
  'multi.title': {
    en: 'Multi Counter', ar: 'عداد متعدد', hi: 'बहु काउंटर', ur: 'ملٹی کاؤنٹر', tr: 'Çoklu Sayaç', ms: 'Pembilang Pelbagai', id: 'Multi Penghitung', fr: 'Multi Compteur', so: 'Tiriya Badan'
  },
  'multi.add_counter': {
    en: 'Add Counter', ar: 'إضافة عداد', hi: 'काउंटर जोड़ें', ur: 'کاؤنٹر شامل کریں', tr: 'Sayaç Ekle', ms: 'Tambah Pembilang', id: 'Tambah Penghitung', fr: 'Ajouter compteur', so: 'Ku dar tiriyaha'
  },
  'multi.total': {
    en: 'Total', ar: 'المجموع', hi: 'कुल', ur: 'کل', tr: 'Toplam', ms: 'Jumlah', id: 'Total', fr: 'Total', so: 'Wadarta'
  },
  'multi.remove': {
    en: 'Remove', ar: 'إزالة', hi: 'हटाएं', ur: 'ہटائیں', tr: 'Kaldır', ms: 'Buang', id: 'Hapus', fr: 'Supprimer', so: 'Ka saar'
  },

  // --- Share ---
  'share.title': {
    en: 'Share Stats', ar: 'مشاركة الإحصاء', hi: 'आँकड़े साझा करें', ur: 'اعداد شیئر کریں', tr: 'İstatistikleri Paylaş', ms: 'Kongsi Statistik', id: 'Bagikan Statistik', fr: 'Partager les stats', so: 'Wadaag Tirakoobka'
  },
  'share.weekly': {
    en: 'Weekly Summary', ar: 'ملخص الأسبوع', hi: 'साप्ताहिक सारांश', ur: 'ہفتہ وار خلاصہ', tr: 'Haftalık Özet', ms: 'Ringkasan Mingguan', id: 'Ringkasan Mingguan', fr: 'Résumé hebdomadaire', so: 'Koobidda Todobaadka'
  },
  'share.export_csv': {
    en: 'Export as CSV', ar: 'تصدير كـ CSV', hi: 'CSV के रूप में निर्यात', ur: 'CSV کے طور پر برآمد', tr: 'CSV olarak Dışa Aktar', ms: 'Eksport sebagai CSV', id: 'Ekspor sebagai CSV', fr: 'Exporter en CSV', so: 'Dhoofinta CSV'
  },
  'share.export_pdf': {
    en: 'Print / PDF', ar: 'طباعة / PDF', hi: 'प्रिंट / PDF', ur: 'پرنٹ / PDF', tr: 'Yazdır / PDF', ms: 'Cetak / PDF', id: 'Cetak / PDF', fr: 'Imprimer / PDF', so: 'Daabac / PDF'
  },
  'share.total_dhikr': {
    en: 'Total Dhikr', ar: 'إجمالي الذكر', hi: 'कुल ज़िक्र', ur: 'کل ذکر', tr: 'Toplam Zikir', ms: 'Jumlah Zikir', id: 'Total Zikir', fr: 'Total Dhikr', so: 'Wadarta Xususta'
  },
  'share.streak': {
    en: 'Current Streak', ar: 'الرصيد الحالي', hi: 'वर्तमान श्रृंखला', ur: 'موجودہ سلسلہ', tr: 'Mevcut Seri', ms: 'Jujukan Semasa', id: 'Streak Saat Ini', fr: 'Série actuelle', so: 'Silsiladda Hadda'
  },
  'share.best_day': {
    en: 'Best Day', ar: 'أفضل يوم', hi: 'सबसे अच्छा दिन', ur: 'بہترین دن', tr: 'En İyi Gün', ms: 'Hari Terbaik', id: 'Hari Terbaik', fr: 'Meilleur jour', so: 'Maalinta Ugu Fiican'
  },

  // --- Onboarding ---
  'welcome.tagline': {
    en: 'Your Spiritual Companion', ar: 'رفيقك الروحي', hi: 'आपका आध्यात्मिक साथी', ur: 'آپ کا روحانی साथी', tr: 'Manevi Yol Arkadaşınız', ms: 'Teman Rohani Anda', id: 'Teman Spiritual Anda', fr: 'Votre compagnon spirituel', so: 'Saaxiibkaaga Ruuxiga'
  },
  'welcome.slide1_title': {
    en: 'Count with Purpose', ar: 'اذكر بنية', hi: 'उद्देश्य के साथ गिनें', ur: 'مقصد کے ساتھ گنیں', tr: 'Amaçlı Say', ms: 'Kira dengan Tujuan', id: 'Hitung dengan Tujuan', fr: 'Compter avec intention', so: 'Tiri Ujeeddo'
  },
  'welcome.slide1_body': {
    en: 'Track your daily dhikr with a beautiful, distraction-free counter.', ar: 'تتبع ذكرك اليومي بعداد جميل بلا إشتتات.', hi: 'एक सुंदर, विकर्षण-मुक्त काउंटर से अपना दैनिक ज़िक्र ट्रैक करें।', ur: 'एक सुंदर, विकर्षण-मुक्त काउंटर से अपना दैनिक ज़िक्र ट्रैक करें।', tr: 'Günlük zikrinizi güzel, dikkat dağıtıcısız bir sayaçla takip edin.', ms: 'Jejaki zikir harian anda dengan pembilang yang cantik dan bebas gangguan.', id: 'Lacak zikir harian Anda dengan penghitung yang indah dan bebas gangguan.', fr: 'Suivez votre dhikr quotidien avec un compteur beau et sans distraction.', so: 'Raac xusustada maalinlaha ah tiriye qurux badan oo aan khatarlahayn.'
  },
  'welcome.slide2_title': {
    en: 'Build Habits', ar: 'ابنِ العادات', hi: 'आदतें बनाएं', ur: 'عادات بنائیں', tr: 'Alışkanlık Oluştur', ms: 'Bina Tabiat', id: 'Bangun Kebiasaan', fr: 'Construire des habitudes', so: 'Dhisi Caadooyinka'
  },
  'welcome.slide3_title': {
    en: 'Stay Connected', ar: 'ابقَ متصلاً', hi: 'जुड़े रहें', ur: 'جڑے رہیں', tr: 'Bağlantıda Kal', ms: 'Kekal Bersambung', id: 'Tetap Terhubung', fr: 'Rester connecté', so: 'Sii xidnaw'
  },
  'welcome.slide3_body': {
    en: 'Qibla compass, 99 Names, Dua library and prayer times — all offline.', ar: 'بوصلة القبلة، أسماء الله، مكتبة الأدعية وأوقات الصلاة — بدون إنترنت.', hi: 'क़िबला कंपास, 99 नाम, दुआ पुस्तकालय और नमाज़ के समय — सभी ऑफलाइन।', ur: 'قبلہ کمپاس, 99 نام, دعا لائبریری اور نماز کے اوقات — سب آف لائن۔', tr: 'Kıble pusulası, 99 İsim, Dua kütüphanesi ve namaz vakitleri — hepsi çevrimdışı.', ms: 'Kompas kiblat, 99 Nama, perpustakaan Doa dan waktu solat — semua luar talian.', id: 'Kompas kiblat, 99 Nama, perpustakaan Doa dan waktu shalat — semua offline.', fr: 'Boussole Qibla, 99 Noms, bibliothèque de Duaa et horaires de prière — tout hors ligne.', so: 'Kompaaaska Qiblada, 99 Magac, Maktabadda Ducada iyo wakhtiga salaadda — dhammaan offline.'
  },
  'welcome.choose_language': {
    en: 'Choose your language', ar: 'اختر لغتك', hi: 'अपनी भाषा चुनें', ur: 'اپنی زبان چنیں', tr: 'Dilinizi seçin', ms: 'Pilih bahasa anda', id: 'Pilih bahasa Anda', fr: 'Choisissez votre langue', so: 'Xulo luuqaddaada'
  },
  'welcome.get_started': {
    en: 'Get Started', ar: 'ابدأ الآن', hi: 'शुरू करें', ur: 'شروع کریں', tr: 'Başla', ms: 'Mulakan', id: 'Mulai', fr: 'Commencer', so: 'Bilow'
  },
  'welcome.next': {
    en: 'Next', ar: 'التالي', hi: 'अगला', ur: 'اگला', tr: 'Sonraki', ms: 'Seterusnya', id: 'Selanjutnya', fr: 'Suivant', so: 'Xiga'
  },

  // --- Common General ---
  'general.close': {
    en: 'Close', ar: 'إغلاق', hi: 'बंद करें', ur: 'بند کریں', tr: 'Kapat', ms: 'Tutup', id: 'Tutup', fr: 'Fermer', so: 'Xidh'
  },
  'general.save': {
    en: 'Save', ar: 'حفظ', hi: 'سहेजें', ur: 'محفوظ کریں', tr: 'Kaydet', ms: 'Simpan', id: 'Simpan', fr: 'Enregistrer', so: 'Keydi'
  },
  'general.cancel': {
    en: 'Cancel', ar: 'إلغاء', hi: 'رزد کریں', ur: 'منسوخ کریں', tr: 'İptal', ms: 'Batal', id: 'Batal', fr: 'Annuler', so: 'Ka noqo'
  },
  'general.confirm': {
    en: 'Confirm', ar: 'تأكيد', hi: 'पुष्टि करें', ur: 'تصدیق کریں', tr: 'Onayla', ms: 'Sahkan', id: 'Konfirmasi', fr: 'Confirmer', so: 'Xaqiiji'
  },
  'general.edit': {
    en: 'Edit', ar: 'تعديل', hi: 'संपादित करें', ur: 'ترمیم کریں', tr: 'Düzenle', ms: 'Edit', id: 'Edit', fr: 'Modifier', so: 'Tifatir'
  },
  'general.days': {
    en: 'days', ar: 'أيام', hi: 'दिन', ur: 'دن', tr: 'gün', ms: 'hari', id: 'hari', fr: 'jours', so: 'maalmood'
  },
  'hadith.title': {
    en: 'Spiritual Wisdom', ar: 'الحكمة الروحية', hi: 'आध्यात्मिक ज्ञान', ur: 'روحانی حکمت', tr: 'Manevi Hikmet', ms: 'Kebijaksanaan Rohani', id: 'Hikmah Spiritual', fr: 'Sagesse spirituelle', so: 'Xikmadda Ruuxiga'
  },
  'hadith.next': {
    en: 'Next Quote', ar: 'الحكمة التالية', hi: 'अगला उद्धरण', ur: 'اگला اقتباس', tr: 'Sonraki Alıntı', ms: 'Petikan Seterusnya', id: 'Kutipan Berikutnya', fr: 'Prochaine citation', so: 'Xigta Xikmadda'
  },
  'hadith.copied': {
    en: 'Copied!', ar: 'تم النسخ!', hi: 'कॉपी हो गया!', ur: 'کاپی ہو گیا!', tr: 'Kopyalandı!', ms: 'Disalin!', id: 'Disalin!', fr: 'Copié!', so: 'La koobay!'
  },
  'counter.bpm': {
    en: 'Beads/Min', ar: 'تسبيحة/د', hi: 'मनका/मिनट', ur: 'منکا/منٹ', tr: 'Bead/Dak', ms: 'Manik/Min', id: 'Manik/Mnt', fr: 'Grains/Min', so: 'Xarig/Daqiiqo'
  },
  'counter.pace_ready': {
    en: 'Ready', ar: 'جاهز', hi: 'तैयार', ur: 'تیار', tr: 'Hazır', ms: 'Bersedia', id: 'Siap', fr: 'Prêt', so: 'Diyaar'
  },
  'counter.pace_meditative': {
    en: 'Meditative', ar: 'متأنٍّ', hi: 'ध्यानपूर्ण', ur: 'مراقبہ', tr: 'Meditasyon', ms: 'Meditatif', id: 'Meditatif', fr: 'Méditatif', so: 'Fekerka'
  },
  'counter.pace_steady': {
    en: 'Steady', ar: 'منتظم', hi: 'स्थिर', ur: 'مستحکم', tr: 'Sabit', ms: 'Mantap', id: 'Stabil', fr: 'Régulier', so: 'Xoogan'
  },
  'counter.pace_fast': {
    en: 'Fast', ar: 'سريع', hi: 'तेज़', ur: 'تیز', tr: 'Hızlı', ms: 'Laju', id: 'Cepat', fr: 'Rapide', so: 'Degdeg'
  },
};

const ALL_LANGS: Lang[] = ['en', 'ar', 'hi', 'ur', 'tr', 'ms', 'id', 'fr', 'so'];

export function t(key: string, lang: Lang): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] ?? entry['en'] ?? key;
}

export function useTranslation() {
  const language = useTasbeehStore((s) => s.language);
  const lang: Lang = (ALL_LANGS.includes(language as Lang) ? language as Lang : 'en');
  const isRTL = lang === 'ar' || lang === 'ur';
  return {
    t: (key: string) => t(key, lang),
    lang,
    isRTL,
    dir: isRTL ? 'rtl' : 'ltr',
  } as const;
}
