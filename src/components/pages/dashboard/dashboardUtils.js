import dayjs from "dayjs";
import encryptedAxios from "../../../services/encryptedAxios";
import { ACCESS_TOKEN } from "../../../helpers/Constant";

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authHeader = () => ({
    "x-auth-token": localStorage.getItem(ACCESS_TOKEN) || "",
});

export const apiFetch = async (url, params = {}) => {
    const qs = new URLSearchParams(
        Object.fromEntries(
            Object.entries(params).filter(
                ([, v]) => v !== undefined && v !== ""
            )
        )
    ).toString();
    const res = await encryptedAxios.get(qs ? `${url}?${qs}` : url, {
        headers: authHeader(),
    });
    return res.data;
};

// ── Date ──────────────────────────────────────────────────────────────────────

export const fmt = (d) => dayjs(d).format("YYYY-MM-DD");

// ── Sound ─────────────────────────────────────────────────────────────────────

const _audioCtx = { current: null };

export const playBeep = () => {
    try {
        if (!_audioCtx.current)
            // eslint-disable-next-line
            _audioCtx.current = new (window.AudioContext || window["webkitAudioContext"])();
        const ctx = _audioCtx.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = 520;
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.45);
    } catch (_) {}
};

// ── Numeric helpers ───────────────────────────────────────────────────────────

export const n = (v) => (isNaN(v) || v == null ? 0 : Number(v));
export const cur = (v) => n(v).toFixed(0);
