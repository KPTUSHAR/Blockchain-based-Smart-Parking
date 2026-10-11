// ==========================================================
// 🌐 SMART PARKING SYSTEM - FRONTEND SCRIPT
// Multi Vehicle + Multi Payment + PDF Receipt
// ==========================================================


// ==========================================================
// 🌐 API BASE URL
// ==========================================================

// IMPORTANT:
// Use the same Flask server that is serving the dashboard.
// This avoids incorrect Markdown URLs and CORS problems.

const apiBase = window.location.origin;

console.log("🌐 API Base:", apiBase);


// ==========================================================
// 🔐 USER SESSION MANAGEMENT
// ==========================================================

function saveUser(username) {
  localStorage.setItem("currentUser", username);
}

function getUser() {
  return localStorage.getItem("currentUser");
}

function clearUser() {
  localStorage.removeItem("currentUser");
}


// ==========================================================
// 🔐 LOGIN
// ==========================================================

async function loginUser() {

  const username =
    document.getElementById("username")?.value.trim();

  const password =
    document.getElementById("password")?.value.trim();

  if (!username || !password) {
    return alert("⚠️ Enter username & password!");
  }

  try {

    const res = await fetch(`${apiBase}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Login failed"
      );
    }

    saveUser(username);

    window.location.href = "/vehicle_form";

  } catch (err) {

    console.error("❌ Login error:", err);

    alert(`❌ ${err.message}`);
  }
}


// ==========================================================
// 🔐 REGISTER
// ==========================================================

async function registerUser() {

  const username =
    document.getElementById("username")?.value.trim();

  const password =
    document.getElementById("password")?.value.trim();

  if (!username || !password) {
    return alert("⚠️ Enter username & password!");
  }

  try {

    const res = await fetch(`${apiBase}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message || "Registration failed"
      );
    }

    saveUser(username);

    window.location.href = "/vehicle_form";

  } catch (err) {

    console.error("❌ Registration error:", err);

    alert(`❌ ${err.message}`);
  }
}


// ==========================================================
// 🌐 LANGUAGE SELECTOR DICTIONARY
// ==========================================================

