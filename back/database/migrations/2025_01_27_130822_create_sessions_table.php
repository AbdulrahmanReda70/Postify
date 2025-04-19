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
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary(); // Session ID
            $table->unsignedBigInteger('user_id')->nullable(); // User ID (optional)
            $table->text('data')->nullable(); // Data field for session data
            $table->text('payload'); // Serialized session payload
            $table->integer('last_activity'); // Timestamp of last activity
            $table->string('ip_address', 45)->nullable(); // IPv4/IPv6 address
            $table->text('user_agent')->nullable(); // Browser/device details
            $table->timestamps(); // Created and updated timestamps

            // Add foreign key for user_id if applicable
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};
