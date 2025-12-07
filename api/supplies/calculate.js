export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = req.headers["x-api-key"];
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  const {
    analysisPeriodDays,
    daysUntilNextSupply,
    coverageDays
  } = req.body || {};

  const soldInAnalysisPeriod = 100;
  const avg = soldInAnalysisPeriod / analysisPeriodDays;
  const total = avg * (daysUntilNextSupply + coverageDays);

  const currentStock = 50;

  res.status(200).json({
    totalSkus: 1,
    items: [
      {
        vendorCode: "TEST-001",
        productName: "Тестовый товар",
        soldInAnalysisPeriod,
        averageDailyDemand: avg,
        forecastDemandTotalPeriod: total,
        currentStock,
        recommendedSupply: Math.max(0, Math.round(total - currentStock))
      }
    ]
  });
}

      warehouse: warehouse || null,
      excludedWarehouses: excludedWarehouses || []
    }
  });
}
