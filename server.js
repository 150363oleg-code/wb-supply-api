const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Ваш API-ключ
const API_KEY = process.env.API_KEY || "secret-key";

// Проверка API KEY
function checkApiKey(req, res, next) {
    const key = req.headers["x-api-key"];
    if (!key || key !== API_KEY) {
        return res.status(401).json({ error: "Invalid or missing API key" });
    }
    next();
}

// Пример расчёта поставок
app.post("/api/supplies/calculate", checkApiKey, (req, res) => {
    const {
        analysisPeriodDays,
        daysUntilNextSupply,
        coverageDays,
        warehouse,
        excludedWarehouses
    } = req.body;

    // Пример базового ответа
    res.json({
        totalSkus: 1,
        items: [
            {
                vendorCode: "TEST-001",
                productName: "Тестовый товар",
                soldInAnalysisPeriod: 100,
                averageDailyDemand: 100 / analysisPeriodDays,
                forecastDemandTotalPeriod:
                    (100 / analysisPeriodDays) * (daysUntilNextSupply + coverageDays),
                currentStock: 50,
                recommendedSupply: 20
            }
        ]
    });
});

// Порт нужен для Render
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
