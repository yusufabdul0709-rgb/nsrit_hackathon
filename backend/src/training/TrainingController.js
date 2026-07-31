const KnowledgeTrainer = require('./KnowledgeTrainer');

class TrainingController {
  static async runTraining(req, res) {
    try {
      const { fileName } = req.body;
      const targetFile = fileName || 'APSRTC_Transport_Data.csv';
      
      const result = await KnowledgeTrainer.trainFromCSV(targetFile);
      res.json({ message: 'Training pipeline executed successfully', result });
    } catch (error) {
      console.error('Training Error:', error);
      res.status(500).json({ error: 'Failed to execute training pipeline', details: error.message });
    }
  }
}

module.exports = TrainingController;
