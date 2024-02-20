import { AvailableMove } from "../Game";
import { SpaceData } from "./Space";
import Space from "./Space";
import { HazardData } from "./hazards/Hazard";

type DepthsProps = {
  spaces: Map<number, SpaceData>;
  hazards: Map<number, HazardData[]>;
  currentSpace: number;
  visitedSpaces: number[];
  availableMoves: AvailableMove[];
  onSelectMove: (selectedMove: AvailableMove) => void;
};

function Depths({
  spaces,
  hazards,
  currentSpace,
  visitedSpaces,
  availableMoves,
  onSelectMove,
}: DepthsProps) {
  return (
    <div style={{ float: "left" }}>
      {Array.from(spaces.values()).map((space, index) => {
        const hazardsForSpace = hazards.get(space.spaceNumber);
        return (
          <Space
            key={index}
            space={space}
            hazards={hazardsForSpace ? hazardsForSpace : []}
            isCurrentSpace={space.spaceNumber === currentSpace}
            isVisited={visitedSpaces.includes(space.spaceNumber)}
            availableMove={availableMoves.find(
              (availableMove) => availableMove.spaceNumber === space.spaceNumber
            )}
            onSelectMove={onSelectMove}
          />
        );
      })}
    </div>
  );
}

export default Depths;
