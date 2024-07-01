let _userInfoPage = null;

// Insert the div when the page is loaded
window.addEventListener("load", () => {
  observeModalExist();
});

// 使用示例
const debouncedShow = _debounce(() => {
  // user link
  const userLink = document.querySelector(".author-container .info>a");
  if (!userLink) return;

  setUserInfoPage(userLink.href);
});

const debouncedHide = _debounce(() => {
  removeUserInfoPage();
});

const observeModalExist = () => {
  // console.log("observe");
  const observer = new MutationObserver(() => {
    const element = document.querySelector("#noteContainer");
    if (element) {
      // console.log("show");
      debouncedShow();
    } else {
      // console.log("hide");
      debouncedHide();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: false,
  });
};

const removeUserInfoPage = () => {
  if (!_userInfoPage) return;
  _userInfoPage.parentNode.removeChild(_userInfoPage);
  _userInfoPage = null;
};

const setUserInfoPage = (src) => {
  if (_userInfoPage) return;

  // move the noteContainer
  const noteContainer = document.getElementById("noteContainer");
  if (noteContainer) {
    const transform = noteContainer.style.transform;

    // const str = "translate(116px, 32px) scale(1)";
    const regex = /[-+]?\d*\.?\d+(?:px|em|%|rem|vh|vw)?/g;
    const matches = transform.match(regex);

    // 提取数字部分，去掉单位
    const [x, y, scale] = matches.map((match) => parseFloat(match));

    noteContainer.style.transform = `translate(${x - 119}px, ${y}px) scale(${scale})`;

    // console.log('Matches:', matches);  // 输出 ["116px", "32px", "1"]
    // console.log('Numbers:', numbers);  // 输出 [116, 32, 1]
  }

  // return;

  // create container
  _userInfoPage = document.createElement("div");
  _userInfoPage.id = "user-info-page-container";
  _userInfoPage.style.position = "fixed";
  _userInfoPage.style.top = "0";
  _userInfoPage.style.right = "0px";
  _userInfoPage.style.bottom = "0";
  _userInfoPage.style.width = "336px";
  _userInfoPage.style.borderRadius = "16px";
  _userInfoPage.style.overflow = "hidden";
  _userInfoPage.style.transition = "250ms";
  _userInfoPage.style.zIndex = "-1";
  _userInfoPage.style.backgroundColor = "#FFDEE9";
  _userInfoPage.style.backgroundImage = "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)";

  // set iframe src
  const iframe = document.createElement("iframe");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.opacity = 0;
  iframe.src = src;
  iframe.onload = handleIframeLoaded;
  iframe.style.transition = "250ms";

  // append
  _userInfoPage.appendChild(iframe);
  noteContainer.appendChild(_userInfoPage);

  setTimeout(() => {
    _userInfoPage.style.right = "-342px";
  }, 0);

  // iframe onload event
  function handleIframeLoaded() {
    // return;
    // console.log("iframe onloaded");
    const content = iframe.contentDocument || iframe.contentWindow.document;

    const headerContainer = content.querySelector(".header-container");
    if (headerContainer && headerContainer.parentNode) {
      headerContainer.parentNode.removeChild(headerContainer);
    }

    const bottomMenu = content.querySelector(".bottom-menu");
    if (bottomMenu && bottomMenu.parentNode) {
      bottomMenu.parentNode.removeChild(bottomMenu);
    }

    // set user container padding to 0
    const userContainer = content.querySelector("#userPageContainer .user");
    if (userContainer) {
      userContainer.style.paddingTop = "0px";
    }

    iframe.style.opacity = 1;
  }
};

function _debounce(func, delay = 250) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
