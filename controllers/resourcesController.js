const ResourceRepository = require('../data/database/ResourceRepository');

const resourceRepository = new ResourceRepository();

// Controller methods using the repository
exports.getAllResources = async (req, res) => {
  try {
    const resources = await resourceRepository.getAllResources();
    res.json({ resources });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getResourceById = async (req, res) => {
  const resourceId = req.params.id;

  try {
    const resource = await resourceRepository.getResourceById(resourceId);

    if (resource) {
      res.json({ resource });
    } else {
      res.status(404).json({ message: 'Resource not found.' });
    }
  } catch (error) {
    console.error('Error fetching resource by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.createResource = async (req, res) => {
  const { title, description, url, type, topic, author } = req.body;

  try {
    const newResource = await resourceRepository.createResource({
      title,
      description,
      url,
      type,
      topic,
      author,
    });

    res.status(201).json({ resource: newResource });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.updateResource = async (req, res) => {
  const resourceId = req.params.id;
  const updatedFields = req.body;

  try {
    const updatedResource = await resourceRepository.updateResource(
      resourceId,
      updatedFields,
    );

    if (updatedResource) {
      res.json({ resource: updatedResource });
    } else {
      res.status(404).json({ message: 'Resource not found.' });
    }
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.deleteResource = async (req, res) => {
  const resourceId = req.params.id;

  try {
    const deletedResource = await resourceRepository.deleteResource(resourceId);

    if (deletedResource) {
      res.json({ message: 'Resource deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Resource not found.' });
    }
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
