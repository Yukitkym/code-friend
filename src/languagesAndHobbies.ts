export const languages = [
  'HTML/CSS',
  'JavaScript',
  'PHP',
  'Ruby',
  'Python',
  'Java',
  'GO',
  'Kotlin',
  'Scala',
  'Swift',
  'SQL',
  'C',
  'C++',
  'C#',
  'R',
  'Visual Basic'
]
export const languages1 = languages.slice(0, 5)
export const languages2 = languages.slice(5, 11)
export const languages3 = languages.slice(11)
export const hobbies = {
  game: [
    'PCゲーム',
    'テレビゲーム',
    '将棋',
    'チェス',
    'ポーカー',
    '麻雀',
    'ボードゲーム',
    'トレーディングカードゲーム'
  ],
  sports: [
    '筋トレ',
    'ランニング',
    '野球',
    'サッカー',
    'テニス',
    'バスケ',
    'バレーボール',
    'ダンス',
    'ゴルフ',
    'スポーツ観戦',
    'ダーツ',
    'ビリヤード',
    'ボルダリング',
    'サーフィン',
    'スノボ',
    'スキー'
  ],
  watching: ['アニメ', '映画鑑賞']
}
export const game1 = hobbies.game.slice(0, 6)
export const game2 = hobbies.game.slice(6)
export const sports1 = hobbies.sports.slice(0, 6)
export const sports2 = hobbies.sports.slice(6, 11)
export const sports3 = hobbies.sports.slice(11)
export const watching = hobbies.watching

export const games = hobbies.game
export const sports = hobbies.sports
