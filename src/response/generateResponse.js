import { HANDLERS } from '../handlers/registry.js';

export function handleIntent(routedResult, raceState) {
    if (!routedResult) return "Sorry, I didn't understand that.";
    const handler = HANDLERS[routedResult.intent];
    if (!handler) return "That's not something I can answer yet.";
    return handler(raceState);
}