/**
 * Created by seven on 2016/7/15.
 */
// http请求
var bbcare = {};
var isDebug=true;
bbcare.baseUrl=isDebug?"http://121.43.227.180:8080/v21/":"http://cloud-v26.bb-care.com/v26/";
// bbcare.baseUrl=isDebug?"http://192.168.2.16:8080/NewBBcareServer/":"http://cloud-v26.bb-care.com/v26/";
// bbcare.baseUrl=isDebug?"http://192.168.1.13:8080/NewBBcareServer/":"http://cloud2.bb-care.com/v24/";
//通用方法组件
bbcare.comm = {};

bbcare.comm.post = function (url,params, callback) {
    $.post(url,params,function(data,status){
        callback(data,status);
    });
};
bbcare.comm.get = function (url, callback) {
    $.get(url,function(data,status){
        callback(data,status);
    });
};
bbcare.get=function(params,callback){
    var par={
        type:'get',
        url:params.url,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        timeout:30000
    };
    par.success=function(result,status,request) {
        if(result.code=='302'){
            alert("长时间未操作，请重新登录");
            window.location.href=window.location.href.split("?")[0].replace("index.html","user/login.html");
        }
        else {
            if (callback)callback(true, result);
        }
    };
    par.error=function(xhr, errorType, error,msg){
        if(callback)callback(false,errorType);
    };
    $.ajax(par);
};
bbcare.post=function(params,callback){
    var par={
        type:'post',
        url:params.url,
        data:params.data,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        timeout:30000
    };
    par.success=function(result,status,request) {
        if(result.code=='302'){
            alert("长时间未操作，请重新登录");
            window.location.href=window.location.href.split("?")[0].replace("index.html","user/login.html");
        }else if(result.code=='500'){
            layer.msg('服务器错误，请刷新后尝试', {icon: 2});
        }
        else {
            if (callback)callback(true, result);
        }
    };
    par.error=function(xhr, errorType, error,msg){
        console.log(xhr);console.log(errorType);
        if(callback)callback(false,errorType);
    };
    $.ajax(par);
};
/**
 *定向菜单
 * @param fatherIndex 左侧父级菜单索引
 * @param subIndex  顶部菜单索引  在navConfig.js中定义
 */
bbcare.selMenu=function(fatherIndex,subIndex){
    if(fatherIndex>1||subIndex>navConfig[fatherIndex].length-1)return;
    $(".bb-nav-left").removeClass("active");
    $($(".bb-nav-left")[fatherIndex * 1]).addClass("active");
    $("#navbar").navbar({
        cid: "content",
        list: navConfig[fatherIndex * 1]
    },subIndex);
};
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = {};
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
// 验证表单信息
//验证表单
var Validator = function () {
    this.cache = [];
};

Validator.prototype.add = function (value, rules) {
    var self = this;
    for (var i = 0, rule; rule = rules[i++];) {
        (function (rule) {
            var strategyAry = rule.strategy.split(':');
            var errorMsg = rule.errorMsg;

            self.cache.push(function () {
                var strategy = strategyAry.shift();
                strategyAry.unshift(value);
                strategyAry.push(errorMsg);
                return strategies[strategy].apply(value, strategyAry);
            });
        })(rule)
    }
};

Validator.prototype.start = function () {
    for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
        var errorMsg = validatorFunc();
        if (errorMsg) {
            return errorMsg;
        }
    }
};

var strategies = {
    //判断是否为空
    isNonEmpty: function (value, errorMsg) {
        if (value === '') {
            return errorMsg;
        }
    },
    //最低长度
    minLength: function (value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg;
        }
    },
    //最大长度
    maxLength: function (value, length, errorMsg) {
        if (value.length > length) {
            return errorMsg;
        }
    },
    //手机号验证
    isMobile: function (value, errorMsg) {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    },
    //手机号11位初步验证
    isMobileLength: function (value, errorMsg) {
        if (value.length != 11) {
            return errorMsg;
        }
    },
    //是否是数字
    isNumber: function (value, errorMsg) {
        if (!isNaN(value)) {
            return errorMsg;
        }
    },
    //是否为正整数
    isIntNumber: function (value, errorMsg) {
        var re = /^[1-9]+[0-9]*]*$/;
        if (!re.test(value)) {
            return errorMsg;
        }
    },
    //控制小数点位数
    docLength: function (value, length, errorMsg) {
        if (value.toString().split(".")[1] && value.toString().split(".")[1].length >= length) {
            return errorMsg;
        }
    },
    //正数
    upZero: function (value, errorMsg) {
        if (!(/^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/).test(value)) {
            return errorMsg;
        }
    },
    //判断是否是-1
    isNegative: function (value, errorMsg) {
        /*if (value != "不限次" && ( isNaN(value) || value < -1 || value != 0)) {
         return errorMsg;
         }*/
        if (isNaN(value) && value !== -1) {
            return errorMsg;
        }
    },
    // 判断单选是否被选择
    isRadioChecked:function (value,errorMsg) {
        if(!value){
            return errorMsg;
        }
    }
};

