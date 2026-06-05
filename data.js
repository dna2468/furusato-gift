// 返礼品サンプルデータ（デモ用）
// ビジュアルはCSSグラデーション＋タイポグラフィで表現（外部通信・絵文字なし）
const CATEGORIES = [
  { id: "meat",    name: "お肉",         mono: "肉", grad: "linear-gradient(135deg,#b5532e,#7b241c)" },
  { id: "seafood", name: "魚介・海産物", mono: "魚", grad: "linear-gradient(135deg,#2e6f8e,#1b4f63)" },
  { id: "fruit",   name: "フルーツ",     mono: "果", grad: "linear-gradient(135deg,#2e8b57,#1e6e44)" },
  { id: "rice",    name: "米・パン",     mono: "米", grad: "linear-gradient(135deg,#c79a3a,#9c7322)" },
  { id: "sweets",  name: "スイーツ",     mono: "菓", grad: "linear-gradient(135deg,#b05878,#823a55)" },
  { id: "drink",   name: "お酒・飲料",   mono: "酒", grad: "linear-gradient(135deg,#4a6fa5,#324f78)" },
];

const PRODUCTS = [
  { id: 1,  name: "宮崎県産 黒毛和牛 切り落とし 1.2kg", region: "宮崎県都城市", category: "meat",    price: 15000, popularity: 98, grad: "linear-gradient(135deg,#c0392b,#7b241c)", desc: "とろける旨みの黒毛和牛をたっぷり1.2kg。普段使いにうれしい切り落とし。" },
  { id: 2,  name: "北海道産 ボイルずわい蟹 1kg",        region: "北海道紋別市", category: "seafood", price: 22000, popularity: 95, grad: "linear-gradient(135deg,#c0392b,#922b21)", desc: "甘みたっぷりのボイルずわい蟹。解凍するだけで本格的なカニ料理に。" },
  { id: 3,  name: "山梨県産 シャインマスカット 2房",     region: "山梨県笛吹市", category: "fruit",   price: 13000, popularity: 99, grad: "linear-gradient(135deg,#27ae60,#16805a)", desc: "皮ごと食べられる種なしの大粒シャインマスカット。贈答にも人気。" },
  { id: 4,  name: "新潟県産 コシヒカリ 10kg",            region: "新潟県南魚沼市", category: "rice",  price: 14000, popularity: 92, grad: "linear-gradient(135deg,#c79a3a,#9c7322)", desc: "言わずと知れた魚沼産コシヒカリ。冷めても美味しい人気の定番。" },
  { id: 5,  name: "静岡県産 完熟マスクメロン 1玉",       region: "静岡県袋井市", category: "fruit",   price: 11000, popularity: 88, grad: "linear-gradient(135deg,#3aa76d,#22774c)", desc: "芳醇な香りと上品な甘さ。職人が育てた最高級マスクメロン。" },
  { id: 6,  name: "鹿児島県産 黒豚しゃぶしゃぶ 1.5kg",   region: "鹿児島県鹿屋市", category: "meat",  price: 16000, popularity: 85, grad: "linear-gradient(135deg,#b5683f,#8a4824)", desc: "やわらかな赤身と上品な脂のかごしま黒豚。しゃぶしゃぶ用スライス。" },
  { id: 7,  name: "青森県産 大間まぐろ 中トロ 500g",     region: "青森県大間町", category: "seafood", price: 48000, popularity: 90, grad: "linear-gradient(135deg,#a93226,#7b241c)", desc: "ブランドまぐろ「大間まぐろ」のとろける中トロ。冷凍でお届け。" },
  { id: 8,  name: "福岡県産 あまおう 苺 540g",           region: "福岡県久留米市", category: "fruit", price: 9000, popularity: 94, grad: "linear-gradient(135deg,#c0392b,#962d22)", desc: "「あかい・まるい・おおきい・うまい」あまおう。甘くて大粒。" },
  { id: 9,  name: "兵庫県 神戸ビーフ ステーキ 400g",     region: "兵庫県神戸市", category: "meat",    price: 50000, popularity: 96, grad: "linear-gradient(135deg,#922b21,#5e1a13)", desc: "世界が認める神戸ビーフのサーロインステーキ。特別な日の一皿に。" },
  { id: 10, name: "北海道産 いくら醤油漬け 500g",        region: "北海道白糠町", category: "seafood", price: 18000, popularity: 97, grad: "linear-gradient(135deg,#cf6f2a,#a14e16)", desc: "プチプチ食感の濃厚ないくら。あつあつご飯にのせて至福の一杯。" },
  { id: 11, name: "香川県 おさぬきうどん 30食 つゆ付",   region: "香川県坂出市", category: "rice",    price: 8000,  popularity: 80, grad: "linear-gradient(135deg,#c2a05a,#937333)", desc: "本場讃岐のコシの強い半生うどん。専用つゆ付きでたっぷり30食。" },
  { id: 12, name: "京都 宇治抹茶スイーツ 詰め合わせ",    region: "京都府宇治市", category: "sweets",  price: 10000, popularity: 83, grad: "linear-gradient(135deg,#3f8a5c,#256038)", desc: "宇治抹茶を贅沢に使ったバウムクーヘン・生チョコ等の詰め合わせ。" },
  { id: 13, name: "長野県産 信州りんご サンふじ 5kg",    region: "長野県飯田市", category: "fruit",   price: 10000, popularity: 81, grad: "linear-gradient(135deg,#c0392b,#8e2a20)", desc: "蜜入りで甘みたっぷりの信州サンふじ。シャキッとした食感が自慢。" },
  { id: 14, name: "山形県産 さくらんぼ 佐藤錦 1kg",      region: "山形県東根市", category: "fruit",   price: 17000, popularity: 87, grad: "linear-gradient(135deg,#b0303a,#7b1f26)", desc: "“さくらんぼの王様”佐藤錦。宝石のような艶と上品な甘さ。" },
  { id: 15, name: "新潟 越乃寒梅 純米大吟醸 720ml",      region: "新潟県新潟市", category: "drink",   price: 20000, popularity: 78, grad: "linear-gradient(135deg,#4a6fa5,#324f78)", desc: "淡麗辛口の銘酒。すっきりとした飲み口で料理を引き立てます。" },
  { id: 16, name: "クラフトビール 飲み比べ 12本",        region: "神奈川県厚木市", category: "drink", price: 12000, popularity: 76, grad: "linear-gradient(135deg,#c79a3a,#9c7322)", desc: "地元ブルワリーのクラフトビール6種12本セット。香り豊かな飲み比べ。" },
  { id: 17, name: "博多 明太子 切れ子 1kg",             region: "福岡県福岡市", category: "seafood", price: 11000, popularity: 89, grad: "linear-gradient(135deg,#c0392b,#8e2a20)", desc: "ピリッと旨い博多辛子明太子。ご家庭用うれしい切れ子1kg。" },
  { id: 18, name: "北海道 生キャラメル＆チーズケーキ",   region: "北海道函館市", category: "sweets",  price: 9000,  popularity: 79, grad: "linear-gradient(135deg,#c08a3a,#946321)", desc: "とろける生キャラメルと濃厚チーズケーキの北海道スイーツセット。" },
  { id: 19, name: "佐賀県産 佐賀牛 焼肉 800g",          region: "佐賀県佐賀市", category: "meat",    price: 30000, popularity: 91, grad: "linear-gradient(135deg,#a32f24,#6e1f17)", desc: "きめ細かなサシが美しい佐賀牛。焼肉用カルビ・ロースの詰め合わせ。" },
  { id: 20, name: "愛媛県産 紅まどんな 3kg",            region: "愛媛県西予市", category: "fruit",   price: 12000, popularity: 84, grad: "linear-gradient(135deg,#cf8a2a,#a16216)", desc: "ゼリーのような食感ととろける甘さ。冬の高級柑橘“紅まどんな”。" },
];
