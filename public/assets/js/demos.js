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

  const chartState = [
    { category: "Semana 1", value: 100 },
    { category: "Semana 2", value: 125 },
    { category: "Semana 3", value: 200 },
    { category: "Semana 1 - Dia 1", value: 20 },
    { category: "Semana 1 - Dia 2", value: 22 },
    { category: "Semana 1 - Dia 3", value: 30 },
    { category: "Semana 1 - Dia 4", value: 10 },
    { category: "Semana 1 - Dia 5", value: 8 },
    { category: "Semana 1 - Dia 6", value: 10 }
  ];

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
  chart.set("scrollbarX", am5.Scrollbar.new(root, { orientation: "horizontal" }));

  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
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
      return "";
    }

    const dayMatch = trimmed.match(/^dia\s*(\d+)$/i);
    if (dayMatch) {
      return `Semana 1 - Dia ${dayMatch[1]}`;
    }

    if (/^semana\s*1\s*[-:]\s*dia\s*\d+$/i.test(trimmed)) {
      return trimmed.replace(/^semana\s*1\s*[-:]\s*dia\s*/i, "Semana 1 - Dia ");
    }

    return trimmed;
  };

  function draw() {
    xAxis.data.setAll(chartState);
    series.data.setAll(chartState);

    list.innerHTML = "";
    chartState.forEach((row) => {
      const item = document.createElement("li");
      item.textContent = `${row.category}: ${row.value}`;
      list.appendChild(item);
    });
  }

  draw();

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const category = normalizeCategory(labelInput.value);
    const value = Number(valueInput.value);

    if (!category || Number.isNaN(value)) {
      return;
    }

    chartState.push({ category, value });
    labelInput.value = "";
    valueInput.value = "";
    draw();
  });

  clearBtn.addEventListener("click", () => {
    chartState.splice(0, chartState.length);
    draw();
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
