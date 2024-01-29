import { ReactElement } from "react";
import Hazard, { HazardData } from "./hazards/Hazard";

type SpaceProps = {
  space: SpaceData;
  hazards: HazardData[];
};

const Space: React.FC<SpaceProps> = ({ space, hazards }): ReactElement => {
  const { name, current, visited } = space;
  return (
    <div
      style={{
        padding: "1em",
        border: "1px solid",
        backgroundColor: current ? "pink" : visited ? "grey" : "white",
      }}
    >
      <div>{name ? name : "\u00A0"}</div>
      {hazards.map((hazard) => (
        <Hazard data={hazard} />
      ))}
    </div>
  );
};

export default Space;

export type SpaceData = {
  id: string;
  name?: string;
  current: boolean;
  visited: boolean;
};
