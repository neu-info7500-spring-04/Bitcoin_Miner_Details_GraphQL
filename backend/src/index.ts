import express from 'express';
import cors from 'cors'; // Import CORS module
import routes from './routes'; // Make sure this path is correct

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
