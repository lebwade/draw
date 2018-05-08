$(document).ready(function(){
	let urlObj=getUrlParaObj();
		if(urlObj=="" || urlObj.excel_id==0){
			location.href="/frontface/home/wage/uploadWage.html";
		}
	let excel_id =urlObj.excel_id,
    heji=urlObj.heji,
		host_url =window.location.protocol +'//'+window.location.host+'/v1/sendExcel',
    saveAndSend=window.location.protocol +'//'+window.location.host+'/v1/excelConfirm',
    manageer=window.location.protocol +'//'+window.location.host+'/frontface/home/wage/lists.html';
		//获取上传的内容
		axios.post(host_url,'excel_id='+excel_id+'&heji='+heji
              )
              .then(function (resp) {
                    if(resp.data.response==200){
                     let example1 = new Vue({
                        el: '#username',
                        data: {
                          usernamelist: resp.data.left_username,
                          activeName: resp.data.left_username[0]
                        },
                        methods: {
                          rebuild:function(cur,selected){
                            let self=this;
                                self.activeName=cur;
                                Vue.set(left_title,'r_value_c',resp.data.cur_title.c_value[selected]);
                                Vue.set(cur_sum,'all_sum',resp.data.all_sum[selected])                        
                          }
                        }
                      })
                     let title =new Vue({
                      el:'#ex_title',
                      data:{
                        title:resp.data.excel_title
                      }
                     })
                     let titleCopy =new Vue({
                      el:'#ex_title2',
                      data:{
                        titleCopy:resp.data.excel_title
                      }
                     })
                      let cur_sum =new Vue({
                      el:'#cur_sum',
                      data:{
                        all_sum:resp.data.all_sum[0]
                      }
                     })
                      let left_title=new Vue({
                        el:'#left_title',
                        data:{
                          l_title_c:resp.data.cur_title.title,
                          r_value_c:resp.data.cur_title.c_value[0],
                        }
                      })
                    }
              })
              .catch(function (error) {
                console.log(error);
              });

    window.sendPrev=function() {
        window.location.href="checkvue.html?excel_id="+excel_id;
    }
    $('.check-send-confirm').click(function(){
        if($(".check-send-confirm").text()=="发送中") return false;
        $('#wage_send,.check-send-confirm').text('发送中');
      axios.post(saveAndSend,'excel_id='+excel_id+'&heji='+heji
              )
              .then(function (resp) {
                    if(resp.data.response==201){
                        $('#wage_send,.check-send-confirm').text('发送成功');
                        setTimeout(function(){
                          location.href=manageer;
                        },1500);
                    }
              }).catch(function (error) {
                console.log(error);
              });
    })
});