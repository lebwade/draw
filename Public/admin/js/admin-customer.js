/*
* @Author: xiecl
* @Date:   2018-04-13 16:52:03
* @Last Modified by:   congli.xie
* @Last Modified time: 2018-04-16 17:14:58
*/
new Vue({
	el:'#answerNext',
	data:{
		list:[
			{current:1,answer:''}
		],
		mykey:1,
	},
	methods:{
		addPush:function(){
			let _self=this;
				_self.mykey=_self.mykey+1;
			let item={current:_self.mykey,answer:''};
			_self.list.push(item);
		},
		minusPush:function(index){
			let _self=this;
				console.log(index);
		},
		gernerateId:function(prefix,index){
			return prefix+index;
		}
	}
})