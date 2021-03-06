	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<meta http-equiv="Content-Language" content="zh-CN"/>
		<meta http-equiv="Expires" content="0" />        
		<meta http-equiv="Cache-Control" content="no-cache" />        
		<meta http-equiv="Pragma" content="no-cache" />
		<title>通联网上支付平台-商户接口范例-单笔订单查询确认</title>
		<link href="css.css" rel="stylesheet" type="text/css" />
	</head>
	<body>
	<center> <font size=16><strong>单笔订单查询确认</strong></font></center>
	<?PHP
	/**
		* ATTENTION: 
		* The sync query function ONLY support PHP(5.0+)
		* There're a bug in fsockopen method which was provieded by PHP(4.x)
		*
		* If you want to use sync query function ,please install OPENSSL with PHP first.
		* example: (if you use APPSERV enviorment)
		* [1] open %WIN%\PHP.ini file and delete ';' which was front of "extension=php_openssl.dll"
		* [2] copy libeay32.dll and ssleay32.dll to %WIN%\system32 folder.
		* [3] restart apache httpserver
		* 
		*/
	$serverUrl = $_POST["serverUrl"];//http://ceshi.allinpay.com/gateway/index.do?
	$serverIP = $_POST["myServerIp"];//ceshi.allinpay.com
	$key = $_POST["key"];
	$merchantId = $_POST["merchantId"];
	$version = $_POST["version"];
	$signType = $_POST["signType"];
	$orderNo = $_POST["orderNo"];
	$orderDatetime = $_POST["orderDatetime"];
	$queryDatetime = $_POST["queryDatetime"];

	//组签名原串
	$bufSignSrc = "";
	if($merchantId != "")
	$bufSignSrc = $bufSignSrc."merchantId=".$merchantId."&";
	if($version != "")
	$bufSignSrc = $bufSignSrc."version=".$version."&";
	if($signType != "")
	$bufSignSrc = $bufSignSrc."signType=".$signType."&";
	if($orderNo != "")
	$bufSignSrc = $bufSignSrc."orderNo=".$orderNo."&";
	if($orderDatetime != "")
	$bufSignSrc = $bufSignSrc."orderDatetime=".$orderDatetime."&";
	if($queryDatetime != "")
	$bufSignSrc = $bufSignSrc."queryDatetime=".$queryDatetime."&";
	if($key != "")
	$bufSignSrc = $bufSignSrc."key=".$key;

	//生成签名串
	$signMsg = strtoupper(md5($bufSignSrc));	
	?>
		<table class="table_box" width="90%" align=center>
		   <tr class="tit_bar">
		      <td colspan="2" class="tit_bar">提交的查询表单参数</td>
		   </tr>
		   <tr>
		      <td>1</td><td>商户号: <?=$merchantId?></td>
		   </tr>  
		   <tr><td>2</td><td>接口版本号: <?=$version?></td>
		   </tr>
		   <tr><td>3</td><td>签名方式: <?=$signType?></td>
		   </tr>
		   <tr><td>4</td><td>商户订单号: <?=$orderNo?></td>
		   </tr>
		   <tr><td>5</td><td>商户订单提交时间: <?=$orderDatetime ?></td>
		   </tr>
		   <tr><td>6</td><td>商户提交查询时间: <?=$queryDatetime?></td>
		   </tr> 
		   <tr><td>7</td><td>签名串: <?=$signMsg?></td></tr>
		   <tr><td>签名原串：</td><td><?=$bufSignSrc?></td>
		   </tr>
		</table>
		
		<!-- 1. 页面方式提交查询请求 -->
		<div>
			<form name="form1" action="<?=$serverUrl?>" method="post">
			<input type="hidden" name="merchantId" value="<?=$merchantId?>" />
			<input type="hidden" name="version" value="<?=$version?>" />
			<input type="hidden" name="signType" value="<?=$signType?>" />
			<input type="hidden" name="orderNo" value="<?=$orderNo?>" />
			<input type="hidden" name="orderDatetime" value="<?=$orderDatetime ?>" />
			<input type="hidden" name="queryDatetime" value="<?=$queryDatetime?>" />
			<input type="hidden" name="signMsg" value="<?=$signMsg?>" />
			</form>
		</div>

		<!-- 2. HTTPCLIENT方式提交查询请求 -->
		<hr>
		<center> <font size=16><strong>同步返回单笔订单查询结果</strong></font></center>
		<?PHP

		require_once("d:\wamp\www\demo\php_rsa.php");  //请修改参数为php_rsa.php文件的实际位置
		//require_once("d:\wamp\www\demo\php_sax.php");  //请修改参数为php_sax.php文件的实际位置
		require_once("d:\wamp\www\demo\HashMap.class.php");	//请修改参数为HashMap.class.php文件的实际位置
		
		$argv = array(
		'merchantId' => $merchantId,
		'version' => $version,
		'signType' => $signType,
		'orderNo' => $orderNo,
		'orderDatetime' => $orderDatetime,
		'queryDatetime' => $queryDatetime,
		'signMsg' => $signMsg
		);

		$index = 0;	
		$params = "";	
		foreach($argv as $key=>$value){
			if($index != 0){
				$params .= '&'; 
			}
			$params .= $key.'=';
			$params .= urlencode($value);//对字符串进行编码转换
			$index += 1;
		}
		$length = strlen($params);
		
		$urlhost = $serverIP;
		$urlpath = '/gateway/index.do';
		
		$header = array();
		$header[] = 'POST '.$urlpath.' HTTP/1.0';
    $header[] = 'Host: '.$urlhost;
    $header[] = 'Accept: text/xml,application/xml,application/xhtml+xml,text/html,text/plain,image/png,image/jpeg,image/gif,*/*';
		$header[] = 'Accept-encoding: gzip';
		$header[] = 'Accept-language: en-us';
    $header[] = 'Content-Type: application/x-www-form-urlencoded';
    $header[] = 'Content-Length: '.$length;
    
    $request = implode("\r\n", $header)."\r\n\r\n".$params;
    $pageContents = "";
    
		if(!$fp= pfsockopen($urlhost, 80, $errno, $errstr, 10)){ //测试环境请换用pfsockopen($urlhost, 80, $errno, $errstr, 10)
		//if(!$fp= pfsockopen($urlhost, 80, $errno, $errstr, 10)){ //生产环境请换用pfsockopen('ssl://'.$urlhost, 443, $errno, $errstr, 10)
			echo "can not connect to {$urlhost}. $errstr($errno) <br/>"; 
		  echo $fp; 
		}else{
			fwrite($fp, $request); 
			$inHeaders = true;//是否在返回头
			$atStart = true;//是否返回头第一行
			$ERROR = false;
			$responseStatus;//返回头状态 
		  while(!feof($fp)){ 
		  	$line = fgets($fp, 2048); 
		  	
		  	if($atStart){
		  			$atStart = false;
		  			preg_match('/HTTP\/(\\d\\.\\d)\\s*(\\d+)\\s*(.*)/', $line, $m); 
	      		$responseStatus = $m[2];
	      		print_r("<div style='padding-left:40px;'>");
	      		print_r("<div>".$line."</div>" );
	      		print_r("</div>");
	      		continue;
		  	}
		  	
		  	if($inHeaders ){
	  			  if(strLen(trim($line)) == 0 ){
		  					$inHeaders = false;		
		  			}
		  			continue;
		  	}
		  	
		  	if(!$inHeaders and $responseStatus == 200){
			  	//获得参数串
			  	$pageContents = $line;  	
		  	}
		  } 
		  fclose($fp);
		}

		//echo "pageContents=".$pageContents;
		$map = new HashMap();
		$result = explode('&',$pageContents);
		if (is_array($result)) {
				foreach ($result as $element) {
						$temp = explode('=',$element);
						if(count($temp)==2){
							$map->put($temp[0], $temp[1]);
							}					
		  	}
		}
		
		//开始组验签源串
		$bufVerifySrc = "";
		if($map->get("merchantId") != "")
		$bufVerifySrc = $bufVerifySrc."merchantId=".($map->get("merchantId"))."&"; 		//merchantId
		
		if($map->get("version") != "")
		$bufVerifySrc = $bufVerifySrc."version=".($map->get("version"))."&";		//version
		
		if($map->get("language") != "")
		$bufVerifySrc = $bufVerifySrc."language=".($map->get("language"))."&";		//language

		if($map->get("signType") != "")
		$bufVerifySrc = $bufVerifySrc."signType=".($map->get("signType"))."&";		//signType

		if($map->get("payType") != "")
		$bufVerifySrc = $bufVerifySrc."payType=".($map->get("payType"))."&";		//payType
		
		if($map->get("paymentOrderId") != "")
		$bufVerifySrc = $bufVerifySrc."paymentOrderId=".($map->get("paymentOrderId"))."&";		//paymenrOrderId

		if($map->get("orderNo") != "")
		$bufVerifySrc = $bufVerifySrc."orderNo=".($map->get("orderNo"))."&";		///orderNo

		if($map->get("orderDatetime") != "")
		$bufVerifySrc = $bufVerifySrc."orderDatetime=".($map->get("orderDatetime"))."&";		//orderDatetime

		if($map->get("orderAmount") != "")
		$bufVerifySrc = $bufVerifySrc."orderAmount=".($map->get("orderAmount"))."&";		//orderAmount

		if($map->get("payDatetime") != "")
		$bufVerifySrc = $bufVerifySrc."payDatetime=".($map->get("payDatetime"))."&";		//payDatetime
		
		if($map->get("payAmount") != "")
		$bufVerifySrc = $bufVerifySrc."payAmount=".($map->get("payAmount"))."&";		//payAmount
		
		if($map->get("ext1") != "")
		$bufVerifySrc = $bufVerifySrc.urldecode("ext1=".($map->get("ext1")))."&";		//ext1
		
		if($map->get("ext2") != "")
		$bufVerifySrc = $bufVerifySrc.urldecode("ext2=".($map->get("ext2")))."&";		//ext2				
		
		if($map->get("payResult") != "")
		$bufVerifySrc = $bufVerifySrc."payResult=".($map->get("payResult"))."&";		//payResult
		
		if($map->get("errorCode") != "")
		$bufVerifySrc = $bufVerifySrc."errorCode=".($map->get("errorCode"))."&";		//errorCode
		
		if($map->get("returnDatetime") != "")
		$bufVerifySrc = $bufVerifySrc."returnDatetime=".($map->get("returnDatetime"));		//returnDatetime
		//验签源串组装完成
		//print_r("-------------------<br>");
		//print_r("bufVerifySrc:".$bufVerifySrc);	
		//print_r("<br>-------------------<br>");

		//取签名量
		$verifyMsgArray = explode('=',$result[10]);
		$verifyMsg = urldecode($verifyMsgArray[1]);

		//取交易结果量
		$payResultArray = explode('=',$result[22]);
		$payResult = $payResultArray[1]; 		//交易状态 payResult=1表示交易成功
			
		//验签
		//initPublicKey("d:\wamp\www\demo\publickey.xml");
		//解析publickey.txt文本获取公钥信息
		$publickeyfile = 'd:\wamp\www\demo\publickey.txt';
		$publickeycontent = file_get_contents($publickeyfile);
		//echo "<br>".$content;
		$publickeyarray = explode(PHP_EOL, $publickeycontent);
		$publickey = explode('=',$publickeyarray[0]);
		$modulus = explode('=',$publickeyarray[1]);
		//echo "<br>publickey=".$publickey[1];
		//echo "<br>modulus=".$modulus[1];
		
		//请把参数修改为你的publickey.xml文件的存放位置，此处使用文件绝对路径
		//测试环境请用测试证书文件，生产环境请用生产证书文件
		$keylength = 1024;
 		$verify_result = rsa_verify($bufVerifySrc,$verifyMsg, $publickey[1], $modulus[1], $keylength,"sha1");
 		if($verify_result ){
 			$verifyResult = 1;
 		}else{
 			$verifyResult = 0;
 		}

 		
		//判断交易结果，判断验签结果
		$resultMsg = '';
		if($payResult==1){
			if($verifyResult ==1){
				$resultMsg = "订单支付成功，验签成功！商户更新订单状态！";
			}else{
				$resultMsg = "订单支付成功，验签失败！";
			}
		}
		else{
			$resultMsg = "订单尚未付款！";
		}		
		?>

		<div style="padding-left:40px;">
			<div>订单是否成功：<?=$payResult ?> (1:成功 0:失败)</div>
			<div>验签是否成功：<?=$verifyResult ?> (1:成功 0:失败)</div>
			<div>查询处理结果：<?=$resultMsg ?></div>
		</div>

  </body>
	
</html>









