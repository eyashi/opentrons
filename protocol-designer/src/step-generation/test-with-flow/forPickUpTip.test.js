// @flow
import merge from 'lodash/merge'
import {
  getRobotStateAndWarningsStandard,
  makeContext,
  getTipColumn,
  DEFAULT_PIPETTE,
  createDraftStateFixture,
} from './fixtures'
import { forPickUpTip } from '../getNextRobotStateAndWarnings/forPickUpTip'

import { dispenseUpdateLiquidState } from '../getNextRobotStateAndWarnings/dispenseUpdateLiquidState'

jest.mock('../getNextRobotStateAndWarnings/dispenseUpdateLiquidState')

const tiprack1Id = 'tiprack1Id'
const p300SingleId = DEFAULT_PIPETTE
const p300MultiId = 'p300MultiId'
let invariantContext
let initialRobotState

beforeEach(() => {
  invariantContext = makeContext()
  initialRobotState = getRobotStateAndWarningsStandard(invariantContext)

  // $FlowFixMe: mock methods
  dispenseUpdateLiquidState.mockClear()
  // $FlowFixMe: mock methods
  dispenseUpdateLiquidState.mockReturnValue(initialRobotState.liquidState)
})

describe('tip tracking', () => {
  test('single-channel', () => {
    const params = { pipette: p300SingleId, labware: tiprack1Id, well: 'A1' }

    const result = createDraftStateFixture(
      initialRobotState,
      params,
      invariantContext,
      forPickUpTip
    )

    expect(result.warnings).toEqual([])
    expect(result.robotState).toEqual(
      merge({}, initialRobotState.robotState, {
        tipState: {
          tipracks: {
            [tiprack1Id]: {
              A1: false,
            },
          },
          pipettes: {
            [p300SingleId]: true,
          },
        },
      })
    )
  })

  test('multi-channel', () => {
    const params = {
      pipette: p300MultiId,
      labware: 'tiprack1Id',
      well: 'A1',
    }
    const result = createDraftStateFixture(
      initialRobotState,
      params,
      invariantContext,
      forPickUpTip
    )

    expect(result.warnings).toEqual([])
    expect(result.robotState).toEqual(
      merge({}, initialRobotState.robotState, {
        tipState: {
          tipracks: {
            [tiprack1Id]: getTipColumn(1, false),
          },
          pipettes: {
            [p300MultiId]: true,
          },
        },
      })
    )
  })

  // TODO: Ian 2019-11-20 eventually should generate warning (or error?)
  test.skip('multi-channel, missing tip in specified row', () => {})
})
