# novel-opds-now

   按需生成 epub，此模組不使用排程任務來生成 epub

> 按需生成 epub，此模組不使用排程任務來生成 epub<br/>
> 所有 epub 只在請求時才會打包<br/>
> 並且如果發現有緩存的話，則會直接使用緩存<br/>
> 而不會再打包一次，同一個檔案在 24 小時內只會更新一次<br/>
> 此模組使用了 P2P 組件來進行緩存

## install

> 安裝

```
npm install -g novel-opds-now
```

**( 不推薦使用 npx 來進行安裝 )**

## start

> 啟動伺服器

```
novel-opds-now -p 3000
```


![image](docs/image.png)
