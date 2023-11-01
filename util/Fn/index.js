// * 比例初始化
// setScale();

// * 邀请码
// let pwd = "123";

// * token
let playerToken = null;

// * 教学界面 默认第一页
let stepNum = 1;

// * loading flag
let loadingFlag = false;

// * 登录按钮
function submit() {
  let error_1 = document.querySelector(".error_1");
  let error_2 = document.querySelector(".error_2");
  let inputDom = document.querySelector("input");
  // let container = document.querySelector("#container");
  // * 教学界面
  let swiper = document.querySelector(".swiper");
  if (
    inputDom.value === "" ||
    inputDom.value.length < 9 ||
    inputDom.value.length > 9
  ) {
    error_2.style.opacity = 0;
    error_1.style.opacity = 1;
  } else if (inputDom.value.length === 9) {
    axios({
      url: "http://101.42.153.159:8101/audience/invicode",
      params: {
        code: inputDom.value,
      },
      method: "get",
    }).then((res) => {
      console.log(res.data);
      if (res.data.code === 200) {
        // * 传递ue邀请码
        playerToken = res.data.data.token;
        // * 隐藏提示框
        // console.log(`player_key:${res.data.data.token}`);
        error_1.style.opacity = 0;
        error_2.style.opacity = 0;
        // * 展示程序
        swiper.style.display = "flex";
        getScale();
        // * 教学界面初始化展示 步骤按钮
        showBack();
        showStart();
        // * 登录成功隐藏登录界面
        setTimeout(() => {
          let loginDom = document.querySelector("#login");
          loginDom.style.display = "none";
          lockScreen();
        }, 1000);
      } else {
        error_1.style.opacity = 0;
        error_2.style.opacity = 1;
      }
    });
  }
}

// * 存储token

lockScreen();
// * 锁定屏幕提示
function lockScreen() {
  // var ua = window.navigator.userAgent.toLocaleLowerCase();
  // var isIOS = /iphone|ipad|ipod/.test(ua);
  // if (isIOS) {
  // }
  window.addEventListener(
    "orientationchange",
    function () {
      if (window.orientation === 90) {
        let tooltipDom = document.querySelector("#tooltip");
        tooltipDom.style.display = "flex";
        // let container = document.querySelector("#container");
        // container.style.display = "none";
      }
      if (window.orientation === 0) {
        let tooltipDom = document.querySelector("#tooltip");
        tooltipDom.style.display = "none";
        if (stepNum === 4) {
          let container = document.querySelector("#container");
          container.style.display = "block";
        }
      }
    },
    false
  );
}

// * 安卓键盘避免遮挡输入框
function handleInput() {
  var ua = window.navigator.userAgent.toLocaleLowerCase();
  var isIOS = /iphone|ipad|ipod/.test(ua);
  var isAndroid = /android/.test(ua);
  if (isAndroid) {
    let login_input = document.querySelector("#login_input");
    login_input.style.transform = "translate(0,-150px)";
  } else if (isIOS) {
    console.log("ios");
  }
}

// * 失去焦点-复位页面
function handleBlur() {
  let login_input = document.querySelector("#login_input");
  login_input.style.transform = "translate(0,0px)";
  submit();
}

// * 教学界面 下一步
function stepNext() {
  if (stepNum < 4) {
    stepNum++;
    let stepDom = document.querySelector("#step");
    stepDom.src = `./image/step/${stepNum}.png`;
    showBack();
    showStart();
  }
  if (stepNum >= 4) {
    showStart();
  }
}

// * 教学界面 返回
function stepBack() {
  if (stepNum > 1) {
    stepNum--;
    let stepDom = document.querySelector("#step");
    stepDom.src = `./image/step/${stepNum}.png`;
    showBack();
    showStart();
  }
}

// * 跳过教学 --- 完成教学
function stepOver() {
  stepFinish();
}

function stepFinish() {
  // * 教学界面隐藏
  let swiper = document.querySelector(".swiper");
  swiper.style.display = "none";

  // * 教学完成 进入主界面
  let container = document.querySelector("#container");
  container.style.display = "block";
  stepNum = 4;
  ueStart("start");

  // let screenShot = document.querySelector("#screen_shot");
  // screenShot.style.display = "flex";
}
showBack();
showStart();

// * 教学界面 --- 显示隐藏返回按钮
function showBack() {
  if (stepNum > 1) {
    let backDom = document.querySelector("#back");
    backDom.style.display = "block";
  } else {
    let backDom = document.querySelector("#back");
    backDom.style.display = "none";
  }
}

// * 进入按钮 --- 显示隐藏
function showStart() {
  // console.log(stepNum);
  if (stepNum === 4) {
    let startDom = document.querySelector("#start");
    startDom.style.display = "block";

    let nextDom = document.querySelector("#next");
    nextDom.style.display = "none";

    let overDom = document.querySelector("#over");
    overDom.style.display = "none";
  } else {
    let startDom = document.querySelector("#start");
    startDom.style.display = "none";

    let nextDom = document.querySelector("#next");
    nextDom.style.display = "block";

    let overDom = document.querySelector("#over");
    overDom.style.display = "block";
  }
}
imageLoade();
// * 图片预加载
function imageLoade() {
  for (let i = 1; i < 5; i++) {
    let img = [];
    img[i] = new Image();
    img[i].src = `image/step/${i}.png`;
  }
}
let flag = true;
if (flag) {
  // * 资源全部加载函数
  window.addEventListener("load", function () {
    let loadingDom = document.querySelector("#loading");
    loadingDom.style.display = "none";
    flag = false;
    // alert(2);
  });
}

function getScale() {
  // console.log(document.querySelector(".swiper"));
  const w = (document.querySelector(".swiper").clientWidth / 750) * 2 - 0.12;
  console.log(w);
  // return w < h ? w : h;
  step.style.transform = `scale(${w})`;
}

// console.log(window.innerWidth, window.innerHeight, getScale());
// let step = document.querySelector("#step");
