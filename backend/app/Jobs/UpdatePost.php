<?php

namespace App\Jobs;

use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Services\ImageResizer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class UpdatePost implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private Post $post,
        private string $title,
        private string $body,
        private ?string $imagePath,
        private ?string $oldImagePath
    ) {}

    public static function fromRequest(UpdatePostRequest $request, Post $post)
    {
        $imagePath = null;
        $oldImagePath = null;

        if ($request->hasFile('image')) {
            // Store the old image path for deletion
            $oldImagePath = $post->image;

            // Get the uploaded image and process it
            $image = $request->file('image');
            $imagePath = $image->store('posts/images', config('filesystems.default'));
        }

        return new self(
            $post,
            $request->title,
            $request->body,
            $imagePath,
            $oldImagePath
        );
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $data = [
            'title' => $this->title,
            'body' => $this->body,
        ];

        // Add image path if a new image was uploaded
        if ($this->imagePath !== null) {
            $data['image'] = $this->imagePath;

            // Delete the old image if it exists
            if ($this->oldImagePath) {
                Storage::disk(config('filesystems.default'))->delete($this->oldImagePath);
            }
        }

        $this->post->update($data);
    }
}
