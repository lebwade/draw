<?php
namespace Api\Model;
use Think\Model\AdvModel;

/**
 * 
 */
class ThemeModel extends AdvModel
{
	
	protected $tableName = 'themes'; 


	public function themes(){
		$this->where(array('is_open'=>1));
		return $this->find();
	}
}