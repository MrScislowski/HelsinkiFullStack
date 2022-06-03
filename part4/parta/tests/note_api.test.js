const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')



beforeEach(async () => {
  await Note.deleteMany({})
  
  // does not guarantee a specific execution order
  const noteObjects = helper.initialNotes.map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)

  // // does guarantee as pecific execution order
  // for (let rawNote of initialNotes) {
  //   const note = new Note(rawNote)
  //   await note.save()
  // }
})


test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)
  expect(contents).toContain(
    'Browser can execute only Javascript'
  )
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
    const response = await api.get('/api/notes')

  const contents = notesAtEnd.map(n => n.content)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})

test('note without content is not added', async () => {
  const newNote = {
    content: '',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)
  
  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
})

test('a specific note can be viewed', async () => {
  const allNotes = await helper.notesInDb()
  const selectedNote = allNotes[0]

  const returnedNote = await api
    .get(`/api/notes/${selectedNote.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const processedSelectedNote = JSON.parse(JSON.stringify(selectedNote))

    expect(returnedNote.body).toEqual(processedSelectedNote)
})

test('a specific note can be deleted', async () => {
  const allNotesBefore = await helper.notesInDb()
  const noteToDelete = allNotesBefore[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const allNotesAfter = await helper.notesInDb()

  expect(allNotesAfter).toHaveLength(allNotesBefore.length - 1)

  const allNotesContentAfter = allNotesAfter.map(n => n.content)

  expect(allNotesContentAfter).not.toContain(noteToDelete.content)
})


afterAll(() => {
  mongoose.connection.close()
})