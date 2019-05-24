import React from 'react'
import { render, cleanup } from 'react-testing-library'
import { ErrorBoundary } from './testUtils'
import useFormState from './useFormState'

describe('useField', () => {
  afterEach(cleanup)

  // Most of the functionality of useFormState is tested in FormSpy.test.js
  // This file is only for testing its use as a hook in other components

  it('should warn if not used inside a form', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const errorSpy = jest.fn()
    const MyFormStateComponent = () => {
      useFormState()
      return <div />
    }
    render(
      <ErrorBoundary spy={errorSpy}>
        <MyFormStateComponent />
      </ErrorBoundary>
    )
    expect(errorSpy).toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy.mock.calls[0][0].message).toBe(
      'Warning: useFormState must be used inside of a <Form> component'
    )
    console.error.mockRestore()
  })
})
