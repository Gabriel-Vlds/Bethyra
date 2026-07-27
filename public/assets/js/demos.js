document.addEventListener("DOMContentLoaded", () => {
  initChartDemo();
  initChatbotDemo();
});

function initChartDemo() {
  const form = document.getElementById("chart-data-form");
  const clearBtn = document.getElementById("chart-clear");
  const labelInput = document.getElementById("chart-label");
  const valueInput = document.getElementById("chart-value");
  const list = document.getElementById("chart-data-list");
  const chartSurface = document.getElementById("chart-surface");

  if (!form || !clearBtn || !labelInput || !valueInput || !list || !chartSurface) return;
  if (typeof window.am5 === "undefined" || typeof window.am5xy === "undefined") return;

  const weeklySeed = [
    { category: "Semana 1", value: 100 },
    { category: "Semana 2", value: 125 },
    { category: "Semana 3", value: 200 }
  ];

  const detailSeed = {
    "Semana 1": [
      { category: "Semana 1 - Dia 1", value: 20 },
      { category: "Semana 1 - Dia 2", value: 22 },
      { category: "Semana 1 - Dia 3", value: 30 },
      { category: "Semana 1 - Dia 4", value: 10 },
      { category: "Semana 1 - Dia 5", value: 8 },
      { category: "Semana 1 - Dia 6", value: 5 }
    ],
    "Semana 2": [
      { category: "Semana 2 - Dia 1", value: 18 },
      { category: "Semana 2 - Dia 2", value: 19 },
      { category: "Semana 2 - Dia 3", value: 25 },
      { category: "Semana 2 - Dia 4", value: 17 },
      { category: "Semana 2 - Dia 5", value: 21 },
      { category: "Semana 2 - Dia 6", value: 25 }
    ],
    "Semana 3": [
      { category: "Semana 3 - Dia 1", value: 28 },
      { category: "Semana 3 - Dia 2", value: 32 },
      { category: "Semana 3 - Dia 3", value: 30 },
      { category: "Semana 3 - Dia 4", value: 35 },
      { category: "Semana 3 - Dia 5", value: 37 },
      { category: "Semana 3 - Dia 6", value: 38 }
    ]
  };

  const weeklyData = weeklySeed.map((row) => ({ ...row }));
  const detailData = Object.fromEntries(
    Object.entries(detailSeed).map(([week, rows]) => [week, rows.map((row) => ({ ...row }))])
  );
  const viewState = {
    mode: "weekly",
    week: null
  };
  const DETAIL_ZOOM_THRESHOLD_WEEKS = 2;
  let suppressZoomReaction = false;

  const root = am5.Root.new("chart-surface");
  root.setThemes([am5themes_Animated.new(root)]);
  root.interfaceColors.set("text", am5.color(0x000000));

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout
    })
  );
  const scrollbarX = am5.Scrollbar.new(root, { orientation: "horizontal" });
  chart.set("scrollbarX", scrollbarX);

  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      minZoomCount: 1,
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 24
      })
    })
  );
  xAxis.get("renderer").labels.template.setAll({
    fill: am5.color(0x000000)
  });

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  );
  yAxis.get("renderer").labels.template.setAll({
    fill: am5.color(0x000000)
  });

  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      name: "Valores",
      xAxis,
      yAxis,
      valueYField: "value",
      categoryXField: "category",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{categoryX}: {valueY}"
      })
    })
  );
  series.get("tooltip").label.setAll({
    fill: am5.color(0x000000)
  });

  series.columns.template.setAll({
    cornerRadiusTL: 8,
    cornerRadiusTR: 8,
    fillOpacity: 0.9,
    strokeOpacity: 0
  });

  const normalizeCategory = (rawCategory) => {
    const trimmed = rawCategory.trim();
    if (trimmed === "") {
      return null;
    }

    const weekMatch = trimmed.match(/^semana\s*(\d+)$/i);
    if (weekMatch) {
      return {
        type: "weekly",
        week: `Semana ${weekMatch[1]}`,
        category: `Semana ${weekMatch[1]}`
      };
    }

    const dayMatch = trimmed.match(/^dia\s*(\d+)$/i);
    if (dayMatch) {
      return {
        type: "detail",
        week: "Semana 1",
        category: `Semana 1 - Dia ${dayMatch[1]}`
      };
    }

    const weekDayMatch = trimmed.match(/^semana\s*(\d+)\s*[-:]\s*dia\s*(\d+)$/i);
    if (weekDayMatch) {
      const week = `Semana ${weekDayMatch[1]}`;
      return {
        type: "detail",
        week,
        category: `${week} - Dia ${weekDayMatch[2]}`
      };
    }

    return {
      type: "weekly",
      week: trimmed,
      category: trimmed
    };
  };

  const getCurrentData = () => {
    if (viewState.mode === "detail" && viewState.week) {
      return detailData[viewState.week] || [];
    }

    return weeklyData;
  };

  function getVisibleWindow(total) {
    if (total <= 1) {
      return { startIndex: 0, endIndex: 0, visibleCount: total, centerIndex: 0 };
    }

    const rawStart =
      scrollbarX.getPrivate("start") ??
      scrollbarX.get("start") ??
      xAxis.getPrivate("start") ??
      xAxis.get("start") ??
      0;
    const rawEnd =
      scrollbarX.getPrivate("end") ??
      scrollbarX.get("end") ??
      xAxis.getPrivate("end") ??
      xAxis.get("end") ??
      1;
    const start = Math.max(0, Math.min(1, rawStart));
    const end = Math.max(0, Math.min(1, rawEnd));
    const maxIndex = total - 1;

    const startIndex = Math.max(0, Math.min(maxIndex, Math.floor(start * total)));
    const endIndex = Math.max(startIndex, Math.min(maxIndex, Math.ceil(end * total) - 1));
    const visibleCount = Math.max(1, endIndex - startIndex + 1);
    const centerIndex = Math.max(
      0,
      Math.min(maxIndex, Math.floor((((start + end) / 2) * total)))
    );

    return { startIndex, endIndex, visibleCount, centerIndex };
  }

  function switchToDetail(week) {
    const rows = detailData[week] || [];
    if (rows.length === 0) return;

    viewState.mode = "detail";
    viewState.week = week;
    draw();
  }

  function switchToWeekly() {
    if (viewState.mode === "weekly") return;

    viewState.mode = "weekly";
    viewState.week = null;
    draw();
  }

  function draw() {
    const currentData = getCurrentData();

    suppressZoomReaction = true;
    xAxis.data.setAll(currentData);
    series.data.setAll(currentData);
    requestAnimationFrame(() => {
      suppressZoomReaction = false;
    });

    list.innerHTML = "";
    currentData.forEach((row) => {
      const item = document.createElement("li");
      item.textContent = `${row.category}: ${row.value}`;
      list.appendChild(item);
    });

    if (currentData.length === 0) {
      const item = document.createElement("li");
      item.textContent = "Sin datos para mostrar.";
      list.appendChild(item);
    }
  }

  const handleZoomChange = () => {
    if (suppressZoomReaction || viewState.mode !== "weekly" || weeklyData.length === 0) {
      return;
    }

    const windowInfo = getVisibleWindow(weeklyData.length);
    if (windowInfo.visibleCount < DETAIL_ZOOM_THRESHOLD_WEEKS) {
      const selectedWeek = weeklyData[windowInfo.centerIndex];
      if (selectedWeek) {
        switchToDetail(selectedWeek.category);
      }
    }
  };

  xAxis.onPrivate("start", handleZoomChange);
  xAxis.onPrivate("end", handleZoomChange);
  xAxis.events.on("startendchanged", handleZoomChange);
  scrollbarX.onPrivate("start", handleZoomChange);
  scrollbarX.onPrivate("end", handleZoomChange);

  root.dom.addEventListener(
    "wheel",
    (event) => {
      // En vista diaria, cualquier gesto de scroll devuelve automaticamente a semanal.
      if (viewState.mode === "detail" && Math.abs(event.deltaY) > 0) {
        switchToWeekly();
      }
    },
    { passive: true }
  );

  const zoomWatcherId = window.setInterval(() => {
    handleZoomChange();
  }, 120);

  root.events.on("dispose", () => {
    window.clearInterval(zoomWatcherId);
  });

  draw();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const normalized = normalizeCategory(labelInput.value);
    const value = Number(valueInput.value);

    if (!normalized || Number.isNaN(value)) {
      return;
    }

    if (normalized.type === "detail") {
      if (!detailData[normalized.week]) {
        detailData[normalized.week] = [];
      }
      detailData[normalized.week].push({ category: normalized.category, value });
    } else {
      weeklyData.push({ category: normalized.category, value });
    }

    labelInput.value = "";
    valueInput.value = "";

    if (
      normalized.type === "weekly" ||
      (viewState.mode === "detail" && normalized.type === "detail" && normalized.week === viewState.week)
    ) {
      draw();
    }
  });

  clearBtn.addEventListener("click", () => {
    weeklyData.splice(0, weeklyData.length);
    Object.keys(detailData).forEach((week) => {
      detailData[week] = [];
    });
    switchToWeekly();
  });
}

