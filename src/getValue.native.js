// @flow

const getValue = (
  event: SyntheticInputEvent<*>,
  currentValue: any,
  valueProp: any,
) => {
  if (event.nativeEvent) {
    return (event.nativeEvent: any).text
  }
}

export default getValue
