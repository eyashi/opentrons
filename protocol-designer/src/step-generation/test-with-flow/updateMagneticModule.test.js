// @flow
import cloneDeep from 'lodash/cloneDeep'
import {
  makeContext,
  getRobotStateAndWarningsStandard,
  createDraftStateFixture,
} from './fixtures'
import {
  forEngageMagnet,
  forDisengageMagnet,
} from '../getNextRobotStateAndWarnings/magnetUpdates'

const moduleId = 'magneticModuleId'
let invariantContext
let disengagedRobotStateAndWarnings
let engagedRobotStateAndWarnings

beforeEach(() => {
  invariantContext = makeContext()
  invariantContext.moduleEntities[moduleId] = {
    id: moduleId,
    type: 'magdeck',
    model: 'GEN1',
  }
  disengagedRobotStateAndWarnings = getRobotStateAndWarningsStandard(
    invariantContext
  )
  disengagedRobotStateAndWarnings.robotState.modules[moduleId] = {
    slot: '4',
    moduleState: { type: 'magdeck', engaged: false },
  }
  engagedRobotStateAndWarnings = cloneDeep(disengagedRobotStateAndWarnings)
  engagedRobotStateAndWarnings.robotState.modules[moduleId].moduleState = {
    type: 'magdeck',
    engaged: true,
  }
})

describe('forEngageMagnet', () => {
  test('engages magnetic module when it was unengaged', () => {
    const params = { module: moduleId, engageHeight: 10 }

    const result = createDraftStateFixture(
      disengagedRobotStateAndWarnings,
      params,
      invariantContext,
      forEngageMagnet
    )

    expect(result).toEqual(engagedRobotStateAndWarnings)
  })

  test('no effect on magnetic module "engaged" state when already engaged', () => {
    const params = { module: moduleId, engageHeight: 11 }

    const result = createDraftStateFixture(
      engagedRobotStateAndWarnings,
      params,
      invariantContext,
      forEngageMagnet
    )

    expect(result).toEqual(engagedRobotStateAndWarnings)
  })
})

describe('forDisengageMagnet', () => {
  test('unengages magnetic module when it was engaged', () => {
    const params = { module: moduleId }

    const result = createDraftStateFixture(
      engagedRobotStateAndWarnings,
      params,
      invariantContext,
      forDisengageMagnet
    )

    expect(result).toEqual(disengagedRobotStateAndWarnings)
  })

  test('no effect on magnetic module "engaged" state when already disengaged', () => {
    const params = { module: moduleId }

    const result = createDraftStateFixture(
      disengagedRobotStateAndWarnings,
      params,
      invariantContext,
      forDisengageMagnet
    )

    expect(result).toEqual(disengagedRobotStateAndWarnings)
  })
})
