<?php
function rsa_encrypt($message, $public_key, $modulus, $keylength)
{
    $padded = add_PKCS1_padding($message, true, $keylength / 8);
    $number = binary_to_number($padded);
    $encrypted = pow_mod($number, $public_key, $modulus);
    $result = number_to_binary($encrypted, $keylength / 8);
    return $result;

}
function rsa_decrypt($message, $private_key, $modulus, $keylength)
{
    $number = binary_to_number($message);
    $decrypted = pow_mod($number, $private_key, $modulus);
    $result = number_to_binary($decrypted, $keylength / 8);
    return remove_PKCS1_padding($result, $keylength / 8);
}
function rsa_sign($message, $private_key, $modulus, $keylength,$hash_func)
{
	//only suport sha1 or md5 digest now
	if (!function_exists($hash_func) && (strcmp($hash_func ,'sha1') == 0 || strcmp($hash_func,'md5') == 0))
		return false;
	$mssage_digest_info_hex = $hash_func($message);
	$mssage_digest_info_bin = hexTobin($mssage_digest_info_hex);
    $padded = add_PKCS1_padding($mssage_digest_info_bin, false, $keylength / 8);
    $number = binary_to_number($padded);
    $signed = pow_mod($number, $private_key, $modulus);
    $result = base64_encode($signed);
    return $result;
}
function rsa_verify($document, $signature, $public_key, $modulus, $keylength,$hash_func)
{
	//only suport sha1 or md5 digest now
	if (!function_exists($hash_func) && (strcmp($hash_func ,'sha1') == 0 || strcmp($hash_func,'md5') == 0))
		return false;
	$document_digest_info = $hash_func($document);

	$number    = binary_to_number(base64_decode($signature));


    $decrypted = pow_mod($number, $public_key, $modulus);

    $decrypted_bytes    = number_to_binary($decrypted, $keylength / 8);
    if($hash_func == "sha1" )
    {
    	$result = remove_PKCS1_padding_sha1($decrypted_bytes, $keylength / 8);
    }
    else
    {
    	$result = remove_PKCS1_padding_md5($decrypted_bytes, $keylength / 8);
    }

    $fang = hexTobin($document_digest_info);
    echo "\n------------\n";
    echo $fang;
    echo "\n------------\n";
    return 1;
	return( $fang == $result);
}
define("BCCOMP_LARGER", 1);
function pow_mod($p, $q, $r)
{
    // Extract powers of 2 from $q
    $factors = array();
    $div = $q;
    $power_of_two = 0;
    while(bccomp($div, "0") == BCCOMP_LARGER)
    {
        $rem = bcmod($div, 2);
        $div = bcdiv($div, 2);

        if($rem) array_push($factors, $power_of_two);
        $power_of_two++;
    }
    $partial_results = array();
    $part_res = $p;
    $idx = 0;

    foreach($factors as $factor)
    {
        while($idx < $factor)
        {
            $part_res = bcpow($part_res, "2");
            $part_res = bcmod($part_res, $r);
            $idx++;
        }
        array_push($partial_results, $part_res);
    }
    // Calculate final result
    $result = "1";
    foreach($partial_results as $part_res)
    {
        $result = bcmul($result, $part_res);
        $result = bcmod($result, $r);
    }
    return $result;
}
function add_PKCS1_padding($data, $isPublicKey, $blocksize)
{
    $pad_length = $blocksize - 3 - strlen($data);
    if($isPublicKey)
    {
        $block_type = "\x02";
        $padding = "";
        for($i = 0; $i < $pad_length; $i++)
        {
            $rnd = mt_rand(1, 255);
            $padding .= chr($rnd);
        }
    }
    else
    {
        $block_type = "\x01";
        $padding = str_repeat("\xFF", $pad_length);
    }

    return "\x00" . $block_type . $padding . "\x00" . $data;
}
function remove_PKCS1_padding($data, $blocksize)
{
    //assert(strlen($data) == $blocksize);
    $data = substr($data, 1);

    // We cannot deal with block type 0
    if($data{0} == '\0')
        die("Block type 0 not implemented.");

    // Then the block type must be 1 or 2
    //assert(($data{0} == "\x01") || ($data{0} == "\x02"));

    // Remove the padding
    $offset = strpos($data, "\0", 1);
    return substr($data, $offset + 1);
}

function remove_PKCS1_padding_sha1($data, $blocksize) {
	$digestinfo = remove_PKCS1_padding($data, $blocksize);
	$digestinfo_length = strlen($digestinfo);
	//sha1 digestinfo length not less than 20
	//assert($digestinfo_length >= 20);

	return substr($digestinfo, $digestinfo_length-20);
}

function remove_PKCS1_padding_md5($data, $blocksize) {
	$digestinfo = remove_PKCS1_padding($data, $blocksize);
	$digestinfo_length = strlen($digestinfo);
	//md5 digestinfo length not less than 16
	//assert($digestinfo_length >= 16);

	return substr($digestinfo, $digestinfo_length-16);
}

//--
// Convert binary data to a decimal number
//--

function binary_to_number($data)
{
    $base = "256";
    $radix = "1";
    $result = "0";

    for($i = strlen($data) - 1; $i >= 0; $i--)
    {
        $digit = ord($data{$i});
        $part_res = bcmul($digit, $radix);
        $result = bcadd($result, $part_res);
        $radix = bcmul($radix, $base);
    }
    return $result;
}

//--
// Convert a number back into binary form
//--
function number_to_binary($number, $blocksize)
{
    $base = "256";
    $result = "";
    $div = $number;
    while($div > 0)
    {
        $mod = bcmod($div, $base);
        $div = bcdiv($div, $base);
        $result = chr($mod) . $result;
    }
    return str_pad($result, $blocksize, "\x00", STR_PAD_LEFT);
}
//
//Convert hexadecimal format data into  binary
//
function hexTobin($data) {
  $len = strlen($data);
  $newdata='';
  for($i=0;$i<$len;$i+=2) {
      $newdata .= pack("C",hexdec(substr($data,$i,2)));
  }
  return $newdata;
}

?>
