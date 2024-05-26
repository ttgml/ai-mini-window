
var openStatus = false
var iconStatus = false

var popupWindows = false

var icon_x = 0
var icon_y = 0


// 设置小窗是不是固定在窗口上
var pop_pin_status = false

// 当前刷新状态 避免重复刷新
var refreshing = false

// 小窗的默认宽度和当前宽度
var popup_window_width = 500;
var popup_window_height = 300;

var CurrentSelectedText = ""

// 记录初始鼠标位置和元素位置 拖动
var offsetX, offsetY, isDragging = false;
// 记录初始鼠标位置 调整小窗
// 正在拖动什么项目，x 和 y 各拖动多少，是否正在拖动。
var resizeable_item, resizeable_x, resizeable_y, is_resizeing = false

var show_selected_tip = false

// 这个变量用于判断用户是否手动调整过边框大小，如果手动调整过，以用户调整的为准
var rember_pop_size = false
var user_resize_window = false
var user_remove_window = false

// 这个变量用于 判断是否自动开启小窗
var auto_open_pop = false

// 跨标签/窗口同步小窗
var sync_all_pop = false

// 连续对话
var continue_chat = false

// 可视窗口大小
var previousWidth = window.innerWidth;
var previousHeight = window.innerHeight;

// 使用 Ctrl + entry 发送消息
var use_ctrl_enter = false


// 总结网页内容
var summary_page = false
var page_content = []
// 把消息记录存在这里
var message_record = {
  data: [],
  last: [],
  page: []
}
var message_record_origin = {
  data: [],
  last: [],
  page: []
}
/*
结构是这样的：
{
  data: [
    {
      "feature": "abc"
      "user": "balabala",
      "system": ""
    },
    {
      "feature": "abc"
      "user": "balabala",
      "system": ""
    },
    ...
  ]
}
*/

// 创建svg图标
var svgTmpContainerClose = document.createElement("div");
svgTmpContainerClose.innerHTML = '<svg width="32" height="32" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-4165b2bb=""><path d="M4.0859 3.7579C4.28116 3.56263 4.59775 3.56263 4.79302 3.7579L8.79985 7.76476L12.8078 3.7568C13.003 3.56153 13.3197 3.56153 13.5149 3.7568C13.7102 3.95206 13.7102 4.26865 13.5149 4.46391L9.50696 8.47186L13.5141 12.4789C13.7093 12.6742 13.7093 12.9908 13.5141 13.1861C13.3188 13.3813 13.0022 13.3813 12.8069 13.1861L8.79985 9.17897L4.79388 13.185C4.59861 13.3802 4.28203 13.3802 4.08676 13.185C3.8915 12.9897 3.8915 12.6731 4.08676 12.4779L8.09275 8.47186L4.0859 4.46501C3.89064 4.26975 3.89064 3.95316 4.0859 3.7579Z" fill="currentColor"></path></svg>';
var svgTmpContainerIcon = document.createElement("div");
svgTmpContainerIcon.innerHTML = '<svg t="1701755103187" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4442" width="48" height="48" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512.002 512.002m-491.988 0a491.988 491.988 0 1 0 983.976 0 491.988 491.988 0 1 0-983.976 0Z" fill="#FDDF6D" p-id="4443"></path><path d="M617.432 931.356c-271.716 0-491.986-220.268-491.986-491.986 0-145.168 62.886-275.632 162.888-365.684C129.054 155.124 20.014 320.828 20.014 512c0 271.716 220.268 491.986 491.986 491.986 126.548 0 241.924-47.796 329.098-126.298-67.102 34.31-143.124 53.668-223.666 53.668z" fill="#FCC56B" p-id="4444"></path><path d="M426.314 359.704m-142.718 0a142.718 142.718 0 1 0 285.436 0 142.718 142.718 0 1 0-285.436 0Z" fill="#FFFFFF" p-id="4445"></path><path d="M826.554 359.704m-142.718 0a142.718 142.718 0 1 0 285.436 0 142.718 142.718 0 1 0-285.436 0Z" fill="#FFFFFF" p-id="4446"></path><path d="M300.576 556.564c-36.536 0-66.156 29.62-66.156 66.158h132.314c-0.004-36.54-29.622-66.158-66.158-66.158zM877.628 547.698c-36.536 0-66.156 29.62-66.156 66.158h132.314c0-36.538-29.618-66.158-66.158-66.158z" fill="#F9A880" p-id="4447"></path><path d="M390.526 285.09m-40.03 0a40.03 40.03 0 1 0 80.06 0 40.03 40.03 0 1 0-80.06 0Z" fill="#7F184C" p-id="4448"></path><path d="M796.612 282.314m-40.03 0a40.03 40.03 0 1 0 80.06 0 40.03 40.03 0 1 0-80.06 0Z" fill="#7F184C" p-id="4449"></path><path d="M553.388 822.268a19.932 19.932 0 0 1-10.272-2.85c-9.482-5.684-12.558-17.976-6.874-27.458 27.59-46.018 76.732-74.606 128.244-74.606a146.14 146.14 0 0 1 45.684 7.282c10.504 3.448 16.22 14.758 12.77 25.262-3.45 10.498-14.76 16.222-25.262 12.766a106.238 106.238 0 0 0-33.192-5.282c-37.528 0-73.51 21.136-93.908 55.16a20.02 20.02 0 0 1-17.19 9.726z" fill="#7F184C" p-id="4450"></path><path d="M976.568 296.66a162.334 162.334 0 0 0-7.144-14.786c-0.916-1.814-1.79-3.65-2.724-5.452a19.944 19.944 0 0 0-3.282-4.576c-28.984-44.988-79.486-74.866-136.864-74.866-89.732 0-162.732 73-162.732 162.732 0 89.73 73 162.73 162.732 162.73 66.794 0 124.292-40.462 149.336-98.15 5.354 28.624 8.084 57.894 8.084 87.708 0 260.248-211.724 471.968-471.97 471.968S40.03 772.248 40.03 512 251.752 40.03 512 40.03c73.236 0 143.414 16.308 208.588 48.47 9.906 4.892 21.914 0.824 26.804-9.09 4.892-9.914 0.822-21.914-9.092-26.806C667.572 17.698 591.434 0 512 0 229.68 0 0 229.68 0 512c0 282.316 229.68 512 512 512s512-229.68 512-511.998c0-74.35-16.38-148.314-47.432-215.342z m-27.314 63.052c0 67.66-55.044 122.7-122.704 122.7s-122.704-55.044-122.704-122.7 55.044-122.704 122.704-122.704c46.26 0 86.612 25.742 107.516 63.646a477.884 477.884 0 0 1 5.604 11.532 121.936 121.936 0 0 1 9.584 47.526z" fill="" p-id="4451"></path><path d="M426.326 196.98c-89.732 0-162.732 73-162.732 162.732 0 89.73 73 162.73 162.732 162.73s162.732-73 162.732-162.73c0.002-89.732-73.002-162.732-162.732-162.732z m0 285.432c-67.66 0-122.704-55.044-122.704-122.7s55.044-122.704 122.704-122.704 122.704 55.046 122.704 122.704-55.046 122.7-122.704 122.7zM543.116 819.42a20.008 20.008 0 0 0 27.458-6.878c20.398-34.026 56.38-55.16 93.908-55.16 11.358 0 22.524 1.778 33.19 5.282 10.502 3.456 21.814-2.266 25.264-12.764 3.45-10.502-2.262-21.814-12.764-25.264a145.99 145.99 0 0 0-45.69-7.282c-51.516 0-100.652 28.588-128.244 74.606-5.68 9.482-2.604 21.776 6.878 27.46z" fill="" p-id="4452"></path><path d="M791.274 106.798m-20.014 0a20.014 20.014 0 1 0 40.028 0 20.014 20.014 0 1 0-40.028 0Z" fill="" p-id="4453"></path></svg>';
var svgTmpContainerPin = document.createElement("div");
svgTmpContainerPin.innerHTML = '<svg t="1701841394550" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10060" width="32" height="32"><path d="M648.728381 130.779429a73.142857 73.142857 0 0 1 22.674286 15.433142l191.561143 191.756191a73.142857 73.142857 0 0 1-22.137905 118.564571l-67.876572 30.061715-127.341714 127.488-10.093714 140.239238a73.142857 73.142857 0 0 1-124.684191 46.445714l-123.66019-123.782095-210.724572 211.699809-51.833904-51.614476 210.846476-211.821714-127.926857-128.024381a73.142857 73.142857 0 0 1 46.299428-124.635429l144.237715-10.776381 125.074285-125.220571 29.379048-67.779048a73.142857 73.142857 0 0 1 96.207238-38.034285z m-29.086476 67.120761l-34.913524 80.530286-154.087619 154.331429-171.398095 12.751238 303.323428 303.542857 12.044191-167.399619 156.233143-156.428191 80.384-35.59619-191.585524-191.73181z" p-id="10061"></path></svg>';
var svgTmpContainerPinFill = document.createElement("div");
svgTmpContainerPinFill.innerHTML = '<svg t="1701841477731" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10281" width="32" height="32"><path d="M648.728381 130.779429a73.142857 73.142857 0 0 1 22.674286 15.433142l191.561143 191.756191a73.142857 73.142857 0 0 1-22.137905 118.564571l-67.876572 30.061715-127.341714 127.488-10.093714 140.239238a73.142857 73.142857 0 0 1-124.684191 46.445714l-123.66019-123.782095-210.724572 211.699809-51.833904-51.614476 210.846476-211.821714-127.926857-128.024381a73.142857 73.142857 0 0 1 46.299428-124.635429l144.237715-10.776381 125.074285-125.220571 29.379048-67.779048a73.142857 73.142857 0 0 1 96.207238-38.034285z" p-id="10282"></path></svg>';
var svgTmpContainerRefresh = document.createElement("div");
svgTmpContainerRefresh.innerHTML = '<svg t="1701856133376" class="icon" viewBox="0 0 1302 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12120" width="32" height="32"><path d="M336.473043 508.638609c-13.423304-13.423304-34.949565-13.423304-48.083478 0l-74.050782 74.150956C191.710609 442.323478 237.534609 299.074783 338.142609 198.366609c83.556174-83.656348 194.782609-129.825391 312.987826-129.825392 118.205217 0 229.431652 46.169043 313.266087 129.825392 13.412174 13.423304 34.938435 13.423304 48.072348 0 13.133913-13.434435 13.412174-34.971826 0-48.128C916.057043 53.715478 787.500522 0.278261 651.130435 0.278261c-136.370087 0-264.926609 53.158957-361.338435 149.960348-116.535652 116.669217-169.349565 283.14713-142.514087 445.696l-87.195826-87.296c-13.412174-13.423304-34.927304-13.423304-48.061217 0-13.423304 13.434435-13.423304 34.971826 0 48.128l138.050782 138.206608c6.700522 6.722783 15.36 10.073043 24.030609 10.073044 8.659478 0 17.318957-3.350261 24.041739-10.073044l138.039652-138.206608c13.690435-13.156174 13.690435-34.693565 0.278261-48.128zM1290.24 508.638609l-138.050783-138.206609c-13.412174-13.434435-34.927304-13.434435-48.061217 0L966.077217 508.638609c-13.412174 13.434435-13.412174 34.971826 0 48.128 13.412174 13.423304 34.927304 13.423304 48.061218 0l77.968695-78.057739c9.794783 129.257739-35.205565 254.319304-127.710608 346.64626-83.556174 83.656348-194.782609 129.814261-313.266087 129.814261S421.698783 909.022609 337.864348 825.35513c-13.412174-13.434435-34.938435-13.434435-48.072348 0-13.412174 13.434435-13.412174 34.971826 0 48.128C386.203826 970.006261 514.760348 1023.443478 651.130435 1023.443478c136.370087 0 264.926609-53.158957 361.338435-149.960348 106.473739-106.607304 158.45287-250.412522 147.545043-398.970434l82.16487 82.253913c6.711652 6.711652 15.36 10.073043 24.041739 10.073043 8.648348 0 17.318957-3.361391 24.019478-10.073043 13.423304-13.156174 13.423304-34.693565 0-48.128z" fill="#2E323F" p-id="12121"></path></svg>';
var svgTmpSendButton = document.createElement('div');
svgTmpSendButton.innerHTML = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" class=""><path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>'


