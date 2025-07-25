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
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('google_calendar_event_id')->nullable();
            $table->string('name');

            $table->string('description')->nullable();
            $table->string('colorId')->nullable();
            $table->dateTime('startDateTime');
            $table->dateTime('endDateTime');
            $table->string('attendees')->nullable();
            $table->dateTime('startDateAudit')->nullable();
            $table->dateTime('endDateAudit')->nullable();

            // timestamps, soft deletes
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
