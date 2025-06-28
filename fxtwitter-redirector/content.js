// content.js

// Function to display the "Copied to clipboard" confirmation
function showCopiedConfirmation() {
  let confirmationDiv = document.getElementById('copied-confirmation');
  if (!confirmationDiv) {
    confirmationDiv = document.createElement('div');
    confirmationDiv.id = 'copied-confirmation';
    confirmationDiv.textContent = '已複製到剪貼簿';
    document.body.appendChild(confirmationDiv);

    // Style the confirmation div to match the blue box style and preferred position
    Object.assign(confirmationDiv.style, {
      position: 'fixed',
      // 從提供的 CSS 參考並調整為適合固定定位的位置
      bottom: '27px', // 使用 margin-bottom 30px 作為參考，設定距離底部 30px
      left: '50%',
      transform: 'translateX(-50%)', // 確保水平居中

      // 從您提供的 CSS 塊中提取並應用樣式
      fontSize: '14px',
      fontFamily: "TwitterChirp, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: 'white', // 替換 hsl(var(--foreground))，因為無法直接解析變數
      lineHeight: 'inherit',
      backgroundColor: 'rgb(29, 155, 240)', // 直接使用 RGB 值
      padding: '11px', // 統一的內邊距
      borderRadius: '4px', // 統一的圓角，來自個別的 border-radius 屬性
      boxSizing: 'border-box',

      // 為了讓文字居中，使用 flexbox
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center', // 垂直居中
      justifyContent: 'center', // 水平居中 (針對單行文字)

      // 過渡效果
      transitionProperty: 'opacity',
      transitionDuration: '170ms', // 更快的過渡時間
      transitionTimingFunction: 'cubic-bezier(0, 0, 1, 1)',

      // 其他屬性
      zIndex: '10000', // 確保在最上層
      opacity: '0', // 初始隱藏
      pointerEvents: 'none', // 允許點擊穿透下層元素
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // 保持陰影以增加可見性
      minWidth: '0px', // 來自您提供的 CSS
      minHeight: '0px', // 來自您提供的 CSS
      // 其他您提供的 CSS 屬性大多是預設值或與特定佈局相關，
      // 對於獨立的固定定位彈窗不直接適用或已包含在基本設定中。
    });
  }

  // Show the confirmation
  confirmationDiv.style.opacity = '1';

  // Hide the confirmation after 2 seconds
  setTimeout(() => {
    confirmationDiv.style.opacity = '0';
  }, 2000);
}


