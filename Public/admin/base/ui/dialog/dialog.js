/**
 * Created by sks on 2016/4/8.
 */

/**
 * 人员选择器
 */

;(function(NAME, $) {

    var _zIndex = 10000;
    var zIndex = function() {
        return ++_zIndex;
    };

    /**
     * 组件类
     * @param element
     * @param options
     * @constructor
     */
    var Component = function() {
        this._init.apply(this, Array.prototype.slice.call(arguments));
    };

    /**
     * 组件的实现方法
     */
    Component.prototype = {

        constructor: Component,

        /**
         *
         * @private
         */
        _init: function(options) {
            // var scrollTop=document.body.scrollTop;
            // window.onscroll=function(){
            //     document.body.scrollTop = scrollTop;
            // }
            $('body').css('overflow','hidden');
            this._setOptions(options);
            if(options.type==1) {
                this._enterHTML();
            }else if(options.type==2){
                this._nobtnHTML();
            }else this._buildHTML();

        },

        /**
         * 设置参数
         * @param options
         * @private
         */
        _setOptions: function(options) {
            this._options = $.extend({
                parent: document.body
            }, options);
        },

        /**
         * 构建html
         * @private
         */
        _buildHTML: function() {
            var options = this._options;

            // 构建html
            var html = [];
            html.push('<div class="dialog-mask" style="display: none;">');
            html.push('<div class="dialog-box">');
            html.push('<div class="dialog-head clearfix">');
            html.push('<h4 class="dialog-title">' + options.title + '</h4><a class="dialog-close" href="javascript:void(0)"></a>');
            html.push('</div>');
            html.push('<div class="dialog-body">');
            html.push(options.body);
            html.push('</div>');
            html.push('</div>');
            html.push('</div>');
            var el = this._el = $(html.join('')).appendTo(this._options.parent);

            // 获得基本控制元素
            this._bodyEl = el.find('.dialog-body');

            // 绑定事件
            el.find(".dialog-close").click(this._onClickClose.bind(this));
        },
        /**
         * 构建title 居中html
         * @private
         */
        _enterHTML: function() {
            var options = this._options;

            // 构建html
            var html = [];
            html.push('<div class="dialog-mask" style="display: none;">');
            html.push('<div class="dialog-custom-box">');
            html.push('<h4 class="dialog-custom-title">' + options.title + '</h4><a class="dialog-close" href="javascript:void(0)"></a>');
            html.push('<div class="dialog-body">');
            html.push(options.body);
            html.push('</div>');
            html.push('</div>');
            html.push('</div>');
            var el = this._el = $(html.join('')).appendTo(this._options.parent);

            // 获得基本控制元素
            this._bodyEl = el.find('.dialog-body');

            // 绑定事件
            el.find(".dialog-close").click(this._onClickClose.bind(this));
        },
        _nobtnHTML: function() {
            var options = this._options;

            // 构建html
            var html = [];
            html.push('<div class="dialog-mask" style="display: none;">');
            html.push('<div class="dialog-box-no">');
            html.push('<div class="dialog-head clearfix">');
            html.push('<h4 class="dialog-title">' + options.title + '</h4>');
            html.push('</div>');
            html.push('<div class="dialog-body">');
            html.push(options.body);
            html.push('</div>');
            html.push('</div>');
            html.push('</div>');
            var el = this._el = $(html.join('')).appendTo(this._options.parent);

            // 获得基本控制元素
            this._bodyEl = el.find('.dialog-body');

            // 绑定事件
            el.find(".dialog-close").click(this._onClickClose.bind(this));
        },
        /**
         * 获得body容器对象
         */
        getBodyEl: function() {
            return this._bodyEl;
        },

        /**
         * 单击关闭按钮后的处理方法
         * @private
         */
        _onClickClose: function() {
            if($(".dialog-close").hasClass("stopevent")) return false;
            var closeFn = this._options.close;
            if (typeof closeFn == "function") closeFn(this);

            this.destroy();
            this.destroy();
        },

        /**
         * 显示dialog
         * @private
         */
        show: function() {
            this._el.css("zIndex", "99");
            this._set2center(false);
            this._el.show();

            return this;
        },

        /**
         * 隐藏dialog
         * @private
         */
        _hide: function() {
            if(this._el){this._el.hide()};
            // window.onscroll=null;
            $('body').css('overflow','auto');
            return this;
        },

        /**
         * 设置到正中间
         * @private
         */
        _set2center: function(isHidden) {
            // fixme
        },

        /**
         * 重新设置位置
         */
        resetPosition: function() {
            this._set2center();
            return this;
        },

        /**
         * 销毁
         */
        destroy: function() {
            this._hide();
            this._options = null;
            this._bodyEl = null;
            if(this._el) this._el.html('');
            if(this._el) this._el = null;
            // window.onscroll=null;
            $('body').css('overflow','auto');
        }

    };
    /*
        页面中用弹窗中嵌入iframe页面
    */
    var loadIframePage=function(options) {
        $(".dialog-iframe-page").remove();
        var opts = $.extend({
            url     : '',       //内容
            title   :"支付宝付款",
            top     : '60',
            width       : '800',      //宽度
            height      : '520',   //高度
            close       : null      //关闭回调函数
        }, options || {});
        var html="<div class='dialog-iframe-page'>";
        html+=      "<div style='top:"+opts.top+"px;width:"+opts.width+"px;height:"+opts.height+"px;margin-left:-"+parseInt(opts.width)/2+"px;' class='dialog-iframe-content'>";
        html+=          "<div class='dialog-iframe-title'>"+opts.title+"</div>";
        html+=          "<div class='dialog-iframe-loading'><div class='dialog-iframe-loading-img'></div></div>";
        html+=          "<a href='javascript:;' class='dialog-iframe-close'></a>";
        html+=          '<iframe onload="dialogHideIframe()" class="dialog-iframe-cont" width="'+opts.width+'" height="'+opts.height+'" sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation" frameborder="0" src="'+opts.url+'"></iframe>';
        html+=      "</div>";
        html+=   "</div>";
        $("body").append(html);
        $("body").on("click",".dialog-iframe-close",function(){
            $(".dialog-iframe-page").remove();
            // window.onscroll=null;
            $('body').css('overflow','auto');
            if(opts.close&&typeof opts.close == "function") opts.close();
        })
        window.dialogHideNum=0;
        window.dialogHideIframe=function(){
            if(window.dialogHideNum==1&&opts.title=="支付宝付款"){
                window.dialogHideNum=0;
                $(".dialog-iframe-loading").hide();
                return false;
            }else if(opts.title!="支付宝付款"){
                $(".dialog-iframe-loading").hide();
            }
            window.dialogHideNum=1;
        }
    };
    /**
     * 显示dialog
     * @param title
     * @param content
     * @param sureCallback
     * @param cancelCallback
     * @returns {*}
     */
    var showDialog = function(title, content, sureCallback, cancelCallback,btnlefttext,btnrighttext) {
        var isShowCancel = typeof cancelCallback == "function";

        // 构建内容部分的html
        var html = ['<div class="dialog-content">' + content + '</div>'];
        html.push('<div class="dialog-action">');
        html.push('<button type="button" class="dialog-sure">'+(btnlefttext?btnlefttext:"确认")+'</button>');
        if (isShowCancel) html.push('<button type="button" class="dialog-cancel">'+(btnrighttext?btnrighttext:"取消")+'</button>');
        html.push('</div>');

        // 创建dialog
        var dialog = new Dialog({
            title: title,
            body: html.join(''),
            close: function() {
                $('body').css('overflow','auto');
                if (isShowCancel) cancelCallback(bodyEl);
            }
        });

        // 获取控制元素
        var bodyEl = dialog.getBodyEl();
        var sureBtn = bodyEl.find('.dialog-sure');

        // 绑定事件
        sureBtn.click(function() {
            var state ;
            if (typeof sureCallback == "function") state=sureCallback(bodyEl);
            console.log(state)
            // 返回prevent 阻断弹窗销毁
            if(state != 'prevent'){
                dialog.destroy();
            }
        });
        if (isShowCancel) {
            bodyEl.find('.dialog-cancel').click(function() {
                if($(this).hasClass("stopevent")) return false;
                cancelCallback(bodyEl);

                dialog.destroy();
            });
        }

        // 显示dialog
        return dialog.show();
    };
    /**
     * 显示dialog
     * @param title
     * @param content
     * @param sureCallback
     * @param cancelCallback
     * @returns {*}
     */
    var nocheckDialog = function(title, content, sureCallback, cancelCallback,btnlefttext,btnrighttext) {
        var isShowCancel = typeof cancelCallback == "function";
        // 构建内容部分的html
        var html = ['<div class="dialog-content">' + content + '</div>'];
        html.push('<div class="dialog-action">');
        html.push('</div>');
        // 创建dialog
        var dialog = new Dialog({
            title: title,
            type:2,
            body: html.join(''),
            close: function() {
                $('body').css('overflow','auto');
                if (isShowCancel) cancelCallback(bodyEl);
            }
        });
        // 获取控制元素
        var bodyEl = dialog.getBodyEl();
        // // 显示dialog
        setTimeout(function(){
            $('.dialog-mask').hide();
            // window.onscroll=null;
            $('body').css('overflow','auto');
        },1700);
        return dialog.show();
    };
    var customDialog = function(title, content, sureCallback, cancelCallback,btnlefttext,btnrighttext) {
        var isShowCancel = typeof cancelCallback == "function";

        // 构建内容部分的html
        var html = ['<div class="dialog-custom-content">' + content + '</div>'];
        html.push('<div class="dialog-custom-action">');
        html.push('<button type="button" class="dialog-sure">'+(btnlefttext?btnlefttext:"确认")+'</button>');
        if (isShowCancel) html.push('<button type="button" class="dialog-cancel">'+(btnrighttext?btnrighttext:"取消")+'</button>');
        html.push('</div>');
        // 创建dialog
        var dialog = new Dialog({
            title: title,
            type:1,
            body: html.join(''),
            close: function() {
                if (isShowCancel) cancelCallback(bodyEl);
            }
        });
        // 获取控制元素
        var bodyEl = dialog.getBodyEl();
        var sureBtn = bodyEl.find('.dialog-sure');
        // 绑定事件
        sureBtn.click(function() {
            var state ;
            if (typeof sureCallback == "function") state=sureCallback(bodyEl);
            // console.log(state);
            // 返回prevent 阻断弹窗销毁
            if(state != 'prevent'){
                dialog.destroy();
            }
        });
        if (isShowCancel) {
            bodyEl.find('.dialog-cancel').click(function() {
                if($(this).hasClass("stopevent")) return false;
                cancelCallback(bodyEl);

                dialog.destroy();
            });
        }
        // 显示dialog
        return dialog.show();
    };

    var showTips=function(options) {
        var opts = $.extend({
                target      : null,     //目标元素，不能为空
                position    : 't',      //提示框相对目标元素位置 t=top,b=bottom,r=right,l=left
                align       : 'c',      //提示框与目标元素的对齐方式，自动调节箭头显示位置，指向目标元素中间位置，c=center, t=top, b=bottom, l=left, r=right [postion=t|b时，align=l|r有效][position=t|b时，align=t|d有效]
                arrow       : true,     //是否显示箭头
                content     : '',       //内容
                width       : 200,      //宽度
                height      : 'auto',   //高度
                autoClose   : true,     //是否自动关闭
                time        : 2000,     //自动关闭延时时长
                leaveClose  : false,    //提示框失去焦点后关闭
                close       : null      //关闭回调函数
            }, options || {}),

            $ao, $ai, w, h,
            $pt = $('.pt'),
            $target = $(opts.target),
            top = $target.offset().top,
            left = $target.offset().left,
            width = $target.outerWidth(),
            height = $target.outerHeight(),

            position = opts.position,
            align = opts.align,
            arrow = opts.arrow,

            constant = {b:'pt-up', t:'pt-down', r:'pt-left', l:'pt-right'}, //相对位置正好和箭头方向相反
            arrowClass = constant[position] || constant.t;

        //初始化元素，事件
        function init() {
            if(!opts.target) {
                return;
            }
            if(!$pt.length) {
                $pt = $('<div class="pt pt-down"><div class="cont"></div><b class="out"></b><b class="in"></b></div>').appendTo(document.body);
            }
            $pt.removeClass().addClass('pt ' + (arrow ? arrowClass : '')).find('.cont').html(opts.content).css({width:opts.width, height:opts.height});
            $ao = $pt.find('.out').toggle(arrow);
            $ai =  $pt.find('.in').toggle(arrow);
            w = $pt.outerWidth();
            h = $pt.outerHeight();
            arrow && autoAdjust();          //设置箭头自动居中
            $pt.css(setPos()).show();       //设置显示框位置和自动隐藏事件
            opts.leaveClose && leaveClose();//离开关闭
            opts.autoClose && !opts.leaveClose && autoClose(opts.timeout);  //默认自动关闭，优先离开关闭
            return $pt;
        }
        //计算提示框应该出现在目标元素位置
        function setPos() {
            var btw = arrow ? parseInt($ao.css('border-top-width'), 10) : 3,
                brw = arrow ? parseInt($ao.css('border-right-width'), 10) : 3,
                result = {};
            switch(align) {
                case 'c': break;
                case 't': result.top = top; break;
                case 'b': result.top = top + height - h; break;
                case 'l': result.left = left; break;
                case 'r': result.left = left + width - w; break;
            }
            switch(position) {
                case 't': result.top = top - h - brw; break;
                case 'b': result.top = top + height + brw; break;
                case 'l': result.left = left - w - btw; break;
                case 'r': result.left = left + width + btw; break;
            }
            result.top || (result.top = top + height/2 - h/2);
            result.left || (result.left = left + width/2 - w/2);
            return result;
        }

        //设置箭头自动居中
        function autoAdjust() {
            var aop, aip, bw, auto='auto';
            switch(position) {
                case't':
                    bw = parseInt($ao.css('border-top-width'), 10);
                    aop = {bottom:-bw, left:w/2-bw, top:auto, right:auto};
                    alignLR();
                    aip = {top:auto, left:aop.left+1, bottom:aop.bottom+1, right:auto};
                    break;
                case'b':
                    bw = parseInt($ao.css('border-bottom-width'), 10);
                    aop = {top:-bw, left:w/2 - bw, right:auto, bottom:auto};
                    alignLR();
                    aip = {top:aop.top+1, left:aop.left+1, bottom:auto, right:auto};
                    break;
                case'l':
                    bw = parseInt($ao.css('border-left-width'), 10);
                    aop = {top:h/2 - bw, right:-bw, left:auto, bottom:auto};
                    alignTB();
                    aip = {top:aop.top+1, right:aop.right+1, left:auto, bottom:auto};
                    break;
                case'r':
                    bw = parseInt($ao.css('border-right-width'), 10);
                    aop = {top:h/2 - bw, left:-bw, right:auto, bottom:auto};
                    alignTB();
                    aip = {top:aop.top+1, left:aop.left+1, right:auto, bottom:auto};
                    break;
            }
            //上下侧，左右对齐
            function alignLR() {
                if(align === 'l' && width/2 > bw && width/2 < w-bw) {
                    aop.left = width/2-bw/2;
                } else if(align === 'r' && width/2 > bw && width/2 < w-bw) {
                    aop.left = w-width/2-bw/2;
                }
            }
            //左右侧，上下对齐
            function alignTB() {
                if(align === 't' && height/2 > bw && height/2 < h-bw) {
                    aop.top = height/2 - bw;
                } else if(align === 'b' && height/2 > bw && height/2 < h-bw) {
                    aop.top = h - height/2 - bw;
                }
            }
            $ao.css(aop);
            $ai.css(aip);
        }
        //设置提示框自动关闭
        function autoClose() {
            window.ptt && clearTimeout(ptt);
            window.pta && clearTimeout(pta);
            window.pta = setTimeout(function() {
                $pt.hide();
                $.isFunction(opts.close) && opts.close();
            }, opts.time);
        }
        //设置提示框失去焦点关闭
        function leaveClose() {
            //先解绑再绑定，不然会形成事件链
            $pt.unbind('mouseleave').mouseleave(function(e) {
                $pt.hide();
                $.isFunction(opts.close) && opts.close();
            }).unbind('mouseenter').mouseenter(function() {
                window.ptt && clearTimeout(ptt);
            });
        }
        return init();
    };


    /**
     * 显示信息
     * @param message
     * @param sureCallback 单击确定按钮指定的方法。注意：如果没有设置此方法，也会显示确定按钮
     * @param cancelCallback 单击取消按钮指定的方法。注意：如果没有设置此方法，就不会显示取消按钮
     */
    Component.message = function(message, sureCallback, cancelCallback) {
        return showDialog("提示", message, sureCallback, cancelCallback);
    };
    /*
    * 自定义title 和确认取消按钮名称
    */
    Component.customMessage = function(message, sureCallback, cancelCallback,title,btnlefttext,btnrighttext) {
        return showDialog('', message, sureCallback, cancelCallback,btnlefttext,btnrighttext);
    };
    /*
    * 自定义结构内容 和确认取消按钮名称
    */
    Component.customsMessage = function(message, sureCallback, cancelCallback,title,btnlefttext,btnrighttext) {
        return customDialog(title, message, sureCallback, cancelCallback,btnlefttext,btnrighttext);
    };
    /**
     * 成功信息
     * @param message
     * @param sureCallback 单击确定按钮指定的方法。注意：如果没有设置此方法，也会显示确定按钮
     * @param cancelCallback 单击取消按钮指定的方法。注意：如果没有设置此方法，就不会显示取消按钮
     */
    Component.succ = function(message, sureCallback, cancelCallback) {
        return nocheckDialog("", '<div class="succ-box c_mt_15 c_box_cen"><img class="succ-img" src="/frontface/Public/news/img/icons/cb/ic_finished.png"/><span class="width0">' + message + '</span></div>', sureCallback, cancelCallback);
    };
    /**
     * 成功信息 注：没有确认与取消按钮！
     * @param message
     */
    Component.Succ = function(message, sureCallback, cancelCallback) {
        return nocheckDialog("", '<div class="succ-box c_mt_15 c_box_cen"><img class="succ-img" src="/frontface/Public/news/img/icons/cb/ic_finished.png"/><span class="width0">' + message + '</span></div>', sureCallback, cancelCallback);
    };
    /**
     * 警示消息
     * @param message
     * @param sureCallback 单击确定按钮指定的方法。注意：如果没有设置此方法，也会显示确定按钮
     * @param cancelCallback 单击取消按钮指定的方法。注意：如果没有设置此方法，就不会显示取消按钮
     */
    Component.warn = function(message, sureCallback, cancelCallback) {
        return showDialog(" ", '<img src="/frontface/Public/news/js/base/ui/dialog/img/warning.png" class="dialog-warn-imgs"/><span  class="warn-msg">' + message + '</span>', sureCallback, cancelCallback);
    };

    /**
     * 错误信息
     * @param message
     * @param sureCallback 单击确定按钮指定的方法。注意：如果没有设置此方法，也会显示确定按钮
     * @param cancelCallback 单击取消按钮指定的方法。注意：如果没有设置此方法，就不会显示取消按钮
     */
    Component.error = function(message, sureCallback, cancelCallback) {
        return showDialog("", '<img src="/frontface/Public/news/js/base/ui/dialog/img/error.png" class="dialog-error"/><span class="error-mail">' + message + '</span>', sureCallback, cancelCallback);
    };
    /**
     * 错误信息 注：没有确认与取消按钮
     * @param message
     */
    Component.Error = function(message, sureCallback, cancelCallback) {
        return nocheckDialog("", '<img src="/frontface/Public/news/js/base/ui/dialog/img/error.png" class="dialog-error"/><span class="error-mail">' + message + '</span>', sureCallback, cancelCallback);
    };
    //tips提示窗口
    Component.tips=function(option){
        return showTips(option);
    }

    //嵌入iframe加载页面
    Component.iframePage=function(option){
        return loadIframePage(option);
    }
    this[NAME] = Component;

}).call(this, "Dialog", jQuery);

/*绑定手机*/