const translations = {

  en: {

    pageTitle: "Smart Parking Login",
    loginTitle: "Smart Parking Login",
    loginSubtitle: "Secure Smart Parking Management!",

    username: "Username",
    password: "Password",

    loginBtn: "Login",
    registerBtn: "Register",

    footerText:
      "Blockchain-enabled • Secure • Smart Parking",

    heroBadge: "SMART PARKING SYSTEM",

    heroTitle1: "Park Smarter.",
    heroTitle2: "Travel Better.",

    heroDesc:
      "Experience a seamless parking solution with real-time slot availability, easy reservations, FASTag-enabled entry and secure digital payments.",

    feature1Title: "Real-Time Availability",
    feature1Desc:
      "Check available parking slots instantly.",

    feature2Title: "Easy Slot Reservation",
    feature2Desc:
      "Reserve your preferred parking slot in seconds.",

    feature3Title: "FASTag Enabled",
    feature3Desc:
      "Enjoy faster and convenient entry and exit.",

    feature4Title: "Secure Transactions",
    feature4Desc:
      "Protected digital records and payments.",

    statTotal: "TOTAL SLOTS",
    statAvailable: "AVAILABLE",
    statOccupied: "OCCUPIED",
    statReserved: "RESERVED",

    tagline:
      "Find. Reserve. Park. Pay.",

    footerCopy:
      "© 2026 Smart Parking System • All Rights Reserved"
  },


  hi: {

    pageTitle: "स्मार्ट पार्किंग लॉगिन",
    loginTitle: "स्मार्ट पार्किंग लॉगिन",
    loginSubtitle:
      "सुरक्षित स्मार्ट पार्किंग प्रबंधन!",

    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",

    loginBtn: "लॉगिन",
    registerBtn: "रजिस्टर करें",

    footerText:
      "ब्लॉकचेन-सक्षम • सुरक्षित • स्मार्ट पार्किंग",

    heroBadge:
      "स्मार्ट पार्किंग सिस्टम",

    heroTitle1:
      "स्मार्ट तरीके से पार्क करें।",

    heroTitle2:
      "बेहतर यात्रा करें।",

    heroDesc:
      "रीयल-टाइम स्लॉट उपलब्धता, आसान आरक्षण, FASTag-सक्षम प्रवेश और सुरक्षित डिजिटल भुगतान के साथ सहज पार्किंग समाधान।",

    feature1Title:
      "रीयल-टाइम उपलब्धता",

    feature1Desc:
      "उपलब्ध पार्किंग स्लॉट तुरंत देखें।",

    feature2Title:
      "आसान स्लॉट आरक्षण",

    feature2Desc:
      "कुछ ही सेकंड में अपना पसंदीदा स्लॉट आरक्षित करें।",

    feature3Title:
      "FASTag सक्षम",

    feature3Desc:
      "तेज़ और सुविधाजनक प्रवेश और निकास का आनंद लें।",

    feature4Title:
      "सुरक्षित लेनदेन",

    feature4Desc:
      "सुरक्षित डिजिटल रिकॉर्ड और भुगतान।",

    statTotal: "कुल स्लॉट",
    statAvailable: "उपलब्ध",
    statOccupied: "भरा हुआ",
    statReserved: "आरक्षित",

    tagline:
      "खोजें। आरक्षित करें। पार्क करें। भुगतान करें।",

    footerCopy:
      "© 2026 स्मार्ट पार्किंग सिस्टम • सर्वाधिकार सुरक्षित"
  },


  kn: {

    pageTitle:
      "ಸ್ಮಾರ್ಟ್ ಪಾರ್ಕಿಂಗ್ ಲಾಗಿನ್",

    loginTitle:
      "ಸ್ಮಾರ್ಟ್ ಪಾರ್ಕಿಂಗ್ ಲಾಗಿನ್",

    loginSubtitle:
      "ಭದ್ರ ಸ್ಮಾರ್ಟ್ ಪಾರ್ಕಿಂಗ್ ನಿರ್ವಹಣೆ!",

    username:
      "ಬಳಕೆದಾರ ಹೆಸರು",

    password:
      "ಪಾಸ್‌ವರ್ಡ್",

    loginBtn:
      "ಲಾಗಿನ್",

    registerBtn:
      "ನೋಂದಣಿ",

    footerText:
      "ಬ್ಲಾಕ್‌ಚೇನ್-ಸಕ್ರಿಯ • ಭದ್ರ • ಸ್ಮಾರ್ಟ್ ಪಾರ್ಕಿಂಗ್",

    heroBadge:
      "ಸ್ಮಾರ್ಟ್ ಪಾರ್ಕಿಂಗ್ ಸಿಸ್ಟಮ್",

    heroTitle1:
      "ಸ್ಮಾರ್ಟ್ ಪಾರ್ಕ್ ಮಾಡಿ.",

    heroTitle2:
      "ಉತ್ತಮವಾಗಿ ಪ್ರಯಾಣಿಸಿ.",

    heroDesc:
      "ರಿಯಲ್-ಟೈಮ್ ಸ್ಲಾಟ್ ಲಭ್ಯತೆ, ಸುಲಭ ಕಾಯ್ದಿರಿಸುವಿಕೆ, FASTag ಸಕ್ರಿಯ ಪ್ರವೇಶ ಮತ್ತು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ ಪಾವತಿಗಳೊಂದಿಗೆ ನಿರಂತರ ಪಾರ್ಕಿಂಗ್ ಪರಿಹಾರ.",

    feature1Title:
      "ರಿಯಲ್-ಟೈಮ್ ಲಭ್ಯತೆ",

    feature1Desc:
      "ಲಭ್ಯವಿರುವ ಪಾರ್ಕಿಂಗ್ ಸ್ಲಾಟ್‌ಗಳನ್ನು ತಕ್ಷಣ ಪರಿಶೀಲಿಸಿ.",

    feature2Title:
      "ಸುಲಭ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸುವಿಕೆ",

    feature2Desc:
      "ಕೆಲವೇ ಸೆಕೆಂಡುಗಳಲ್ಲಿ ನಿಮ್ಮ ಇಷ್ಟದ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಿ.",

    feature3Title:
      "FASTag ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ",

    feature3Desc:
      "ವೇಗವಾದ ಮತ್ತು ಅನುಕೂಲಕರ ಪ್ರವೇಶ ಮತ್ತು ನಿರ್ಗಮನವನ್ನು ಅನುಭವಿಸಿ.",

    feature4Title:
      "ಸುರಕ್ಷಿತ ವ್ಯವಹಾರಗಳು",

    feature4Desc:
      "ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ ದಾಖಲೆಗಳು ಮತ್ತು ಪಾವತಿಗಳು.",

    statTotal:
      "ಒಟ್ಟು ಸ್ಲಾಟ್‌ಗಳು",

    statAvailable:
      "ಲಭ್ಯವಿದೆ",

    statOccupied:
      "ಆಕ್ರಮಿಸಲಾಗಿದೆ",

    statReserved:
      "ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ",

    tagline:
      "ಹುಡುಕಿ. ಕಾಯ್ದಿರಿಸಿ. ಪಾರ್ಕ್ ಮಾಡಿ. ಪಾವತಿಸಿ.",

    footerCopy:
      "© 2026 ಸ್ಮಾರ್ಟ್ ಪಾರ್ಕಿಂಗ್ ಸಿಸ್ಟಮ್ • ಎಲ್ಲಾ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ"
  }

};


