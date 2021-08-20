# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.52](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.51...novel-opds-now@3.0.52) (2021-08-20)


### 🐛　Bug Fixes

* 當有指定 port 時，不再試圖尋找可用的 port ([2eb31d9](https://github.com/bluelovers/novel-opds-now/commit/2eb31d916daafb45367bbd1b55e01829fa4c7a33))
* Input array must contain at least 1 items but contains only 0 items ([99f8189](https://github.com/bluelovers/novel-opds-now/commit/99f818963b75f76acd67a17c13642f7f04d3f68b))
* avoid loop call ([94fd18c](https://github.com/bluelovers/novel-opds-now/commit/94fd18c9e6b1ca34b13a775f1330642dc11ca6bd))
* update cid ([506e790](https://github.com/bluelovers/novel-opds-now/commit/506e7904e2ee580c083b4a06d08e15a387295258))
* add timeout for ipfs.files.ls ([e66c420](https://github.com/bluelovers/novel-opds-now/commit/e66c420154c3d49d75476acad1994100286f56e5))
* 防止無限試圖啟動 IPFS 伺服器 ([e25112f](https://github.com/bluelovers/novel-opds-now/commit/e25112fab2393e2ac9f55a8a6e94c85505a7acf6))
* 沒有書名的會顯示路徑 ([34f904f](https://github.com/bluelovers/novel-opds-now/commit/34f904f0dcefef6f983f860ea2086b5708454c21))
* 排序 novel-opds-now.cids.json 內容 ([dcb3ede](https://github.com/bluelovers/novel-opds-now/commit/dcb3ede5cc2d5c6a3e32ea7904b62dc65d596f08))


### ✨　Features

* update expire ([e8524c2](https://github.com/bluelovers/novel-opds-now/commit/e8524c2181617fdbd8c5518d22946fc4ed135654))


### 📦　Code Refactoring

* use `@lazy-ipfs/make-url-list` ([2932673](https://github.com/bluelovers/novel-opds-now/commit/2932673a12eeb416baa2fdb52bc09defe4ea19bd))


### 🛠　Build System

* **cache:** update cache ([b896b91](https://github.com/bluelovers/novel-opds-now/commit/b896b91ebe7691db48403be71a537ba10178c514))


### ⚙️　Continuous Integration

* update poke script ([90110f4](https://github.com/bluelovers/novel-opds-now/commit/90110f4234f16fd808a453554f640788ce11b9ca))
* update poke script ([f0734e1](https://github.com/bluelovers/novel-opds-now/commit/f0734e148501b2260f199e9caf54d4b322f5214c))
* 將 cids 分成 七份 來執行 避免一次執行太多 ([c9816e7](https://github.com/bluelovers/novel-opds-now/commit/c9816e7679ad4530a100adf15bd627faf4dee394))


### ♻️　Chores

* update timeout ([747d3e3](https://github.com/bluelovers/novel-opds-now/commit/747d3e3a833441ac7bade3fdbcb9186b7c9b5271))
* remove `Hello from novel-opds-now Checker.txt` from `build-in-cids.txt` ([d0be885](https://github.com/bluelovers/novel-opds-now/commit/d0be885838cff22eef132fc2eb12c7addf663065))
* . ([46da79e](https://github.com/bluelovers/novel-opds-now/commit/46da79efa04eb3e7dc3d8847242cf1f5f1a7d904))
* **deps:** update deps ([6648f96](https://github.com/bluelovers/novel-opds-now/commit/6648f964c2598900f6c144bafa1374ec0e91ae59))


### 🔖　Miscellaneous

* . ([4f6b432](https://github.com/bluelovers/novel-opds-now/commit/4f6b432a3eafd754b0b7bf911de9009034a07c28))
* . ([bf7d659](https://github.com/bluelovers/novel-opds-now/commit/bf7d6595cbe2855b21d1e5d185e499e89f922cfd))
* . ([44a80ea](https://github.com/bluelovers/novel-opds-now/commit/44a80ea805d009914564e04b5e22ba8e6a4b0ded))
* . ([ceb783d](https://github.com/bluelovers/novel-opds-now/commit/ceb783de1a4e7bd5540768d51382d7ad201fd05c))
* . ([44bc8a5](https://github.com/bluelovers/novel-opds-now/commit/44bc8a5b459e833fd76650a323f6578508d6dcee))
* . ([65ddd09](https://github.com/bluelovers/novel-opds-now/commit/65ddd095f822a68a40129ec53b169134ff4e6158))
* . ([db4486e](https://github.com/bluelovers/novel-opds-now/commit/db4486e513c7904608caa4e157c912af77d1d2fa))
* . ([8e9d946](https://github.com/bluelovers/novel-opds-now/commit/8e9d9461b4b07ab1ab93d78927d28de47f3c14b9))
* . ([9f82603](https://github.com/bluelovers/novel-opds-now/commit/9f82603583bb78f12e655e807011de5326e35b11))
* . ([2f902ad](https://github.com/bluelovers/novel-opds-now/commit/2f902ad19879819e0783ac57c5069d9406d6f05f))
* . ([727d45e](https://github.com/bluelovers/novel-opds-now/commit/727d45e7bb67e06e4aa53ba70b51e61fdae4d07c))
* . ([509dd27](https://github.com/bluelovers/novel-opds-now/commit/509dd271b7ba6a68b9706839638ba5661ea59766))


### BREAKING CHANGE

* 當有指定 port 時，不再試圖尋找可用的 port





## [3.0.51](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.50...novel-opds-now@3.0.51) (2021-07-30)


### 🛠　Build System

* **cache:** update cache ([95721b7](https://github.com/bluelovers/novel-opds-now/commit/95721b7a2fd08701db72ead09a77add65c85bbfb))
* **cache:** update cache ([7eb52e6](https://github.com/bluelovers/novel-opds-now/commit/7eb52e675c8323214ff7ab4f43110a3d435c24fa))





## [3.0.50](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.49...novel-opds-now@3.0.50) (2021-07-30)


### 🐛　Bug Fixes

* update cid ([a738a38](https://github.com/bluelovers/novel-opds-now/commit/a738a38d80e4a6843951613831b67512080dab8e))


### ✨　Features

* 雜七雜八 ([b0af9c2](https://github.com/bluelovers/novel-opds-now/commit/b0af9c21aaf8900b359fba0792e988506f430d75))
* write bak to mfs ([d42c1cb](https://github.com/bluelovers/novel-opds-now/commit/d42c1cb747c51796da6f9d267d407b4b182f0929))


### 🛠　Build System

* **cache:** update cache ([23be6ca](https://github.com/bluelovers/novel-opds-now/commit/23be6cadcf40fd29e11090b238cab5f904124b7e))


### 🔖　Miscellaneous

* . ([b014101](https://github.com/bluelovers/novel-opds-now/commit/b014101f26b44a0c887d08958e7febeefa8f1070))





## [3.0.49](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.48...novel-opds-now@3.0.49) (2021-07-29)


### 🐛　Bug Fixes

* npm pack ignore ([a37abc2](https://github.com/bluelovers/novel-opds-now/commit/a37abc21e557e3c741722ec22bbed60d397f73fc))


### 🛠　Build System

* **cache:** update cache ([cdf1db6](https://github.com/bluelovers/novel-opds-now/commit/cdf1db626cedbc56baf7afec08987eec0180cd2c))





## [3.0.48](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.47...novel-opds-now@3.0.48) (2021-07-29)


### 🐛　Bug Fixes

* TypeError: Cannot read property 'id' of null ([b70d8ca](https://github.com/bluelovers/novel-opds-now/commit/b70d8ca848b762fc721b216aaf2ff316be5ac369))
* 修正 deepEntryListMap 內的錯誤資料 以及 修正 firebase 不能一次性上傳大量資料 ([e4a8efc](https://github.com/bluelovers/novel-opds-now/commit/e4a8efc7bd81f38d67f5bedc53891df7642c12cb))
* 改用 sync 版本來試圖解決不明原因造成 DeepEntryListMap 檔案有可能變成空的 ([14714ca](https://github.com/bluelovers/novel-opds-now/commit/14714ca86906b7f29772d33d984572dfd9c7b2f8))


### ✨　Features

* unhandledRejection ([e457d80](https://github.com/bluelovers/novel-opds-now/commit/e457d801e8a0021ebef6cb30d5e95fd3169f1ec1))


### 🛠　Build System

* **cache:** update cache ([636eae7](https://github.com/bluelovers/novel-opds-now/commit/636eae7199d5ab1327249ee8cd9b8635ac19a2d3))


### ⚙️　Continuous Integration

* update poke script ([8a6bde9](https://github.com/bluelovers/novel-opds-now/commit/8a6bde9bfee60b623771ab839e270d2bc5e87039))


### 🔖　Miscellaneous

* . ([5f3c5c8](https://github.com/bluelovers/novel-opds-now/commit/5f3c5c8ffbbd0d1db2a35a2799bce736397b3dec))
* . ([05633e4](https://github.com/bluelovers/novel-opds-now/commit/05633e412b1e150ba6512d45fb3fa18ffda3c3cf))
* . ([e078107](https://github.com/bluelovers/novel-opds-now/commit/e0781071d9959c4033cc324fc44b5d75075e7670))
* . ([55100f3](https://github.com/bluelovers/novel-opds-now/commit/55100f3331ed888683b2bd8b60be7899c32ccdc7))
* . ([221ec14](https://github.com/bluelovers/novel-opds-now/commit/221ec147e5ee24062d9d275bfe74ace2c0daa583))





## [3.0.47](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.46...novel-opds-now@3.0.47) (2021-07-27)


### ✨　Features

* update deepList for more debug message ([5af6159](https://github.com/bluelovers/novel-opds-now/commit/5af6159864eb38e1371c4d6c447a909d411d9261))
* 修改過期判定 除了 esjzone 以外 全部都改為 30 天 ([eb45782](https://github.com/bluelovers/novel-opds-now/commit/eb45782397bc04e64b83b2ca0657f8b27700b3c4))


### 📦　Code Refactoring

* move { test/novel-opds-now.cids.json => test/data/novel-opds-now.cids.json } ([a8dc9d9](https://github.com/bluelovers/novel-opds-now/commit/a8dc9d9aed6594b3eabeacdcb1be510d1c722c75))


### 📚　Documentation

* 下載任何支援的網站 ([b4a00dc](https://github.com/bluelovers/novel-opds-now/commit/b4a00dce7440d0f997635457b241c282b94b0664))
* add 於 IPFS 管理介面導入 CID 的教學 ([be0458b](https://github.com/bluelovers/novel-opds-now/commit/be0458b38aac1247097ec2489d04782bf407d5eb))


### 🛠　Build System

* **cache:** update cache ([68ed592](https://github.com/bluelovers/novel-opds-now/commit/68ed5926f667d6edc9e629dc4e5dbd5dced7258b))
* **cache:** update cache ([2bdf7ac](https://github.com/bluelovers/novel-opds-now/commit/2bdf7ac02bfa1827f51458107d7654241dd39f72))


### 🔖　Miscellaneous

* . ([9754df1](https://github.com/bluelovers/novel-opds-now/commit/9754df1aea11b7a94cebf929703db3a9f7a8f236))
* . ([5e733a8](https://github.com/bluelovers/novel-opds-now/commit/5e733a8ede67a9896870ddd5f1208bf8af55d2ba))
* . ([dba9a48](https://github.com/bluelovers/novel-opds-now/commit/dba9a48d6b51cea24f14108a8098a57fa4630de6))
* . ([ec98352](https://github.com/bluelovers/novel-opds-now/commit/ec9835238af4b6ca0e18318bba3cf27b95b08646))





## [3.0.46](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.45...novel-opds-now@3.0.46) (2021-07-26)


### 🛠　Build System

* **cache:** update cache ([35a0315](https://github.com/bluelovers/novel-opds-now/commit/35a031522bffb577f98b0c4439611b8a4fd2c1ce))





## [3.0.45](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.43...novel-opds-now@3.0.45) (2021-07-26)


### 🐛　Bug Fixes

* check newEntryListMap.size ([d2bcc40](https://github.com/bluelovers/novel-opds-now/commit/d2bcc40d7cdb3f750e09a13a62dea5fbd470b189))


### 🛠　Build System

* **cache:** update cache ([9c12268](https://github.com/bluelovers/novel-opds-now/commit/9c12268bd824a4b3b288d7288ba506d9dd0a37a9))
* **cache:** update cache ([e961d5b](https://github.com/bluelovers/novel-opds-now/commit/e961d5b9b8cccf2165f53c89390be0791191eec5))





## [3.0.43](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.42...novel-opds-now@3.0.43) (2021-07-26)


### ✨　Features

* 優化 deepEntryListMap ([d0f0ba4](https://github.com/bluelovers/novel-opds-now/commit/d0f0ba483ccc60c828c7e7bcefe184aaeb9e8663))


### 🛠　Build System

* **cache:** update cache ([ebd588a](https://github.com/bluelovers/novel-opds-now/commit/ebd588a422f9956822bc7926776d8af44df3d215))


### 🔖　Miscellaneous

* . ([b149cb7](https://github.com/bluelovers/novel-opds-now/commit/b149cb7f901818bfa6b298ec16081a308d6d7dea))





## [3.0.42](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.41...novel-opds-now@3.0.42) (2021-07-25)


### ✨　Features

* 延長過期時間，減少無意義的多次打包 ([89ee3f4](https://github.com/bluelovers/novel-opds-now/commit/89ee3f47199e9727487f93ce0c7868fb908992f5))


### 🛠　Build System

* **cache:** update cache ([63d4aa1](https://github.com/bluelovers/novel-opds-now/commit/63d4aa160924b21232d5bd3ef91a2ec27dd62c92))


### ⚙️　Continuous Integration

* add ci:run:poke-all-cache-cid ([4409ca4](https://github.com/bluelovers/novel-opds-now/commit/4409ca4be42a1b88ea289530942edbf2dc9857fc))





## [3.0.41](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.40...novel-opds-now@3.0.41) (2021-07-25)


### 🐛　Bug Fixes

* 修正 calibre 搜尋時 沒有任何符合的結果時 會出錯的問題 ([4a727b0](https://github.com/bluelovers/novel-opds-now/commit/4a727b0aef3899df98ede54219b27c35951ff8ae))


### ✨　Features

* 將 mfs 節點內所有 id 記錄起來 方便日後製作搜尋功能 ([d1183eb](https://github.com/bluelovers/novel-opds-now/commit/d1183ebda69582a5fd56012cec7bc991e6c603ef))


### 🛠　Build System

* **cache:** update cache ([2a798b8](https://github.com/bluelovers/novel-opds-now/commit/2a798b85e69cc4f8b4eec8c112e70c2a633c895d))





## [3.0.40](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.39...novel-opds-now@3.0.40) (2021-07-25)


### 🐛　Bug Fixes

* 修正 部分小說網站 沒有分析 `ruby` 標籤的問題 ([611ba25](https://github.com/bluelovers/novel-opds-now/commit/611ba25bed2537482ecfbe9a347bb9df25127169))


### 🛠　Build System

* **cache:** update cache ([a048bd4](https://github.com/bluelovers/novel-opds-now/commit/a048bd404f04901bcce5157a7cc2ce84f588805c))


### 🔖　Miscellaneous

* . ([a68f8c6](https://github.com/bluelovers/novel-opds-now/commit/a68f8c630c3788d628fd03571d0404d1a8e4a08a))





## [3.0.39](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.38...novel-opds-now@3.0.39) (2021-07-23)


### 🛠　Build System

* **cache:** update cache ([dd14928](https://github.com/bluelovers/novel-opds-now/commit/dd14928de47b54339aafeb02d8fb4668eaa6643d))





## [3.0.38](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.37...novel-opds-now@3.0.38) (2021-07-23)


### 🐛　Bug Fixes

* **search:** 修正 demonovel 在修正 uuid 之後 導致無法搜尋的 bug ([8377af8](https://github.com/bluelovers/novel-opds-now/commit/8377af862c22d1ca9f7fbd424ef2ee0752bda8df))


### 🛠　Build System

* **cache:** update cache ([2f8aacd](https://github.com/bluelovers/novel-opds-now/commit/2f8aacd1943c96800dcdc3c4713a0d0e6113b184))





## [3.0.37](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.36...novel-opds-now@3.0.37) (2021-07-23)


### 🐛　Bug Fixes

* update `poke-ipfs` for support rejectUnauthorized = false ([186f458](https://github.com/bluelovers/novel-opds-now/commit/186f4583a1822e1a9ccdbe31c536b004bd244d1b))


### ✨　Features

* 改善 mfs ([eacd027](https://github.com/bluelovers/novel-opds-now/commit/eacd027635570cb5ca58806dba1c98947d081822))
* calibre 支援搜尋 , 並且讓靜讀天下將 calibre 下不同書庫的同名書 視為不同書籍 ([7a15e98](https://github.com/bluelovers/novel-opds-now/commit/7a15e98a6651778beb45334a1a009f87c2ad22b2))


### 🛠　Build System

* **cache:** update cache ([bd2bea8](https://github.com/bluelovers/novel-opds-now/commit/bd2bea82d3bfeaddffc6a44b4b9392d20e2308f5))


### 🔖　Miscellaneous

* . ([da34c16](https://github.com/bluelovers/novel-opds-now/commit/da34c16acae9b75720a7c0367233b84769438132))
* . ([dfa94c1](https://github.com/bluelovers/novel-opds-now/commit/dfa94c13c83e0e93e103050edcc215cafa9cf23b))





## [3.0.36](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.35...novel-opds-now@3.0.36) (2021-07-21)


### 🐛　Bug Fixes

* bug of check files ([b67eaa7](https://github.com/bluelovers/novel-opds-now/commit/b67eaa75d1a439582348eda65f36ccdda06bdc26))


### 🛠　Build System

* **cache:** update cache ([3e8de0a](https://github.com/bluelovers/novel-opds-now/commit/3e8de0af6ca826d96ac4424cf86017c1dd71638f))





## [3.0.35](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.34...novel-opds-now@3.0.35) (2021-07-21)


### ✨　Features

* add get ipfs from cache , avoid restart ipfs after it stop ([97741fe](https://github.com/bluelovers/novel-opds-now/commit/97741fe7ea2e09821e549f83b5fb9db6c575b826))
* add globalWaiting ([5511a77](https://github.com/bluelovers/novel-opds-now/commit/5511a77ce0b44f8fbaae6b1190c80ad65b4cf12d))


### 📦　Code Refactoring

* use `globalWaiting` ([e410cae](https://github.com/bluelovers/novel-opds-now/commit/e410cae50216821b4e237644a40b48d572969af6))


### 🛠　Build System

* **cache:** update cache ([1c3fc0c](https://github.com/bluelovers/novel-opds-now/commit/1c3fc0c8147429731f36b06673cc1265592c8567))
* **cache:** update cache ([31b380a](https://github.com/bluelovers/novel-opds-now/commit/31b380ac9a3547262fede25a1b047ce963d03a4d))


### ♻️　Chores

* 改善訊息顯示 ([147e1f3](https://github.com/bluelovers/novel-opds-now/commit/147e1f30c1081bae1feee77bcbb5c88dacced1a7))
* **deps:** update deps ([d6f8bf7](https://github.com/bluelovers/novel-opds-now/commit/d6f8bf71bcdbe810ca23fd51882d70e8e430d909))





## [3.0.34](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.33...novel-opds-now@3.0.34) (2021-07-20)


### ✨　Features

* 防止 `./test/.peers.mixin.txt` 無限增加 ([6bc68cd](https://github.com/bluelovers/novel-opds-now/commit/6bc68cdb777f2144eb5becbb04a539c5bbaa9eac))


### 📦　Code Refactoring

* 將過時的 gun 時期的 `base64` 類型由 `string` 改為 `Buffer` 但保持名稱不變 ([12addec](https://github.com/bluelovers/novel-opds-now/commit/12addec73355b495d18841bd09107c9637259b57))
* 優化下載 ([152110d](https://github.com/bluelovers/novel-opds-now/commit/152110d8456cb0d5bdb46c9a66a6ed47a429e583))


### 🛠　Build System

* **cache:** update cache ([3f73027](https://github.com/bluelovers/novel-opds-now/commit/3f73027dcd87297bfd36bfb6836be7ef3299287e))


### 🔖　Miscellaneous

* . ([46f9173](https://github.com/bluelovers/novel-opds-now/commit/46f91734c3bca8350f94de7e9454ee78e0eae331))


### BREAKING CHANGE

* `base64` 現在是 `Buffer` 而非 `string`





## [3.0.33](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.32...novel-opds-now@3.0.33) (2021-07-20)


### ✨　Features

* use `unlinkIPFSApiAsync` ([05e2da3](https://github.com/bluelovers/novel-opds-now/commit/05e2da31df7c378f96fe52d1bf025cc1e7f693a7))
* add `pokeRoot` ([f350e3d](https://github.com/bluelovers/novel-opds-now/commit/f350e3dd718e10b52b9ccbd5baa715b4877bc4a6))


### 📦　Code Refactoring

* use `import { ipfsFilesCopy } from '@lazy-ipfs/compatible-files';` ([14f8e28](https://github.com/bluelovers/novel-opds-now/commit/14f8e28fe90094e78a54a8cf665a1061f13bc3c3))


### 🛠　Build System

* **cache:** update cache ([a5214af](https://github.com/bluelovers/novel-opds-now/commit/a5214af70e3e0bb5b9af489e1eaf7891d14d6ed0))





## [3.0.32](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.31...novel-opds-now@3.0.32) (2021-07-19)


### 🛠　Build System

* **cache:** update cache ([e780b98](https://github.com/bluelovers/novel-opds-now/commit/e780b9850ed95d95f69e5969d14c8f9305bd248d))


### 🔖　Miscellaneous

* . ([5090471](https://github.com/bluelovers/novel-opds-now/commit/50904715802b63f40af2e5b39a4e98c0d901738a))





## [3.0.31](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.30...novel-opds-now@3.0.31) (2021-07-18)


### 🐛　Bug Fixes

* can't replace from undefined ([e20824b](https://github.com/bluelovers/novel-opds-now/commit/e20824b4882abe8868df2179981651922f3cd1ec))


### ✨　Features

* save peer ([bf24309](https://github.com/bluelovers/novel-opds-now/commit/bf243099b68528bba2a46113466fe10aedb225e2))


### 📦　Code Refactoring

* **calibre:** update calibre router ([57cfda2](https://github.com/bluelovers/novel-opds-now/commit/57cfda2962b7f5136101b85fe4e664b6da1c2c13))


### 🛠　Build System

* **cache:** update cache ([8820d78](https://github.com/bluelovers/novel-opds-now/commit/8820d78b94f95115d388856fe48d2d427219dd47))


### BREAKING CHANGE

* **calibre:** old path will not work





## [3.0.30](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.29...novel-opds-now@3.0.30) (2021-07-18)


### 🐛　Bug Fixes

* 防錯 ([4cf5ab1](https://github.com/bluelovers/novel-opds-now/commit/4cf5ab12c3660a4f9d7b2d3bcde3d36244ed88e3))


### 🛠　Build System

* **cache:** update cache ([18f1c94](https://github.com/bluelovers/novel-opds-now/commit/18f1c9414ac26238d390b6f61f39038e6e08ba3e))





## [3.0.29](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.28...novel-opds-now@3.0.29) (2021-07-18)


### 🛠　Build System

* **cache:** update cache ([e5c8df6](https://github.com/bluelovers/novel-opds-now/commit/e5c8df6c0fc9a456cc7fb5574d3b8e702de64248))





## [3.0.28](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.27...novel-opds-now@3.0.28) (2021-07-18)


### ✨　Features

* calibre 支援 漫畫書檔案 ([2ee3108](https://github.com/bluelovers/novel-opds-now/commit/2ee3108d0b3f70b3632c45892de843074ef99a64))


### 🛠　Build System

* **cache:** update cache ([8c95cfd](https://github.com/bluelovers/novel-opds-now/commit/8c95cfd1e77f84248e12ca59be2c8cff7b3200e2))





## [3.0.27](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.26...novel-opds-now@3.0.27) (2021-07-18)


### 🐛　Bug Fixes

* **cli:** 防止因為環境問題無法載入 `source-map-support/register` ([dbe754c](https://github.com/bluelovers/novel-opds-now/commit/dbe754c110bd11e6124fabccc27b3cdcdc4430dd))


### ✨　Features

* update hello init ([569470e](https://github.com/bluelovers/novel-opds-now/commit/569470ed676fcb1cd886473ec86873914ec38900))
* add msg ([268c047](https://github.com/bluelovers/novel-opds-now/commit/268c04783c11990e1a7a5d211c3bdfaa26372bd6))


### 🛠　Build System

* **cache:** update cache ([08cf274](https://github.com/bluelovers/novel-opds-now/commit/08cf274f6d754188acedaca2e3e5d6955497c73d))





## [3.0.26](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.25...novel-opds-now@3.0.26) (2021-07-18)


### 🛠　Build System

* **cache:** update cache ([d7e8ecd](https://github.com/bluelovers/novel-opds-now/commit/d7e8ecd093ae10dfa0914037a449d08f57295884))





## [3.0.25](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.24...novel-opds-now@3.0.25) (2021-07-18)


### 🐛　Bug Fixes

* wrong siteID ([7631b36](https://github.com/bluelovers/novel-opds-now/commit/7631b3671dcfd2d5b4ed02e062380c0695ec7b74))


### 🛠　Build System

* **cache:** update cache ([5b32bb3](https://github.com/bluelovers/novel-opds-now/commit/5b32bb311c893ff82db095c8952daa6e3d07e75b))





## [3.0.24](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.23...novel-opds-now@3.0.24) (2021-07-18)


### 🐛　Bug Fixes

* **cache:** miss `.cache/cached/masiro/map.json` ([52c5d22](https://github.com/bluelovers/novel-opds-now/commit/52c5d22c5a860f15f26b1514ed3bfc4a93c07520))


### ✨　Features

* pubsub ([28f3c1f](https://github.com/bluelovers/novel-opds-now/commit/28f3c1fb3d65fc31f0378d6e83d9e6fb07ae0316))
* 將 demonovel 轉存到 IPFS ([2810d04](https://github.com/bluelovers/novel-opds-now/commit/2810d04c8ea1466ae0f5d7d658e402a09a3bb725))
* allow without `.xml` ([d1a83c4](https://github.com/bluelovers/novel-opds-now/commit/d1a83c4275991ebeb4a6730a990b9af020417bc1))
* check `siteNeverExpired` ([7d4c2c2](https://github.com/bluelovers/novel-opds-now/commit/7d4c2c2a9ab64aa4ea239f2c504c8fd23ef8b3a7))
* support `msg` and use `throttle` for `saveMutableFileSystemRoots` ([5207db2](https://github.com/bluelovers/novel-opds-now/commit/5207db2813c1ccf363ec759012e47746bb9e6eff))
* **cache:** build `id` , `uuid` for `demonovel` ([c52c527](https://github.com/bluelovers/novel-opds-now/commit/c52c527f217ccb658b2425a38e38218db7d802e2))


### 📦　Code Refactoring

* update demonovel opds ([943f202](https://github.com/bluelovers/novel-opds-now/commit/943f2029567f2e55a7fe74cc6b9379ae5c27a618))


### 🛠　Build System

* **cache:** update cache ([c0db7ab](https://github.com/bluelovers/novel-opds-now/commit/c0db7ab49bcf9c73b173e0874ad6106ca756af99))
* **cache:** update cache ([b700590](https://github.com/bluelovers/novel-opds-now/commit/b7005906df06eb10b14006d0e43b30dea01e6d07))
* **cache:** update cache ([b0aec2d](https://github.com/bluelovers/novel-opds-now/commit/b0aec2df43977a835d017955960a03038c4f3a51))





## [3.0.23](https://github.com/bluelovers/novel-opds-now/compare/novel-opds-now@3.0.22...novel-opds-now@3.0.23) (2021-07-17)


### 🐛　Bug Fixes

* **server:** 禁用 `contentSecurityPolicy: false` 才能正常顯示 QR ([c701908](https://github.com/bluelovers/novel-opds-now/commit/c7019086f349a50d649bd3eeafe19833f9417698))


### ✨　Features

* **server:** no-referrer ([7f21043](https://github.com/bluelovers/novel-opds-now/commit/7f21043293a6c459b862170d76f6f88bb88d09d4))


### 🛠　Build System

* **cache:** update cache ([e9a0fd4](https://github.com/bluelovers/novel-opds-now/commit/e9a0fd44e2a38dd1bd5511315b4486b7cea9f681))





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
