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

