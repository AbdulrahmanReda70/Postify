<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'interactions' => [
                ['like' => $this->like],
                ['dislike' => $this->dislike],
                ['love' => $this->love],
                ['celebrate' => $this->celebrate],
            ],
            'created_at' => $this->created_at->diffForHumans(),
            'updated_at' => $this->updated_at->diffForHumans(),
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user'))
        ];
    }
}
