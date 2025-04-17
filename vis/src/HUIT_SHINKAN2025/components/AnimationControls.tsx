// src/HUIT_SHINKAN2025/components/AnimationControls.tsx
import React from 'react';

interface Props {
    numSolutions: number;
    selected: number;
    onSelect: (idx: number) => void;
    onPlayBlocks: () => void;
    playingBlocks: boolean;
    onPlaySteps: () => void;
    playingSteps: boolean;
    speed: number;
    onSpeedChange: (s: number) => void;
}

const AnimationControls: React.FC<Props> = ({
    numSolutions,
    selected,
    onSelect,
    onPlayBlocks,
    playingBlocks,
    onPlaySteps,
    playingSteps,
    speed,
    onSpeedChange,
}) => (
    <div className="space-y-4">
        <div className="flex items-center space-x-2">
            <label>Solution #:</label>
            <input
                type="range"
                min={1}
                max={Math.max(1, numSolutions)}
                value={selected + 1}
                onChange={e => onSelect(Number(e.target.value) - 1)}
            />
            <span>{selected + 1}</span>
        </div>
        <div className="flex items-center space-x-2">
            <button onClick={onPlayBlocks} className="px-2 py-1 bg-blue-500 text-white rounded">
                {playingBlocks ? '■' : '▶'} Block
            </button>
            <button onClick={onPlaySteps} className="px-2 py-1 bg-green-500 text-white rounded">
                {playingSteps ? '■' : '▶'} Steps
            </button>
            <label>Speed (ms):</label>
            <input
                type="range"
                min={100}
                max={2000}
                step={100}
                value={speed}
                onChange={e => onSpeedChange(Number(e.target.value))}
            />
            <span>{speed}</span>
        </div>
    </div>
);

export default AnimationControls;
