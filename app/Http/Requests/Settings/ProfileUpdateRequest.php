<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['nullable', 'string', 'max:255'],
            
            'last_name' => ['nullable', 'string', 'max:255'],
            
            'national_code' => [
                'nullable', 
                'string', 
                'size:10',
                'regex:/^[0-9]{10}$/',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            
            'mobile' => [
                'nullable',
                'string',
                'regex:/^09[0-9]{9}$/',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],

            'email' => [
                'nullable',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }
}
