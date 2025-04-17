// src/HUIT_SHINKAN2025/components/AnimatedPuzzleBoard.tsx
import React from 'react';

interface Props {
    costBoard: number[][];
    solution: number[][];
}

export const AnimatedPuzzleBoard: React.FC<Props> = ({ costBoard, solution }) => {
    const N = solution.length;

    // 各セルに累積する重みを格納する配列を初期化
    const weightGrid: number[][] = Array.from({ length: N }, () =>
        Array(N).fill(0)
    );

    // 押したセル (solution===1) ひとつひとつに対して自分自身と隣接セルに
    // costBoard[i][j] を加算する
    solution.forEach((row, i) => {
        row.forEach((val, j) => {
            if (val === 1) {
                const w = costBoard[i][j];
                // 自分と上下左右
                [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => {
                    const x = i + dx;
                    const y = j + dy;
                    if (x >= 0 && x < N && y >= 0 && y < N) {
                        weightGrid[x][y] += w;
                    }
                });
            }
        });
    });

    // 最大重みを取得（0除外せずにそのまま）
    const maxW = 35;

    return (
        <div className="w-full max-w-[600px] mx-auto">
            <div
                className="grid gap-[1px]"
                style={{ gridTemplateColumns: `repeat(${N}, minmax(0,1fr))` }}
            >
                {weightGrid.map((row, i) =>
                    row.map((w, j) => {
                        // αは 0 ～ 1 の範囲。maxW が 0 なら α=0
                        const alpha = maxW > 0 ? w / maxW : 0;
                        return (
                            <div
                                key={`${i}-${j}`}
                                className="aspect-square"
                                style={{
                                    backgroundColor: `rgba(220,20,60,${alpha})`,
                                }}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};
