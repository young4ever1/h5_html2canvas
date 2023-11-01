// * 图片-格式转换
function getImageBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const base64 = reader.result;
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

async function bootstrap() {
  // 详细文档参考：https://www.3dcat.live/support/api/jssdk-guide.html

  let LauncherUI = window.LiveCatLibrary.LauncherUI; //公有云
  // let LauncherPrivateUI = window.LiveCatLibrary.LauncherPrivateUI //私有云

  /*
        appKey:
        通过已发布应用("https://app.3dcat.live/app/3d-application") -> 生成普通链接url参数获取
        如：https://app.3dcat.live/raystreaming/rayvision/player-normal.html?appKey=xxxxxx，appKey为"xxxxxx"
      */

  /*
        address:
        公有云固定为"https://app.3dcat.live"不变
        私有云一般为"http://xxxx:8088"
      */

  /*
       错误码:
       详细见：https://www.3dcat.live/support/api/jssdk-code-detail.html
     */
  // connection.event.screenshot.on(payload => {
  //    payload：Blob,截图数据
  // })

  let launcher = new LauncherUI(
    {
      // xjSjLA5WwRQMHjnr
      // hVjCplLPASAWjOJi
      // Jb9FsYiOhuUiG1TR
      // WzUlJz6ZRtm03812
      // MIzLakFmUzg2KDbk
      // L9wuMxO7eizdLp1r
      //ycg1A6O4AYjKX5Uz
      appKey: "xxx",
      address: "https://app.3dcat.live",
      startType: 1,
      // isFullScreen:true,
      // landscapeType:"COVER"
    },
    document.querySelector("#container"),
    {
      //   isFullScreen: true,
      openMultiTouch: true,
      onPlay: () => {
        console.log("player---------");
        // document.querySelector("#container").requestFullscreen();
      },
      onChange: (res) => {
        console.log("onChange", res);
        // if (res.fakePercent === 100) {
        //   sendText(`player_key:${playerToken}`);
        // }
      },
      onQueue: (res) => {
        console.log("onQueue", res);
      },

      onLoadingError: (res) => {
        console.error("onLoadingError", res);
      },

      onError: (res) => {
        console.error("onError", res);
      },
      onPhaseChange: (phase) => {
        console.log("onPhaseChange", phase);
        if (phase === "signaling-connected") {
          const connection = launcher.launcherBase.connection;
          window.connection = connection;
          connection.event.interaction.on((text) => {
            console.log("收到消息：", text);
            // * ue 指令传参
            orderFn(text);
            // screenShot();
          });
        }
      },

      onMount: (res) => {
        console.log("onMount", res);
      },
      onRotate: (r) => {
        console.log("onRotate", r);
        // console.log(playerDemo.offsetHeight);
        // console.log(playerDemo.offsetWidth)
      },
      onTaskId: (r) => {
        console.log("onTaskId", r);
      },
      onShowUserList: (r) => {
        console.log("onShowUserList", r);
      },
      onRunningOptions: (r) => {
        console.log("onRunningOptions", r);
      },
    }
  );
  return launcher;
}

// * ue通信指令控制;
function orderFn(order) {
  console.log(order, "指令....");
  // * 未接收token 继续执行 传递token函数
  if (order === "Send_PlayerKey") {
    sendText(`PlayerKey_${playerToken}`);
  }

  // * 分享功能 接收玩家名称
  if (order.includes("Share_open")) {
    screenShot(order);
  }

  // * 展示预约码
  if (order === "Sub_open") {
    subscribe();
  }
}

// * 通知截图功能
function screenShot(order) {
  let playerName = order.slice(order.lastIndexOf("_") + 1, order.length);
  // * 写入玩家名称
  let playerDom = document.querySelector(".player");
  playerDom.innerHTML = playerName;
  console.log("触发截图功能");
  // * 展示分享弹窗
  let screenDom = document.querySelector("#screen_shot");
  setTimeout(() => {
    connection.screenshot();
    connection.event.screenshot.on((payload) => {
      getImageBase64(payload).then((base64) => {
        // * 执行需要的操作，比如显示图片等等
        let screen_img_dom = document.querySelector(".screen_img");
        screen_img_dom.src = base64;
        screenDom.style.display = "block";
        html2canvas(screenDom, {
          taintTest: false,
          useCORS: true,
          dpi: 300,
          scale: 1,
          allowTaint: true, // 允许跨域图片
        }).then(function (canvas) {
          const poster_base64 = canvas.toDataURL("image/jpg");
          // * 1
          let share_dialog = document.querySelector("#share_dialog");
          share_dialog.style.display = "block";
          // * 2
          let img = document.querySelector(".finally");
          img.src = poster_base64;
          // * 3
          setTimeout(() => {
            let screenDom = document.querySelector("#screen_shot");
            screenDom.style.display = "none";
          }, 1000);
        });
      });
    });
  },100);
}
// * 关闭分享页面
function screenShot_close() {
  let share_dialog = document.querySelector("#share_dialog");
  share_dialog.style.display = "none";
  // * 传递ue命令
  sendText("Share_close");
}

// * 通知展示预约码
function subscribe() {
  let sub_dialog = document.querySelector("#sub_dialog");
  sub_dialog.style.display = "flex";
}
// * 关闭预约码页面
function subscribe_close() {
  let sub_dialog = document.querySelector("#sub_dialog");
  sub_dialog.style.display = "none";
  // * 传递ue命令
  sendText("Sub_close");
}

function shot() {
  // screenShot();
  let screenDom = document.querySelector("#screen_shot");
  screenDom.style.display = "block";
  let random = document.querySelector(".random");
  random.innerHTML = Math.floor(Math.random() * 1000);
  html2canvas(screenDom, {
    // taintTest: false,
    useCORS: true,
    dpi: 300,
    scale: 1,
    allowTaint: true, // 允许跨域图片
  }).then(function (canvas) {
    console.log(canvas);
    const poster_base64 = canvas.toDataURL("image/jpg");

    let share_dialog = document.querySelector("#share_dialog");
    share_dialog.style.display = "block";

    let img = document.querySelector(".finally");
    img.src = poster_base64;
    // img.style.display = "block";

    // * 隐藏原图
    setTimeout(() => {
      let screenDom = document.querySelector("#screen_shot");
      screenDom.style.display = "none";
    }, 1000);
  });
}

// * 通知ue指令
function sendText(message) {
  if (window.connection && message) {
    window.connection
      .emitUIInteraction(message)
      .then((res) =>
        console.log(
          `发送消息：${message},`,
          res === true ? "发送成功" : "发送失败"
        )
      );
  }
}

// function print(text) {
//   let newEle = document.createElement("li");
//   newEle.innerHTML = text;
//   let firstChild = document.querySelector(".list").firstChild;
//   document.querySelector(".list").insertBefore(newEle, firstChild);
//   //   if (text) {
//   //     document.querySelector(".form-container").style.display = "block";
//   //   }
// }

// console.log(laucner.launcherBase.player.video)
function ueStart(order) {
  // alert()
  // console.log(stepNum);
  if (order === "start") {
    bootstrap();
  }
}

// window.addEventListener("DOMContentLoaded", () => {
//   if (
//     navigator.userAgent.includes("miniProgram") ||
//     navigator.userAgent.includes("MicroMessenger")
//   ) {
//     new Promise((resolve, reject) => {
//       document.addEventListener("WeixinJSBridgeReady", resolve);
//     }).then(bootstrap);
//   } else {
//     console.log("xxxx123123");
//     // if (loadingFlag === true) {
//     //   bootstrap();
//     // }
//   }
// });
