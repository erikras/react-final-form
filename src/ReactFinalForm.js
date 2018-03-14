// @flow
import * as React from 'react'
import PropTypes from 'prop-types'
import warning from './warning'
import {
  createForm,
  formSubscriptionItems,
  version as ffVersion
} from 'final-form'
import type {
  FormApi,
  Config,
  FormSubscription,
  FormState,
  Unsubscribe
} from 'final-form'
import type { FormProps as Props, ReactContext } from './types'
import shallowEqual from './shallowEqual'
import renderComponent from './renderComponent'
export const version = '3.1.3'

const versions = {
  'final-form': ffVersion,
  'react-final-form': version
}

export const all: FormSubscription = formSubscriptionItems.reduce(
  (result, key) => {
    result[key] = true
    return result
  },
  {}
)

type State = {
  state: FormState
}

export default class ReactFinalForm extends React.Component<Props, State> {
  context: ReactContext
  props: Props
  state: State
  form: FormApi
  mounted: boolean
  unsubscriptions: Unsubscribe[]

  static childContextTypes = {
    reactFinalForm: PropTypes.object
  }

  static displayName = `ReactFinalForm(${ffVersion})(${version})`

  constructor(props: Props) {
    super(props)
    const {
      debug,
      decorators,
      initialValues,
      mutators,
      onSubmit,
      subscription,
      validate,
      validateOnBlur
    } = props
    const config: Config = {
      debug,
      initialValues,
      mutators,
      onSubmit,
      validate,
      validateOnBlur
    }
    this.mounted = false
    try {
      this.form = createForm(config)
    } catch (e) {
      warning(false, e.message)
    }
    this.unsubscriptions = []
    if (this.form) {
      // set initial state
      let initialState: FormState
      this.form.subscribe((state: FormState) => {
        initialState = state
      }, subscription || all)()
      this.state = { state: initialState }
    }
    if (decorators) {
      decorators.forEach(decorator => {
        this.unsubscriptions.push(decorator(this.form))
      })
    }
  }

  getChildContext() {
    return {
      reactFinalForm: this.form
    }
  }

  notify = (state: FormState) => {
    if (this.mounted) {
      this.setState({ state })
    }
  }

  handleSubmit = (event?: SyntheticEvent<HTMLFormElement>) => {
    if (event && typeof event.preventDefault === 'function') {
      // sometimes not true, e.g. React Native
      event.preventDefault()
    }
    return this.form.submit()
  }

  componentWillMount() {
    if (this.form) {
      this.form.pauseValidation()
    }
  }

  componentDidMount() {
    if (this.form) {
      this.unsubscriptions.push(
        this.form.subscribe(this.notify, this.props.subscription || all)
      )
      this.form.resumeValidation()
    }
    this.mounted = true
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      nextProps.initialValues &&
      !shallowEqual(this.props.initialValues, nextProps.initialValues)
    ) {
      this.form.initialize(nextProps.initialValues)
    }
  }

  componentWillUnmount() {
    this.unsubscriptions.forEach(unsubscribe => unsubscribe())
  }

  render() {
    // remove config props
    const {
      debug,
      initialValues,
      mutators,
      onSubmit,
      subscription,
      validate,
      validateOnBlur,
      ...props
    } = this.props
    return renderComponent(
      {
        ...props,
        ...(this.state ? this.state.state : {}),
        mutators: this.form && this.form.mutators,
        batch: this.form && this.form.batch,
        blur: this.form && this.form.blur,
        change: this.form && this.form.change,
        focus: this.form && this.form.focus,
        handleSubmit: this.handleSubmit,
        initialize: this.form && this.form.initialize,
        reset: this.form && this.form.reset,
        __versions: versions
      },
      'ReactFinalForm'
    )
  }
}
