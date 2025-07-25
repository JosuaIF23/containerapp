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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('status');
            $table->string('location');
            $table->string('next_inspection_at');
            $table->string('next_maintenance_at');
            $table->string('inspector_name');
            $table->string('container_id');
            $table->string('inspektor_id');
            $table->string('schedule_id');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
