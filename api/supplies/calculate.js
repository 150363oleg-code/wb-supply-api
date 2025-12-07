export default function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Проверка API-ключа
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  const {
    analysisPeriodDays,
    daysUntilNextSupply,
    coverageDays,
    warehouse,
    excludedWarehouses
  } = req.body || {};

  // Простая валидация входных данных
  if (![7, 14, 30, 60].includes(analysisPeriodDays)) {
    return res.status(400).json({
      error: "analysisPeriodDays must be one of: 7, 14, 30, 60"
    });
  }
  if (typeof daysUntilNextSupply !== "number" || typeof coverageDays !== "number") {
    return res.status(400).json({
      error: "daysUntilNextSupply and coverageDays must be numbers"
    });
  }

  // Здесь должна быть твоя реальная логика.
  // Пока сделаем простой пример с "виртуальными" продажами.
  const soldInAnalysisPeriod = 100; // заглушка
  const averageDailyDemand = soldInAnalysisPeriod / analysisPeriodDays;
  const totalPeriodDays = daysUntilNextSupply + coverageDays;
  const forecastDemandTotalPeriod = averageDailyDemand * totalPeriodDays;
  const currentStock = 50; // заглушка
  const recommendedSupply = Math.max(
    0,
    Math.round(forecastDemandTotalPeriod - currentStock)
  );

  return res.status(200).json({
    totalSkus: 1,
    items: [
      {
        vendorCode: "TEST-001",
        productName: "Тестовый товар",
        soldInAnalysisPeriod,
        averageDailyDemand,
        forecastDemandTotalPeriod,
        currentStock,
        recommendedSupply
      }
    ],
    debug: {
      warehouse: warehouse || null,
      excludedWarehouses: excludedWarehouses || []
    }
  });
}
