<?php
namespace Api\Controller;
use Think\Controller;
class ClearController extends Controller {

	public function __construct(){
		parent::__construct();
	}
	public function index(){
		$model = M();
		$sql="TRUNCATE TABLE lr_prize_log;TRUNCATE TABLE lr_question_answer_log";
		$model->execute($sql);
		
	}
}