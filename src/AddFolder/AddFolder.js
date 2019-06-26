import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import ValidationError from '../ValidationError/ValidationError'
import PropTypes from 'prop-types'
import ApiContext from '../ApiContext'
import config from '../config'
import './AddFolder.css'

export default class AddFolder extends Component {
  static contextType = ApiContext;
  constructor(props){
    super(props)
    this.state = {
      name: '',
      nameValid: false,
      formValid: false,
      hasError: false,
      validationMessages: {
        name: ''
      }
    }
  }

  setName(name) {
    this.setState({ name }, () => this.validateName(name))
  }

  validateName(folder){
    const fieldErrors = { ...this.state.validationMessages }
    let nameValid = true
    let hasError = false

    folder = folder.replace(/[\s-]/g, '')
    if(folder.length < 3 || folder.length === 0){
      fieldErrors.name = 'Folder name must be at least three characters long'
      nameValid = false
      hasError = true
    } 
    else {
      fieldErrors.name = ''
      nameValid = true
      hasError = false
    }
    this.setState({ validationMessages: fieldErrors, nameValid: !hasError }, this.formValid);
  }

  formValid(){
    this.setState({
      formValid: this.state.nameValid
    })
  }

  handleSubmit = e => {
    console.log('handleSubmit ran')
    e.preventDefault()
    const folder = {
      name: e.target['folder-name'].value
    }
    console.log(folder)
    fetch(`${config.API_ENDPOINT}/api/folders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(folder),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(folder => {
        this.context.addFolder(folder)
        this.props.history.push(`/folders/${folder.id}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { nameValid, validationMessages } = this.state
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
              {!nameValid && (
            <p className="error">{validationMessages.name}</p>
              )}</label>
            <input type='text' id='folder-name-input' name='folder-name' onChange={e => this.setName(e.target.value)} />
            <ValidationError hasError={!this.state.nameValid} message={this.state.validationMessages.name}/>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={!this.state.formValid}>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}

AddFolder.propTypes = {
  value: PropTypes.string.isRequired
}
AddFolder.defaultProps = {
  value: 'Folder'
}