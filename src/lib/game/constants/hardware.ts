export interface HardwarePart {
    id: string;
    level: number;
    price: number;
    category: 'cpu' | 'video' | 'ram' | 'hdd' | 'monitor' | 'modem';
}

export const HARDWARE_COMPONENTS: Record<string, HardwarePart[]> = {
    cpu: [
        { id: "intel_386", level: 0, price: 0, category: 'cpu' },
        { id: "pentium_iii", level: 1, price: 500, category: 'cpu' },
        { id: "core_2_duo", level: 2, price: 1500, category: 'cpu' },
        { id: "core_i7_2600k", level: 3, price: 4000, category: 'cpu' },
        { id: "ryzen_9_3900x", level: 4, price: 10000, category: 'cpu' },
        { id: "threadripper_7980x", level: 5, price: 30000, category: 'cpu' },
    ],
    video: [
        { id: "vga_card", level: 0, price: 0, category: 'video' },
        { id: "geforce_2_gts", level: 1, price: 400, category: 'video' },
        { id: "geforce_8800_gtx", level: 2, price: 1200, category: 'video' },
        { id: "gtx_580", level: 3, price: 3500, category: 'video' },
        { id: "rtx_2080_ti", level: 4, price: 8000, category: 'video' },
        { id: "rtx_4090", level: 5, price: 25000, category: 'video' },
    ],
    ram: [
        { id: "4mb_ram", level: 0, price: 0, category: 'ram' },
        { id: "sdram_128mb", level: 1, price: 200, category: 'ram' },
        { id: "ddr2_2gb", level: 2, price: 800, category: 'ram' },
        { id: "ddr3_8gb", level: 3, price: 2500, category: 'ram' },
        { id: "ddr4_32gb", level: 4, price: 6000, category: 'ram' },
        { id: "ddr5_128gb", level: 5, price: 15000, category: 'ram' },
    ],
    hdd: [
        { id: "170mb_hdd", level: 0, price: 0, category: 'hdd' },
        { id: "hdd_20gb", level: 1, price: 150, category: 'hdd' },
        { id: "hdd_250gb", level: 2, price: 500, category: 'hdd' },
        { id: "hdd_1tb", level: 3, price: 1800, category: 'hdd' },
        { id: "ssd_2tb_nvme", level: 4, price: 5000, category: 'hdd' },
        { id: "ssd_8tb_nvme", level: 5, price: 12000, category: 'hdd' },
    ],
    monitor: [
        { id: "monitor_basic", level: 0, price: 0, category: 'monitor' },
        { id: "crt_17_inch", level: 1, price: 300, category: 'monitor' },
        { id: "lcd_20_inch", level: 2, price: 1000, category: 'monitor' },
        { id: "led_24_inch", level: 3, price: 3000, category: 'monitor' },
        { id: "ips_27_4k", level: 4, price: 7000, category: 'monitor' },
        { id: "oled_32_240hz", level: 5, price: 18000, category: 'monitor' },
    ],
    modem: [
        { id: "modem_none", level: 0, price: 0, category: 'modem' },
        { id: "modem_56k", level: 1, price: 100, category: 'modem' },
        { id: "modem_isdn", level: 2, price: 400, category: 'modem' },
        { id: "modem_dsl", level: 3, price: 1500, category: 'modem' },
        { id: "modem_vdsl", level: 4, price: 4000, category: 'modem' },
        { id: "modem_fiber", level: 5, price: 10000, category: 'modem' },
    ]
};

export const HARDWARE_LEVELS: Record<string, number> = Object.values(HARDWARE_COMPONENTS).flat().reduce((acc, part) => {
    acc[part.id] = part.level;
    return acc;
}, {} as Record<string, number>);