// ==========================================================
// 🌐 CHANGE LANGUAGE
// ==========================================================

function changeLanguage(language) {

  const text = translations[language];

  if (!text) return;

  document
    .querySelectorAll("[data-key]")
    .forEach(el => {

      const key = el.dataset.key;

      if (text[key]) {
        el.textContent = text[key];
      }

    });

  const username =
    document.getElementById("username");

  const password =
    document.getElementById("password");

  if (username && text.username) {
    username.placeholder = text.username;
  }

  if (password && text.password) {
    password.placeholder = text.password;
  }

  document.documentElement.lang = language;

  localStorage.setItem(
    "selectedLanguage",
    language
  );
}


// ==========================================================
// ⏰ LIVE CLOCK
// ==========================================================

function updateClock() {

  const clock =
    document.getElementById("live-clock");

  if (!clock) return;

  const now = new Date();

  const date =
    now.toLocaleDateString("en-GB");

  const time =
    now.toLocaleTimeString(
      "en-GB",
      {
        hour12: false
      }
    );

  clock.textContent =
    `${date} ${time}`;
}


// ==========================================================
// 🚗 PARKING SLOTS
// ==========================================================

async function fetchSlots() {

  const container =
    document.getElementById("slots");

  if (!container) return;

  try {

    console.log("🔄 Refreshing parking slots...");

    const res = await fetch(
      `${apiBase}/slots?_=${Date.now()}`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          "Accept": "application/json"
        }
      }
    );

    if (!res.ok) {

      throw new Error(
        `Server returned ${res.status}`
      );

    }

    const slots = await res.json();

    console.log(
      "✅ Latest slots:",
      slots
    );

    if (!Array.isArray(slots)) {
      throw new Error("Invalid slot data");
    }

    container.innerHTML = "";

    slots.forEach(slot => {

      const div =
        document.createElement("div");

      div.classList.add(
        "slot",
        slot.booked
          ? "booked"
          : "available"
      );

      div.innerHTML =
        `🚗 Slot ${slot.id}`;

      div.onclick = () => {

        if (slot.booked) {

          if (slot.user === getUser()) {

            releaseSlot(slot.id);

          } else {

            alert(
              `🚫 Slot ${slot.id} belongs to another user!`
            );

          }

        } else {

          bookSlot(slot.id);

        }

      };

      container.appendChild(div);

    });

    console.log(
      "✅ Parking slots refreshed successfully"
    );

  } catch (err) {

    console.error(
      "❌ Slot loading error:",
      err
    );

    container.innerHTML = `
      <p style="color:#ff5252;">
        ❌ Unable to load parking slots.
      </p>
    `;
  }
}


