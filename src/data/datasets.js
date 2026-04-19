/**
 * Central dataset registry.
 *
 * To add a new dataset:
 * 1. Pick a unique id (kebab-case, e.g. "my-new-dataset")
 * 2. Add it to the appropriate category's `datasets` array below
 * 3. Add translations under the `datasets.<id>` key in both zh.json and en.json
 *    Required fields: name, desc, scale, tags, brief, structure
 *    Optional fields: paper { title, authors, venue, url }
 */

export const DATASET_CATEGORIES = [
  {
    key: 'expert',
    i18nKey: 'products.categories.expert',
    artifact: 'ExpertArtifact',
    datasets: ['hle', 'sfe', 'microvqa', 'crosslingual-k12qa'],
  },
  {
    key: 'multimodal',
    i18nKey: 'products.categories.multimodal',
    artifact: 'MultimodalArtifact',
    datasets: ['tri-modal', 'proactive-video', 'science-video-qa', 'chart-reasoning'],
  },
  {
    key: 'agent',
    i18nKey: 'products.categories.agent',
    artifact: 'AgentArtifact',
    datasets: ['browser', 'openclaw', 'search-eval'],
  },
];
