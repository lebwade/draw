$(document).ready(function(){
	let urlObj=getUrlParaObj();
		if(urlObj=="" || urlObj.excel_id==0){
			location.href="/frontface/home/wage/uploadWage.html";
		}
	let excel_id =urlObj.excel_id,
		host_url =window.location.protocol +'//'+window.location.host+'/v1/checkExcel';
		//获取上传的内容
		axios.post(host_url,'excel_id='+excel_id
              )
              .then(function (resp) {
                    if(resp.data.response==200){
                       $('#this_member b').text(parseInt(resp.data.total));
                       $('table.c_txc').append(resp.data.title_html);
                       $("select[name='gender1']").append(resp.data.option_th);
                       $("select[name='gender2']").append(resp.data.option_tel);
                       $("select[name='gender3']").append(resp.data.option_sum);
                    }
              })
              .catch(function (error) {
                console.log(error);
              });

    window.nextText=function() {
      let heji=$("select[name='gender3']").val();
        window.location.href="previewwage.html?excel_id="+excel_id+"&heji="+heji;
    }
});