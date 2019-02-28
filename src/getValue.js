// @flow
const getSelectedValues = options => {
  const result = []
  if (options) {
    for (let index = 0; index < options.length; index++) {
      const option = options[index]
      if (option.selected) {
        result.push(option.value)
      }
    }
  }
  return result
}

const getValue = (
  event: SyntheticInputEvent<*>,
  currentValue: any,
  valueProp: any,
) => {
  if (
    event.nativeEvent &&
    (event.nativeEvent: Object).text !== undefined
  ) {
    return (event.nativeEvent: Object).text
  }

  const detypedEvent: any = event
  const { target: { type, value, checked } } = detypedEvent
  switch (type) {
    case 'checkbox':
      if (valueProp !== undefined) {
        // we are maintaining an array, not just a boolean
        if (checked) {
          // add value to current array value
          return Array.isArray(currentValue)
            ? currentValue.concat(valueProp)
            : [valueProp]
        } else {
          // remove value from current array value
          if (!Array.isArray(currentValue)) {
            return currentValue
          }
          const index = currentValue.indexOf(valueProp)
          if (index < 0) {
            return currentValue
          } else {
            return currentValue
              .slice(0, index)
              .concat(currentValue.slice(index + 1))
          }
        }
      } else {
        // it's just a boolean
        return !!checked
      }
    case 'select-multiple':
      return getSelectedValues((event.target: any).options)
    default:
      return value
  }
}

export default getValue
