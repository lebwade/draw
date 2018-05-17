<?php
namespace Api\Controller;
use Think\Controller;
use Api\Model\ThemeModel;
use Admin\Model\QuestionsModel;
class IndexController extends PublicController {
    public function __construct(){
        parent::__construct();
        $this->quest=M('questions');
        $this->QuestionsModel=new QuestionsModel();
        $this->themes=M('themes');
        $this->userPlay=M('user_play');
        $this->themeModel =D('Theme');
        $this->userJoinTable =M('user_join');
    }
	//***************************
	//  首页获取问卷题目
	//***************************
    public function index(){
        $questions=$this->QuestionsModel->randGetQuest();
        $uid =I('post.uid');
        $themesInfo =$this->themeModel->themes();
        if(!count($themesInfo)){
            $status=0;
        }else{
            $map['themd_id'] = $themesInfo['id'];
            $hasjoin =$this->userJoinTable->where($map)->count();
            if($hasjoin>0) $status=1;
            if(time()>$themesInfo['beg_time'] && time()<$themesInfo['end_time']){
                $status=2;
            }else{
                $status=0;
            }

        }
        
    	echo json_encode(array('status'=>$status,'themes'=>$themesInfo,'questions'=>$questions,'qid'=>implode(',', array_keys($questions))));
    	exit();
    }
    /**
     * 保存用户答题数据
     * [setQuestionByUser description]
     */
    public function setQuestionByUser(){
        $fromuser =I('post.openid');
        if(!$fromuser){
            $response =array('error'=>405,'message'=>'参数错误');
            $this->ajaxReturn($response);
        }
        $subject_id =I('post.subject_id');
        $this->QuestionsModel->accuracy($subject_id);
    }
    /**
     * 查询活动开启的信息
     * [Authority description]
     */
    public function Authority(){
       $activity= $this->themes->where(array('is_open'=>1))->order('beg_time DESC')->limit(1)->find();
       $time =time();
       if(empty($activity) || $time< $activity['beg_time'] || $time> $activity['end_time']){
            $response =array('error'=>403,'message'=>'活动还没有开始或者已经结束');
            $this->ajaxReturn($response);
       }
       $fromuser =I('post.openid');
       if(!$fromuser){
            $response =array('error'=>405,'message'=>'参数错误');
            $this->ajaxReturn($response);
       }
       if($this->checkHasAnswer($activity['id'],$fromuser)){
            $response =array('error'=>406,'message'=>'已经参加过本次活动了');
            $this->ajaxReturn($response);
       }
       $questions=$this->QuestionsModel->randGetQuest();

       //获取本次活动的问卷题目  api/index/
       $response =array('error'=>0,'info'=>$activity['theme_title'],'questions'=>$questions,'qid'=>implode(',', array_keys($questions)));
       $this->ajaxReturn($response);
    }
    private function checkHasAnswer($theme_id,$fromuser){
        $hasBring =$this->userPlay->where(array('theme_id'=>$theme_id,'fromuser'=>$fromuser))->count();
        return $hasBring?true:false;
    }
    //***************************
    //  首页产品 分页
    //***************************
    public function getlist(){
        $page = intval($_REQUEST['page']);
        $limit = intval($page*8)-8;
        $max =99999999;
        //->limit($limit.',8')
        $pro_list = M('product')->where('del=0 AND pro_type=1 AND is_down=0 AND type=1')->order('commend_time desc,id desc')->field('id,name,photo_x,price_yh,shiyong')->limit(8,$max)->select();
        foreach ($pro_list as $k => $v) {
            $pro_list[$k]['photo_x'] = __DATAURL__.$v['photo_x'];
        }

        echo json_encode(array('prolist'=>$pro_list));
        exit();
    }

    public function ceshi(){
        $str = null;
        $strPol = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
        $max = strlen($strPol)-1;

        for($i=0;$i<32;$i++){
            $str.=$strPol[rand(0,$max)];//rand($min,$max)生成介于min和max两个数之间的一个随机整数
        }

        echo $str;
    }

}