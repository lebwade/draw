<?php
namespace Api\Controller;
use Think\Controller;
use Admin\Model\QuestionsModel;

class ActiveController extends PublicController {


	public function __construct(){
        parent::__construct();
        $this->themes=M('themes');
        $this->QuestionsModel=new QuestionsModel();
    }
	public function index(){
		if(IS_POST){
			$code  =I('post.code');
			$where['is_open']=1;
			$onlyThemes =$this->themes->where($where)->order('end_time DESC')->find();
			if($onlyThemes['beg_time'] < time() && $onlyThemes['end_time'] >time() && $onlyThemes['invite_code']==trim($code)){
				$this->ajaxReturn(array('error'=>0,'message'=>'验证成功','result'=>true));
			}else{
				$this->ajaxReturn(array('error'=>1,'message'=>'邀请码不正确','result'=>false));
			}
		}
	}
	public function quest(){
		$questions=$this->QuestionsModel->randGetQuest();
		$this->ajaxReturn(array('error'=>0,'questions'=>$questions,'qid'=>implode(',', array_keys($questions))));
	}
	public function check(){
		if(IS_POST){
			$post =I('post.');
			$choose =$post['chose'];
			foreach($choose as $next){
				print_r($next);
			}
		}
	}
}