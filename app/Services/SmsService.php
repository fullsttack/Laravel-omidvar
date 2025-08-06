<?php

namespace App\Services;

use Exception;

class SmsService
{
    private string $apiKey;
    private string $sender;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.kavehnegar.api_key');
        $this->sender = config('services.kavehnegar.sender', '20006535');
        $this->baseUrl = 'http://api.kavenegar.com/v1';
    }

    public function sendVerificationCode(string $mobile, string $code): bool
    {
        $message = "کد تایید شما: {$code}\nاین کد تا 5 دقیقه معتبر است.";
        
        return $this->sendSms($mobile, $message);
    }

    public function sendSms(string $receptor, string $message): bool
    {
        $url = "{$this->baseUrl}/{$this->apiKey}/sms/send.json";
        
        $postData = [
            'receptor' => $receptor,
            'sender' => $this->sender,
            'message' => $message
        ];

        $ch = curl_init();
        
        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($postData),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded',
            ],
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        
        curl_close($ch);

        if ($error) {
            throw new Exception("cURL Error: " . $error);
        }

        if ($httpCode !== 200) {
            throw new Exception("HTTP Error: " . $httpCode);
        }

        $responseData = json_decode($response, true);
        
        if (!$responseData || !isset($responseData['return']['status'])) {
            throw new Exception("Invalid response format");
        }

        return $responseData['return']['status'] == 200;
    }
}