import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌸 Baby Step API Server running on port ${PORT}`);
  console.log(`👶 Endpoints:`);
  console.log(`   - GET http://localhost:${PORT}/api/products`);
  console.log(`   - GET http://localhost:${PORT}/health`);
});
