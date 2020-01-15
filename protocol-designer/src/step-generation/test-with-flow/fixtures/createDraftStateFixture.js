// @flow
import produce from 'immer'
import type { RobotStateAndWarnings, InvariantContext } from '../../'
import type { Command } from '@opentrons/shared-data/protocol/flowTypes/schemaV4'

export function createDraftStateFixture(
  baseState: RobotStateAndWarnings,
  params: $PropertyType<Command, 'params'>,
  invariantContext: InvariantContext,
  commandFn: Function
): RobotStateAndWarnings {
  return produce(baseState, draft => {
    commandFn(params, invariantContext, draft)
  })
}
