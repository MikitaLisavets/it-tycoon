import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    muted?: boolean;
}

export const WorldIcon: React.FC<IconProps> = ({ size = 24, style, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ verticalAlign: 'middle', ...style }}
        {...props}
    >
        {/* Globe Base */}
        <circle cx="12" cy="12" r="10" fill="#000080" stroke="black" strokeWidth="1" />

        {/* Grid lines */}
        <path d="M12 2C16 2 20 6 20 12C20 18 16 22 12 22" stroke="#4080FF" strokeWidth="1" fill="none" />
        <path d="M12 2C8 2 4 6 4 12C4 18 8 22 12 22" stroke="#4080FF" strokeWidth="1" fill="none" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="#4080FF" strokeWidth="1" />
        <line x1="4" y1="7" x2="20" y2="7" stroke="#4080FF" strokeWidth="1" />
        <line x1="4" y1="17" x2="20" y2="17" stroke="#4080FF" strokeWidth="1" />

        {/* Simple landmasses (abstract) */}
        <path d="M8 8H11V11H8V8Z" fill="#008000" />
        <path d="M14 6H17V9H14V6Z" fill="#008000" />
        <path d="M13 13H17V17H13V13Z" fill="#008000" />
        <path d="M5 13H8V15H5V13Z" fill="#008000" />
    </svg>
);

export const WarningIcon: React.FC<IconProps> = ({ size = 24, style, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ verticalAlign: 'middle', ...style }}
        {...props}
    >
        {/* Triangle */}
        <path d="M12 2L2 22H22L12 2Z" fill="#FFFF00" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Exclamation Mark */}
        <rect x="11" y="8" width="2" height="7" fill="black" />
        <rect x="11" y="17" width="2" height="2" fill="black" />

        {/* Highlight for bevel effect */}
        <path d="M12 4L4 20H8" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ size = 24, style, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ verticalAlign: 'middle', ...style }}
        {...props}
    >
        {/* Blue Circle */}
        <circle cx="12" cy="12" r="10" fill="#0000FF" stroke="black" strokeWidth="1.5" />

        {/* Lowercase 'i' */}
        <rect x="11" y="10" width="2" height="7" fill="white" />
        <rect x="11" y="7" width="2" height="2" fill="white" />

        {/* Shine */}
        <path d="M7 7C7 7 8 5 12 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
);

export const ErrorIcon: React.FC<IconProps> = ({ size = 24, style, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ verticalAlign: 'middle', ...style }}
        {...props}
    >
        {/* Red Circle */}
        <circle cx="12" cy="12" r="10" fill="#FF0000" stroke="black" strokeWidth="1.5" />

        {/* White X */}
        <path d="M8 8L16 16M16 8L8 16" stroke="white" strokeWidth="3" strokeLinecap="round" />

        {/* Shine */}
        <path d="M7 7C7 7 8 5 12 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
    </svg>
);

export const ComputerIcon: React.FC<IconProps> = ({ size = 24, style, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ verticalAlign: 'middle', ...style }}
        {...props}
    >
        {/* Base Unit (optional, let's just do a big monitor + base like old icons) */}
        {/* Monitor Casing */}
        <rect x="3" y="2" width="18" height="15" fill="#C0C0C0" stroke="black" strokeWidth="1" />

        {/* Screen */}
        <rect x="5" y="4" width="14" height="11" fill="#008080" stroke="gray" strokeWidth="1" />

        {/* Stand Neck */}
        <rect x="10" y="17" width="4" height="2" fill="#C0C0C0" stroke="black" strokeWidth="1" />

        {/* Stand Base */}
        <path d="M6 19H18L20 22H4L6 19Z" fill="#C0C0C0" stroke="black" strokeWidth="1" />

        {/* Simple Screen Glare/Detail */}
        <path d="M5 4L19 4" stroke="#FFFFFF" strokeOpacity="0.5" />
        <path d="M5 4L5 15" stroke="#FFFFFF" strokeOpacity="0.5" />
    </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ size = 24, style, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ verticalAlign: 'middle', ...style }}
        {...props}
    >
        {/* Main heart shape with black outline */}
        <path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
            fill="#FF0000"
            stroke="black"
            strokeWidth="1.5"
            strokeLinejoin="round"
        />
        {/* Retro style highlight */}
        <path
            d="M7 6C7 6 7 4.5 9.5 5"
            stroke="#FFB6B6"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);

export const SpeakerIcon: React.FC<IconProps> = ({ size = 24, style, muted, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ verticalAlign: 'middle', ...style }}
        {...props}
    >
        {/* Classic Yellow Speaker Body */}
        {/* Main box */}
        <rect x="2" y="8" width="6" height="8" fill="#FFFFFF" stroke="black" strokeWidth="1" />
        {/* Cone part */}
        <path d="M8 8L14 4V20L8 16V8Z" fill="#FFFFFF" stroke="black" strokeWidth="1" />

        {/* Sound Waves (Blue/Cyan typically in 98) */}
        {!muted && (
            <>
                {/* Small wave */}
                <path d="M17 10V14" stroke="#000080" strokeWidth="2" strokeLinecap="round" />
                {/* Medium wave */}
                <path d="M20 8V16" stroke="#000080" strokeWidth="2" strokeLinecap="round" />
                {/* Large wave */}
                <path d="M23 6V18" stroke="#000080" strokeWidth="2" strokeLinecap="round" />
            </>
        )}

        {/* Muted X (Red) */}
        {muted && (
            <path d="M17 9L21 13M21 9L17 13" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" />
        )}
    </svg>
);

export const DiscIcon: React.FC<IconProps> = ({ size = 24, style, ...props }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ verticalAlign: 'middle', ...style }}
        {...props}
    >
        {/* CD Base */}
        <circle cx="12" cy="12" r="10" fill="#E0E0E0" stroke="black" strokeWidth="1" />
        <circle cx="12" cy="12" r="3" fill="#A0A0A0" stroke="black" strokeWidth="1" />
        {/* Shine */}
        <path d="M16 8L18 6" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <path d="M6 16L8 18" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
);
