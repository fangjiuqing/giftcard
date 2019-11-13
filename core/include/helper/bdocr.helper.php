<?php
namespace re\rgx;

/**
 * 文字OCR
 */
class bdocr_helper extends AipBase {

    /**
     * idcard api url
     * @var string
     */
    private $idcardUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/idcard';

    /**
     * bankcard api url
     * @var string
     */
    private $bankcardUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/bankcard';

    /**
     * general api url
     * @var string
     */
    private $generalUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general';

    /**
     * basic general api url
     * @var string
     */
    private $basicGeneralUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic';

    /**
     * web image url
     * @var string
     */
    private $webImageUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/webimage';

    /**
     * enhanced general url
     * @var string
     */
    private $enhancedGeneralUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_enhanced';

    /**
     * @var string
     */
    private $drivingLicenseUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/driving_license';

    /**
     * @var string
     */
    private $vehicleLicenseUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/vehicle_license';

    /**
     * @var string
     */
    private $tableRequestUrl = 'https://aip.baidubce.com/rest/2.0/solution/v1/form_ocr/request';

    /**
     * @var string
     */
    private $tableResultUrl = 'https://aip.baidubce.com/rest/2.0/solution/v1/form_ocr/get_request_result';

    /**
     * @var string
     */
    private $licensePlateUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/license_plate';

    /**
     * @var string
     */
    private $accurateUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate';

    /**
     * @var string
     */
    private $basicAccurateUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic';

    /**
     * @var string
     */
    private $receiptUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/receipt';

    /**
     * @var string
     */
    private $businessLicenseUrl = 'https://aip.baidubce.com/rest/2.0/ocr/v1/business_license';

    /**
     * 架构方法
     */
    public function __construct() {
        parent::__construct('10197554', 'aIf6iVvftTc92SXOEK34lMWS', 'U9alULtEunZzF1wLweDPBs5KFKW8y0hl');
        //AipOcr(APP_ID, API_KEY, SECRET_KEY);
        AipHttpUtil::__init();
        AipSampleSigner::__init();
    }

    /**
     * @param  string $image 图像读取
     * @param  bool $isFront 身份证是 true正面 false反面
     * @param  array $options 可选参数
     * @return array
     */
    public function idcard($image, $isFront, $options = []) {
        $ret  = CACHE('bdocr#-card-' . md5($image));
        if (empty($ret)) {
            $data = [];
            $data['image'] = $image;
            $data['id_card_side'] = $isFront ? 'front' : 'back';
            $data = array_merge($data, $options);
            $ret  = $this->request($this->idcardUrl, $data);
            CACHE('bdocr#-card-' . md5($image), $ret, 864000);
        }
        return $ret;
    }

    /**
     * @param  string $image 图像读取
     * @return array
     */
    public function bankcard($image) {

        $data = [];
        $data['image'] = $image;

        return $this->request($this->bankcardUrl, $data);
    }

    /**
     * @param  string $image 图像读取
     * @param  array $options 可选参数
     * @return array
     */
    public function general($image, $options = []) {

        $data = [];
        $data['image'] = $image;

        $data = array_merge($data, $options);

        return $this->request($this->generalUrl, $data);
    }

    /**
     * @param  string $image 图像读取
     * @param  array $options 可选参数
     * @return array
     */
    public function basicGeneral($image, $options = []) {

        $data = [];
        $data['image'] = $image;

        $data = array_merge($data, $options);

        return $this->request($this->basicGeneralUrl, $data);
    }

    /**
     * @param  string $image 图像读取
     * @param  options 接口可选参数
     *                detect_direction : true/false
     *                language_type :
     *                <p>识别语言类型，若不传则默认为CHN_ENG。
     *                  可选值包括：CHN_ENG - 中英文混合；
     *                  ENG - 英文；
     *                  POR - 葡萄牙语；
     *                  FRE - 法语；
     *                  GER - 德语；
     *                  ITA - 意大利语；
     *                  SPA - 西班牙语；
     *                  RUS - 俄语；
     *                  JAP - 日语</p>
     *                mask : 表示mask区域的黑白灰度图片，白色代表选中, base64编码
     *                detect_language: true/false
     * @return array
     */
    public function webImage($image, $options = []) {

        $data = [];
        $data['image'] = $image;

        $data = array_merge($data, $options);

        return $this->request($this->webImageUrl, $data);
    }

