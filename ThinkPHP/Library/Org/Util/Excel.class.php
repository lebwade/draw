<?php

/**
 * PHPExcel
 *
 * Copyright (C) 2006 - 2010 PHPExcel
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @category   PHPExcel
 * @package    PHPExcel
 * @copyright  Copyright (c) 2006 - 2010 PHPExcel (http://www.codeplex.com/PHPExcel)
 * @license    http://www.gnu.org/licenses/old-licenses/lgpl-2.1.txt	LGPL
 * @version    1.7.4, 2010-08-26
 */
/** Error reporting */
error_reporting(E_ALL);
ini_set('memory_limit', '-1');
date_default_timezone_set('Asia/Shanghai');

/** PHPExcel */
require_once 'PHPExcel.php';

/**
 * 输出到页面上的EXCEL
 * 
 * 
 */
class Excel {
    private $cellArray = array(
        1 => 'A', 2 => 'B', 3 => 'C', 4 => 'D', 5 => 'E',
        6 => 'F', 7 => 'G', 8 => 'H', 9 => 'I', 10 => 'J',
        11 => 'K', 12 => 'L', 13 => 'M', 14 => 'N', 15 => 'O',
        16 => 'P', 17 => 'Q', 18 => 'R', 19 => 'S', 20 => 'T',
        21 => 'U', 22 => 'V', 23 => 'W', 24 => 'X', 25 => 'Y',
        26 => 'Z',
        27 => 'AA', 28 => 'AB', 29 => 'AC', 30 => 'AD', 31 => 'AE',
        32 => 'AF', 33 => 'AG', 34 => 'AH', 35 => 'AI', 36 => 'AJ',
        37 => 'AK', 38 => 'AL', 39 => 'AM', 40 => 'AN', 41 => 'AO',
        42 => 'AP', 43 => 'AQ', 44 => 'AR', 45 => 'AS', 46 => 'AT',
        47 => 'AU', 48 => 'AV', 49 => 'AW', 50 => 'AX', 51 => 'AY',
        52 => 'AZ', 53 => 'BA', 54 => 'BB', 55 => 'BC', 56 => 'BD', 57 => 'BE',
        58 => 'BF', 59 => 'BG', 60 => 'BH', 61 => 'BI', 62 => 'BJ', 63 => 'BK', 64 => 'BL');

