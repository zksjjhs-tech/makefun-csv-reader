# Make.fun CSV reader

[![Make.fun bounty](https://make.fun/badge/csv-reader-speed-01-run-20261121.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121)
[![Rank](https://make.fun/badge/csv-reader-speed-01-run-20261121/zksjjhs-tech/makefun-csv-reader/rank.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121)
[![Reward](https://make.fun/badge/csv-reader-speed-01-run-20261121/zksjjhs-tech/makefun-csv-reader/reward.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121)

A dependency-free JavaScript CSV parser for the Make.fun bounty. It splits ordinary records directly and uses a field scanner for quoted and malformed records.

## Run it

With Node.js 22.18 or later, place `cases.json` in the input directory and create the output directory. Set `MAKEFUN_INPUT_DIR` and `MAKEFUN_OUTPUT_DIR` to those directories, then run:

```sh
node main.ts
```

The program writes `answers.json` in the output directory.

Built for the [Make.fun CSV reader bounty](https://make.fun/bounty/csv-reader-speed-01-run-20261121).
