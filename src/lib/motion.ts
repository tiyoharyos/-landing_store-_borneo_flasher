/**
 * Token animasi bersama supaya "rasa" gerakan konsisten di seluruh app
 * (satu kurva easing, bukan campur-campur cubic-bezier di tiap komponen).
 *
 * EASE_SMOOTH: kurva "ease-out" lembut — cepat di awal, mendarat halus di
 * akhir. Dipakai untuk elemen yang MASUK (fade in, page transition, grid).
 * EASE_POP: kurva dengan sedikit overshoot-feel di akhir — dipakai untuk
 * panel kecil yang "muncul" (dropdown, modal, popover).
 */
export const EASE_SMOOTH = [0.22, 1, 0.36, 1] as const;
export const EASE_POP = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.18,
  base: 0.28,
  slow: 0.4,
} as const;
