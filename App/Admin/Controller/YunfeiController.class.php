<?php
namespace Admin\Controller;
use Think\Controller;
/**
 * @Author: xiecl
 * @Date:   2018-02-26 15:41:30
 * @Last Modified by:   congli.xie
 * @Last Modified time: 2018-02-26 18:07:56
 */
/**
* 
*/
class YunfeiController extends PublicController
{
	
	public function _initialize(){
		$this->Yunfei = D('yunfei_price');
	}

	public function index(){
		$condition=array();
		//分页
		$count   = $this->Yunfei->where($condition)->count();// 查询满足要求的总记录数
		$Page    = new \Think\Page($count,5);// 实例化分页类 传入总记录数和每页显示的记录数(25)

		//头部描述信息，默认值 “共 %TOTAL_ROW% 条记录”
		$Page->setConfig('header', '<li class="rows">共<b>%TOTAL_ROW%</b>条&nbsp;第<b>%NOW_PAGE%</b>页/共<b>%TOTAL_PAGE%</b>页</li>');
		//上一页描述信息
	    $Page->setConfig('prev', '上一页');
	    //下一页描述信息
	    $Page->setConfig('next', '下一页');
	    //首页描述信息
	    $Page->setConfig('first', '首页');
	    //末页描述信息
	    $Page->setConfig('last', '末页');
	    $Page->setConfig('theme', '%FIRST%%UP_PAGE%%LINK_PAGE%%DOWN_PAGE%%END%%HEADER%');

		$show  = $Page->show();// 分页显示输出

		$list = $this->Yunfei->where($condition)->limit($Page->firstRow.','.$Page->listRows)->select();	
		$temp_list =array();
		$chinaCityTable=M('china_city');
		if(is_array($list) && $list){
			foreach ($list as $key => $value) {
				$province_info =$chinaCityTable->where(array('id'=>$value['province_id']))->find();
				$province_name =$province_info['name'];
				$value['area']=$province_name;
				$temp_list[]=$value;
			}
		}
		$this->assign('list',$temp_list);
		$this->assign('page',$show);
		$this->display(); // 输出模板
	}
	public function add(){
		$chinaCityTable=M('china_city');
		//获取省份 不包含港澳台
		$map['tid']=0;
		$map['id']=array('not in','3523,3524,3525');
		$area_list=$chinaCityTable->where($map)->select();
		$temp_area_list=array();
		$jiangzhehu=array(890,1023,868);
		$jiangzhehu_arr =array();
		foreach ($area_list as $key => $value) {
			$pid=$value['id'];
			$yunfei_info = $this->Yunfei->where('province_id='.intval($pid))->find();
			$firstprice =$yunfei_info['firstprice'];
			$continueprice =$yunfei_info['continueprice'];
			$area_data =array('province_name'=>$value['name'],'pid'=>array($pid),'firstprice'=>$firstprice,'continueprice'=>$continueprice);
			if(in_array($value['id'], $jiangzhehu)){
				$jiangzhehu_arr[] =$pid;
				if(count($jiangzhehu_arr)<3){
					continue;
				}
				$area_data =array('province_name'=>'江浙沪','pid'=>$jiangzhehu_arr,'firstprice'=>$firstprice,'continueprice'=>$continueprice);
			}
			
			$temp_area_list[]=$area_data;
		}
		//print_r($temp_area_list);
		$this->assign('yunfei_info',$temp_area_list);
		$this->display();
	}
	/**
	 * 保存数据
	 * [save description]
	 * @return [type] [description]
	 */
	public function save(){
		if(IS_POST){
			$post =I('post.');
			$province_id =$post['province_id'];
			$firstprice =$post['firstprice'];
			$continueprice =$post['continueprice'];
			$new_p_data =array();
			$hasCount=0;
			$jiangzhehu=array(890,1023,868);
			foreach ($province_id as $key => $value) {
				if(in_array($value, $jiangzhehu)){
					if($hasCount>0){
						continue;
					}
					$new_p_data[]=$value;
					$hasCount++;
				}else{
					$new_p_data[]=$value;
				}
				
			}
			foreach($new_p_data as $k=>$next){
				$data =array(
					'firstprice'=>$firstprice[$k],
					'continueprice'=>$continueprice[$k],
				);
				$db_count=$this->Yunfei->where(array('province_id'=>$next))->count();
				if($db_count>0){
					$this->Yunfei->where(array('province_id'=>$next))->save($data);
				}else{
					
					if(in_array($next, $jiangzhehu)){
						foreach($jiangzhehu as $pp_value){
							$data['province_id']=$pp_value;
							$this->Yunfei->add($data);
						}
					}else{
						$data['province_id']=$next;
						$this->Yunfei->add($data);
					}
					
				}
			}
			$this->success('操作成功.','add');
		}
	}
}