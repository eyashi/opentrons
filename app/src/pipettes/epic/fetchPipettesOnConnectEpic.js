// @flow
import { of } from 'rxjs'
import { filter, switchMap, withLatestFrom } from 'rxjs/operators'
import { ofType } from 'redux-observable'

import { getConnectedRobotName } from '../../robot/selectors'
import * as Actions from '../actions'

import type { StrictEpic } from '../../types'
import type { FetchPipettesAction, FetchPipetteSettingsAction } from '../types'

export const fetchPipettesOnConnectEpic: StrictEpic<
  FetchPipettesAction | FetchPipetteSettingsAction
> = (action$, state$) => {
  return action$.pipe(
    ofType('robot:CONNECT_RESPONSE'),
    withLatestFrom(state$, (a, s) => [a, getConnectedRobotName(s)]),
    filter(([action, robotName]) => robotName != null),
    switchMap(([action, robotName]) =>
      of(
        Actions.fetchPipettes(robotName),
        Actions.fetchPipetteSettings(robotName)
      )
    )
  )
}
