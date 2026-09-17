# 🍳 KitchenSync AI — Smart Kitchen Assistant & Bio-Nutrition Companion

> **The Zero-Effort Kitchen & Biological Fuel Management System**  
> Designed for *The Busy Health-Conscious Professional*.

Traditional apps like MyFitnessPal require tedious manual searching, weighing, and typing. Static recipe databases like SuperCook don't understand biological context or dynamic flavor profiles. **KitchenSync AI** replaces manual data entry with computer vision, persistent virtual pantry tracking with auto-deduction, and generative cuisine morphing.

---

## 🌟 6 Killer Features

### 1. 📸 "Zero-Entry" Visual Calorie Estimation
- **The Problem:** Weighing chicken breasts and guessing gram counts (e.g., 150g vs 200g) causes user friction and abandonment.
- **The Feature:** Snap a photo of your cooked plate. The AI uses computer vision plate calibration (estimating plate diameter and volume density) to segment food components (*Salmon: 175g, Brown Rice: 130g, Broccoli: 115g*) and logs calories and macros with one click—no typing required.

### 2. 🧊 "Smart-Pantry" Persistence (Virtual Fridge)
- **The Problem:** Food spoils in the back of the fridge because people forget what they bought.
- **The Feature:** Real-time virtual fridge organized by storage zone (*Produce, Dairy/Protein, Pantry, Freezer, Spices*).
- **Use-it-or-Lose-it Alerts:** Color-coded badges highlight perishables expiring in $\le 2$ days with direct 1-click recipe triggers to prevent food waste.
- **Auto-Deduction Engine:** When you cook a recipe, used ingredients are automatically decremented from your inventory (e.g. used 2 eggs from carton of 6 $\rightarrow$ 4 left).

### 3. 🌶️ "Cuisine Morphing" (Dynamic Ingredient Swapping)
- **The Problem:** You have the ingredients for a stir-fry, but you're in the mood for Italian.
- **The Feature:** A dynamic **Style Morph** selector. Once the app identifies your base ingredients (e.g., Chicken Breast, Bell Peppers, Onions, Spinach), switch cuisines on the fly:
  - 🇬🇷 **Mediterranean**: Extra-virgin olive oil, lemon zest, oregano, crumbled feta.
  - 🇲🇽 **Tex-Mex Cantina**: Cumin, smoked paprika, fresh lime, black beans.
  - 🇯🇵 **East Asian Wok**: Tamari, fresh ginger matchsticks, scallions, sesame seeds.
  - 🇮🇹 **Tuscan Herb**: Blistered cherry tomatoes, rosemary, balsamic glaze, garlic.
  - 🇮🇳 **Indian Spiced Tikka**: Golden turmeric, garam masala, cooling Greek yogurt swirl.
- Dynamically adjusts flavor profiles, cooking techniques, and accent spices.

### 4. 🍽️ "Visual Recipe Preview" & Guided Cooking Mode
- Generates realistic plating visualizations reflecting the exact ingredients and morph style.
- Interactive **Guided Cooking Mode** with step-by-step instructions, chef's tips, active skillet countdown timer, and confetti celebrations upon completion.

### 5. ⌚ The "Bio-Sync" Recommendation Engine
- Integrates with wearable biometric telemetry (Apple Health, Garmin, Whoop, Oura).
- **Dynamic Biological States:**
  - 🏃‍♂️ **Post-Workout HIIT** (e.g. 640 kcal burned): Boosts calorie budget (+450 kcal), prioritizes glycogen replenishment & 40g+ protein.
  - 💻 **Sedentary Focus Day**: Reduces target (-250 kcal), focuses on low-glycemic greens & healthy fats.
  - 😴 **Low Sleep & Recovery** (depressed HRV): Targets anti-inflammatory magnesium, tryptophan, and omega-3s.
  - 🏋️ **Hypertrophy Bulking**: Optimized for muscle protein synthesis and leucine-dense protein.

### 6. 🔬 "Recipe Reverse-Engineering" for Calories
- **The Problem:** You see a delicious meal on Instagram or TikTok, but restaurant versions are 1,500+ kcal fat bombs.
- **The Feature:** Upload any food screenshot or select viral presets. The AI deconstructs the dish, exposes heavy culprits (heavy cream, stick of butter, refined flours), and builds a **Healthified Fridge Remix** using what's in your Virtual Fridge to cut calories by 50–65%.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + PostCSS
- **Icons:** Lucide React
- **Animations & Effects:** Canvas Confetti, CSS Radar Keyframes
- **State & Persistence:** LocalStorage API with real-time reactivity

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/briankemei/smart-kitchen-assistant.git
cd smart-kitchen-assistant

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Project Structure

```
smart-kitchen-assistant/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types/               # Core TypeScript interfaces for all 6 pillars
│   ├── data/                # Initial pantry, recipes, CV scans, BioSync profiles
│   ├── utils/               # LocalStorage persistence & auto-deduction logic
│   └── components/
│       ├── Layout/          # Navbar & branding
│       ├── Dashboard/       # BioSyncWidget, MacroRings, UseItOrLoseItBanner
│       ├── Pantry/          # VirtualFridge, PantryItemCard, AddItemModal
│       ├── Chef/            # CuisineMorpher, CookingModeModal
│       ├── Scanner/         # VisualCalorieScanner (CV plate viewport)
│       └── ReverseEngineer/ # DishDeconstructor (Social meal remix)
```

---

## 📜 License
MIT License. Built with ❤️ for busy, health-conscious professionals.
