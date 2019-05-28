const express = require('express')
const path = require('path')
const Service = require('./service')
const xss = require('xss')
const logger = require('../logger')
const router = express.Router()
const bodyParser = express.json()

//Rename table and array properties
const table = 'folders'
const properties = ['name']


//Rename properties and values
const serializeItem = item => ({
  id: item.id,
  name: xss(item.name)
})

router
  .route('')
  
  .get((req, res, next) => {
    Service.getAll(req.app.get('db'))
      .then(items => {
        res.json(items.map(serializeItem))
      })
      .catch(next)
  })

  .post(bodyParser, (req, res, next) => {
    const entries = Object.entries(req.body)
    let newItem = {}
    entries.map(entry => {
      newItem[entry[0]] = entry[1]
    })

    for (const field of properties) {
      if (!newItem[field]) {
        logger.error(`Table ${table}: ${field} is required`)
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        })
      }
    }

    // const error = getBookmarkValidationError(newBookmark)

    // if (error) return res.status(400).send(error)

    Service.insertItem(
      req.app.get('db'),
      newItem
    )
      .then(item => {
        logger.info(`Table ${table}: Item with id ${item.id} created.`)
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${item.id}`))
          .json(serializeItem(item))
      })
      .catch(next)
  })


router
  .route('/:item_id')

  .all((req, res, next) => {
    const { item_id } = req.params
    Service.getById(req.app.get('db'), item_id)
      .then(item => {
        if (!item) {
          logger.error(`Table ${table} with id ${item_id} not found.`)
          return res.status(404).json({
            error: { message: `Table ${table}: Item Not Found` }
          })
        }
        res.item = item
        next()
      })
      .catch(next)

  })

  .get((req, res) => {
    res.json(serializeItem(res.item))
  })

  .delete((req, res, next) => {
    const {item_id } = req.params
    Service.deleteItem(
      req.app.get('db'),
      item_id
    )
      .then(numRowsAffected => {
        logger.info(`Table ${table}: with id ${item_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(bodyParser, (req, res, next) => {
    let updatedFields = {}
    Object.entries(req.body).map(entry => {
      updatedFields[entry[0]] = entry[1]
    })

    let updatedItem = {}
    properties.forEach(prop => {
      updatedItem[prop] = updatedFields[prop]
    })


    const numberOfValues = Object.values(updatedItem).filter(Boolean).length
    if (numberOfValues === 0) {
      logger.error(`Invalid update without required fields`)
      return res.status(400).json({
        error: {
          message: `Request body must contain either ${properties}`
        }
      })
    }

    // const error = getBookmarkValidationError(bookmarkToUpdate)

    // if (error) return res.status(400).send(error)

    Service.updateItem(
      req.app.get('db'),
      req.params.item_id,
      updatedItem
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = router