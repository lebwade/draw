/*
* @Author: xiecl
* @Date:   2018-04-13 16:52:03
* @Last Modified by:   congli.xie
* @Last Modified time: 2018-04-16 17:14:58
*/
new Vue({
	el:'#answerNext',
	data:{
		api:{
			saveQuestion:'/admin/quest/saveQuest',
			jumpUrl:'/admin/quest/index',
			getQuest:'/admin/quest/findOne',
		},
		list:[
			{current:1,answer:'',is_correct:1}
		],
		mykey:1,
		qid:0,
		maxlength:3,
	},
	mounted:function(){
		let _self=this;
		_self.loadFirst();
	},
	methods:{
		addPush:function(){
			let _self=this;
				_self.mykey=_self.mykey+1;
			let item={current:_self.mykey,answer:'',is_correct:1};
			_self.list.push(item);
		},
		minusPush:function(index){
			let _self=this,
				now_list=_self.list;
				_self.list=[];
				$.each(now_list,function(key,value){
					if(value.current!=index){
					let item={current:value.current,answer:value.answer};
						_self.list.push(item);
					}
				})
		},
		gernerateId:function(prefix,index){
			return prefix+index;
		},
		quest_tj:function(){
			let _self=this,
				now_list=_self.list;
				if($("input[name='question']").val()==""){
					layer.msg('问题不能为空');
					return false;
				}
				if(now_list.length<_self.maxlength){
					layer.msg('选项不能小于3个');
					return false;
				}
			let isOnlyOne=0;
				isOnlyOne=$('.is_opened:checked').length;
			if(isOnlyOne!=1){
				layer.msg('有且只有一个答案');
				return false;
			}
			$.ajax({
				url:_self.api.saveQuestion,
				type:"post",
				dataType:'json',
				data:$('#ac_from').serialize(),
				success:function(d){
					if(d.error==0){
						//layer.msg(d.message);
						//setTimeout(function(){location.href=_self.api.jumpUrl},1500);
					}else{
						layer.msg(d.message);
					}
				}
			})
		},
		loadFirst:function(){
			let _self=this;
			_self.qid=HR.Utils.getQuery('id')||'';
			if(_self.qid){
				$.ajax({
					url:_self.api.getQuest,
					type:"post",
					dataType:'json',
					data:{id:_self.qid},
					success:function(d){
						if(d.error==0){
							_self.mykey=d.number.count;
							_self.list =d.list;
						}
					}
				})
			}
		}
	}
})