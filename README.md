# Code Friend

## 開発メンバー

- Takayama（Yukitkym）


## 使用技術
- React.js (https://github.com/facebook/react)
- TypeScript (https://www.typescriptlang.org/)
- Next.js (https://github.com/vercel/next.js)
- Firebase (https://firebase.google.com/docs/web/setup?hl=ja)



## バージョン情報

```
"node": "16.14.2",
"yarn": "1.22.18"
```

## プロジェクトの概要
同じ趣味・同じ言語を勉強しているエンジニア友達を探せるサービス「Code Friend」の開発を行う。

## 開発Tips

1. プルリクエスト前の作業

プルリクエストを上げる前に必ず、作業を行なっているブランチで`git pull origin main`を行う
もし、コンフリクトが発生したら、ローカル上で解決する

2. `git pull origin main`を行なった後の作業

remoteに変更があった場合は、`git pull origin main`のコマンドを実行し、remoteの変更を取り込む
packageに更新がないか、確認するため、`yarn`コマンドを実行する
`success Already up-to-date.`と表示されればOK。

3. ブランチの作成について

ブランチを作成する際は、必ず、mainブランチを最新の状態にし、mainブランチから派生させて、新しいブランチを作成する


#### ブランチ命名規則

issue 番号を必ず含める

**＜具体例＞**
issue#1 【UI】TopページのUIを作成 を実装する場合

`git checkout -b #1-Top-Page-UI`

#### コミットメッセージ

#issue 番号 + 日本語で端的に

例）
`git commit -m '#1 TopページのUIを作成' `
