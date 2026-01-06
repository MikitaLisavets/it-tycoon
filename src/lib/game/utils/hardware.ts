import { HARDWARE_LEVELS } from '../constants/hardware';
import { GameState } from '../types';

export function calculateComputerLevel(computer: GameState['computer']): number {
    const categories: (keyof GameState['computer'])[] = ['cpu', 'hdd', 'ram', 'monitor', 'video', 'modem'];

    let minLevel = Infinity;

    for (const cat of categories) {
        const partId = computer[cat];
        const level = HARDWARE_LEVELS[partId] || 0;
        if (level < minLevel) {
            minLevel = level;
        }
    }

    return minLevel === Infinity ? 0 : minLevel;
}