    /**
     * @param  string $image 图像读取
     * @param  options 接口可选参数
     *                detect_direction : true/false
     *                language_type :
     *                <p>识别语言类型，若不传则默认为CHN_ENG。
     *                  可选值包括：CHN_ENG - 中英文混合；
     *                  ENG - 英文；
     *                  POR - 葡萄牙语；
     *                  FRE - 法语；
     *                  GER - 德语；
     *                  ITA - 意大利语；
     *                  SPA - 西班牙语；
     *                  RUS - 俄语；
     *                  JAP - 日语</p>
     *                mask : 表示mask区域的黑白灰度图片，白色代表选中, base64编码
     *                detect_language: true/false
     * @return array
     */
    public function enhancedGeneral($image, $options = []) {

        $data = [];
        $data['image'] = $image;

        $data = array_merge($data, $options);

        return $this->request($this->enhancedGeneralUrl, $data);
    }

    /**
     * 行驶证
     * @param  string $image 图像读取
     * @param  options 接口可选参数
     * @return array
     */
    public function vehicleLicense($image, $options = []) {

        $data = [];
        $data['image'] = $image;

        $data = array_merge($data, $options);

        return $this->request($this->vehicleLicenseUrl, $data);
    }

    /**
     * 驾驶证
     * @param  string $image 图像读取
     * @param  options 接口可选参数
     * @return array
     */
    public function drivingLicense($image, $options = []) {

        $data = [];
        $data['image'] = $image;

        $data = array_merge($data, $options);

        return $this->request($this->drivingLicenseUrl, $data);
    }

    /**
     * 格式检查
     * @param  string $url
     * @param  array $data
     * @return array
     */
    protected function validate($url, &$data) {
        if ($url === $this->tableResultUrl) {
            return true;
        }

        // 支持url
        if (preg_match('/^\w{1,128}:\/\//', $data['image'])) {
            $data['url'] = $data['image'];
            unset($data['image']);
            return true;
        }

        $imageInfo = AipImageUtil::getImageInfo($data['image']);

        //图片格式检查
        if (!in_array($imageInfo['mime'], ['image/jpeg', 'image/png', 'image/bmp'])) {
            return [
                'error_code' => 'SDK109',
                'error_msg' => 'unsupported image format',
            ];
        }

        //图片大小检查
        if ($imageInfo['width'] < 15 || $imageInfo['width'] > 4096 || $imageInfo['height'] < 15 || $imageInfo['height'] > 4096) {
            return [
                'error_code' => 'SDK101',
                'error_msg' => 'image length error',
            ];
        }

        $data['image'] = base64_encode($data['image']);

        //编码后小于4m
        if (strlen($data['image']) >= 4 * 1024 * 1024) {
            return [
                'error_code' => 'SDK100',
                'error_msg' => 'image size error',
            ];
        }

        return true;
    }

    /**
     * 异步请求
     * @param  string $image 图像读取
     * @param  options 接口可选参数
     * @return array
     */
    public function tableRecognitionAsync($image, $options = []) {

        $data = [];
        $data['image'] = $image;

        $data = array_merge($data, $options);

        return $this->request($this->tableRequestUrl, $data);
    }

    /**
     * 获取结果
     * @param  string $requestId 图像读取
     * @param  options 接口可选参数
     * @return array
     */
    public function getTableRecognitionResult($requestId, $options = []) {

        $data = [];
        $data['request_id'] = $requestId;

        $data = array_merge($data, $options);

        return $this->request($this->tableResultUrl, $data);
    }

