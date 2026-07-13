import { Intents } from './intents.js';

// Each intent maps to a handful of representative phrases a driver
// might actually say. Fuse.js will fuzzy-match the driver's text against
// ALL of these and return whichever phrase scored best — we then look up
// which intent that phrase belongs to.
export const PHRASES = {
    [Intents.GET_FUEL]: [
        'how is my fuel',
        'fuel status',
        'fuel level',
        'how much fuel do i have',
        'am i saving fuel',
    ],
    [Intents.GET_ERS]: [
        'how is my ers',
        'battery status',
        'how much battery do i have',
        'ers level',
        'energy status',
    ],
    [Intents.GET_TYRES]: [
        'how are my tyres',
        'tyre status',
        'check tyres',
        'how are my tires',
        'tyre condition',
    ],
    [Intents.GET_TYRE_TEMP]: [
        'tyre temperature',
        'tyre temps',
        'are my tyres overheating',
        'how hot are my tyres',
    ],
    [Intents.GET_DAMAGE]: [
        'car damage',
        'how is my car',
        'any damage',
        'check damage',
        'is my wing damaged',
    ],
    [Intents.GET_POSITION]: [
        'what position am i',
        'what place am i in',
        'current position',
        'where am i in the race',
    ],
    [Intents.GET_GAP_AHEAD]: [
        'gap ahead',
        'how far is the car in front',
        'gap to the car in front',
        'time to the car ahead',
    ],
    [Intents.GET_GAP_BEHIND]: [
        'gap behind',
        'how far is the car behind',
        'gap to the car behind',
        'time to the car behind',
    ],
    [Intents.GET_WEATHER]: [
        'what is the weather',
        'is it going to rain',
        'weather update',
        'weather forecast',
    ],
    [Intents.GET_DRS]: [
        'do i have drs',
        'is drs available',
        'drs status',
        'can i use drs',
    ],
    [Intents.GET_PIT_STATUS]: [
        'should i pit',
        'when should i pit',
        'pit window',
        'do i need to box',
    ],
    [Intents.GET_STRATEGY]: [
        'what is my strategy',
        'race strategy',
        'what is the plan',
        'strategy update',
    ],
    [Intents.GET_FASTEST_LAP]: [
        'who has fastest lap',
        'fastest lap',
        'what is the fastest lap',
    ],
    [Intents.GET_LAPS_LEFT]: [
        'how many laps left',
        'laps remaining',
        'how much of the race is left',
    ],
    [Intents.GET_PENALTIES]: [
        'do i have a penalty',
        'any penalties',
        'penalty status',
    ],
    [Intents.GET_SAFETY_CAR]: [
        'is the safety car out',
        'safety car status',
        'is it a vsc',
        'virtual safety car',
    ],
};