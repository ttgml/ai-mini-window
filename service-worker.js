// 监听 Storage 状态的改变 （配置文件)
chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(
            `Storage key "${key}" in namespace "${namespace}" changed.`,
            oldValue, newValue
        );
        //更新这里全局的options
        if (key == "options" && namespace == "sync") {
            current_options = newValue
        }
    }
});

// 不知道这种方式是不是对的，初始化的时候，就把配置作为全局变量加入到service-worker.js中
// 为了方便调用。。。就不用每次都获取了。。
// update 这里的方法不对，一段时间不调用，会被销毁，要改成用storage。
var current_options = {}
var current_ernie_access_token = {}
var current_ernie_access_token_create_time = 0

var current_lang = ""

const initCurrentOptions=  chrome.storage.sync.get("options").then((items) => {
    Object.assign(current_options, items.options);
  });

// 监听安装事件，初始化默认设置
chrome.runtime.onInstalled.addListener(function (details) {
    const options = {};
    options.selected_tip = false
    options.rember_pop_size = true
    options.auto_open_pop = false
    options.sync_all_pop = false
    options.service = 'ernie'
    options.model = 'ernie3'

    chrome.storage.sync.set({ options });
    console.log("inited");

    current_options.selected_tip = false
    current_options.rember_pop_size = true
    current_options.auto_open_pop = false
    current_options.sync_all_pop = false
    current_options.service = 'ernie'


    // 添加右键菜单
    chrome.contextMenus.create({
        id: "transfer",
        title: chrome.i18n.getMessage('menuTransferTitle'),
        type: 'normal',
        contexts: ['selection']
    });

    // //判断是不是首次安装，如果首次安装，自动打开设置页面
    if (details.reason == 'install') {
        chrome.runtime.openOptionsPage();
    }
});

//收集卸载反馈
// chrome.runtime.onInstalled.addListener(details => {
//     if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
//         chrome.runtime.setUninstallURL('https://sout.ltd/');
//     }
// });


// 生成1到10000之间的随机整数
function getRandomNumber() {
    var randomNumber = Math.floor(Math.random() * 10000) + 1;
    return randomNumber;
}

//判断是不是空的对象
function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

//解析字符串为js对象，用于解析SSE响应
function parseStringToObject(inputString) {
    var resultObject = {};

    try {
        resultObject = JSON.parse(inputString);
        return resultObject
    } catch (error) {

    }
    // console.log("原始数据: ", inputString)
    // 使用正则表达式进行分割，支持值中包含冒号
    const keyValuePairs = inputString.match(/([^:\n]+:[^\n]*)/g);
    // 创建一个空对象用于存储解析结果

    // 遍历键值对数组并解析成对象的属性
    keyValuePairs.forEach(pair => {
        const [key, ...values] = pair.split(':');
        const trimmedKey = key.trim();
        let parsedValue;
        // 对值进行处理，尝试将其解析为 JSON 对象
        try {
            parsedValue = JSON.parse(values.join(':').trim());
        } catch (error) {
            // 如果解析失败，将原始字符串值存储
            parsedValue = values.join(':').trim();
        }
        // 将键值对添加到结果对象中
        resultObject[trimmedKey] = parsedValue;
    });
    return resultObject;
}

//openai sse对象解析
function parseDatatoList(input) {
    // 以"data: {"为分隔符将输入文本分割成数据块数组
    var lines = input.split('\n')
    result = []
    //   console.log(lines)
    lines.forEach(function (value, i) {
        // console.log(value,i)
        try {
            if ((value.length > 4) && (value.trim()[0] != '{')) {
                new_json = JSON.parse(value.slice(5))
            }
            if ((value.length > 4) && (value.trim()[0] == '{')) {
                new_json = JSON.parse(value)
            }
            result.push(new_json)
        } catch (error) {
            console.log(error)
        }
    })
    return result;
}


