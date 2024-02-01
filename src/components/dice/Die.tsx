import { ReactElement } from "react";

type DieProps = {
  data: DieData;
  isSelected: boolean;
  onSelectDie: (die: DieData) => void;
};

const Die: React.FC<DieProps> = ({
  data,
  isSelected,
  onSelectDie,
}): ReactElement => {
  const { value, used } = data;
  const onClickDie = () => {
    onSelectDie(data);
  };

  return (
    <div
      style={{
        width: "2em",
        // height: "2em",
        border: "1px solid",
        borderColor: isSelected ? "blue" : "black",
        textAlign: "center",
      }}
    >
      <button
        onClick={onClickDie}
        disabled={used}
        style={{
          color: isSelected ? "blue" : used ? "grey" : "black",
        }}
      >
        {[...Array(value)].map((_dot, index) => (
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
