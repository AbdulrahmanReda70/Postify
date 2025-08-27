<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Services\Users\UserAuthService;
use Illuminate\Http\Request;


class RegisterController extends Controller
{
    public function register(RegisterRequest $request, UserAuthService $authService)
    {
        $data = $request->only(['email', 'username', 'password', 'gender']);
        $result = $authService->register($data);

        if (isset($result['error'])) {
            return response()->json(['error' => $result['error']], $result['code'] ?? 400);
        }

        return response()->json($result);
    }
}
