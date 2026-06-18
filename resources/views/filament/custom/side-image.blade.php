@php
    $map = [
        'rear'           => 'rear.png',
        'front'          => 'front.png',
        'right_side'     => 'right_side.png',
        'left_side'      => 'left_side.png',
        'roof'           => 'roof.png',
        'floor'          => 'floor.png',
        'understructure' => 'understructure.png',
    ];

    $file = $map[$side ?? ''] ?? 'default.png';
    $label = $side ? ucwords(str_replace('_', ' ', $side)) : 'Pilih Side';
@endphp

<div class="p-4 bg-gray-100 rounded text-center">
    <img src="{{ asset('images/sides/'.$file) }}" alt="Side preview" class="w-52 mx-auto rounded shadow">
    <p class="mt-2 text-sm text-gray-600">{{ $label }}</p>
</div>
