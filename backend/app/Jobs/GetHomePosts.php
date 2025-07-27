<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class GetHomePosts implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        $page = request()->get('page', 1);
        $home_posts = Cache::remember('home_posts_page_' . $page, now()->addMinutes(10), function () {
            // Log::info('Querying posts from DB');
            return Post::with('user')
                ->withExists([
                    'savedByUsers as is_saved' => fn($q) => $q->where('user_id', Auth::id())
                ])
                ->latest()
                ->paginate(5);
        });

        $posts = $home_posts->getCollection()->slice(1)->values();
        foreach ($posts as $p) {
            $p['section'] = 'home';
            $p['canUpdate'] = Gate::allows('canEdit', $p);
        }

        $home_posts = $home_posts->setCollection($posts);
        return response()->json(['posts' => $home_posts], 200);
    }
}