//刷新访问文心一言访问 token
function preProcessRequest() {
    if (current_options.service == 'ernie') {
        const queryParams = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: current_options.client_apikey,
            client_secret: current_options.client_secret,
        });
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (isObjectEmpty(current_ernie_access_token)) {
            var api_url = 'https://aip.baidubce.com/oauth/2.0/token'
            console.log("current_ernie_access_token is Empty, refresh it")
            return new Promise((resolve, reject) => {
                fetch(`${api_url}?${queryParams}`, requestOptions).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                }).then(data => {
                    if (data.error == undefined) {
                        // console.log('Response:', data);
                        current_ernie_access_token = data
                        current_ernie_access_token_create_time = new Date().getTime() / 1000
                        resolve(
                            new Promise((resolve, reject) => {
                                resolve({
                                    target_url: current_options.service_url + "?access_token=" + current_ernie_access_token.access_token
                                })
                            })
                        )
                    } else {
                        throw new Error(`HTTP error! Msg: ${data.error}`);
                    }
                }).catch(error => {
                    reject(error)
                });
            })
        } else {
            return new Promise((resolve, reject) => {
                resolve({
                    target_url: current_options.service_url + "?access_token=" + current_ernie_access_token.access_token
                })
            })
        }
    }
    if (current_options.service == 'openai') {
        return new Promise((resolve, reject) => {
            resolve({
                target_url: current_options.service_url
            })
        })
    }
    if (current_options.service == 'qwen') {
        return new Promise((resolve, reject) => {
            resolve({
                target_url: current_options.service_url
            })
        })
    }
}


