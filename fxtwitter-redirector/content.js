document.addEventListener('copy', (e) => {
  const selection = document.getSelection();
  const selectedText = selection ? selection.toString() : '';

  // 如果選取的文字是推文連結
  if (selectedText.includes("x.com") || selectedText.includes("twitter.com")) {
    const modified = selectedText
      .replace(/https?:\/\/x\.com/g, "https://fxtwitter.com")
      .replace(/https?:\/\/twitter\.com/g, "https://fxtwitter.com");

    // 攔截剪貼簿並替換內容
    e.clipboardData.setData('text/plain', modified);
    e.preventDefault();
    console.log("📋 推文連結已自動改為 fxtwitter");
  }
});
