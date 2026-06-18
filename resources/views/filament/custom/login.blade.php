@php
    $passwordResetUrl = filament()->hasPasswordReset() ? filament()->getRequestPasswordResetUrl() : null;
    $errorMessage = $errors->first('data.email');
@endphp

@push('styles')
    <style>
        .fi-body.fi-panel-admin {
            background:
                radial-gradient(circle at top left, rgba(255, 255, 255, 0.88), transparent 28%),
                radial-gradient(circle at 82% 20%, rgba(199, 219, 255, 0.66), transparent 24%),
                linear-gradient(180deg, #edf3ff 0%, #e8effc 100%);
        }

        .skpti-login-page {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            padding: 2rem 1rem;
        }

        .skpti-login-page::before,
        .skpti-login-page::after {
            content: "";
            position: absolute;
            border-radius: 999px;
            filter: blur(60px);
            pointer-events: none;
            opacity: 0.72;
        }

        .skpti-login-page::before {
            top: 4rem;
            left: 8%;
            width: 16rem;
            height: 16rem;
            background: rgba(255, 255, 255, 0.9);
        }

        .skpti-login-page::after {
            right: 10%;
            bottom: 6rem;
            width: 20rem;
            height: 20rem;
            background: rgba(197, 220, 255, 0.78);
        }

        .skpti-login-wrap {
            position: relative;
            z-index: 1;
            display: flex;
            min-height: calc(100vh - 4rem);
            align-items: center;
            justify-content: center;
        }

        .skpti-login-card {
            position: relative;
            width: min(100%, 48rem);
            border-radius: 2.25rem;
            padding: 10.75rem 3.5rem 3.25rem;
            background: linear-gradient(180deg, rgba(238, 244, 255, 0.92) 0%, rgba(233, 240, 253, 0.97) 100%);
            backdrop-filter: blur(16px);
            box-shadow:
                0 24px 55px rgba(180, 197, 230, 0.5),
                inset 10px 10px 24px rgba(213, 223, 244, 0.95),
                inset -10px -10px 24px rgba(255, 255, 255, 0.92);
        }

        .skpti-login-badge-shell {
            position: absolute;
            left: 50%;
            top: -2.6rem;
            transform: translateX(-50%);
            display: grid;
            place-items: center;
            width: 10.75rem;
            height: 10.75rem;
            border-radius: 999px;
            background: linear-gradient(145deg, #edf4ff 0%, #dbe6fb 100%);
            box-shadow:
                0 18px 40px rgba(180, 197, 230, 0.45),
                inset 10px 10px 24px rgba(209, 220, 243, 0.9),
                inset -10px -10px 24px rgba(255, 255, 255, 0.9);
        }

        .skpti-login-badge {
            display: grid;
            place-items: center;
            width: 7.9rem;
            height: 7.9rem;
            padding: 0.2rem;
            border-radius: 999px;
            background: linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
            box-shadow:
                0 10px 22px rgba(190, 203, 233, 0.42),
                inset 6px 6px 14px rgba(245, 248, 255, 0.95),
                inset -8px -8px 16px rgba(229, 237, 252, 0.9);
        }

        .skpti-login-badge img {
            width: 108%;
            height: 108%;
            object-fit: contain;
            transform: translateY(1px);
            filter: drop-shadow(0 8px 18px rgba(48, 111, 164, 0.18));
        }

        .skpti-login-header {
            text-align: center;
            max-width: 33rem;
            margin: 0 auto;
        }

        .skpti-login-title {
            margin: 0 auto;
            color: #111827;
            max-width: 28rem;
            font-size: clamp(1.85rem, 3.2vw, 2.7rem);
            font-weight: 800;
            line-height: 1.08;
            letter-spacing: -0.04em;
            text-wrap: balance;
        }

        .skpti-login-subtitle {
            max-width: 26rem;
            margin: 0.65rem auto 0;
            color: #b6c3e4;
            font-size: clamp(1rem, 2vw, 1.25rem);
            font-weight: 700;
            letter-spacing: -0.02em;
            line-height: 1.3;
        }

        .skpti-login-form {
            margin-top: 2.9rem;
        }

        .skpti-login-alert {
            margin-bottom: 1rem;
            border-radius: 1.2rem;
            padding: 0.95rem 1.15rem;
            color: #8f3959;
            background: rgba(255, 241, 245, 0.95);
            box-shadow:
                inset 4px 4px 10px rgba(238, 208, 217, 0.7),
                inset -4px -4px 10px rgba(255, 255, 255, 0.85);
        }

        .skpti-login-fields {
            display: grid;
            gap: 1.8rem;
        }

        .skpti-login-field {
            display: flex;
            align-items: center;
            gap: 1rem;
            min-height: 7rem;
            padding: 0 1.7rem;
            border-radius: 1.55rem;
            background: linear-gradient(180deg, #edf4ff 0%, #e8f0ff 100%);
            box-shadow:
                inset 10px 10px 18px rgba(213, 223, 244, 0.92),
                inset -10px -10px 18px rgba(255, 255, 255, 0.92),
                0 12px 24px rgba(198, 210, 236, 0.28);
        }

        .skpti-login-icon {
            width: 2rem;
            height: 2rem;
            flex: 0 0 auto;
            color: #bbc8e8;
        }

        .skpti-login-input {
            width: 100%;
            border: none;
            background: transparent;
            color: #6480bb;
            font-size: 1.55rem;
            font-weight: 600;
            line-height: 1.2;
            outline: none;
            box-shadow: none;
        }

        .skpti-login-input::placeholder {
            color: #bdc9e8;
        }

        .skpti-login-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            margin-top: 1.8rem;
            margin-bottom: 2rem;
        }

        .skpti-login-remember {
            display: inline-flex;
            align-items: center;
            gap: 0.9rem;
            color: #93a7d6;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            user-select: none;
        }

        .skpti-login-checkbox {
            width: 2.15rem;
            height: 2.15rem;
            margin: 0;
            border: none;
            border-radius: 0.8rem;
            background: linear-gradient(180deg, #edf4ff 0%, #e6eeff 100%);
            box-shadow:
                inset 6px 6px 12px rgba(215, 225, 245, 0.92),
                inset -6px -6px 12px rgba(255, 255, 255, 0.96),
                0 8px 16px rgba(196, 209, 236, 0.32);
            appearance: none;
            -webkit-appearance: none;
            cursor: pointer;
            position: relative;
        }

        .skpti-login-checkbox:checked {
            background: linear-gradient(145deg, #39b6d3 0%, #2a9bbf 100%);
            box-shadow:
                0 12px 22px rgba(53, 173, 213, 0.28),
                inset 3px 3px 9px rgba(77, 200, 230, 0.42),
                inset -3px -3px 9px rgba(31, 126, 160, 0.28);
        }

        .skpti-login-checkbox:checked::after {
            content: "";
            position: absolute;
            inset: 0;
            margin: auto;
            width: 0.65rem;
            height: 1.05rem;
            border-right: 0.18rem solid #ffffff;
            border-bottom: 0.18rem solid #ffffff;
            transform: rotate(42deg) translate(-0.08rem, -0.06rem);
        }

        .skpti-login-forgot {
            color: #2795be;
            font-size: 1rem;
            font-weight: 800;
            text-decoration: none;
        }

        .skpti-login-submit {
            width: 100%;
            border: none;
            border-radius: 1.55rem;
            padding: 1.5rem 1.6rem;
            color: #ffffff;
            font-size: 1.55rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #42bbde 0%, #2e98bb 100%);
            box-shadow:
                0 22px 40px rgba(67, 169, 202, 0.28),
                inset 4px 4px 10px rgba(118, 220, 245, 0.28),
                inset -4px -4px 10px rgba(35, 123, 156, 0.18);
            transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
        }

        .skpti-login-submit:hover {
            transform: translateY(-1px);
            filter: brightness(1.03);
        }

        .skpti-login-submit:disabled {
            cursor: wait;
            opacity: 0.8;
        }

        .skpti-login-submit-label {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.85rem;
        }

        .skpti-login-submit-arrow {
            font-size: 1.7rem;
            line-height: 1;
        }

        @media (max-width: 640px) {
            .skpti-login-page {
                padding: 1rem 0.85rem;
            }

            .skpti-login-wrap {
                min-height: calc(100vh - 2rem);
            }

            .skpti-login-card {
                padding: 7.9rem 1.35rem 1.6rem;
                border-radius: 1.7rem;
            }

            .skpti-login-badge-shell {
                top: -1.55rem;
                width: 8.5rem;
                height: 8.5rem;
            }

            .skpti-login-badge {
                width: 6.15rem;
                height: 6.15rem;
                padding: 0.15rem;
            }

            .skpti-login-header {
                max-width: 100%;
            }

            .skpti-login-title {
                max-width: 100%;
                font-size: 1.65rem;
                line-height: 1.12;
            }

            .skpti-login-subtitle {
                max-width: 100%;
                font-size: 0.95rem;
            }

            .skpti-login-field {
                min-height: 5.25rem;
                padding: 0 1.15rem;
                gap: 0.85rem;
            }

            .skpti-login-icon {
                width: 1.6rem;
                height: 1.6rem;
            }

            .skpti-login-input {
                font-size: 1.2rem;
            }

            .skpti-login-meta {
                flex-wrap: wrap;
            }

            .skpti-login-submit {
                padding: 1.25rem 1.1rem;
                font-size: 1.35rem;
            }
        }
    </style>
@endpush

<div class="skpti-login-page">
    <div class="skpti-login-wrap">
        <section class="skpti-login-card" aria-labelledby="skpti-login-title">
            <div class="skpti-login-badge-shell" aria-hidden="true">
                <div class="skpti-login-badge">
                    <img src="{{ asset('images/sides/LOGO_GIFT.png') }}" alt="GIFT Logo" />
                </div>
            </div>

            <header class="skpti-login-header">
                <h1 class="skpti-login-title" id="skpti-login-title">Sistem Kelayakan Peti Kemas Terintegrasi</h1>
                <p class="skpti-login-subtitle">PT. Global Forensik Inspeksi Teknik</p>
            </header>

            <form class="skpti-login-form" wire:submit="authenticate" novalidate>
                @if (filled($errorMessage))
                    <div class="skpti-login-alert" role="alert">
                        {{ $errorMessage }}
                    </div>
                @endif

                <div class="skpti-login-fields">
                    <label class="skpti-login-field">
                        <svg class="skpti-login-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" stroke="currentColor" stroke-width="1.8"/>
                            <path d="m5 7 7 5 7-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                        <input
                            class="skpti-login-input"
                            type="email"
                            wire:model.defer="data.email"
                            autocomplete="username email"
                            placeholder="Email address"
                            required
                        />
                    </label>

                    <label class="skpti-login-field">
                        <svg class="skpti-login-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M8 10V8a4 4 0 1 1 8 0v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                            <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="currentColor" stroke-width="1.8"/>
                        </svg>

                        <input
                            class="skpti-login-input"
                            type="password"
                            wire:model.defer="data.password"
                            autocomplete="current-password"
                            placeholder="Password"
                            required
                        />
                    </label>
                </div>

                <div class="skpti-login-meta">
                    <label class="skpti-login-remember">
                        <input class="skpti-login-checkbox" type="checkbox" wire:model.defer="data.remember" />
                        <span>Remember me</span>
                    </label>

                    @if (filled($passwordResetUrl))
                        <a class="skpti-login-forgot" href="{{ $passwordResetUrl }}" wire:navigate>Forgot?</a>
                    @else
                        <span class="skpti-login-forgot">Forgot?</span>
                    @endif
                </div>

                <button class="skpti-login-submit" type="submit" wire:loading.attr="disabled" wire:target="authenticate">
                    <span class="skpti-login-submit-label" wire:loading.remove wire:target="authenticate">
                        <span>Masuk</span>
                        <span class="skpti-login-submit-arrow" aria-hidden="true">&rarr;</span>
                    </span>

                    <span wire:loading wire:target="authenticate">Memproses...</span>
                </button>
            </form>
        </section>
    </div>
</div>
