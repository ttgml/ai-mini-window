var $ = mdui.$;
var inst = new mdui.Tab('#tab');

const options = {};
const popw = {}
const pop = {}

const baseSetting = document.getElementById("baseSetting");

var save_button = $('#save');
var option_apikey = $('#apikey');
var option_openai_mirror_url = $('#openai-mirror-url');
var option_client_apikey = $('#client-apikey');
var option_client_secret = $('#client-secret')

var option_service_model = $('.service-model');
var option_service = $('.option-service');
var option_selected_tip = $('#option-selected-tip');
var option_continue_chat = $('#option-continue-chat');
var option_auto_open_pop = $('#option-auto-open-pop');
var option_rember_pop_size = $('#option-rember-pop-size');
var option_sync_all_pop = $('#option-sync-all-pop');
var option_use_ctrl_enter = $('#option-use-ctrl-enter');
var option_summary_page = $('#option-summary-page');

var option_service_openai = $('#option-service-openai')
var option_service_qwen = $('#option-service-qwen')
var option_service_ernie = $('#option-service-ernie')

var display_openai_models = $('#openai-models')
var display_qwen_models = $('#qwen-models')
var display_ernie_models = $('#ernie-models')

var display_set_apikey = $('#set-api-key')
var display_set_client_secret = $('#set-client-secret')

var display_set_openai_mirror = $('#set-openai-mirror')


// 为了国际化/支持中英文
$('#option_page_title').text(chrome.i18n.getMessage('option_page_title'))
$('#n_tab_setting').text(chrome.i18n.getMessage('n_tab_setting'))
$('#n_tab_help').text(chrome.i18n.getMessage('n_tab_help'))
$('#n_tab_about').text(chrome.i18n.getMessage('n_tab_about'))
$('#n_sett_h1').text(chrome.i18n.getMessage('n_sett_h1'))
$('#n_sett_svc').text(chrome.i18n.getMessage('n_sett_svc'))
$('#n_srv_wx').text(chrome.i18n.getMessage('n_srv_wx'))
$('#n_srv_qw').text(chrome.i18n.getMessage('n_srv_qw'))
$('#n_sett_key').text(chrome.i18n.getMessage('n_sett_key'))
$('#n_sett_model').text(chrome.i18n.getMessage('n_sett_model'))
$('#n_sett_openai_url').text(chrome.i18n.getMessage('n_sett_openai_url'))
$('#n_sett_xc').text(chrome.i18n.getMessage('n_sett_xc'))
$('#n_op_icon').text(chrome.i18n.getMessage('n_op_icon'))
$('#n_op_summ').text(chrome.i18n.getMessage('n_op_summ'))
$('#n_op_open').text(chrome.i18n.getMessage('n_op_open'))
$('#n_op_size').text(chrome.i18n.getMessage('n_op_size'))
$('#n_op_ctrl').html(chrome.i18n.getMessage('n_op_ctrl'))
$('#save').text(chrome.i18n.getMessage('save'))
$('#n_sett_savetip').text(chrome.i18n.getMessage('n_sett_savetip'))
$('#n_help_h1').text(chrome.i18n.getMessage('n_help_h1'))
$('#n_help_p1').html(chrome.i18n.getMessage('n_help_p1'))
$('#n_help_p2').html(chrome.i18n.getMessage('n_help_p2'))
$('#n_help_hg3').html(chrome.i18n.getMessage('n_help_hg3'))
$('#n_help_pp1').html(chrome.i18n.getMessage('n_help_pp1'))
$('#n_help_pp2').html(chrome.i18n.getMessage('n_help_pp2'))
$('#n_help_pp3').html(chrome.i18n.getMessage('n_help_pp3'))
$('#n_help_pp4').html(chrome.i18n.getMessage('n_help_pp4'))
$('#n_help_hp4').html(chrome.i18n.getMessage('n_help_hp4'))
$('#n_help_pp5').html(chrome.i18n.getMessage('n_help_pp5'))
$('#n_help_hp5').html(chrome.i18n.getMessage('n_help_hp5'))
$('#n_help_pp6').html(chrome.i18n.getMessage('n_help_pp6'))
$('#n_about_h1').html(chrome.i18n.getMessage('n_about_h1'))