var svgCloseElement = svgTmpContainerClose.firstChild;
var svgIconElement = svgTmpContainerIcon.firstChild;
var svgPinElement = svgTmpContainerPin.firstChild;
var svgPinFillElement = svgTmpContainerPinFill.firstChild;
var svgRefreshElement = svgTmpContainerRefresh.firstChild;
var svgSendButton = svgTmpSendButton.firstChild;

// 创建一个dom。
function createResizeableComponent() {
  var resizeableComponent = document.createElement('div');
  resizeableComponent.className = 'resizeable-component pop-window';
  resizeableComponent.id = 'resizeableComponent'

  var resizeable_r = document.createElement('div');
  resizeable_r.className = "resizeable-r pop-window"
  resizeable_r.addEventListener('mousedown', function (ee) {
    //监听点击按钮 需要拖动这个边框，调整小窗大小
    is_resizeing = true
    resizeable_item = "resizeable_r"
  })
  var resizeable_rb = document.createElement('div');
  resizeable_rb.className = "resizeable-rb pop-window"
  resizeable_rb.addEventListener('mousedown', function (ee) {
    is_resizeing = true
    resizeable_item = "resizeable_rb"
  })
  var resizeable_b = document.createElement('div');
  resizeable_b.className = "resizeable-b pop-window"
  resizeable_b.addEventListener('mousedown', function (ee) {
    is_resizeing = true
    resizeable_item = "resizeable_b"
  })
  var resizeable_lb = document.createElement('div');
  resizeable_lb.className = "resizeable-lb pop-window"
  resizeable_lb.addEventListener('mousedown', function (ee) {
    is_resizeing = true
    resizeable_item = "resizeable_lb"
  })
  var resizeable_l = document.createElement('div');
  resizeable_l.className = "resizeable-l pop-window"
  resizeable_l.addEventListener('mousedown', function (ee) {
    is_resizeing = true
    resizeable_item = "resizeable_l"
  })
  var resizeable_lt = document.createElement('div');
  resizeable_lt.className = "resizeable-lt pop-window"
  resizeable_lt.addEventListener('mousedown', function (ee) {
    is_resizeing = true
    resizeable_item = "resizeable_lt"
  })
  var resizeable_t = document.createElement('div');
  resizeable_t.className = "resizeable-t pop-window"
  resizeable_t.addEventListener('mousedown', function (ee) {
    is_resizeing = true
    resizeable_item = "resizeable_t"
  })
  var resizeable_rt = document.createElement('div');
  resizeable_rt.className = "resizeable-rt pop-window"
  resizeable_rt.addEventListener('mousedown', function (ee) {
    is_resizeing = true
    resizeable_item = "resizeable_rt"
  })

  var biSummaryPopup = document.createElement('div');
  biSummaryPopup.className = 'bi-summary-popup pop-window';

  var biSummaryPopupHeader = document.createElement('div');

  biSummaryPopupHeader.className = 'bi-summary-popup-header pop-window';

  var biSummaryPopupHeaderLeft = document.createElement('div');
  biSummaryPopupHeaderLeft.className = 'bi-summary-popup-header-left';

  var svgElementLeft = svgIconElement;
  // biSummaryPopupHeaderLeft.appendChild(svgElementLeft);

  var biSummaryPopupTips = document.createElement('div');
  biSummaryPopupTips.className = 'bi-summary-popup-tips pop-window';
  var tipsText = document.createElement('span');
  tipsText.className = 'bi-summary-popup-tips-text pop-window';
  tipsText.textContent = 'AI';
  biSummaryPopupTips.appendChild(tipsText);

  var biSummaryPopupHeaderRight = document.createElement('div');
  biSummaryPopupHeaderRight.className = 'bi-summary-popup-header-right pop-window';

  // var biSummaryPopupLike = document.createElement('span');
  // biSummaryPopupLike.className = 'bi-summary-popup-like bi-summary-popup-header-clickable-area'
  // var biSummaryPopupDislike = document.createElement('span');
  // biSummaryPopupDislike.className = 'bi-summary-popup-dislike bi-summary-popup-header-clickable-area'

  var biSummaryPopupOpsSplitLine = document.createElement('span');
  biSummaryPopupOpsSplitLine.className = 'bi-summary-popup-ops-split-line pop-window'

  // Refresh按钮
  var biSummaryPopupRefresh = document.createElement('span');
  biSummaryPopupRefresh.className = "bi-summary-popup-refresh bi-summary-popup-header-clickable-area pop-window"
  biSummaryPopupRefresh.addEventListener('click', function () {
    //添加监听状态
    if (refreshing == false) {
      // console.log("random load message", message_record)
      // 这里要判断是不是第一条消息的总结刷新
      if ((message_record.data.length == 1) && (message_record.page.length > 1) && message_record.data[0].user == "") {
        PopGetContent(random = true, usermsgtext = "", chat_type = "launch", feature = "summary", refresh = true)
      } else {
        PopGetContent(random = true, usermsgtext = "", chat_type = "selected", feature = "summary", refresh = true)
      }

    } else {
      console.log("loadding...")
    }
  })
  biSummaryPopupRefresh.appendChild(svgRefreshElement)

  // Pin按钮
  var biSummaryPopupPin = document.createElement('span');
  biSummaryPopupPin.id = "biSummaryPopupPin"
  biSummaryPopupPin.className = "bi-summary-popup-pin bi-summary-popup-header-clickable-area pop-window"

  biSummaryPopupPin.addEventListener('click', function () {
    // 添加一个点击状态监听
    if (pop_pin_status == true) {
      // 这里要设置关闭置顶
      unPinPopWindow()
    } else {
      // 这里要设置开启置顶
      pinPopWindow()
    }
  })

  // 如果pop_pin的状态是true，就显示深色图标
  if (pop_pin_status == true) {
    biSummaryPopupPin.appendChild(svgPinFillElement)
  } else {
    biSummaryPopupPin.appendChild(svgPinElement);
  }

  // 关闭按钮
  var biSummaryPopupClose = document.createElement('span');
  biSummaryPopupClose.className = 'bi-summary-popup-close bi-summary-popup-header-clickable-area pop-window'
  biSummaryPopupClose.appendChild(svgCloseElement);
  biSummaryPopupClose.addEventListener('click', function (e) {
    //添加点击关闭小窗 
    //先关小窗再关icon
    // hidePopupWindow()
    // hideSelectionIcon()
    removePopDom()
    // 关闭小窗的同时，把置顶状态设置成false
    pop_pin_status = false
  })

  biSummaryPopupHeaderRight.appendChild(biSummaryPopupOpsSplitLine)
  biSummaryPopupHeaderRight.appendChild(biSummaryPopupRefresh)
  biSummaryPopupHeaderRight.appendChild(biSummaryPopupPin)
  biSummaryPopupHeaderRight.appendChild(biSummaryPopupClose)

  var tipsMain = document.createElement('div');
  tipsMain.className = 'bi-summary-popup-tips-main bi-summary-popup-header-clickable-area pop-window';

  var vanPopoverReference = document.createElement('span');
  vanPopoverReference.className = 'bi-summary-van-popover-reference pop-window';
  var svgElementRight = document.createElement('svg');
  vanPopoverReference.appendChild(svgElementRight);
  tipsMain.appendChild(vanPopoverReference);
  biSummaryPopupTips.appendChild(tipsMain);

  // biSummaryPopupHeaderLeft.appendChild(svgElementLeft);
  biSummaryPopupHeaderLeft.appendChild(biSummaryPopupTips);

  biSummaryPopupHeader.appendChild(biSummaryPopupHeaderLeft);
  biSummaryPopupHeader.appendChild(biSummaryPopupHeaderRight);

  var biSummaryPopupContent = document.createElement('div');
  biSummaryPopupContent.className = 'bi-summary-popup-body-abstracts pop-window';
  biSummaryPopupContent.id = 'bi-summary-popup-content';
  // biSummaryPopupContent.textContent = 'Loading...';

  var biSummaryPopupContentText = document.createElement('div');
  // biSummaryPopupContentText.id = "bi-summary-popup-content-text"
  // biSummaryPopupContentText.className = 'pop-window bi-summary-popup-content-text'
  // biSummaryPopupContentText.textContent = 'Load...'
  // biSummaryPopupContent.appendChild(biSummaryPopupContentText);

  var biSummaryPopupInput = document.createElement('div');
  biSummaryPopupInput.id = "bi-summary-popup-input"
  biSummaryPopupInput.className = 'pop-window'

  var biSummaryPopupBody = document.createElement('div');
  biSummaryPopupBody.className = 'bi-summary-popup-body pop-window';

  biSummaryPopupBody.appendChild(biSummaryPopupContent);
  biSummaryPopupBody.appendChild(biSummaryPopupInput);


  biSummaryPopup.appendChild(biSummaryPopupHeader);
  biSummaryPopup.appendChild(biSummaryPopupBody);

  resizeableComponent.appendChild(biSummaryPopup);

  resizeableComponent.appendChild(resizeable_r);
  resizeableComponent.appendChild(resizeable_rb);
  resizeableComponent.appendChild(resizeable_b);
  resizeableComponent.appendChild(resizeable_lb);
  resizeableComponent.appendChild(resizeable_l);
  resizeableComponent.appendChild(resizeable_lt);
  resizeableComponent.appendChild(resizeable_t);
  resizeableComponent.appendChild(resizeable_rt);

  // 鼠标按下事件
  biSummaryPopupHeader.addEventListener('mousedown', function (ee) {
    isDragging = true;
    user_remove_window = true

    if (pop_pin_status == true) {
      offsetX = ee.clientX - icon_x;
      offsetY = ee.clientY - icon_y;
    } else {
      refreshIconXY()
      offsetX = ee.clientX - icon_x;
      offsetY = ee.clientY - icon_y;
    }
  });

  return resizeableComponent;
}

