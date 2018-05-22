<?php

/**
 * @Author: xiecl
 * @Date:   2018-04-13 14:41:10
 * @Last Modified by:   congli.xie
 * @Last Modified time: 2018-04-13 15:04:15
 */
namespace Admin\Controller;
use Think\Controller;
use Admin\Model\QuestionsModel as QM;
class QuestController extends PublicController{

	const ANSWERKEY='answer_';
	const SAYKEY='result_';
	private $Quest;
	private $questModel;
	public function _initialize(){
		$this->Quest = M('questions');
		$this->questModel=new QM();
	}
	public function add(){
		$id =I('get.id');
		$page =I('get.page');
		if(IS_POST){
			$post =I('post.');
		}
		$singleRow =$this->Quest->where(array('id'=>$id))->find();
		$this->assign('singleRow',$singleRow);
		$this->assign('options',$this->questModel->options);
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
		$temp_list=array();
		if(is_array($list)&&$list){
			foreach($list as $v){
				$v['type']=$this->questModel->options[$v['type']];
				$temp_list[]=$v;
			}
		}
		$this->assign('page',$page);
		//=============
		// 将变量输出
		//=============	
		$this->assign('list',$temp_list);
		$this->assign('page_index',$page_index);
		$this->display();
	}
	/**
	 * 保存问题信息
	 * [saveQuest description]
	 * @return [type] [description]
	 */
	public function saveQuest(){
		if(IS_POST){
			$post =I('post.');
			$id =$post['id'];
			$data['question']=$post['question'];
			$data['is_on']=$post['is_on'];
			$data['type']=$post['type'];
			foreach($post as $mykey=>$v){
				if(preg_match("/(answer_)(\d+)/", $mykey,$matches)){
					$thiskey=isset($matches[2])?$matches[2]:1;
					$type_select[]=array(
						'attr_option'=>$post[self::ANSWERKEY.$thiskey],
						'attr_correct'=>$post[self::SAYKEY.$thiskey],
					);
				}
			}
			$data['answer']=serialize($type_select);
			if($id){
				$res=$this->Quest->where(array('id'=>$id))->save($data);
				$response=array('error'=>0,'message'=>'修改成功');
				$this->ajaxReturn($response);
			}else{
				$data['created']=time();
				$res=$this->Quest->add($data);
				$response=array('error'=>0,'message'=>'添加成功');
				$this->ajaxReturn($response);
			}
		}
	}
	public function findOne(){
		if(IS_POST){
			$id =I('post.id');
			if($id){
				$quest=$this->Quest->where(array('id'=>$id))->find();
				if(is_array($quest)&&$quest){
					$result = unserialize($quest['answer']);
					foreach ($result as $key => $value) {
						$list[]=array(
							'current'=>$key+1,
							'answer'=>$value['attr_option'],
							'is_correct'=>$value['attr_correct'],
						);
					}
					$number=array('count'=>count($result));
					$output=array('error'=>0,'message'=>'获取成功','list'=>$list,'number'=>$number);
					$this->ajaxReturn($output);
				}

			}
		}
	}
}