// ==========================================================
// ⛓ BLOCKCHAIN LEDGER
// ==========================================================

async function fetchChain() {
  const ledger = document.getElementById("ledger");

  if (!ledger) {
    console.error("❌ Ledger element not found!");
    return;
  }

  try {
    console.log("🔗 Fetching blockchain ledger...");
    console.log("🌐 Blockchain URL:", `${apiBase}/ledger`);

    ledger.innerHTML = `
      <p style="color:#58a6ff;">
        🔄 Loading blockchain ledger...
      </p>
    `;

    // ✅ Corrected endpoint: /ledger instead of /chain
    const res = await fetch(`${apiBase}/ledger?_=${Date.now()}`, {
      method: "GET",
      cache: "no-store",
      headers: { "Accept": "application/json" },
    });

    console.log("📡 Blockchain response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Blockchain server response:", errorText);
      throw new Error(`Blockchain request failed: ${res.status}`);
    }

    const result = await res.json();
    console.log("✅ Blockchain received:", result);

    const chain = Array.isArray(result) ? result : result.chain;

    if (!Array.isArray(chain)) {
      console.error("❌ Invalid blockchain response:", result);
      ledger.innerHTML = `
        <p style="color:#ff5252;">
          ❌ Invalid blockchain data received.
        </p>
      `;
      return;
    }

    if (chain.length === 0) {
      ledger.innerHTML = `
        <p style="color:#aaa;">
          ⛓ No blockchain transactions yet...
        </p>
      `;
      return;
    }

    // ------------------------------------------------------
    // Display newest block first
    // ------------------------------------------------------
    ledger.innerHTML = "";

    chain
      .slice()
      .reverse()
      .forEach((block, index) => {
        const card = document.createElement("div");
        card.className = "block-card";
        card.innerHTML = `
          <div class="block-title">Block #${block.index ?? "N/A"}</div>
          <div class="block-data">🕒 Timestamp: ${block.timestamp ?? "Unknown time"}</div>
          <div class="block-data">💬 Data: ${block.data ?? "No transaction data"}</div>
          <div class="block-divider"></div>
          <div class="block-hash">🔗 Hash: ${block.hash ?? "N/A"}</div>
        `;
        ledger.appendChild(card);

        // Add visible separator line between blocks
        if (index < chain.length - 1) {
          const separator = document.createElement("div");
          separator.className = "block-separator";
          ledger.appendChild(separator);
        }
      });

    console.log(`✅ ${chain.length} blockchain block(s) displayed.`);
  } catch (err) {
    console.error("❌ Blockchain loading error:", err);
    ledger.innerHTML = `
      <p style="color:#ff5252;">
        ❌ Unable to load blockchain ledger.
        <br>
        <small>${err.message}</small>
      </p>
    `;
  }
}




// ==========================================================
// 🚘 MULTI VEHICLE ENTRY + SLOT LIMIT
// ==========================================================

async function saveVehicle() {

  const user = getUser();

  if (!user) {

    window.location.href = "/";

    return;
  }

  const count =
    parseInt(
      document
        .getElementById("vehicle-count")
        ?.value
    );

  const slotLimit =
    parseInt(
      document
        .getElementById("slot-limit")
        ?.value
    );


  if (!count) {
    return alert(
      "Enter number of vehicles!"
    );
  }

  if (!slotLimit) {
    return alert(
      "Enter required slots!"
    );
  }

  if (slotLimit > count) {

    return alert(
      "Slot limit cannot exceed number of vehicles!"
    );

  }


  const vehicles = [];


  for (
    let i = 1;
    i <= count;
    i++
  ) {

    const plate =
      document
        .getElementById(`plate-${i}`)
        ?.value
        .trim();

    const vtype =
      document
        .getElementById(`vtype-${i}`)
        ?.value;


    if (!plate) {

      return alert(
        `Enter number for Vehicle ${i}`
      );

    }


    vehicles.push({
      plate,
      type: vtype
    });

  }


  try {

    const res =
      await fetch(
        `${apiBase}/set_vehicle`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            username: user,
            vehicles,
            slot_limit: slotLimit
          })
        }
      );


    const data =
      await res.json();


    if (!res.ok) {

      throw new Error(
        data.message ||
        "Unable to save vehicle details"
      );

    }


    alert(
      "✅ Vehicle details saved!"
    );


    window.location.href =
      "/dashboard";

  } catch (err) {

    console.error(
      "❌ Vehicle save error:",
      err
    );

    alert(
      `❌ ${err.message}`
    );
  }
}