function refreshIconXY() {
  var fy_searchBox = document.getElementById("yf_searchBox")
  var offsetYY = document.documentElement.scrollTop;
  var offsetXX = document.documentElement.scrollLeft;
  if (pop_pin_status == true) {
    icon_x = parseInt(fy_searchBox.style.left, 10)
    icon_y = parseInt(fy_searchBox.style.top, 10)
  } else {
    icon_x = parseInt(fy_searchBox.style.left, 10) - offsetXX
    icon_y = parseInt(fy_searchBox.style.top, 10) - offsetYY
  }
}

//设置小窗置顶
function pinPopWindow() {
  refreshIconXY()
  var fy_searchBox = document.getElementById("yf_searchBox")
  var offsetYY = document.documentElement.scrollTop;
  var offsetXX = document.documentElement.scrollLeft;
  var biSummaryPopupPin = document.getElementById("biSummaryPopupPin")
  pop_pin_status = true
  //替换图标
  biSummaryPopupPin.replaceChild(svgPinFillElement, biSummaryPopupPin.firstElementChild)
  fy_searchBox.style.position = "fixed";
  var new_y = icon_y;
  var new_x = icon_x
  fy_searchBox.style.top = new_y + 'px'; //调整置顶后的默认高度
  fy_searchBox.style.left = new_x + 'px';
}

//取消小窗置顶
function unPinPopWindow() {
  refreshIconXY()
  var fy_searchBox = document.getElementById("yf_searchBox")
  var offsetYY = document.documentElement.scrollTop;
  var offsetXX = document.documentElement.scrollLeft;
  var biSummaryPopupPin = document.getElementById("biSummaryPopupPin")
  pop_pin_status = false
  //替换图标
  biSummaryPopupPin.replaceChild(svgPinElement, biSummaryPopupPin.firstElementChild)
  fy_searchBox.style.position = "absolute";
  var new_y = icon_y + offsetYY;
  var new_x = icon_x + offsetXX;
  icon_y = new_y - offsetYY //这里还是设置为可视区域坐标
  fy_searchBox.style.top = new_y + 'px'; //调整取消置顶后的默认高度
  fy_searchBox.style.left = new_x + 'px';
}


