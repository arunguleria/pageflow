import React from 'react';

import {
  AudioPlayer,
  AudioPlayerControls,
  Figure,
  usePlayerState,
  useContentElementLifecycle
} from 'pageflow-scrolled/frontend';

export function InlineAudio({sectionProps, configuration}) {
  const [playerState, playerActions] = usePlayerState();

  const {isPrepared} = useContentElementLifecycle({
    onActivate() {
      if (configuration.autoplay) {
        playerActions.play();
      }
    },

    onDeactivate() {
      playerActions.pause();
    }
  });

  return (
    <Figure caption={configuration.caption}>
      <AudioPlayer isPrepared={isPrepared}
                   position={configuration.position}
                   controls={configuration.controls}
                   playerState={playerState}
                   playerActions={playerActions}
                   id={configuration.id}
                   posterId={configuration.posterId}
                   defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                   quality={'high'}
                   playsInline={true} />

      <AudioPlayerControls audioFilePermaId={configuration.id}
                           defaultTextTrackFilePermaId={configuration.defaultTextTrackFileId}
                           playerState={playerState}
                           playerActions={playerActions}
                           configuration={configuration}
                           sectionProps={sectionProps}/>
    </Figure>
  )
}
