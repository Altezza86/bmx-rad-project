

"use strict";

/* ===== Nav highlight ===== */
(function () {
    var here = location.pathname.split("/").pop() || "DemingJasonAssignment5.html";
    document.querySelectorAll("#nav a").forEach(function (a) {
        if (a.getAttribute("href") === here) {
            a.setAttribute("aria-current", "page");
        }
    });
}());

/* ===== Simple announcements (used on Home) ===== */
(function () {
    var form = document.getElementById("announce-form");
    var list = document.getElementById("announce-list");
    var KEY = "wk4_notes";

    function read() {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || [];
        } catch (ignore) {
            return [];
        }
    }

    function write(v) {
        localStorage.setItem(KEY, JSON.stringify(v));
    }

    function render() {
        var items = read();
        var i;
        list.innerHTML = items.length ? "" :
                "<li><small>No notes yet.</small></li>";
        for (i = 0; i < items.length; i += 1) {
            var li = document.createElement("li");
            li.className = "card";
            li.textContent = items[i];
            list.appendChild(li);
        }
    }

    if (!form || !list) {
        return;
    }

    form.addEventListener("submit", function (e) {
        var txt;
        e.preventDefault();
        txt = document.getElementById("note").value.trim();
        if (txt.length < 3) {
            alert("Please add a bit more.");
            return;
        }
        var items = read();
        items.unshift(txt);
        write(items);
        form.reset();
        render();
    });

    render();
}());

/* ===== Gear calculator  ===== */
(function () {
    var form = document.getElementById("gear-form");
    var out = document.getElementById("gear-out");

    if (!form || !out) {
        return;
    }

    var wheelEl = document.getElementById("wheel");
    var frontEl = document.getElementById("front");
    var rearEl = document.getElementById("rear");

    function num(v, fallback) {
        var n = parseFloat(v);
        return Number.isFinite(n) ? n : fallback;
    }

    function calc(e) {
        var wheel, front, rear, ratio, gearInches, distPerRevIn, distPerRevM, rows;
        if (e) {
            e.preventDefault();
        }

        wheel = num(wheelEl.value, 20);
        front = num(frontEl.value, 44);
        rear = num(rearEl.value, 16);

        if (!rear || rear <= 0) {
            out.innerHTML =
                "<p class=\"small\" style=\"color:#a00;\">Rear cog must be &gt; 0.</p>";
            return;
        }

        ratio = front / rear;
        gearInches = wheel * ratio;
        distPerRevIn = Math.PI * gearInches;
        distPerRevM = distPerRevIn * 0.0254;

        if (![ratio, gearInches, distPerRevIn, distPerRevM].every(Number.isFinite)) {
            out.innerHTML =
                "<p class=\"small\" style=\"color:#a00;\">Check your numbers.</p>";
            return;
        }

        rows = [
            "<table>",
            "<tr><th>Ratio</th><td>" + front + ":" + rear +
                " (" + ratio.toFixed(3) + ")</td></tr>",
            "<tr><th>Gear Inches</th><td>" + gearInches.toFixed(2) + " in</td></tr>",
            "<tr><th>Distance per Pedal Rev</th><td>" +
                distPerRevIn.toFixed(1) + " in (" +
                distPerRevM.toFixed(2) + " m)</td></tr>",
            "</table>",
            "<p class=\"small\" style=\"color:#555;\">",
            "Note: Many BMX charts label \"rollout\" as <em>gear inches</em>. ",
            "Bike-shop \"rollout\" means distance per pedal revolution.",
            "</p>"
        ];

        out.innerHTML = rows.join("\n");
    }

    form.addEventListener("input", calc);
    form.addEventListener("submit", calc);
    calc();
}());

/* ===== Drag-and-Drop Presets (gear page) ===== */
(function () {
    var chips = document.querySelectorAll(".drag-chip");
    var drop = document.getElementById("dropzone");
    var form = document.getElementById("gear-form");

    if (!chips.length || !drop || !form) {
        return;
    }

    chips.forEach(function (chip) {
        chip.addEventListener("dragstart", function (e) {
            var payload = JSON.stringify({
                wheel: chip.dataset.wheel,
                front: chip.dataset.front,
                rear: chip.dataset.rear
            });
            e.dataTransfer.effectAllowed = "copy";
            e.dataTransfer.setData("application/json", payload);
        });
    });

    drop.addEventListener("dragover", function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        drop.classList.add("drag-over");
    });

    drop.addEventListener("dragleave", function () {
        drop.classList.remove("drag-over");
    });

    drop.addEventListener("drop", function (e) {
        var data;
        e.preventDefault();
        drop.classList.remove("drag-over");
        try {
            data = JSON.parse(e.dataTransfer.getData("application/json"));
        } catch (ignore) {
            data = null;
        }
        if (!data) {
            return;
        }
        document.getElementById("wheel").value = data.wheel;
        document.getElementById("front").value = data.front;
        document.getElementById("rear").value = data.rear;

        form.dispatchEvent(new Event("input", {bubbles: true}));
    });
}());

