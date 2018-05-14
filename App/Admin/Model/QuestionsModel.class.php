<?php
namespace Admin\Model;
use Think\Model;

class QuestionsModel extends Model{

	const TYPE_SIMPLE=1;
	const TYPE_DIFFICULT=2;

	protected $tableName = 'questions'; 
	public $options =array(
			self::TYPE_SIMPLE=>'基础知识题库',
			self::TYPE_DIFFICULT=>'操作题库',
	);
	public function accuracy($qid,$input_selected){
		if(is_string($qid) &&$qid){
			$qid_arr =explode(',', $qid);
			foreach($qid_arr as $id){
				$question = $this->where(array('id'=>$id))->find();
				$old_answer =unserialize($question['answer']);
				foreach($old_answer as $next){
					$new_answer[]=array('attr_option'=>$next['attr_option']);//attr_correct
				}
			}
		}
	}

	/**
	 * 获取基础知识3题 操作题目 2题
	 * [randGetQuest description]
	 * @return [type] [description]
	 */
	public function randGetQuest()
	{	
		
		$all_list=array();
		while (count($all_list) < 3) {
			$result = $this->getBasicData();
			if(empty($result)) break;
			if(!empty($result) && !array_key_exists($result['tid'], $all_list)){
				$all_list[$result['tid']]=$result;
			}
		}
		while (count($all_list) < 5) {
			$result = $this->getOperatorData();
			if(empty($result)) break;
			if(!empty($result) && !array_key_exists($result['tid'], $all_list)){
				$all_list[$result['tid']]=$result;
			}
		}
		ksort($all_list);
		return $all_list;
	}
	private function getBasicData(){
		$this->table =C('DB_PREFIX').$this->tableName;
		$basic_sql ="SELECT t1.id as tid,question,answer,type,is_on,created FROM ".$this->table." AS t1 JOIN (SELECT ROUND(RAND() * (SELECT MAX(id) FROM ".$this->table." WHERE type=".self::TYPE_SIMPLE.")) AS id) AS t2 WHERE t1.id >= t2.id AND type=".self::TYPE_SIMPLE." ORDER BY t1.id ASC LIMIT 1";
		$basic_out=$this->query($basic_sql);
		$aData =isset($basic_out[0])?$basic_out[0]:null;
		return $this->changeDataFormater($aData);
	}
	private function getOperatorData(){
		$this->table =C('DB_PREFIX').$this->tableName;
		$operator_sql ="SELECT t1.id as tid,question,answer,type,is_on,created FROM ".$this->table." AS t1 JOIN (SELECT ROUND(RAND() * (SELECT MAX(id) FROM ".$this->table." WHERE type=".self::TYPE_DIFFICULT.")) AS id) AS t2 WHERE t1.id >= t2.id AND type=".self::TYPE_DIFFICULT." ORDER BY t1.id ASC LIMIT 1";
		$operator_out=$this->query($operator_sql);
		$aData= isset($operator_out[0])?$operator_out[0]:null;
		return $this->changeDataFormater($aData);
	}
	private function changeDataFormater($aData){
		$aResult =array();
		if(is_array($aData)&&$aData){
			$aResult['tid']=$aData['tid'];
			$aResult['question']=$aData['question'];
			$old_answer=unserialize($aData['answer']);
			foreach($old_answer as $next){
				$new_answer[]=array('attr_option'=>$next['attr_option']);
			}
			$aResult['answer']=$new_answer;
		}
		return $aResult;
	}
}