// ==========================================================
// 🅿️ BOOK SLOT
// ==========================================================

async function bookSlot(id) {

  const username =
    getUser();

  if (!username) {
    return alert(
      "Login first!"
    );
  }


  try {

    console.log(
      `🅿️ Booking Slot ${id} for ${username}`
    );


    const res =
      await fetch(
        `${apiBase}/book/${id}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            username
          })
        }
      );


    const data =
      await res.json();


    if (!res.ok) {

      throw new Error(
        data.message ||
        "Unable to book slot"
      );

    }


    alert(
      `✅ Slot ${id} booked successfully!`
    );


    await fetchSlots();

    await fetchChain();

  } catch (err) {

    console.error(
      "❌ Booking error:",
      err
    );

    alert(
      `❌ ${err.message}`
    );
  }
}


// ==========================================================
// 💳 RELEASE SLOT + PAYMENT
// ==========================================================

async function releaseSlot(id) {

  const username =
    getUser();

  if (!username) {

    return alert(
      "Login first!"
    );

  }


  try {

    const res =
      await fetch(
        `${apiBase}/calculate_bill/${id}?username=${encodeURIComponent(username)}`
      );


    const data =
      await res.json();


    if (!res.ok) {

      throw new Error(
        data.message ||
        "Unable to calculate bill"
      );

    }


    const expected =
      data.expected;


    showPaymentModal(
      expected,

      async paymentDetails => {

        await completePayment(
          id,
          username,
          expected,
          paymentDetails
        );

      }
    );


  } catch (err) {

    console.error(
      "❌ Bill calculation error:",
      err
    );

    alert(
      `❌ ${err.message}`
    );
  }
}


// ==========================================================
// 💳 COMPLETE PAYMENT
// ==========================================================

async function completePayment(
  slotId,
  username,
  amount,
  paymentDetails
) {

  try {

    // ------------------------------------------------------
    // Get booking information BEFORE releasing slot
    // ------------------------------------------------------

    const slotsRes =
      await fetch(
        `${apiBase}/slots`
      );


    const slots =
      await slotsRes.json();


    const slot =
      slots.find(
        s =>
          s.id === slotId &&
          s.booked &&
          s.user === username
      );


    if (!slot) {

      throw new Error(
        "Booking information not found!"
      );

    }


    const startTime =
      slot.start_time;


    // ------------------------------------------------------
    // Release slot
    // ------------------------------------------------------

    const releaseRes =
      await fetch(
        `${apiBase}/release/${slotId}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            username,
            paid: amount
          })
        }
      );


    const releaseData =
      await releaseRes.json();


    if (!releaseRes.ok) {

      throw new Error(
        releaseData.message ||
        "Unable to release slot"
      );

    }


    // ------------------------------------------------------
    // Generate transaction ID
    // ------------------------------------------------------

    const transactionId =
      paymentDetails.transactionId ||
      generateTransactionId();


    // ------------------------------------------------------
    // End time
    // ------------------------------------------------------

    const endTime =
      new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");


    // ------------------------------------------------------
    // Generate PDF receipt
    // ------------------------------------------------------

    await downloadReceipt(
      slotId,
      startTime,
      endTime,
      amount,
      transactionId
    );


    // ------------------------------------------------------
    // Refresh UI
    // ------------------------------------------------------

    await fetchSlots();

    await fetchChain();


    alert(
      "✅ Payment successful!\n\n" +
      "💰 Amount: ₹" +
      amount +
      "\n🎫 Receipt downloaded successfully!"
    );


  } catch (err) {

    console.error(
      "❌ Payment failed:",
      err
    );

    alert(
      "❌ Payment failed: " +
      err.message
    );
  }
}


