This is demo app for my medium article - https://medium.com/data-science-collective/building-an-e-commerce-support-ai-agent-with-agentforce-rag-routing-and-zero-vector-store-5d49e6149e09
# Stride Shoes 👟

A modern e-commerce shoe store website with an AI-powered customer support agent built on **Salesforce Agentforce**.

## Features

- **Product Catalog** — Browse running, casual, sport, and lifestyle shoes with filtering
- **Shopping Cart** — Add/remove items with a slide-out cart sidebar
- **AI Chat Agent** — Integrated Salesforce Agentforce chatbot for customer support
- **Responsive Design** — Mobile-friendly layout with hamburger navigation
- **Runtime Configuration** — Update Salesforce credentials via a settings UI or `.env` file

## Tech Stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js, Express
- **AI Integration:** Salesforce Agentforce API
- **Dependencies:** cors, dotenv, uuid

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- A Salesforce org with Agentforce enabled

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd stride-shoes
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the sample:
   ```bash
   cp .env.sample .env
   ```

4. Fill in your Salesforce credentials in `.env`:
   ```
   SF_MY_DOMAIN_URL=your-org.my.salesforce.com
   SF_CONSUMER_KEY=your-consumer-key
   SF_CONSUMER_SECRET=your-consumer-secret
   SF_AGENT_ID=your-agent-id
   PORT=3000
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
stride-shoes/
├── index.html      # Main HTML page
├── styles.css      # Stylesheet
├── app.js          # Frontend JavaScript (products, cart, chat UI)
├── server.js       # Express server & Salesforce Agentforce proxy
├── package.json    # Project metadata & dependencies
└── .env.sample     # Environment variable template
```

## Environment Variables

| Variable             | Description                              |
|----------------------|------------------------------------------|
| `SF_MY_DOMAIN_URL`   | Salesforce My Domain URL                 |
| `SF_CONSUMER_KEY`    | External Client App consumer key         |
| `SF_CONSUMER_SECRET` | External Client App consumer secret      |
| `SF_AGENT_ID`        | Agentforce agent ID                      |
| `PORT`               | Server port (default: 3000)              |

## License

MIT