// // Immediately persist options changes
// baseSetting.debug.addEventListener("change", (event) => {
//     options.debug = event.target.checked;
//     chrome.storage.sync.set({ options });
//   });


option_service_openai.on('click', function () {
    display_set_apikey.show()
    display_set_openai_mirror.show()
    display_set_client_secret.hide()
    display_openai_models.show()
    display_qwen_models.hide()
    display_ernie_models.hide()
    var model_value = $('input[name=model]:checked').val()
    $.each(option_service_model, function (index, value) {
        if ($(value).val() == model_value) {
            $('.service-model[value="' + options.model + '"]').prop('checked', false);
        }
    })
    option_apikey.val("")
})

option_service_qwen.on('click', function () {
    display_set_apikey.show()
    display_set_openai_mirror.hide()
    display_openai_models.hide()
    display_set_client_secret.hide()
    display_qwen_models.show()
    display_ernie_models.hide()
    var model_value = $('input[name=model]:checked').val()
    $.each(option_service_model, function (index, value) {
        if ($(value).val() == model_value) {
            $('.service-model[value="' + options.model + '"]').prop('checked', false);
        }
    })
    option_apikey.val("")
})

option_service_ernie.on('click', function () {
    display_set_apikey.hide()
    display_openai_models.hide()
    display_set_openai_mirror.hide()
    display_set_client_secret.show()
    display_qwen_models.hide()
    display_ernie_models.show()
    var model_value = $('input[name=model]:checked').val()
    $.each(option_service_model, function (index, value) {
        if ($(value).val() == model_value) {
            $('.service-model[value="' + options.model + '"]').prop('checked', false);
        }
    })
    option_apikey.val("")
})

save_button.on('click', function () {
    var service_value = $('input[name=service]:checked').val()
    var apikey_value = option_apikey.val()
    var openai_mirror_url_value = option_openai_mirror_url.val()
    var client_apikey_value = option_client_apikey.val()
    var client_secret_value = option_client_secret.val()
    var model_value = $('input[name=model]:checked').val()
    var selected_tip_value = $('#option-selected-tip').prop('checked')
    var continue_chat_value = $('#option-continue-chat').prop('checked')
    var auto_open_pop_value = $('#option-auto-open-pop').prop('checked')
    var rember_pop_size_value = $('#option-rember-pop-size').prop('checked')
    var sync_all_pop_value = $('#option-sync-all-pop').prop('checked')
    var use_ctrl_enter_value = $('#option-use-ctrl-enter').prop('checked')
    var summary_page_value = $('#option-summary-page').prop('checked')

    if ((service_value == "") || (model_value == "")) {

        mdui.snackbar({
            message: chrome.i18n.getMessage('tip_save_fail'),
            position: 'top',
        });
        return
    }
    if (service_value == 'ernie') {
        if (client_apikey_value.trim() == "") {
            mdui.snackbar({
                message: chrome.i18n.getMessage('tip_save_fail'),
                position: 'top',
            });
            return
        }
    } else {
        if (apikey_value.trim() == "") {
            mdui.snackbar({
                message: chrome.i18n.getMessage('tip_save_fail'),
                position: 'top',
            });
            return
        }
    }

    // console.log(service_value,apikey_value,model_value,selected_tip_value,continue_chat_value,auto_open_pop_value)
    // 想要支持几种服务
    // 这种实现方式太挫了，不只是接口地址不同，响应/请求都不一样。。。

    options.service = service_value
    if (service_value == 'qwen') {
        options.service_url = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"
    }
    if (service_value == 'openai') {
        options.service_url = "https://api.openai.com/v1/chat/completions"
        if (openai_mirror_url_value.trim() != "") {
            options.service_url = openai_mirror_url_value.trim()
            options.openai_mirror_url = openai_mirror_url_value.trim()
        }
    }

    if (model_value == 'ernie4') {
        options.service_url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro"
    }
    if (model_value == 'ernie8k') {
        options.service_url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_bot_8k"
    }
    if (model_value == 'ernie3') {
        options.service_url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions"
    }
    if (model_value == 'ernietb') {
        options.service_url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/eb-instant"
    }


    if (service_value == 'ernie') {
        options.client_apikey = client_apikey_value.trim()
        options.client_secret = client_secret_value.trim()
    } else {
        options.apikey = apikey_value.trim()
    }

    options.model = model_value
    options.selected_tip = selected_tip_value
    options.continue_chat = continue_chat_value
    options.auto_open_pop = auto_open_pop_value
    options.rember_pop_size = rember_pop_size_value
    options.sync_all_pop = sync_all_pop_value
    options.use_ctrl_enter = use_ctrl_enter_value
    options.summary_page = summary_page_value

    chrome.storage.sync.set({ options })
    console.log(options)
    mdui.snackbar({
        message: chrome.i18n.getMessage('tip_save_success'),
        position: 'top',
    });
    return true
});


