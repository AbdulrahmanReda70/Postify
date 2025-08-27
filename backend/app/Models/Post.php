<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'title', 'body', 'image'];
    protected $appends = ['likes_count', 'is_saved', 'image_url'];

    public function getIsSavedAttribute()
    {
        return $this->savedByUsers()->where('user_id', Auth::id())->exists();
    }

    public function getLikesCountAttribute()
    {
        return $this->likedByUsers()->count();
    }

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        // Always use public disk for URL generation since that's web-accessible
        $url = Storage::disk('public')->url($this->image);

        // If URL is relative (starts with /), make it absolute
        if (str_starts_with($url, '/')) {
            return config('app.url') . $url;
        }

        return $url;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'saved_posts')->withTimestamps();
    }

    public function likedByUsers()
    {
        return $this->belongsToMany(User::class, 'liked_posts')->withTimestamps();
    }

    static public function getHomePosts()
    {
        return Post::with('user')
            ->withExists([
                'savedByUsers as is_saved' => fn($q) => $q->where('user_id', Auth::id())
            ])
            ->latest()
            ->paginate(5);
    }

    public function scopeForAuthenticatedUser($query)
    {
        return $query->where('user_id', Auth::id())
            ->withExists('savedByUsers as is_saved')
            ->latest();
    }
}