// 初始化SSE请求参数 普通总结 千问
function initReqestOption(text = "", seed = 1000, message_record = {}, feature_type = "summary", page_content = []) {
    // 判断有没有在初始化的时候传入消息记录，如果有记录，就是连续对话，需要把消息记录放在body中。
    var base_role_content = "You are a helpful assistant."
    var requestBody = {}
    var headers = false
    var fake_content = ""

    // console.log(text, seed, message_record, feature_type, page_content)
    if ((text == "init_你好")||(text == "")) {
        text = chrome.i18n.getMessage('sw_user_hello')
    }

    if (feature_type == "summary") {
        // base_role_content = "请帮我总结一下下面的内容讲了什么，不要疑问，不要像机器人一样，只管总结内容，记得要用中文"
        base_role_content = "You are a helpful assistant."
        if (isObjectEmpty(message_record) == true) {
            if (seed == 1000) { // 这里等于1000的话说明不是刷新
                base_role_content = chrome.i18n.getMessage('sw_base_role_summary')
            } else {
                // 是在执行刷新操作，可能会最新的一条消息是空的
            }

        } else {
            if (message_record.page.length > 1) {
                page_content = message_record.page
                text_content = ""
                page_content.forEach(function (value, i) {
                    text_content = text_content + value + "\n"
                })
                fake_content = text_content
                base_role_content = "You are a helpful assistant."
            } else {
                console.log("message_record.page.length > 1: ", message_record.page.length)
            }
        }
    }
    if (feature_type == "transfer") {
        base_role_content = chrome.i18n.getMessage('sw_base_role_transfer')
    }

    if (feature_type == "summarypage") {
        text_content = ""
        page_content.forEach(function (value, i) {
            text_content = text_content + value + "\n"
        })
        fake_content = text_content
        if (page_content.length > 10) {
            // base_role_content = "你是一个助手，后面的对话将会基于这份内容，它是来自一个网页: " + text_content
            text = chrome.i18n.getMessage('sw_user_role_summary')
        } else {
            base_role_content = "You are a helpful assistant."
            text = chrome.i18n.getMessage('sw_user_hello')
        }

    }
    // console.log("fake_content: ",fake_content,message_record)
    // console.log(text, seed, message_record, feature_type, base_role_content)

    switch (current_options.service) {
        case 'openai':
            if (isObjectEmpty(message_record) == true) {
                full_message = []
                full_message.push({
                    "role": "system",
                    "content": base_role_content
                })
                if (fake_content.length > 10) {
                    full_message.push({
                        "role": "user",
                        "content": chrome.i18n.getMessage('sw_base_set_history') + fake_content
                    })
                    full_message.push({
                        "role": "assistant",
                        "content": chrome.i18n.getMessage('sw_user_ok')
                    })
                }
                full_message.push({
                    "role": "user",
                    "content": text
                })
                requestBody = JSON.stringify({
                    "model": current_options.model,
                    "messages": full_message,
                    "seed": seed,
                    "stream": true
                })
            } else {
                full_message = []
                full_message.push({
                    "role": "system",
                    "content": base_role_content
                })
                if (fake_content.length > 10) {
                    full_message.push({
                        "role": "user",
                        "content": chrome.i18n.getMessage('sw_base_set_history') + fake_content
                    })
                    full_message.push({
                        "role": "assistant",
                        "content": chrome.i18n.getMessage('sw_user_ok')
                    })
                }
                message_record.data.forEach(function (obj) {
                    if (obj.user == '') {
                        full_message.push({
                            "role": "user",
                            "content": chrome.i18n.getMessage('sw_user_role_summary')
                        })
                    } else {
                        full_message.push({
                            "role": "user",
                            "content": obj.user
                        })
                    }
                })
                full_message.push({
                    "role": "user",
                    "content": text
                })

                requestBody = JSON.stringify({
                    "model": current_options.model,
                    "messages": full_message,
                    "seed": seed,
                    "stream": true
                })
            }
            headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + current_options.apikey,
            })
            // console.log("op: ", headers)
            break
        case 'qwen':
            if (isObjectEmpty(message_record) == true) {
                full_message = []
                full_message.push({
                    "role": "system",
                    "content": base_role_content
                })
                if (fake_content.length > 10) {
                    full_message.push({
                        "role": "user",
                        "content": chrome.i18n.getMessage('sw_base_set_history') + fake_content
                    })
                    full_message.push({
                        "role": "assistant",
                        "content": chrome.i18n.getMessage('sw_user_ok')
                    })
                }
                full_message.push({
                    "role": "user",
                    "content": text
                })
                requestBody = JSON.stringify({
                    "model": current_options.model,
                    "input": {
                        "messages": full_message
                    },
                    "parameters": {
                        "seed": seed
                    }
                })
            } else {
                // 这里base_role_content 需要改成你是一个助手
                full_message = []
                full_message.push({
                    "role": "system",
                    "content": base_role_content
                })
                if (fake_content.length > 10) {
                    full_message.push({
                        "role": "user",
                        "content": chrome.i18n.getMessage('sw_base_set_history') + fake_content
                    })
                    full_message.push({
                        "role": "assistant",
                        "content": chrome.i18n.getMessage('sw_user_ok')
                    })
                }
                message_record.data.forEach(function (obj) {
                    // console.log("record obj: ", obj)
                    if (obj.user == '') {
                        full_message.push({
                            "role": "user",
                            "content": chrome.i18n.getMessage('sw_user_role_summary')
                        })
                    } else {
                        full_message.push({
                            "role": "user",
                            "content": obj.user
                        })
                    }

                    full_message.push({
                        "role": "assistant",
                        "content": obj.system
                    })
                })
                full_message.push({
                    "role": "user",
                    "content": text
                })

                requestBody = JSON.stringify({
                    "model": current_options.model,
                    "input": {
                        "messages": full_message
                    },
                    "parameters": {
                        "seed": seed
                    }
                })
            }
            headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + current_options.apikey,
                'X-DashScope-SSE': 'enable'
            })
            // console.log("qw: ", headers)
            break
        case 'ernie':
            if (isObjectEmpty(message_record) == true) {
                full_message = []
                if (fake_content.length > 10) {
                    full_message.push({
                        "role": "user",
                        "content": chrome.i18n.getMessage('sw_base_set_history') + fake_content
                    })
                    full_message.push({
                        "role": "assistant",
                        "content": chrome.i18n.getMessage('sw_user_ok')
                    })
                }
                full_message.push({
                    "role": "user",
                    "content": text
                })
                requestBody = JSON.stringify({
                    "system": base_role_content,
                    "messages": full_message,
                    "stream": true
                })
            } else {
                full_message = []
                if (fake_content.length > 10) {
                    full_message.push({
                        "role": "user",
                        "content": chrome.i18n.getMessage('sw_base_set_history') + fake_content
                    })
                    full_message.push({
                        "role": "assistant",
                        "content": chrome.i18n.getMessage('sw_user_ok')
                    })
                }
                message_record.data.forEach(function (obj) {
                    if (obj.user == '') {
                        full_message.push({
                            "role": "user",
                            "content": chrome.i18n.getMessage('sw_user_role_summary')
                        })
                    } else {
                        full_message.push({
                            "role": "user",
                            "content": obj.user
                        })
                    }
                    full_message.push({
                        "role": "assistant",
                        "content": obj.system
                    })
                })
                full_message.push({
                    "role": "user",
                    "content": text
                })

                requestBody = JSON.stringify({
                    "system": base_role_content,
                    "messages": full_message,
                    "stream": true
                })
            }
            headers = new Headers({
                'Content-Type': 'application/json'
            })
            // console.log("op: ", headers)
            break
        default:
            console.log('current_options.service: ', current_options)
    }
    //判断对象是不是空的
    console.log("current_options.service", current_options.service)

    // console.log(requestBody)
    return { "headers": headers, "requestBody": requestBody }
}