// ==========================================================
// 🧾 DOWNLOAD PDF RECEIPT
// ==========================================================

async function downloadReceipt(
  slotNumber,
  startTime,
  endTime,
  amount,
  transactionId
) {

  const formData =
    new FormData();


  formData.append(
    "slot_number",
    slotNumber
  );

  formData.append(
    "start_time",
    startTime
  );

  formData.append(
    "end_time",
    endTime
  );

  formData.append(
    "amount",
    amount
  );

  formData.append(
    "transaction_id",
    transactionId
  );


  const response =
    await fetch(
      `${apiBase}/payment/success`,
      {
        method: "POST",
        body: formData
      }
    );


  if (!response.ok) {

    let message =
      "Could not generate receipt.";


    try {

      const errorData =
        await response.json();

      message =
        errorData.message ||
        message;

    } catch (_) {}


    throw new Error(
      message
    );
  }


  const blob =
    await response.blob();


  const url =
    window.URL.createObjectURL(
      blob
    );


  const link =
    document.createElement("a");


  link.href =
    url;


  link.download =
    `parking_receipt_slot_${slotNumber}.pdf`;


  document.body.appendChild(
    link
  );


  link.click();

  link.remove();


  window.URL.revokeObjectURL(
    url
  );
}


// ==========================================================
// 🆔 TRANSACTION ID
// ==========================================================

function generateTransactionId() {

  const random =
    Math.floor(
      100000 +
      Math.random() * 900000
    );


  return (
    "TXN" +
    Date.now() +
    random
  );
}


// ==========================================================
// 💰 PAYMENT MODAL
// ==========================================================

function showPaymentModal(
  amount,
  onConfirm
) {

  const oldModal =
    document.querySelector(
      ".payment-modal"
    );


  if (oldModal) {
    oldModal.remove();
  }


  const modal =
    document.createElement("div");


  modal.className =
    "payment-modal";


  modal.innerHTML = `

    <div class="payment-box">

      <h2>💳 Payment Gateway</h2>

      <p class="amount-text">
        Total Amount:
        <strong>₹${amount}</strong>
      </p>

      <div id="payment-methods">

        <button
          class="pay-option"
          onclick="showUPIForm(${amount})">
          📱 UPI
        </button>

        <button
          class="pay-option"
          onclick="showCardForm(${amount})">
          💳 Card
        </button>

        <button
          class="pay-option"
          onclick="showQRForm(${amount})">
          🟦 QR Code
        </button>

        <button
          class="cancel-btn"
          onclick="closePaymentModal()">
          Cancel
        </button>

      </div>

      <div id="payment-form"></div>

    </div>
  `;


  document.body.appendChild(
    modal
  );


  setTimeout(() => {

    modal.classList.add(
      "show"
    );

  }, 10);


  window.paymentSuccessCallback =
    onConfirm;
}


// ==========================================================
// 📱 UPI PAYMENT
// ==========================================================

function showUPIForm(amount) {

  document.getElementById(
    "payment-form"
  ).innerHTML = `

    <h3>📱 UPI Payment</h3>

    <input
      type="text"
      id="upi-id"
      placeholder="example@upi"
    >

    <button
      class="pay-btn"
      onclick="processUPI(${amount})">
      Pay ₹${amount}
    </button>

    <button
      class="back-btn"
      onclick="resetPaymentBox()">
      ⬅ Back
    </button>

  `;
}


function processUPI(amount) {

  const upi =
    document
      .getElementById("upi-id")
      ?.value
      .trim();


  if (
    !upi ||
    !upi.includes("@")
  ) {

    return alert(
      "Enter valid UPI ID!"
    );

  }


  alert(
    "📲 Request sent to UPI app..."
  );


  setTimeout(
    async () => {

      const transactionId =
        generateTransactionId();


      try {

        await window.paymentSuccessCallback({
          method: "UPI",
          transactionId
        });


        closePaymentModal();

      } catch (err) {

        console.error(
          "❌ UPI Payment Error:",
          err
        );

      }

    },
    1500
  );
}


