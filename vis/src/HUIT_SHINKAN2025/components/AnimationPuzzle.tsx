// src/HUIT_SHINKAN2025/components/AnimationPuzzle.tsx
import React, { useState, useEffect, useRef } from 'react';
import SolutionInputPuzzle from './SolutionInputPuzzle';
import AnimationControls from './AnimationControls';
import PuzzleBoard from './PuzzleBoard';
import { Style } from '../utils';

interface Props {
    costBoard: number[][];
    gridSize: number;
    style: Style;
}

const AnimationPuzzle: React.FC<Props> = ({ costBoard, gridSize, style }) => {
    // ゼロブロックを作成
    const makeZero = () =>
        Array.from({ length: gridSize }, () => Array(gridSize).fill(0));

    // --- State ---
    const [solutions, setSolutions] = useState<number[][][]>([makeZero()]);
    const [selIdx, setSelIdx] = useState(0);
    const [mask, setMask] = useState<boolean[][]>(makeZero().map(r => r.map(() => false)));
    const [inputError, setInputError] = useState<string | null>(null);
    const [playingBlocks, setPlayingBlocks] = useState(false);
    const [playingSteps, setPlayingSteps] = useState(false);
    const [speed, setSpeed] = useState(500);

    const blockTimer = useRef<number>(0);
    const stepTimer  = useRef<number>(0);
    const stepQueue  = useRef<[number, number][]>([]);

    // --- gridSize 変更時リセット ---
    useEffect(() => {
        const zb = makeZero();
        setSolutions([zb]);
        setSelIdx(0);
        setMask(zb.map(row => row.map(() => false)));
        setInputError(null);
        setPlayingBlocks(false);
        setPlayingSteps(false);
    }, [gridSize]);

    // --- 解入力変更時ハンドラ ---
    const handleSolutionsChange = (blocks: number[][][]) => {
        if (blocks.length === 0) {
            const zb = makeZero();
            setSolutions([zb]);
            setSelIdx(0);
            setMask(zb.map(r => r.map(() => false)));
            setInputError(null);
            return;
        }
        const valid = blocks.every(
            b => b.length === gridSize && b.every(r => r.length === gridSize && r.every(v => v === 0 || v === 1))
        );
        if (!valid) {
            setInputError('入力形式が不正です。N×N の 0/1 行列を空行で区切ってください。');
            return;
        }
        setSolutions(blocks);
        // 初期選択と mask 設定
        setSelIdx(0);
        setMask(blocks[0].map(r => r.map(v => v === 1)));
        setInputError(null);
    };

    // --- ブロック単位再生 ---
    useEffect(() => {
        if (playingBlocks) {
            blockTimer.current = window.setInterval(() => {
                setSelIdx(prev => {
                    const next = (prev + 1) % solutions.length;
                    setMask(solutions[next].map(r => r.map(v => v === 1)));
                    return next;
                });
            }, 1000);
        } else {
            window.clearInterval(blockTimer.current);
        }
        return () => window.clearInterval(blockTimer.current);
    }, [playingBlocks, solutions]);

    // --- 手順単位再生 ---
    useEffect(() => {
        if (playingSteps) {
            stepQueue.current = [];
            solutions[selIdx].forEach((row, i) =>
                row.forEach((v, j) => {
                    if (v === 1) stepQueue.current.push([i, j]);
                })
            );
            // mask をクリア
            setMask(makeZero().map(r => r.map(() => false)));
            // 再生開始
            const tick = () => {
                const next = stepQueue.current.shift();
                if (next) {
                    const [r, c] = next;
                    setMask(prev => {
                        const cp = prev.map(rr => [...rr]);
                        cp[r][c] = true;
                        return cp;
                    });
                    stepTimer.current = window.setTimeout(tick, speed);
                } else {
                    setPlayingSteps(false);
                }
            };
            tick();
        } else {
            window.clearTimeout(stepTimer.current);
        }
        return () => window.clearTimeout(stepTimer.current);
    }, [playingSteps, selIdx, solutions, speed]);

    // --- mask → 二値行列 ---
    const maskMatrix = mask.map(r => r.map(b => (b ? 1 : 0)));

    // --- 隣接伝搬行列 (default/highlight 用) ---
    const propagated = makeZero();
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (maskMatrix[i][j] === 1) {
                [[0,0],[-1,0],[1,0],[0,-1],[0,1]].forEach(([dx,dy]) => {
                    const x = i+dx, y = j+dy;
                    if (x>=0 && x<gridSize && y>=0 && y<gridSize) {
                        propagated[x][y] ^= 1;
                    }
                });
            }
        }
    }

    return (
        <div className="space-y-4">
            <SolutionInputPuzzle onChange={handleSolutionsChange} />
            <AnimationControls
                numSolutions={solutions.length}
                selected={selIdx}
                // スライダーで選択したときにも mask を更新
                onSelect={i => {
                    setSelIdx(i);
                    setMask(solutions[i].map(r => r.map(v => v === 1)));
                }}
                playingBlocks={playingBlocks}
                onPlayBlocks={() => setPlayingBlocks(b => !b)}
                playingSteps={playingSteps}
                onPlaySteps={() => setPlayingSteps(s => !s)}
                speed={speed}
                onSpeedChange={setSpeed}
            />

            {inputError ? (
                <div className="text-red-600 p-4">{inputError}</div>
            ) : (
                <PuzzleBoard
                    costBoard={costBoard}
                    // default/highlight→propagated, weight→maskMatrix
                    solution={style === 'weight' ? maskMatrix : propagated}
                    style={style}
                    mask={mask}
                    hideText={gridSize > 50}
                />
            )}
        </div>
    );
};

export default AnimationPuzzle;
