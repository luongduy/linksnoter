<?php

namespace App\Repositories;

use App\Tag;

class TagRepository
{
    /**
     * Get all of the tags
     *
     * @param  none
     * @return Collection
     */
    
    public function getAllTags() {
        return Tag::all();
    }
    public function getTagByName($name) {
        return Tag::where('name', $name)->first();
    }
}
