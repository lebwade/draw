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
			$uid  =I('post.uid');
			$where['is_open']=1;
			$onlyThemes =$this->themes->where($where)->order('end_time DESC')->find();
			//判断是否已经玩过了
			$mapWhere['uid']=$uid;
			$mapWhere['theme_id']=$onlyThemes['id'];

			$count=M('question_answer_log')->where($mapWhere)->count();
			if($count){
				$this->ajaxReturn(array('error'=>1,'message'=>'已经参加过了','result'=>false));
			}
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
			$str=json_decode(htmlspecialchars_decode($choose));
			$correct = $this->getNumbers($str);
			$questionAnswerLogTable=M('question_answer_log');
			$save_data['theme_id']=$post['themeid'];
			$save_data['timu_id']=$post['qid'];
			$save_data['correct']=$correct;
			$save_data['select']=htmlspecialchars_decode($choose);
			$save_data['created']=time();
			$save_data['uid']=$post['uid'];
			try{
				$res=$questionAnswerLogTable->add($save_data);
				$this->ajaxReturn(array('error'=>0,'message'=>'提交成功','correct'=>$correct));
			}catch(\Exception $e){
				$this->ajaxReturn(array('error'=>1,'message'=>'提交失败','correct'=>$correct));
			}
		}
		
	}
	private function getNumbers($arr){
		$my_answer_count=0;
		foreach ($arr as $key => $value) {
			$sort=$value->sort;
			$correct=$value->value;
			$answer = $this->QuestionsModel->getQuest($sort);
			$this_answer=unserialize($answer);
			$db_key=0;
			foreach($this_answer as $key=>$v){
				$mykey=$key+1;
				if($v['attr_correct']==2){
					$db_key=$mykey;
					break;
				}
			}
			if($db_key==$correct) $my_answer_count++;
		}
		return $my_answer_count;
	}
}