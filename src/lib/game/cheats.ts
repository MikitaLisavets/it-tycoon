class CheatManager {
    private activeCheats: Set<string> = new Set();
    private listeners: ((cheat: string, active: boolean) => void)[] = [];

    toggleCheat(cheat: string): boolean {
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

    isCheatActive(cheat: string): boolean {
        return this.activeCheats.has(cheat);
    }

    reset() {
        this.activeCheats.clear();
    }

    onToggle(listener: (cheat: string, active: boolean) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify(cheat: string, active: boolean) {
        this.listeners.forEach(l => l(cheat, active));
    }
}

export const cheatManager = new CheatManager();

export const CHEATS = {
    G0D: 'G0D',
};
