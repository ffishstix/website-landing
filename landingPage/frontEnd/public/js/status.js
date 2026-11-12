function setStatus(state, text) {
    statusPill.className = `status-pill ${state}`;
    statusDot.className = `status-dot ${state}`;
    statusText.textContent = text;
}

function setCard(id, tone, label, detail, stats = []) {
    const card = document.getElementById(id);
    card.className = `service-card ${tone}`;
    card.querySelector(".service-state").textContent = label;
    card.querySelector(".service-detail").textContent = detail;
    card.querySelector(".service-stats")?.remove();
    if (!stats.length) return;

    const list = document.createElement("div");
    list.className = "service-stats";
    for (const [name, value] of stats) {
        const item = document.createElement("span");
        item.textContent = `${name}: ${value}`;
        list.append(item);
    }
    card.append(list);
}

function setSiteCard(id, entry) {
    if (entry?.ok) {
        setCard(id, "online", "Online", "Site responding", entry.statusCode ? [["HTTP", entry.statusCode]] : []);
    } else if (entry?.statusCode) {
        setCard(id, "issue", "Issue", `Site returned HTTP ${entry.statusCode}`);
    } else {
        setCard(id, "offline", "Offline", "Site could not be reached");
    }
}

function formatReadingTime(value) {
    const time = Date.parse(value);
    if (!Number.isFinite(time)) return "Reading time unknown";
    const minutes = Math.max(0, Math.floor((Date.now() - time) / 60000));
    return minutes < 1 ? "Updated just now" : `Updated ${minutes} min ago`;
}

function setBatteryCard(entry) {
    if (!entry?.ok) {
        setCard("service-battery", "offline", "Offline", "Battery Watch could not be reached");
        return "offline";
    }

    const sample = entry.sample;
    const status = entry.status;
    if (!sample || status === "no_data") {
        setCard("service-battery", "issue", "Waiting", "Connected to Battery Watch; waiting for a battery reading");
        return "issue";
    }

    const states = {
        charging: ["charging", "Charging"],
        discharging: ["discharging", "Running on battery"],
        passthrough: ["online", "Passing power through"],
        idle: ["online", "Standing by"],
        stale: ["issue", "Reading delayed"],
        fault: ["offline", "Battery fault"]
    };
    const [tone, label] = states[status] || ["issue", "State unknown"];
    const stats = [];
    if (Number.isFinite(sample.charge_percent)) stats.push(["Charge", `${Math.round(sample.charge_percent)}%`]);
    if (Number.isFinite(sample.input_w)) stats.push(["In", `${Math.round(sample.input_w)} W`]);
    if (Number.isFinite(sample.output_w)) stats.push(["Out", `${Math.round(sample.output_w)} W`]);
    setCard("service-battery", tone, label, `Connection active · ${formatReadingTime(sample.received_at || sample.recorded_at)}`, stats);
    return tone;
}

function applyStatus(data) {
    setSiteCard("service-display", data?.display);
    setSiteCard("service-admin", data?.admin);
    setSiteCard("service-capital-rift", data?.capitalRift);
    const batteryTone = setBatteryCard(data?.battery);

    const sites = [data?.display, data?.admin, data?.capitalRift];
    const onlineCount = sites.filter(entry => entry?.ok).length;
    if (onlineCount === 3 && ["online", "charging"].includes(batteryTone)) {
        setStatus("ok", "All sites online");
    } else if (onlineCount === 0 && batteryTone === "offline") {
        setStatus("offline", "Services unavailable");
    } else {
        setStatus("warn", "Some services need attention");
    }

    const checkedAt = Date.parse(data?.checkedAt);
    document.getElementById("checked-at").textContent = Number.isFinite(checkedAt)
        ? `Checked ${new Date(checkedAt).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}`
        : "Check time unavailable";
}

async function refreshStatus() {
    try {
        const response = await fetch(STATUS_ENDPOINT, {cache: "no-store"});
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        applyStatus(await response.json());
    } catch {
        setStatus("offline", "Status check unavailable");
        for (const id of ["service-battery", "service-display", "service-admin", "service-capital-rift"]) {
            setCard(id, "issue", "Unknown", "Could not check this service right now");
        }
        document.getElementById("checked-at").textContent = "Check unavailable";
    }
}