// 发送消息给后端，并且更新小窗上的content
// 添加一个参数，用于重新生成
// 这里面的chat_type 目前有两种，一种是selected用来获取选中的文本，一种是 continue_chat ，用来继续聊天
// 这里feature_type 用来判断是做什么动作，summary表示总结文本/transfer表示执行翻译/
// 感觉这里chat_type和feature_type作用好像重复了，selected定位是一次性的，continue是在一次性的基础上继续对话
// 这里是在标签里面存储会话记录还是在service-worker里面存储呢？
// 如果继续对话的话，还需要上下文信息，难搞
function PopGetContent(random = false, usermsgtext = CurrentSelectedText, chat_type = "selected", feature_type = "summary", refresh = false) {
  // 更新一下刷新状态
  // console.log("PopGetContent: ", random, usermsgtext, chat_type, feature_type, refresh)
  refreshing = true

  var msgbody = {}
  //这里后面会支持两种协议，一种是SSE 一种HTTP。
  //这里第一个包就会把正文消息发送给service-worker

  if (refresh == true) {
    // console.log("message_record: ", message_record)
    // 如果是刷新的话，msgtext要进行调整，调整到上次发送的消息。这里我从历史记录里面读取。
    if (message_record.data.length == 0) {
      //这里异常了，不可能存在这种情况
    }
    if (message_record.data.length == 1) {
      //现在只有一条记录
      usermsgtext = message_record.data[0].user
      message_record = message_record_origin
      feature_type = "summary"
    } else {
      var last_msg = message_record.data[message_record.data.length - 1]
      var fix_message_record = message_record.data.splice(0, message_record.data.length - 1);
      usermsgtext = last_msg.user
      message_record.data = fix_message_record
      // console.log("fix message record: ", fix_message_record)
    }
  }
  // 默认情况下，都是直接从选中的文本中获取要发送的内容，获取的是总结
  if ((chat_type == "selected") && (feature_type == "summary")) {
    if (random == true) {
      msgbody = { cmd: "getContent", msg: usermsgtext, type: "SSE", random: true }
    } else {
      msgbody = { cmd: "getContent", msg: usermsgtext, type: "SSE", random: false }
    }
  }

  //获取翻译
  if ((chat_type == "selected") && (feature_type == "transfer")) {
    if (random == true) {
      msgbody = { cmd: "getTransfer", msg: usermsgtext, type: "SSE", random: true }
    } else {
      msgbody = { cmd: "getTransfer", msg: usermsgtext, type: "SSE", random: false }
    }
  }

  // 消息类型是要使用上下文对话
  if (chat_type == "continue_chat") {
    if (random == true) {
      msgbody = { cmd: "ContinueChat", msg: usermsgtext, type: "SSE", random: true, message_record: message_record }
    } else {
      msgbody = { cmd: "ContinueChat", msg: usermsgtext, type: "SSE", random: false, message_record: message_record }
    }
  }

  // 很纠结这里，这里是通过快捷键/或者鼠标右键/或者图标进入的，和selected区别开。。
  // 因为如果要做网页的内容总结，要把网页的内容传递给system。需要有一个单独的字段，就像message_record一样。
  if ((chat_type == "launch") && (feature_type == "summary")) {
    // 在这里获取网页的内容，修改全局变量
    page_content = getPageContent()
    if (random == true) {
      msgbody = { cmd: "SummaryPage", msg: "", type: "SSE", random: true, page_content: page_content }
    } else {
      msgbody = { cmd: "SummaryPage", msg: "", type: "SSE", random: false, page_content: page_content }
    }
  }

  // 负责执行写入消息
  var port = chrome.runtime.connect({ name: "pop" });

  port.postMessage(msgbody)

  // console.log("PostMessage: ", msgbody)
  var full_msg = ""

  // 在没有接收消息之前，就插入一个空字符串
  // 如果rewrite是false，就会在content中新建一个dom，后面的也会放在里面
  if (refresh == true) {
    // console.log("刷新，不创建新的dom，要把上一次消息发送出去")
  } else {
    insertTextToPopupContent(msgtext = full_msg, text_type = "text", chat_type = chat_type, rewrite = false)
  }
  port.onMessage.addListener(function (msg) {
    switch (msg.cmd) {
      case "keep":
        // console.log("接收到了类型为keep的消息，内容为：", msg.cmd, msg.msg, "准备执行插入DOM ", rewrite, chat_type)
        insertTextToPopupContent(msgtext = msg.msg, text_type = "text", chat_type = chat_type, rewrite = true) //使用统一的函数执行插入
        full_msg = msg.msg
        port.postMessage({ cmd: "ok" });  //如果回复cmd == ok ,说明已经收到了，service-worker暂时不做处理
        break
      case "error":
        port.postMessage({ cmd: "ok" })
        insertTextToPopupContent(msgtext = msg.msg, text_type = "text", chat_type = chat_type, rewrite = true)
        refreshing = false
        // console.log("接收到了类型为error的错误消息，错误消息内容：", msg.cmd, msg.msg)
        break;
      case "done":
        port.postMessage({ cmd: "ok" });
        // 如果是最后一个包，应该要把记录保存起来。
        // console.log("updateMessageRecord: ", feature_type, usermsgtext, full_msg)
        updateMessageRecord(feature_type = feature_type, user = usermsgtext, system = full_msg)
        if ((chat_type == 'launch') && (feature_type == 'summary')) {
          message_record.page = page_content
        }
        refreshing = false
        break;
    }
  })
}

// 这个函数的作用是创建基础的Dom
// 创建的这个dom 要和icon和小窗解耦。
function initBaseDom() {
  // 创建 根Dom yf_searchBoxOuter
  var yf_searchBoxOuter = document.createElement("div");
  yf_searchBoxOuter.className = "pop-window"
  yf_searchBoxOuter.id = "yf_searchBoxOuter";

  // 创建yf_searchBox
  var yf_searchBox = document.createElement("div");
  yf_searchBox.className = "pop-window"
  yf_searchBox.id = "yf_searchBox";

  // 编辑结构，添加到document中
  yf_searchBoxOuter.appendChild(yf_searchBox)
  // yf_searchBox.style.display = "none"
  document.body.appendChild(yf_searchBoxOuter);
}

// 显示IconDom
// 这里入参数e是鼠标松开的事件 来自鼠标松开的事件监听
function showIconDom(e) {
  // 创建一个用来放Icon的dom
  var IconRootDom = document.createElement("div")
  IconRootDom.id = "yf_IconRootDom"
  IconRootDom.className = "pop-window"

  // 创建yf_selectedText
  var yf_selectedText = document.createElement("b")
  yf_selectedText.id = "yf_selectedText"
  yf_selectedText.textContent = ""
  yf_selectedText.className = "pop-window"

  // 创建yf_searchIconOuter
  var yf_searchIconOuter = document.createElement("div")
  yf_searchIconOuter.id = "yf_searchIconOuter"
  yf_searchIconOuter.className = "pop-window"

  // 创建 yf_searchIconInner
  var yf_searchIconInner = document.createElement("span")
  yf_searchIconInner.id = "yf_searchIconInner"
  yf_searchIconInner.className = "pop-window"
  yf_searchIconOuter.appendChild(yf_searchIconInner)

  var yf_searchBoxOuter = document.getElementById("yf_searchBoxOuter")
  var yf_searchBox = document.getElementById("yf_searchBox")

  // 编辑结构，添加到document中
  IconRootDom.appendChild(yf_selectedText)
  IconRootDom.appendChild(yf_searchIconOuter)
  // IconRootDom.style.display = "none"

  yf_searchBox.appendChild(IconRootDom)
  // dom 结构创建完毕

  // 根据复制的内容初始化 Icon
  var mousexy = { x: e.clientX, y: e.clientY }
  var init_target_xy = getTargetLocation(mousexy = mousexy)
  yf_searchBox.style.left = init_target_xy.x + 'px'
  yf_searchBox.style.top = init_target_xy.y + 'px'
  yf_searchBox.style.display = 'inline-flex';

  // 这里初始化一下icon_x icon_Y 告诉其他位置
  icon_x = init_target_xy.x
  var domHeight = document.documentElement.scrollTop
  icon_y = init_target_xy.y - domHeight

  // 开始添加点击事件监听
  // 添加事件监听的目的是要打开小窗和，打开小窗之后关闭这个按钮
  IconRootDom.addEventListener('click', function (e) {
    showPopDom()
  })
}


function removeIconDom() {
  if (iconStatus == true) {
    iconStatus = false
    iconRootDom = document.getElementById("yf_IconRootDom")
    iconRootDom.remove()
  } else {
    try {
      iconRootDom = document.getElementById("yf_IconRootDom")
      iconRootDom.remove()
    } catch (error) {

    }
  }
}
function removePopDom() {
  if (openStatus == true) {
    openStatus = false
    pop_pin_status = false
    popWindowDom = document.getElementById("resizeableComponent")
    popWindowDom.remove()
  }
}