//渲染checkbox、radion
bbcare.renderCheckRadio = function () {
    $('input').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
        increaseArea: '20%' // optional
    });
};

//初始化日期控件
bbcare.initDatePick = function(){
    $('.datetimepicker').datetimepicker({
        language:  'fr',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });
};

//获取问卷表单填写信息
bbcare.getFormValue = function (formID) {
    var form = document.getElementById(formID);
    var ansObj = {};
    ansObj.answer = [];
    var values = {};
    //文本题型
    var inputs = form.getElementsByTagName('textarea');
    for (var i = 0; i < inputs.length; i++) {
        var data = {};
        data.note = inputs[i].value;
        data.questionId = inputs[i].name;
        if ($(inputs[i]).attr("data-basicColumn")) {
            data.basicColumn = $(inputs[i]).attr("data-basicColumn");
        }
        ansObj.answer[ansObj.answer.length] = data;
    }
    //选择题型
    inputs = form.getElementsByTagName('select');
    for (var i = 0; i < inputs.length; i++) {
        // var data = {};
            if ($(inputs[i]).attr("data-basicColumn") == 'pregnancyWeek'){
                // data.note = 7*$("#"+inputs[i].name).val()+ 1*inputs[i].value;
                var data = {};
                var mypregnancyWeek = 7*$("#"+inputs[i].name).val()+ 1*inputs[i].value;
                data.note = mypregnancyWeek.toString();
            }else{
                var data = {note:[]};
                // data.note = inputs[i].value;
                data.note.push(inputs[i].value);
            }
            data.questionId = inputs[i].name;
            if ($(inputs[i]).attr("data-basicColumn")) {
                data.basicColumn = $(inputs[i]).attr("data-basicColumn");
            }
            ansObj.answer[ansObj.answer.length] = data;
    }
    //input输入题型
    inputs = form.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        var data={};
        if(inputs[i].type == 'text'||inputs[i].type == 'number'||inputs[i].type == 'email'){

            switch ($(inputs[i]).attr("data-type"))
            {
                case "19":
                    break;
                case "20":
                    if(!inputs[i].value)continue;
                    var hasKey=false;
                    var code = $(inputs[i]).attr("data-code");
                    for(var j = 0; j < ansObj.answer.length; j++){
                        if(ansObj.answer[j].questionId ==inputs[i].name){
                            ansObj.answer[j].note.push(""+code+":"+inputs[i].value+"");
                            hasKey=true;
                        }
                    }
                    if(!hasKey){
                        data = {note:[]};
                        data.note.push(""+code+":"+inputs[i].value+"");
                        data.questionId = inputs[i].name;
                        if ($(inputs[i]).attr("data-basicColumn")){
                            data.basicColumn = $(inputs[i]).attr("data-basicColumn");
                        }
                        ansObj.answer[ansObj.answer.length] = data;
                    }
                    break;
                default:
                    data.note=inputs[i].value;
                    data.questionId = inputs[i].name;
                    if ($(inputs[i]).attr("data-basicColumn")){
                        data.basicColumn = $(inputs[i]).attr("data-basicColumn");
                    }
                    ansObj.answer[ansObj.answer.length] = data;
            }

        }else if(inputs[i].type == 'file'){
            data.note=$(inputs[i]).attr("data-img");
            data.questionId = inputs[i].id;
            if ($(inputs[i]).attr("data-basicColumn")){
                data.basicColumn = $(inputs[i]).attr("data-basicColumn");
            }
            ansObj.answer[ansObj.answer.length] = data;
        }else if(inputs[i].type == 'radio'||inputs[i].type == 'checkbox'){
            //if开始
            if (inputs[i].checked) {
                //switch开始
                switch ($(inputs[i]).attr("data-type"))
                {
                    case "19":
                        var hasKey=false;

                        var textID = $(inputs[i]).attr("id");
                        var textValue = $(inputs[i]).attr("data-value");

                        var domList = $("."+textID);
                        for(var t=0;t<domList.length;t++){
                            textValue = textValue.replace("_",domList[t].value);
                        }

                        for(var j = 0; j < ansObj.answer.length; j++){
                            if(ansObj.answer[j].questionId ==inputs[i].name){
                                // ansObj.answer[j].note.push(inputs[i].value);
                                ansObj.answer[j].note.push(textValue);
                                hasKey=true;
                            }
                        }
                        if(!hasKey){
                            data = {note:[]};

                            data.note.push(textValue);

                            data.questionId = inputs[i].name;
                            if ($(inputs[i]).attr("data-basicColumn")){
                                data.basicColumn = $(inputs[i]).attr("data-basicColumn");
                            }
                            ansObj.answer[ansObj.answer.length] = data;
                        }
                        break;
                    default:
                            var hasKey=false;
                            for(var j = 0; j < ansObj.answer.length; j++){
                                if(ansObj.answer[j].questionId ==inputs[i].name){
                                    ansObj.answer[j].note.push(inputs[i].value);
                                    hasKey=true;
                                }
                            }
                            if(!hasKey){
                                data = {note:[]};
                                data.note.push(inputs[i].value);
                                data.questionId = inputs[i].name;
                                if ($(inputs[i]).attr("data-basicColumn")){
                                    data.basicColumn = $(inputs[i]).attr("data-basicColumn");
                                }
                                ansObj.answer[ansObj.answer.length] = data;
                            }
                 }
                  //结束
            }
            //if结束

        }
    }
    for(var i = 0; i < inputs.length; i++){
        var resList=$.grep(ansObj.answer,function (value){
            return value.questionId==inputs[i].name;
        });
        if(resList.length<=0){
            ansObj.answer[ansObj.answer.length]={questionId:inputs[i].name,note:""}
        }
    }
    return ansObj;
};
function formatGenderText(gender) {
    if (gender == 'F') {
        gender = '女孩';
    } else {
        gender = '男孩';
    }
    return gender;
}
log=function(log){
    if(isDebug)console.log(log);
};

