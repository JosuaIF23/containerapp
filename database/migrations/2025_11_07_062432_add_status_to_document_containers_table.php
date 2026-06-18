<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('document_containers', function (Blueprint $table) {
            if (! Schema::hasColumn('document_containers', 'status')) {
                $table->string('status')->default('Pending')->after('file_path');
            }
        });
    }

    public function down(): void
    {
        Schema::table('document_containers', function (Blueprint $table) {
            if (Schema::hasColumn('document_containers', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
