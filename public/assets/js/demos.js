document.addEventListener("DOMContentLoaded", () => {
  initStripeDemo();
  initChartDemo();
  initChatbotDemo();
});

function initStripeDemo() {
  const form = document.getElementById("stripe-demo-form");
  const status = document.getElementById("stripe-status");
  const responseBox = document.getElementById("stripe-response");
  const cardTarget = document.getElementById("stripe-card-element");

  if (!form || !status || !responseBox || !cardTarget) return;

  const key = (window.DEMO_CONFIG && window.DEMO_CONFIG.stripePublishableKey) || "";
  const hasStripe = typeof window.Stripe !== "undefined";

  if (!hasStripe) {
    setStripeState(status, responseBox, "No se pudo cargar Stripe.js.", true);
    disableForm(form);
    return;
  }

  if (!key) {
    setStripeState(
      status,
      responseBox,
      "Configura STRIPE_PUBLISHABLE_KEY en .env para activar esta demo.",
      true
    );
    disableForm(form);
    return;
  }

  const stripe = window.Stripe(key);
  const elements = stripe.elements();
  const card = elements.create("card", {
    style: {
      base: {
        color: "#e7f4ff",
        fontFamily: "Anonymous Pro, monospace",
        fontSize: "15px",
        "::placeholder": {
          color: "#8ba4b5"
        }
      },
      invalid: {
        color: "#ff6b6b"
      }
    }
  });

  card.mount("#stripe-card-element");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    setStripeState(status, responseBox, "Creando intent de pago...", false, true);

    const name = document.getElementById("stripe-name").value.trim();
    const email = document.getElementById("stripe-email").value.trim();
    const amount = Number(document.getElementById("stripe-amount").value || 0);

    try {
      const intentResponse = await fetch("src/api/stripe_create_payment_intent.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount,
          currency: "mxn",
          name,
          email
        })
      });

      const intentData = await intentResponse.json();

      if (!intentResponse.ok || !intentData.ok || !intentData.clientSecret) {
        setStripeState(status, responseBox, intentData.error || "No se pudo crear el intent de pago.", true);
        return;
      }

      setStripeState(status, responseBox, "Confirmando pago con tarjeta de prueba...", false, true);

      const confirmResult = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name,
            email
          }
        }
      });

      if (confirmResult.error) {
        setStripeState(status, responseBox, confirmResult.error.message || "Stripe devolvio un error al confirmar el pago.", true);
        return;
      }

      const paymentIntent = confirmResult.paymentIntent;
      const payload = {
        demo: "stripe_test_payment",
        payment_intent_id: paymentIntent ? paymentIntent.id : intentData.paymentIntentId,
        amount_mxn: amount,
        status: paymentIntent ? paymentIntent.status : "unknown",
        created_at: new Date().toISOString()
      };

      setStripeState(status, responseBox, "Pago de prueba confirmado correctamente.", false);
      responseBox.textContent = JSON.stringify(payload, null, 2);
      responseBox.classList.remove("hidden");
    } catch (error) {
      setStripeState(status, responseBox, "No se pudo completar el pago de prueba.", true);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function setStripeState(statusEl, codeEl, message, isError, isLoading = false) {
  statusEl.textContent = message;
  statusEl.classList.remove("error", "success");

  if (isLoading) {
    codeEl.classList.add("hidden");
    return;
  }

  statusEl.classList.add(isError ? "error" : "success");
  if (isError) {
    codeEl.classList.add("hidden");
  }
}

function disableForm(form) {
  const controls = form.querySelectorAll("input, button");
  controls.forEach((control) => {
    control.disabled = true;
  });
}

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
    { category: "Demo A", value: 90 },
    { category: "Demo B", value: 125 },
    { category: "Demo C", value: 70 }
  ];

  const root = am5.Root.new("chart-surface");
  root.setThemes([am5themes_Animated.new(root)]);

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none",
      layout: root.verticalLayout
    })
  );

  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 24
      })
    })
  );

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  );

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

  series.columns.template.setAll({
    cornerRadiusTL: 8,
    cornerRadiusTR: 8,
    fillOpacity: 0.9,
    strokeOpacity: 0
  });

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

    const category = labelInput.value.trim();
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

    if (text.includes("stripe") || text.includes("pago")) {
      return "Integramos Stripe con flujos seguros para pagos con tarjeta y reportes de transacciones.";
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