function initChatbotDemo() {
  const form = document.getElementById("chatbot-form");
  const input = document.getElementById("chatbot-input");
  const windowEl = document.getElementById("chatbot-window");
  const quickActions = document.querySelectorAll("[data-chat-message]");

  if (!form || !input || !windowEl) return;

  const appendMessage = (role, text) => {
    const row = document.createElement("div");
    row.className = `chat-row ${role}`;
    row.textContent = text;
    windowEl.appendChild(row);
    windowEl.scrollTop = windowEl.scrollHeight;
    return row;
  };

  const getFallbackReply = (message) => {
    const text = message.toLowerCase();

    if (text.includes("hola") || text.includes("buenas")) {
      return "Hola, soy el bot demo de Bethyra. Te ayudo a resolver dudas rapidas.";
    }

    if (text.includes("servicio") || text.includes("ofrecen")) {
      return "Trabajamos desarrollo web, WordPress, agentes autonomos y herramientas a medida.";
    }

    if (text.includes("precio") || text.includes("costo") || text.includes("cotizacion")) {
      return "Los costos se definen por alcance. Podemos preparar una cotizacion inicial en 24-48 horas.";
    }

    if (text.includes("tiempo") || text.includes("entrega") || text.includes("plazo")) {
      return "Depende del proyecto, pero una primera version suele estar lista entre 2 y 6 semanas.";
    }

    if (text.includes("pago") || text.includes("pasarela")) {
      return "Podemos integrar pasarelas de pago seguras segun tu flujo de negocio y tus requisitos de operacion.";
    }

    return "Entendido. Si quieres, te conecto con el formulario de contacto para darte una propuesta exacta.";
  };

  const conversationHistory = [];

  const fetchPerplexityReply = async (message) => {
    const payload = {
      message,
      history: conversationHistory.slice(-8)
    };

    const response = await fetch("src/api/chat_perplexity.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    let data = null;
    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Respuesta invalida del endpoint.");
    }

    if (!response.ok || !data.ok || !data.reply) {
      throw new Error(data && data.error ? data.error : "No se pudo obtener respuesta de Perplexity.");
    }

    return String(data.reply).trim();
  };

  const handleUserMessage = async (message) => {
    const clean = message.trim();
    if (!clean) return;

    appendMessage("user", clean);
    conversationHistory.push({ role: "user", content: clean });

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const pendingRow = appendMessage("bot", "Pensando respuesta...");

    try {
      const reply = await fetchPerplexityReply(clean);
      pendingRow.textContent = reply;
      conversationHistory.push({ role: "assistant", content: reply });
    } catch (error) {
      const fallback = getFallbackReply(clean);
      pendingRow.textContent = `${fallback} (fallback local)`;
      conversationHistory.push({ role: "assistant", content: fallback });
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  };

  appendMessage("bot", "Hola. Escribe tu consulta y te respondo con una guia inicial.");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await handleUserMessage(input.value);
    input.value = "";
    input.focus();
  });

  quickActions.forEach((button) => {
    button.addEventListener("click", async () => {
      const message = button.getAttribute("data-chat-message") || "";
      await handleUserMessage(message);
    });
  });
}