    /**
     * 同步请求
     * @param  string $image 图像读取
     * @param  options 接口可选参数
     * @return array
     */
    public function tableRecognition($image, $options = [], $timeout = 10000) {
        $result = $this->tableRecognitionAsync($image);

        if (isset($result['error_code'])) {
            return $result;
        }

        $requestId = $result['result'][0]['request_id'];
        $count = ceil($timeout / 1000);
        for ($i = 0; $i < $count; ++$i) {

            $result = $this->getTableRecognitionResult($requestId, $options);

            // 完成
            if ($result['result']['ret_code'] == 3) {
                break;
            }

            sleep(1);
        }

        return $result;
    }

    /**
     * 车牌
     * @param  string $image 图像读取
     * @param  options 接口可选参数
     * @return array
     */
    public function licensePlate($image, $options = []) {

        $data = [];
        $data['image'] = $image;

        $data = array_merge($data, $options);

        return $this->request($this->licensePlateUrl, $data);
    }

    /**
     * @param  string $image 图像读取
     * @param  array $options 可选参数
     * @return array
     */
    public function accurate($image, $options = []) {

        $data = [];
        $data['image'] = $image;

        $data = array_merge($data, $options);

        return $this->request($this->accurateUrl, $data);
    }

    /**
     * @param  string $image 图像读取
     * @param  array $options 可选参数
     * @return array
     */
    public function basicAccurate($image, $options = []) {
        $ret  = CACHE('bdocr@' . md5($image));
        if (empty($ret)) {
            $data = [];
            $data['image'] = $image;
            $data = array_merge($data, $options);
            $ret  = $this->request($this->basicAccurateUrl, $data);
            CACHE('bdocr@' . md5($image), $ret, 864000);
        }
        return $ret;
    }

    /**
     * @param  string $image 图像读取
     * @param  array $options 可选参数
     * @return array
     */
    public function receipt($image, $options = []) {

        $data = [];
        $data['image'] = $image;

        $data = array_merge($data, $options);

        return $this->request($this->receiptUrl, $data);
    }

    /**
     * @param  string $image 图像读取
     * @param  array $options 可选参数
     * @return array
     */
    public function businessLicense($image, $options = []) {

        $data = [];
        $data['image'] = $image;

        $data = array_merge($data, $options);

        return $this->request($this->businessLicenseUrl, $data);
    }

}

class AipImageUtil {

    /**
     * 获取图片信息
     * @param  $content string
     * @return array
     */
    public static function getImageInfo($content) {
        $info = getimagesizefromstring($content);

        return [
            'mime' => $info['mime'],
            'width' => $info[0],
            'height' => $info[1],
        ];
    }
}

/**
 * Http Client
 */
class AipHttpClient {

    /**
     * HttpClient
     * @param array $headers HTTP header
     */
    public function __construct($headers = []) {
        $this->headers = $this->buildHeaders($headers);
        $this->connectTimeout = 60000;
        $this->socketTimeout = 60000;
    }

    /**
     * 连接超时
     * @param int $ms 毫秒
     */
    public function setConnectionTimeoutInMillis($ms) {
        $this->connectTimeout = $ms;
    }

    /**
     * 响应超时
     * @param int $ms 毫秒
     */
    public function setSocketTimeoutInMillis($ms) {
        $this->socketTimeout = $ms;
    }

