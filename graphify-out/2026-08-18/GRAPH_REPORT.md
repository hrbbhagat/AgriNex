# Graph Report - AgriNex  (2026-08-14)

## Corpus Check
- 18 files · ~28,631 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 87 nodes · 83 edges · 17 communities (13 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `deb9a9f2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_AgriNex - Smart Agricultural Intelligence System|AgriNex - Smart Agricultural Intelligence System]]
- [[_COMMUNITY_App.js|App.js]]
- [[_COMMUNITY_manifest.json|manifest.json]]
- [[_COMMUNITY_Installation|Installation]]
- [[_COMMUNITY_Datasets|Datasets]]
- [[_COMMUNITY_🛠️ Tech Stack|🛠️ Tech Stack]]
- [[_COMMUNITY_webapp.py|webapp.py]]
- [[_COMMUNITY_💻 Usage Examples|💻 Usage Examples]]
- [[_COMMUNITY_📊 Model Details|📊 Model Details]]
- [[_COMMUNITY_🐛 Troubleshooting|🐛 Troubleshooting]]
- [[_COMMUNITY_graphify|graphify.md]]
- [[_COMMUNITY_graphify|graphify.md]]
- [[_COMMUNITY_main.py|main.py]]
- [[_COMMUNITY_fert.py|fert.py]]

## God Nodes (most connected - your core abstractions)
1. `AgriNex - Smart Agricultural Intelligence System` - 18 edges
2. `🛠️ Tech Stack` - 6 edges
3. `Installation` - 6 edges
4. `Datasets` - 4 edges
5. `📊 Model Details` - 4 edges
6. `💻 Usage Examples` - 4 edges
7. `🐛 Troubleshooting` - 4 edges
8. `App()` - 3 edges
9. `ImageUpload()` - 3 edges
10. `model_prediction()` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (17 total, 4 thin omitted)

### Community 0 - "AgriNex - Smart Agricultural Intelligence System"
Cohesion: 0.12
Nodes (15): AgriNex - Smart Agricultural Intelligence System, 🔧 Configuration, 🤝 Contributing, Crop Prediction, 📈 Dataset Information, 📦 Dependencies, ✨ Features, 🌱 Future Enhancements (+7 more)

### Community 1 - "App.js"
Cohesion: 0.31
Nodes (5): App(), ColorButton, ImageUpload(), useStyles, reportWebVitals()

### Community 2 - "manifest.json"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 3 - "Installation"
Cohesion: 0.25
Nodes (8): 1. Clone the Repository, 2. Setup Crop Recommendation Service, 3. Setup Plant Disease Identification Service, 4. Setup Fertilizer Prediction Service, 5. Setup React Frontend (Optional), 🚀 Getting Started, Installation, Prerequisites

### Community 4 - "Datasets"
Cohesion: 0.29
Nodes (6): 1. **Crop Recommendation Dataset**, 2. **Plant Disease Identification Dataset**, 3. **Fertilizer Recommendation Dataset**, Datasets, How to Use the Datasets, Smart Farming Assistant

### Community 5 - "🛠️ Tech Stack"
Cohesion: 0.33
Nodes (6): Backend & ML Services, Data Processing & Visualization, Datasets, Frontend, Machine Learning & AI, 🛠️ Tech Stack

### Community 7 - "💻 Usage Examples"
Cohesion: 0.50
Nodes (4): Crop Recommendation, Disease Detection, Fertilizer Recommendation, 💻 Usage Examples

### Community 8 - "📊 Model Details"
Cohesion: 0.50
Nodes (4): Crop Recommendation Model, Fertilizer Prediction Model, 📊 Model Details, Plant Disease Detection Model

### Community 9 - "🐛 Troubleshooting"
Cohesion: 0.50
Nodes (4): Missing Dependencies, Model Loading Issues, Streamlit Port Already in Use, 🐛 Troubleshooting

### Community 13 - "main.py"
Cohesion: 0.83
Nodes (3): load_disease_model(), model_prediction(), render_prediction_ui()

## Knowledge Gaps
- **47 isolated node(s):** `name`, `short_name`, `start_url`, `display`, `background_color` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AgriNex - Smart Agricultural Intelligence System` connect `AgriNex - Smart Agricultural Intelligence System` to `Installation`, `🛠️ Tech Stack`, `💻 Usage Examples`, `📊 Model Details`, `🐛 Troubleshooting`?**
  _High betweenness centrality (0.207) - this node is a cross-community bridge._
- **Why does `🚀 Getting Started` connect `Installation` to `AgriNex - Smart Agricultural Intelligence System`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `🛠️ Tech Stack` connect `🛠️ Tech Stack` to `AgriNex - Smart Agricultural Intelligence System`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **What connects `name`, `short_name`, `start_url` to the rest of the system?**
  _48 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AgriNex - Smart Agricultural Intelligence System` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._