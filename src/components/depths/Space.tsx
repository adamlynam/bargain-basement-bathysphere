import { ReactElement } from "react";
import Hazard, { HazardData } from "./hazards/Hazard";
import { AvailableMove } from "../Game";

type SpaceProps = {
  space: SpaceData;
  hazards: HazardData[];
  isVisited: boolean;
  isCurrentSpace: boolean;
  availableMove: AvailableMove | undefined;
  onSelectMove: (selectedMove: AvailableMove) => void;
};

const Space: React.FC<SpaceProps> = ({
  space,
  hazards,
  isVisited,
  isCurrentSpace,
  availableMove,
  onSelectMove,
}): ReactElement => {
  const { name } = space;
  return (
    <div
      onClick={() => {
        if (availableMove) {
          onSelectMove(availableMove);
        }
      }}
      style={{
        padding: "1em",
        border: availableMove ? "3px solid blue" : "1px solid black",
        backgroundColor: isCurrentSpace ? "pink" : isVisited ? "grey" : "white",
        cursor: availableMove ? "pointer" : "default",
      }}
    >
      <div>{name ? name : "\u00A0"}</div>
      {hazards.map((hazard, index) => (
        <Hazard key={index} data={hazard} />
      ))}
    </div>
  );
};

export default Space;

export type SpaceData = {
  spaceNumber: number;
  name?: string;
  linksToSpaces: number[];
};