    /**
     * @param  string $url
     * @param  array $data HTTP POST BODY
     * @param  array $param HTTP URL
     * @param  array $headers HTTP header
     * @return array
     */
    public function post($url, $data = [], $params = [], $headers = []) {
        $url = $this->buildUrl($url, $params);
        $headers = array_merge($this->headers, $this->buildHeaders($headers));

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POSTFIELDS, is_array($data) ? http_build_query($data) : $data);
        curl_setopt($ch, CURLOPT_TIMEOUT_MS, $this->socketTimeout);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT_MS, $this->connectTimeout);
        $content = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($code === 0) {
            throw new Exception(curl_error($ch));
        }

        curl_close($ch);
        return [
            'code' => $code,
            'content' => $content,
        ];
    }

    /**
     * @param  string $url
     * @param  array $datas HTTP POST BODY
     * @param  array $param HTTP URL
     * @param  array $headers HTTP header
     * @return array
     */
    public function multiPost($url, $datas = [], $params = [], $headers = []) {
        $url = $this->buildUrl($url, $params);
        $headers = array_merge($this->headers, $this->buildHeaders($headers));

        $chs = [];
        $result = [];
        $mh = curl_multi_init();
        foreach ($datas as $data) {
            $ch = curl_init();
            $chs[] = $ch;
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_HEADER, false);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_POSTFIELDS, is_array($data) ? http_build_query($data) : $data);
            curl_setopt($ch, CURLOPT_TIMEOUT_MS, $this->socketTimeout);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT_MS, $this->connectTimeout);
            curl_multi_add_handle($mh, $ch);
        }

        $running = null;
        do {
            curl_multi_exec($mh, $running);
            usleep(100);
        } while ($running);

        foreach ($chs as $ch) {
            $content = curl_multi_getcontent($ch);
            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $result[] = [
                'code' => $code,
                'content' => $content,
            ];
            curl_multi_remove_handle($mh, $ch);
        }
        curl_multi_close($mh);

        return $result;
    }

    /**
     * @param  string $url
     * @param  array $param HTTP URL
     * @param  array $headers HTTP header
     * @return array
     */
    public function get($url, $params = [], $headers = []) {
        $url = $this->buildUrl($url, $params);
        $headers = array_merge($this->headers, $this->buildHeaders($headers));

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT_MS, $this->socketTimeout);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT_MS, $this->connectTimeout);
        $content = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($code === 0) {
            throw new Exception(curl_error($ch));
        }

        curl_close($ch);
        return [
            'code' => $code,
            'content' => $content,
        ];
    }

    /**
     * 构造 header
     * @param  array $headers
     * @return array
     */
    private function buildHeaders($headers) {
        $result = [];
        foreach ($headers as $k => $v) {
            $result[] = sprintf('%s:%s', $k, $v);
        }
        return $result;
    }

    /**
     *
     * @param  string $url
     * @param  array $params 参数
     * @return string
     */
    private function buildUrl($url, $params) {
        if (!empty($params)) {
            $str = http_build_query($params);
            return $url . (strpos($url, '?') === false ? '?' : '&') . $str;
        } else {
            return $url;
        }
    }
}

/**
 * Aip Base 基类
 */
class AipBase {

    /**
     * 获取access token url
     * @var string
     */
    protected $accessTokenUrl = 'https://aip.baidubce.com/oauth/2.0/token';

    /**
     * appId
     * @var string
     */
    protected $appId = '';

    /**
     * apiKey
     * @var string
     */
    protected $apiKey = '';

    /**
     * secretKey
     * @var string
     */
    protected $secretKey = '';

    /**
     * 权限
     * @var array
     */
    protected $scope = 'brain_all_scope';

    /**
     * @param string $appId
     * @param string $apiKey
     * @param string $secretKey
     */
    public function __construct($appId, $apiKey, $secretKey) {
        $this->appId = trim($appId);
        $this->apiKey = trim($apiKey);
        $this->secretKey = trim($secretKey);
        $this->isCloudUser = null;
        $this->client = new AipHttpClient();
        $this->version = '1_6_4';
    }

    /**
     * 查看版本
     * @return string
     *
     */
    public function getVersion() {
        return $this->version;
    }

    /**
     * 连接超时
     * @param int $ms 毫秒
     */
    public function setConnectionTimeoutInMillis($ms) {
        $this->client->setConnectionTimeoutInMillis($ms);
    }

    /**
     * 响应超时
     * @param int $ms 毫秒
     */
    public function setSocketTimeoutInMillis($ms) {
        $this->client->setSocketTimeoutInMillis($ms);
    }

    /**
     * 处理请求参数
     * @param  string $url
     * @param array $params
     * @param array $data
     * @param array $headers
     */
    protected function proccessRequest($url, &$params, &$data, $headers) {
        $params['aipSdk'] = 'php';
        $params['aipSdkVersion'] = $this->version;
    }

