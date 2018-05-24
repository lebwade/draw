<?php

/**
 * @Author: xiecl
 * @Date:   2018-04-11 16:48:07
 * @Last Modified by:   congli.xie
 * @Last Modified time: 2018-04-13 11:23:58
 */
namespace Api\Controller;
use Think\Controller;

class LotteryController extends PublicController {

	/**
	 *
	 * 答题全对 肯定是给剩余级别最高的奖
	   答题全错不中奖
	 * [index description]
	 * @return [type] [description]
	 */
	public function index(){
		$uid =I('post.uid');
		$themeid =I('post.themeid');
		$prizeTable =M('prize_good');
		$prizeLog =M('prize_log');

		$goods =$prizeTable->order('id asc')->select();
		$new_goods =array();
		foreach ($goods as $key => $value) {
			//如果这个奖项已经没有了就不加入
			$limit_numbers =$value['limit_number'];
			$map['prize_level']=$value['id'];
			$current_number =$prizeLog->where($map)->count();
			if($current_number>$limit_numbers-1 && $limit_numbers){
				continue;
			}
			//根据答题结果 正确率越高奖级别越高 提前配置 答对范围 给予重新分配概率

			$new_goods[$value['id']]=$value['probility'];//获取概率索引
		}
		$rid=$this->get_rand($new_goods);
		$res['yes'] = $goods[$rid-1]['prize_name']; //中奖项 
		$res['rid']=$rid;
		// unset($goods[$rid-1]); //将中奖项从数组中剔除，剩下未中奖项 
		// shuffle($goods); //打乱数组顺序 
		// for($i=0;$i<count($goods);$i++){ 
		//  $pr[] = $goods[$i]['prize']; 
		// } 
		// $res['no'] = $pr;
		$arr_prize=array(1=>array(0,4),2=>array(1,5),3=>array(2,6),4=>array(3,7));
		$now_arr=$arr_prize[$rid];
		$randkey =array_rand($now_arr);
		$award_index = $now_arr[$randkey];
		$shunxu =$this->getPosition($themeid,$rid);
		$ARdata=array('themeid'=>$themeid,'prize_level'=>$rid,'uid'=>$uid);
		$this->saveData($ARdata);
		$response =array('error'=>0,'data'=>array('shunxu'=>$shunxu,'prize'=>$res['yes'],'awardIndex'=>$award_index));
		$this->ajaxReturn($response);

	}
	private function getPosition($themeid,$prize_level){
		$count =M('prize_log')->where(array('themeid'=>$themeid,'prize_level'=>$prize_level))->count();
		return ++$count;
	}
	private function saveData($data){
		$data['created']=time();
		return M('prize_log')->add($data);
	}
	/*
	 * 经典的概率算法，
	 * $proArr是一个预先设置的数组，
	 * 假设数组为：array(100,200,300，400)，
	 * 开始是从1,1000 这个概率范围内筛选第一个数是否在他的出现概率范围之内， 
	 * 如果不在，则将概率空间，也就是k的值减去刚刚的那个数字的概率空间，
	 * 在本例当中就是减去100，也就是说第二个数是在1，900这个范围内筛选的。
	 * 这样 筛选到最终，总会有一个数满足要求。
	 * 就相当于去一个箱子里摸东西，
	 * 第一个不是，第二个不是，第三个还不是，那最后一个一定是。
	 * 这个算法简单，而且效率非常 高，
	 * 关键是这个算法已在我们以前的项目中有应用，尤其是大数据量的项目中效率非常棒。
	 * 返回的是数组索引
	 */
	function get_rand($proArr) { 
	 	$result = ''; 
		 //概率数组的总概率精度 
		 $proSum = array_sum($proArr); 
		 //概率数组循环 
		 foreach ($proArr as $key => $proCur) { 
			  $randNum = mt_rand(1, $proSum); 
			  if ($randNum <= $proCur) { 
				   $result = $key; 
				   break; 
			  }else { 
			   	 $proSum -= $proCur; 
			  }   
		 } 
		 unset ($proArr); 
		 return $result; 
	} 
}