import React from 'react'
import PropTypes from 'prop-types'

export default function ValidationError(props){
  if(props.hasError) {
    return (
      <div className='error'>{props.error}</div>
    )
  }
  return <></>
}

ValidationError.propTypes = {
  hasError: PropTypes.boolean.isRequired,
  message: PropTypes.string.isRequired
}