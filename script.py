import re
import json

with open("grandmas_recipe_collection_1.md") as f:
    text = f.read()

recipes = []
blocks = re.split(r"\n---\n", text)

for block in blocks:
    title_match = re.search(r"## (.+)", block)
    if not title_match:
        continue

    title = title_match.group(1)

    def get(field):
        m = re.search(rf"\*\*{field}\*\*\s*\|\s*(.+)", block)
        return m.group(1).strip() if m else ""

    ingredients = re.findall(r"^- .+", block, re.MULTILINE)
    instructions = re.findall(r"^\d+\. .+", block, re.MULTILINE)

    recipes.append({
        "title": title,
        "category": get("Category"),
        "tags": get("Tags"),
        "ingredients": [i[2:] for i in ingredients],
        "instructions": instructions,
        "raw": block
    })

with open("recipes.json", "w") as f:
    json.dump(recipes, f, indent=2)
