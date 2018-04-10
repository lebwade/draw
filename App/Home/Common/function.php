<?php

/**
 * @Author: xiecl
 * @Date:   2018-03-29 17:38:04
 * @Last Modified by:   congli.xie
 * @Last Modified time: 2018-03-29 18:07:32
 */
//获取随机字符串
function randstr($length=6){
	$hash='';
	$chars= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz@#!~?:-='; 
	$max=strlen($chars)-1;   
	mt_srand((double)microtime()*1000000);   
	for($i=0;$i<$length;$i++)   {   
	$hash.=$chars[mt_rand(0,$max)];   
	}   
	return $hash;   
}