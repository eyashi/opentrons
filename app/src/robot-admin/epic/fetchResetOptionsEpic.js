// @flow
import { ofType } from 'redux-observable'

import { GET } from '../../robot-api/constants'
import { mapToRobotApiRequest } from '../../robot-api/operators'
import * as Constants from '../constants'
import * as Actions from '../actions'
import * as Types from '../types'

import type { StrictEpic } from '../../types'
import type {
  ActionToRequestMapper,
  ResponseToActionMapper,
} from '../../robot-api/operators'

const mapActionToRequest: ActionToRequestMapper<Types.FetchResetConfigOptionsAction> = action => ({
  method: GET,
  path: Constants.RESET_CONFIG_OPTIONS_PATH,
})

const mapResponseToAction: ResponseToActionMapper<
  Types.FetchResetConfigOptionsAction,
  Types.FetchResetConfigOptionsDoneAction
> = (response, originalAction) => {
  const { host, body, ...responseMeta } = response
  const options: Array<Types.ResetConfigOption> = body.options
  const meta = { ...originalAction.meta, response: responseMeta }

  return response.ok
    ? Actions.fetchResetConfigOptionsSuccess(host.name, options, meta)
    : Actions.fetchResetConfigOptionsFailure(host.name, body, meta)
}

export const fetchResetOptionsEpic: StrictEpic<Types.FetchResetConfigOptionsDoneAction> = (
  action$,
  state$
) => {
  return action$.pipe(
    ofType(Constants.FETCH_RESET_CONFIG_OPTIONS),
    mapToRobotApiRequest(
      state$,
      a => a.payload.robotName,
      mapActionToRequest,
      mapResponseToAction
    )
  )
}
