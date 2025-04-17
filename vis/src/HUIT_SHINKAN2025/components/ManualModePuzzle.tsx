import React, { useState, useEffect } from 'react';
import PuzzleBoard from './PuzzleBoard';
import { calculateScore, Style } from '../utils';

interface Props {
    costBoard: number[][];
    gridSize: number;
    style: Style;
}

const ManualModePuzzle: React.FC<Props> = ({ costBoard, gridSize, style }) => {
    // 解状態 (0/1) と押下履歴マスク (true=押した) を持つ
    const [solution, setSolution] = useState<number[][]>(
        () => Array.from({ length: gridSize }, () => Array(gridSize).fill(0))
    );
    const [pressedMask, setPressedMask] = useState<boolean[][]>(
        () => Array.from({ length: gridSize }, () => Array(gridSize).fill(false))
    );

    // gridSize が変わった時に両方リセット
    useEffect(() => {
        setSolution(Array.from({ length: gridSize }, () => Array(gridSize).fill(0)));
        setPressedMask(Array.from({ length: gridSize }, () => Array(gridSize).fill(false)));
    }, [gridSize]);

    // クリック時の反転＆マスク更新
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

    const score = calculateScore(costBoard, solution);
    const boardStyle: Style = style;

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={reset}>
                    Reset
                </button>
                <span>Score: {score}</span>
            </div>
            <PuzzleBoard
                costBoard={costBoard}
                solution={solution}
                style={boardStyle}
                mask={pressedMask}
                onCellClick={toggle}
                hideText={gridSize > 50}
            />
        </div>
    );
};

export default ManualModePuzzle;
