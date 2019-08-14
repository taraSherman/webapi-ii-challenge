const express = require('express');

const posts = require('../data/db.js');

const router = express.Router();


// add post to db
router.post('/', (req, res) => {
  //define title and contents as request body
  const { title, contents } = req.body;
  // if title or contents are missing
  if (!title || !contents) {
    // respond with bad request status and JSON error message
    res.status(400).json({
      errorMessage: 'Please provide title and contents for the post.'
    })
    //otherwise
  } else {
    // insert post object
    posts.insert(req.body)
    .then(post => {
      // and respond with status created and the new post
      res.status(201).json(post)
    })
    .catch(err => {
      // if there is an error, respond with  a status of internal server error and a JSON message
      res.status(500).json( { error: 'There was an error while saving the post to the database'})
    })
  }
})

// add a comment to a post
router.post('/:id/comments', (req, res) => {
  const commentInfo = req.body;
  const post_id = req.body.id;

  if (!post_id || !commentInfo.text) {
    res.status(404);
      if (!post_id) {
        res.json({
          message: 'The post with the specified ID does not exist.'
        })
      } else if (!commentInfo.text) {
        res.json({
          errorMessage: 'Please provide text for the comment.'
        })
      }
    } else {
      posts.insertComment(commentInfo)
      .then(id => {
        posts.findCommentById(id.id).then(comment => {
          res.status(201).json(comment);
        })
      })
      .catch(err => {
        res.status(500).json({
          errorMessage: 'There was an error while saving the comment to the database.'
        })
      })
    }
});

// GET specific post by ID
router.get('/:id', (req, res) => {
  posts.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: 'The post information could not be retrieved.'
      })
    })
})

// get all post objects on the server
router.get('', (req, res) => {
  // request an array of all posts in the db
  posts.find()
  .then(posts => {
    //respond with the array of posts
    res.json(posts)
  })
  .catch(err => {
    // if an error, respond with internal server error and json error message
    res.status(500).json({
      error: 'The posts information could not be retrieved.'
    })
  })
})

// get comments on a specific post
router.get('/:id/comments', (req, res) => {
  const post_id = req.params.id;
  posts.findPostComments(post_id)
    .then(comments => {
      if (comments) {
        res.status(200).json(comments);
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: 'The comments information could not be retrieved.'
      });
    });
});



// DELETE a post
router.delete('/:id', (req, res) => {
  const { id } = req.params
    posts.remove(id)
    .then(postToBeDeleted => {
      if (postToBeDeleted) {
        res.json(postToBeDeleted)
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist.'
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        err: err,
        message: 'The post could not be removed.'
      })
    })
})

// update a post
router.put('/:id', (req, res) => {
  // define request body and id
  const changes = req.body;
  const { title, contents } = req.body;
  const { id } = req.params;
  // request to update id & changes to be made parameters
  if (!title || !contents) {
    //respond with 'bad request' status and json error message
    res.status(400).json({ errorMessage: 'Please provide title and contents for the post.'})
  } else {
    posts.update(id, changes)
    .then(post => {
      if (post) {
        res.status(200).json(changes)
      } else {
        res.status(404).json({ message: 'The post with the specified ID does not exist.'})
      }
    })
    // if there is an error updating post,
    .catch(err => {
      // return 'internal server error' status and json error message
      res.status(500).json({ error: 'The post information could not be modified.'})
    })
  };
});



module.exports = router;