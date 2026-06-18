<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Jika tabel SUDAH ada, jangan create—cukup pastikan kolom2 terbaru ada.
        if (Schema::hasTable('document_containers')) {
            Schema::table('document_containers', function (Blueprint $table) {
                if (!Schema::hasColumn('document_containers', 'side')) {
                    $table->string('side')->nullable()->after('container_id');
                }
                if (!Schema::hasColumn('document_containers', 'section_h')) {
                    $table->string('section_h')->nullable();
                }
                if (!Schema::hasColumn('document_containers', 'section_v')) {
                    $table->string('section_v')->nullable();
                }
                if (!Schema::hasColumn('document_containers', 'combined_section')) {
                    $table->string('combined_section')->nullable();
                }
                if (!Schema::hasColumn('document_containers', 'file_path')) {
                    $table->string('file_path')->nullable();
                }
            });

            return; // Migration dianggap sukses & ditandai "Ran"
        }

        // Jika tabel BELUM ada → buat baru
        Schema::create('document_containers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('container_id')->constrained()->onDelete('cascade');
            $table->string('side')->nullable();
            $table->string('section_h')->nullable();
            $table->string('section_v')->nullable();
            $table->string('combined_section')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_containers');
    }
};
