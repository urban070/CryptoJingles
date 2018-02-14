export const playWithDelay = (group, settings, samplesPos) => {
    let delays = settings.slice(5, 11);
    let startCuts = settings.slice(10, 16);
    let endCuts = settings.slice(15, 21);

    if (!samplesPos) {
        samplesPos = [
            { lastDroppedItem: true },
            { lastDroppedItem: true },
            { lastDroppedItem: true },
            { lastDroppedItem: true },
            { lastDroppedItem: true },
        ];
    }

    delays = delays.map(d => parseInt(d) / 10);
    startCuts = startCuts.map(d => parseInt(d) / 10);
    endCuts = endCuts.map(d => parseInt(d) / 10);

    let longest = 0;

    let soundIndex = 0;
    let longestSound = null;

    for(let i = 0; i < 5; ++i) {
        if (samplesPos[i].lastDroppedItem) {
            const sound = group.sounds[soundIndex];

            sound.play(delays[i], startCuts[i]);

            const length = sound.getRawSourceNode().buffer.duration;

            let whenToStop = length + delays[i];

            if (startCuts[i] !== 0) {
                whenToStop = (endCuts[i] - startCuts[i]) + delays[i];
            } else if (endCuts[i] !== 0) {
                whenToStop = ((length) - (length - endCuts[i])) + delays[i];
            }

            if (whenToStop > longest) {
                longest = whenToStop;
                longestSound = sound;
            }
            
            setTimeout(() => {
                sound.stop();
            }, whenToStop * 1000);

            soundIndex++;
        }
    }

    return longestSound;
  }

  export const createSettings = (props) => {
    let { volumes, delays, cuts } = props;

    delays = delays.map(d => d * 10);
    cuts = cuts.map(c => c * 10);

    return [...volumes, ...delays, ...cuts];
  }