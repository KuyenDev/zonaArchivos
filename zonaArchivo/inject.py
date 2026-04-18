import os

base_dir = r"c:\Users\Admin\Desktop\Kuyén\zonaArchivo"

with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    index_html = f.read()

with open(os.path.join(base_dir, "pages", "lore.html"), "r", encoding="utf-8") as f:
    lore_html = f.read()

with open(os.path.join(base_dir, "pages", "factions.html"), "r", encoding="utf-8") as f:
    fac_html = f.read()

with open(os.path.join(base_dir, "pages", "entities.html"), "r", encoding="utf-8") as f:
    ent_html = f.read()

with open(os.path.join(base_dir, "pages", "monitor.html"), "r", encoding="utf-8") as f:
    mon_html = f.read()

index_html = index_html.replace("<!-- Lore -->", lore_html)
index_html = index_html.replace("<!-- Factions -->", fac_html)
index_html = index_html.replace("<!-- Entities -->", ent_html)
index_html = index_html.replace("<!-- Monitor -->", mon_html)

with open(os.path.join(base_dir, "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html)

print("Pages injected successfully into index.html")