// 第二部分：在現有選單中添加「FxTwitter 分享」和「FixupX 分享」選項
function addShareOptions() {
  const existingDropdown = document.querySelector('.css-175oi2r[data-testid="Dropdown"]');

  if (existingDropdown) {
    let copyLinkOption = null;
    const menuItems = existingDropdown.querySelectorAll('[role="menuitem"]');

    for (const item of menuItems) {
      if (item.textContent && item.textContent.includes('複製連結')) {
        copyLinkOption = item;
        break;
      }
    }

    let targetParent = existingDropdown;
    if (copyLinkOption) {
      targetParent = copyLinkOption.parentNode;
    }

    // Add FxTwitter Share Option
    if (!document.getElementById('fxtwitter-share-option')) {
      const fxTwitterOption = document.createElement('div');
      fxTwitterOption.setAttribute('role', 'menuitem');
      fxTwitterOption.setAttribute('tabindex', '0');
      fxTwitterOption.id = 'fxtwitter-share-option';
      fxTwitterOption.className = 'css-175oi2r r-1loqt21 r-18u37iz r-kritb0 r-ubg91z r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l';

      fxTwitterOption.innerHTML = `
        <div class="css-175oi2r r-1777fci r-t38ddu">
          <img src="${chrome.runtime.getURL('icons/FxTwitter/icon16.png')}"
               alt="FxTwitter Icon"
               style="width: 17px; height: 17px; vertical-align: middle;">
        </div>
        <div class="css-175oi2r r-16y2uox r-1wbh5a2 r-ad9z5g"> <div dir="ltr" class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-1b43r93 r-hjklzo r-b88u0q r-uri-anchor" style="color: rgb(247, 249, 249);"> <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3 r-1qd0xby r-ad9z5g">FxTwitter 分享</span> </div>
        </div>
      `;

      fxTwitterOption.addEventListener('click', (event) => {
        event.stopPropagation();
        let tweetUrl = window.location.href;
        const closestArticle = event.target.closest('article[data-testid="tweet"]');
        if (closestArticle) {
          const timeLink = closestArticle.querySelector('a time')?.parentNode;
          if (timeLink && timeLink.href) {
            tweetUrl = timeLink.href;
          }
        }
        const fxTweetUrl = tweetUrl.replace(/https?:\/\/(x\.com|twitter\.com)/gi, "https://fxtwitter.com");
        navigator.clipboard.writeText(fxTweetUrl)
          .then(() => {
            console.log('FxTwitter 連結已複製到剪貼簿！');
            showCopiedConfirmation(); // Call the confirmation function
          })
          .catch(err => {
            console.error('複製 FxTwitter 連結失敗: ', err);
          });
      });

      if (copyLinkOption && copyLinkOption.parentNode) {
        copyLinkOption.parentNode.insertBefore(fxTwitterOption, copyLinkOption.nextSibling);
      } else {
        existingDropdown.appendChild(fxTwitterOption);
      }
      console.log("FxTwitter 分享選項已添加。");
    }

    // Add FixupX Share Option
    if (!document.getElementById('fixupx-share-option')) {
      const fixupxOption = document.createElement('div');
      fixupxOption.setAttribute('role', 'menuitem');
      fixupxOption.setAttribute('tabindex', '0');
      fixupxOption.id = 'fixupx-share-option';
      fixupxOption.className = 'css-175oi2r r-1loqt21 r-18u37iz r-kritb0 r-ubg91z r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l';

      // You might want to use a different icon for FixupX if you have one.
      // For now, I'm using the same icon16.png.
      fixupxOption.innerHTML = `
        <div class="css-175oi2r r-1777fci r-t38ddu">
          <img src="${chrome.runtime.getURL('icons/Fixupx/icon16.png')}"
               alt="FixupX Icon"
               style="width: 17px; height: 17px; vertical-align: middle;">
        </div>
        <div class="css-175oi2r r-16y2uox r-1wbh5a2 r-ad9z5g"> <div dir="ltr" class="css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-1b43r93 r-hjklzo r-b88u0q r-uri-anchor" style="color: rgb(247, 249, 249);"> <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3 r-1qd0xby r-ad9z5g">FixupX 分享</span> </div>
        </div>
      `;

      fixupxOption.addEventListener('click', (event) => {
        event.stopPropagation();
        let tweetUrl = window.location.href;
        const closestArticle = event.target.closest('article[data-testid="tweet"]');
        if (closestArticle) {
          const timeLink = closestArticle.querySelector('a time')?.parentNode;
          if (timeLink && timeLink.href) {
            tweetUrl = timeLink.href;
          }
        }
        const fixupxTweetUrl = tweetUrl.replace(/https?:\/\/(x\.com|twitter\.com)/gi, "https://www.fixupx.com");
        navigator.clipboard.writeText(fixupxTweetUrl)
          .then(() => {
            console.log('FixupX 連結已複製到剪貼簿！');
            showCopiedConfirmation(); // Call the confirmation function
          })
          .catch(err => {
            console.error('複製 FixupX 連結失敗: ', err);
          });
      });

      // Insert FixupX option after FxTwitter option if it exists, otherwise after copyLinkOption
      const fxTwitterOptionElement = document.getElementById('fxtwitter-share-option');
      if (fxTwitterOptionElement && fxTwitterOptionElement.parentNode) {
        fxTwitterOptionElement.parentNode.insertBefore(fixupxOption, fxTwitterOptionElement.nextSibling);
      } else if (copyLinkOption && copyLinkOption.parentNode) {
        copyLinkOption.parentNode.insertBefore(fixupxOption, copyLinkOption.nextSibling);
      } else {
        existingDropdown.appendChild(fixupxOption);
      }
      console.log("FixupX 分享選項已添加。");
    }
  }
}

const observer = new MutationObserver((mutationsList, observer) => {
  const dropdown = document.querySelector('.css-175oi2r[data-testid="Dropdown"]');
  if (dropdown && (!document.getElementById('fxtwitter-share-option') || !document.getElementById('fixupx-share-option'))) {
    addShareOptions();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial call in case the dropdown is already present on page load
addShareOptions();