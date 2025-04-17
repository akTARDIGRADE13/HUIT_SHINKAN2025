import React from 'react';
import { Style } from '../utils';

interface Props {
    costBoard: number[][];
    solution: number[][];
    style: Style;
    /** 押したセルの履歴マスク（highlight／weight モード用） */
    mask?: boolean[][];
    onCellClick?: (r: number, c: number) => void;
    hideText?: boolean;
}

const PuzzleBoard: React.FC<Props> = ({
    costBoard,
    solution,
    style,
    mask,
    onCellClick,
    hideText = false,
}) => {
    const N = costBoard.length;

    // 重み合成用グリッドを N×N で 0 初期化
    const weightGrid: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
    let maxW = 0;

    if (style === 'weight' && mask) {
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                if (mask[i][j]) {
                    const w = costBoard[i][j];
                    // 自分＋上下左右に波及
                    [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => {
                        const x = i + dx;
                        const y = j + dy;
                        if (x >= 0 && x < N && y >= 0 && y < N) {
                            weightGrid[x][y] += w;
                        }
                    });
                }
            }
        }
        maxW = 35;
    }

    return (
        <div className="w-full max-w-[600px] mx-auto">
            <div
                className="grid gap-[1px]"
                style={{ gridTemplateColumns: `repeat(${N}, minmax(0,1fr))` }}
            >
                {solution.map((row, i) =>
                    row.map((cell, j) => {
                        let bgColor: string;

                        if (style === 'default') {
                            // default: solution=1 のセルは灰、それ以外は緑
                            bgColor = cell === 1 ? '#e5e7eb' : '#4ade80';
                        } else if (style === 'highlight') {
                            // highlight: mask=true のセルのみ赤、それ以外は緑
                            const isHit = mask?.[i]?.[j] ?? false;
                            bgColor = isHit ? '#f87171' : '#e5e7eb';

                        } else {
                            // weight: mask から累積重みを計算して濃淡（mask true のセル波及）
                            const w = weightGrid[i][j] ?? 0;
                            const alpha = maxW > 0 ? w / maxW : 0;
                            bgColor = `rgba(220,20,60,${alpha})`;
                        }

                        return (
                            <div
                                key={`${i}-${j}`}
                                className="aspect-square flex items-center justify-center cursor-pointer"
                                style={{ backgroundColor: bgColor }}
                                onClick={() => onCellClick?.(i, j)}
                            >
                                {!hideText && <span className="text-sm">{costBoard[i][j]}</span>}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PuzzleBoard;
