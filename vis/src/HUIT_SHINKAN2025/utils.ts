// src/HUIT_SHINKAN2025/utils.ts

/**
 * テストケース文字列をパースして N と costBoard を返す
 */
export function parseTestCase(
    text: string
): { N: number; costBoard: number[][] } {
    const lines = text.trim().split(/\r?\n/);
    const N = parseInt(lines[0], 10);
    const costBoard = lines
        .slice(1, N + 1)
        .map(line => line.trim().split(/\s+/).map(v => Number(v)));
    return { N, costBoard };
}

/**
 * テキスト入力から複数の解ブロックをパースする
 * 空行で区切られたブロックごとに、N×N の 0/1 マトリクスを返す
 */
export function parseSolutions(text: string): number[][][] {
    // 空行（改行だけの行）でブロックを分割
    const blocks = text
        .trim()
        .split(/\r?\n\s*\r?\n/)
        .filter(block => block.trim().length > 0);

    return blocks.map(block => {
        const rows = block.trim().split(/\r?\n/);
        return rows.map(line =>
            line
                .trim()
                .split(/\s+/)
                .map(v => {
                    const n = parseInt(v, 10);
                    return isNaN(n) ? 0 : n;
                })
        );
    });
}

/**
 * いつでも costBoard と solution の 1 セル分のコスト総和を返す
 */
export function calculateScore(
    costBoard: number[][],
    solution: boolean[][]
): number {
    let score = 0;
    for (let i = 0; i < solution.length; i++) {
        for (let j = 0; j < solution[i].length; j++) {
            if (solution[i][j] === true) {
                score += costBoard[i][j];
            }
        }
    }
    return score;
}

export type Style = 'default' | 'highlight' | 'weight';