async function loadData() {
    // Initialize the form with the user's option settings
    const data = await chrome.storage.sync.get("options");
    Object.assign(options, data.options);

    $.each(option_service, function (index, value) {
        if ($(value).val() == options.service) {
            $('.option-service[value="' + options.service + '"]').prop('checked', true)
        }
    })

    if (options.service == "qwen") {
        display_qwen_models.show()
        display_openai_models.hide()
        display_ernie_models.hide()
        display_set_apikey.show()
        display_set_client_secret.hide()
        display_set_openai_mirror.hide()
        option_apikey.val(options.apikey);
    }
    if (options.service == "openai") {
        display_qwen_models.hide()
        display_openai_models.show()
        display_ernie_models.hide()
        display_set_apikey.show()
        display_set_client_secret.hide()
        display_set_openai_mirror.show()
        option_apikey.val(options.apikey);
    }
    if (options.service == 'ernie') {
        display_qwen_models.hide()
        display_openai_models.hide()
        display_ernie_models.show()
        display_set_apikey.hide()
        display_set_client_secret.show()
        display_set_openai_mirror.hide()
        option_client_apikey.val(options.client_apikey)
        option_client_secret.val(options.client_secret)
    }

    if (options.openai_mirror_url != undefined && options.openai_mirror_url.trim() != "") {
        option_openai_mirror_url.val(options.openai_mirror_url)
    } else {
        option_openai_mirror_url.val('https://api.openai.com/v1/chat/completions')
    }

    $.each(option_service_model, function (index, value) {
        if ($(value).val() == options.model) {
            $('.service-model[value="' + options.model + '"]').prop('checked', true);
        }
    })

    option_selected_tip.prop('checked', options.selected_tip)
    option_continue_chat.prop('checked', options.continue_chat)
    option_auto_open_pop.prop('checked', options.auto_open_pop)
    option_rember_pop_size.prop('checked', options.rember_pop_size)
    option_sync_all_pop.prop('checked', options.sync_all_pop)
    option_use_ctrl_enter.prop('checked', options.use_ctrl_enter)
    option_summary_page.prop('checked', options.summary_page)
    console.log(options)

    if (options.service == undefined) {
        inst.show(1)
    } else {
        if (options.service == 'ernie') {
            if (options.client_apikey == undefined) {
                inst.show(1)
                mdui.snackbar({
                    message: chrome.i18n.getMessage('tip_unset_apikey'),
                    position: 'top',
                });
            } else {
                if (options.client_apikey.trim() == "") {
                    inst.show(1)
                    mdui.snackbar({
                        message: chrome.i18n.getMessage('tip_unset_apikey'),
                        position: 'top',
                    });
                }
            }
        } else {

            if (options.apikey.trim() == '') {
                inst.show(1)
                mdui.snackbar({
                    message: chrome.i18n.getMessage('tip_unset_apikey'),
                    position: 'top',
                });
            }
        }
    }
}

$(function () {
    loadData();
})