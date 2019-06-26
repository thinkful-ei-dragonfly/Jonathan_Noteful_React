import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ValidationError from '../ValidationError/ValidationError'
import PropTypes from 'prop-types'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddNote.css'

export default class AddNote extends Component {
  static contextType = ApiContext || {}
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      content: '',
      nameValid: false,
      contentValid: false,
      formValid: false,
      hasError: false,
      validationMessages: {
        name: '',
        content: ''
      }
    }
  }

  setName(name) {
    this.setState({ name }, () => this.validateName(name));
  }
  setContent(content) {
    this.setState({ content }, () => this.validateContent(content))
  }
  validateName(name) {
    const fieldErrors = { ...this.state.validationMessages };
    let nameValid = true;
    let hasError = false

    name = name.replace(/[\s-]/g, '')
    if (name.length === 0 || name.length < 5) {
      fieldErrors.name = "Name needs to be at least 5 characters long"
      this.nameValid = false
      hasError = true
    } else {
      fieldErrors.name = ''
      this.nameValid = true
      hasError = false
    }
    this.setState({ validationMessages: fieldErrors, nameValid: !hasError }, this.formValid)
  }
  validateContent(content) {
    const fieldErrors = { ...this.state.validationMessages }
    let contentValid = true;
    let hasError = false

    content = content.replace(/[\s-]/g, '')
    if (content.length === 0) {
      fieldErrors.content = 'Note content cannot be empty';
      contentValid = false;
      hasError = true;
    }
    else {
      if (content.length < 10) {
        fieldErrors.content = "Note must be at least 10 characters long";
        contentValid = false;
        hasError = true;
      }
      fieldErrors.content = ''
      contentValid = true;
      hasError = false;
    }
    this.setState({ validationMessages: fieldErrors, contentValid: !hasError }, this.formValid)
  }
  formValid() {
    this.setState({
      formValid: this.state.nameValid
    });
  }

  handleSubmit = e => {
    e.preventDefault()
    const newNote = {
      name: e.target['note-name'].value,
      content: e.target['note-content'].value,
      folder_id: e.target['note-folder-id'].value,
      modified: new Date(),
    }
    console.log(newNote)
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/folders/${note.folder_id}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { name, folder, content, folderValid, contentValid, nameValid, validationMessages } = this.state
    const { folders } = this.context
    const folderArray = folders.map(folder => {
      return (
        <option value={folder.id} key={folder.id}>
          {folder.name}
        </option>
      )
    })
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name} />
            <label htmlFor='note-name-input'>
              Name
              {!nameValid && (
                <p className="error">{validationMessages.name}</p>
              )}
            </label>
            <input type='text' id='note-name-input' name='note-name' onChange={e => this.setName(e.target.value)} />
          </div>
          <div className='field'>
            <ValidationError hasError={!this.state.contentValid} message={this.state.validationMessages.content} />
            <label htmlFor='note-content-input'>
              Content
              {!contentValid && (
                <p className='error'>{validationMessages.content}</p>
              )}
            </label>
            <textarea id='note-content-input' name='note-content' onChange={e => this.setContent(e.target.value)} />
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
              {!folderValid && (
                <p className="error">{validationMessages.folder}</p>
              )}
            </label>
            <select id='note-folder-select' name='note-folder-id'>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={!this.state.formValid}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
AddNote.propTypes = {
  folder_id: PropTypes.string.isRequired,
}
AddNote.defaultProps = {
  value: 'Note Name',
  folder_id: '12345',
  content: 'foo bar bizz buzz'
}