<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
       $companyTable =M('company');
       $sql ="SELECT id,com_id,com_name,com_address,count(com_id) as n from t_company   GROUP BY com_id HAVING n>1 ORDER BY com_id DESC  ";
       $result=$companyTable->query($sql);
       foreach ($result as $key => $value) {
       	 	$companyTable->where(array('id'=>$value['id']))->delete();
       }
    }

    /**
     * 60330  生成线上数据到60330  65002
     * [change description]
     * @return [type] [description]
     */
    public function change(){
    	$companyTable =M('company');
    	$comProfileTable=M('company_profile');
        $map['com_id']=array('gt',60330);
    	$list = $companyTable->where($map)->order('com_id ASC')->select();

    	if(count($list)){
    		foreach ($list as $key => $value) {
    			$com_id =$value['com_id'];
    			$com_name=$value['com_name'];
    			$uid = $this->createdUser($com_id,$com_name);
				$data_rows =array(
					'uid'=>$uid,
					'tpl'=>'default',
					'companyname'=>$com_name,
					'nature_cn'=>$value['type'],
					'trade_cn'=>$value['industry'],
					'contents'=>$value['content'],
					'addtime'=>time(),
					'contact'=>$value['contact'],
					'address'=>$value['com_address'],
					'com_id'=>$value['com_id'],
					'scale_cn'=>$value['guimo'],
					'district_cn'=>$value['area'],
				);
				$comProfileTable->add($data_rows);
    		}
    	}
    }
    function createdUser($com_id,$com_companyname,$password='12345678'){
    	$pwd_hash=randstr();
    	$memberTable = M('members');
    	$QS_pwdhash='EfXUVA:BXSkj4Sug';
    	$password_hash=md5(md5($password).$pwd_hash.$QS_pwdhash);

    	$rows =array(
    		'username'=>$com_id,
    		'email'=>$com_id.'_ycode@163.com',
    		'password'=>$password_hash,
    		'pwd_hash'=>$pwd_hash,
    		'reg_time'=>time(),

    	);
    	return $memberTable->add($rows);
    }
}