// long-lived connections message
// 这里需要popup/content-script 发起翻译的请求，根据不同的类型。
// 如果是文本比较长的，就使用长链接返回结果。
// 还有聊天需要交互式发送消息的，也用长链接推送
chrome.runtime.onConnect.addListener(async function (port) {
    // console.assert(port.name == "pop");
    var openai_full_msg = ""
    var openai_tmp_msg = ""
    var ernie_full_msg = ""
    var ernie_tmp_msg = ""
    var ernie_msg_ids = []

    try {
        await initCurrentOptions;
      } catch (e) {
        // Handle error that occurred during storage initialization.
      }
    port.onMessage.addListener(function (msg) {
        if (port.name == "pop") {  //这里判断一下是不是content-script发送过来的消息
            // 需要从这里开始，就要创建EventSource 连接
            // console.log("接收到一条新消息 ", msg.cmd, msg)
            var opts = {}

            if (msg.cmd == "ok") {
                return
            }
            if (msg.cmd == "getContent") {
                if (msg.random == true) {
                    //如果要求随机的话，就随机生成一个新的种子
                    opts = initReqestOption(text = msg.msg, seed = getRandomNumber(), message_record = {}, feature_type = "summary")
                } else {
                    opts = initReqestOption(text = msg.msg, seed = 1000, message_record = {}, feature_type = "summary")
                }
            }
            if (msg.cmd == "ContinueChat") {
                if (msg.random == true) {
                    //如果要求随机的话，就随机生成一个新的种子
                    opts = initReqestOption(text = msg.msg, seed = getRandomNumber(), message_record = msg.message_record, feature_type = "summary")
                } else {
                    opts = initReqestOption(text = msg.msg, seed = 1000, message_record = msg.message_record, feature_type = "summary")
                }
            }
            if (msg.cmd == "getTransfer") {
                if (msg.random == true) {
                    //如果要求随机的话，就随机生成一个新的种子
                    opts = initReqestOption(text = msg.msg, seed = getRandomNumber(), message_record = {}, feature_type = "transfer")
                } else {
                    opts = initReqestOption(text = msg.msg, seed = 1000, message_record = {}, feature_type = "transfer")
                }
            }
            if (msg.cmd == "SummaryPage") {
                if (msg.random == true) {
                    //如果要求随机的话，就随机生成一个新的种子
                    opts = initReqestOption(text = "", seed = getRandomNumber(), message_record = {}, feature_type = "summarypage", page_content = msg.page_content)
                } else {
                    opts = initReqestOption(text = "", seed = 1000, message_record = {}, feature_type = "summarypage", page_content = msg.page_content)
                }
            }
            // opts.headers.forEach(function(value, name) {
            //     console.log("header: ",name, value);
            // });
            // 判断一些有没有进行配置
            if ((current_options.service == undefined)) {
                error_msg = chrome.i18n.getMessage('sw_error_msg_unset')
                port.postMessage({ cmd: "error", msg: error_msg })
                return
            }



            //疏忽了，这里如果opts没有初始化，是不发送消息的，初始化后才执行下面的发送消息
            if (isObjectEmpty(opts) == false) {
                // console.log("opts 初始化完毕: ", opts)
                var sse_opts = {}
                controller = new AbortController()
                sse_opts.method = 'POST'
                sse_opts.headers = opts.headers
                sse_opts.body = opts.requestBody
                signal = controller.signal
                mode = 'no-cors'
                sse_opts.onopen = () => {
                    // console.log("conn to sse success")
                }
                sse_opts.onclose = () => {
                    // console.log("conn to sse close")
                    port.postMessage({ cmd: "done" })
                }
                sse_opts.onmessage = (event) => {

                    if (current_options.service == 'qwen') {
                        msg_data = parseStringToObject(event)
                        // console.log("event :", msg_data)
                        if (msg_data.event == 'error') {
                            // console.log("error", msg_data)
                            port.postMessage({ cmd: "error", msg: msg_data.data.message })
                        } else {
                            port.postMessage({ cmd: "keep", msg: msg_data.data.output.text })
                        }
                    }
                    if (current_options.service == 'openai') {
                        event = event.trim()
                        // console.log(event)
                        if ((event.charAt(event.length - 1) == '}') || (event.slice(-12) == 'data: [DONE]')) {
                            if (event.slice(-12) == 'data: [DONE]') {
                                event = event.slice(0, event.length - 12)
                                // console.log("end: ", event)
                            }
                            openai_tmp_msg = openai_tmp_msg + event
                            msg_data_list = parseDatatoList(openai_tmp_msg)
                            // console.log("bbb: ",msg_data_list)
                            openai_tmp_msg = ""
                        } else {
                            // console.log(event)
                            openai_tmp_msg = openai_tmp_msg + event
                            return
                        }
                        msg_data_list.forEach(function (value, i) {
                            msg_data = value
                            if (msg_data.choices[0].delta.content == undefined){
                            } else {
                                openai_full_msg = openai_full_msg + msg_data.choices[0].delta.content
                                port.postMessage({ cmd: "keep", msg: openai_full_msg })
                            }
                        })
                    }
                    if (current_options.service == 'ernie') {
                        msg_data_list = parseDatatoList(event.trim())
                        if ((msg_data_list.length == 1) && (msg_data_list[0].error_msg != undefined)) {
                            msg_data = msg_data_list[0]
                            // console.log(msg_data)
                            port.postMessage({ cmd: "error", msg: msg_data.error_msg })
                            return
                        }
                        msg_data_list.forEach(function (value, i) {
                            // console.log(value)
                            if (ernie_msg_ids.includes(value.sentence_id)) {
                                return
                            }
                            ernie_tmp_msg = ernie_tmp_msg + value.result
                            ernie_msg_ids.push(value.sentence_id)
                            port.postMessage({ cmd: "keep", msg: ernie_tmp_msg })
                        })
                    }
                }
                sse_opts.onerror = (e) => {
                    var error_msg = ""
                    if (e.status == 401) {
                        error_msg = chrome.i18n.getMessage('sw_error_msg_auth')
                    }
                    if (e.status == 1) {
                        // console.log(e.msg)
                        error_msg = chrome.i18n.getMessage('sw_error_msg_unset')
                    } else {
                        error_msg = chrome.i18n.getMessage('sw_error_msg_unset')
                    }
                    port.postMessage({ cmd: "error", msg: error_msg })
                }
            }

            //初始化接口URL/Parms
            preProcessRequest().then(data => {
                // console.log("fetch target_url: ",data)
                fetch(data.target_url, sse_opts).then(response => {
                    // console.log("rr", response)
                    if (response.status == 200) {
                        sse_opts.onopen && sse_opts.onopen()
                        return response.body;
                    } else {
                        if (current_options.service == 'openai') {
                            if (response.status == 401) {
                                //return response.body
                                throw new Error(JSON.stringify({ msg: 'invalid_request_error', status: response.status, message: response.body }));
                            }
                            else {
                                throw new Error(JSON.stringify({ msg: 'invalid_request_error', status: response.status, message: response.body }))
                            }
                        } else {
                            // console.log("error response: ", response)
                            throw new Error(JSON.stringify({ msg: 'Backend interface request failed', status: response.status, message: response.body }));
                        }
                    }
                }).then(data => {
                    const reader = data.getReader();
                    const push = () => {
                        return reader.read().then(({ done, value }) => {
                            if (done) {
                                sse_opts.onclose && sse_opts.onclose()
                                return
                            }
                            sse_opts.onmessage && sse_opts.onmessage(new TextDecoder().decode(value))
                            return push()
                        })
                    }
                    return push()
                }).catch(e => {
                    // console.log(e)
                    e = e.toString()
                    var errorObject = {}
                    try {
                        errorObject = JSON.parse(e.slice(7))
                    } catch (error) {
                        errorObject = {
                            msg: e.toString(),
                            status: 1
                        }
                    }
                    sse_opts.onerror && sse_opts.onerror(errorObject)
                })
            }).catch(e => {
                error_msg = chrome.i18n.getMessage('sw_error_msg_unset')
                port.postMessage({ cmd: "error", msg: error_msg })
            })


        } else {
            console.log("wait")
        }

    });
});

