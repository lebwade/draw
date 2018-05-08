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
}