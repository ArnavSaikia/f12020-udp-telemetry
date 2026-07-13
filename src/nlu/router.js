import Fuse from 'fuse.js';
import { PHRASES } from './phrases.js';
import { NLU_CONFIG } from '../../config/nluConfig.js';

// Flatten { intent: [phrases] } into a single searchable list:
// [{ intent: 'GET_FUEL', phrase: 'how is my fuel' }, ...]
const searchIndex = Object.entries(PHRASES).flatMap(([intent, phrases]) =>
    phrases.map((phrase) => ({ intent, phrase }))
);

const fuse = new Fuse(searchIndex, {
    keys: ['phrase'],
    includeScore: true,
    threshold: NLU_CONFIG.FUZZY_THRESHOLD,
});

// Takes raw driver text, returns { intent, matchedPhrase, score } or null
// if nothing scored well enough to trust.
export function routeText(text) {
    const results = fuse.search(text);
    if (results.length === 0) return null;

    const best = results[0];
    // Fuse's internal `threshold` doesn't strictly cap the reported score
    // (field-length normalization can push it above that number), so we
    // enforce our own hard cutoff here to avoid low-confidence matches slipping through.
    // if (best.score > NLU_CONFIG.FUZZY_THRESHOLD) return null;
    
    return {
        intent: best.item.intent,
        matchedPhrase: best.item.phrase,
        score: best.score,
    };
}