/*
* @Author: xiecl
* @Date:   2018-04-13 16:52:03
* @Last Modified by:   congli.xie
* @Last Modified time: 2018-04-13 18:00:28
*/
new Vue({
	el:'#answerNext',
	data:{
		list:[
			{current:1,answer:'111'}
		],
	},
	methods:{
		addPush:function(){
			let _self=this;
			// 	_self.current+=1;
			// let item={answer:''};
			// _self.list.push(item);
		},
		minusPush:function(){

		}
	}
})