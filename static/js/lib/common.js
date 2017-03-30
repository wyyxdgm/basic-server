/*全局js*/

/*decode html*/
function decodeHtml(str) {
    var s = "";
    if (!str || !str.length) {
        return "";
    }
    s = str.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&amp;/g, "&");
    return s;
}
/*date format*/
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

function GBU() {
    $("[data-toggle='tooltip']").tooltip();
}
/*在页面范围内。使得回车会触发--对select选定节点的单击事件*/
function enterclick(select) {
    document.onkeydown = function(e) {
        var ev = document.all ? window.event : e;
        if (ev.keyCode == 13) {
            $(select).click();
        }
    }
}
/*bootstrap tooltip*/
$(function() {
    GBU();
});

/*全局可用 弹出对话*/
window.tip = function(msg, title) {
    var html = '';
    html += '<div class="modal fade" class="myModal" tabindex="-1" style="z-index:8889" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
    html += '    <div class="modal-dialog">'
    html += '        <div class="modal-content">'
    html += '            <div class="modal-header">'
    html += '                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">'
    html += '                    &times;'
    html += '                </button>'
    if (title !== false) {
        html += '                <h4 class="modal-title" id="myModalLabel">{{title}}</h4>'.replace('{{title}}', title || '提示');
    }
    html += '            </div>'
    html += '            <div class="modal-body" id="msg"></div>'
    html += '            <div class="modal-footer text-center">'
    html += '                <a class="btn btn-default btn-close-modal col-md-pull-4 col-xs-pull-4" data-dismiss="modal">关闭</a>'
    html += '            </div>'
    html += '        </div>'
    html += '    </div>'
    html += '</div>'
    var $doc = $(html);
    $doc.appendTo('body').find('#msg').html(msg);
    return $doc.modal('show');
}