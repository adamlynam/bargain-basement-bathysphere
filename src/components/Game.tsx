import { ReactElement, useState } from "react";
import Depths from "./depths/Depths";
import { SpaceData } from "./depths/Space";
import DicePool from "./dice/DicePool";
import { DieData, rollD6 } from "./dice/Die";
import OxygenGauge from "./oxygen/OxygenGauge";
import StressGauge from "./stress/StressGauge";
import DamageGauge from "./damage/DamageGauge";
import { HazardType } from "./depths/hazards/HazardType";
import { HazardData } from "./depths/hazards/Hazard";

import leveldata from "../levels/leveldata.json";

const initialSpaces: Map<number, SpaceData> = new Map(
  leveldata.levels[1].spaces.map((value) => {
    return [
      value.spaceNumber,
      {
        spaceNumber: value.spaceNumber,
        name: value.name ? value.name : undefined,
        visited: value.spaceNumber === 1 ? true : false,
        linksToSpaces: value.linksToSpaceNumbers,
      },
    ];
  })
);

const initialHazards: Map<number, HazardData[]> = new Map(
  leveldata.levels[1].spaces.map((space) => [
    space.spaceNumber,
    space.hazards.map((hazard) => ({
      spaceNumber: space.spaceNumber,
      type: HazardType.GainDamage,
      cost: hazard.cost,
      used: false,
    })),
  ])
);

const Game: React.FC = (): ReactElement => {
  const [currentSpace, setCurrentSpace] = useState<number>(1);
  const [availableDice] = useState<number>(5);
  const [maxOxygen] = useState<number>(13);
  const [oxygenUsed, setOxygenUsed] = useState<number>(0);
  const [maxStress] = useState<number>(22);
  const [stressGained, setStressGained] = useState<number>(0);
  const [maxDamage] = useState<number>(8);
  const [damageGained, setDamageGained] = useState<number>(0);
  const [spaces] = useState<Map<number, SpaceData>>(initialSpaces);
  const [hazards, setHazards] =
    useState<Map<number, HazardData[]>>(initialHazards);
  const [dice, setDice] = useState<DieData[]>(rollAvailableDice(availableDice));
  const [selectedDie, setSelectedDie] = useState<DieData | undefined>(
    undefined
  );

  const onSelectDie = (usedDie: DieData) => {
    setSelectedDie(usedDie);
  };

  const onSelectMove = (selectedMove: AvailableMove) => {
    if (selectedDie != undefined) {
      moveToNewSpace(selectedMove);
      markDieUsed(selectedDie);
    }
  };

  const onRerollDice = () => {
    consumeOxygen(1);
    rerollDice();
  };

  const moveToNewSpace = (selectedMove: AvailableMove) => {
    setCurrentSpace(selectedMove.spaceNumber);
    clearHazardsAtNewSpace(selectedMove);
    experienceHazardsFromMove(selectedMove);

    // setSpaces((currentSpaces) => {
    //   const lastSpace = currentSpaces.size - 1;
    //   const newSpaces = Array.from(currentSpaces.values()).map(
    //     (space, index) => {
    //       if (index < leavingSpace || index > targetSpace) {
    //         return space; // not in our movement range
    //       } else if (index === leavingSpace && index < lastSpace) {
    //         return { ...space, current: false, visited: true }; // only unset current space if there is a next space to move to
    //       } else if (
    //         index > leavingSpace &&
    //         index < targetSpace &&
    //         index !== lastSpace
    //       ) {
    //         return moveThroughSpace(space);
    //       } else if (index === targetSpace) {
    //         setCurrentSpace(targetSpace);
    //         return { ...space, current: true, visited: true };
    //       } else if (index === lastSpace) {
    //         setCurrentSpace(lastSpace);
    //         takeStress(targetSpace - lastSpace); // difference between last space and movement
    //         return { ...space, current: true, visited: true };
    //       }

    //       return space;
    //     }
    //   );
    //   return new Map(
    //     newSpaces.map((newSpace) => [newSpace.spaceNumber, newSpace])
    //   );
    // });
  };

  const clearHazardsAtNewSpace = (selectedMove: AvailableMove) => {
    setHazards((existingHazards) => {
      return markAllHazardsAtSpaceUsed(
        selectedMove.spaceNumber,
        existingHazards
      );
    });
  };

  const markAllHazardsAtSpaceUsed = (
    spaceToMarkUsed: number,
    hazards: Map<number, HazardData[]>
  ) =>
    updateHazardsAtSpace(
      spaceToMarkUsed,
      hazards,
      (hazards.get(spaceToMarkUsed) || []).map((hazard) => ({
        ...hazard,
        used: true,
      }))
    );

  const updateHazardsAtSpace = (
    spaceToUpdateHazardsFor: number,
    hazards: Map<number, HazardData[]>,
    newHazards: HazardData[]
  ) =>
    new Map(
      Array.from(hazards.keys()).map((spaceNumber) => [
        spaceNumber,
        spaceToUpdateHazardsFor === spaceNumber
          ? newHazards
          : hazards.get(spaceNumber) || [],
      ])
    );

  const experienceHazardsFromMove = (selectedMove: AvailableMove) => {
    selectedMove.hazardSpaces.forEach((hazardsInSpace) => {
      if (hazardsInSpace.length > 0) {
        experienceHazardsForSpace(
          hazardsInSpace[0].spaceNumber,
          hazardsInSpace
        );
      }
    });
  };

  const experienceHazardsForSpace = (
    spaceNumberWithHazards: number | undefined,
    hazards: HazardData[]
  ) => {
    const experiencedHazards = hazards.map((hazard) =>
      experienceHazard(hazard)
    );

    console.log(spaceNumberWithHazards);
    // if this is a permanent set of hazards, update the hazard state with the used hazards
    if (spaceNumberWithHazards != undefined) {
      setHazards((existingHazards) => {
        return updateHazardsAtSpace(
          spaceNumberWithHazards,
          existingHazards,
          experiencedHazards
        );
      });
    }
  };

  const experienceHazard = (hazard: HazardData): HazardData => {
    if (hazard.used) {
      return hazard; // return the hazard without any effect if it has already been used
    }

    switch (hazard.type) {
      case HazardType.LoseOxygen:
        consumeOxygen(hazard.cost);
        return { ...hazard, used: true };
      case HazardType.GainDamage:
        takeDamage(hazard.cost);
        return { ...hazard, used: true };
      case HazardType.GainStress:
        takeStress(hazard.cost);
        return { ...hazard, used: true };
    }
  };

  const consumeOxygen = (oxygenToConsume: number) => {
    setOxygenUsed((currentOxygenUsed) => currentOxygenUsed + oxygenToConsume);
  };

  const takeStress = (stressToTake: number) => {
    setStressGained((currentStress) => currentStress + stressToTake);
  };

  const takeDamage = (damageToTake: number) => {
    setDamageGained((currentDamage) => currentDamage + damageToTake);
  };

  const markDieUsed = (usedDie: DieData) => {
    setDice(
      dice.map((die) => {
        if (die === usedDie) {
          return { ...die, used: true };
        }
        return die;
      })
    );
    setSelectedDie(undefined);
  };

  const rerollDice = () => {
    setDice(rollAvailableDice(availableDice));
    setSelectedDie(undefined);
  };

  return (
    <>
      <Depths
        spaces={spaces}
        hazards={hazards}
        currentSpace={currentSpace}
        availableMoves={calculateAvailableMoves(
          currentSpace,
          selectedDie,
          spaces,
          hazards
        )}
        onSelectMove={onSelectMove}
      />
      <DicePool
        dice={dice}
        selectedDie={selectedDie}
        onSelectDie={onSelectDie}
        onRerollDice={onRerollDice}
      />
      <OxygenGauge maxOxygen={maxOxygen} oxygenUsed={oxygenUsed} />
      <StressGauge maxStress={maxStress} stressGained={stressGained} />
      <DamageGauge maxDamage={maxDamage} damageGained={damageGained} />
    </>
  );
};

