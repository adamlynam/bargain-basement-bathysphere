import { SpaceData } from "./Space";
import Space from "./Space";
import { HazardData } from "./hazards/Hazard";

type DepthsProps = {
  spaces: Map<string, SpaceData>;
  hazards: Map<string, HazardData[]>;
};

function Depths({ spaces, hazards }: DepthsProps) {
  return (
    <div style={{ float: "left" }}>
      {Array.from(spaces.values()).map((space, index) => {
        const hazardsForSpace = hazards.get(space.id);
        return (
          <Space
            key={index}
            space={space}
            hazards={hazardsForSpace ? hazardsForSpace : []}
          />
        );
      })}
    </div>
  );
}

export default Depths;
