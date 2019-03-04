/* tslint:disable: no-shadowed-variable */
import { Mutator } from 'final-form/dist'
import * as React from 'react'
import {
  Field,
  Form,
  ReactContext,
  ReactFinalFormContext,
  withReactFinalForm
} from './index'

const onSubmit = async (values: any) => {
  // tslint:disable-next-line no-console
  console.log(values)
}

// context
export interface FooWithContextProps {}

const FooWithContext = withReactFinalForm<FooWithContextProps>(
  (props: FooWithContextProps & ReactContext) => (
    <div>{props.reactFinalForm.blur}</div>
  )
)

const FooContextConsumer = () => (
  <ReactFinalFormContext.Consumer>
    {reactFinalForm => <div>{reactFinalForm.blur}</div>}
  </ReactFinalFormContext.Consumer>
)

// FIXME: uncomment when react-final-form switches to react >=16.6
class FooStaticContext extends React.Component<{}> {
  public static contextType = ReactFinalFormContext
  public render() {
    return <div>{this.context.blur}</div>
  }
}

function contextUsage() {
  return (
    <React.Fragment>
      <FooWithContext />
      <FooContextConsumer />
      <FooStaticContext />
    </React.Fragment>
  )
}

// basic
function basic() {
  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <Field
              name="firstName"
              component="input"
              type="text"
              placeholder="First Name"
            />
          </div>
        </form>
      )}
    </Form>
  )
}

// simple
function simple() {
  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit, reset, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="firstName"
            component="input"
            type="text"
            placeholder="First Name"
          />
          <button
            type="button"
            onClick={reset}
            disabled={submitting || pristine}
          >
            Reset
          </button>
          <button type="submit" disabled={submitting || pristine}>
            Submit
          </button>
          <pre>{JSON.stringify(values)}</pre>
        </form>
      )}
    </Form>
  )
}

function simpleSubscription() {
  return (
    <Form
      onSubmit={onSubmit}
      subscription={{
        pristine: true,
        submitting: true,
        values: true
      }}
    >
      {({ handleSubmit, reset, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <button
            type="button"
            onClick={reset}
            disabled={submitting || pristine}
          >
            Reset
          </button>
          <pre>{JSON.stringify(values)}</pre>
        </form>
      )}
    </Form>
  )
}

const setValue: Mutator = ([name, newValue], state, { changeValue }) => {
  changeValue(state, name, value => newValue)
}

function mutated() {
  return (
    <Form onSubmit={onSubmit} mutators={{ setValue }}>
      {({
        handleSubmit,
        mutators: { setValue },
        submitting,
        pristine,
        values
      }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="firstName"
            component="input"
            type="text"
            placeholder="First Name"
          />
          <button
            type="button"
            onClick={e => setValue('firstName', 'Kevin')}
            disabled={submitting || pristine}
          >
            Reset
          </button>
          <pre>{JSON.stringify(values)}</pre>
        </form>
      )}
    </Form>
  )
}