    /**
     * Api 请求
     * @param  string $url
     * @param  mixed $data
     * @return mixed
     */
    protected function request($url, $data, $headers = []) {
        try {
            $result = $this->validate($url, $data);
            if ($result !== true) {
                return $result;
            }

            $params = [];
            $authObj = $this->auth();

            if ($this->isCloudUser === false) {
                $params['access_token'] = $authObj['access_token'];
            }

            // 特殊处理
            $this->proccessRequest($url, $params, $data, $headers);

            $headers = $this->getAuthHeaders('POST', $url, $params, $headers);
            $response = $this->client->post($url, $data, $params, $headers);

            $obj = $this->proccessResult($response['content']);

            if (!$this->isCloudUser && isset($obj['error_code']) && $obj['error_code'] == 110) {
                $authObj = $this->auth(true);
                $params['access_token'] = $authObj['access_token'];
                $response = $this->client->post($url, $data, $params, $headers);
                $obj = $this->proccessResult($response['content']);
            }

            if (empty($obj) || !isset($obj['error_code'])) {
                $this->writeAuthObj($authObj);
            }
        } catch (Exception $e) {
            return [
                'error_code' => 'SDK108',
                'error_msg' => 'connection or read data timeout',
            ];
        }

        return $obj;
    }

    /**
     * Api 多个并发请求
     * @param  string $url
     * @param  mixed $data
     * @return mixed
     */
    protected function multiRequest($url, $data) {
        try {
            $params = [];
            $authObj = $this->auth();
            $headers = $this->getAuthHeaders('POST', $url);

            if ($this->isCloudUser === false) {
                $params['access_token'] = $authObj['access_token'];
            }

            $responses = $this->client->multiPost($url, $data, $params, $headers);

            $is_success = false;
            foreach ($responses as $response) {
                $obj = $this->proccessResult($response['content']);

                if (empty($obj) || !isset($obj['error_code'])) {
                    $is_success = true;
                }

                if (!$this->isCloudUser && isset($obj['error_code']) && $obj['error_code'] == 110) {
                    $authObj = $this->auth(true);
                    $params['access_token'] = $authObj['access_token'];
                    $responses = $this->client->post($url, $data, $params, $headers);
                    break;
                }
            }

            if ($is_success) {
                $this->writeAuthObj($authObj);
            }

            $objs = [];
            foreach ($responses as $response) {
                $objs[] = $this->proccessResult($response['content']);
            }

        } catch (Exception $e) {
            return [
                'error_code' => 'SDK108',
                'error_msg' => 'connection or read data timeout',
            ];
        }

        return $objs;
    }

    /**
     * 格式检查
     * @param  string $url
     * @param  array $data
     * @return mix
     */
    protected function validate($url, &$data) {
        return true;
    }

    /**
     * 格式化结果
     * @param $content string
     * @return mixed
     */
    protected function proccessResult($content) {
        return json_decode($content, true);
    }

    /**
     * 返回 access token 路径
     * @return string
     */
    private function getAuthFilePath() {
        return CACHE_PATH . DIRECTORY_SEPARATOR . md5($this->apiKey);
    }

    /**
     * 写入本地文件
     * @param  array $obj
     * @return void
     */
    private function writeAuthObj($obj) {
        if ($obj === null || (isset($obj['is_read']) && $obj['is_read'] === true)) {
            return;
        }

        $obj['time'] = time();
        $obj['is_cloud_user'] = $this->isCloudUser;
        @file_put_contents($this->getAuthFilePath(), json_encode($obj));
    }

    /**
     * 读取本地缓存
     * @return array
     */
    private function readAuthObj() {
        $content = @file_get_contents($this->getAuthFilePath());
        if ($content !== false) {
            $obj = json_decode($content, true);
            $this->isCloudUser = $obj['is_cloud_user'];
            $obj['is_read'] = true;
            if ($this->isCloudUser || $obj['time'] + $obj['expires_in'] - 30 > time()) {
                return $obj;
            }
        }

        return null;
    }

    /**
     * 认证
     * @param bool $refresh 是否刷新
     * @return array
     */
    private function auth($refresh = false) {

        //非过期刷新
        if (!$refresh) {
            $obj = $this->readAuthObj();
            if (!empty($obj)) {
                return $obj;
            }
        }

        $response = $this->client->get($this->accessTokenUrl, [
            'grant_type' => 'client_credentials',
            'client_id' => $this->apiKey,
            'client_secret' => $this->secretKey,
        ]);

        $obj = json_decode($response['content'], true);

        $this->isCloudUser = !$this->isPermission($obj);
        return $obj;
    }

