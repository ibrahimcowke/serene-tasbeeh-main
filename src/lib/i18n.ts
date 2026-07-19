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
  'settings.visual_theme': {
    en: 'Visual Theme', ar: 'سمة المظهر', hi: 'दृश्य थीम', ur: 'بصری تھیم', tr: 'Görsel Tema', ms: 'Tema Visual', id: 'Tema Visual', fr: 'Thème visuel', so: 'Qaabka Muuqda'
  },
  'settings.auto_theme_desc': {
    en: 'Switch light/dark based on time', ar: 'تبديل الفاتح/الداكن حسب الوقت', hi: 'समय के आधार पर लाइट/डार्क स्विच करें', ur: 'وقت کے مطابق لائٹ/ڈارک تبدیل کریں', tr: 'Saate göre açık/koyu geçişi yap', ms: 'Tukar terang/gelap mengikut masa', id: 'Ganti terang/gelap berdasarkan waktu', fr: 'Changer clair/sombre selon l\'heure', so: 'U kala beddel iftiinka/madowga wakhtiga'
  },
  'settings.dawn_dusk_schedule': {
    en: 'Dawn/Dusk Theme Schedule', ar: 'جدول سمة الفجر/الغروب', hi: 'भोर/सांझ थीम शेड्यूल', ur: 'فجر/مغرب تھیم کا شیڈول', tr: 'Şafak/Gün Batımı Tema Programı', ms: 'Jadual Tema Subuh/Senja', id: 'Jadwal Tema Fajar/Senja', fr: 'Calendrier aube/crépuscule', so: 'Jadwalka Qaabka Waaberiga/Makhribka'
  },
  'settings.dawn_dusk_desc': {
    en: 'Light at Fajr, Midnight at Maghrib', ar: 'فاتح عند الفجر، داكن عند المغرب', hi: 'फ़ज्र पर लाइट, मग्रिब पर मिडनाइट', ur: 'فجر کے وقت لائٹ، مغرب के वक्त मडनाइट', tr: 'Fecr\'de açık, Akşam\'da gece yarısı', ms: 'Terang ketika Subuh, Gelap ketika Maghrib', id: 'Terang saat Fajar, Gelap saat Maghrib', fr: 'Clair au Fajr, sombre au Maghrib', so: 'Iftiin Fajr-ka, Madow Maghrib-ka'
  },
  'settings.typography': {
    en: 'Typography', ar: 'الخطوط', hi: 'टाइपोग्राफी', ur: 'خطاطی', tr: 'Tipografi', ms: 'Tipografi', id: 'Tipografi', fr: 'Typographie', so: 'Qoraalka'
  },
  'settings.app_font_size': {
    en: 'App Font Size', ar: 'حجم خط التطبيق', hi: 'ऐप फ़ॉन्ट आकार', ur: 'ایپ کا فونٹ سائز', tr: 'Uygulama Yazı Tipi Boyutu', ms: 'Saiz Fon Aplikasi', id: 'Ukuran Font Aplikasi', fr: 'Taille de police de l\'app', so: 'Xajmiga Farta App-ka'
  },
  'settings.dhikr_font_size': {
    en: 'Dhikr Text Size', ar: 'حجم خط الذكر', hi: 'ज़िक्र फ़ॉन्ट आकार', ur: 'ذکر کا فونٹ سائز', tr: 'Zikir Yazı Tipi Boyutu', ms: 'Saiz Fon Zikir', id: 'Ukuran Font Zikir', fr: 'Taille de police du Dhikr', so: 'Xajmiga Farta Xususta'
  },
  'settings.counter_digit_size': {
    en: 'Counter Digit Size', ar: 'حجم أرقام العداد', hi: 'काउंटर अंक आकार', ur: 'کاؤنٹر ہندسوں کا سائز', tr: 'Sayaç Hane Boyutu', ms: 'Saiz Digit Pembilang', id: 'Ukuran Digit Penghitung', fr: 'Taille des chiffres du compteur', so: 'Xajmiga Nambarada Tiriyaha'
  },
  'settings.size_small': {
    en: 'Small', ar: 'صغير', hi: 'छोटा', ur: 'چھوٹا', tr: 'Küçük', ms: 'Kecil', id: 'Kecil', fr: 'Petit', so: 'Yar'
  },
  'settings.size_normal': {
    en: 'Normal', ar: 'طبيعي', hi: 'सामान्य', ur: 'नारمل', tr: 'Normal', ms: 'Normal', id: 'Normal', fr: 'Normal', so: 'Dhexdhexaad'
  },
  'settings.size_large': {
    en: 'Large', ar: 'كبير', hi: 'بड़ा', ur: 'بڑا', tr: 'Büyük', ms: 'Besar', id: 'Besar', fr: 'Grand', so: 'Wayn'
  },
  'settings.size_xlarge': {
    en: 'X-Large', ar: 'كبير جداً', hi: 'बहुत बड़ा', ur: 'بہت بڑا', tr: 'Çok Büyük', ms: 'Sangat Besar', id: 'Sangat Besar', fr: 'Très grand', so: 'Aad u wayn'
  },
  'settings.counter_shape': {
    en: 'Counter Shape', ar: 'شكل العداد', hi: 'काउंटر का आकार', ur: 'کاؤنٹر کی شکل', tr: 'Sayaç Şekli', ms: 'Bentuk Pembilang', id: 'Bentuk Penghitung', fr: 'Forme du compteur', so: 'Qaabka Tiriyaha'
  },
  'settings.shape_category.essential': {
    en: 'Essential', ar: 'أساسي', hi: 'आवश्यक', ur: 'ضروری', tr: 'Temel', ms: 'Penting', id: 'Penting', fr: 'Essentiel', so: 'Muhiim'
  },
  'settings.shape_category.luminous': {
    en: 'Luminous', ar: 'مضيء', hi: 'चमकीला', ur: 'روشن', tr: 'Işıltılı', ms: 'Bercahaya', id: 'Bercahaya', fr: 'Lumineux', so: 'Iftimaya'
  },
  'settings.shape_category.modern': {
    en: 'Modern', ar: 'حديث', hi: 'आधुनिक', ur: 'جدید', tr: 'Modern', ms: 'Modern', id: 'Modern', fr: 'Moderne', so: 'Cusub'
  },
  'settings.shape_category.objects3d': {
    en: 'Objects & 3D', ar: 'أشكال ثلاثية الأبعاد', hi: 'वस्तुएं और 3D', ur: 'اشیاء اور 3D', tr: 'Nesneler & 3D', ms: 'Objek & 3D', id: 'Objek & 3D', fr: 'Objets & 3D', so: 'Waxyaabo & 3D'
  },
  'settings.shape_category.techabstract': {
    en: 'Tech & Abstract', ar: 'تقني ومجرد', hi: 'تقني ومجرد', ur: 'ٹیک اور خلاصہ', tr: 'Teknoloji & Soyut', ms: 'Teknologi & Abstrak', id: 'Teknologi & Abstrak', fr: 'Technique & Abstrait', so: 'Farsamo & Khayaali'
  },
  'settings.notifications': {
    en: 'Notifications', ar: 'الإشعارات', hi: 'सूचनाएं', ur: 'نوٹیفیکیشنز', tr: 'Bildirimler', ms: 'Pemberitahuan', id: 'Notifikasi', fr: 'Notifications', so: 'Ogeysiisyada'
  },
  'settings.reminders_alerts': {
    en: 'Reminders & Alerts', ar: 'التذكيرات والتنبيهات', hi: 'अनुस्मारक और अलर्ट', ur: 'یاد دہانی اور الرٹس', tr: 'Hatırlatıcılar & Uyarılar', ms: 'Peringatan & Isyarat', id: 'Pengingat & Peringatan', fr: 'Rappels & Alertes', so: 'Xusuusinta & Digniinta'
  },
  'settings.reminders_desc': {
    en: 'Schedule your dhikr sessions', ar: 'جدول جلسات الذكر الخاصة بك', hi: 'अपने ज़िक्र सत्रों को शेड्यूल करें', ur: 'اپنے ذکر کے سیشنز کو شیڈول کریں', tr: 'Zikir oturumlarınızı planlayın', ms: 'Jadualkan sesi zikir anda', id: 'Jadwalkan sesi zikir Anda', fr: 'Planifiez vos sessions de dhikr', so: 'Jadwaleyso fasaladaada xususta'
  },
  'settings.interaction': {
    en: 'Interaction', ar: 'التفاعل', hi: 'पारस्परिक क्रिया', ur: 'تعامل', tr: 'Etkileşim', ms: 'Interaksi', id: 'Interaksi', fr: 'Interaction', so: 'Wada-shaqaynta'
  },
  'settings.haptic_feedback': {
    en: 'Haptic feedback', ar: 'الاهتزاز عند اللمس', hi: 'हैप्टिक फीडबैक', ur: 'ہیپٹک فیڈبیک', tr: 'Dokunsal geri bildirim', ms: 'Maklum balas haptik', id: 'Umpan balik haptic', fr: 'Retour haptique', so: 'Gariirka dareenka'
  },
  'settings.haptic_desc': {
    en: 'Vibrate on tap', ar: 'الاهتزاز عند النقر', hi: 'टैप करने पर कंपन', ur: 'ٹیپ پر وائبریٹ', tr: 'Dokunulduğunda titret', ms: 'Bergetar apabila diketik', id: 'Bergetar saat diketuk', fr: 'Vibrer au toucher', so: 'Gariir marka la taabto'
  },
  'settings.sound_effects': {
    en: 'Sound effects', ar: 'المؤثرات الصوتية', hi: 'ध्वनि प्रभाव', ur: 'آواز کے اثرات', tr: 'Ses efektleri', ms: 'Kesan bunyi', id: 'Efek suara', fr: 'Effets sonores', so: 'Saamaynta codka'
  },
  'settings.sound_desc': {
    en: 'Play sound on tap', ar: 'تشغيل الصوت عند النقر', hi: 'टैप करने पर ध्वनि बजाएं', ur: 'ٹیپ پر آواز چلائیں', tr: 'Dokunulduğunda ses çal', ms: 'Mainkan bunyi apabila diketik', id: 'Mainkan suara saat diketuk', fr: 'Jouer un son au toucher', so: 'Daar codka marka la taabto'
  },
  'settings.shake_to_reset': {
    en: 'Shake to Reset', ar: 'هز للإعادة', hi: 'हिलाकर रीसेट', ur: 'ہلائیں تو ری سيٹ', tr: 'Sıfırlamak için Salla', ms: 'Goncang untuk Tetap Semula', id: 'Kocok untuk Reset', fr: 'Secouer pour réinitialiser', so: 'Garaac si aad dib ugu dejiso'
  },
  'settings.shake_desc': {
    en: 'Shake device to reset', ar: 'هز الهاتف لإعادة العداد', hi: 'रीसेट करने के लिए डिवाइस हिलाएं', ur: 'ری سیٹ کرنے کے لیے آلہ ہلائیں', tr: 'Sıfırlamak için cihazı salla', ms: 'Goncang peranti untuk menetap semula', id: 'Kocok perangkat untuk mereset', fr: 'Secouer l\'appareil pour réinitialiser', so: 'Rux qalabka si aad u dejiso'
  },
  'settings.stay_awake': {
    en: 'Stay Awake', ar: 'إبقاء الشاشة مضاءة', hi: 'स्क्रीन चालू रखें', ur: 'اسکرین آن رکھیں', tr: 'Ekranı Açık Tut', ms: 'Pastikan Skrin Menyala', id: 'Jaga Layar Tetap Aktif', fr: 'Garder l\'écran allumé', so: 'Shaashada ha demin'
  },
  'settings.stay_awake_desc': {
    en: 'Keep screen on during sessions', ar: 'إبقاء الشاشة مفعلة أثناء الجلسة', hi: 'सत्रों के दौरान स्क्रीन चालू रखें', ur: 'سیشنز के दौरान इसक्रिन आन रखें', tr: 'Oturumlar sırasında ekranı açık tut', ms: 'Pastikan skrin menyala semasa sesi', id: 'Jaga layar tetap menyala selama sesi', fr: 'Garder l\'écran allumé pendant les sessions', so: 'Shaashada daar inta fasalku socdo'
  },
  'settings.pocket_mode': {
    en: 'Pocket Mode', ar: 'وضع الجيب', hi: 'पॉकेट मोड', ur: 'پاکٹ موڈ', tr: 'Cep Modu', ms: 'Mod Poket', id: 'Mode Saku', fr: 'Mode poche', so: 'Habka Jeebka'
  },
  'settings.pocket_mode_desc': {
    en: 'Turn screen black to save battery', ar: 'إطفاء الشاشة لتوفير البطارية', hi: 'बैटरी बचाने के लिए स्क्रीन काली करें', ur: 'بیٹری بچانے کے لیے اسکرین کالی کریں', tr: 'Pil tasarrufu için ekranı karart', ms: 'Gelapkan skrin untuk jimat bateri', id: 'Ubah layar menjadi hitam untuk hemat bateri', fr: 'Éteindre l\'écran pour économiser la batterie', so: 'Shaashada madoweey si aad batteri u badbaadiso'
  },
  'settings.volume_buttons_desc': {
    en: 'Use physical keys to count', ar: 'استخدم أزرار الصوت الفعلية للعد', hi: 'गिनने के लिए भौतिक कुंजियों का उपयोग करें', ur: 'گنتی کے لیے جسمانی بٹن استعمال کریں', tr: 'Saymak için fiziksel tuşları kullan', ms: 'Gunakan butang fizikal untuk mengira', id: 'Gunakan tombol fisik untuk menghitung', fr: 'Utiliser les touches physiques pour compter', so: 'Isticmaal badhamada qalabka si aad u tiriso'
  },
  'settings.data_management': {
    en: 'Data Management', ar: 'إدارة البيانات', hi: 'डेटा प्रबंधन', ur: 'ڈیٹا مینजमेंट', tr: 'Veri Yönetimi', ms: 'Pengurusan Data', id: 'Pengelolaan Data', fr: 'Gestion des données', so: 'Maamulka Xogta'
  },
  'settings.cloud_sync': {
    en: 'Cloud Sync & Security', ar: 'مزامنة السحاب والأمان', hi: 'क्लाउड सिंक और सुरक्षा', ur: 'کلاؤڈ سنک اور سیکیورٹی', tr: 'Bulut Senkronizasyonu & Güvenlik', ms: 'Penyelarasan Awan & Keselamatan', id: 'Sinkronisasi Awan & Keamanan', fr: 'Sync nuage & Sécurité', so: 'Isku-naxnaanta Cloud-ka'
  },
  'settings.cloud_sync_desc': {
    en: 'Sign in to backup your data securely', ar: 'سجل الدخول لنسخ بياناتك احتياطيًا بأمان', hi: 'अपने डेटा को सुरक्षित रूप से बैकअप करने के लिए साइन इन करें', ur: 'اپنا ڈیٹا محفوظ طریقے سے بیک اپ کرنے کے لیے سائن ان کریں', tr: 'Verilerinizi güvenli bir şekilde yedeklemek için giriş yapın', ms: 'Log masuk untuk sandarkan data anda secara selamat', id: 'Masuk untuk mencadangkan data Anda dengan aman', fr: 'Connectez-vous pour sauvegarder vos données en toute sécurité', so: 'Gal si aad u kaydiso xogtaada si badbaado leh'
  },
  'settings.clear_data': {
    en: 'Clear All Data', ar: 'مسح جميع البيانات', hi: 'सभी डेटा साफ़ करें', ur: 'تمام ڈیٹا صاف کریں', tr: 'Tüm Verileri Temizle', ms: 'Padam Semua Data', id: 'Hapus Semua Data', fr: 'Effacer toutes les données', so: 'Nadiifi Dhammaan Xogta'
  },
  'settings.clear_data_desc': {
    en: 'Permanently delete all records', ar: 'حذف جميع السجلات نهائيًا', hi: 'सभी रिकॉर्ड स्थायी रूप से हटाएं', ur: 'تمام ریکارڈز مستقل طور پر حذف کریں', tr: 'Tüm kayıtları kalıcı olarak sil', ms: 'Padam semua rekod secara kekal', id: 'Hapus semua catatan secara permanen', fr: 'Supprimer définitivement tous les enregistrements', so: 'Tirtir dhammaan xogta si joogto ah'
  },
  'settings.clear_confirm_title': {
    en: 'Are you absolutely sure?', ar: 'هل أنت متأكد تمامًا؟', hi: 'क्या आप पूरी तरह से आश्वस्त हैं?', ur: 'کیا آپ کو پورا یقین ہے؟', tr: 'Kullanıcı silinsin mi?', ms: 'Adakah anda benar-benar pasti?', id: 'Apakah Anda benar-benar yakin?', fr: 'Êtes-vous absolument sûr ?', so: 'Ma xaqiiqsadbaa?'
  },
  'settings.clear_confirm_desc': {
    en: 'This action cannot be undone. This will permanently delete your entire dhikr history, routines, and reset all settings to default.', ar: 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف سجل الأذكار والروتين بالكامل وإعادة ضبط الإعدادات.', hi: 'यह कार्रवाई पूर्ववत नहीं की जा सकती। यह आपके संपूर्ण ज़िक्र इतिहास, दिनचर्या को स्थायी रूप से हटा देगा और सभी सेटिंग्स को डिफ़ॉल्ट पर रीसेट कर देगा।', ur: 'یہ عمل واپس نہیں لیا جا سکتا۔ یہ آپ کے ذکر کی پوری تاریخ، روٹینز کو مستقل طور پر حذف کر دے گا اور تمام ترتیبات کو دوبارہ ترتیب دے گا۔', tr: 'Bu işlem geri alınamaz. Bu, tüm zikir geçmişinizi, rutinlerinizi kalıcı olarak silecek ve tüm ayarları varsayılana sıfırlayacaktır.', ms: 'Tindakan ini tidak boleh diundur. Ini akan memadamkan seluruh sejarah zikir, rutin anda secara kekal dan menetapkan semula semua tetapan.', id: 'Tindakan ini tidak dapat dibatalkan. Ini akan menghapus seluruh riwayat zikir, rutinitas Anda secara permanen dan mereset semua pengaturan.', fr: 'Cette action est irréversible. Cela supprimera définitivement tout votre historique de dhikr, vos routines et réinitialisera tous les paramètres par défaut.', so: 'Tallaabadan dib looma soo celin karo. Tani waxay tirtiri doontaa dhammaan taariikhdaada xususta, caadooyinkaaga oo waxay dib u dejin doontaa dhammaan settings-ka.'
  },
  'settings.clear_confirm_action': {
    en: 'Delete Everything', ar: 'حذف كل شيء', hi: 'सब कुछ हटाएं', ur: 'سب کچھ حذف کریں', tr: 'Her Şeyi Sil', ms: 'Padam Semua', id: 'Hapus Semua', fr: 'Tout supprimer', so: 'Tirtir Dhammaan'
  },
  'settings.developed_by': {
en: 'Developed by Ibrahim Cowke', ar: 'تطوير إبراهيم عوكى', hi: 'इब्राहिम काउके द्वारा विकसित', ur: 'ابراہیم عوکے کا تیار کردہ', tr: 'Ibrahim Cowke tarafından geliştirildi', ms: 'Dibangunkan oleh Ibrahim Cowke', id: 'Dikembangkan oleh Ibrahim Cowke', fr: 'Développé par Ibrahim Cowke', so: 'Waxaa ikhtiraacay Ibrahim Cowke'
  },
  'settings.visit_portfolio': {
    en: 'Visit Portfolio', ar: 'زيارة موقع المطور', hi: 'पोर्टफोलियो पर जाएं', ur: 'پورٹ فولیو دیکھیں', tr: 'Portföyü Ziyaret Et', ms: 'Layari Portfolio', id: 'Kunjungi Portofolio', fr: 'Visiter le portfolio', so: 'Booqo Portfolio-ga'
  },
  'settings.privacy_policy': {
    en: 'Privacy Policy', ar: 'سياسة الخصوصية', hi: 'गोपनीयता नीति', ur: 'رازداری की پالیسی', tr: 'Gizlilik Politikası', ms: 'Dasar Privasi', id: 'Kebijakan Privasi', fr: 'Politique de confidentialité', so: 'Shuruucda Qaanuunka'
  },
  'settings.read_privacy': {
    en: 'Read Privacy Policy', ar: 'قراءة سياسة الخصوصية', hi: 'गोपनीयता नीति पढ़ें', ur: 'رازداری کی پالیسی پڑھیں', tr: 'Gizlilik Politikasını Oku', ms: 'Baca Dasar Privasi', id: 'Baca Kebijakan Privasi', fr: 'Lire la politique de confidentialité', so: 'Akhri Shuruucda Qaanuunka'
  },
  'settings.account': {
    en: 'Account', ar: 'الحساب', hi: 'खाता', ur: 'اکاؤنٹ', tr: 'Hesap', ms: 'Akaun', id: 'Akun', fr: 'Compte', so: 'Koontada'
  },
  'settings.export_backup': {
    en: 'Export backup', ar: 'تصدير نسخة احتياطية', hi: 'बैकअप निर्यात करें', ur: 'بیک اپ برآمد کریں', tr: 'Yedeği dışa aktar', ms: 'Eksport sandaran', id: 'Ekspor cadangan', fr: 'Exporter la sauvegarde', so: 'Dhoofinta keydka'
  },
  'settings.export_desc': {
    en: 'Save data to a JSON file', ar: 'حفظ البيانات في ملف JSON', hi: 'डेटा को JSON फ़ाइल में सहेजें', ur: 'ڈیٹا को JSON फाइल में सुरक्षित करें', tr: 'Verileri bir JSON dosyasına kaydet', ms: 'Simpan data ke fail JSON', id: 'Simpan data ke file JSON', fr: 'Enregistrer les données dans un fichier JSON', so: 'Ku keydi xogta JSON file'
  },
  'settings.import_backup': {
    en: 'Import backup', ar: 'استيراد نسخة احتياطية', hi: 'बैकअप आयात करें', ur: 'بیک اپ درآمد کریں', tr: 'Yedeği içe aktar', ms: 'Import sandaran', id: 'Impor cadangan', fr: 'Importer la sauvegarde', so: 'Soo keenista keydka'
  },
  'settings.import_desc': {
    en: 'Restore from a JSON file', ar: 'استعادة البيانات من ملف JSON', hi: 'JSON फ़ाइल से पुनर्स्थापित करें', ur: 'JSON फाइल से बहाल करें', tr: 'Bir JSON dosyasından geri yükle', ms: 'Pulihkan dari fail JSON', id: 'Pulihkan dari file JSON', fr: 'Restaurer à partir d\'un fichier JSON', so: 'Dib u soo celi xogta JSON file'
  },
  'settings.reset_data': {
    en: 'Reset All Data', ar: 'إعادة ضبط كل البيانات', hi: 'सभी डेटा रीसेट करें', ur: 'تمام ڈیٹا ری سیٹ کریں', tr: 'Tüm Verileri Sıfırla', ms: 'Tetap Semula Semua Data', id: 'Reset Semua Data', fr: 'Réinitialiser toutes les données', so: 'Dib u wada deji xogta'
  },
  'settings.reset_desc': {
    en: 'Permanently delete all progress', ar: 'حذف جميع التقدم نهائيًا', hi: 'सभी प्रगति स्थायी रूप से हटाएं', ur: 'تمام پیشرفت مستقل طور पर حذف کریں', tr: 'Tüm ilerlemeyi kalıcı olarak sil', ms: 'Padam semua kemajuan secara kekal', id: 'Hapus semua kemajuan secara permanen', fr: 'Supprimer définitivement toute progression', so: 'Tirtir dhammaan horumarka si joogto ah'
  },
  'settings.reset_confirm_title': {
    en: 'Are you sure?', ar: 'هل أنت متأكد؟', hi: 'क्या आपको यकीन है?', ur: 'کیا آپ को यकीन है؟', tr: 'Emin misiniz?', ms: 'Adakah anda pasti?', id: 'Apakah Anda yakin?', fr: 'Êtes-vous sûr ?', so: 'Ma hubtaa?'
  },
  'settings.reset_confirm_desc': {
    en: 'This will wipe all counts, streaks, and custom settings.', ar: 'سيؤدي هذا إلى مسح العداد والتتابع والإعدادات المخصصة.', hi: 'इससे सभी गणनाएं, धाराएं और कस्टम सेटिंग्स मिट जाएंगी।', ur: 'اس سے تمام گنتی، سلسلے اور اپنی مرضی کے مطابق ترتیبات صاف ہو جائیں گی۔', tr: 'Bu, tüm sayımları, serileri ve özel ayarları silecektir.', ms: 'Ini akan menyapu semua kiraan, jujukan, dan tetapan tersuai.', id: 'Ini akan menghapus semua hitungan, beruntun, dan pengaturan khusus.', fr: 'Cela effacera tous les comptes, séries et paramètres personnalisés.', so: 'Tani waxay tirtiri doontaa dhammaan tirsiyada, caadooyinka, iyo settings-ka gaarka ah.'
  },
  'settings.reset_confirm_action': {
    en: 'Reset Everything', ar: 'إعادة ضبط كل شيء', hi: 'सब कुछ रीसेट करें', ur: 'سب कुछ रीसेट करें', tr: 'Her Şeyi Sıfırla', ms: 'Tetap Semula Semua', id: 'Reset Semua', fr: 'Tout réinitialiser', so: 'Dib u deji Dhammaan'
  },

  // --- Themes & Descriptions ---
  'theme.light.label': { en: 'Light', ar: 'فاتح', hi: 'लाइट', ur: 'لائٹ', tr: 'Açık', ms: 'Terang', id: 'Terang', fr: 'Clair', so: 'Iftiin' },
  'theme.light.desc': { en: 'Warm and calm', ar: 'دافئ وهادئ', hi: 'गर्म और शांत', ur: 'گرم اور پرسكين', tr: 'Sıcak ve sakin', ms: 'Suam & tenang', id: 'Hangat & tenang', fr: 'Chaud et calme', so: 'Diiran oo degan' },
  'theme.theme-nord-deep.label': { en: 'Nord Deep', ar: 'نورد العميق', hi: 'नॉर्ड डीप', ur: 'نورڈ ڈیپ', tr: 'Nord Derin', ms: 'Nord Deep', id: 'Nord Deep', fr: 'Nord Profond', so: 'Nord Wayn' },
  'theme.theme-nord-deep.desc': { en: 'Nordic Frost', ar: 'الصقيع الإسكندنافي', hi: 'नॉर्डिक फ्रॉस्ट', ur: 'نورڈک فراسٹ', tr: 'Kuzey Ayazı', ms: 'Frost Nordik', id: 'Frost Nordik', fr: 'Givre Nordique', so: 'Barafka Nord-ka' },
  'theme.theme-nord-midnight.label': { en: 'Nord Midnight', ar: 'نورد منتصف الليل', hi: 'नॉर्ड मिडनाइट', ur: 'نورڈ مڈنائٹ', tr: 'Nord Gece Yarısı', ms: 'Nord Tengah Malam', id: 'Nord Tengah Malam', fr: 'Nord Minuit', so: 'Nord Saq-dhexe' },
  'theme.theme-nord-midnight.desc': { en: 'Deep Navy Aurora', ar: 'شفق قطبي بحري عميق', hi: 'गहरा नौसेना ऑरोरा', ur: 'گہرا نیوی اورورا', tr: 'Derin Lacivert Kutup Işıkları', ms: 'Aurora Navy Mendalam', id: 'Aurora Navy Mendalam', fr: 'Aurore Marine Profonde', so: 'Iftiinka Navy Wayn' },
  'theme.theme-blue-white.label': { en: 'Blue Breeze', ar: 'نسيم أزرق', hi: 'नीली हवा', ur: 'نیلی ہوا', tr: 'Mavi Meltem', ms: 'Bayu Biru', id: 'Semilir Biru', fr: 'Brise Bleue', so: 'Dabayl Buluug ah' },
  'theme.theme-blue-white.desc': { en: 'Sky blue & pure white', ar: 'سماء زرقاء وأبيض ناصع', hi: 'आकाश नीला और शुद्ध सफेद', ur: 'آسمان نیلا اور خالص سفید', tr: 'Gökyüzü mavisi & saf beyaz', ms: 'Biru langit & putih tulen', id: 'Biru langit & putih murni', fr: 'Bleu ciel & blanc pur', so: 'Buluug cirka & caddaan saafi ah' },
  'theme.theme-cyber-twilight.label': { en: 'Cyber Twilight', ar: 'سايبر الشفق', hi: '사이बर ट्वाइलाइट', ur: 'سائبر ٹوائلائٹ', tr: 'Siber Alacakaranlık', ms: 'Cyber Twilight', id: 'Cyber Twilight', fr: 'Crépuscule Cyber', so: 'Cyber Twilight' },
  'theme.theme-cyber-twilight.desc': { en: 'Synthwave Eclipse', ar: 'كسوف سينثويف', hi: 'सिंथवेव ग्रहण', ur: 'سنتھ ویو گرہن', tr: 'Synthwave Tutulması', ms: 'Gerhana Synthwave', id: 'Gerhana Synthwave', fr: 'Éclipse Synthwave', so: 'Synthwave Eclipse' },
  'theme.theme-dracula-evolved.label': { en: 'Dracula Evolved', ar: 'دراكولا المطور', hi: 'د्रेकुला इवॉल्व्ड', ur: 'ڈریکولا ایوولود', tr: 'Gelişmiş Dracula', ms: 'Dracula Evolved', id: 'Dracula Evolved', fr: 'Dracula Évolué', so: 'Dracula Evolved' },

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
  'niyyah.set_intention': {
    en: 'Set Intention', ar: 'ضبط النية', hi: 'नियत करें', ur: 'نیت کریں', tr: 'Niyet Et', ms: 'Set Niat', id: 'Atur Niat', fr: 'Définir l\'intention', so: 'Deji Niyada'
  },
  'niyyah.intention_set': {
    en: 'Intention Set', ar: 'تم ضبط النية', hi: 'नियत सेट है', ur: 'نیت مقرر ہے', tr: 'Niyet Edildi', ms: 'Niat Ditetapkan', id: 'Niat Diatur', fr: 'Intention définie', so: 'Niyada waa la dejiyay'
  },
  'niyyah.modal_title': {
    en: 'Set Intention (Niyyah)', ar: 'ضبط النية (نيّة)', hi: 'नियत (निय्याह) सेट करें', ur: 'نیت (نیت) کریں', tr: 'Niyet Belirle (Niyyah)', ms: 'Tetapkan Niat (Niat)', id: 'Atur Niat (Niat)', fr: 'Définir l\'intention (Niyyah)', so: 'Deji Niyada (Niyyah)'
  },
  'niyyah.desc': {
    en: 'Actions are judged by intentions. Setting a Niyyah before reciting helps bring focus and spiritual mindfulness.',
    ar: 'إنما الأعمال بالنيات. يساعد ضبط النية قبل التلاوة على جلب التركيز واليقظة الروحية.',
    hi: 'कार्यों का निर्णय इरादों (नियत) से होता है। पाठ करने से पहले नियत करने से ध्यान और आध्यात्मिक जागरूकता आती है।',
    ur: 'اعمال کا دارومدار نیتوں پر ہے۔ تلاوت سے پہلے نیت کرنے سے توجہ اور روحانیت حاصل ہوتی ہے۔',
    tr: 'Ameller niyetlere göredir. Okumaya başlamadan önce niyet etmek, odaklanmayı ve manevi farkındalığı artırır.',
    ms: 'Amalan dinilai berdasarkan niat. Menetapkan niat sebelum membaca membantu membawa fokus dan kesedaran rohani.',
    id: 'Setiap amal dinilai berdasarkan niatnya. Menetapkan niat sebelum membaca membantu meningkatkan fokus dan kesadaran spiritual.',
    fr: 'Les actions sont jugées selon les intentions. Définir une Niyyah avant de réciter aide à apporter de la concentration et de la pleine conscience spirituelle.',
    so: 'Camalku wuxuu ku xiran yahay niyada. Inaad niyada dejsato inta aadan tirinta bilaabin waxay caawisaa diirada iyo xasilloonida ruuxiga ah.'
  },
  'niyyah.custom_label': {
    en: 'Custom Intention', ar: 'نية مخصصة', hi: 'कस्टम नियत', ur: 'اپنی مرضی کی نیت', tr: 'Özel Niyet', ms: 'Niat Tersuai', id: 'Niat Kustom', fr: 'Intention personnalisée', so: 'Niyad Gaar ah'
  },
  'niyyah.custom_placeholder': {
    en: "E.g., Seeking Allah's pleasure, recovery from illness, relief from hardships...",
    ar: 'مثال: نيل رضا الله، الشفاء من المرض، الفرج من الكرب...',
    hi: 'उदा. अल्लाह की रज़ा पाना, बीमारी से उबरना, कठिनाइयों से राहत...',
    ur: 'مثال: اللہ کی رضا، بیماری سے شفا، پریشانیوں سے نجات...',
    tr: 'örn. Allah rızası, hastalıktan şifa, zorluklardan kurtuluş...',
    ms: 'Contoh: Mencari keredhaan Allah, sembuh dari penyakit, kelegaan dari kesusahan...',
    id: 'Contoh: Mencari rida Allah, kesembuhan dari penyakit, kemudahan dari cobaan...',
    fr: "Ex. Rechercher le plaisir d'Allah, guérir d'une maladie, soulagement des épreuves...",
    so: 'Tusaale: Raadinta raalli ahaanshaha Alle, ka bogsashada xanuunka, fududeynta dhibaatooyinka...'
  },
  'niyyah.dedicate_label': {
    en: 'Dedicate to (Optional)', ar: 'إهداء إلى (اختياري)', hi: 'समर्पित करें (वैकल्पिक)', ur: 'نامزد کریں (اختیاری)', tr: 'İthaf Et (İsteğe Bağlı)', ms: 'Didedikasikan kepada (Pilihan)', id: 'Didedikasikan untuk (Opsional)', fr: 'Dédier à (Optionnel)', so: 'U hibee (Ikhtiyaari)'
  },
  'niyyah.dedicate_placeholder': {
    en: 'E.g., Mother, Father, My Children, Self...',
    ar: 'مثال: أمي، أبي، أطفالي، نفسي...',
    hi: 'उदा. माता, पिता, मेरे बच्चे, स्वयं...',
    ur: 'مثال: والدہ، والد، میرے بچے، اپنی ذات...',
    tr: 'örn. Annem, Babam, Çocuklarım, Kendim...',
    ms: 'Contoh: Ibu, Bapa, Anak-anak, Diri Sendiri...',
    id: 'Contoh: Ibu, Ayah, Anak-anakku, Diri Sendiri...',
    fr: 'Ex. Mère, Père, Mes enfants, Soi-même...',
    so: 'Tusaale: Hooyo, Aabo, Carruurtayda, Naftayda...'
  },
  'niyyah.save': {
    en: 'Save Intention', ar: 'حفظ النية', hi: 'नियत सहेजें', ur: 'نیت محفوظ کریں', tr: 'Niyeti Kaydet', ms: 'Simpan Niat', id: 'Simpan Niat', fr: 'Enregistrer l\'intention', so: 'Kaydi Niyada'
  },
  'niyyah.toast_success': {
    en: 'Intention (Niyyah) updated successfully.',
    ar: 'تم تحديث النية بنجاح.',
    hi: 'नियत (निय्याह) सफलतापूर्वक अपडेट हो गई है।',
    ur: 'نیت کامیابی کے ساتھ اپ ڈیٹ ہو گئی۔',
    tr: 'Niyet (Niyyah) başarıyla güncellendi.',
    ms: 'Niat (Niat) berjaya dikemas kini.',
    id: 'Niat (Niat) berhasil diperbarui.',
    fr: 'Intention (Niyyah) mise à jour avec succès.',
    so: 'Niyada waa la cusbooneysiiyay si guul leh.'
  },

  'theme.theme-espresso-dark.label': { en: 'Espresso Dark', ar: 'إسبريسو الداكن', hi: 'एस्प्रेसो डार्क', ur: 'ایسپریسو ڈارک', tr: 'Koyu Espresso', ms: 'Espresso Gelap', id: 'Espresso Gelap', fr: 'Espresso Sombre', so: 'Espresso Madow' },
  'theme.theme-espresso-dark.desc': { en: 'Café Noir', ar: 'القهوة السوداء', hi: 'कैफे नोइर', ur: 'کافی نویر', tr: 'Siyah Kahve', ms: 'Kopi Hitam', id: 'Kopi Hitam', fr: 'Café Noir', so: 'Qaxwo Madow' },
  'theme.theme-glass.label': { en: 'Glass', ar: 'زجاجي', hi: 'ग्लास', ur: 'شیشہ', tr: 'Cam', ms: 'Kaca', id: 'Kaca', fr: 'Verre', so: 'Galaas' },
  'theme.theme-glass.desc': { en: 'Pure & icy morphism', ar: 'شكل نقي وجليدي', hi: 'शुद्ध और बर्फीला', ur: 'خالص اور برفیلا', tr: 'Saf & buzlu tasarım', ms: 'Morfisme tulen & ais', id: 'Morfisme murni & es', fr: 'Morphisme pur & glacé', so: 'Nadiif oo baraf ah' },
  'theme.theme-sunset.label': { en: 'Sunset', ar: 'الغروب', hi: 'सूर्यास्त', ur: 'غروب آفتاب', tr: 'Gün Batımı', ms: 'Matahari Terbenam', id: 'Matahari Terbenam', fr: 'Coucher de soleil', so: 'Qorax dhaca' },
  'theme.theme-sunset.desc': { en: 'Warm gradients', ar: 'تدرجات دافئة', hi: 'गर्म झुकाव', ur: 'گرم درجات', tr: 'Sıcak geçişler', ms: 'Gradien suam', id: 'Gradien hangat', fr: 'Dégradés chauds', so: 'Iftiimo diiran' },
  'theme.theme-forest.label': { en: 'Forest', ar: 'الغابة', hi: 'वन', ur: 'جنگل', tr: 'Orman', ms: 'Hutan', id: 'Hutan', fr: 'Forêt', so: 'Kaynaha' },
  'theme.theme-forest.desc': { en: 'Deep nature greens', ar: 'خضار الطبيعة العميقة', hi: 'गहरी प्रकृति का हरा', ur: 'گہرے قدرتی سبز', tr: 'Derin doğa yeşili', ms: 'Hijau alam mendalam', id: 'Hijau alam mendalam', fr: 'Verts nature profonds', so: 'Cagaarka duurka' },
  'theme.theme-oled.label': { en: 'OLED', ar: 'شاشة أوليد', hi: 'OLED', ur: 'اولید', tr: 'OLED', ms: 'OLED', id: 'OLED', fr: 'OLED', so: 'OLED' },
  'theme.theme-oled.desc': { en: 'True black power saver', ar: 'أسود حقيقي لحفظ البطارية', hi: 'सच्चा ब्लैक पावर सेवर', ur: 'سچا بلیک پاور سیور', tr: 'Gerçek siyah pil tasarrufu', ms: 'Penjimat kuasa hitam sebenar', id: 'Penghemat daya hitam murni', fr: 'Économiseur d\'énergie noir pur', so: 'Madow badbaadiya batteriga' },
  'theme.theme-desert-starlight.label': { en: 'Desert Star', ar: 'نجم الصحراء', hi: 'रेगिस्तानी तारा', ur: 'صحرائی ستارہ', tr: 'Çöl Yıldızı', ms: 'Bintang Padang Pasir', id: 'Bintang Gurun', fr: 'Étoile du désert', so: 'Xiddigta Saxaraha' },
  'theme.theme-desert-starlight.desc': { en: 'Sand beige & blue', ar: 'رمل بيج وأزرق', hi: 'रेत बेज और नीला', ur: 'ریت बेज और नीला', tr: 'Kum beji & mavi', ms: 'Beige pasir & biru', id: 'Krem pasir & biru', fr: 'Sable beige & bleu', so: 'Ciid cad oo buluug ah' },

  // --- Shapes ---
  'shape.plain': { en: 'Plain', ar: 'سادة', hi: 'सादा', ur: 'سادہ', tr: 'Sade', ms: 'Biasa', id: 'Biasa', fr: 'Simple', so: 'Cad' },
  'shape.minimal': { en: 'Minimal', ar: 'بسيط', hi: 'न्यूनतम', ur: 'کم سے کم', tr: 'Minimal', ms: 'Minimal', id: 'Minimal', fr: 'Minimaliste', so: 'Yar' },
  'shape.classic': { en: 'Classic', ar: 'كلاسيكي', hi: 'क्लासिक', ur: 'کلاسک', tr: 'Klasik', ms: 'Klasik', id: 'Klasik', fr: 'Classique', so: 'Hore' },
  'shape.beads': { en: 'Beads', ar: 'خرزات', hi: 'मनके', ur: 'منکے', tr: 'Boncuklar', ms: 'Manik', id: 'Manik-manik', fr: 'Perles', so: 'Feeraha' },
  'shape.flower': { en: 'Flower', ar: 'وردة', hi: 'फूल', ur: 'پھول', tr: 'Çiçek', ms: 'Bunga', id: 'Bunga', fr: 'Fleur', so: 'Ubax' },
  'shape.waveform': { en: 'Wave', ar: 'موجة', hi: 'तरंग', ur: 'لہر', tr: 'Dalga', ms: 'Gelombang', id: 'Gelombang', fr: 'Vague', so: 'Mowjad' },
  'shape.digital': { en: 'Digit', ar: 'رقمي', hi: 'डिजिटल', ur: 'ڈیजीटल', tr: 'Dijital', ms: 'Digit', id: 'Digit', fr: 'Digital', so: 'Tirada' },
  'shape.modern-ring': { en: 'Ring', ar: 'حلقة', hi: 'रिंग', ur: 'انگوٹھی', tr: 'Halka', ms: 'Cincin', id: 'Cincin', fr: 'Anneau', so: 'Garaang' },
  'shape.ring-light': { en: 'Light Ring', ar: 'حلقة مضيئة', hi: 'लाइट रिंग', ur: 'لائت رنگ', tr: 'Işık Halkası', ms: 'Cincin Cahaya', id: 'Cincin Cahaya', fr: 'Anneau lumineux', so: 'Garaang Iftiin' },
  'shape.bead-ring': { en: 'Bead Ring', ar: 'حلقة الخرز', hi: 'मनका रिंग', ur: 'منكا رنگ', tr: 'Boncuk Halkası', ms: 'Cincin Manik', id: 'Cincin Manik', fr: 'Anneau de perles', so: 'Tasbiix Garaang' },
  'shape.halo-ring': { en: 'Halo', ar: 'هالة', hi: 'हेलो', ur: 'ہالو', tr: 'Hale', ms: 'Halo', id: 'Halo', fr: 'Halo', so: 'Halo' },
  'shape.vertical-capsules': { en: 'Capsule', ar: 'كبسولة', hi: 'कैप्सूल', ur: 'کیپسول', tr: 'Kapsül', ms: 'Kapsul', id: 'Kapsul', fr: 'Capsule', so: 'Kaabsal' },
  'shape.luminous-beads': { en: 'LumiBeads', ar: 'خرز مضيء', hi: 'चमकदार मनके', ur: 'روشن منکے', tr: 'Işıklı Boncuklar', ms: 'Manik Bercahaya', id: 'Manik Bercahaya', fr: 'Perles lumineuses', so: 'Feero Iftiin' },
  'shape.smart-ring': { en: 'Smart Ring', ar: 'حلقة ذكية', hi: 'स्मार्ट रिंग', ur: 'اسمارٹ رنگ', tr: 'Akıllı Halka', ms: 'Cincin Pintar', id: 'Cincin Pintar', fr: 'Anneau intelligent', so: 'Garaang Fariid' },
  'shape.moon-phase': { en: 'Moon', ar: 'قمر', hi: 'चंद्रमा', ur: 'چاند', tr: 'Ay', ms: 'Bulan', id: 'Bulan', fr: 'Lune', so: 'Dayax' },
  'shape.digital-watch': { en: 'Watch', ar: 'ساعة', hi: 'घड़ी', ur: 'گھड़ी', tr: 'Saat', ms: 'Jam', id: 'Jam', fr: 'Montre', so: 'Saacad' },
  'shape.tally-clicker': { en: 'Tally 3D', ar: 'عداد ثلاثي الأبعاد', hi: 'टैली 3D', ur: 'ٹیلی 3D', tr: '3D Tally', ms: 'Tally 3D', id: 'Tally 3D', fr: 'Compteur 3D', so: 'Tiriye 3D' },
  'shape.digital-tally': { en: 'Tally Digital', ar: 'عداد رقمي', hi: 'डिजिटल टैली', ur: 'ڈیجیٹل ٹیلی', tr: 'Dijital Tally', ms: 'Tally Digital', id: 'Tally Digital', fr: 'Compteur digital', so: 'Tiriye Tirada' },
  'shape.neumorph': { en: 'Neumorph', ar: 'نيومورف', hi: 'न्यूमॉर्फ', ur: 'نیومورف', tr: 'Neumorph', ms: 'Neumorph', id: 'Neumorph', fr: 'Neumorphe', so: 'Neumorph' },
  'shape.sunset-horizon': { en: 'Sunset Shape', ar: 'شكل الغروب', hi: 'सूर्यास्त आकार', ur: 'غروب آفتاب شکل', tr: 'Gün Batımı Şekli', ms: 'Bentuk Matahari Terbenam', id: 'Bentuk Matahari Terbenam', fr: 'Forme de coucher de soleil', so: 'Qaabka Qorax-dhaca' },
  'shape.crystal-orbit': { en: 'Crystal Orbit', ar: 'مدار كريستالي', hi: 'كريستال مدار', tr: 'Kristal Yörünge', ms: 'Orbit Kristal', id: 'Orbit Kristal', fr: 'Orbite de cristal', so: 'Orbit Crystal' },
  'shape.aurora-glow': { en: 'Aurora', ar: 'شفق قطبي', hi: 'ऑरोरा', ur: 'اورورا', tr: 'Kutup Işığı', ms: 'Aurora', id: 'Aurora', fr: 'Aurore', so: 'Aurora' },
  'shape.diamond-prism': { en: 'Diamond', ar: 'ألماس', hi: 'हीरा', ur: 'ہیرا', tr: 'Elmas', ms: 'Intan', id: 'Berlian', fr: 'Diamant', so: 'Dheeman' },
  'shape.golden-spiral': { en: 'Spiral', ar: 'حلزوني', hi: 'सर्पيل', ur: 'سرپل', tr: 'Spiral', ms: 'Spiral', id: 'Spiral', fr: 'Spirale', so: 'Spiral' },


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
