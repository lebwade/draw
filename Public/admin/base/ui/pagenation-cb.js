/**
 * Created by belen on 2016/3/30.
 */
var _Pagenation = function (obj,page, num, total) {
    var _total = total;     // 总条数
    var _page = page;       // 当前页数 默认第一页
    var _pasue_page = page; // 临界点
    var _curr_page = parseInt(page);
    var _num = num;         // 每页显示几条
    var _pages = Math.ceil(total / num);  // 总页数
    var _data = '';
    var str = '<div class="fl pages-box "><div class="fl pre-box-btn">';
    var search=$('#mem_name').val() || '';
    if (_pages == 1) {
        // return false; // 总页数一天不显示
    }
    if (page == 1) {
        // str += '<a class="page-index" href="javascript:;">首页</a></div><div class="pages fl">';
        str +='<a class="btn-prev" onclick="tableScreen.pageTableList('+(_curr_page-1)+')"> < </a>'+
            '</div> <div class="pages fl">';
    } else {
        // str += '<a class="page-index" onclick="tableScreen.pageTableList(1)" >首页</a>'+
        // 	'<a class="btn-prev" onclick="tableScreen.pageTableList('+(_curr_page-1)+')">上页</a>'+
        // 	'</div> <div class="pages fl">';
        str +='<a class="btn-prev active" onclick="tableScreen.pageTableList('+(_curr_page-1)+')"> < </a>'+
            '</div> <div class="pages fl">';
    }
    //循环页数
    if (_pages > 5) {
        if(_page>=5){
            str += '<a class="" onclick="tableScreen.pageTableList(1)">1</a><span class="fl  spot" >...</span>';
            var tpage=_page*1+3;
            var tpages=_pages*1;
            if(tpage<=tpages){
                var news_page = _page - 3;
                for (var n = 0; n <5; n++) {
                    news_page++;
                    if (_page == news_page) {
                        _data += '<a class="on" href="javascript:;">' + news_page + '</a>';
                    } else {
                        _data += '<a  onclick="tableScreen.pageTableList(' + _num + ')">' + news_page + '</a>';
                    }
                }
            }else{
                var tempage=_pages-5;
                for(var n=0;n<5;n++){
                    tempage++;
                    if (_page == tempage) {
                        _data += '<a class="on" href="javascript:;">' + tempage + '</a>';
                    } else {
                        _data += '<a onclick="tableScreen.pageTableList(' + tempage + ')">' + tempage + '</a>';
                    }
                }
            }
            str += _data;
        }else{
            for (var n = 1; n < 6; n++) {
                //   console.log(_page);
                if (_page == n) {
                    _data += '<a class="on" href="javascript:;">' + n + '</a>';
                } else {
                    _data += '<a onclick="tableScreen.pageTableList(' + n + ')">' + n + '</a>';
                }
            }
            _data += '<span class="fl spot" >...</span><a onclick="tableScreen.pageTableList(' + _pages + ')">' + _pages + '</a>';
            str += _data;
        }
    } else {
        for (var n = 1; n <= _pages; n++) {
            if (_page ==n ) {
                _data += '<a class="on" href="javascript:;">' + n + '</a>';
            } else {
                _data += '<a onclick="tableScreen.pageTableList(' + n + ')">' + n + '</a>';
            }
        }
        str += _data;

    }

    if (page == _pages) {
        // str += '</div><div class="fl"><a href="javascript:;" class="b_none page-end">末页</a></div></div>';
        str += '</div><div class="fl"><a class="btn-next" onclick="tableScreen.pageTableList('+(_curr_page+1)+')"> > </a></div></div>';
    } else {
        // str += '</div><div class="fl"><a class="btn-next" onclick="tableScreen.pageTableList('+(_curr_page+1)+')">下页</a><a onclick="tableScreen.pageTableList(' + _pages + ')" class="page-end b_none">末页</a></div></div>';
        str += '</div><div class="fl"><a class="btn-next active" onclick="tableScreen.pageTableList('+(_curr_page+1)+')"> > </a></div></div>';
    }

    // str += '<div class="fr"><div class="page_info">共' + _total + '条 | 第' + _curr_page + '/' + _pages + '页</div><div class="Jump fl">到 <input type="text" onkeypress="var code=event.keyCode||event.charCode;return code==8||code==46||(code>=37&&code<=40)||(/[0-9\\u0008\\u0037-\\u0040\\u0046]/.test(String.fromCharCode(code)))" class="page-item" id="input-s" maxlength="5">页<input type="button" id="btn-go" class="page-item1" value="确定"></div><div class="page_num fl"><div class="fl lh30">每页</div><div class="select page-item1" ><div class="bt select-num">' + _num + '</div><div class="list hide"><a href="javascript:;">10</a><a href="javascript:;">20</a><a href="javascript:;">50</a><a href="javascript:;">100</a></div></div><div class="fl lh30">条</div></div></div>';
    str += '<div class="fr"><div class="page_info c_col_66">共' + _total + '条 </div><div class="Jump fl">到 <input type="text" onkeypress="var code=event.keyCode||event.charCode;return code==8||code==46||(code>=37&&code<=40)||(/[0-9\\u0008\\u0037-\\u0040\\u0046]/.test(String.fromCharCode(code)))" class="page-item" id="input-s" maxlength="5">页 共'+_pages+'页 <input type="button" id="btn-go" class="page-item1" value="确定"></div><div class="page_num fl"><div class="fl lh30">每页</div><div class="select page-item1" ><div class="bt select-num">' + _num + '</div><div class="list hide"><a href="javascript:;">10</a><a href="javascript:;">20</a><a href="javascript:;">50</a><a href="javascript:;">100</a></div></div><div class="fl lh30">条</div></div></div>';
    $(obj).html(str);

    var _page_select_h = $('.select-num').offset().top || null;
    var _screen_h = $(document).height();
    var _bidui=_screen_h - _page_select_h-104;
    var _page_select_layer_h = $('.select-num').siblings('.list').height();
    if(_bidui <= _page_select_layer_h){
        $(obj).find('.select .list').css('top',-parseInt(_page_select_layer_h));
    }

}

$('body').on('click', '.select-num', function (e) { // 选择每页显示条数
    var event = e || window.event;
    event.stopPropagation();
    $(this).next('.list').show();
});