    /**
     * 判断认证是否有权限
     * @param  array   $authObj
     * @return boolean
     */
    protected function isPermission($authObj) {
        if (empty($authObj) || !isset($authObj['scope'])) {
            return false;
        }

        $scopes = explode(' ', $authObj['scope']);

        return in_array($this->scope, $scopes);
    }

    /**
     * @param  string $method HTTP method
     * @param  string $url
     * @param  array $param 参数
     * @return array
     */
    private function getAuthHeaders($method, $url, $params = [], $headers = []) {

        //不是云的老用户则不用在header中签名 认证
        if ($this->isCloudUser === false) {
            return $headers;
        }

        $obj = parse_url($url);
        if (!empty($obj['query'])) {
            foreach (explode('&', $obj['query']) as $kv) {
                if (!empty($kv)) {
                    list($k, $v) = explode('=', $kv, 2);
                    $params[$k] = $v;
                }
            }
        }

        //UTC 时间戳
        $timestamp = gmdate('Y-m-d\TH:i:s\Z');
        $headers['Host'] = isset($obj['port']) ? sprintf('%s:%s', $obj['host'], $obj['port']) : $obj['host'];
        $headers['x-bce-date'] = $timestamp;

        //签名
        $headers['authorization'] = AipSampleSigner::sign([
            'ak' => $this->apiKey,
            'sk' => $this->secretKey,
        ], $method, $obj['path'], $headers, $params, [
            'timestamp' => $timestamp,
            'headersToSign' => array_keys($headers),
        ]);

        return $headers;
    }

}
/**
 * BCE Util
 */
class AipHttpUtil {
    // 根据RFC 3986，除了：
    //   1.大小写英文字符
    //   2.阿拉伯数字
    //   3.点'.'、波浪线'~'、减号'-'以及下划线'_'
    // 以外都要编码
    /**
     * @var mixed
     */
    public static $PERCENT_ENCODED_STRINGS;

    //填充编码数组
    public static function __init() {
        AipHttpUtil::$PERCENT_ENCODED_STRINGS = [];
        for ($i = 0; $i < 256; ++$i) {
            AipHttpUtil::$PERCENT_ENCODED_STRINGS[$i] = sprintf("%%%02X", $i);
        }

        //a-z不编码
        foreach (range('a', 'z') as $ch) {
            AipHttpUtil::$PERCENT_ENCODED_STRINGS[ord($ch)] = $ch;
        }

        //A-Z不编码
        foreach (range('A', 'Z') as $ch) {
            AipHttpUtil::$PERCENT_ENCODED_STRINGS[ord($ch)] = $ch;
        }

        //0-9不编码
        foreach (range('0', '9') as $ch) {
            AipHttpUtil::$PERCENT_ENCODED_STRINGS[ord($ch)] = $ch;
        }

        //以下4个字符不编码
        AipHttpUtil::$PERCENT_ENCODED_STRINGS[ord('-')] = '-';
        AipHttpUtil::$PERCENT_ENCODED_STRINGS[ord('.')] = '.';
        AipHttpUtil::$PERCENT_ENCODED_STRINGS[ord('_')] = '_';
        AipHttpUtil::$PERCENT_ENCODED_STRINGS[ord('~')] = '~';
    }

    /**
     * 在uri编码中不能对'/'编码
     * @param  string $path
     * @return string
     */
    public static function urlEncodeExceptSlash($path) {
        return str_replace("%2F", "/", AipHttpUtil::urlEncode($path));
    }

    /**
     * 使用编码数组编码
     * @param  string $path
     * @return string
     */
    public static function urlEncode($value) {
        $result = '';
        for ($i = 0; $i < strlen($value); ++$i) {
            $result .= AipHttpUtil::$PERCENT_ENCODED_STRINGS[ord($value[$i])];
        }
        return $result;
    }

