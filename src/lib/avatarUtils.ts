export function getMuslimAvatarUrl(seed: string): string {
    if (!seed) return '';

    // Create a stable hash from the seed to determine gender/style
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const isFemale = hash % 2 === 0;

    const base = 'https://api.dicebear.com/7.x/avataaars/svg';
    const params = new URLSearchParams({
        seed,
        // Soft pastel background colors for a premium feel
        backgroundColor: 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
        style: 'circle',
        clothing: 'blazerAndShirt,blazerAndSweater,collarAndSweater,graphicShirt,hoodie,overall,shirtCrewNeck,shirtScoopNeck,shirtVNeck'
    });

    if (isFemale) {
        // Female: Hijab styles
        params.append('top', 'hijab');
        params.append('clothesColor', 'ff5c5c,ffb8b8,c0aede,d1d4f9,ffd260,9e90c5');
        params.append('clothingGraphic', 'none');
    } else {
        // Male: Turban, Kufi (skullCap), or short hair with potential beards
        const maleTops = ['turban', 'skullCap', 'shortHairShortFlat'];
        const maleFacialHairs = ['beardMedium', 'beardLight', 'beardMajestic', 'blank'];
        
        params.append('top', maleTops[hash % maleTops.length]);
        params.append('facialHair', maleFacialHairs[hash % maleFacialHairs.length]);
    }

    return `${base}?${params.toString()}`;
}
