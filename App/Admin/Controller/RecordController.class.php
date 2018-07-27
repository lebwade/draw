<?php

/**
 * @Author: xiecl
 * @Date:   2018-05-31 19:09:14
 * @Last Modified by:   congli.xie
 * @Last Modified time: 2018-06-29 09:21:15
 */
namespace Admin\Controller;
use Think\Controller;
import('Org.Util.Excel');

class RecordController extends PublicController{

	private $_questionTable;
	private $_prizeTable;

	public function __construct(){
		parent::__construct();
		$this->_questionTable=M('question_answer_log');
		$this->_prizeTable=M('prize_log');
	}
	public function index(){
		$opt =I('get.opt');
		if($opt){
			$title =['ID','主题','昵称','正确数'];
			$list = $this->_questionTable->where($condition)->order('created desc')->select();
		$new_list =array();
		$userTable =M('user');
		$themeTable =M('themes');
		if(!empty($list)){
			foreach ($list as $key => $value) {
				$info =$userTable->where(array('id'=>$value['uid']))->find();
				$themeInfo =$themeTable->where(array('id'=>$value['theme_id']))->find();
				$value['nickname']=$info['name'];
				$value['headimgurl']=$info['photo'];
				$value['theme_title']=$themeInfo['theme_title'];
				$timu_id = $value['timu_id'];
				$timu_arr = explode(",", $timu_id);
				$select = json_decode($value['select']);
				$question=array(
					$value['id'],
					$value['theme_title'],
					$value['nickname'],
					$value['correct'],
				);

				foreach($select as $mykey=>$next){
					$timuInfo = M('questions')->where(array('id'=>$next->sort))->find();
					$answer = unserialize($timuInfo['answer']);
					// echo "<pre>";
					$answer_option='';
					foreach($answer as $ankey=>$anv){
						$beg="";
						$end="";
						$tag_beg="";
						$tag_end="";
						if($anv['attr_correct']==2){
							$beg="【";
							$end="】";
						}
						if($next->value==($ankey+1)){
							$tag_beg='|o|';
							$tag_end='|o|';
						}
						$answer_option.="\t".$beg.$tag_beg.$anv['attr_option'].$tag_end.$end;
					}
					$question[4+$mykey]=$timuInfo['question']."\r\n".$answer_option;
					$title[4+$mykey]=$this->getTitle($mykey);
					//$str .=$this->getTitle($mykey).$timuInfo['question']."\t".$answer."\r\n";
				}
				$new_list[]=$question;
			}
		}
		$excel =new \Excel();
		$excel->writer($title,$new_list);
		exit;

		}
		$condition =array();
		//分页
		$count   = $this->_questionTable->where($condition)->count();// 查询满足要求的总记录数
		define('rows',20);
		$page=(int)$_GET['page'];
		$page<0?$page=0:'';
		$limit=$page*rows;


		$list = $this->_questionTable->where($condition)->limit($limit,rows)->order('created desc')->select();
		$new_list =array();
		$userTable =M('user');
		$themeTable =M('themes');
		if(!empty($list)){
			foreach ($list as $key => $value) {
				$info =$userTable->where(array('id'=>$value['uid']))->find();
				$themeInfo =$themeTable->where(array('id'=>$value['theme_id']))->find();
				$value['nickname']=$info['name'];
				$value['headimgurl']=$info['photo'];
				$value['theme_title']=$themeInfo['theme_title'];
				$timu_id = $value['timu_id'];
				$timu_arr = explode(",", $timu_id);
				$select = json_decode($value['select']);
				$content =[];
				foreach($select as $mykey=>$next){
					$timuInfo = M('questions')->where(array('id'=>$next->sort))->find();
					$answer = unserialize($timuInfo['answer']);
					// echo "<pre>";
					// print_r($answer);
					$content[] =array(
						'question'=>$timuInfo['question'],
						'answer'=>$answer,
						'select'=>$this->checkSelect($next->value-1),
						'title'=>$this->getTitle($mykey),
					);
				}
				$value['content']=$content;
				$new_list[]=$value;
			}
		}
		$rows=ceil($count/rows);
		$page_index=$this->page_index($count,$rows,$page);
		$this->assign('page_index',$page_index);
		$this->assign('page',$page);
		$this->assign('list',$new_list);
		$this->display(); // 输出模板
	}
	public function getTitle($key){
		$arr =['题目一','题目二','题目三','题目四','题目五','题目六','题目七','题目八','题目九'];
		return $arr[$key];
	}
	public function checkSelect($key){
		$arr=['A','B','C','D','E','F','G','H','I','J','K','L'];
		return $arr[$key];
	}
	public function lottery(){
		$userTable =M('user');
		$themeTable =M('themes');
		$opt =I('get.opt');
		if($opt){
			$title =['ID','主题','昵称','奖项','时间','排名'];
			$list=$this->_prizeTable->where($condition)->order('created desc,shunxu desc')->select();
			$new_list=array();
			if(!empty($list)){
				foreach ($list as $key => $value) {
					$info =$userTable->where(array('id'=>$value['uid']))->find();
					$themeInfo =$themeTable->where(array('id'=>$value['themeid']))->find();
					$value['theme_title']=$themeInfo['theme_title'];
					$value['nickname']=$info['name'];
					$value['headimgurl']=$info['photo'];
					$new_list[]=array(
						$value['id'],
						$themeInfo['theme_title'],
						$info['name'],
						$value['prize'],
						date('Y-m-d H:i:s',$value['created']),
						$value['shunxu'],

					);
				}
			}
			$excel =new \Excel();
			$excel->writer($title,$new_list);
			exit;
		}



		$themeid =I('get.themeid');
		$condition =array();
		if($themeid){
			$condition['themeid'] = $themeid;
			$this->assign('themeid',$themeid);
		}
		define('rows',20);
		$page=(int)$_GET['page'];
		$page<0?$page=0:'';
		$limit=$page*rows;
		//分页
		$count   = $this->_prizeTable->where($condition)->count();// 查询满足要求的总记录数
	

		//$show  = $Page->show();// 分页显示输出
		$rows=ceil($count/rows);
		$list = $this->_prizeTable->where($condition)->limit($limit,rows)->order('created desc,shunxu desc')->select();
		$new_list =array();
		
		if(!empty($list)){
			foreach ($list as $key => $value) {
				$info =$userTable->where(array('id'=>$value['uid']))->find();
				$themeInfo =$themeTable->where(array('id'=>$value['themeid']))->find();
				$value['theme_title']=$themeInfo['theme_title'];
				$value['nickname']=$info['name'];
				$value['headimgurl']=$info['photo'];
				$new_list[]=$value;
			}
		}
		$page_index=$this->page_index($count,$rows,$page);
		$this->assign('themes',$themeTable->select());
		$this->assign('list',$new_list);
		$this->assign('page_index',$page_index);
		$this->assign('page',$page);
		$this->display(); // 输出模板
	}
	/**
	 * 配置奖项设置
	 * [config description]
	 * @return [type] [description]
	 */
	public function config(){
		$prizeGood =M('prize_good');
		$prizeInfo = $prizeGood->order('id asc')->select();
		if(IS_POST){
			$post =I('post.');
			foreach ($post['id'] as $key => $value) {
				$prizeGood->where(array('id'=>$value))->save(array('probility'=>$post['probility'][$key],'limit_number'=>$post['limit_number'][$key]));
			}

			$this->ajaxReturn(array('error'=>0,'message'=>'保存成功'));
		}
		$this->assign('prizeInfo',$prizeInfo);
		$this->display();
	}
}