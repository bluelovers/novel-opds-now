# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.22](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.21...novel-opds-now@3.0.22) (2021-07-17)


### 🐛　Bug Fixes

* HTTPError: /novel-opds-now/dmzj/2640 is a directory, use -r to remove directories ([44054a2](https://github.com/bluelovers/novel-opds-now/commit/44054a289e77b35327b540291b32ac124cd2b525))
* TypeError: Cannot read property 'cid' of null ([caa20e8](https://github.com/bluelovers/novel-opds-now/commit/caa20e82445ad824d96384377da1f1c259dd7e2c))
* avoid same `addMutableFileSystem` run multiple times ([8b2c946](https://github.com/bluelovers/novel-opds-now/commit/8b2c946245542d8aefce5076870d390b86b1d051))


### ✨　Features

* 雜七雜八的切割 與 每次從 calibre 取得書籍時 也一併推送到 IPFS ([d963e7d](https://github.com/bluelovers/novel-opds-now/commit/d963e7d51b7fd3e55ce57a1364891cb7f2619d9b))


### 🛠　Build System

* **cache:** update cache ([93a66f4](https://github.com/bluelovers/novel-opds-now/commit/93a66f49ba687364b2ec6ee89c818cc571708a47))





## [3.0.21](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.20...novel-opds-now@3.0.21) (2021-07-16)


### 🐛　Bug Fixes

* **ipfs:** promise is not work for async iterator ([4c34fbd](https://github.com/bluelovers/novel-opds-now/commit/4c34fbd94cc669fada8e582b1ee3ae0a300674d5))


### ✨　Features

* update initMutableFileSystem ([c013412](https://github.com/bluelovers/novel-opds-now/commit/c013412e46c6d70661f70a3eb7a43a2d3bf24031))


### 🛠　Build System

* **cache:** update cache ([88abd1e](https://github.com/bluelovers/novel-opds-now/commit/88abd1e464772f4b87b48e8b673d5348b4e414de))
* **cache:** update cache ([cf1efa8](https://github.com/bluelovers/novel-opds-now/commit/cf1efa8380ca35ccd13b10bdec97fa529b22af45))





## [3.0.20](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.19...novel-opds-now@3.0.20) (2021-07-15)


### 🛠　Build System

* **cache:** update cache ([08ce993](https://github.com/bluelovers/novel-opds-now/commit/08ce99324500e14b8529820afcb317cd3c49241b))





## [3.0.19](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.18...novel-opds-now@3.0.19) (2021-07-15)


### ✨　Features

* better calibre name ([2f665fe](https://github.com/bluelovers/novel-opds-now/commit/2f665feee24cfe4e492bbbb2b1e8000ba29b9092))


### 🛠　Build System

* **cache:** update cache ([df4d906](https://github.com/bluelovers/novel-opds-now/commit/df4d906562679791535c4cfdc213694cb0e918a0))





## [3.0.18](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.17...novel-opds-now@3.0.18) (2021-07-14)


### 🐛　Bug Fixes

* share.ipfs.io not support path ([744ab79](https://github.com/bluelovers/novel-opds-now/commit/744ab79753d98d1b8d6331f815cb272896263a3e))


### ✨　Features

* 啟動時抓取 `Hello from novel-opds-now Checker` 來試圖搜尋擁有此檔案的節點 ([d5f5de2](https://github.com/bluelovers/novel-opds-now/commit/d5f5de204c22a76823291811434f5efbef86d815))
* 自動備份 peer id ([feac720](https://github.com/bluelovers/novel-opds-now/commit/feac720921e401847c5bcbd8ac5cfa95c6e2d131))
* 只有當 HELLO_AGAIN 時才傳遞 getMixinPeers ([bb337b1](https://github.com/bluelovers/novel-opds-now/commit/bb337b1b24e52a2c9d21ad6f381124e5480f9d0d))


### 📦　Code Refactoring

* code splitting ([8b95459](https://github.com/bluelovers/novel-opds-now/commit/8b9545967c929a564ea418ce6e4070b3381f29ad))


### 🛠　Build System

* **cache:** update cache ([6b4dfb1](https://github.com/bluelovers/novel-opds-now/commit/6b4dfb1697155805ec874190531466039e219cd7))





## [3.0.17](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.16...novel-opds-now@3.0.17) (2021-07-13)


### ✨　Features

* 整合 `calibre-server` 現在可透過 `/opds/calibre` 來瀏覽 calibre 內的書庫 ([7968b3d](https://github.com/bluelovers/novel-opds-now/commit/7968b3d942c9950ddc0f051acb4929f7fb6a33bf))


### 🛠　Build System

* **cache:** update cache ([7fa98f9](https://github.com/bluelovers/novel-opds-now/commit/7fa98f9ac91b95744c2b646762febb00def7fa75))





## [3.0.16](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.15...novel-opds-now@3.0.16) (2021-07-12)


### 🐛　Bug Fixes

* too many task ([2e3779c](https://github.com/bluelovers/novel-opds-now/commit/2e3779cf6147fc48d22e2340d2bfdaa52148c462))


### 🛠　Build System

* **cache:** update cache ([ef7c924](https://github.com/bluelovers/novel-opds-now/commit/ef7c9243452f306de3f6f5ff21cf29ad7bd7909d))





## [3.0.15](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.14...novel-opds-now@3.0.15) (2021-07-12)


### 🐛　Bug Fixes

* too many task ([652aba2](https://github.com/bluelovers/novel-opds-now/commit/652aba2fcc14c6300dbd1ba01078b9c27b14f181))


### 🛠　Build System

* **cache:** update cache ([0073466](https://github.com/bluelovers/novel-opds-now/commit/007346699bed51289ebc3aa05faf6ccc48f4a51f))





## [3.0.14](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.13...novel-opds-now@3.0.14) (2021-07-12)


### ✨　Features

* use `source-map-support/register` ([eaf117a](https://github.com/bluelovers/novel-opds-now/commit/eaf117a6f9ce12f6e80c01633302cf0c977ff856))


### 🛠　Build System

* **cache:** update cache ([6abb3b6](https://github.com/bluelovers/novel-opds-now/commit/6abb3b658ec8fe7d7b33d9add57afe5dedaa2688))





## [3.0.13](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.12...novel-opds-now@3.0.13) (2021-07-12)


### 🐛　Bug Fixes

* update task for demonovel ([257f1d0](https://github.com/bluelovers/novel-opds-now/commit/257f1d0e7d2a2fef338e6c3ad2661ac04402177e))


### 🛠　Build System

* **cache:** update cache ([3cdc230](https://github.com/bluelovers/novel-opds-now/commit/3cdc2302ed8bd427e9b88aad39f170f600c1a4f6))
* **cache:** update cache ([c9a7b5d](https://github.com/bluelovers/novel-opds-now/commit/c9a7b5d9029f050329a6e2fc8a4255324d0d1424))





## [3.0.12](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.11...novel-opds-now@3.0.12) (2021-07-12)


### 🐛　Bug Fixes

* 防止自己推送給自己 ([bbc5faf](https://github.com/bluelovers/novel-opds-now/commit/bbc5faf123d694162bd73b134897643a4c29a2a5))
* 當檔案存在並且 cid 相同時就忽略複製 ([1234b7f](https://github.com/bluelovers/novel-opds-now/commit/1234b7fc98fc97f4a3eff6dc34e55b96dd42c797))


### ✨　Features

* poke 定位到 子路徑 ([a1562a0](https://github.com/bluelovers/novel-opds-now/commit/a1562a03f23924dd8769b3742b424476b7255d91))
* 防止 stop 時 connect peers 仍然在執行導致沒有關閉 ([5faa603](https://github.com/bluelovers/novel-opds-now/commit/5faa6034323778181ecd1e87aa92173804573a4e))
* 增強 pubsub 節點之間的連通性 ([12a5b52](https://github.com/bluelovers/novel-opds-now/commit/12a5b525e636eec52ca6f582e510687e1e976982))


### 🛠　Build System

* **cache:** update cache ([5621c70](https://github.com/bluelovers/novel-opds-now/commit/5621c703c21eeb6ca083b79b2675c43dbee834db))


### 🔖　Miscellaneous

* . ([266e767](https://github.com/bluelovers/novel-opds-now/commit/266e7673a9dc557ff18649eed4c14fabbd485673))





## [3.0.11](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.10...novel-opds-now@3.0.11) (2021-07-11)


### 🛠　Build System

* **cache:** update cache ([ea44da4](https://github.com/bluelovers/novel-opds-now/commit/ea44da4145bb53b968e2490acb4014cc0e083f15))


### ♻️　Chores

* **deps:** update deps ([2411d49](https://github.com/bluelovers/novel-opds-now/commit/2411d494aa6d4c5825be61e4bb059613de80d384))





## [3.0.10](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.9...novel-opds-now@3.0.10) (2021-07-11)


### 🐛　Bug Fixes

* **install:** fix postinstall ([16fb535](https://github.com/bluelovers/novel-opds-now/commit/16fb535f42f270911300f2012f1578e824dae79b))


### ✨　Features

* 增加顯示書名 ([213958d](https://github.com/bluelovers/novel-opds-now/commit/213958d0e3aa6938abf635f0519a4af16eb9d037))
* 同一本小說在打包結束前只執行一次任務，不多次執行 ([4b1e467](https://github.com/bluelovers/novel-opds-now/commit/4b1e467ca63c42ab32046b4628d0951d30cff15f))


### 🛠　Build System

* **cache:** update cache ([e52481a](https://github.com/bluelovers/novel-opds-now/commit/e52481ae07af963324a475dba83f3707e460a64d))


### 🔖　Miscellaneous

* . ([926409a](https://github.com/bluelovers/novel-opds-now/commit/926409a208941e6b6b8bdd0f3a2f4f795783f0bd))
* . ([5a5daca](https://github.com/bluelovers/novel-opds-now/commit/5a5daca8473008bd1ae10a276e3641759b39d3d0))
* **install:** add `postinstall` for check ipfs is downloaded ([1a1edbc](https://github.com/bluelovers/novel-opds-now/commit/1a1edbc9545f91eb0184475d81a553d6ee89af3d))





## [3.0.9](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.8...novel-opds-now@3.0.9) (2021-07-08)


### 🐛　Bug Fixes

* 不小心改錯 tmp path ([e164298](https://github.com/bluelovers/novel-opds-now/commit/e164298f5a18fa253631332689ec81cec188ee3c))
* updateSegmentCache 沒有正確觸發強制更新 ([69132ad](https://github.com/bluelovers/novel-opds-now/commit/69132ad7135bfa24a59385345c46e0ef157024c8))
* 123.456.78.90 不是 ip 只是範例 ([4d9fef5](https://github.com/bluelovers/novel-opds-now/commit/4d9fef55cb9e8b2f98f463fceb0b5be1b0a3396d))


### ✨　Features

* 提早刪除 tmp ([1d28691](https://github.com/bluelovers/novel-opds-now/commit/1d2869189166d2325f9b4de8cac2e07a1ecb81e3))
* 延長上傳 timeout ([3be47b2](https://github.com/bluelovers/novel-opds-now/commit/3be47b2f16abd52ae2104d09d03c99022c19f21e))
* 改善訊息 ([3c34017](https://github.com/bluelovers/novel-opds-now/commit/3c340177f76782693adf14e121ad94dec6a75e0c))
* display public-ip ([e8768fe](https://github.com/bluelovers/novel-opds-now/commit/e8768fec900ae8f988ac4a5e860196d58af4f9ca))
* error => warn ([14510ab](https://github.com/bluelovers/novel-opds-now/commit/14510aba975e8ee8e85f866f81b336925bf2d088))
* 連接到已經存在的 ipfs 伺服器時，不執行 stop 指令 ([14fdf4a](https://github.com/bluelovers/novel-opds-now/commit/14fdf4adcd0dd3bc208891c0654eb8b5d95c52d9))


### 📦　Code Refactoring

* move ([891c9c9](https://github.com/bluelovers/novel-opds-now/commit/891c9c94876e455442ecc4013f5c5e860a52e5e7))


### 🛠　Build System

* **cache:** update cache ([63b1b0c](https://github.com/bluelovers/novel-opds-now/commit/63b1b0cdeac32432a7fa055f31095f4fda781df4))
* **cache:** update cache ([e5687ec](https://github.com/bluelovers/novel-opds-now/commit/e5687ec663a9c1d9f6f93ecf54d546e5b7280b8b))


### ♻️　Chores

* update deps ([116e9d7](https://github.com/bluelovers/novel-opds-now/commit/116e9d7fa6160a0dab403dc0a5ca88c32712b3c2))
* update deps ([3a4f09d](https://github.com/bluelovers/novel-opds-now/commit/3a4f09d7ca416832a59d57a3af0d17632420c2d2))


### 🔖　Miscellaneous

* . ([5b541a6](https://github.com/bluelovers/novel-opds-now/commit/5b541a6ca6e525f6000988aa2f6c1b7696bb69c6))


### TODO

* 修改為直接先判斷是否過期，如果過期則同時下載緩存以及從原始網站打包





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
