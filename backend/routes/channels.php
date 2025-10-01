<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

// IMPORTANT: Do NOT prefix channels here with "private-" or "presence-".
// Laravel strips those prefixes before matching against this definition.
Broadcast::channel('user.{id}', function ($user, $id) {

    // Only allow the owner to listen to their own channel
    $authorized = (int) $user->id === (int) $id;
    return $authorized;
});
