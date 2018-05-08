//支付
Vue.prototype.openLink=function(){
    Dialog.iframePage({title:"服务条款",url:'/home/Setting/payClause',width:"900"})
}
Vue.prototype.paymsg=function(){
    this.msg.pay_message=true;
    $('.agree-serve-input').prop('checked',true);
    var _self=this;
    $.ajax({
        url:_self.api.getmsgnum,
        type:"POST",
        dataType:'json',
        data:{},
        success:function(d){
            if(d.errcode==0){
                _self.msg.currentMsg=0;
                _self.msg.num=1;
                _self.msgpro=d.data.msg_pro;
                _self.msg.bussName=d.data.tenantMsg.tenamt_name;
                _self.msg.rest_message=d.data.tenantMsg.last_msg;
                _self.msg.id=d.data.msg_pro[0].id;
                _self.msg.price=d.data.msg_pro[0].price;
                _self.msg.nowPrice=d.data.msg_pro[0].sale;
                _self.msg.typeNum=d.data.msg_pro[0].num;
            }
        }
    });
}
Vue.prototype.payorder=function(){
    if(!this.msg.payInter){ this.payMsg(); return false; }
    var _self=this;
    if($('#inputAcp').prop('checked')==false){
        $.pt({target:"#inputAcp",content:"<div class='c_col_96 c_center'>请勾选同意服务条款</div>",width:200});
        return "prevent";
    }
    $.ajax({
        url:this.api.getorder,
        type:'post',
        data:{},
        success:function(d){
            if(d.errcode==0){
                if(d.data.status==0){
                    Dialog.customsMessage('<div class="c_center">当前订单已支付成功，是否重新下单？</div>',function(){
                        if(_option_.dingdingWeb!="dingdingWeb"){
                            var con=$("<input type='hidden' name='id' value='"+_self.msg.id+"'/> <input type='hidden' name='num' value='"+_self.msg.num+"'/>");
                            con.prependTo('#alipaysubmit2');
                            document.forms['alipaysubmit2'].submit();
                        }else{
                            DingTalkPC.biz.util.openLink({
                                url:d.data.payment_list,//要打开链接的地址
                                onSuccess : function(result) {},
                                onFail : function() {}
                            })
                        }
                    },function(){
                        _self.msg.pay_message=true;
                    },'')
                    _self.msg.pay_message=false;
                }else{
                    if(_option_.dingdingWeb!="dingdingWeb"){
                        window.open(d.data.payment_list);
                    }else{
                        DingTalkPC.biz.util.openLink({
                            url:d.data.payment_list,//要打开链接的地址
                            onSuccess : function(result) {},
                            onFail : function() {}
                        })
                    }
                }
            }else{
                Dialog.error(d.errmsg);
            }
        }
    });
}
Vue.prototype.payMsg=function(){
    var acceptClause=$('#inputAcp').prop('checked');
    var _self=this;
    if(!_self.msg.id) return false;
    if(acceptClause==false){
        $.pt({target:"#inputAcp",content:"<div class='c_col_96 c_center'>请勾选同意服务条款</div>",width:200});
        return "prevent";
    }else if(_option_.dingdingWeb!="dingdingWeb"&&_self.msg.canPayOne){
        _self.msg.canPayOne=false;
        var con=$("<input type='hidden' name='id' value='"+_self.msg.id+"'/> <input type='hidden' name='num' value='"+_self.msg.num+"'/>");
        con.prependTo('#alipaysubmit2');
        document.forms['alipaysubmit2'].submit();
        _self.msg.canPayOne=true;
        _self.msg.payInter=true;
    }else if(_option_.dingdingWeb=="dingdingWeb"&&_self.msg.canPayOne){
        _self.msg.canPayOne=false;
        $.ajax({
            type:"POST",
            url:"/Api/Pay/doalipay",
            ansyc:false ,
            data:{"id":_self.msg.id,'num':_self.msg.num},
            success:function(d){
                if(d.data&&d.data.payment_list){
                    DingTalkPC.biz.util.openLink({
                        url:d.data.payment_list,//要打开链接的地址
                        onSuccess : function(result) {
                            _self.msg.canPayOne=true;
                            console.log("result",result)
                        },
                        onFail : function() {}
                    })
                }
                _self.msg.payInter=true;
            },
            error:function(d){
                _self.msg.payInter=true;
            }
        });
    };
}
Vue.prototype.setCurrentMsg=function(param,price,id,typeNum){
    if(this.msg.payInter){return false;}
    this.msg.currentMsg = param;
    this.msg.price=price;
    this.msg.id=id;
    this.msg.typeNum=typeNum;
}
Vue.prototype.payStatus=function () {
    $.ajax({
        type:'post',
        url:'/Api/Pay/check',
        data:{},
        success:function (d) {
            if(d.errcode!=0){
                Dialog.error(d.errmsg);
            }
        },
        error:function (d) {
            // Dialog.error(d);
        }
    })
}
Vue.prototype.payNumkeydown=function(){
    var _this=this;
    if(parseInt(_this.msg.num)>99) _this.msg.num=99;
}

//分页
Vue.prototype.totlePage=function(){
    var _self=this;
    var indexPage=1;
    var indexPageInput="";
    //跳到首页
    $("body").on("click", ".page-index", function () {
        _self.options.page=1
        _self.ajaxTableHtml();
    });
    //跳到末页
    $("body").on("click", ".page-end", function () {
        _self.options.page=_self.options.allPage;
        _self.ajaxTableHtml();
    });
    //跳到指定页
    $("body").on("click", ".pages.fl a", function () {
        _self.options.page=$(this).html();
        _self.ajaxTableHtml();
    });
    //跳到相近页
    $("body").on("click", ".btn-prev", function (){
        if(_self.options.page>1){
            _self.options.page=_self.options.page-1;
            _self.ajaxTableHtml();
        }
    });
    $("body").on("click", ".btn-next", function () {
        if(_self.options.page<_self.options.allPage){
            _self.options.page=Number(_self.options.page)+1;
            _self.ajaxTableHtml();
        }
    });
    //跳到指定页
    $(this.obj).on("keyup", "#input-s", function (e) {
        var changeInput=document.getElementById('input-s');
        changeInput.onpropertychange = changeInput.oninput = changeInput.onchange = function(){
            if( _self.options.page != this.value && this.value>0&&_self.options.allPage>=this.value){
                indexPageInput=this.value;
            }
        };
        if(e.keyCode == 13){
            if( _self.options.page != this.value && this.value>0&&_self.options.allPage>=this.value){
                _self.options.page=$(this).val();
                _self.ajaxTableHtml();
            };
        };
    });
    $("body").on("click", "#btn-go", function () {
        if( indexPageInput>0&&_self.options.allPage>=indexPageInput){
            _self.options.page=indexPageInput;
            _self.ajaxTableHtml();
        };
    });
    //选择每页条数
    $('body').on('click', '.list a', function (e) { // 选择每页显示条数
        _this = $(this);
        _this.addClass('on').siblings().removeClass('on');
        _this.closest('.list').hide();
        var search=$('#mem_name').val() || '';
        var _val = _this.text();
        $(_self.obj).find('.select-num').text(_val);
        _self.options.page=1;
        _self.options.pagesize=$(this).html();
        _self.ajaxTableHtml();
    });
}

//弹窗滚动处理
Vue.prototype.stop_scroll=function() {
    $('body').css("overflow","hidden");
}
Vue.prototype.can_scroll= function () {
    $('body').css("overflow","auto");
}