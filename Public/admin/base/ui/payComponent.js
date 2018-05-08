
//在页面上放上    ajaxHtml为页面刷新支付状态值的方法
// <include file="./Public/Public/payComponent.html"/>
// <pay-com @refreshPage="ajaxHtml"></pay-com>

Vue.component('pay-com',{
    template:'#pay-msg-tem',
    data:function () {
        return {
            api:{
                getmsgnum:'/Api/Setting/payMessage',
                getorder:'/Api/pay/reCreatAlipaySubmit',
                cancelorder:'/Api/pay/cancleOutTradeNo',
                check:'/Api/Pay/check'
            },
            payMessage:{},
            diaMsg:{
                pay_message:true,
                payInter:false,         //已开始支付
                currentMsg:0,			//存储支付短信切换样式
                price:0,			//原价
                nowPrice:0,			//现价
                rabe:0,			//折扣
                num:1,			//数量
                id:0,			//支付时商品id
            }
        }
    },
    props:[],
    created:function () {
        this.payGetAjax();
    },
    methods:{
        payGetAjax:function () {
            var _self=this;
            $.ajax({
                url:_self.api.getmsgnum,
                type:"POST",
                dataType:'json',
                data:{},
                success:function(d){
                    if(d.errcode==0){
                        _self.payMessage=d.data;
                        _self.diaMsg.id=d.data.msg_pro[0].id;
                    }
                }
            });
        },
        setCurrentMsg:function(param,price,id,nowPrice){
            if(this.diaMsg.payInter){return false;}
            this.diaMsg.currentMsg = param;
            this.diaMsg.price=price;
            this.diaMsg.nowPrice=nowPrice;
            this.diaMsg.id=id;
        },
        addNum:function(){
            if(this.diaMsg.payInter){return false;}
            this.diaMsg.num=  this.diaMsg.num<99?  parseInt(this.diaMsg.num)+1 : this.diaMsg.num=99;
        },
        reduceNum:function(){
            if(this.diaMsg.payInter){return false;}
            if(this.diaMsg.num>1){this.diaMsg.num--;};
        },
        payNumkeydown:function(){
            var _this=this;
            if(parseInt(_this.diaMsg.num)>99) _this.diaMsg.num=99;
        },
        payorder:function(){
            if(!this.diaMsg.payInter){ this.payMsg(); return false;}
            var _self=this;
            if($('#inputAcp').prop('checked')==false){
                $.pt({target:"#inputAcp",content:"<div class='c_col_96 c_center'>请勾选同意服务条款</div>",width:200});
                return "prevent";
            }
            $.ajax({
                url:this.api.getorder,
                type:'post',
                async:false,
                data:{},
                success:function(d){
                    if(d.errcode==0){
                        if(d.data.status==0){
                            Dialog.customsMessage('<div class="c_center">当前订单已支付成功，是否重新下单？</div>',function(){
                                if(_option_.dingdingWeb!="dingdingWeb"){
                                    _self.PCPay();
                                }else{
                                    _self.DDPay(d.data.payment_list);
                                }
                            },function(){
                                _self.msg.pay_message=true;
                            },'')
                            _self.msg.pay_message=false;
                        }else{
                            if(_option_.dingdingWeb!="dingdingWeb"){
                                window.open(d.data.payment_list);
                            }else{
                                _self.DDPay(d.data.payment_list);
                            }
                        }
                    }else{
                        Dialog.error(d.errmsg);
                    }
                }
            });
        },
        PCPay:function () {
            var _self=this;
            var con=$("<input type='hidden' name='id' value='"+_self.diaMsg.id+"'/> <input type='hidden' name='num' value='"+_self.diaMsg.num+"'/>");
            con.prependTo('#f');
            document.forms['alipaysubmit2'].submit();
        },
        DDPay:function (Url) {
            DingTalkPC.biz.util.openLink({
                url:Url,//要打开链接的地址
                onSuccess : function(result) {},
                onFail : function() {}
            })
        },
        payMsg:function(){
            var acceptClause=$('#inputAcp').prop('checked');
            var _self=this;
            if(!_self.diaMsg.id) return false;
            if(acceptClause==false){
                $.pt({target:"#inputAcp",content:"<div class='c_col_96 c_center'>请勾选同意服务条款</div>",width:200});
                return "prevent";
            }else if(_option_.dingdingWeb!="dingdingWeb"){
                _self.PCPay();
                _self.diaMsg.payInter=true;
            }else if(_option_.dingdingWeb=="dingdingWeb"){
                $.ajax({
                    type:"POST",
                    url:"/Api/Pay/doalipay",
                    ansyc:false ,
                    data:{"id":_self.diaMsg.id,'num':_self.diaMsg.num},
                    success:function(d){
                        if(d.data&&d.data.payment_list){
                            _self.DDPay(d.data.payment_list);
                        }
                        _self.diaMsg.payInter=true;
                    },
                    error:function(d){
                        _self.diaMsg.payInter=true;
                    }
                });

            };
        },
        payStatusFon:function () {
            this.diaMsg.pay_message=false;
            this.payStatus();
            if(this.diaMsg.payInter==true){
                //重新渲染页面
                this.$emit('refreshPage')
            }
            this.diaMsg.payInter=false;
        },
        payStatus:function () {
            $.ajax({
                type:'post',
                url:this.api.check,
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
        },
        closeDialog:function(){
            var _self=this;
            $.ajax({
                url:this.api.getorder,
                type:'post',
                data:{},
                success:function(d){
                    if(d.errcode==0){
                        if(d.data.status==1){
                            Dialog.customsMessage('<div class="c_center">当前订单未支付，是否离开？</div>',function(){
                                $.ajax({
                                    url:_self.api.cancelorder,
                                    type:'post',
                                    data:{},
                                    success:function(d){}
                                });
                                if(_self.diaMsg.payInter){
                                    //重新渲染数据   调用父级的方法
                                    this.$emit('refreshPage')
                                }
                                _self.diaMsg.pay_message=false;
                                _self.diaMsg.payInter=false;
                            },function(){
                                _self.diaMsg.pay_message=true;
                            },'')
                            _self.diaMsg.pay_message=false;
                        }else{
                            if(_self.diaMsg.payInter){
                                //重新渲染数据
                                this.$emit('refreshPage')
                            }
                            _self.diaMsg.pay_message=false;
                            _self.diaMsg.payInter=false;
                        }
                    }else{
                        Dialog.error(d.errmsg);
                    }
                }
            });
        },
    },
    computed:{
        msgPPrice:function(){
            return this.diaMsg.num*this.diaMsg.price;
        },
        msgPNowPrice:function(){
            return this.diaMsg.num*this.diaMsg.nowPrice;
        }
    }
})