// ==========================================================
// 💳 CARD PAYMENT
// ==========================================================

function showCardForm(amount) {

  document.getElementById(
    "payment-form"
  ).innerHTML = `

    <h3>💳 Card Payment</h3>

    <input
      id="cardName"
      placeholder="Name on Card"
    >

    <input
      id="cardNumber"
      maxlength="16"
      placeholder="Card Number (16 digits)"
    >

    <div class="inline-fields">

      <input
        id="expiry"
        maxlength="5"
        placeholder="MM/YY"
      >

      <input
        id="cvv"
        maxlength="3"
        placeholder="CVV"
        type="password"
      >

    </div>

    <button
      class="pay-btn"
      onclick="processCard(${amount})">
      Pay ₹${amount}
    </button>

    <button
      class="back-btn"
      onclick="resetPaymentBox()">
      ⬅ Back
    </button>

  `;
}


function processCard(amount) {

  const name =
    document
      .getElementById("cardName")
      ?.value
      .trim();


  const num =
    document
      .getElementById("cardNumber")
      ?.value
      .trim();


  const exp =
    document
      .getElementById("expiry")
      ?.value
      .trim();


  const cv =
    document
      .getElementById("cvv")
      ?.value
      .trim();


  // FIXED EXPIRY VALIDATION
  if (
    !name ||
    !/^\d{16}$/.test(num) ||
    !/^\d{2}\/\d{2}$/.test(exp) ||
    !/^\d{3}$/.test(cv)
  ) {

    return alert(
      "Enter valid card details!"
    );

  }


  alert(
    "💳 Processing Payment..."
  );


  setTimeout(
    async () => {

      const transactionId =
        generateTransactionId();


      try {

        await window.paymentSuccessCallback({
          method: "CARD",
          transactionId
        });


        closePaymentModal();

      } catch (err) {

        console.error(
          "❌ Card Payment Error:",
          err
        );

      }

    },
    1500
  );
}


// ==========================================================
// 🟦 QR PAYMENT
// ==========================================================

function showQRForm(amount) {

  document.getElementById(
    "payment-form"
  ).innerHTML = `

    <h3>🟦 Scan QR Code</h3>

    <img
      class="qr-img"
      src="/static/images/my-upi-qr.jpeg"
      alt="UPI Payment QR Code"
    >

    <p>
      Scan using any UPI app
    </p>

    <p>
      <strong>
        Amount: ₹${amount}
      </strong>
    </p>

    <button
      class="pay-btn"
      onclick="processQR(${amount})">
      I have paid
    </button>

    <button
      class="back-btn"
      onclick="resetPaymentBox()">
      ⬅ Back
    </button>

  `;
}


// ==========================================================
// 🟦 PROCESS QR PAYMENT
// ==========================================================

function processQR(amount) {

  alert(
    "⏳ Verifying payment..."
  );


  setTimeout(
    async () => {

      const transactionId =
        generateTransactionId();


      try {

        await window.paymentSuccessCallback({
          method: "QR",
          transactionId,
          amount
        });


        closePaymentModal();


      } catch (err) {

        console.error(
          "❌ QR Payment Error:",
          err
        );


        alert(
          "❌ Payment verification failed."
        );

      }

    },
    1500
  );
}


// ==========================================================
// 🔄 RESET PAYMENT BOX
// ==========================================================

function resetPaymentBox() {

  const form =
    document.getElementById(
      "payment-form"
    );


  if (form) {
    form.innerHTML = "";
  }
}


// ==========================================================
// ❌ CLOSE PAYMENT MODAL
// ==========================================================

function closePaymentModal() {

  const modal =
    document.querySelector(
      ".payment-modal"
    );


  if (!modal) return;


  modal.classList.remove(
    "show"
  );


  setTimeout(
    () => {

      modal.remove();

    },
    200
  );
}


