// src/HUIT_SHINKAN2025/components/SolutionInputPuzzle.tsx
import React, { useState, useEffect } from 'react';
import { parseSolutions } from '../utils';

interface Props {
    onChange: (solutions: number[][][]) => void;
}

const SolutionInputPuzzle: React.FC<Props> = ({ onChange }) => {
    const [text, setText] = useState<string>('');

    useEffect(() => {
        try {
            const sols = parseSolutions(text);
            onChange(sols);
        } catch {
            onChange([]);
        }
    }, [text, onChange]);

    return (
        <textarea
            className="w-full h-40 p-2 border"
            placeholder={`例:
1 0 0
0 1 0

0 1 1
1 0 0`}
            value={text}
            onChange={e => setText(e.target.value)}
        />
    );
};

export default SolutionInputPuzzle;
