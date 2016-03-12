<?php
/**
 * CreatedBy: thangcest2@gmail.com
 * Date: 3/12/16
 * Time: 10:41 AM
 */

namespace App\Repositories;


use App\Category;
use App\Note;
use App\User;

class NoteRepository
{
    private static $_instance;

    public static function getInstance() {
        if (self::$_instance === null) {
            self::$_instance = new self();
        }
        return self::$_instance;

    }

    /**
     * @var $user User
     */
    private $user;

    public function setUser(User $user)
    {
        $this->user = $user;
    }

    /**
     * @param $categoryId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function forCategory($categoryId)
    {
        return Note::query()->where('category_id', $categoryId);
    }

    /**
     * @param $id
     * @return Note|false
     */
    public function findOne($id)
    {
        $note = Note::query()->where('id', $id)->first();
        if ($note) {
            /** @var $note Note */
            $category = $note->category()->getResults();
            /** @var $category Category */

            if ($this->user == $category->user()->getResults()) {
                return $note;
            }
        }

        return false;

    }


}