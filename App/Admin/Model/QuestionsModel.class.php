<?php
namespace Admin\Model;
use Think\Model;

class QuestionsModel extends Model{

	const TYPE_SIMPLE=1;
	const TYPE_DIFFICULT=2;

	protected $tableName = 'questions'; 
	public $options =array(
			self::TYPE_SIMPLE=>'A类型题库',
			self::TYPE_DIFFICULT=>'B类型题库',
	);
}