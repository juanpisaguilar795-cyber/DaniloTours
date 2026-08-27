<?php
$brainDir = 'C:\Users\user\.gemini\antigravity-ide\brain\1d785247-f31d-4ced-b817-a15d6a632183';
$images = [
    'monserrate' => 'monserrate.jpg',
    'candelaria' => 'candelaria.jpg',
    'zipaquira' => 'zipaquira.jpg'
];

foreach ($images as $prefix => $destName) {
    $files = glob($brainDir . DIRECTORY_SEPARATOR . $prefix . '_*.jpg');
    if (!empty($files)) {
        $source = $files[0];
        $dest = 'public/images/' . $destName;
        if (copy($source, $dest)) {
            echo "Copied $source to $dest\n";
        } else {
            echo "Failed to copy $source\n";
        }
    } else {
        echo "No file found for prefix $prefix in $brainDir\n";
    }
}
unlink(__FILE__); // Self-delete