// 显示小窗口，传递两个值，一个X一个Y。作为初始坐标
// 这里X Y的坐标有两种，一种是相对当前可视区域的fixed，一种是相对文档的absolute。
// 全局变量中的icon_x/icon_y是相对文档的(默认是这种)
// 为了区分，如果传入的pin_status = true, 那么响应的x y也应该是相对当前可视区域的坐标
// 在内部它也会重新调整位置
function showPopDom(x = icon_x, y = icon_y, pin_status = false, feature_type = "summary", chat_type = "selected") {
  if (openStatus == true) {
    //如果已经打开了，就忽略
    return
  }
  //判断是不是要开启一个pin模式的小窗口
  if (pin_status == true) {
    pop_pin_status = true
  }
  // console.log("showPopDom", x, y, pin_status)
  openStatus = true
  var yf_searchBox = document.getElementById("yf_searchBox")

  // 调用函数，创建小窗的dom
  popupWindows = createResizeableComponent();
  popupWindows.style.width = popup_window_width + 'px'; // 初始宽度
  popupWindows.style.height = popup_window_height + 'px'; // 初始高度
  popupWindows.style.top = 0 + 'px';
  popupWindows.style.left = 0 + 'px';

  // 这里要加一个优化，点击打开按钮的时候，需要检测小窗即将出现的位置，判断
  // 是不是在屏幕外面，如果在屏幕外面，就要调整 searchBox出现的定位，
  // 让小窗能显示在屏幕的可视区域。
  var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  //这里点击了按钮打开小窗时，需要判断是不是要置顶的窗口
  if (pop_pin_status == true) {
    var offsetY = document.documentElement.scrollTop;
    yf_searchBox.style.position = "fixed";
    if (pin_status == true) {
      var new_y = y
    } else {
      var new_y = y - offsetY;
    }
    // 这里icon_x icon_y被第一次初始化，这里得到的x和y是算出来了一个相对屏幕的坐标
    icon_y = new_y
    icon_x = x

    yf_searchBox.style.top = icon_y + 'px'; //调整置顶后的默认高度
    yf_searchBox.style.left = icon_x + 'px';
    // 到这里都是正确的，窗口被加载出来
  } else {
    yf_searchBox.style.position = "absolute";
    var domHeight = document.documentElement.scrollTop;
    if ((x + popup_window_width) > windowWidth) {
      var new_x = windowWidth - popup_window_width - 40;
      icon_x = new_x
      yf_searchBox.style.left = icon_x + 'px';
    }
    if ((y + popup_window_height) > (windowHeight + domHeight)) {
      // 重新设置icon_y 的大小 和 更新 小图标的Y坐标
      var new_y = domHeight + (windowHeight - popup_window_height) - 40;
      icon_y = (windowHeight - popup_window_height) - 40;
      yf_searchBox.style.top = new_y + 'px';
    }
  }
  removeIconDom() //移除IconDom
  yf_searchBox.appendChild(popupWindows); //把准备好的小窗dom加入进去
  PopGetContent(random = false, usermsgtext = CurrentSelectedText, chat_type = chat_type, feature_type = feature_type, refresh = false) // 开始加载内容
}

// 获取目标的坐标，icon_x icon_y 是一个全局变量，方便其他地方引用。
function getTargetLocation(mousexy = {}, tp = "icon", fb = "selection") {
  if ((fb = "selection") && (tp == "icon")) {
    var offsetX = document.documentElement.scrollLeft;
    var offsetY = document.documentElement.scrollTop;
    // 获取选中文本的范围
    try {
      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      var rect = range.getBoundingClientRect();
    } catch (error) {
      console.error(error)
      return mousexy
    }
    var f_icon_x = 0
    var f_icon_y = 0
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    if ((rect.bottom + offsetY) > (offsetY + windowHeight)) {
      // 如果文本框下面的高度大于屏幕高度+距离顶部的高度，说明看不到图标
      // 这里初始坐标就改为显示在鼠标的右边
      f_icon_x = mousexy.x + offsetX
      f_icon_y = mousexy.y + offsetY
    } else {
      // 将鼠标坐标和文本范围的位置相结合
      if ((rect.bottom + offsetY) > (offsetY + windowHeight - 80)) {
        // 这里我想让鼠标在屏幕下面的时候，不要把图标显示到下面，会看不到。
        // 把图标显示在鼠标右边一点的位置
        // 上边会挡住内容
        f_icon_x = mousexy.x + offsetX + 40
        f_icon_y = mousexy.y + offsetY - 40
      } else {
        if (((rect.bottom + offsetY) < 10) || ((rect.left + offsetX) < 10)) {
          // 这里可能会有异常情况，如果位置太偏，比如跑到屏幕旁边，就使用鼠标的坐标
          f_icon_x = mousexy.x + offsetX
          f_icon_y = mousexy.y + offsetY
        } else {
          // console.log("选中的文本框左边和到文档顶部的右边：", rect.left, offsetX)
          f_icon_x = rect.left + offsetX
          // console.log("选中的文本框下面和到文档顶部的高度：", rect.bottom, offsetY)
          f_icon_y = rect.bottom + offsetY
        }
      }
    }
    return { "x": f_icon_x, "y": f_icon_y }
  } else {
  }
}


// 写一个函数用来更新文本内容
function insertTextToPopupContent(msgtext = "", text_type = "text", chat_type = "selected", rewrite = true) {
  //放内容用的div
  // console.log("insertTextToPopupContent Text: ", msgtext, text_type, chat_type, rewrite)

  if (text_type == "text") {
    // 如果是重写就创建新dom，不是就使用最后一个dom
    var popupContent = document.getElementById("bi-summary-popup-content")
    var popWindowsContentElement = false

    if (rewrite == true) {
      // 如果重写，就使用最后一个只元素
      popWindowsContentElement = popupContent.lastElementChild
      // console.log("insertTextToPopupContent: ", "复用了子dom")
    } else {
      // 在内容容器中，插入一个新的一个dom容器
      popWindowsContentElement = document.createElement('div')
      popWindowsContentElement.className = "pop-window bi-summary-popup-content-text"
      popupContent.appendChild(popWindowsContentElement)
      // console.log("insertTextToPopupContent: ", "创建了子dom")
    }

    // 这里判断一下是不是开启了连续对话，如果没有开启，就直接覆盖写入到dom里面就可以了，
    // 如果开启了，就要保留
    var formatedString = markdownToHtml(msgtext)
    // popWindowsContentElement.textContent = msgtext
    // console.log("formatedString Text: ", formatedString)

    popWindowsContentElement.innerHTML = formatedString;

    popupContent.scrollTop = popupContent.scrollHeight
    //在写入内容的时候要把滚动条移动到最底部
  }
}