    /**
     * 生成Excel 2007 并输出到浏览器上 
     * @param 表头内容
     * @data  输出数据
     * 结果输入Excel在页面上   
     */
    function writer($title = '', $data = '') {
        // Create new PHPExcel object
        $objPHPExcel = new PHPExcel();
        // Set properties
        $objPHPExcel->getProperties()->setCreator("Maarten Balliauw")
                ->setLastModifiedBy("Maarten Balliauw")
                ->setTitle("Office 2007 XLSX Test Document")
                ->setSubject("Office 2007 XLSX Test Document")
                ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
                ->setKeywords("office 2007 openxml php")
                ->setCategory("Test result file");

        //表头循环
        foreach ($title as $tkey => $tvalue) {
            $tkey = $tkey + 1;
            $row = $this->cellArray[$tkey] . '1'; //组合行数（开始是第一行）
            // Add some data  //表头
            $objPHPExcel->setActiveSheetIndex(0)->setCellValue($row, $tvalue);
        }

        // Miscellaneous glyphs, UTF-8
        //内容循环
        foreach ($data as $key => $value) {
            $i = 1;
            foreach ($value as $mkey => $mvalue) {
                $rows = $key + 2; //开始是第二行
                $mrow = $this->cellArray[$i] . $rows;
                $objPHPExcel->setActiveSheetIndex(0)->setCellValue($mrow, $mvalue);
                $i++;
            }
        }
        // Rename sheet
        $objPHPExcel->getActiveSheet()->setTitle('Simple');
        // Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $objPHPExcel->setActiveSheetIndex(0);

        // Redirect output to a client’s web browser (Excel2007)
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $datetime = date('Y-m-d-H-i-s', time());
        header('Content-Disposition: attachment;filename="' . $datetime . '.xlsx"');
        header('Cache-Control: max-age=0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter->save('php://output');
        exit;
    }

    /**
     * 读取Excel
     * @param  Excel文件名称 
     * @param  返回数据的键名 
     * @return data   
     */
    function read($fileName, $rows = '') {
        //$fileName      = "ExcelFile/MyExcel.xlsx";
        //$objReader = new PHPExcel_Reader_Excel2007();
        $objPHPExcel = \PHPExcel_IOFactory::load($fileName);
        //$objPHPExcel = $objReader->load("$fileName");
        $sheet = $objPHPExcel->getActiveSheet();
        $highestRow = $sheet->getHighestRow();           // 取得总行数  
        $highestColumn = $sheet->getHighestColumn();       // 取得总列数D

        $rowMin = array_search($highestColumn, $this->cellArray); //根据返回的总列数D 返回对用的KEY

        for ($i = 1; $i <= $highestRow; $i++) {                   //循环总行数
            for ($a = 1; $a <= $rowMin; $a++) {                   //循环总列数 
                if (empty($rows)) {
                    $data[$i][$a] = $sheet->getCell($this->cellArray[$a] . $i)->getCalculatedValue();
                } else {
                    $data[$i][$rows[$a - 1]] = $sheet->getCell($this->cellArray[$a] . $i)->getCalculatedValue(); //getCalculatedValue()获取到的是公式计算后的值
                }
            }
        }
        return $data;
    }

    /*     * **
     * 生成Excel文件，可分多个工作薄存储
     * @param title 第一行标题信息
     * @param data  数据信息
     * @param sum   数据总条数
     */

    public function writes($title = NULL, $data = NULL, $num = 1, $sum = NULL) {
        if (!$title || !$data) {
            exit('表头和数据不能为空');
        }
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->getProperties()->setCreator("Maarten Balliauw")
                ->setLastModifiedBy("Maarten Balliauw")
                ->setTitle("Office 2007 XLSX Test Document")
                ->setSubject("Office 2007 XLSX Test Document")
                ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
                ->setKeywords("office 2007 openxml php")
                ->setCategory("Test result file");
        //处理用户传入的数据总条数							 
        $sum = is_int($sum) ? $sum : count($data);
        //循环工作薄的个数			 
        for ($t = 0; $t < $num; $t++) {
            $objPHPExcel->createSheet($t);
            //表头循环
            foreach ($title as $tkey => $tvalue) {
                $tkey = $tkey + 1;
                $row = $this->cellArray[$tkey] . '1'; //组合行数（开始是第一行）
                $objPHPExcel->setActiveSheetIndex($t)->setCellValue($row, $tvalue);
            }
            $tmp = $sum % $num; //看每个工作薄是否能平均分配
            //计算每个工作薄最少显示的条数
            $sheet_num = intval($sum / $num);
            //计算当前工作薄的结束下标
            $end = ($t == $num - 1) ? $sum : $sheet_num * ($t + 1);
            //内容循环
            for ($j = $t * $sheet_num; $j < $end; $j++) {
                $i = 1;
                foreach ($data[$j] as $mkey => $mvalue) {
                    $rows = $j - $sheet_num * $t + 2; //开始是第二行
                    $mrow = $this->cellArray[$i] . $rows;
                    $objPHPExcel->setActiveSheetIndex($t)->setCellValue($mrow, $mvalue);
                    $i++;
                }
            }
            //给工作薄命名
            $objPHPExcel->getActiveSheet($t)->setTitle('Simple' . $t);
            $objPHPExcel->setActiveSheetIndex($t);
        }

        //设置文件头信息
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $datetime = date('Y-m-d-H-i-s', time());
        header('Content-Disposition: attachment;filename="' . $datetime . '.xlsx"');
        header('Cache-Control: max-age=0');

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter->save('php://output');
        exit;
    }

    function excelCommon($title = '', $data = '') {
        $datetimes = date('Y-m-d-H-i-s', time());
        header("<meta http-equiv=\"content-type\" content=\"text/html;charset=uft-8\">");
        header("Content-Type: application/vnd.ms-excel");
        header("content-disposition: attachment;filename=" . $datetimes . ".xls");
        foreach ($title as $val) {
            echo iconv('utf-8', 'gbk', $val) . "\t";
        }
        echo "\n";
        foreach ($data as $value) {
            if (!empty($value['serverName']))
                echo iconv('utf-8', 'gbk', $value['serverName']) . "\t";
            else
                echo "" . "\t";
            if (!empty($value['sid']))
                echo iconv('utf-8', 'gbk', $value['sid']) . "\t";
            else
                echo "" . "\t";
            if (!empty($value['discommenderReason']))
                echo iconv('utf-8', 'gbk', $value['discommenderReason']) . "\t";
            else
                echo "" . "\t";
            if (!empty($value['account'])) 
                echo iconv('utf-8', 'gbk', $value['account']) . "\t";
            else 
                echo "" . "\t";
             if (!empty($value['ip']))
                echo iconv('utf-8', 'gbk', $value['ip']) . "\t";
            else
                echo "" . "\t";
            echo "\n";
        }
    }

}
