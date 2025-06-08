document.addEventListener("DOMContentLoaded", async () => {
  console.log("Script loaded ✅");

  try {
    const response = await fetch("/data/pillars.json");
    const pillars = await response.json();
    console.log("Fetched pillars:", pillars);

    const container = document.getElementById("pillars");
    if (!container) {
      console.warn("⚠️ No #pillars element found");
      return;
    }

    pillars.forEach(pillar => {
      const card = document.createElement("a");
      card.href = pillar.link;
      card.className =
        "block p-6 rounded-xl border shadow hover:shadow-lg transition duration-300 bg-white";
      card.innerHTML = `
        <h3 class="text-2xl font-semibold mb-2">${pillar.name}</h3>
        <p class="text-gray-600">${pillar.description}</p>
      `;
      container.appendChild(card);
    });

    console.log("✅ Pillars rendered successfully");
  } catch (err) {
    console.error("❌ Error loading pillars:", err);
  }
});
