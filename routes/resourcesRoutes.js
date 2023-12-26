const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesController');
const { authenticateUser } = require('../middlewares/authentication');

router.get('/', resourcesController.getAllResources);
router.get('/:resourceId', resourcesController.getResourceById);

// Filter resources by topic
router.get('/topic/:topic', resourcesController.filterResourcesByTopic);

// Filter resources by type
router.get('/type/:type', resourcesController.filterResourcesByType);

// Add a new resource (requires authentication)
router.post('/', authenticateUser, resourcesController.createResource);

// Update resource information (requires authentication)
router.put(
  '/:resourceId',
  authenticateUser,
  resourcesController.updateResource,
);

// Delete a resource (requires authentication)
router.delete(
  '/:resourceId',
  authenticateUser,
  resourcesController.deleteResource,
);

module.exports = router;
