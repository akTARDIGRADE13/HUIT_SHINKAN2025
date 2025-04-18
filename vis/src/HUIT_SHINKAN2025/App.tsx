// src/HUIT_SHINKAN2025/App.tsx
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import ManualModePuzzle from './components/ManualModePuzzle';
import AnimationPuzzle from './components/AnimationPuzzle';
import { parseTestCase, Style } from './utils';

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

const buttonClass = (active: boolean, color: string) =>
    `px-6 py-3 rounded-lg font-semibold transition-colors duration-150 ${
        active ? `${color} text-white shadow-lg` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;

const App: React.FC = () => {
    const [mode, setMode] = useState<Mode>('manual');
    const [gridSize, setGridSize] = useState<5 | 10 | 20 | 100>(5);
    const [style, setStyle] = useState<Style>('default');
    const { costBoard } = TESTCASES[gridSize];

    return (
        <Layout>
            <div className="flex flex-col gap-6 mb-8">
                {/* モード切替 */}
                <div className="flex gap-4">
                    <button
                        className={buttonClass(mode === 'manual', 'bg-blue-500')}
                        onClick={() => setMode('manual')}
                    >
                        手動モード {mode === 'manual' && '(選択中)'}
                    </button>
                    <button
                        className={buttonClass(mode === 'integration', 'bg-blue-500')}
                        onClick={() => setMode('integration')}
                    >
                        統合モード {mode === 'integration' && '(選択中)'}
                    </button>
                </div>
                {/* グリッドサイズ */}
                <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-semibold">サイズ : </span>
                    {[5, 10, 20, 100].map(n => (
                        <button
                            key={n}
                            className={buttonClass(gridSize === n, 'bg-green-500')}
                            onClick={() => setGridSize(n as 5 | 10 | 20 | 100)}
                        >
                            {n}×{n}
                        </button>
                    ))}
                </div>
                {/* ビジュアライズスタイル */}
                <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-semibold">スタイル : </span>
                    {(['default', 'highlight', 'weight'] as Style[]).map(s => (
                        <button
                            key={s}
                            className={buttonClass(style === s, 'bg-purple-500')}
                            onClick={() => setStyle(s)}
                        >
                            {s === 'default' ? '標準' : s === 'highlight' ? '強調' : '重み合成'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg shadow-md">
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
            </div>
        </Layout>
    );
};

export default App;
