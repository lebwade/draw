<?php

/**
 * @Author: xiecl
 * @Date:   2018-04-13 14:41:10
 * @Last Modified by:   congli.xie
 * @Last Modified time: 2018-04-13 15:04:15
 */
namespace Admin\Controller;
use Think\Controller;
class QuestController extends PublicController{

	public function _initialize(){
		$this->Quest = M('questions');
	}
	public function add(){
		$id =I('get.id');
		$page =I('get.page');
		if(IS_POST){
			$post =I('post.');
		}
		$singleRow =$this->Quest->where(array('id'=>$id))->find();
		$this->assign('singleRow',$singleRow);
		$this->display();
	}
	public function index(){
		$where="1=1";
		define('rows',5);
		$count= $this->Quest->where($where)->count();
		$rows=ceil($count/rows);
		$page=(int)$_GET['page'];
		$page<0?$page=0:'';
		$limit=$page*rows;
		$page_index=$this->page_index($count,$rows,$page);
		$list=$this->Quest->where($where)->order('created desc')->limit($limit,rows)->select();
		// 将GET到的数据再输出
	
		$this->assign('page',$page);
		//=============
		// 将变量输出
		//=============	
		$this->assign('list',$list);
		$this->assign('page_index',$page_index);
		$this->display();
	}
}