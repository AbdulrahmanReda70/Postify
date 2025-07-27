<?php

namespace App;

interface EventPusher
{
    public function push(string $message): void;
}
