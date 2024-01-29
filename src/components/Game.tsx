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

const initialSpaces: Map<string, SpaceData> = new Map(
  [...Array(15)].map((value, index) => {
    const id: string = crypto.randomUUID();
    return [
      id,
      {
        id: id,
        name: index === 14 ? "Ocean Floor" : undefined,
        current: index === 0 ? true : false,
        visited: index === 0 ? true : false,
        hazards: [{ type: HazardType.GainDamage, cost: 1, used: false }],
      },
    ];
  })
);

const initialHazards: Map<string, HazardData[]> = new Map(
  Array.from(initialSpaces.values()).map((space: SpaceData) => [
    space.id,
    [{ type: HazardType.GainDamage, cost: 1, used: false }],
  ])
);

const Game: React.FC = (): ReactElement => {
  const [currentSpace, setCurrentSpace] = useState<number>(0);
  const [availableDice, setAvailableDice] = useState<number>(5);
  const [maxOxygen, setMaxOxygen] = useState<number>(13);
  const [oxygenUsed, setOxygenUsed] = useState<number>(0);
  const [maxStress, setMaxStress] = useState<number>(22);
  const [stressGained, setStressGained] = useState<number>(0);
  const [maxDamage, setMaxDamage] = useState<number>(8);
  const [damageGained, setDamageGained] = useState<number>(0);
  const [spaces, setSpaces] = useState<Map<string, SpaceData>>(initialSpaces);
  const [hazards, setHazards] =
    useState<Map<string, HazardData[]>>(initialHazards);
  const [dice, setDice] = useState<DieData[]>(rollAvailableDice(availableDice));

  const onUseDie = (usedDie: DieData) => {
    moveToNewSpace(usedDie);
    markDieUsed(usedDie);
  };

  const onRerollDice = () => {
    consumeOxygen(1);
    rerollDice();
  };

  const moveToNewSpace = (usedDie: DieData) => {
    const leavingSpace = currentSpace;
    const targetSpace = currentSpace + usedDie.value;
    setSpaces((currentSpaces) => {
      const lastSpace = currentSpaces.size - 1;
      const newSpaces = Array.from(currentSpaces.values()).map(
        (space, index) => {
          if (index < leavingSpace || index > targetSpace) {
            return space; // not in our movement range
          } else if (index === leavingSpace && index < lastSpace) {
            return { ...space, current: false, visited: true }; // only unset current space if there is a next space to move to
          } else if (
            index > leavingSpace &&
            index < targetSpace &&
            index !== lastSpace
          ) {
            return moveThroughSpace(space);
          } else if (index === targetSpace) {
            setCurrentSpace(targetSpace);
            return { ...space, current: true, visited: true };
          } else if (index === lastSpace) {
            setCurrentSpace(lastSpace);
            takeStress(targetSpace - lastSpace); // difference between last space and movement
            return { ...space, current: true, visited: true };
          }

          return space;
        }
      );
      return new Map(newSpaces.map((newSpace) => [newSpace.id, newSpace]));
    });
  };

  const moveThroughSpace = (space: SpaceData): SpaceData => {
    const hazardsForSpace = hazards.get(space.id);
    if (hazardsForSpace) {
      hazardsForSpace.forEach((hazard) => {
        experienceHazard(hazard);
      });
    }
    return space;
  };

  const experienceHazard = (hazard: HazardData): HazardData => {
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
  };

  const rerollDice = () => {
    setDice(rollAvailableDice(availableDice));
  };

  return (
    <>
      <Depths spaces={spaces} hazards={hazards} />
      <DicePool dice={dice} onUseDie={onUseDie} onRerollDice={onRerollDice} />
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

export default Game;
