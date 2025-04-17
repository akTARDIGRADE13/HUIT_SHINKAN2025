// src/HUIT_SHINKAN2025/App.tsx
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import ManualModePuzzle from './components/ManualModePuzzle';
import AnimationPuzzle from './components/AnimationPuzzle';
import { parseTestCase, Style } from './utils';

// **テストケース側が named export になっている想定です。**
// testcase1.ts の先頭に `export const testcase1 = \`...\`;` のように書かれていれば：
import { testcase as testcase1 } from './testcase/testcase1';
import { testcase as testcase2 } from './testcase/testcase2';
import { testcase as testcase3 } from './testcase/testcase3';
import { testcase as testcase4 } from './testcase/testcase4';

type Mode = 'manual' | 'integration';

const TESTCASES: Record<number, { N: number; costBoard: number[][] }> = {
    5: parseTestCase(testcase1),
    10: parseTestCase(testcase2),
    20: parseTestCase(testcase3),
    100: parseTestCase(testcase4),
};

const App: React.FC = () => {
    const [mode, setMode] = useState<Mode>('manual');
    const [gridSize, setGridSize] = useState<5 | 10 | 20 | 100>(5);
    const [style, setStyle] = useState<Style>('default');
    const { costBoard } = TESTCASES[gridSize];

    return (
        <Layout>
            <div className="flex flex-wrap items-center space-x-4 mb-6">
                {/* モード切替 */}
                <div>
                    <button
                        className={`px-3 py-1 ${mode === 'manual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setMode('manual')}
                    >
                        手動モード
                    </button>
                    <button
                        className={`px-3 py-1 ${mode === 'integration' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setMode('integration')}
                    >
                        統合モード
                    </button>
                </div>
                {/* グリッドサイズ */}
                <div>
                    サイズ:
                    {[5, 10, 20, 100].map(n => (
                        <button
                            key={n}
                            className={`ml-2 px-2 py-1 ${gridSize === n ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                            onClick={() => setGridSize(n as 5 | 10 | 20 | 100)}
                        >
                            {n}×{n}
                        </button>
                    ))}
                </div>
                {/* ビジュアライズスタイル */}
                <div>
                    スタイル:
                    {(['default', 'highlight', 'weight'] as Style[]).map(s => (
                        <button
                            key={s}
                            className={`ml-2 px-2 py-1 ${
                                style === s ? 'bg-purple-500 text-white' : 'bg-gray-200'
                            }`}
                            onClick={() => setStyle(s)}
                        >
                            {s === 'default' ? '標準' : s === 'highlight' ? '強調' : '重み合成'}
                        </button>
                    ))}
                </div>
            </div>

            {mode === 'manual' ? (
                <ManualModePuzzle
                    key={`manual-${gridSize}`}
                    costBoard={costBoard}
                    gridSize={gridSize}
                    style={style}
                />
            ) : (
                <AnimationPuzzle
                    key={`integration-${gridSize}`}
                    costBoard={costBoard}
                    gridSize={gridSize}
                    style={style} 
                />
            )}
        </Layout>
    );
};

export default App;
