export const NLU_CONFIG = {
    // Fuse.js scores 0 (perfect match) to 1 (no similarity at all).
    // Lower = stricter. 0.4 is a reasonable starting point for short phrases;
    // tune this up/down once you're testing with real STT output.
    FUZZY_THRESHOLD: 0.4,
};