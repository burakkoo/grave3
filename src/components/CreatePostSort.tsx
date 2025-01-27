import React, { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { GetVisualMedia } from '@/types/definitions';
import { CreatePostSortItem } from './CreatePostSortItem';

const measuringConfig = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

export function CreatePostSort({
  visualMedia,
  setVisualMedia,
}: {
  visualMedia: GetVisualMedia[];
  setVisualMedia: React.Dispatch<React.SetStateAction<GetVisualMedia[]>>;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // The `url` of <GetVisualMedia> will serve as the ID's of the <SortableContext>.
  const itemIds = useMemo(() => visualMedia.map((item) => item.url), [visualMedia]);

  return (
    <div className="mx-auto max-w-2xl w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
        measuring={measuringConfig}>
        <div className="grid grid-cols-2 gap-2 border-t border-t-border p-2">
          <SortableContext items={itemIds} strategy={rectSortingStrategy}>
            {visualMedia.map((item) => (
              <CreatePostSortItem
                key={item.url}
                url={item.url}
                type={item.type}
                caption={item.caption} // Include the caption property here
                onRemove={handleRemove}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setVisualMedia((items) => {
        // Find the index by matching the id of the Sortable against the `url` of GetVisualMedia.
        const oldIndex = items.findIndex((item) => item.url === active.id);
        const newIndex = items.findIndex((item) => item.url === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleRemove(id: string) {
    // Release the object URL when removed
    if (id.startsWith('blob:')) URL.revokeObjectURL(id);

    setVisualMedia((items) => items.filter((item) => item.url !== id));
  }
}
