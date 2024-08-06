const IFRAME_WIDTH_DEFAULT = 400;
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

  // create container
  _userInfoPage = document.createElement("div");
  _userInfoPage.id = "user-info-page-container";
  _userInfoPage.style.position = "fixed";
  _userInfoPage.style.top = "0";
  _userInfoPage.style.right = "-48px";
  _userInfoPage.style.bottom = "0";
  _userInfoPage.style.width = "40px";
  _userInfoPage.style.borderRadius = "20px";
  _userInfoPage.style.overflow = "hidden";
  _userInfoPage.style.transition = "width 250ms";
  _userInfoPage.style.zIndex = "1";
  _userInfoPage.style.pointerEvents = "none";

  // set switch
  const toggleContent = document.createElement("div");
  toggleContent.style.position = "absolute";
  toggleContent.style.top = 0;
  // toggleContent.style.bottom = 0;
  toggleContent.style.right = 0;
  toggleContent.style.width = "40px";
  toggleContent.style.padding = "24px 0";
  toggleContent.style.letterSpacing = "4px";
  toggleContent.style.backgroundColor = "#F7F7F7";
  toggleContent.style.color = "#333";
  toggleContent.style.cursor = "pointer";
  toggleContent.style.writingMode = "vertical-lr";
  toggleContent.style.textOrientation = "upright";
  toggleContent.style.fontSize = "16px";
  toggleContent.style.fontWeight = 500;
  toggleContent.style.display = "flex";
  toggleContent.style.justifyContent = "center";
  toggleContent.style.alignItems = "center";
  toggleContent.style.borderRadius = "20px";
  toggleContent.style.userSelect = "none";
  toggleContent.innerText = "查看博主首页";
  toggleContent.style.pointerEvents = "all";
  toggleContent.style.backgroundImage = "linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)";
  _userInfoPage.appendChild(toggleContent);

  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.top = 0;
  iframe.style.right = "48px";
  iframe.style.width = `${IFRAME_WIDTH_DEFAULT}px`;
  iframe.style.height = "100%";
  iframe.style.border = "none";
  iframe.style.borderRadius = "0 20px 20px 0";
  iframe.style.opacity = 0;
  iframe.style.pointerEvents = "all";
  iframe.src = src;
  iframe.onload = handleIframeLoaded;
  iframe.style.transition = "250ms";

  // append
  _userInfoPage.appendChild(iframe);
  noteContainer.appendChild(_userInfoPage);

  toggleContent.addEventListener("click", function () {
    if (_userInfoPage.style.width === "40px") {
      // how much interaction-container width
      const interactionWidth =
        document.querySelector("#noteContainer .interaction-container").clientWidth ||
        IFRAME_WIDTH_DEFAULT;

      _userInfoPage.style.width = `${interactionWidth + 48}px`;
      iframe.style.opacity = 1;
      iframe.style.width = `${interactionWidth}px`;
      toggleContent.innerText = "隐藏博主首页";
    } else {
      _userInfoPage.style.width = "40px";
      iframe.style.opacity = 0;
      toggleContent.innerText = "查看博主首页";
    }
  });

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