    /**
     * 生成标准化QueryString
     * @param  array $parameters
     * @return array
     */
    public static function getCanonicalQueryString(array $parameters) {
        //没有参数，直接返回空串
        if (count($parameters) == 0) {
            return '';
        }

        $parameterStrings = [];
        foreach ($parameters as $k => $v) {
            //跳过Authorization字段
            if (strcasecmp('Authorization', $k) == 0) {
                continue;
            }
            if (!isset($k)) {
                throw new \InvalidArgumentException(
                    "parameter key should not be null"
                );
            }
            if (isset($v)) {
                //对于有值的，编码后放在=号两边
                $parameterStrings[] = AipHttpUtil::urlEncode($k)
                . '=' . AipHttpUtil::urlEncode((string) $v);
            } else {
                //对于没有值的，只将key编码后放在=号的左边，右边留空
                $parameterStrings[] = AipHttpUtil::urlEncode($k) . '=';
            }
        }
        //按照字典序排序
        sort($parameterStrings);

        //使用'&'符号连接它们
        return implode('&', $parameterStrings);
    }

    /**
     * 生成标准化uri
     * @param  string $path
     * @return string
     */
    public static function getCanonicalURIPath($path) {
        //空路径设置为'/'
        if (empty($path)) {
            return '/';
        } else {
            //所有的uri必须以'/'开头
            if ($path[0] == '/') {
                return AipHttpUtil::urlEncodeExceptSlash($path);
            } else {
                return '/' . AipHttpUtil::urlEncodeExceptSlash($path);
            }
        }
    }

    /**
     * 生成标准化http请求头串
     * @param  array $headers
     * @return array
     */
    public static function getCanonicalHeaders($headers) {
        //如果没有headers，则返回空串
        if (count($headers) == 0) {
            return '';
        }

        $headerStrings = [];
        foreach ($headers as $k => $v) {
            //跳过key为null的
            if ($k === null) {
                continue;
            }
            //如果value为null，则赋值为空串
            if ($v === null) {
                $v = '';
            }
            //trim后再encode，之后使用':'号连接起来
            $headerStrings[] = AipHttpUtil::urlEncode(strtolower(trim($k))) . ':' . AipHttpUtil::urlEncode(trim($v));
        }
        //字典序排序
        sort($headerStrings);

        //用'\n'把它们连接起来
        return implode("\n", $headerStrings);
    }
}

class AipSignOption {
    const EXPIRATION_IN_SECONDS = 'expirationInSeconds';

    const HEADERS_TO_SIGN = 'headersToSign';

    const TIMESTAMP = 'timestamp';

    const DEFAULT_EXPIRATION_IN_SECONDS = 1800;

    const MIN_EXPIRATION_IN_SECONDS = 300;

    const MAX_EXPIRATION_IN_SECONDS = 129600;
}

class AipSampleSigner {

    const BCE_AUTH_VERSION = "bce-auth-v1";
    const BCE_PREFIX = 'x-bce-';

    //不指定headersToSign情况下，默认签名http头，包括：
    //    1.host
    //    2.content-length
    //    3.content-type
    //    4.content-md5
    /**
     * @var mixed
     */
    public static $defaultHeadersToSign;

    public static function __init() {
        AipSampleSigner::$defaultHeadersToSign = [
            "host",
            "content-length",
            "content-type",
            "content-md5",
        ];
    }

