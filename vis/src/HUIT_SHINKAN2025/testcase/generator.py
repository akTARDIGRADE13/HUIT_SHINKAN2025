import os
import random

def generate_testcase(n: int) -> str:
    """
    固定シードを利用して n×n のテストケース（1～9 の乱数）を生成する。
    形式は:
      N
      c₁₁ c₁₂ ... c₁N
      ...
      c_N1 c_N2 ... c_NN
    """
    # 固定シードをセット
    random.seed(12345)
    lines = [str(n)]
    for _ in range(n):
        # 1～9 の整数を乱数で生成
        row = " ".join(str(random.randint(1, 9)) for _ in range(n))
        lines.append(row)
    return "\n".join(lines)

def write_testcase_file(n: int, ts_filename: str, txt_filename: str) -> None:
    """
    n×n のテストケースを生成し、TypeScriptファイル（export const testcase = `...`;）
    と txt ファイルとして出力する。
    """
    content = generate_testcase(n)
    
    # TypeScriptファイルとして出力
    ts_content = f"export const testcase = `\n{content}\n`;\n"
    os.makedirs(os.path.dirname(ts_filename), exist_ok=True)
    with open(ts_filename, "w", encoding="utf-8") as f:
        f.write(ts_content)
    print(f"生成しました: {ts_filename}")
    
    # テキストファイルとして出力
    os.makedirs(os.path.dirname(txt_filename), exist_ok=True)
    with open(txt_filename, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"生成しました: {txt_filename}")

if __name__ == "__main__":
    # グリッドサイズと出力ファイル名の対応（TypeScript ファイルと txt ファイル）
    sizes = {
        5: ("./testcase1.ts", "./testcase1.txt"),
        20: ("./testcase2.ts", "./testcase2.txt"),
        50: ("./testcase3.ts", "./testcase3.txt"),
        95: ("./testcase4.ts", "./testcase4.txt")
    }
    
    for n, (ts_filename, txt_filename) in sizes.items():
        write_testcase_file(n, ts_filename, txt_filename)
