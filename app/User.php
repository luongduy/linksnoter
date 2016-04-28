<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class User
 * @package App
 *
 * @property integer $id
 * @property string $avatar_path
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string $remember_token
 * @property string $created_at
 * @property string $updated_at
 * @property Collection|Link[] $links
 * @property Collection|Comment[] $comments
 * @property Collection|Vote[] $votes
 * @property Collection|Category[] $categories
 */

class User extends Authenticatable
{
	public function links() {
		return $this->hasMany('App\Link');
	}
    public function comments() {
        return $this->hasMany('App\Comment');
    }
    public function votes() {
        return $this->hasMany('App\Vote');
    }
	public function categories() {
		return $this->hasMany('App\Category');
	}

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'avatar_path',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
}
