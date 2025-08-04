<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'created_at' => $this->created_at->diffForHumans(),
            'user_id' => $this->user_id,
            'post_id' => $this->post_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'likes' => $this->likes ?? 0,
            'dislikes' => $this->dislikes ?? 0,
            'celebrates' => $this->celebrates ?? 0,
            'loves' => $this->loves ?? 0,
            'auth_reacted' => $this->reactions
                ->where('user_id', Auth::id())
                ->first()?->reaction_type
        ];
    }
}
