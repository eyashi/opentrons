// @flow
import * as React from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { RobotCoordsForeignDiv } from '@opentrons/components'
import i18n from '../../localization'
import { timelineFrameBeforeActiveItem } from '../../top-selectors/timelineFrames'
import { selectors as stepFormSelectors } from '../../step-forms'
import { MAGDECK, STD_SLOT_X_DIM, STD_SLOT_Y_DIM } from '../../constants'
import { getModuleVizDims } from './getModuleVizDims'
import styles from './ModuleTag.css'
import type { ModuleOrientation } from '../../types'
import type { ModuleTemporalProperties } from '../../step-forms'

type Props = {|
  x: number,
  y: number,
  orientation: ModuleOrientation,
  id: string,
|}

// eyeballed width/height to match designs
const TAG_HEIGHT = 45
const TAG_WIDTH = 60

const ModuleStatus = ({
  moduleState,
}: {|
  moduleState: $PropertyType<ModuleTemporalProperties, 'moduleState'>,
|}) => {
  switch (moduleState.type) {
    case MAGDECK:
      return (
        <div className={styles.module_status_line}>
          {i18n.t(
            `modules.status.${moduleState.engaged ? 'engaged' : 'disengaged'}`
          )}
        </div>
      )

    default:
      console.warn(
        `ModuleStatus doesn't support module type ${moduleState.type}`
      )
      return null
  }
}

const ModuleTag = (props: Props) => {
  const timelineFrame = useSelector(timelineFrameBeforeActiveItem)
  const moduleEntity = useSelector(stepFormSelectors.getModuleEntities)[
    props.id
  ]
  const moduleState: ?* =
    timelineFrame.robotState.modules[props.id]?.moduleState
  const moduleType: ?* = moduleEntity?.type

  if (moduleType == null || moduleState == null) {
    // this should never happen, but better to have an empty tag than to whitescreen
    console.error(
      `nullsy moduleType or moduleState for module "${props.id}" in the selected timeline frame`
    )
    return null
  }

  const { childXOffset, childYOffset } = getModuleVizDims(
    props.orientation,
    moduleType
  )
  return (
    <RobotCoordsForeignDiv
      x={
        props.x +
        (props.orientation === 'left'
          ? childXOffset - TAG_WIDTH
          : STD_SLOT_X_DIM + childXOffset)
      }
      y={props.y + childYOffset + (STD_SLOT_Y_DIM - TAG_HEIGHT) / 2}
      height={TAG_HEIGHT}
      width={TAG_WIDTH}
      innerDivProps={{
        className: styles.module_info_tag,
      }}
    >
      <div className={cx(styles.module_info_type, styles.module_info_line)}>
        {i18n.t(`modules.module_display_names.${moduleType}`)}
      </div>
      <div className={styles.module_info_line}>
        <ModuleStatus moduleState={moduleState} />
      </div>
    </RobotCoordsForeignDiv>
  )
}

export default React.memo<Props>(ModuleTag)
