import React from 'react';

interface IconProps {
    className?: string;
    style?: React.CSSProperties;
    width?: number;
    height?: number;
    fill?: string;
}

export const PlayIcon: React.FC<IconProps> = ({ width = 10, height = 10, fill = "currentColor", ...props }) => (
    <svg width={width} height={height} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M1 1V9L9 5L1 1Z" fill={fill} />
    </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ width = 10, height = 10, fill = "currentColor", ...props }) => (
    <svg width={width} height={height} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="1" y="1" width="3" height="8" fill={fill} />
        <rect x="6" y="1" width="3" height="8" fill={fill} />
    </svg>
);

export const StopIcon: React.FC<IconProps> = ({ width = 10, height = 10, fill = "currentColor", ...props }) => (
    <svg width={width} height={height} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="1" y="1" width="8" height="8" fill={fill} />
    </svg>
);

export const PrevIcon: React.FC<IconProps> = ({ width = 10, height = 10, fill = "currentColor", ...props }) => (
    <svg width={width} height={height} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M9 1V9L3 5L9 1Z" fill={fill} />
        <rect x="1" y="1" width="2" height="8" fill={fill} />
    </svg>
);

export const NextIcon: React.FC<IconProps> = ({ width = 10, height = 10, fill = "currentColor", ...props }) => (
    <svg width={width} height={height} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M1 1V9L7 5L1 1Z" fill={fill} />
        <rect x="7" y="1" width="2" height="8" fill={fill} />
    </svg>
);