// 鼠标移动事件
// 鼠标移动的时候需要同步移动小窗。
document.addEventListener('mousemove', function (e) {
  // 判断是不是在拖动小窗
  if (isDragging) {
    // 正在拖动
    // 计算新的元素位置
    // console.log(e.clientX, offsetX, e.clientY, offsetY)
    // 更新元素位置
    var offsetYY = document.documentElement.scrollTop;
    var offsetXX = document.documentElement.scrollLeft;
    var yf_searchBoxX = document.getElementById("yf_searchBox")
    var newX = e.clientX - offsetX
    icon_x = newX
    if (pop_pin_status == false) {

      // 这里有偏移的可能，如果在拖动之前，滚动了页面，e.clientX - offsetY 就不是新的坐标了。
      var box_y = parseInt(yf_searchBoxX.style.top, 10)
      var box_x = parseInt(yf_searchBoxX.style.left, 10)
      if ((box_y - offsetYY) != icon_y) {
        //说明窗口滚动了。
        // 这里是窗口第一次滚动
        var offset_y = box_y - offsetYY - icon_y
        // console.log("滚动了： ", offset_y)
      }
      var newY = e.clientY - offsetY
      icon_y = e.clientY - offsetY
      yf_searchBoxX.style.top = newY + offsetYY + 'px';
      yf_searchBoxX.style.left = newX + offsetXX + 'px';
    } else {
      var newY = e.clientY - offsetY;
      icon_y = newY
      yf_searchBoxX.style.top = newY + 'px';
      yf_searchBoxX.style.left = newX + 'px';
    }
  }
  //判断是不是在调整小窗大小
  if (is_resizeing) {
    refreshIconXY()
    // 说明用户自己调整了窗口大小
    user_resize_window = true;

    var resizeableComponentX = document.getElementById("resizeableComponent")
    var yf_searchBoxX = document.getElementById("yf_searchBox")
    // console.log("拖动时的e: ", e)
    // resizeableComponentX.style.height = popup_window_height + 'px'; 
    switch (resizeable_item) {
      case 'resizeable_r':
        //计算新的宽度
        var newWidth = e.clientX - icon_x
        if (newWidth >= 900) {
          newWidth = 900
        }
        if (newWidth <= 300) {
          newWidth = 300
        }
        popup_window_width = newWidth
        resizeableComponentX.style.width = newWidth + 'px';
        break;
      case 'resizeable_b':
        if (pop_pin_status == true) {
          //这里判断是什么类型的小窗口
          var newHeight = e.clientY - icon_y
          if (newHeight <= 200) {
            newHeight = 200
          }
          if (newHeight >= 800) {
            newHeight = 800
          }
          popup_window_height = newHeight
        } else {
          var newHeight = e.clientY - icon_y
          if (newHeight <= 200) {
            newHeight = 200
          }
          if (newHeight >= 800) {
            newHeight = 800
          }
          popup_window_height = newHeight
        }
        resizeableComponentX.style.height = newHeight + 'px';
        break;
      case 'resizeable_rb':
        var newWidth = e.clientX - icon_x
        var newHeight = e.clientY - icon_y
        if (newWidth >= 900) {
          newWidth = 900
        }
        if (newWidth <= 300) {
          newWidth = 300
        }
        if (newHeight <= 200) {
          newHeight = 200
        }
        if (newHeight >= 800) {
          newHeight = 800
        }
        popup_window_height = newHeight
        popup_window_width = newWidth
        resizeableComponentX.style.width = newWidth + 'px';
        resizeableComponentX.style.height = newHeight + 'px';
        break;
      case 'resizeable_l':
        var offsetXX = document.documentElement.scrollLeft;
        var newWidth = (icon_x - e.clientX) + popup_window_width

        var new_x = e.clientX
        if (newWidth >= 900) {
          newWidth = 900
          new_x = icon_x
        }
        if (newWidth <= 300) {
          newWidth = 300
          new_x = icon_x
        }
        popup_window_width = newWidth
        icon_x = new_x

        if (pop_pin_status == true) {
          yf_searchBoxX.style.left = icon_x + 'px';
        } else {
          yf_searchBoxX.style.left = icon_x + offsetXX + 'px';
        }

        resizeableComponentX.style.width = newWidth + 'px';
        break;
      case 'resizeable_lb':
        var offsetXX = document.documentElement.scrollLeft;
        var newWidth = (icon_x - e.clientX) + popup_window_width
        var new_x = e.clientX
        if (newWidth >= 900) {
          newWidth = 900
          new_x = icon_x
        }
        if (newWidth <= 300) {
          newWidth = 300
          new_x = icon_x
        }
        var newHeight = e.clientY - icon_y
        if (newHeight <= 200) {
          newHeight = 200
        }
        if (newHeight >= 800) {
          newHeight = 800
        }
        popup_window_width = newWidth
        popup_window_height = newHeight
        icon_x = new_x
        if (pop_pin_status == true) {
          yf_searchBoxX.style.left = icon_x + 'px';
        } else {
          yf_searchBoxX.style.left = icon_x + offsetXX + 'px';
        }
        resizeableComponentX.style.width = newWidth + 'px';
        resizeableComponentX.style.height = newHeight + 'px';
        break;
      case 'resizeable_lt':
        var offsetXX = document.documentElement.scrollLeft;
        var offsetYY = document.documentElement.scrollTop;
        var newWidth = (icon_x - e.clientX) + popup_window_width
        new_x = e.clientX
        if (newWidth >= 900) {
          newWidth = 900
          new_x = icon_x
        }
        if (newWidth <= 300) {
          newWidth = 300
          new_x = icon_x
        }
        popup_window_width = newWidth
        icon_x = new_x

        var new_y = e.clientY
        var newHeight = (icon_y - e.clientY) + popup_window_height
        if (newHeight <= 200) {
          newHeight = 200
          new_y = icon_y
        }
        if (newHeight >= 800) {
          newHeight = 800
          new_y = icon_y
        }
        popup_window_height = newHeight
        icon_y = new_y
        // 置顶和不置顶，计算坐标的方式不一样
        if (pop_pin_status == true) {
          yf_searchBoxX.style.top = icon_y + 'px';
        } else {
          yf_searchBoxX.style.top = icon_y + offsetYY + 'px';
        }
        if (pop_pin_status == true) {
          yf_searchBoxX.style.left = icon_x + 'px';
        } else {
          yf_searchBoxX.style.left = icon_x + offsetXX + 'px';
        }
        resizeableComponentX.style.width = newWidth + 'px';
        resizeableComponentX.style.height = newHeight + 'px';
        break;
      case 'resizeable_t':
        var offsetYY = document.documentElement.scrollTop;
        var newHeight = (icon_y - e.clientY) + popup_window_height
        if (newHeight <= 200) {
          newHeight = 200
        }
        if (newHeight >= 800) {
          newHeight = 800
        }
        popup_window_height = newHeight
        icon_y = e.clientY
        // 置顶和不置顶，计算坐标的方式不一样
        if (pop_pin_status == true) {
          yf_searchBoxX.style.top = icon_y + 'px';
        } else {
          yf_searchBoxX.style.top = icon_y + offsetYY + 'px';
        }
        resizeableComponentX.style.height = newHeight + 'px';
        break;
      case 'resizeable_rt':
        var offsetYY = document.documentElement.scrollTop;
        var newWidth = e.clientX - icon_x
        if (newWidth >= 900) {
          newWidth = 900
        }
        if (newWidth <= 300) {
          newWidth = 300
        }
        icon_x = e.clientX - newWidth
        popup_window_width = newWidth
        yf_searchBoxX.style.left = icon_x + 'px';

        var newHeight = (icon_y - e.clientY) + popup_window_height
        if (newHeight <= 200) {
          newHeight = 200
        }
        if (newHeight >= 800) {
          newHeight = 800
        }
        popup_window_height = newHeight
        icon_y = e.clientY
        // 置顶和不置顶，计算坐标的方式不一样
        if (pop_pin_status == true) {
          yf_searchBoxX.style.top = icon_y + 'px';
        } else {
          yf_searchBoxX.style.top = icon_y + offsetYY + 'px';
        }
        resizeableComponentX.style.width = newWidth + 'px';
        resizeableComponentX.style.height = newHeight + 'px';
        break;
    }
  }
});

//更新窗口大小信息
function updateConfigPopSize(height, width) {
  // console.log("updateConfigPopSize: ", width, height)
  try{
    chrome.runtime.sendMessage({ cmd: "updateConfigPopSize", config: { h: height, w: width } });
  } catch(error){
    console.log("need refresh tab")
  }
  
}

//更新窗口定位信息
function updateConfigPopLocation(x, y) {
  // console.log("updateConfigPopLocation: ", x, y, pop_pin_status)
  try{
    chrome.runtime.sendMessage({ cmd: "updateConfigPopLocation", config: { x: x, y: y, pop: pop_pin_status } });
  } catch(error){
    console.log("need refresh tab")
  }
  
}

function initConfig() {
  // 这里每次开始之前，从storage.sync中获取配置
  // 发送消息给 service-worker.js ,它负责返回配置。
  chrome.runtime.sendMessage({ cmd: "getSyncConfig" }, function (result) {
    show_selected_tip = result.config.selected_tip
    rember_pop_size = result.config.rember_pop_size
    auto_open_pop = result.config.auto_open_pop
    sync_all_pop = result.config.sync_all_pop
    continue_chat = result.config.continue_chat
    use_ctrl_enter = result.config.use_ctrl_enter
    summary_page = result.config.summary_page
    if (sync_all_pop == true) {
      // 这里需要从storage中读取记录，以及需要长链接去监听改变
    }
    if (rember_pop_size == true) {
      try {
        // 窗口大小
        popup_window_height = result.pop.pop_window_height
        popup_window_width = result.pop.pop_window_width
        // 窗口坐标
        if (result.popw.pop_window_x == null || result.popw.pop_window_y == null) {
          icon_x = 0
          icon_y = 0
        } else {
          if (result.popw.pop_window_pop == true) {
            //使用配置文件里面的pop坐标(保证可视区域)
            icon_x = result.popw.pop_window_x
            icon_y = result.popw.pop_window_y
          } else {
            icon_x = previousWidth - popup_window_width - 100
            icon_y = previousHeight - popup_window_height - 100
          }
        }
        //判断获取的坐标是不是在屏幕外面，如果是，重置坐标为0
        if (icon_x > window.innerWidth) {
          icon_x = 0
        }
        if (icon_y > window.innerHeight) {
          icon_y = 0
        }
      } catch (error) {
      }
    }
    if (auto_open_pop == true) {
      try {
        //这里如果是null的话，会有问题，如果为null ，说明没有设置过，就不打开了。
        if (result.popw.pop_window_x == null || result.popw.pop_window_y == null) {
          return
        }
        icon_x = result.popw.pop_window_x
        icon_y = result.popw.pop_window_y
        setTimeout(function () {
          // 这里需要初始化一下第一次打开要展示的内容

          if (summary_page == true) {
            showPopDom(x = icon_x, y = icon_y, pin_status = true, feature_type = "summary", chat_type = "launch")
          } else {
            CurrentSelectedText = "init_你好"
            showPopDom(x = icon_x, y = icon_y, pin_status = true, feature_type = "summary")
          }
        }, 100);
      } catch (error) {
        // console.log("load saved popw xy fail, use default ", error)
      }
    }
    if (continue_chat == true) {
      //做一些初始化操作
    }
  });
  return true
}

