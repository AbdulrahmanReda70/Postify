<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;

// TODO: this must be inside an async job
class ImageResizer
{
    public function resizeAndConvertToWebP(UploadedFile $image)
    {

        // Create an image resource from the uploaded image (depending on the file type)
        $img = imagecreatefromstring(file_get_contents($image));

        // Get original dimensions
        $originalWidth = imagesx($img);
        $originalHeight = imagesy($img);

        // Resize image to fit within 150x140 while maintaining aspect ratio
        $targetWidth = 300;
        $targetHeight = 280;

        // Calculate aspect ratio
        $aspectRatio = $originalWidth / $originalHeight;

        if ($originalWidth > $originalHeight) {
            $newWidth = $targetWidth;
            $newHeight = round($targetWidth / $aspectRatio);
        } else {
            $newHeight = $targetHeight;
            $newWidth = round($targetHeight * $aspectRatio);
        }

        // Create a new true color image with the target dimensions
        $resizedImg = imagecreatetruecolor($newWidth, $newHeight);

        // Preserve transparency (if applicable)
        if (imagesavealpha($img, true)) {
            imagealphablending($resizedImg, false);
            imagesavealpha($resizedImg, true);
        }

        // Copy and resize the original image into the resized image
        imagecopyresampled($resizedImg, $img, 0, 0, 0, 0, $newWidth, $newHeight, $originalWidth, $originalHeight);

        // Define the path for saving the WebP image
        $webpPath = public_path('storage/posts/' . uniqid() . '.webp');

        // Save the resized image as WebP with better quality
        $quality = 90; // Adjust this value between 0 and 100 for better quality (higher means better quality)
        imagewebp($resizedImg, $webpPath, $quality);

        // Free up memory
        imagedestroy($img);
        imagedestroy($resizedImg);

        // Save the relative path to the WebP image
        return 'posts/' . basename($webpPath);
    }
}
