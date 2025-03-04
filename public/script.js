// ナレッジデータ取得・LLM送信用設定
const TEST_MODE = true; // テストモードON/OFF
const SHEET_ID = "1TjSQGF109ZYFJf7AC8EpoxTk7q6zUIrl3ACQ98WA1Sw"; // スプレッドシートID
const API_KEY = "AIzaSyCtV4GcNU7e_XlZWumWO1xo38y_pUnUDzE"; // 取得したAPIキーをここに入れる
const RANGE = "Sheet1!A1:B100"; // シートの範囲を指定

// Google Sheets API からデータ取得
async function fetchKnowledgeData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.values) {
            processKnowledgeData(data.values);
        } else {
            console.error("データ取得に失敗", data);
        }
    } catch (error) {
        console.error("Google Sheets API の取得エラー", error);
    }
}

// 取得データを処理して LLM に送信
function processKnowledgeData(values) {
    let knowledge = {};
    values.forEach(row => {
        if (row.length >= 2) {
            knowledge[row[0]] = row[1]; // キー: 値 形式で格納
        }
    });

    // テストモードならナレッジを画面に表示
    if (TEST_MODE) {
        const testModeEl = document.getElementById("test-mode");
        const outputEl = document.getElementById("knowledge-output");
        if(testModeEl && outputEl) {
          testModeEl.style.display = "block";
          outputEl.textContent = JSON.stringify(knowledge, null, 2);
        }
    }

    // LLM用のプロンプトに組み込む
    sendToLLM(knowledge);
}

// LLMへデータ送信（仮）
function sendToLLM(knowledge) {
    console.log("LLMへ送信するナレッジ:", knowledge);
    // ここでLLM APIと連携してデータを送信
}

// 初回ロード時にデータ取得
fetchKnowledgeData();

document.addEventListener('DOMContentLoaded', () => {
  // サイドバーのフィルターリンク（.filter-item）を取得
  const filterItems = document.querySelectorAll('.filter-item');
  // すべての機能アイテムを取得
  const functionItems = document.querySelectorAll('.item');

  // フィルタリング機能：クリックされたフィルターに合わせて表示を切り替え
  filterItems.forEach(filter => {
    filter.addEventListener('click', () => {
      const category = filter.getAttribute('data-category');
      console.log('Filter clicked:', category);
      // 各アイテムの表示制御。displayプロパティは 'flex' を使用して、アイテムのflex設定を維持する
      functionItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // 各機能アイテムのクリックイベントでポップアップ表示していた処理は削除
  // 各 <a> 要素は href 属性に従い、クリックで各機能のHTMLファイルへ遷移します。
});
