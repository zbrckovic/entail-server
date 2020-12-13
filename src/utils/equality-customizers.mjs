import moment from 'moment'

// Used as a customizer for `lodash` `equals` function whenever some objects are compared which
// contain `moment` instances.
export const createMomentEqualityCustomizer = granularity => (value1, value2) => {
  if (moment.isMoment(value1) && moment.isMoment(value2)) {
    return value1.isSame(value2, granularity)
  }
}
