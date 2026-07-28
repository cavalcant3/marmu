import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // 100 requests por minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      type: "https://api.marmu.app/errors/rate-limit",
      title: "Rate Limit Exceeded",
      status: 429,
      detail: "Muitas requisições. Tente novamente em um minuto.",
    },
  },
});
