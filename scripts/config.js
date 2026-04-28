/* エコプラス+ LP — config (連絡先など環境差分はここで一元管理)
   本番デプロイ時は config.local.js でこの値を上書きする。 */
window.ECOPLUS_CONFIG = {
  phone: "0120-000-000",       // 表示用
  phoneTel: "tel:0120000000",  // tel: スキーム
  lineUrl: "https://lin.ee/SAMPLE-ECOPLUS",
  gtmId: "GTM-XXXXXXX"         // 本番で差し替え
};
