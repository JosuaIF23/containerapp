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
            $table->string('customer')->nullable(); //
            $table->enum('type_survey', ['In-serv','ONH','OFH','Sale']);
            $table->enum('status',['Mty','Full']);
            $table->enum('condition',['DMG','AVL','AR']);
            $table->enum('cleanliness',['dty','ctm']);
            $table->string('location'); // e.g., depot, customer site
            $table->text('survey_location');
            $table->dateTime('date_survey');
            $table->string('container_number')->unique();
            $table->integer('size');
            $table->string('type')->unique();
            $table->string('mgm');
            $table->integer('payload');
            $table->integer('tare');
            $table->integer('cu_cap');
            $table->dateTime('date_manufactured');
            $table->string('csc');
            $table->string('acep');
            $table->string('tct');
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
