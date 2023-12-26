const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'ecotrack', // Change this to your actual database name
});

class ResourceRepository {
  getAllResources() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Resources', (error, results) => {
        if (error) {
          reject('Error fetching resources from the database.');
        } else {
          resolve(results);
        }
      });
    });
  }

  getResourceById(resourceId) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM Resources WHERE resourceId = ?',
        [resourceId],
        (error, results) => {
          if (error) {
            reject('Error fetching resource from the database.');
          } else {
            resolve(results.length > 0 ? results[0] : null);
          }
        },
      );
    });
  }

  createResource({ title, description, url, type, topic, author }) {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO Resources (title, description, url, type, topic, author) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, url, type, topic, author],
        (error, results) => {
          if (error) {
            reject('Error creating resource in the database.');
          } else {
            const newResourceId = results.insertId;
            resolve({
              resourceId: newResourceId,
              title,
              description,
              url,
              type,
              topic,
              author,
            });
          }
        },
      );
    });
  }

  updateResource(resourceId, updatedFields) {
    return new Promise((resolve, reject) => {
      const updateQuery = 'UPDATE Resources SET ? WHERE resourceId = ?';
      db.query(updateQuery, [updatedFields, resourceId], (error, results) => {
        if (error) {
          reject('Error updating resource in the database.');
        } else if (results.affectedRows === 0) {
          resolve(null); // No rows affected means the resource was not found
        } else {
          resolve({ resourceId, ...updatedFields });
        }
      });
    });
  }

  deleteResource(resourceId) {
    return new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM Resources WHERE resourceId = ?',
        [resourceId],
        (error, results) => {
          if (error) {
            reject('Error deleting resource from the database.');
          } else if (results.affectedRows === 0) {
            resolve(null); // No rows affected means the resource was not found
          } else {
            resolve({ resourceId });
          }
        },
      );
    });
  }
}

module.exports = ResourceRepository;
