import { ReactElement } from "react";

type OxygenProps = {
  oxygenUsed: boolean;
};

const Oxygen: React.FC<OxygenProps> = ({ oxygenUsed }): ReactElement => {
  return (
    <div
      style={{
        float: "left",
        padding: "1em",
        border: "1px solid",
        backgroundColor: oxygenUsed ? "grey" : "",
      }}
    >
      O2
    </div>
  );
};

export default Oxygen;
