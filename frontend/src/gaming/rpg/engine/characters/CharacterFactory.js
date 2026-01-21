// Creates characters from templates
import CharacterClass from "./CharacterClass";
import classes from "../../data/classes.json";

export const createCharacter = ({ name, classId }) => {
  const classData = classes.find(c => c.id === classId);
  const charClass = new CharacterClass(classData);

  return {
    id: crypto.randomUUID(),
    name,
    class: charClass,
    level: 1,
    stats: charClass.getStatsAtLevel(1),
    inventory: [],
    flags: {}
  };
};
