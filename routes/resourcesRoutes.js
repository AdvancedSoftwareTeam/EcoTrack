const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resourcesController');
const { authenticateUser } = require('../middlewares/authentication');

// GET all educational resources
router.get('/', resourcesController.getAllResources);

// GET resource by ID
router.get('/:resourceId', resourcesController.getResourceById);

// Search resources
router.get('/search', resourcesController.searchResources);

// Filter resources by topic
router.get('/topic/:topic', resourcesController.filterResourcesByTopic);

// Filter resources by type
router.get('/type/:type', resourcesController.filterResourcesByType);

// Add a new resource (requires authentication)
router.post('/', authenticateUser, resourcesController.addResource);

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

// GET popular resources
router.get('/popular', resourcesController.getPopularResources);

// GET recently added resources
router.get('/recent', resourcesController.getRecentResources);

module.exports = router;