// // one-time message
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //获取Storage.sync的配置
    if (message.cmd == "getSyncConfig") {
        chrome.storage.sync.get(["options", "pop", "popw"], function (result) {
            sendResponse({ config: result.options, pop: result.pop, popw: result.popw });
        });
    }
    if (message.cmd == "updateConfigPopSize") {
        pop = {}
        pop.pop_window_height = message.config.h
        pop.pop_window_width = message.config.w
        chrome.storage.sync.set({ pop })
    }
    if (message.cmd == "updateConfigPopLocation") {
        popw = {}
        popw.pop_window_x = message.config.x
        popw.pop_window_y = message.config.y
        popw.pop_window_pop = message.config.pop
        chrome.storage.sync.set({ popw })
    }
    return true
})

// 监听点击图标的事件，如果点击图标，自动打开一个
chrome.action.onClicked.addListener((tab) => {
    try {
        chrome.tabs.sendMessage(tab.id, { cmd: "pop" });
    } catch (error) {
        console.log(error)
    }

})


// 监听鼠标右键菜单的点击
chrome.contextMenus.onClicked.addListener((item, tab) => {
    const menuItemId = item.menuItemId;
    if (menuItemId == "transfer") {
        try {
            chrome.tabs.sendMessage(tab.id, { cmd: "transfer", msg: item.selectionText })
        } catch (error) {
            console.log(error)
        }

    }
});
