import { ReactElement } from "react";

type StressProps = {
  stressGained: boolean;
};

const Stress: React.FC<StressProps> = ({ stressGained }): ReactElement => {
  return (
    <div
      style={{
        float: "left",
        padding: "1em",
        border: "1px solid",
        backgroundColor: stressGained ? "grey" : "",
      }}
    >
      Bolt
    </div>
  );
};

export default Stress;
