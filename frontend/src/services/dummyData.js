/**
 * Dummy / mock data used as fallback when backend APIs are unavailable.
 * This allows the frontend to run in demo mode without a real server.
 */

// ---------------------------------------------------------------------------
// Fake JWT helpers  (admin / admin)
// ---------------------------------------------------------------------------

/**
 * Build a minimal Base64url-encoded JWT so that jwtDecode() works as usual.
 * The token is valid for 24 hours from the moment of creation.
 */
const base64url = (obj) =>
    btoa(JSON.stringify(obj))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

export const createDummyToken = () => {
    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        user_id: 1,
        username: "admin",
        email: "admin@demo.local",
        is_superuser: true,
        is_staff: true,
        exp: now + 86400, // 24 h
        iat: now,
    };
    const sig = "dummysignature";
    return `${base64url(header)}.${base64url(payload)}.${sig}`;
};

// ---------------------------------------------------------------------------
// Dashboard statistics
// ---------------------------------------------------------------------------

export const DUMMY_DASHBOARD_STATS = {
    total_scans: 1284,
    critical_cases: 57,
    reported_errors: 12,
    disease_distribution: [
        { predicted_class: "Normal", count: 542 },
        { predicted_class: "COVID-19", count: 278 },
        { predicted_class: "Bacterial Pneumonia", count: 215 },
        { predicted_class: "Viral Pneumonia", count: 164 },
        { predicted_class: "Tuberculosis", count: 85 },
    ],
    daily_scans: (() => {
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            days.push({
                date: d.toISOString().split("T")[0],
                count: Math.floor(Math.random() * 40) + 10,
            });
        }
        return days;
    })(),
};

// ---------------------------------------------------------------------------
// Prediction history
// ---------------------------------------------------------------------------

const DISEASES = [
    "COVID-19",
    "Bacterial Pneumonia",
    "Viral Pneumonia",
    "Tuberculosis",
    "Normal",
];

const URGENCY_MAP = {
    "COVID-19": { level: "critical", icon: "🔴" },
    "Bacterial Pneumonia": { level: "high", icon: "🟠" },
    "Viral Pneumonia": { level: "moderate", icon: "🟡" },
    Tuberculosis: { level: "high", icon: "🟠" },
    Normal: { level: "low", icon: "🟢" },
};

const FOLLOW_UPS = {
    "COVID-19":
        "Immediate isolation recommended. Consider RT-PCR confirmation and monitor oxygen saturation.",
    "Bacterial Pneumonia":
        "Start empirical antibiotic therapy. Sputum culture recommended for targeted treatment.",
    "Viral Pneumonia":
        "Supportive care and hydration. Monitor for secondary bacterial infection.",
    Tuberculosis:
        "Refer to TB specialist. Sputum AFB smear and culture required. Consider isolation.",
    Normal:
        "No abnormalities detected. Routine follow-up at next scheduled visit.",
};

const buildHistoryItems = () => {
    const items = [];
    const today = new Date();
    for (let i = 0; i < 15; i++) {
        const disease = DISEASES[i % DISEASES.length];
        const created = new Date(today);
        created.setDate(created.getDate() - i);
        created.setHours(9 + (i % 8), (i * 17) % 60, 0, 0);

        items.push({
            id: 1000 + i,
            predicted_class: disease,
            confidence: parseFloat((0.82 + Math.random() * 0.15).toFixed(2)),
            urgency_level: URGENCY_MAP[disease].level,
            urgency_icon: URGENCY_MAP[disease].icon,
            follow_up: FOLLOW_UPS[disease],
            created_at: created.toISOString(),
            image_url: null, // no image in demo mode
        });
    }
    return items;
};

export const DUMMY_PREDICTION_HISTORY = buildHistoryItems();

/**
 * Returns a paginated slice of the dummy history, matching the API shape:
 *   { results: [...], count: <total> }
 */
export const getDummyHistoryPage = (page = 1, perPage = 10) => {
    const start = (page - 1) * perPage;
    return {
        results: DUMMY_PREDICTION_HISTORY.slice(start, start + perPage),
        count: DUMMY_PREDICTION_HISTORY.length,
    };
};