    /**
     * 签名
     * @param  array $credentials
     * @param  string $httpMethod
     * @param  string $path
     * @param  array  $headers
     * @param  string $params
     * @param  array  $options
     * @return string
     */
    public static function sign(
        array $credentials,
        $httpMethod,
        $path,
        $headers,
        $params,
        $options = []
    ) {
        //设定签名有效时间
        if (!isset($options[AipSignOption::EXPIRATION_IN_SECONDS])) {
            //默认值1800秒
            $expirationInSeconds = AipSignOption::DEFAULT_EXPIRATION_IN_SECONDS;
        } else {
            $expirationInSeconds = $options[AipSignOption::EXPIRATION_IN_SECONDS];
        }

        //解析ak sk
        $accessKeyId = $credentials['ak'];
        $secretAccessKey = $credentials['sk'];

        //设定时间戳，注意：如果自行指定时间戳需要为UTC时间
        if (!isset($options[AipSignOption::TIMESTAMP])) {
            //默认值当前时间
            $timestamp = gmdate('Y-m-d\TH:i:s\Z');
        } else {
            $timestamp = $options[AipSignOption::TIMESTAMP];
        }

        //生成authString
        $authString = AipSampleSigner::BCE_AUTH_VERSION . '/' . $accessKeyId . '/'
            . $timestamp . '/' . $expirationInSeconds;

        //使用sk和authString生成signKey
        $signingKey = hash_hmac('sha256', $authString, $secretAccessKey);

        //生成标准化URI
        $canonicalURI = AipHttpUtil::getCanonicalURIPath($path);

        //生成标准化QueryString
        $canonicalQueryString = AipHttpUtil::getCanonicalQueryString($params);

        //填充headersToSign，也就是指明哪些header参与签名
        $headersToSign = null;
        if (isset($options[AipSignOption::HEADERS_TO_SIGN])) {
            $headersToSign = $options[AipSignOption::HEADERS_TO_SIGN];
        }

        //生成标准化header
        $canonicalHeader = AipHttpUtil::getCanonicalHeaders(
            AipSampleSigner::getHeadersToSign($headers, $headersToSign)
        );

        //整理headersToSign，以';'号连接
        $signedHeaders = '';
        if ($headersToSign !== null) {
            $signedHeaders = strtolower(
                trim(implode(";", $headersToSign))
            );
        }

        //组成标准请求串
        $canonicalRequest = "$httpMethod\n$canonicalURI\n"
            . "$canonicalQueryString\n$canonicalHeader";

        //使用signKey和标准请求串完成签名
        $signature = hash_hmac('sha256', $canonicalRequest, $signingKey);

        //组成最终签名串
        $authorizationHeader = "$authString/$signedHeaders/$signature";

        return $authorizationHeader;
    }

    /**
     * 根据headsToSign过滤应该参与签名的header
     * @param  array $headers
     * @param  array $headersToSign
     * @return array
     */
    public static function getHeadersToSign($headers, $headersToSign) {

        //value被trim后为空串的header不参与签名
        $filter_empty = function ($v) {
            return trim((string) $v) !== '';
        };
        $headers = array_filter($headers, $filter_empty);

        //处理headers的key：去掉前后的空白并转化成小写
        $trim_and_lower = function ($str) {
            return strtolower(trim($str));
        };
        $temp = [];
        $process_keys = function ($k, $v) use (&$temp, $trim_and_lower) {
            $temp[$trim_and_lower($k)] = $v;
        };
        array_map($process_keys, array_keys($headers), $headers);
        $headers = $temp;

        //取出headers的key以备用
        $header_keys = array_keys($headers);

        $filtered_keys = null;
        if ($headersToSign !== null) {
            //如果有headersToSign，则根据headersToSign过滤

            //预处理headersToSign：去掉前后的空白并转化成小写
            $headersToSign = array_map($trim_and_lower, $headersToSign);

            //只选取在headersToSign里面的header
            $filtered_keys = array_intersect_key($header_keys, $headersToSign);

        } else {
            //如果没有headersToSign，则根据默认规则来选取headers
            $filter_by_default = function ($k) {
                return AipSampleSigner::isDefaultHeaderToSign($k);
            };
            $filtered_keys = array_filter($header_keys, $filter_by_default);
        }

        //返回需要参与签名的header
        return array_intersect_key($headers, array_flip($filtered_keys));
    }

    /**
     * 检查header是不是默认参加签名的：
     * 1.是host、content-type、content-md5、content-length之一
     * 2.以x-bce开头
     * @param  array $header
     * @return boolean
     */
    public static function isDefaultHeaderToSign($header) {
        $header = strtolower(trim($header));
        if (in_array($header, AipSampleSigner::$defaultHeadersToSign)) {
            return true;
        }
        return substr_compare($header, AipSampleSigner::BCE_PREFIX, 0, strlen(AipSampleSigner::BCE_PREFIX)) == 0;
    }
}