const rollAvailableDice = (availableDice: number): DieData[] => {
  return [...Array(availableDice)].map(() => {
    return {
      value: rollD6(),
      used: false,
    };
  });
};

const calculateAvailableMoves = (
  currentSpace: number,
  selectedDie: DieData | undefined,
  spaces: Map<number, SpaceData>,
  hazards: Map<number, HazardData[]>
): AvailableMove[] => {
  if (selectedDie === undefined) {
    return [];
  }

  return calculateMovesFromSpace(
    currentSpace,
    selectedDie.value,
    spaces,
    hazards,
    [], // no spaces visited yet
    [] // no hazards encountered yet
  );
};

const calculateMovesFromSpace = (
  currentSpace: number,
  movementRemaining: number,
  spaces: Map<number, SpaceData>,
  hazards: Map<number, HazardData[]>,
  vistedSpaces: number[],
  hazardsEncountered: HazardData[][]
): AvailableMove[] => {
  if (movementRemaining === 0) {
    return [{ spaceNumber: currentSpace, hazardSpaces: hazardsEncountered }];
  }

  const consideringSpace = spaces.get(currentSpace);
  if (consideringSpace === undefined) {
    return []; // the current space cannot be found, so we cannot return any moves
  }

  const availableSpaces = consideringSpace.linksToSpaces.filter(
    (linkedSpace) => !vistedSpaces.includes(linkedSpace)
  );

  if (availableSpaces.length < 1) {
    const stressFromMovingTooFar: HazardData = {
      spaceNumber: undefined,
      type: HazardType.GainStress,
      cost: movementRemaining,
      used: false,
    };
    return [
      {
        spaceNumber: currentSpace,
        hazardSpaces: [...hazardsEncountered, [stressFromMovingTooFar]],
      },
    ];
  }

  const hazardsInCurrentSpace = hazards.get(currentSpace) || [];

  return availableSpaces.flatMap((availableSpace) =>
    calculateMovesFromSpace(
      availableSpace,
      movementRemaining - 1,
      spaces,
      hazards,
      [...vistedSpaces, currentSpace],
      [...hazardsEncountered, hazardsInCurrentSpace]
    )
  );
};

export default Game;

export type AvailableMove = {
  spaceNumber: number;
  hazardSpaces: HazardData[][];
};
