import React, { useState, useEffect } from 'react';
import PuzzleBoard from './PuzzleBoard';
import { calculateScore, Style } from '../utils';

interface Props {
    costBoard: number[][];
    gridSize: number;
    style: Style;
}

const ManualModePuzzle: React.FC<Props> = ({ costBoard, gridSize, style }) => {
    const [solution, setSolution] = useState<number[][]>(
        () => Array.from({ length: gridSize }, () => Array(gridSize).fill(0))
    );
    const [pressedMask, setPressedMask] = useState<boolean[][]>(
        () => Array.from({ length: gridSize }, () => Array(gridSize).fill(false))
    );

    useEffect(() => {
        setSolution(Array.from({ length: gridSize }, () => Array(gridSize).fill(0)));
        setPressedMask(Array.from({ length: gridSize }, () => Array(gridSize).fill(false)));
    }, [gridSize]);

    const toggle = (r: number, c: number) => {
        setSolution(prev => {
            const next = prev.map(row => [...row]);
            const flip = (x: number, y: number) => {
                if (0 <= x && x < gridSize && 0 <= y && y < gridSize) {
                    next[x][y] = prev[x][y] === 1 ? 0 : 1;
                }
            };
            flip(r, c);
            flip(r - 1, c);
            flip(r + 1, c);
            flip(r, c - 1);
            flip(r, c + 1);
            return next;
        });
        setPressedMask(prev => {
            const next = prev.map(row => [...row]);
            next[r][c] = true;
            return next;
        });
    };

    const reset = () => {
        setSolution(Array.from({ length: gridSize }, () => Array(gridSize).fill(0)));
        setPressedMask(Array.from({ length: gridSize }, () => Array(gridSize).fill(false)));
    };

    const score = calculateScore(costBoard, pressedMask);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-6 mu-gap-12">
                <button
                    className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition-colors"
                    onClick={reset}
                >
                    Reset
                </button>
                <div className="px-6 py-3 bg-white rounded-lg shadow-md text-gray-800 font-semibold">
                    Score: <span className="text-xl font-bold text-gray-900">{score}</span>
                </div>
            </div>

            <PuzzleBoard
                costBoard={costBoard}
                solution={solution}
                style={style}
                mask={pressedMask}
                onCellClick={toggle}
                hideText={gridSize > 50}
            />
        </div>
    );
};

export default ManualModePuzzle;