// ==========================================================
// ⚙ PAGE INITIALIZATION
// ==========================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "✅ Smart Parking JavaScript loaded"
    );


    // ======================================================
    // 🔐 LOGIN BUTTON
    // ======================================================

    const loginBtn =
      document.getElementById(
        "login-btn"
      );


    if (loginBtn) {

      loginBtn.addEventListener(
        "click",
        loginUser
      );

    }


    // ======================================================
    // 🔐 REGISTER BUTTON
    // ======================================================

    const registerBtn =
      document.getElementById(
        "register-btn"
      );


    if (registerBtn) {

      registerBtn.addEventListener(
        "click",
        registerUser
      );

    }


    // ======================================================
    // 🌐 LANGUAGE SELECTOR
    // ======================================================

    const languageSelect =
      document.getElementById(
        "languageSelect"
      );


    if (languageSelect) {

      languageSelect.addEventListener(
        "change",
        function () {

          changeLanguage(
            this.value
          );

        }
      );


      const savedLanguage =
        localStorage.getItem(
          "selectedLanguage"
        ) || "en";


      languageSelect.value =
        savedLanguage;


      changeLanguage(
        savedLanguage
      );

    }


    // ======================================================
    // ⏰ LIVE CLOCK
    // ======================================================

    if (
      document.getElementById(
        "live-clock"
      )
    ) {

      updateClock();

      setInterval(
        updateClock,
        1000
      );

    }


    // ======================================================
    // 🚘 SAVE VEHICLE
    // ======================================================

    const saveVehicleBtn =
      document.getElementById(
        "save-vehicle"
      );


    if (saveVehicleBtn) {

      saveVehicleBtn.addEventListener(
        "click",
        saveVehicle
      );

    }


        // ======================================================
    // 🔄 REFRESH SLOTS
    // ======================================================

    const refreshSlots = document.getElementById("refresh-slots");

    console.log("Refresh button:", refreshSlots);

    if (refreshSlots) {
      refreshSlots.addEventListener("click", async function () {
        console.log("🖱️ REFRESH BUTTON CLICKED");

        try {
          // Call your existing fetchSlots() function
          const slots = await fetchSlots();

          console.log("✅ fetchSlots() completed successfully");

          // --------------------------------------------------
          // 🔁 Reset slot colors to green (unbook)
          // --------------------------------------------------
          const slotElements = document.querySelectorAll(".slots-grid div");

          slotElements.forEach((slotEl, i) => {
            const slot = slots ? slots[i] : null;

            // If backend returns slot data, use it; otherwise just reset all to green
            if (!slot || !slot.booked) {
              slotEl.style.backgroundColor = "#00cc66"; // green
              slotEl.style.color = "#000";
            } else {
              slotEl.style.backgroundColor = "#ff4d4d"; // red
              slotEl.style.color = "#fff";
            }
          });

          console.log("✅ Slots refreshed and colors updated.");
        } catch (error) {
          console.error("❌ fetchSlots() FAILED:", error);
        }
      });
    } else {
      console.log("ℹ️ Refresh button not present on this page.");
    }


    // ======================================================
    // ⛓ VIEW BLOCKCHAIN LEDGER
    // ======================================================

    const viewLedger =
      document.getElementById(
        "view-ledger"
      );


    if (viewLedger) {

      viewLedger.addEventListener(
        "click",
        fetchChain
      );

    }


    // ======================================================
    // 📊 DASHBOARD INITIALIZATION
    // ======================================================

    const slots =
      document.getElementById(
        "slots"
      );


    if (slots) {

      console.log(
        "🚗 Dashboard detected"
      );


      // Load slots
      fetchSlots();


      // Load blockchain
      fetchChain();

    }

  }
);



function togglePassword(inputId, eyeId) {

    const input = document.getElementById(inputId);
    const eye = document.getElementById(eyeId);

    if (input.type === "password") {

        input.type = "text";

        eye.setAttribute(
            "src",
            "/static/images/view.png?t=" + new Date().getTime()
        );

    } else {

        input.type = "password";

        eye.setAttribute(
            "src",
            "/static/images/hide.png?t=" + new Date().getTime()
        );
    }
}