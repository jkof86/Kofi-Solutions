import { useState } from "react";
import classes from "../../../data/classes.json";
import { createCharacter } from "../../engine/characters/CharacterFactory";
import ClassCard from "./ClassCard";
import StatAllocator from "./StatAllocator";

export default function CharacterCreator({ onCreate }) {
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [allocatedStats, setAllocatedStats] = useState({});

  const handleCreate = () => {
    const character = createCharacter({
      name,
      classId: selectedClass,
      allocatedStats
    });
    onCreate(character);
  };

  return (
    <div className="character-creator">
      <h2>Create Your Survivor</h2>

      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <div className="class-select">
        {classes.map(c => (
          <ClassCard
            key={c.id}
            data={c}
            selected={selectedClass === c.id}
            onSelect={() => setSelectedClass(c.id)}
          />
        ))}
      </div>

      <StatAllocator onChange={setAllocatedStats} />

      <button disabled={!name || !selectedClass} onClick={handleCreate}>
        Begin Journey
      </button>
    </div>
  );
}
