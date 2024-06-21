<?php

use Illuminate\Http\Request;
use App\Models\Comercial;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('usuario', 'contraseña');

        if (Auth::guard('comercial')->attempt($credentials)) {
            $comercial = Auth::guard('comercial')->user();
            $token = JWTAuth::fromUser($comercial);

            return response()->json(['token' => $token]);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }
}