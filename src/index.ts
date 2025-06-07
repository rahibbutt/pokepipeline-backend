import express from 'express';
import cors from 'cors';
import {pokemonHandler, triggerPipelineHandler} from './routes/pokemon';

const app = express();
app.use(cors());

app.use('/api/pokemon', pokemonHandler);
app.use('/api/trigger-pipeline', triggerPipelineHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});