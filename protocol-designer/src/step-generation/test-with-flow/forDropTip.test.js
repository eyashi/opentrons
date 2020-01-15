// @flow
import {
  makeStateArgsStandard,
  makeContext,
  makeState,
  DEFAULT_PIPETTE,
  FIXED_TRASH_ID,
  createDraftStateFixture,
} from './fixtures'
import { forDropTip } from '../getNextRobotStateAndWarnings/forDropTip'

describe('dropTip', () => {
  let invariantContext

  beforeEach(() => {
    invariantContext = makeContext()
  })

  // TODO Ian 2019-04-19: this is a ONE-OFF fixture
  function makeRobotAndWarningsState(args: {
    singleHasTips: boolean,
    multiHasTips: boolean,
  }) {
    let _robotState = makeState({
      ...makeStateArgsStandard(),
      invariantContext,
      tiprackSetting: { tiprack1Id: true },
    })
    _robotState.tipState.pipettes.p300SingleId = args.singleHasTips
    _robotState.tipState.pipettes.p300MultiId = args.multiHasTips
    return {
      warnings: [],
      robotState: _robotState,
    }
  }

  describe('replaceTip: single channel', () => {
    test('drop tip if there is a tip', () => {
      const prevRobotState = makeRobotAndWarningsState({
        singleHasTips: true,
        multiHasTips: true,
      })
      const params = {
        pipette: DEFAULT_PIPETTE,
        labware: FIXED_TRASH_ID,
        well: 'A1',
      }

      const result = createDraftStateFixture(
        prevRobotState,
        params,
        invariantContext,
        forDropTip
      )

      expect(result).toEqual(
        makeRobotAndWarningsState({ singleHasTips: false, multiHasTips: true })
      )
    })

    // TODO: IL 2019-11-20
    test.skip('no tip on pipette', () => {})
  })

  describe('Multi-channel dropTip', () => {
    test('drop tip when there are tips', () => {
      const prevRobotState = makeRobotAndWarningsState({
        singleHasTips: true,
        multiHasTips: true,
      })
      const params = {
        pipette: 'p300MultiId',
        labware: FIXED_TRASH_ID,
        well: 'A1',
      }

      const result = createDraftStateFixture(
        prevRobotState,
        params,
        invariantContext,
        forDropTip
      )

      expect(result).toEqual(
        makeRobotAndWarningsState({ singleHasTips: true, multiHasTips: false })
      )
    })

    // TODO: IL 2019-11-20
    test.skip('no tip on pipette', () => {})
  })

  describe('liquid tracking', () => {
    test('dropTip calls dispenseUpdateLiquidState with useFullVolume: true', () => {
      const prevRobotState = makeRobotAndWarningsState({
        singleHasTips: true,
        multiHasTips: true,
      })
      const params = {
        pipette: 'p300MultiId',
        labware: FIXED_TRASH_ID,
        well: 'A1',
      }
      prevRobotState.robotState.liquidState.pipettes.p300MultiId['0'] = {
        ingred1: { volume: 150 },
      }

      const result = createDraftStateFixture(
        prevRobotState,
        params,
        invariantContext,
        forDropTip
      )

      expect(result).toMatchObject({
        robotState: {
          liquidState: {
            pipettes: {
              p300MultiId: {
                '0': {
                  ingred1: { volume: 0 },
                },
              },
            },
            labware: {
              [FIXED_TRASH_ID]: {
                A1: { ingred1: { volume: 150 } },
              },
            },
          },
        },
      })
    })
  })
})
