# 🏡 Home Price Prediction

This is a simple app that predicts home prices based on user input such as square footage, number of bedrooms, and other features.

## 🚀 How to Run the App

There are **three ways** to run this app:

---

### 1. 🌐 Use the Deployed Version

The app is live and available here:

🔗 [https://home-price-prediction-gesmer.netlify.app](https://home-price-prediction-gesmer.netlify.app)

---

### 2. 🧑‍💻 Run Locally with Next.js

#### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)

1. Clone the repository:

```
git clone https://github.com/your-username/home-price-prediction.git
cd home-price-prediction
```

2. Create a `.env` file at the root with the following contents:

```
NEXT_PUBLIC_SUPABASE_URL=<REPLACE_WITH_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<REPLACE_WITH_SUPABASE_API_KEY>
```

3. Install dependencies and run:

```
npm i
npm run dev
```

App will be available at `localhost:3000`

---

### 3. 🐳 Run Locally with Docker

#### Prerequisites

- [Docker](https://www.docker.com/get-started/) is installed

1. Create a `.env` file at the root with the following contents:

```
NEXT_PUBLIC_SUPABASE_URL=<REPLACE_WITH_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<REPLACE_WITH_SUPABASE_API_KEY>
```

2. Build image:

```
docker build -t home-price-prediction .
```

3. Run container:

```
docker run -p 3000:3000 home-price-prediction
```

App will be available at `localhost:3000`
