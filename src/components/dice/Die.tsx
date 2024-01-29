import { ReactElement } from "react";

type DieProps = {
  data: DieData;
  onUseDie: (die: DieData) => void;
};

const Die: React.FC<DieProps> = ({ data, onUseDie }): ReactElement => {
  const { value, used } = data;
  const onClickDie = () => {
    onUseDie(data);
  };

  return (
    <div
      style={{
        width: "2em",
        // height: "2em",
        border: "1px solid",
        textAlign: "center",
      }}
    >
      <button onClick={onClickDie} disabled={used}>
        {[...Array(value)].map((value, index) => (
          <div key={index}>•</div>
        ))}
        [{value}]
      </button>
    </div>
  );
};

export default Die;

export type DieData = {
  value: number;
  used: boolean;
};

export const rollD6 = () => {
  return rollDie(6);
};

export const rollDie = (sides: number) => {
  return Math.floor(Math.random() * sides) + 1;
};
