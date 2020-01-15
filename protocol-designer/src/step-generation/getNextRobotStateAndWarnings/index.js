// @flow
import assert from 'assert'
import produce from 'immer'
import { forAspirate } from './forAspirate'
import { forDispense } from './forDispense'
import { forBlowout } from './forBlowout'
import { forDropTip } from './forDropTip'
import { forPickUpTip } from './forPickUpTip'
import { forEngageMagnet, forDisengageMagnet } from './magnetUpdates'
import type { Command } from '@opentrons/shared-data/protocol/flowTypes/schemaV4'
import type {
  InvariantContext,
  RobotState,
  RobotStateAndWarnings,
} from '../types'

// WARNING this will mutate the prevRobotState
function _getNextRobotStateAndWarningsSingleCommand(
  command: Command,
  invariantContext: InvariantContext,
  robotStateAndWarnings: RobotStateAndWarnings
): void {
  assert(command, 'undefined command passed to getNextRobotStateAndWarning')

  switch (command.command) {
    case 'aspirate':
      forAspirate(command.params, invariantContext, robotStateAndWarnings)
      break
    case 'dispense':
      forDispense(command.params, invariantContext, robotStateAndWarnings)
      break
    case 'blowout':
      forBlowout(command.params, invariantContext, robotStateAndWarnings)
      break
    case 'dropTip':
      forDropTip(command.params, invariantContext, robotStateAndWarnings)
      break
    case 'pickUpTip':
      forPickUpTip(command.params, invariantContext, robotStateAndWarnings)
      break
    case 'airGap':
      // TODO: IL 2019-11-19 implement air gap (eventually)
      break
    case 'magneticModule/engageMagnet':
      forEngageMagnet(command.params, invariantContext, robotStateAndWarnings)
      break
    case 'magneticModule/disengageMagnet':
      forDisengageMagnet(
        command.params,
        invariantContext,
        robotStateAndWarnings
      )
      break
    case 'touchTip':
    case 'delay':
      // these commands don't have any effects on the state
      break
    default:
      assert(
        false,
        `unknown command: ${command.command} passed to getNextRobotStateAndWarning`
      )
  }
}

export function getNextRobotStateAndWarningsSingleCommand(
  command: Command,
  invariantContext: InvariantContext,
  prevRobotState: RobotState
): RobotStateAndWarnings {
  const prevState = {
    warnings: [],
    robotState: prevRobotState,
  }
  return produce(prevState, draft => {
    _getNextRobotStateAndWarningsSingleCommand(command, invariantContext, draft)
  })
}

// Get next state after multiple commands
export function getNextRobotStateAndWarnings(
  commands: Array<Command>,
  invariantContext: InvariantContext,
  initialRobotState: RobotState
): RobotStateAndWarnings {
  const prevState = {
    warnings: [],
    robotState: initialRobotState,
  }
  return produce(prevState, draft => {
    commands.forEach(command => {
      _getNextRobotStateAndWarningsSingleCommand(
        command,
        invariantContext,
        draft
      )
    })
  })
}
