type CheatType = 'health' | 'mood';

class CheatManager {
    private activeCheats: Set<CheatType> = new Set();
    private listeners: ((cheat: CheatType, active: boolean) => void)[] = [];

    toggleCheat(cheat: CheatType): boolean {
        const isActive = this.activeCheats.has(cheat);
        if (isActive) {
            this.activeCheats.delete(cheat);
        } else {
            this.activeCheats.add(cheat);
        }

        const nowActive = !isActive;
        this.notify(cheat, nowActive);
        return nowActive;
    }

    isCheatActive(cheat: CheatType): boolean {
        return this.activeCheats.has(cheat);
    }

    onToggle(listener: (cheat: CheatType, active: boolean) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify(cheat: CheatType, active: boolean) {
        this.listeners.forEach(l => l(cheat, active));
    }
}

export const cheatManager = new CheatManager();
