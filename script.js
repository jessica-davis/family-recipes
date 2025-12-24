fetch("recipes.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("recipes");
    const search = document.getElementById("search");
    const tabs = document.getElementById("tabs");
    const categoryColors = {
        "Dessert": "#ec4899",
        "Main Dish": "#6366f1",
        "Appetizer": "#14b8a6",
        "Bread": "#f59e0b",
        "Soup": "#ef4444",
        "Salad": "#22c55e",
        "All": "#4f46e5"
      };
  

    let activeCategory = "All";

    const categories = [
      "All",
      ...new Set(data.map(r => r.category))
    ];

    // build tabs
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.textContent = cat;
      btn.className = "tab" + (cat === "All" ? " active" : "");
      btn.style.setProperty(
        "--tab-color",
        categoryColors[cat] || "#4f46e5"
      );
        btn.onclick = () => {
        activeCategory = cat;
        document
          .querySelectorAll(".tab")
          .forEach(t => t.classList.remove("active"));
        btn.classList.add("active");
        render();
      };
      tabs.appendChild(btn);
    });

    function render() {
      container.innerHTML = "";
      const filter = search.value.toLowerCase();

      data
        .filter(r =>
          (activeCategory === "All" || r.category === activeCategory) &&
          (
            r.title.toLowerCase().includes(filter) ||
            r.tags.toLowerCase().includes(filter) ||
            r.ingredients.join(" ").toLowerCase().includes(filter)
          )
        )
        .forEach(r => {
          const card = document.createElement("div");
          card.className = "card";
          card.style.setProperty(
            "--card-accent",
            categoryColors[r.category] || "#4f46e5"
          );
          

          card.innerHTML = `
            <h3>${r.title}</h3>
            <div class="tags">${r.tags}</div>
            <div class="details">
              <h4>Ingredients</h4>
              <ul>
                ${r.ingredients.map(i => `<li>${i}</li>`).join("")}
              </ul>
              <h4>Instructions</h4>
              <ol>
                ${r.instructions.map(i =>
                  `<li>${i.replace(/^\d+\. /, "")}</li>`
                ).join("")}
              </ol>
            </div>
          `;

          card.onclick = () => card.classList.toggle("open");
          container.appendChild(card);
        });
    }

    search.addEventListener("input", render);
    render();
  });
