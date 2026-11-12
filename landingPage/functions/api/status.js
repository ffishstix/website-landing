const targets = {
    capitalRift: "https://capital-rift.fishstix.uk",
    display: "https://display.fishstix.uk",
    admin: "https://admin.fishstix.uk"
};
const batteryUrl = "https://battery.fishstix.uk/api/status";

async function check(url) {
    try {
        const response = await fetch(url, {
            method: "GET",
            signal: AbortSignal.timeout(4000),
            redirect: "follow"
        });
        await response.body?.cancel();
        return {ok: response.ok, statusCode: response.status};
    } catch {
        return {ok: false, error: "unavailable"};
    }
}

async function checkBattery() {
    try {
        const response = await fetch(batteryUrl, {
            signal: AbortSignal.timeout(4000),
            headers: {Accept: "application/json"}
        });
        if (!response.ok) return {ok: false, statusCode: response.status};
        const data = await response.json();
        return {ok: true, statusCode: response.status, status: data.status, sample: data.sample};
    } catch {
        return {ok: false, error: "unavailable"};
    }
}

export async function onRequestGet() {
    const [entries, battery] = await Promise.all([
        Promise.all(Object.entries(targets).map(async ([name, url]) => [name, await check(url)])),
        checkBattery()
    ]);
    return Response.json({
        ...Object.fromEntries(entries),
        battery,
        checkedAt: new Date().toISOString()
    }, {
        headers: {"Cache-Control": "public, max-age=10"}
    });
}
