import { historyItem, moveFuncType } from './models';

const MIN_CUT_BEETWEEN_DUPE_DISTANCE = 5;

export class PuzzleSolver {
  async solve(history: historyItem[], moveFunc: moveFuncType): Promise<void> {
    document.body.style.pointerEvents = 'none';

    const filteredSteps = this.cutBetweenDupeStates(history);
    const reverseSteps = filteredSteps.reverse();
    const croppedSteps = this.removeReverseDirections(reverseSteps);

    // eslint-disable-next-line no-restricted-syntax
    for (const step of croppedSteps as historyItem[]) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(
          document.getAnimations()
            .map((animation) => animation.finished),
        );
      } catch (err) {
        // animation promise rejected
      } finally {
        let direction = '';
        switch (step.direction) {
          case '>':
            direction = '<';
            break;
          case '<':
            direction = '>';
            break;
          case 'v':
            direction = '^';
            break;
          case '^':
            direction = 'v';
            break;
          default:
            break;
        }
        moveFunc(null, direction);
      }
    }

    document.body.style.pointerEvents = 'initial';
  }

  cutBetweenDupeStates = (steps: historyItem[]): historyItem[] => {
    const stepStore: string[] = [];
    const dupePairs: number[][] = [];
    steps.forEach((step, index) => {
      const stepIndex = stepStore.indexOf(step.imprint);
      if (stepIndex !== -1 && (stepStore.length - stepIndex) > MIN_CUT_BEETWEEN_DUPE_DISTANCE) {
        stepStore.push('dupe');
        dupePairs.push([stepIndex, index]);
      } else {
        stepStore.push(step.imprint);
      }
    });
    if (dupePairs.length > 0) {
      const itemsToCut = dupePairs.reduce((longest, current) => {
        if (longest[1] - longest[0] > current[1] - current[0]) {
          return longest;
        }
        return current;
      });
      if (itemsToCut.length > 0) {
        const result = [...steps.slice(0, itemsToCut[0] + 1), ...steps.slice(itemsToCut[1] + 1)];
        return this.cutBetweenDupeStates(result);
      }
    }
    return steps;
  };

  removeReverseDirections = (arraySteps: historyItem[]): historyItem[] => {
    const copyArraySteps = [...arraySteps];
    copyArraySteps.forEach((step, index, array) => {
      let remove = false;
      if (index === array.length - 1) return;
      if (step.direction === '>' && array[index + 1].direction === '<') remove = true;
      if (step.direction === '<' && array[index + 1].direction === '>') remove = true;
      if (step.direction === 'v' && array[index + 1].direction === '^') remove = true;
      if (step.direction === '^' && array[index + 1].direction === 'v') remove = true;
      if (remove === true) {
        copyArraySteps[index].direction = '';
        copyArraySteps[index + 1].direction = '';
      }
    });
    if (copyArraySteps.find((item) => item.direction === '')) {
      return this.removeReverseDirections(copyArraySteps.filter((step) => step.direction !== ''));
    }
    return copyArraySteps;
  };
}
