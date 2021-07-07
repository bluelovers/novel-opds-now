# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.8](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.7...novel-opds-now@3.0.8) (2021-07-07)


### ✨　Features

* 將 zip 視為 epub ([0f3baf2](https://github.com/bluelovers/novel-opds-now/commit/0f3baf29b2d7445d6caba885ffc2383eaa92b720))
* 加速下載緩存檔案 ([c7712f6](https://github.com/bluelovers/novel-opds-now/commit/c7712f6ab5fd10c6fa92606932eeb2e4cb4f2ef2))
* 優化訊息顯示 並且延長下載允許時間 ([42f0ecb](https://github.com/bluelovers/novel-opds-now/commit/42f0ecb6de2ee518514eb9d588e508c79f99ae5f))
* 由於可以用 poke 取代 publishToIPFSAll 所以改用 publishToIPFSRace ([a23972a](https://github.com/bluelovers/novel-opds-now/commit/a23972ab4b557102339ea7da7304f471212d1b88))
* 優化錯誤訊息顯示 ([949a88e](https://github.com/bluelovers/novel-opds-now/commit/949a88e934eace1b8cbd876ca1777968addf8fdd))


### 🛠　Build System

* **cache:** update cache ([c89ee27](https://github.com/bluelovers/novel-opds-now/commit/c89ee2712b922a7112945304edaaaf382c8fb3a6))





## [3.0.7](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.6...novel-opds-now@3.0.7) (2021-07-07)


### 🛠　Build System

* **cache:** update cache ([0983581](https://github.com/bluelovers/novel-opds-now/commit/09835815d5fc3d64fab2ba9404c3f5a5aee2c50b))





## [3.0.6](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.5...novel-opds-now@3.0.6) (2021-07-07)


### ✨　Features

* 允許在 local network 下顯示更多資料 ([9d8fa2a](https://github.com/bluelovers/novel-opds-now/commit/9d8fa2aea72c72b32ac1d7233c29cc3a868fb677))


### 🛠　Build System

* **cache:** update cache ([9a90126](https://github.com/bluelovers/novel-opds-now/commit/9a901261672300346d43bf87c20bb3cc96f3b435))





## [3.0.5](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.4...novel-opds-now@3.0.5) (2021-07-07)


### ✨　Features

* 支援設定 `disposable` 模式 可使用 `process.env.IPFS_DISPOSABLE` 或啟動時 `--disposable` ([c94acdd](https://github.com/bluelovers/novel-opds-now/commit/c94acdd57804865e4ffaaf38be6573dc50eeba46))
* reportPokeAllSettledResult ([ef44cba](https://github.com/bluelovers/novel-opds-now/commit/ef44cba8fb8151e53932491d7da5c415b3945b2e))
* addMutableFileSystem ([8f6f706](https://github.com/bluelovers/novel-opds-now/commit/8f6f7060054b64f21f44af2581bd256f94a32ec4))
* tmpPath() ([92cdbe2](https://github.com/bluelovers/novel-opds-now/commit/92cdbe2da74c2062d0528d3e5873e652b0457f46))


### 🛠　Build System

* **cache:** update cache ([f0ed4cc](https://github.com/bluelovers/novel-opds-now/commit/f0ed4cc3d4830d0bddb52251835358ae97f0a31c))
* **cache:** update cache ([0ff1d8d](https://github.com/bluelovers/novel-opds-now/commit/0ff1d8d749b8ae7932232c4cdefba3d2cc4f33f6))
* **cache:** update cache ([1617e54](https://github.com/bluelovers/novel-opds-now/commit/1617e54970da10547978ab8f8ea8027d9b9f4ebc))
* **cache:** update cache ([60ca341](https://github.com/bluelovers/novel-opds-now/commit/60ca3418cdda5c81cb1e1bf373bcfe782519e606))
* **cache:** update cache ([b7a67b1](https://github.com/bluelovers/novel-opds-now/commit/b7a67b1d435535d6eac15db0d1e29e8b0b98332b))
* **cache:** update cache ([b9b50d6](https://github.com/bluelovers/novel-opds-now/commit/b9b50d60aeefb8f6bb35c556a50638d0f536e264))


### 🔖　Miscellaneous

* . ([b0dd8e9](https://github.com/bluelovers/novel-opds-now/commit/b0dd8e96dea8129c71344dac4b5914ed2f88927d))





## [3.0.4](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.3...novel-opds-now@3.0.4) (2021-07-05)


### 🛠　Build System

* **cache:** update cache ([75b1b95](https://github.com/bluelovers/novel-opds-now/commit/75b1b95028cf988e77ef8ae3488840208e46d0aa))


### 🔖　Miscellaneous

* . ([f075cc5](https://github.com/bluelovers/novel-opds-now/commit/f075cc57f95e0b30cce54d67e9a7ca54f07bdf94))





## [3.0.3](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.2...novel-opds-now@3.0.3) (2021-07-05)


### 🐛　Bug Fixes

* 修正防止短時間內連續 poke 相同 cid 的判定 ([180eb5d](https://github.com/bluelovers/novel-opds-now/commit/180eb5dc12c366c749a0eccaab19429e146ec7c1))
* 修正發送兩次 pubsubPublish 的問題 ([f043cb4](https://github.com/bluelovers/novel-opds-now/commit/f043cb4a630c7e82af2e3729a2ade35ada39096d))


### ✨　Features

* update fetch ([1ed9056](https://github.com/bluelovers/novel-opds-now/commit/1ed9056787a28c3cd8d2b1641971fedece87fbe1))
* showClient ([92c85d5](https://github.com/bluelovers/novel-opds-now/commit/92c85d54db95b9c272ba16430c6352a0e75046a7))
* 支援偵測客戶端是否斷線 ([4a023a3](https://github.com/bluelovers/novel-opds-now/commit/4a023a3d3abd4f58e66baecbc321cb01cf3bc304))


### 📦　Code Refactoring

* use `@demonovel/db-api` and poke ([483391d](https://github.com/bluelovers/novel-opds-now/commit/483391da3744c2839c397de434ef3fdba3f65747))
* remove old code ([72c8595](https://github.com/bluelovers/novel-opds-now/commit/72c85958ced96a44877845040948b00d18249172))
* update opds and build ([a5160c3](https://github.com/bluelovers/novel-opds-now/commit/a5160c3cb4a99b244703789c0c85fbe626ae3f90))


### 🛠　Build System

* **cache:** update cache ([403d602](https://github.com/bluelovers/novel-opds-now/commit/403d602954f13fe08c480ad4b5a9454e125f521e))
* **cache:** update cache ([439bfdd](https://github.com/bluelovers/novel-opds-now/commit/439bfddfe0e0ef28f3bd2999f5b9576e9510e7f5))


### ♻️　Chores

* remove old cache ([66ceeb3](https://github.com/bluelovers/novel-opds-now/commit/66ceeb360ad74492259ad2645c7d2b2a519c4e00))
* update deps ([98cafc0](https://github.com/bluelovers/novel-opds-now/commit/98cafc00b2490c3224035a55bf48f41e4e40649e))
* update deps ([0fdaad8](https://github.com/bluelovers/novel-opds-now/commit/0fdaad818297a53ee92c971dc1fc988bf05f009c))





## [3.0.2](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.1...novel-opds-now@3.0.2) (2021-07-04)


### ♻️　Chores

* add more info ([c9e3b6c](https://github.com/bluelovers/novel-opds-now/commit/c9e3b6c8c7a0e3f400d5dce973e84ab31400985e))





## [3.0.1](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.0...novel-opds-now@3.0.1) (2021-07-04)


### 🐛　Bug Fixes

* 修正相容性，恢復可以偵測已經存在的 IPFS 伺服器 ([c492ffb](https://github.com/bluelovers/novel-opds-now/commit/c492ffb9f97dbe53f72dad2a5f5fd60a17400ed4))





# [3.0.0](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.2.12...novel-opds-now@3.0.0) (2021-07-04)


### 🐛　Bug Fixes

* **cli:** 修正 yargs v17 的 async type 問題 ([882d418](https://github.com/bluelovers/novel-opds-now/commit/882d41863c0785ee15ce29de681217f9c2227ce0))


### ✨　Features

* make sure only poke once and update pubsub ([cccc5a4](https://github.com/bluelovers/novel-opds-now/commit/cccc5a40f4bd87922316cade2d0d40789433391d))


### 📦　Code Refactoring

* 改用 `go-ipfs` 並且追加 poke 請求與增加更多提示訊息 ([7fc84ae](https://github.com/bluelovers/novel-opds-now/commit/7fc84ae2a8cef1ba134be6bd6615b008705b9bcf))


### 🛠　Build System

* update file ([cdf30cc](https://github.com/bluelovers/novel-opds-now/commit/cdf30cc2c5f70e25c55ba5cba99077998f7bf396))
* **cache:** update cache ([1272724](https://github.com/bluelovers/novel-opds-now/commit/12727241f4726bfdae91f2fb9756644772f30f2a))


### BREAKING CHANGE

* 改用 `go-ipfs`





## [2.2.12](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.2.11...novel-opds-now@2.2.12) (2020-08-26)


### 🛠　Build System

* **cache:** update cache ([779a124](https://github.com/bluelovers/novel-opds-now/commit/779a124ef90a57806f41d9f92bb24e3548059f31))
* update typescript ([99afd16](https://github.com/bluelovers/novel-opds-now/commit/99afd16e7d42c9c54aab0c6a1e5f3420cedb7566))


### ♻️　Chores

* update cache ([2b1cf81](https://github.com/bluelovers/novel-opds-now/commit/2b1cf81b8109923d03fc0f104c0a72bf85dab762))
* **deps:** update deps ([acc4c3d](https://github.com/bluelovers/novel-opds-now/commit/acc4c3d5f2a2cdda8e8ae6acbd59e4e698a3ff21))





## [2.2.11](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.2.10...novel-opds-now@2.2.11) (2020-07-03)

**Note:** Version bump only for package novel-opds-now





## [2.2.10](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.2.9...novel-opds-now@2.2.10) (2020-07-03)


### 🐛　Bug Fixes

* 修正新版 ipfs 0.47 不支援 websocket-star 的問題 ([3cb8dfc](https://github.com/bluelovers/novel-opds-now/commit/3cb8dfc56bf92a419327d8a54dd0d71198099f6d))





## [2.2.9](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.2.8...novel-opds-now@2.2.9) (2020-07-03)

**Note:** Version bump only for package novel-opds-now





## [2.2.8](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.2.7...novel-opds-now@2.2.8) (2020-07-03)

**Note:** Version bump only for package novel-opds-now





## [2.2.7](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.2.6...novel-opds-now@2.2.7) (2020-07-03)


### ✨　Features

* 支援從網路更新 Segment 字典 ([15bbd6a](https://github.com/bluelovers/novel-opds-now/commit/15bbd6a8bcbb5ebc09de7263c7fa5d251f9d1f6d))


### ♻️　Chores

* update cache ([c25bb77](https://github.com/bluelovers/novel-opds-now/commit/c25bb777d7314c992f1e202b6c5fc91d2958931f))
* update deps ([21bb4d1](https://github.com/bluelovers/novel-opds-now/commit/21bb4d1dd0126aef6a56a3bc971ed7b259f99cfa))





## [2.2.6](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.1.37...novel-opds-now@2.2.6) (2020-06-21)


### ✨　Features

* update deps ([5397476](https://github.com/bluelovers/novel-opds-now/commit/5397476611b947397306c6eddf9b08fad544e54b))
* 增加 真白萌 opds ([0345275](https://github.com/bluelovers/novel-opds-now/commit/03452759a640b5cda9da13ef87a6ed43972ab750))
* update deps ([fece618](https://github.com/bluelovers/novel-opds-now/commit/fece6185b41128eb70930270816f25d55ac08f8d))
* update deps ([10f2314](https://github.com/bluelovers/novel-opds-now/commit/10f231412a686dd4acb46c5f67173092ac9012f7))


### 🛠　Build System

* update build ([f209481](https://github.com/bluelovers/novel-opds-now/commit/f2094818f50eb1b775f890db1a57b61b585f85e2))


### ♻️　Chores

* update cache ([c19e37b](https://github.com/bluelovers/novel-opds-now/commit/c19e37bae1f5d5579d633228c5d821dc05e4e315))
* **release:** publish ([a674f27](https://github.com/bluelovers/novel-opds-now/commit/a674f27c440b8f273efb96a5ff61a542f5c9065c))
* **release:** publish ([e3d0358](https://github.com/bluelovers/novel-opds-now/commit/e3d03582ad098cbb6cad885b61011d6e47bf30e1))
* **release:** publish ([2698c85](https://github.com/bluelovers/novel-opds-now/commit/2698c857c6b687b0fb0128f7b3bbec1337d7e055))
* **release:** publish ([760d5f8](https://github.com/bluelovers/novel-opds-now/commit/760d5f8de17190e26f9856a1b32a99d8dff37231))


### 🔖　Miscellaneous

* . ([3235d58](https://github.com/bluelovers/novel-opds-now/commit/3235d5854ecb68314a0f16be949571bae79156d1))





## [2.1.37](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.1.35...novel-opds-now@2.1.37) (2020-05-23)

**Note:** Version bump only for package novel-opds-now





## [2.1.35](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.1.34...novel-opds-now@2.1.35) (2020-04-29)

**Note:** Version bump only for package novel-opds-now





## [2.1.34](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.1.33...novel-opds-now@2.1.34) (2020-04-29)


### Bug Fixes

* try disable need `--no-shrinkwrap` ([a740472](https://github.com/bluelovers/novel-opds-now/commit/a7404727ab37d535cc708f5b9eeb4c25c0d636a8))





## [2.1.33](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.1.32...novel-opds-now@2.1.33) (2020-04-28)

**Note:** Version bump only for package novel-opds-now





## [2.1.32](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.1.31...novel-opds-now@2.1.32) (2020-04-28)


### Features

* 允許指定下載檔名 `?filename=指定名稱.epub` ([e8601b2](https://github.com/bluelovers/novel-opds-now/commit/e8601b204a06cea5cdb247b889ab8ac047c86d6d))
* 允許指定下載檔名 `?filename=指定名稱.epub` ([6801377](https://github.com/bluelovers/novel-opds-now/commit/68013776867a4415b615c0351b18a36c351b59e8))





## [2.1.31](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.1.30...novel-opds-now@2.1.31) (2020-04-26)

**Note:** Version bump only for package novel-opds-now





## [2.1.30](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.1.29...novel-opds-now@2.1.30) (2020-04-26)


### Features

* show version ([aa5a6a6](https://github.com/bluelovers/novel-opds-now/commit/aa5a6a64cd5c661e70844b0ee95df3b48b0d5a01))





## [2.1.29](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@2.1.28...novel-opds-now@2.1.29) (2020-04-26)

**Note:** Version bump only for package novel-opds-now