bbcare.alertMsg = function (msg) {
    $(".modal-body").html(msg);
    $('#myModal').modal('show');
};

//定义load
var openLoad = function (divID) {

    var divHeight = $("#buildInfo").height();
    var divWidth = $("#buildInfo").width();
    // alert(divHeight);alert(divWidth);
    
    var loadingTop = (divHeight - 80)/2+"px";
    var loadingLeft = (divWidth - 80)/2+"px";
    // var loadImg = '<img class="loadImg" style="background-repeat: no-repeat;position: relative;left:'+loadingLeft+';top:'+loadingTop+';" width="80px" height="80px" src="http://121.43.227.180:8080/upload/loading.gif">';
    var loadDiv = '<div id="foo" style="background-repeat: no-repeat;position: relative;left:'+loadingLeft+';top:'+loadingTop+';z-index: 999;width:80px; height:80px;border:1px solid red"></div>';
    $("#"+divID+"").append(loadDiv);
    var opts = {
        lines: 9, // The number of lines to draw
        length: 0, // The length of each line
        width: 10, // The line thickness
        radius: 15, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        color: '#000', // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
    };
    var target = document.getElementById('foo');
    var spinner = new Spinner(opts).spin(target);
};

var closeLoad = function () {
    $("#foo").remove();
};

//初始化滑动框
var initSwiper = function (len) {
    $("#timeAxis").css('display','');
    if(len<5){
        var myShowLen = len;
        $(".swiper-button-prev").css('display','none');
        $(".swiper-button-next").css('display','none');

        $(".swiper-container").parent().width('100%');
    }else{
        myShowLen = 5;
        $(".swiper-button-prev").css('display','');
        $(".swiper-button-next").css('display','');
        $(".swiper-container").parent().width('80%');
    }
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: myShowLen,
        paginationClickable: true,
        spaceBetween:0,
        freeMode: true,
        prevButton:'.swiper-button-prev',
        nextButton:'.swiper-button-next'
    });
};

//定义翻页组件
var loadPageList = function (total) {
    $("#pagination").html('');
    totalPage = Math.ceil(total/rows);
    var pageli ="<li>"
        +"                            <a style=\"cursor: pointer\" onclick=\"prePage()\" aria-label=\"Previous\">"
        +"                                <span aria-hidden=\"true\">&laquo;</span>"
        +"                            </a>"
        +"                        </li>";
    if(totalPage<=10){
        startPage = 1;
        endPage = totalPage;
    }else if(totalPage>nowBigPage*10){
        startPage = (nowBigPage-1)*10+1;
        endPage = nowBigPage*10;
    }else{
        startPage = (nowBigPage-1)*10+1;
        endPage = totalPage;
    }
    for(var i=startPage;i<=endPage;i++){
        if(i == indexPage){
            pageli+="<li onclick=\"gotoPage("+i+")\" style=\"cursor: pointer\" class='active'><a>"+i+"</a></li>";
        }else{
            pageli+="<li onclick=\"gotoPage("+i+")\" style=\"cursor: pointer\" class=''><a>"+i+"</a></li>";
        }
    }
    pageli+="                        <li>"
        +"                            <a style=\"cursor: pointer\" onclick=\"nextPage()\" aria-label=\"Next\">"
        +"                                <span aria-hidden=\"true\">&raquo;</span>"
        +"                            </a>"
        +"                        </li>";
    $("#pagination").append(pageli);
};


var setBtnDisabled =function (btnDom) {
    $(btnDom).attr('disabled','true');
};

var removeBtnDisabled = function (btnDom) {
    $(btnDom).removeAttr('disabled');
};

