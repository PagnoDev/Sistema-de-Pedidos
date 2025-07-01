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
        Schema::create('itens_pedido', function (Blueprint $table) {
            $table->id();
            $table->integer('quantidade');
            $table->decimal('preco_unitario_no_momento_da_compra', 10, 2);
            $table->timestamps();
            
            $table->foreignUuid('id_pedido')->constrained('pedidos')->onDelete('cascade');
            $table->foreignId('id_produto')->constrained('produtos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itens_pedido');
    }
};
