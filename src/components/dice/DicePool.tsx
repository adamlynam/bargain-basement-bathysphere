import { ReactElement } from "react";
import Die, { DieData } from "./Die";

type DicePoolProps = {
  dice: DieData[];
  onUseDie: (value: DieData) => void;
  onRerollDice: () => void;
};

const DicePool: React.FC<DicePoolProps> = ({
  dice,
  onUseDie,
  onRerollDice,
}): ReactElement => {
  return (
    <div style={{ float: "right" }}>
      <button onClick={onRerollDice}>Reroll dice</button>
      {dice.map((die, index) => (
        <Die key={index} data={die} onUseDie={onUseDie}></Die>
      ))}
    </div>
  );
};

export default DicePool;
