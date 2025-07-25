<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('containers', function (Blueprint $table) {
            $table->id();
            $table->string('container_code')->unique();
            $table->string('container_type');
            $table->string('container_size');
            $table->string('container_status'); // e.g., available, in use,  maintenance
            $table->string('location'); // e.g., depot, customer site
            $table->string('color');
            $table->dateTime('last_inspection_date')->nullable();

            $table->softDeletes(); // for soft deletion
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('containers');
    }
};
