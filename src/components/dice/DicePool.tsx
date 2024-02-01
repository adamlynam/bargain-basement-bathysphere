import { ReactElement } from "react";
import Die, { DieData } from "./Die";

type DicePoolProps = {
  dice: DieData[];
  selectedDie: DieData | undefined;
  onSelectDie: (value: DieData) => void;
  onRerollDice: () => void;
};

const DicePool: React.FC<DicePoolProps> = ({
  dice,
  selectedDie,
  onSelectDie,
  onRerollDice,
}): ReactElement => {
  return (
    <div style={{ float: "right" }}>
      <button onClick={onRerollDice}>Reroll dice</button>
      {dice.map((die, index) => (
        <Die
          key={index}
          data={die}
          isSelected={die === selectedDie}
          onSelectDie={onSelectDie}
        ></Die>
      ))}
    </div>
  );
};

export default DicePool;
