import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
}

const BadgeBase = ({ children, color = "#F6AD55", size = 64 }: { children: React.ReactNode, color?: string, size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Stiching */}
        <path d="M32 2L4 16V36C4 50 32 62 32 62C32 62 60 50 60 36V16L32 2Z" fill={color} stroke="#2D3748" strokeWidth="2" />
        {/* Inner Border */}
        <path d="M32 6L8 18V36C8 48 32 58 32 58C32 58 56 48 56 36V18L32 6Z" fill="white" fillOpacity="0.2" stroke="#2D3748" strokeWidth="1" strokeDasharray="2 2" />
        {children}
    </svg>
);

export const FirstJobIcon = ({ size = 64 }: IconProps) => (
    <BadgeBase color="#63dde6ff" size={size}>
        <path d="M22 24V20C22 18.8954 22.8954 18 24 18H40C41.1046 18 42 18.8954 42 20V24M18 24H46V40C46 41.1046 45.1046 42 44 42H20C18.8954 42 18 41.1046 18 40V24Z" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 28H46" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" />
    </BadgeBase>
);

export const HardwareProIcon = ({ size = 64 }: IconProps) => (
    <BadgeBase color="#0c8768ff" size={size}>
        <rect x="20" y="20" width="24" height="24" rx="2" stroke="#2D3748" strokeWidth="3" />
        <path d="M24 16V20M32 16V20M40 16V20M24 44V48M32 44V48M40 44V48M16 24H20M16 32H20M16 40H20M44 24H48M44 32H48M44 40H48" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="32" r="4" fill="#2D3748" />
    </BadgeBase>
);

export const SolitaireProIcon = ({ size = 64 }: IconProps) => (
    <BadgeBase color="#F56565" size={size}>
        <rect x="22" y="20" width="20" height="28" rx="2" fill="white" stroke="#2D3748" strokeWidth="2" />
        <path d="M32 28L34 32L32 36L30 32L32 28Z" fill="#F56565" stroke="#2D3748" strokeWidth="1" />
        <text x="25" y="27" fontSize="8" fontWeight="bold" fill="#2D3748">A</text>
    </BadgeBase>
);

export const UniversityGradIcon = ({ size = 64 }: IconProps) => (
    <BadgeBase color="#9F7AEA" size={size}>
        <path d="M16 28L32 20L48 28L32 36L16 28Z" fill="#D6BCFA" stroke="#2D3748" strokeWidth="2" />
        <path d="M22 31V38C22 38 22 42 32 42C42 42 42 38 42 38V31" stroke="#2D3748" strokeWidth="2" fill="none" />
        <path d="M48 28V36" stroke="#2D3748" strokeWidth="2" />
    </BadgeBase>
);

export const MillionaireIcon = ({ size = 64 }: IconProps) => (
    <BadgeBase color="#3dcc80ff" size={size}>
        <path d="M32 18V46M24 24C24 24 26 22 32 22C38 22 40 25 40 28C40 31 38 34 32 34C26 34 24 37 24 40C24 43 26 46 32 46C38 46 40 44 40 44" stroke="#2D3748" strokeWidth="4" strokeLinecap="round" />
    </BadgeBase>
);

export const CareerMasterIcon = ({ size = 64 }: IconProps) => (
    <BadgeBase color="#ECC94B" size={size}>
        <path d="M18 42L18 24L25 31L32 22L39 31L46 24V42H18Z" fill="#FAF089" stroke="#2D3748" strokeWidth="2" />
        <circle cx="32" cy="42" r="2" fill="#2D3748" />
    </BadgeBase>
);

export const HackerProIcon = ({ size = 64 }: IconProps) => (
    <BadgeBase color="#2b67cfff" size={size}>
        <rect x="18" y="20" width="28" height="20" rx="2" stroke="#48BB78" strokeWidth="2" />
        <text x="22" y="32" fontSize="10" fontWeight="bold" fill="#48BB78">&gt;_</text>
        <path d="M20 40H44L46 44H18L20 40Z" fill="#48BB78" stroke="#48BB78" strokeWidth="1" />
    </BadgeBase>
);

export const SurvivorIcon = ({ size = 64 }: IconProps) => (
    <BadgeBase color="#ED8936" size={size}>
        <circle cx="32" cy="32" r="14" stroke="#2D3748" strokeWidth="3" />
        <path d="M32 24V32L38 38" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" />
        <path d="M20 20L24 24M44 44L40 40M44 20L40 24M20 44L24 40" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" />
    </BadgeBase>
);

export const ACHIEVEMENT_ICONS: Record<string, React.FC<IconProps>> = {
    first_job: FirstJobIcon,
    hardware_pro: HardwareProIcon,
    solitaire_pro: SolitaireProIcon,
    university_grad: UniversityGradIcon,
    millionaire: MillionaireIcon,
    career_master: CareerMasterIcon,
    hacker_pro: HackerProIcon,
    survivor: SurvivorIcon,
};