//初始化base dom
initBaseDom()
// console.log("base dom: ", icon_x, icon_y)
//初始化配置
initConfig()
// console.log("base config: ", icon_x, icon_y)


//获取剪贴板内容
function getSelectedText() {
  var selection = window.getSelection();
  var selectedText = selection.toString().trim();
  return selectedText
}

//监听鼠标松开
document.addEventListener('mouseup', function (e) {
  isDragging = false; //松开拖动，拖动状态为否
  is_resizeing = false; //松开拖动 (调整小窗)

  // 在开启了记住位置之后并且移动了窗口/移动了位置的情况下，需要提交更新后的位置
  if (((user_resize_window == true) || (user_remove_window == true)) && (rember_pop_size == true)) {
    updateConfigPopSize(popup_window_height, popup_window_width)
    updateConfigPopLocation(icon_x, icon_y)
  }

  // 排除是点击了 Icon/小窗/输入框 的事件，这些事件需要作出反应
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && !e.target.className.toString().includes("pop-window")) {
    // 这里要判断小窗有没有置顶，再来判断要不要重新建小窗。
    if ((pop_pin_status == false) && (openStatus == false)) {
      //删掉之前建立的Icon
      removeIconDom()
      iconStatus = false
    }
    CurrentSelectedText = getSelectedText()
    if (CurrentSelectedText == "") {
      return
    }
    if (openStatus == true) {
      return
    }

    // 这里初始化的时候，show_selected_tip会读取出来，如果设置没开，就不显示小图标。
    if (show_selected_tip == true) {
      showIconDom(e)
      iconStatus = true
      openStatus = false
    } else {
      // console.log("show_selected_tip:", show_selected_tip)
    }
    // } else {
    //   console.log("小窗是开启状态的，啥也不干", e.clientX, e.clientY, openStatus)
    // }
  } else {
    // console.log("松开鼠标之后，发现鼠标点的是自己或者输入框，移除生成的dom(icon/pop)", openStatus)
    setTimeout(function () {
      //这里如果icon已经打开了，小窗没有打开，那么就移除icon
      if (iconStatus == true && openStatus == false) {
        setTimeout(function () {
          removeIconDom()
          removePopDom()
        }, 20);
      }

      //这里是 如果 小窗已经打开了，并且是在某个点击之后
      // 这里可能需要判断是点击的哪里，判断是不是要移除小窗口。
      if (iconStatus == true && openStatus == true) {
        // setTimeout(function () {
        //   hideSelectionIcon();
        // }, 100);
      }
    }, 40)

  }
});

// 当窗口大小发生改变时，如果开了小窗/并且小窗固定了位置，也要一起改变
window.addEventListener("resize", function (e) {
  var currentWidth = window.innerWidth;
  var currentHeight = window.innerHeight;
  if ((openStatus == true) && (pop_pin_status == true)) {
    var widthDifference = currentWidth - previousWidth;
    var heightDifference = currentHeight - previousHeight;
    var fy_searchBox = document.getElementById("yf_searchBox")
    if (widthDifference != 0) {
      var new_x = icon_x + widthDifference
      if (new_x < 10) {
        new_x = 11
      }
      fy_searchBox.style.left = new_x + "px";
      icon_x = new_x
    }
    if (heightDifference != 0) {
      var new_y = icon_y + heightDifference
      if (new_y < 40) {
        new_y = 41
      }
      fy_searchBox.style.top = new_y + "px";
      icon_y = new_y
    }
  }
  previousWidth = currentWidth;
  previousHeight = currentHeight
})

// 监听键盘输入 双击两下gg，就自动打开小窗
var lastKeyPressTime = 0;
document.addEventListener("keyup", function (event) {
  var currentTime = new Date().getTime();
  try {
    var keyPressed = event.key.toLowerCase();
  } catch (error) {
    console.error(error)
    return
  }
  if (event.target.tagName == 'INPUT' || event.target.tagName == 'TEXTAREA' || event.target.className.toString().includes("pop-window")) {
    return
    // 如果监听到的按键时在输入框中，不进行处理
  }
  if (keyPressed === 'g') {
    if (currentTime - lastKeyPressTime < 300) { // 判定为双击的时间间隔
      if (pop_pin_status == false && openStatus == false) {
        //小窗没有打开，也没有固定
        if (iconStatus == true) {
          removeIconDom()
        }
        //图标没有显示，这里就不显示了。
        //需要一个函数，去直接打开小窗。。。
        CurrentSelectedText = getSelectedText()
        if (rember_pop_size == true) {
          xd = icon_x
          yd = icon_y
        } else {
          // 这里使用这个坐标的原因
          xd = previousWidth - popup_window_width - 100
          yd = previousHeight - popup_window_height - 100
        }
        if ((CurrentSelectedText == "") && (summary_page == true)) {
          showPopDom(x = xd, y = yd, pin_status = true, feature_type = "summary", chat_type = "launch")
        } else {
          if (CurrentSelectedText == "") {
            CurrentSelectedText = "init_你好"
          }
          showPopDom(x = xd, y = yd, pin_status = true, feature_type = "summary")
        }

      } else {
        // 这里是已经有打开窗口的情况下按了GG
        CurrentSelectedText = getSelectedText()
        // 如果开启了继续聊天，就服用之前的窗口，和上下文。
        if (continue_chat == true) {

        } else {
          //不复用上下文，替换之前的小窗的内容，重新生成。
        }
      }
    }
    lastKeyPressTime = currentTime;
  }
  if (keyPressed === 't') {
    if (currentTime - lastKeyPressTime < 300) { // 判定为双击的时间间隔
      if (pop_pin_status == true && openStatus == true) {
        removePopDom()
      }
    }
    lastKeyPressTime = currentTime;
  }
  if (event.key === 'Enter') {
    if (currentTime - lastKeyPressTime < 300) { // 判定为双击的时间间隔
      if (pop_pin_status == true && openStatus == true) {
        // 如果双击了b，这里计划是，使用回车，如果双击了，就能输入聊天信息了，基于当前窗口的会话。
        // 这里要判断是不是已经打开了聊天输入框，如果是的话，就跳过创建
        var inputDom = document.getElementById('yf-propmpt-send-button')
        if (inputDom == null) {
          showInputDom()
          focusInput()
        } else {
          //focusInput()
        }
      }
    }
    lastKeyPressTime = currentTime;
  }

});


// 创建显示输入框
function showInputDom() {
  var targetElement = document.getElementById("bi-summary-popup-input")
  // 插入 HTML 结构
  if (targetElement) {

    const textarea = document.createElement('textarea');
    textarea.id = 'yf-prompt-textarea';
    textarea.tabIndex = 0;
    textarea.rows = 1;
    textarea.placeholder = 'Message …';

    const sendButton = document.createElement('button');
    sendButton.id = 'yf-propmpt-send-button';
    sendButton.appendChild(svgSendButton);

    sendButton.addEventListener('click', function (event) {
      if (textarea.value.trim() == "" || textarea == undefined) {
        return
      }
      sendChatMessage(textarea.value)
      textarea.value = "";
    })

    //监听输入，判断输入框高度
    textarea.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight > 120 ? 120 : this.scrollHeight) + 'px';
    });

    // 监听回车键 执行发送消息
    textarea.addEventListener('keydown', function (event) {
      if (event.key == 'Escape') {
        //如果按退出建的话，取消输入框的焦点。
        textarea.blur();
      }

      // 监听 ctrl+Enter ，如果是的话就发送消息
      if (use_ctrl_enter == true) {
        var isCtrlKey = event.ctrlKey || event.metaKey;
        var isEnterKey = event.key === "Enter" || event.keyCode === 13;
        if (isCtrlKey && isEnterKey) {
          if (textarea.value.trim() == "" || textarea == undefined) {
            return
          }
          event.preventDefault(); // 阻止默认的换行行为
          sendChatMessage(textarea.value)
          textarea.value = "";
        }
      } else {
        var isEnterKey = event.key === "Enter" || event.keyCode === 13;
        if (isEnterKey) {
          if (textarea.value.trim() == "" || textarea == undefined) {
            return
          }
          event.preventDefault(); // 阻止默认的换行行为
          sendChatMessage(textarea.value)
          textarea.value = "";
        }
      }
    })

    targetElement.appendChild(textarea);
    targetElement.appendChild(sendButton);
  } else {
    console.error('Target element not found.');
  }
}

