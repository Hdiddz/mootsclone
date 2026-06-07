<?php

$geminiKey = 'AIzaSyDjZT3eKW0Z9VzNNpXiJ4eUEZEXmS51WOk';
$geminiModel = 'gemini-2.0-flash';
$url = "https://generativelanguage.googleapis.com/v1beta/models/{$geminiModel}:generateContent?key={$geminiKey}";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'contents' => [
        [
            'role' => 'user',
            'parts' => [
                ['text' => 'Hello! Tell me a 1-sentence joke.']
            ]
        ]
    ]
]));

$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

echo "Status: {$status}\n";
echo "Response: {$response}\n";
