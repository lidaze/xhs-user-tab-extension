const IFRAME_WIDTH_DEFAULT = 400;
const IFRAME_WIDTH_DEFAULT_2 = 330;
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
  const observer = new MutationObserver(() => {
    const element = document.querySelector("#noteContainer");

    if (element && window.outerWidth >= 960) {
      debouncedShow();
    } else {
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

  // modal的宽度大小，和屏幕的宽度大小，来决定是否可以分开展示
  console.log(parseInt(noteContainer.style.width), window.innerWidth);

  const modalWidth = parseInt(noteContainer.style.width);
  const windowWidth = window.innerWidth;

  let mode = "content";
  if ((windowWidth - modalWidth) / 2 > IFRAME_WIDTH_DEFAULT_2) {
    mode = "right";
  }

  // create container
  _userInfoPage = document.createElement("div");
  _userInfoPage.id = "user-info-page-container";
  _userInfoPage.style.position = "fixed";
  _userInfoPage.style.borderRadius = "20px";
  _userInfoPage.style.overflow = "hidden";
  _userInfoPage.style.transition = "width 250ms";
  _userInfoPage.style.zIndex = "1";
  _userInfoPage.style.pointerEvents = "none";
  _userInfoPage.style.top = 0;
  if (mode === "right") {
    _userInfoPage.style.left = `${modalWidth + 8}px`;
  } else {
    _userInfoPage.style.right = "-48px";
  }
  _userInfoPage.style.bottom = 0;
  _userInfoPage.style.width = "40px";

  // _userInfoPage.style.border = "1px solid rgb(228, 228, 228)";
  // _userInfoPage.style.boxShadow = "0 0 50px -12px rgb(0 0 0 / 45%)";
  // _userInfoPage.style.backgroundImage =
  //   "linear-gradient(250deg, rgb(255, 222, 233) 0%, rgb(181, 255, 252) 100%)";

  // set switch
  const toggleContent = document.createElement("div");
  toggleContent.style.position = "absolute";
  toggleContent.style.top = 0;
  // toggleContent.style.bottom = 0;
  toggleContent.style.padding = "24px 0";
  if (mode === "right") {
    toggleContent.style.left = 0;
  } else {
    toggleContent.style.right = 0;
  }
  toggleContent.style.width = "40px";
  toggleContent.style.letterSpacing = "4px";
  // toggleContent.style.backgroundColor = "#F7F7F7";
  toggleContent.style.color = "#333";
  toggleContent.style.cursor = "pointer";
  toggleContent.style.writingMode = "vertical-lr";
  toggleContent.style.textOrientation = "upright";
  toggleContent.style.fontSize = "16px";
  toggleContent.style.fontWeight = 600;
  toggleContent.style.display = "flex";
  toggleContent.style.justifyContent = "center";
  toggleContent.style.alignItems = "center";
  toggleContent.style.borderRadius = "20px";
  toggleContent.style.userSelect = "none";
  toggleContent.innerText = "查看博主首页";
  toggleContent.style.pointerEvents = "all";
  toggleContent.style.backgroundImage = "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)";
  // toggleContent.style.boxShadow = "4px 0 14px -1px rgba(0, 0, 0, 0.6)";
  // toggleContent.style.zIndex = 1;
  _userInfoPage.appendChild(toggleContent);

  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.top = 0;
  if (mode === "right") {
    iframe.style.left = "48px";
    iframe.style.width = `${IFRAME_WIDTH_DEFAULT_2}px`;
    iframe.style.borderRadius = "20px";
  } else {
    iframe.style.right = "48px";
    iframe.style.width = `${IFRAME_WIDTH_DEFAULT}px`;
    iframe.style.borderRadius = "0 20px 20px 0";
  }
  iframe.style.height = "100%";
  iframe.style.border = "none";

  iframe.style.opacity = 0;
  iframe.style.pointerEvents = "all";
  // iframe.style.boxShadow = "rgb(0 0 0 / 20%) 4px 0px 16px -2px";
  iframe.src = src;
  iframe.onload = handleIframeLoaded;
  iframe.style.transition = "250ms";

  // append
  _userInfoPage.appendChild(iframe);
  noteContainer.appendChild(_userInfoPage);

  toggleContent.addEventListener("mouseover", toggleIFrame);
  toggleContent.addEventListener("click", toggleIFrame);

  function toggleIFrame() {
    if (_userInfoPage.style.width === "40px") {
      // how much interaction-container width
      const interactionWidth =
        document.querySelector("#noteContainer .interaction-container").clientWidth ||
        IFRAME_WIDTH_DEFAULT;

      const iFW = mode === "right" ? IFRAME_WIDTH_DEFAULT_2 : interactionWidth;

      _userInfoPage.style.width = `${iFW + 48}px`;
      _userInfoPage.style.borderRadius = "0px 20px 20px 0px";
      iframe.style.opacity = 1;
      iframe.style.width = `${iFW}px`;
      toggleContent.innerText = "隐藏博主首页";
    } else {
      _userInfoPage.style.width = "40px";
      _userInfoPage.style.borderRadius = "20px";
      iframe.style.opacity = 0;
      toggleContent.innerText = "查看博主首页";
    }
  }

  // iframe onload event
  function handleIframeLoaded() {
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

    content.addEventListener("scroll", function () {
      const stickyDiv = content.querySelector(".reds-sticky");
      stickyDiv.style.top = 0;
      stickyDiv.style.position = "relative";
    });
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
