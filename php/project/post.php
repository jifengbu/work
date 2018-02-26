	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	<html xmlns="http://www.w3.org/1999/xhtml">
	<head>

		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<meta http-equiv="Content-Language" content="zh-CN"/>
		<meta http-equiv="Expires" CONTENT="0">        
		<meta http-equiv="Cache-Control" CONTENT="no-cache">        
		<meta http-equiv="Pragma" CONTENT="no-cache">
		<title>通联网上支付平台通联网上支付平台-商户接口范例-支付请求信息签名</title>
		<link href="css.css" rel="stylesheet" type="text/css">
	</head>
	<body>	
	<center> <font size=16><strong>订单支付请求</strong></font></center>
	<?PHP

	//页面编码要与参数inputCharset一致，否则服务器收到参数值中的汉字为乱码而导致验证签名失败。	
	$serverUrl=$_POST["serverUrl"];
	$inputCharset=$_POST["inputCharset"];
	$pickupUrl=$_POST["pickupUrl"];
	$receiveUrl=$_POST["receiveUrl"];
	$version=$_POST["version"];
	$language=$_POST["language"];
	$signType=$_POST["signType"];
	$merchantId=$_POST["merchantId"];
	$payerName=$_POST["payerName"];
	$payerEmail=$_POST["payerEmail"];	
	$payerTelephone=$_POST["payerTelephone"];
	$payerIDCard=$_POST["payerIDCard"];
	$pid=$_POST["pid"];
	$orderNo=$_POST["orderNo"];
	$orderAmount=$_POST["orderAmount"];
	$orderDatetime=$_POST["orderDatetime"];
	$orderCurrency=$_POST["orderCurrency"];
	$orderExpireDatetime=$_POST["orderExpireDatetime"];
	$productName=$_POST["productName"];
	$productId=$_POST["productId"];
	$productPrice=$_POST["productPrice"];
	$productNum=$_POST["productNum"];
	$productDesc=$_POST["productDesc"];
	$ext1=$_POST["ext1"];
	$ext2=$_POST["ext2"];
	$extTL=$_POST["extTL"];
	$payType=$_POST["payType"]; //payType   不能为空，必须放在表单中提交。
	$issuerId=$_POST["issuerId"]; //issueId 直联时不为空，必须放在表单中提交。
	$pan=$_POST["pan"];	
	$tradeNature=$_POST["tradeNature"];
	$key=$_POST["key"]; 
	
	//报文参数有消息校验
	//if(preg_match("/\d/",$pickupUrl)){
	//echo "<script>alert('pickupUrl有误！！');history.back();</script>";
	//}

	// 生成签名字符串。
	$bufSignSrc=""; 
	if($inputCharset != "")
	$bufSignSrc=$bufSignSrc."inputCharset=".$inputCharset."&";		
	if($pickupUrl != "")
	$bufSignSrc=$bufSignSrc."pickupUrl=".$pickupUrl."&";		
	if($receiveUrl != "")
	$bufSignSrc=$bufSignSrc."receiveUrl=".$receiveUrl."&";		
	if($version != "")
	$bufSignSrc=$bufSignSrc."version=".$version."&";		
	if($language != "")
	$bufSignSrc=$bufSignSrc."language=".$language."&";		
	if($signType != "")
	$bufSignSrc=$bufSignSrc."signType=".$signType."&";		
	if($merchantId != "")
	$bufSignSrc=$bufSignSrc."merchantId=".$merchantId."&";		
	if($payerName != "")
	$bufSignSrc=$bufSignSrc."payerName=".$payerName."&";		
	if($payerEmail != "")
	$bufSignSrc=$bufSignSrc."payerEmail=".$payerEmail."&";		
	if($payerTelephone != "")
	$bufSignSrc=$bufSignSrc."payerTelephone=".$payerTelephone."&";			
	if($payerIDCard != "")
	$bufSignSrc=$bufSignSrc."payerIDCard=".$payerIDCard."&";			
	if($pid != "")
	$bufSignSrc=$bufSignSrc."pid=".$pid."&";		
	if($orderNo != "")
	$bufSignSrc=$bufSignSrc."orderNo=".$orderNo."&";
	if($orderAmount != "")
	$bufSignSrc=$bufSignSrc."orderAmount=".$orderAmount."&";
	if($orderCurrency != "")
	$bufSignSrc=$bufSignSrc."orderCurrency=".$orderCurrency."&";
	if($orderDatetime != "")
	$bufSignSrc=$bufSignSrc."orderDatetime=".$orderDatetime."&";
	if($orderExpireDatetime != "")
	$bufSignSrc=$bufSignSrc."orderExpireDatetime=".$orderExpireDatetime."&";
	if($productName != "")
	$bufSignSrc=$bufSignSrc."productName=".$productName."&";
	if($productPrice != "")
	$bufSignSrc=$bufSignSrc."productPrice=".$productPrice."&";
	if($productNum != "")
	$bufSignSrc=$bufSignSrc."productNum=".$productNum."&";
	if($productId != "")
	$bufSignSrc=$bufSignSrc."productId=".$productId."&";
	if($productDesc != "")
	$bufSignSrc=$bufSignSrc."productDesc=".$productDesc."&";
	if($ext1 != "")
	$bufSignSrc=$bufSignSrc."ext1=".$ext1."&";
	if($ext2 != "")
	$bufSignSrc=$bufSignSrc."ext2=".$ext2."&";
	if($extTL != "")
	$bufSignSrc=$bufSignSrc."extTL".$extTL."&";
	if($payType != "")
	$bufSignSrc=$bufSignSrc."payType=".$payType."&";		
	if($issuerId != "")
	$bufSignSrc=$bufSignSrc."issuerId=".$issuerId."&";
	if($pan != "")
	$bufSignSrc=$bufSignSrc."pan=".$pan."&";	
	if($tradeNature != "")
	$bufSignSrc=$bufSignSrc."tradeNature=".$tradeNature."&";	
	$bufSignSrc=$bufSignSrc."key=".$key; //key为MD5密钥，密钥是在通联支付网关商户服务网站上设置。
	
	//签名，设为signMsg字段值。
	$signMsg = strtoupper(md5($bufSignSrc));	
	
	?>
	
	<!--
		1、订单可以通过post方式或get方式提交，建议使用post方式；
		   提交支付请求可以使用http或https方式，建议使用https方式。
		2、通联支付网关地址、商户号及key值，在接入测试时由通联提供；
		   通联支付网关地址、商户号，在接入生产时由通联提供，key值在通联支付网关会员服务网站上设置。
	-->
	<!--================= post 方式提交支付请求 start =====================-->
	<!--================= 测试地址为 http://ceshi.allinpay.com/gateway/index.do =====================-->
	<!--================= 生产地址请在测试环境下通过后从业务人员获取 =====================-->
	<form name="form2" action="<?=$serverUrl ?>" method="post">
		<input type="hidden" name="inputCharset" id="inputCharset" value="<?=$inputCharset ?>" />
		<input type="hidden" name="pickupUrl" id="pickupUrl" value="<?=$pickupUrl?>"/>
		<input type="hidden" name="receiveUrl" id="receiveUrl" value="<?=$receiveUrl?>" />
		<input type="hidden" name="version" id="version" value="<?=$version?>"/>
		<input type="hidden" name="language" id="language" value="<?=$language?>" />
		<input type="hidden" name="signType" id="signType" value="<?=$signType?>"/>
		<input type="hidden" name="merchantId" id="merchantId" value="<?=$merchantId?>" />
		<input type="hidden" name="payerName" id="payerName" value="<?=$payerName?>"/>
		<input type="hidden" name="payerEmail" id="payerEmail" value="<?=$payerEmail?>" />
		<input type="hidden" name="payerTelephone" id="payerTelephone" value="<?=$payerTelephone ?>" />
		<input type="hidden" name="payerIDCard" id="payerIDCard" value="<?=$payerIDCard ?>" />
		<input type="hidden" name="pid" id="pid" value="<?=$pid?>"/>
		<input type="hidden" name="orderNo" id="orderNo" value="<?=$orderNo?>" />
		<input type="hidden" name="orderAmount" id="orderAmount" value="<?=$orderAmount ?>"/>
		<input type="hidden" name="orderCurrency" id="orderCurrency" value="<?=$orderCurrency?>" />
		<input type="hidden" name="orderDatetime" id="orderDatetime" value="<?=$orderDatetime?>" />
		<input type="hidden" name="orderExpireDatetime" id="orderExpireDatetime" value="<?=$orderExpireDatetime ?>"/>
		<input type="hidden" name="productName" id="productName" value="<?=$productName?>" />
		<input type="hidden" name="productPrice" id="productPrice" value="<?=$productPrice?>" />
		<input type="hidden" name="productNum" id="productNum" value="<?=$productNum?>"/>
		<input type="hidden" name="productId" id="productId" value="<?=$productId?>" />
		<input type="hidden" name="productDesc" id="productDesc" value="<?=$productDesc?>" />
		<input type="hidden" name="ext1" id="ext1" value="<?=$ext1?>" />
		<input type="hidden" name="ext2" id="ext2" value="<?=$ext2?>" />
		<input type="hidden" name="extTL" id="extTL" value="<?=$extTL?>" />
		<input type="hidden" name="payType" value="<?=$payType?>" />
		<input type="hidden" name="issuerId" value="<?=$issuerId?>" />
		<input type="hidden" name="pan" value="<?=$pan?>" />
		<input type="hidden" name="tradeNature" value="<?=$tradeNature?>" />
		<input type="hidden" name="signMsg" id="signMsg" value="<?=$signMsg?>" />
		<div align="center"><input type="submit" value="确认付款，到通联支付去啦" align=center/></div>
	<!--================= post 方式提交支付请求 end =====================-->
	</form>
	<table class="table_box" width="90%" align="center">
	<tr><td colspan="2" class="tit_bar">提交支付订单请求参数</td></tr>
	   <tr><td>1、</td><td style="width:100px">编码: <?=$inputCharset?> </td></tr>  
	   <tr><td>2、</td><td>取货地址: <?=$pickupUrl ?></td></tr>
	   <tr><td>3、</td><td>商户系统通知地址: <?=$receiveUrl ?></td></tr>
	   <tr><td>4、</td><td>报文版本号: <?=$version ?></td></tr>
	   <tr><td>5、</td><td>语言: <?=$language ?></td></tr>
	   <tr><td>6、</td><td>签名方式: <?=$signType ?></td></tr> 
		<tr><td>7、</td><td>商户号: <?=$merchantId ?></td></tr>
		<tr><td>8、</td><td>付款人名称: <?=$payerName ?></td></tr>	
		<tr><td>9、</td><td>付款人联系email: <?=$payerEmail ?></td></tr>	
		<tr><td>10、</td><td>付款人电话: <?=$payerTelephone ?></td></tr>
		<tr><td>11、</td><td>付款人证件号: <?=$payerIDCard ?></td></tr>
		<tr><td>12、</td> <td>合作伙伴的商户号: <?=$pid ?></td></tr>	
		<tr><td>13、</td> <td >商户系统订单号: <?=$orderNo ?></td></tr>	
		<tr><td>14、</td>  <td>订单金额(精确到分): <?= $orderAmount ?></td></tr>
		<tr><td>15、</td>  <td>金额币种: <?=$orderCurrency ?></td></tr>
		<tr><td>16、</td>  <td>商户的订单创建时间: <?=$orderDatetime ?></td></tr>
		<tr><td>17、</td>  <td>订单过期时间: <?=$orderExpireDatetime ?></td></tr>
		<tr><td>18、</td>  <td>商品名称: <?=$productName ?></td></tr>
		<tr><td>19、</td>  <td>商品单价: <?=$productPrice ?></td></tr>
		<tr><td>20、</td>  <td>商品数量: <?=$productNum ?></td></tr>	
		<tr><td>21、</td>  <td>商品代码: <?=$productId ?></td></tr>
		<tr><td>22、</td>  <td>商品描述: <?=$productDesc ?></td></tr>
		<tr><td>23、</td>  <td>附加参数1: <?=$ext1 ?></td></tr>
		<tr><td>24、</td>  <td>附加参数2: <?=$ext2 ?></td></tr>
		<tr><td>25、</td>  <td>业务拓展字段: <?=$extTL ?></td></tr>
		<tr><td>26、</td>  <td>支付方式: <?=$payType ?></td></tr>
		<tr><td>27、</td>  <td>发卡行代码: <?=$issuerId ?></td></tr>
		<tr><td>28、</td>  <td>付款人支付卡号: <?=$pan ?></td></tr>
		<tr><td>28、</td>  <td>贸易类型: <?=$tradeNature ?></td></tr>
		<tr><td>组成签名原串的内容: </td><td><textarea  rows="4" cols="120"><?=$bufSignSrc?></textarea></td></tr>
		<tr><td>报文签名后内容: </td><td><?=$signMsg?></td></tr>	
		</tbody>
	</table>
	</body>
	</html>