#include <bits/stdc++.h>
using namespace std;
using u64 = unsigned long long;

int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    for(int N = 1; N <= 100; ++N){
        int N2 = N * N;
        int W  = (N2 + 63) / 64;

        // A: N2 x N2 のビット行列
        vector<vector<u64>> A(N2, vector<u64>(W, 0));

        auto idx = [&](int i, int j){ return i * N + j; };
        const int di[5] = {0, 1, -1, 0, 0};
        const int dj[5] = {0, 0,  0, 1,-1};

        // 行列 A を構築
        for(int i = 0; i < N; ++i){
            for(int j = 0; j < N; ++j){
                int row = idx(i,j);
                for(int d = 0; d < 5; ++d){
                    int ni = i + di[d];
                    int nj = j + dj[d];
                    if(ni >= 0 && ni < N && nj >= 0 && nj < N){
                        int col = idx(ni,nj);
                        A[row][col >> 6] |= u64(1) << (col & 63);
                    }
                }
            }
        }

        // ガウス消去でランク計算
        int rank = 0;
        for(int col = 0; col < N2 && rank < N2; ++col){
            int pivot = -1;
            for(int r = rank; r < N2; ++r){
                if((A[r][col>>6] >> (col&63)) & 1){
                    pivot = r;
                    break;
                }
            }
            if(pivot < 0) continue;
            swap(A[rank], A[pivot]);
            for(int r = rank + 1; r < N2; ++r){
                if((A[r][col>>6] >> (col&63)) & 1){
                    for(int w = 0; w < W; ++w){
                        A[r][w] ^= A[rank][w];
                    }
                }
            }
            ++rank;
        }

        int nullity = N2 - rank;
        if(nullity > 0){
            cout << "N = " << N
                 << ", free degrees = " << nullity << "\n";
        }
    }

    return 0;
}

