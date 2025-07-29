<?php

namespace App\Jobs;

use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use App\Models\User;
use App\Services\ImageResizer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Auth;

class CreatePost implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct
    (
        private string $title,
        private string $body,
        private ?string $imagePath,

    ){}

    public static function fromRequest(StorePostRequest $request){

        $imagePath = null;

        if ($request->hasFile('image')) {
            // Get the uploaded image
            $image = $request->file('image');
            $imagePath = $image->store('posts/images', config('filesystems.default'));
        }

        return new self(
            $request->title,
            $request->body,
            $imagePath
        );
    }

    /**
     * Execute the job.
     */
    public function handle(): void
{


    Post::create([
        'user_id' => Auth::id(),
        'title' => $this->title,
        'body' => $this->body,
    ]);
}

}