// 移除输入框
function removeInputDom() {
  var targetElement = document.getElementById("bi-summary-popup-input")
  targetElement.remove()
}

// 让输入框成为页面焦点
function focusInput() {
  textare = document.getElementById('yf-prompt-textarea')
  textare.focus()
}

// 发送新聊天消息 
function sendChatMessage(msgtext) {
  var popupContent = document.getElementById("bi-summary-popup-content")
  var msgBoxElement = document.createElement('div')
  msgBoxElement.className = "userMsgBox"
  var msgTitle = document.createElement('div')
  msgTitle.className = "userMsgTitleBox"
  var titleEle = document.createElement('span')
  titleEle.className = "userMsgtitleEle"
  titleEle.textContent = 'You'
  msgTitle.appendChild(titleEle)
  var msgBox = document.createElement('div')
  msgBox.className = "userMsgBody"
  msgDom = formatUserMsg(msgtext)
  msgBox.appendChild(msgDom)

  msgBoxElement.appendChild(msgTitle)
  msgBoxElement.appendChild(msgBox)
  popupContent.appendChild(msgBoxElement)
  // 发送消息之后，把消息内容滚动到屏幕底部
  popupContent.scrollTop = popupContent.scrollHeight

  PopGetContent(random = false, usermsgtext = msgtext, chat_type = "continue_chat", feature_type = "chat", refresh = false)
}

// 监听消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // 监听 service-worker 发送来的消息，打开小窗口
  if (request.cmd == "pop") {
    if (pop_pin_status == false && openStatus == false) {
      //小窗没有打开，也没有固定
      if (iconStatus == true) {
        removeIconDom()
      }
      //图标没有显示，这里就不显示了。
      //需要一个函数，去直接打开小窗。。。
      if (rember_pop_size == true) {
        xd = icon_x
        yd = icon_y
      } else {
        xd = previousWidth - popup_window_width - 100
        yd = 100
      }
      CurrentSelectedText = getSelectedText()
      if ((CurrentSelectedText == "") && (summary_page == true)) {
        showPopDom(x = xd, y = yd, pin_status = true, feature_type = "summary", chat_type = "launch")
      } else {
        if (CurrentSelectedText == "") {
          CurrentSelectedText = "init_你好"
        }
        showPopDom(x = xd, y = yd, pin_status = true, feature_type = "summary")
      }

    } else {
      // console.log("注意这里pop是处于置顶状态", openStatus)
    }
  }
  if (request.cmd == "transfer") {
    //这歌翻译是来自鼠标右键的上下文菜单
    if (pop_pin_status == false && openStatus == false) {
      //小窗没有打开，也没有固定
      if (iconStatus == true) {
        removeIconDom()
      }
      if (rember_pop_size == true) {
        xd = icon_x
        yd = icon_y
      } else {
        xd = previousWidth - popup_window_width - 100
        yd = 100
      }
      CurrentSelectedText = request.msg
      showPopDom(x = xd, y = yd, pin_status = true, feature_type = "transfer")

    } else {
      // console.log("注意这里pop是处于置顶状态", openStatus)
    }
  }
});

// markdown 文本转 HTML
function markdownToHtml(markdown) {
  // console.log("markdown origin: ", markdown)
  if (markdown == undefined) {
    return ""
  }
  const lines = markdown.split('\n');
  let html = '';

  let inCodeBlock = false;
  let inInlineCode = false;

  for (const line of lines) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (!inCodeBlock) {
        html += '</code></pre>';
      } else {
        const language = line.slice(3).trim();
        html += `<pre><code class="${language}">`;
      }
    } else if (line.includes('`')) {
      const segments = line.split('`');
      for (let i = 0; i < segments.length; i++) {
        if (i % 2 === 0) {
          // Outside of backticks, escape HTML
          html += escapeHtml(segments[i]);
        } else {
          // Inside backticks, treat as inline code
          html += `<code>${escapeHtml(segments[i])}</code>`;
        }
      }
      html += '\n';
    } else if (inCodeBlock) {
      html += escapeHtml(line) + '\n';
    } else if (line.startsWith('#')) {
      const headerLevel = line.indexOf(' ');
      const headerText = line.slice(headerLevel + 1);
      html += `<h${headerLevel}>${headerText.trim()}</h${headerLevel}>\n`;
    } else if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.') || line.startsWith('6.')) {
      const listItemText = line.slice(3);
      html += `<li>${listItemText.trim()}</li>\n`;
    } else if (line.startsWith('[') && line.includes('](')) {
      const linkText = line.slice(1, line.indexOf(']'));
      const linkUrl = line.slice(line.indexOf('(') + 1, line.indexOf(')'));
      html += `<a href="${linkUrl}">${linkText}</a>\n`;
    } else {
      html += `<p>${escapeHtml(line)}</p>\n`;
    }
  }

  return html;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, (match) => map[match]);
}

// 格式化用户的输入
function formatUserMsg(inputString) {
  // 将换行符替换为<br>
  const formattedString = inputString.replace(/\n/g, '<br>');
  // 使用<p>标签包裹文本
  const paragraphs = formattedString.split('<br>').map(text => `<p>${text}</p>`);
  // 创建一个包含所有段落的div元素
  const containerDiv = document.createElement('div');
  containerDiv.innerHTML = paragraphs.join('');
  return containerDiv;
}


// 更新消息记录
function updateMessageRecord(feature_type = "summary", user = "", system = "") {
  // 创建包含 feature/user/system 的对象
  var newData = {
    feature: feature_type,
    user: user,
    system: system
  };
  // 将新数据推入 data 数组
  message_record.data.push(newData);
}


// 获取当前网页的内容
function getPageContent() {
  const bodyElement = document.body;
  const clonedNode = bodyElement.cloneNode(true);
  function removeTags(currentNode) {
    if (currentNode.nodeType == Node.ELEMENT_NODE) {
      //移除不要的标签
      const forbiddenTags = ['script', 'link', 'meta', 'img', 'svg', 'b', 'hr', 'button', 'font'];
      if (forbiddenTags.includes(currentNode.tagName.toLowerCase())) {
        return null;
      }
      // 移除属性
      const attributes = currentNode.attributes;
      for (let i = attributes.length - 1; i >= 0; i--) {
        currentNode.removeAttribute(attributes[i].name);
      }
      //递归处理子节点
      const childNodes = currentNode.childNodes;

      for (let i = childNodes.length - 1; i >= 0; i--) {
        const result = removeTags(childNodes[i]);
        if (!result) {
          currentNode.removeChild(childNodes[i]);
        }
      }

      // 如果这个标签是code，把这个标签换成文本标签
      if (currentNode.tagName.toLowerCase() == 'code') {
        if (currentNode.childNodes.length == 1) {
          return currentNode.childNodes[0]
        }
      }
      //如果当前这个节点的子dom长度是0，返回null
      if (childNodes.length == 0) {
        return null
      }
    } else if (currentNode.nodeType === Node.COMMENT_NODE) {
      // Remove comment nodes
      return null;
    } else if (currentNode.nodeType === Node.TEXT_NODE) {
      var text = currentNode.nodeValue.trim()
      if (text == "") {
        return null;
      }
      if (text.length <= 3) {
        // console.log("currentNode: ", currentNode)
      }
    }
    return currentNode.cloneNode(true);
  }
  removeTags(clonedNode);

  function extractPTagsContent(domElement, element) {
    var pTags = domElement.querySelectorAll(element);

    var resultArray = [];
    pTags.forEach(function (pTag) {
      var textContent = pTag.textContent.trim();
      resultArray.push(textContent);
    });

    return resultArray;
  }
  //尝试去简化dom，但是失败了。。。
  p_result = extractPTagsContent(clonedNode, 'p')
  //返回一个列表
  return p_result;
}