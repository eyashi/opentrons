// @flow
import { forBlowout } from '../getNextRobotStateAndWarnings/forBlowout'
import {
  makeContext,
  getRobotStateWithTipStandard,
  DEFAULT_PIPETTE,
  SOURCE_LABWARE,
  createDraftStateFixture,
} from './fixtures'

let invariantContext
let robotStateWithTip
let params

beforeEach(() => {
  invariantContext = makeContext()
  robotStateWithTip = getRobotStateWithTipStandard(invariantContext)

  params = {
    pipette: DEFAULT_PIPETTE,
    labware: SOURCE_LABWARE,
    well: 'A1',
    flowRate: 21.1,
    offsetFromBottomMm: 1.3,
  }
})

describe('Blowout command', () => {
  describe('liquid tracking', () => {
    test('blowout updates with max volume of pipette', () => {
      robotStateWithTip.liquidState.pipettes.p300SingleId['0'] = {
        ingred1: { volume: 150 },
      }

      const initialStateWithTipAndWarnings = {
        warnings: [],
        robotState: robotStateWithTip,
      }

      const result = createDraftStateFixture(
        initialStateWithTipAndWarnings,
        params,
        invariantContext,
        forBlowout
      )

      expect(result).toMatchObject({
        robotState: {
          liquidState: {
            pipettes: {
              p300SingleId: {
                '0': {
                  ingred1: { volume: 0 },
                },
              },
            },
            labware: {
              sourcePlateId: {
                A1: { ingred1: { volume: 150 } },
              },
            },
          },
        },
      })
    })
  })
})
