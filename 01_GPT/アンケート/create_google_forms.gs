/**
 * GPT コース アンケート Google Forms 自動作成スクリプト
 *
 * 【使い方】
 * 1. Google Drive を開き、新規 > Google スプレッドシートを作成
 * 2. 「拡張機能」>「Apps Script」を開く
 * 3. このファイルの内容を全て貼り付けて保存（Ctrl+S）
 * 4. 関数 `createAllForms` を選択して「実行」ボタンをクリック
 * 5. 権限を許可する（初回のみ）
 * 6. 実行完了後、Google Drive に3つのフォームが生成されます
 *
 * 生成されるフォーム:
 *   - 事前アンケート（第01回）
 *   - 事後アンケート（第12回）
 *   - 各回フィードバックアンケート（第02〜11回共通）
 */

function createAllForms() {
  createZenkiForm();
  createKoukiForm();
  createFeedbackForm();
  Logger.log('✅ 3つのフォームを作成しました。Google Drive を確認してください。');
}

// ─────────────────────────────────────────────
// 1. 事前アンケート（第01回）
// ─────────────────────────────────────────────
function createZenkiForm() {
  const form = FormApp.create('事前アンケート（第01回）');
  form.setDescription(
    '所要時間：約5分\n実施タイミング：第01回の冒頭（00〜05分）\n\n' +
    '研修前の皆さまのスキル・業務状況を把握するためのアンケートです。\n' +
    '第12回終了時の事後アンケートと合わせて、研修の効果測定に使用します。\n' +
    '正直にご回答ください。'
  );
  form.setCollectEmail(false);
  form.setProgressBar(true);

  // ── セクション1：基本情報 ──
  form.addSectionHeaderItem().setTitle('セクション1：基本情報');

  form.addTextItem()
    .setTitle('Q1. お名前（フルネーム）')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Q2. 所属部署・役職')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q3. 現在お使いの ChatGPT アカウントの種類')
    .setChoiceValues([
      'アカウントなし（これから作成予定）',
      '無料プラン',
      'Plus（月額 $20）',
      'Team / Business（企業契約）',
      'わからない',
    ])
    .setRequired(true);

  // ── セクション2：生成AIの利用状況 ──
  form.addSectionHeaderItem().setTitle('セクション2：生成AIの利用状況');

  form.addMultipleChoiceItem()
    .setTitle('Q4. 生成AI（ChatGPT等）をどのくらいの頻度で使っていますか？')
    .setChoiceValues([
      'まったく使ったことがない',
      '過去に数回試したことがある程度',
      '月に数回使っている',
      '週に数回使っている',
      'ほぼ毎日使っている',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q5. 生成AIを業務目的で使ったことはありますか？')
    .setChoiceValues([
      '業務で使ったことはない',
      '1〜2回試したことがある',
      'ときどき業務で使っている',
      '定期的に業務で活用している',
      '業務の一部として日常的に使っている',
    ])
    .setRequired(true);

  // ── セクション3：AIスキル自己評価 ──
  form.addSectionHeaderItem()
    .setTitle('セクション3：AIスキル自己評価')
    .setHelpText('以下の各項目について、現時点の自信度を1〜5で回答してください。\n1＝まったくできない　5＝自信がある');

  const skillQs = [
    'Q6. ChatGPTに適切な指示（プロンプト）を出して、望んだ回答を得ること',
    'Q7. 生成AIを使って文章（メール・報告書等）を作成・添削すること',
    'Q8. 生成AIを使ってデータの整理・集計・変換をすること',
    'Q9. 生成AIに入力してよい情報とダメな情報の判断（セキュリティ・リスク管理）',
    'Q10. 自分の業務課題をAIで解決するための手順を考えること',
  ];
  skillQs.forEach(q => {
    form.addScaleItem()
      .setTitle(q)
      .setBounds(1, 5)
      .setLabels('まったくできない', '自信がある')
      .setRequired(true);
  });

  // ── セクション4：業務の現状 ──
  form.addSectionHeaderItem().setTitle('セクション4：業務の現状');

  form.addMultipleChoiceItem()
    .setTitle('Q11. 週あたり、定型的な事務作業（入力・転記・メール作成・書類作成等）に費やしている時間はどのくらいですか？')
    .setChoiceValues([
      '5時間未満',
      '5〜10時間',
      '10〜15時間',
      '15〜20時間',
      '20時間以上',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q12. その定型作業のうち、「もっと効率化できるはず」と感じているものはどのくらいありますか？')
    .setChoiceValues([
      'ほとんどない',
      '1〜2つある',
      '3〜4つある',
      '5つ以上ある',
      '大半の作業が効率化できると思う',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q13. 現在、業務効率化のためにITツール（Excel関数・マクロ・RPA等）を活用していますか？')
    .setChoiceValues([
      'まったく活用していない',
      'Excelの基本機能（SUM等）のみ',
      'Excel関数をある程度使っている',
      'マクロやRPA等も一部使っている',
      '積極的にITツールで自動化している',
    ])
    .setRequired(true);

  // ── セクション5：研修への期待 ──
  form.addSectionHeaderItem().setTitle('セクション5：研修への期待');

  form.addMultipleChoiceItem()
    .setTitle('Q14. この研修に最も期待していることは何ですか？')
    .setChoiceValues([
      'AIの基礎知識を身につけたい',
      '自分の業務を効率化する具体的な方法を知りたい',
      '実際にAIツール（アプリやSkill）を自分で作れるようになりたい',
      '社内のDX推進に役立つ知識を得たい',
      'その他',
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Q15. この研修で最も解決したい業務上の課題を教えてください（自由記述・200文字以内）')
    .setRequired(false);

  Logger.log('✅ 事前アンケート（第01回）を作成しました: ' + form.getEditUrl());
}

// ─────────────────────────────────────────────
// 2. 事後アンケート（第12回）
// ─────────────────────────────────────────────
function createKoukiForm() {
  const form = FormApp.create('事後アンケート（第12回）');
  form.setDescription(
    '所要時間：約5分\n実施タイミング：第12回の終了時（55〜60分）\n\n' +
    '研修全12回を終えての振り返りアンケートです。\n' +
    '事前アンケートとの比較で、皆さまの成長を可視化します。\n' +
    '率直にご回答ください。'
  );
  form.setCollectEmail(false);
  form.setProgressBar(true);

  // ── セクション1：基本情報 ──
  form.addSectionHeaderItem().setTitle('セクション1：基本情報');

  form.addTextItem()
    .setTitle('Q1. お名前（フルネーム）')
    .setRequired(true);

  form.addTextItem()
    .setTitle('Q2. 所属部署・役職')
    .setRequired(true);

  // ── セクション2：生成AIの利用状況（事前と同一指標） ──
  form.addSectionHeaderItem()
    .setTitle('セクション2：生成AIの利用状況（現在）')
    .setHelpText('事前アンケートと同じ指標で、研修後の現在の状況をお答えください。');

  form.addMultipleChoiceItem()
    .setTitle('Q3. 生成AI（ChatGPT等）をどのくらいの頻度で使っていますか？（現在）')
    .setChoiceValues([
      'まったく使っていない',
      '月に数回以下',
      '月に数回使っている',
      '週に数回使っている',
      'ほぼ毎日使っている',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q4. 生成AIを業務目的で使っていますか？（現在）')
    .setChoiceValues([
      '業務で使っていない',
      '1〜2回試した程度',
      'ときどき業務で使っている',
      '定期的に業務で活用している',
      '業務の一部として日常的に使っている',
    ])
    .setRequired(true);

  // ── セクション3：AIスキル自己評価（事前と同一） ──
  form.addSectionHeaderItem()
    .setTitle('セクション3：AIスキル自己評価')
    .setHelpText('研修を終えた現時点の自信度を1〜5で回答してください。\n1＝まったくできない　5＝自信がある');

  const skillQs = [
    'Q5. ChatGPTに適切な指示（プロンプト）を出して、望んだ回答を得ること',
    'Q6. 生成AIを使って文章（メール・報告書等）を作成・添削すること',
    'Q7. 生成AIを使ってデータの整理・集計・変換をすること',
    'Q8. 生成AIに入力してよい情報とダメな情報の判断（セキュリティ・リスク管理）',
    'Q9. 自分の業務課題をAIで解決するための手順を考えること',
  ];
  skillQs.forEach(q => {
    form.addScaleItem()
      .setTitle(q)
      .setBounds(1, 5)
      .setLabels('まったくできない', '自信がある')
      .setRequired(true);
  });

  // ── セクション4：業務の変化 ──
  form.addSectionHeaderItem().setTitle('セクション4：業務の変化');

  form.addMultipleChoiceItem()
    .setTitle('Q10. 研修で学んだことを活用した場合、週あたりの定型作業時間はどのくらいになると見込んでいますか？')
    .setChoiceValues([
      '5時間未満',
      '5〜10時間',
      '10〜15時間',
      '15〜20時間',
      '20時間以上（変わらない）',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q11. 定型作業のうち、「AIで効率化できる」と具体的にイメージできるものはどのくらいありますか？')
    .setChoiceValues([
      'ほとんどない',
      '1〜2つある',
      '3〜4つある',
      '5つ以上ある',
      '大半の作業でAI活用をイメージできる',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q12. 研修後、業務効率化のためにAI・ITツールをどの程度活用できそうですか？')
    .setChoiceValues([
      '活用するイメージが湧かない',
      '基本的な使い方ならできそう',
      '特定の業務で活用できそう',
      '複数の業務で活用できそう',
      '自分で新しいソリューションを作り続けられそう',
    ])
    .setRequired(true);

  // ── セクション5：構築したソリューション ──
  form.addSectionHeaderItem().setTitle('セクション5：構築したソリューション');

  form.addMultipleChoiceItem()
    .setTitle('Q13. 今回の研修で構築したソリューションの種類は？')
    .setChoiceValues([
      'ChatGPT Skills',
      'Codex（Webアプリ）',
      '両方を組み合わせた',
      '完成には至らなかった',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q14. 構築したソリューションにより、対象業務の時間をどの程度削減できる見込みですか？')
    .setChoiceValues([
      '削減効果は見込めない',
      '10〜20%程度の削減',
      '20〜40%程度の削減',
      '40〜60%程度の削減',
      '60%以上の削減',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q15. 構築したソリューションを研修後も実務で使い続けたいですか？')
    .setChoiceValues([
      '使わないと思う',
      'あまり使わないと思う',
      '機会があれば使いたい',
      '積極的に使いたい',
      'すでに実務に組み込む予定がある',
    ])
    .setRequired(true);

  // ── セクション6：研修全体の評価 ──
  form.addSectionHeaderItem().setTitle('セクション6：研修全体の評価');

  form.addMultipleChoiceItem()
    .setTitle('Q16. 研修の総合満足度')
    .setChoiceValues(['不満', 'やや不満', '普通', '満足', '非常に満足'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q17. 研修内容の難易度は適切でしたか？')
    .setChoiceValues(['難しすぎた', 'やや難しかった', 'ちょうどよかった', 'やや簡単だった', '簡単すぎた'])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('Q18. この研修を同僚や他部署の方に薦めたいですか？（NPS形式）')
    .setBounds(0, 10)
    .setLabels('まったく薦めない', '強く薦める')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('Q19. 最も役に立った回を選んでください（複数選択可）')
    .setChoiceValues([
      '第01回：業務棚卸し',
      '第02回：ChatGPT概論',
      '第03回：Skills入門',
      '第04回：Codex入門①',
      '第05回：Codex入門②',
      '第06回：ワークショップ（設計）',
      '第07回：ワークショップ（プロトタイプ）',
      '第08回：ワークショップ（改善）',
      '第09回：ワークショップ（仕上げ）',
      '第10回：ワークショップ（業務適用・運用設計）',
      '第11回：ワークショップ（成果物完成・社内展開準備）',
      '第12回：発表会',
    ])
    .setRequired(false);

  // ── セクション7：自由記述 ──
  form.addSectionHeaderItem().setTitle('セクション7：自由記述');

  form.addParagraphTextItem()
    .setTitle('Q20. 研修全体を通しての感想・講師へのメッセージがあればお書きください（任意）')
    .setRequired(false);

  Logger.log('✅ 事後アンケート（第12回）を作成しました: ' + form.getEditUrl());
}

// ─────────────────────────────────────────────
// 3. 各回フィードバックアンケート（第02〜11回共通）
// ─────────────────────────────────────────────
function createFeedbackForm() {
  const form = FormApp.create('各回フィードバックアンケート（第02〜11回共通）');
  form.setDescription(
    '所要時間：約3分\n\n' +
    '本日の研修お疲れ様でした。3分で終わる簡単なアンケートです。\n' +
    '率直にご回答ください。'
  );
  form.setCollectEmail(false);
  form.setProgressBar(false);

  form.addListItem()
    .setTitle('Q1. 今日は何回目ですか？')
    .setChoiceValues([
      '第02回', '第03回', '第04回', '第05回', '第06回',
      '第07回', '第08回', '第09回', '第10回', '第11回',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q2. 今回の内容の理解度はどのくらいですか？')
    .setChoiceValues([
      'ほとんど理解できなかった',
      'あまり理解できなかった',
      '半分くらい理解できた',
      'おおむね理解できた',
      '十分に理解できた',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q3. 今回の内容は自分の業務に活かせそうですか？')
    .setChoiceValues([
      '活かせるイメージが湧かない',
      'あまり活かせなさそう',
      '一部は活かせそう',
      'かなり活かせそう',
      'すぐにでも業務に取り入れたい',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q4. 今回の進行スピードは適切でしたか？')
    .setChoiceValues([
      '速すぎた',
      'やや速かった',
      'ちょうどよかった',
      'やや遅かった',
      '遅すぎた',
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('Q5. 今回の満足度を教えてください')
    .setChoiceValues(['不満', 'やや不満', '普通', '満足', '非常に満足'])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('Q6. 困ったこと・もっと知りたいこと・講師への質問があれば教えてください（任意・200文字以内）')
    .setRequired(false);

  Logger.log('✅ 各回フィードバックアンケートを作成しました: ' + form.getEditUrl());
}
