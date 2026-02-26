import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAEreFktmUV1ZjMZK0M3_jNuBVNoIIz_sA",
    authDomain: "ifis-850b5.firebaseapp.com",
    projectId: "ifis-850b5",
    storageBucket: "ifis-850b5.firebasestorage.app",
    messagingSenderId: "1000757744732",
    appId: "1:1000757744732:web:f9c4097aacda7a7b194299",
    databaseURL: "https://ifis-850b5-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const newChallenges = {
    global1: {
        title: "1 Million Salawat for the Prophet ﷺ",
        description: "Let us unite as an Ummah to send 1,000,000 Salawat upon our beloved Prophet Muhammad ﷺ this week. Every single Salawat brings immense blessings and draws us closer to him on the Day of Judgement.",
        target: 1000000,
        currentProgress: 0,
        dhikrId: "salawat",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
    },
    global2: {
        title: "500,000 Istighfar Mountain",
        description: "Seek immense forgiveness. \"Whoever relies on Istighfar, Allah provides a way out for them from every difficulty.\"",
        target: 500000,
        currentProgress: 0,
        dhikrId: "astaghfirullah",
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true
    }
};

async function resetChallenges() {
    const challengesRef = ref(database, 'challenges');
    console.log("Setting real challenges to 0...");
    await set(challengesRef, newChallenges);
    console.log("Success! Old demo data removed.");
    process.exit(0);
}

resetChallenges().catch(console.error);
