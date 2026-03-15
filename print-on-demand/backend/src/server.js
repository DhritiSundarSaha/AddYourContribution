import { app } from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

connectDb()
  .then(() => {
    app.listen(env.port, () => console.log(`Server running on :${env.port}`));
  })
  .catch((error) => {
    console.error('Startup failure', error);
    process.exit(1);
  });
