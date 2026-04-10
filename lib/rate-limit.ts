// In-memory sliding window rate limiter.
// Works for single-server deployments. For multi-instance/edge, replace the
// store with a shared backend (e.g. Redis via @upstash/ratelimit).

type Window = { count: number; resetAt: number }

const store = new Map<string, Window>()

export function checkRateLimit(
    key: string,
    limit = 5,
    windowMs = 15 * 60 * 1000
): { limited: boolean; resetAt: number } {
    const now = Date.now()
    const entry = store.get(key)

    if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + windowMs })
        return { limited: false, resetAt: now + windowMs }
    }

    entry.count++
    return { limited: entry.count > limit, resetAt: entry.resetAt }
}
